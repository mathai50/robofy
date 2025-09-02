"""
Security middleware for adding security headers and enforcing HTTPS.
"""
from fastapi import Request
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from config import settings

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add security headers to all responses."""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        
        # Remove server header for security
        if "server" in response.headers:
            del response.headers["server"]
            
        return response

def add_security_middleware(app):
    """Add security middleware to the FastAPI application."""
    
    # Add HTTPS redirect in production
    if settings.ENVIRONMENT == "production":
        app.add_middleware(HTTPSRedirectMiddleware)
    
    # Add security headers middleware
    app.add_middleware(SecurityHeadersMiddleware)