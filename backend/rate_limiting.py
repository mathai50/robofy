"""
Rate limiting middleware for FastAPI to prevent abuse.
Supports rate limiting by IP address and API key.
Includes usage tracking for analytics and abuse detection.
"""
from fastapi import Request, HTTPException, status
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging
from typing import Optional, Callable, Awaitable, Dict, Any
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import time

from database import get_db, RateLimit, UsageTracking, APIAccessRequest
from security import validate_ip_address, sanitize_input, is_valid_domain
from auth import get_current_user_from_token
from redis_client import redis_client

logger = logging.getLogger(__name__)

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware for rate limiting and usage tracking"""
    
    def __init__(
        self,
        app,
        requests_per_minute: int = 60,
        requests_per_hour: int = 1000,
        seo_requests_per_day: int = 50
    ):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        self.seo_requests_per_day = seo_requests_per_day
        self.rate_limiting_service = RateLimitingService({
            "requests_per_minute": requests_per_minute,
            "requests_per_hour": requests_per_hour,
            "seo_requests_per_day": seo_requests_per_day
        })
    
    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        # Get client IP address
        client_ip = request.client.host if request.client else "unknown"
        
        # Check for API key in headers
        api_key = request.headers.get("X-API-Key") or request.headers.get("Authorization", "").replace("Bearer ", "")
        
        # Get endpoint path
        endpoint = request.url.path
        
        # Skip rate limiting for health checks and certain endpoints
        if endpoint in ["/", "/api/health", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)
        
        # Validate IP address (skip rate limiting for invalid IPs)
        if client_ip != "unknown" and not validate_ip_address(client_ip):
            logger.warning(f"Invalid IP address detected: {client_ip}")
            from errors import bad_request_error
            raise bad_request_error("Invalid IP address", "INVALID_IP")
        
        # Get database session
        db: Session = next(get_db())
        
        # Initialize usage tracking variables
        start_time = time.time()
        response = None
        status_code = 500
        
        try:
            # Check rate limits
            identifier = api_key if api_key else client_ip
            identifier_type = "api_key" if api_key else "ip"
            
            # Different rate limits for SEO endpoints
            is_seo_endpoint = endpoint.startswith("/api/seo/")
            limit = self.seo_requests_per_day if is_seo_endpoint else self.requests_per_minute
            window_minutes = 1440 if is_seo_endpoint else 1  # 24 hours for SEO, 1 minute for others
            
            # Check if rate limit is exceeded
            if await self.rate_limiting_service.is_rate_limited(db, identifier, identifier_type, endpoint, limit, window_minutes):
                logger.warning(f"Rate limit exceeded for {identifier_type}: {identifier} on {endpoint}")
                from errors import too_many_requests_error
                raise too_many_requests_error("Rate limit exceeded. Please try again later.", "RATE_LIMIT_EXCEEDED")
            
            # Process the request
            response = await call_next(request)
            status_code = response.status_code
            
            return response
            
        except HTTPException as he:
            status_code = he.status_code
            raise
        except Exception as e:
            logger.error(f"Error in rate limiting middleware: {str(e)}")
            # If rate limiting fails, allow the request to proceed (fail-open)
            response = await call_next(request)
            if response:
                status_code = response.status_code
            return response
        finally:
            # Calculate response time
            response_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            # Track usage with actual response status code and time
            await self.rate_limiting_service.track_usage(db, request, client_ip, api_key, status_code, response_time)
            db.close()

def get_rate_limit_middleware() -> Middleware:
    """Get rate limiting middleware instance"""
    return Middleware(RateLimitMiddleware)

# Rate limit configurations
RATE_LIMIT_CONFIG = {
    "default": {
        "requests_per_minute": 60,
        "requests_per_hour": 1000
    },
    "seo_endpoints": {
        "requests_per_day": 50
    }
}

class RateLimitingService:
    """Service class for rate limiting operations."""
    
    def __init__(self, config: dict = None):
        self.config = config or {}
        self.requests_per_minute = self.config.get("requests_per_minute", 60)
        self.requests_per_hour = self.config.get("requests_per_hour", 1000)
        self.seo_requests_per_day = self.config.get("seo_requests_per_day", 50)
    
    async def is_rate_limited(
        self,
        db: Session,
        identifier: str,
        identifier_type: str,
        endpoint: str,
        limit: int,
        window_minutes: int
    ) -> bool:
        """Check if the identifier has exceeded the rate limit using Redis or database fallback."""
        window_seconds = window_minutes * 60
        
        # Create a unique key for Redis rate limiting
        redis_key = f"rate_limit:{identifier_type}:{identifier}:{endpoint}"
        
        # Try Redis first for distributed rate limiting
        if redis_client.is_available():
            try:
                rate_limit_info = redis_client.increment_rate_limit(
                    key=redis_key,
                    window_seconds=window_seconds,
                    limit=limit
                )
                
                # If Redis returns an error, fall back to database
                if "error" in rate_limit_info:
                    logger.warning(f"Redis rate limiting failed, falling back to database: {rate_limit_info['error']}")
                    return await self._is_rate_limited_db(db, identifier, identifier_type, endpoint, limit, window_minutes)
                
                # Check if rate limit is exceeded
                is_limited = rate_limit_info["count"] > limit
                
                if is_limited:
                    logger.warning(f"Rate limit exceeded for {identifier_type}: {identifier} on {endpoint}. "
                                  f"Count: {rate_limit_info['count']}, Limit: {limit}")
                
                return is_limited
                
            except Exception as e:
                logger.error(f"Redis rate limiting error, falling back to database: {str(e)}")
                return await self._is_rate_limited_db(db, identifier, identifier_type, endpoint, limit, window_minutes)
        else:
            # Redis not available, use database fallback
            logger.debug("Redis not available, using database for rate limiting")
            return await self._is_rate_limited_db(db, identifier, identifier_type, endpoint, limit, window_minutes)
    
    async def _is_rate_limited_db(
        self,
        db: Session,
        identifier: str,
        identifier_type: str,
        endpoint: str,
        limit: int,
        window_minutes: int
    ) -> bool:
        """Database fallback for rate limiting"""
        now = datetime.now()
        window_start = now - timedelta(minutes=window_minutes)
        
        # Find or create rate limit record
        rate_limit = db.query(RateLimit).filter(
            RateLimit.identifier == identifier,
            RateLimit.identifier_type == identifier_type,
            RateLimit.endpoint == endpoint
        ).first()
        
        if rate_limit:
            # Check if window has expired
            if rate_limit.window_end and rate_limit.window_end < now:
                # Reset counter for new window
                rate_limit.request_count = 1
                rate_limit.window_start = now
                rate_limit.window_end = now + timedelta(minutes=window_minutes)
            else:
                # Increment counter
                rate_limit.request_count += 1
            
            rate_limit.updated_at = now
        else:
            # Create new rate limit record
            rate_limit = RateLimit(
                identifier=identifier,
                identifier_type=identifier_type,
                endpoint=endpoint,
                request_count=1,
                window_start=now,
                window_end=now + timedelta(minutes=window_minutes)
            )
            db.add(rate_limit)
        
        db.commit()
        
        # Check if limit is exceeded
        return rate_limit.request_count > limit
    
    async def track_usage(
        self,
        db: Session,
        request: Request,
        ip_address: str,
        api_key: Optional[str] = None,
        status_code: int = 500,
        response_time: float = 0.0
    ):
        """Track API usage for analytics and abuse detection"""
        # Get user info from request if available
        user_id = None
        api_key_id = None
        
        # Try to extract user from JWT token if available
        try:
            # Check for Authorization header
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.replace("Bearer ", "")
                user = await get_current_user_from_token(token, db)
                if user:
                    user_id = user.id
        except Exception as e:
            # Silently fail user extraction - it's optional for tracking
            logger.debug(f"Could not extract user from token: {str(e)}")
        
        # Create usage tracking record
        usage = UsageTracking(
            user_id=user_id,
            api_key_id=api_key_id,
            ip_address=ip_address,
            endpoint=request.url.path,
            method=request.method,
            status_code=status_code,
            response_time=response_time,
            user_agent=sanitize_input(request.headers.get("User-Agent", "")),
            timestamp=datetime.now()
        )
        
        db.add(usage)
        db.commit()