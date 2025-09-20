"""
Dependency injection container for the Robofy backend application.
Uses dependency-injector to manage dependencies and improve testability.
"""
from dependency_injector import containers, providers
from sqlalchemy.orm import Session
from database import get_db, create_tables
from ai_service import AIServiceManager
from security import SecurityService
from auth import AuthService
from rate_limiting import RateLimitingService
from config import settings
import logging

logger = logging.getLogger(__name__)

class Container(containers.DeclarativeContainer):
    """Main dependency injection container for the application."""
    
    # Configuration
    config = providers.Configuration()
    
    # Database
    db_session = providers.Resource(
        get_db
    )
    
    # Core Services
    ai_service = providers.Singleton(
        AIServiceManager
    )
    
    security_service = providers.Singleton(
        SecurityService,
        config=config
    )
    
    auth_service = providers.Singleton(
        AuthService,
        config=config
    )
    
    rate_limiting_service = providers.Singleton(
        RateLimitingService,
        config=config
    )
    

# Create and configure the container instance
container = Container()
container.config.from_dict({
    "database_url": str(settings.DATABASE_URL),
    "jwt_secret_key": settings.JWT_SECRET_KEY,
    "jwt_algorithm": settings.JWT_ALGORITHM,
    "jwt_access_token_expire_minutes": settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES,
    "jwt_refresh_token_expire_days": settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS,
    "api_key_encryption_key": settings.API_KEY_ENCRYPTION_KEY,
    "redis_url": settings.REDIS_URL,
    "redis_rate_limit_db": settings.REDIS_RATE_LIMIT_DB,
    "redis_connection_timeout": settings.REDIS_CONNECTION_TIMEOUT,
    "redis_max_connections": settings.REDIS_MAX_CONNECTIONS,
    "ai_service_priority": settings.AI_SERVICE_PRIORITY,
    "ai_max_retries": settings.AI_MAX_RETRIES,
    "ai_timeout": settings.AI_TIMEOUT,
    "ai_fallback_enabled": settings.AI_FALLBACK_ENABLED,
    "circuit_breaker_failure_threshold": settings.CIRCUIT_BREAKER_FAILURE_THRESHOLD,
    "circuit_breaker_recovery_timeout": settings.CIRCUIT_BREAKER_RECOVERY_TIMEOUT,
    "circuit_breaker_half_open_max_attempts": settings.CIRCUIT_BREAKER_HALF_OPEN_MAX_ATTEMPTS,
    "circuit_breaker_reset_timeout": settings.CIRCUIT_BREAKER_RESET_TIMEOUT,
})

logger.info("Dependency injection container initialized and configured")