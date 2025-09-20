"""
Configuration settings loaded from environment variables.
Uses pydantic-settings for validation and type safety.
"""
from pydantic_settings import BaseSettings
from pydantic import Field, AnyUrl, field_validator, model_validator, ConfigDict
from typing import List, Optional
import secrets
import logging

# Set up logging
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    # Database Configuration
    DATABASE_URL: str = Field(
        default="postgresql://user:password@localhost:5432/robofy",
        description="Database connection URL (PostgreSQL for production, SQLite for development)"
    )
    
    # Supabase Configuration
    SUPABASE_URL: Optional[str] = Field(
        default=None,
        description="Supabase project URL"
    )
    SUPABASE_ANON_KEY: Optional[str] = Field(
        default=None,
        description="Supabase anonymous API key"
    )
    
    # Backend Configuration
    BACKEND_HOST: str = Field(
        default="0.0.0.0",
        description="Backend server host address"
    )
    BACKEND_PORT: int = Field(
        default=8000,
        description="Backend server port"
    )
    
    # Frontend Configuration
    PORT: int = Field(
        default=3000,
        description="Frontend server port"
    )
    PYTHON_BACKEND_URL: str = Field(
        default="http://localhost:8000",
        description="Python backend URL for frontend"
    )
    FRONTEND_URL: str = Field(
        default="http://localhost:3000",
        description="Frontend URL for CORS"
    )
    PRODUCTION_URL: str = Field(
        default="https://robofy.uk",
        description="Production frontend URL"
    )
    
    # Email Configuration
    MAILGUN_API_KEY: Optional[str] = Field(
        default=None,
        description="Mailgun API key for email services"
    )
    MAILGUN_DOMAIN: Optional[str] = Field(
        default=None,
        description="Mailgun domain for email services"
    )
    
    # JWT Configuration
    JWT_SECRET_KEY: str = Field(
        default_factory=lambda: secrets.token_urlsafe(32),
        description="Secret key for JWT token signing"
    )
    JWT_ALGORITHM: str = Field(
        default="HS256",
        description="Algorithm used for JWT token signing"
    )
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30,
        description="Access token expiration time in minutes"
    )
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7,
        description="Refresh token expiration time in days"
    )
    
    # Application Settings
    ENVIRONMENT: str = Field(
        default="development",
        description="Application environment (development, production, staging)"
    )
    DEBUG: bool = Field(
        default=True,
        description="Debug mode flag"
    )
    
    # Security Settings
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "https://robofy.uk"],
        description="Allowed CORS origins"
    )
    ALLOWED_HOSTS: List[str] = Field(
        default=["localhost", "robofy.uk"],
        description="Allowed hostnames for the application"
    )
    API_KEY_ENCRYPTION_KEY: str = Field(
        default_factory=lambda: secrets.token_urlsafe(32),
        description="Encryption key for API keys"
    )
    
    # AI Service Configuration
    # DeepSeek API Settings
    DEEPSEEK_API_KEY: Optional[str] = Field(
        default=None,
        description="DeepSeek API key for AI content generation"
    )
    DEEPSEEK_MODEL: str = Field(
        default="deepseek-chat",
        description="DeepSeek model to use for content generation"
    )
    DEEPSEEK_BASE_URL: str = Field(
        default="https://api.deepseek.com",
        description="DeepSeek API base URL"
    )
    
    # Google AI Settings
    GOOGLE_API_KEY: Optional[str] = Field(
        default=None,
        description="Google AI API key for Gemini models"
    )
    GOOGLE_MODEL: str = Field(
        default="gemini-1.5-flash",
        description="Google AI model to use for content generation"
    )
    
    # OpenAI API Settings (optional)
    OPENAI_API_KEY: Optional[str] = Field(
        default=None,
        description="OpenAI API key for GPT models"
    )
    OPENAI_MODEL: str = Field(
        default="gpt-3.5-turbo",
        description="OpenAI model to use for content generation"
    )
    
    # Hugging Face Settings (optional)
    HUGGINGFACE_API_KEY: Optional[str] = Field(
        default=None,
        description="Hugging Face API key for accessing models"
    )
    HUGGINGFACE_MODEL: str = Field(
        default="google/flan-t5-xxl",
        description="Hugging Face model to use for content generation"
    )

    # Anthropic API Settings (optional)
    ANTHROPIC_API_KEY: Optional[str] = Field(
        default=None,
        description="Anthropic API key for Claude models"
    )
    ANTHROPIC_MODEL: str = Field(
        default="claude-3-sonnet-20240229",
        description="Anthropic model to use for content generation"
    )
    
    # MCP Server Configuration (optional)
    MCP_OPENAI_URL: Optional[str] = Field(
        default=None,
        description="MCP server URL for OpenAI services"
    )
    MCP_HUGGINGFACE_URL: Optional[str] = Field(
        default=None,
        description="MCP server URL for Hugging Face services"
    )
    MCP_SEO_ANALYSIS_URL: Optional[str] = Field(
        default=None,
        description="MCP server URL for SEO analysis services"
    )
    
    # AI Service Fallback Settings
    AI_SERVICE_PRIORITY: List[str] = Field(
        default=["google", "deepseek", "openai", "huggingface"],
        description="Priority order for AI service fallback"
    )
    AI_MAX_RETRIES: int = Field(
        default=3,
        description="Maximum number of retries for AI service calls"
    )
    AI_TIMEOUT: int = Field(
        default=30,
        description="Timeout in seconds for AI service calls"
    )
    AI_FALLBACK_ENABLED: bool = Field(
        default=True,
        description="Whether to enable fallback to secondary AI services"
    )
    
    # Circuit Breaker Configuration
    CIRCUIT_BREAKER_FAILURE_THRESHOLD: int = Field(
        default=5,
        description="Number of failures before circuit breaker opens"
    )
    CIRCUIT_BREAKER_RECOVERY_TIMEOUT: int = Field(
        default=60,
        description="Time in seconds before circuit breaker moves from open to half-open state"
    )
    CIRCUIT_BREAKER_HALF_OPEN_MAX_ATTEMPTS: int = Field(
        default=3,
        description="Maximum number of attempts in half-open state before circuit breaker reopens"
    )
    CIRCUIT_BREAKER_RESET_TIMEOUT: int = Field(
        default=300,
        description="Time in seconds after which circuit breaker resets to closed state on success"
    )
    
    # Google Calendar Configuration
    GOOGLE_SERVICE_ACCOUNT_FILE: Optional[str] = Field(
        default=None,
        description="Path to Google Service Account JSON file for calendar access"
    )
    GOOGLE_CALENDAR_ID: str = Field(
        default="primary",
        description="Google Calendar ID to use for appointments"
    )

    # SEO Analysis API Configuration
    SERPAPI_API_KEY: Optional[str] = Field(
        default=None,
        description="SerpAPI key for SEO analysis and search results"
    )

    # Speech-to-Text Configuration
    ASSEMBLYAI_API_KEY: Optional[str] = Field(
        default=None,
        description="AssemblyAI API key for speech-to-text transcription"
    )

    # Twilio Configuration for Voice and SMS
    TWILIO_ACCOUNT_SID: Optional[str] = Field(
        default=None,
        description="Twilio Account SID for voice and SMS services"
    )
    TWILIO_AUTH_TOKEN: Optional[str] = Field(
        default=None,
        description="Twilio Auth Token for voice and SMS services"
    )
    TWILIO_PHONE_NUMBER: Optional[str] = Field(
        default=None,
        description="Twilio phone number for sending SMS/making calls"
    )
    
    # Twilio WhatsApp Configuration
    TWILIO_WHATSAPP_NUMBER: Optional[str] = Field(
        default=None,
        description="Twilio WhatsApp number for sending WhatsApp messages"
    )
    
    # Fallback Communication Preferences
    TWILIO_FALLBACK_PREFERENCE: str = Field(
        default="sms",
        description="Preferred fallback channel when voice fails (sms or whatsapp)"
    )
    
    # Fallback Notification Settings
    FALLBACK_NOTIFICATION_ENABLED: bool = Field(
        default=True,
        description="Whether to enable fallback notifications when voice communication fails"
    )
    
    # PayPal Configuration
    PAYPAL_CLIENT_ID: Optional[str] = Field(
        default=None,
        description="PayPal REST API client ID"
    )
    PAYPAL_CLIENT_SECRET: Optional[str] = Field(
        default=None,
        description="PayPal REST API client secret"
    )
    PAYPAL_MODE: str = Field(
        default="sandbox",
        description="PayPal mode: 'sandbox' for testing, 'live' for production"
    )
    PAYPAL_WEBHOOK_ID: Optional[str] = Field(
        default=None,
        description="PayPal webhook ID for verifying webhook events"
    )
    
    # Redis Configuration for Distributed Rate Limiting
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URL for distributed rate limiting"
    )
    REDIS_RATE_LIMIT_DB: int = Field(
        default=0,
        description="Redis database number for rate limiting"
    )
    REDIS_CONNECTION_TIMEOUT: int = Field(
        default=5,
        description="Redis connection timeout in seconds"
    )
    REDIS_MAX_CONNECTIONS: int = Field(
        default=10,
        description="Maximum number of Redis connections in pool"
    )

    @field_validator('ENVIRONMENT')
    def validate_environment(cls, v):
        allowed_environments = ['development', 'production', 'staging']
        if v not in allowed_environments:
            raise ValueError(f'ENVIRONMENT must be one of {allowed_environments}')
        return v

    @field_validator('DATABASE_URL')
    def validate_database_url(cls, v, values):
        env = values.data.get('ENVIRONMENT', 'development')
        if env == 'production':
            if v == "postgresql://user:password@localhost:5432/robofy":
                raise ValueError('DATABASE_URL must be set to a non-default value in production')
            if 'postgresql' not in str(v):
                raise ValueError('DATABASE_URL must be a PostgreSQL connection string in production')
        # In development, allow any database URL including SQLite
        return v

    @field_validator('JWT_SECRET_KEY')
    def validate_jwt_secret_key(cls, v, values):
        if values.data.get('ENVIRONMENT') == 'production' and v == secrets.token_urlsafe(32):
            raise ValueError('JWT_SECRET_KEY must be set to a non-default value in production')
        if len(v) < 32:
            raise ValueError('JWT_SECRET_KEY must be at least 32 characters long')
        return v

    @field_validator('API_KEY_ENCRYPTION_KEY')
    def validate_api_key_encryption_key(cls, v, values):
        if values.data.get('ENVIRONMENT') == 'production' and v == secrets.token_urlsafe(32):
            raise ValueError('API_KEY_ENCRYPTION_KEY must be set to a non-default value in production')
        if len(v) < 32:
            raise ValueError('API_KEY_ENCRYPTION_KEY must be at least 32 characters long')
        return v

    @field_validator('PAYPAL_MODE')
    def validate_paypal_mode(cls, v):
        allowed_modes = ['sandbox', 'live']
        if v not in allowed_modes:
            raise ValueError(f'PAYPAL_MODE must be one of {allowed_modes}')
        return v

    @field_validator('TWILIO_FALLBACK_PREFERENCE')
    def validate_twilio_fallback_preference(cls, v):
        allowed_preferences = ['sms', 'whatsapp']
        if v not in allowed_preferences:
            raise ValueError(f'TWILIO_FALLBACK_PREFERENCE must be one of {allowed_preferences}')
        return v

    @field_validator('AI_SERVICE_PRIORITY')
    def validate_ai_service_priority(cls, v):
        """Parse comma-separated string into list if needed"""
        if isinstance(v, str):
            # Remove any quotes and split by commas
            v = v.strip().strip('"').strip("'")
            return [service.strip() for service in v.split(',') if service.strip()]
        return v

    @field_validator('REDIS_URL')
    def validate_redis_url(cls, v, values):
        if values.data.get('ENVIRONMENT') == 'production' and v == "redis://localhost:6379/0":
            raise ValueError('REDIS_URL must be set to a non-default value in production')
        if 'redis://' not in str(v):
            raise ValueError('REDIS_URL must be a Redis connection string starting with redis://')
        return v

    @model_validator(mode='after')
    def validate_production_settings(self):
        if self.ENVIRONMENT == 'production':
            if self.DEBUG:
                raise ValueError('DEBUG must be False in production environment')
            
            # Check for required API keys if certain features are expected to be used
            # Note: This is optional and can be adjusted based on actual requirements
            if not self.DEEPSEEK_API_KEY and not self.GOOGLE_API_KEY and not self.OPENAI_API_KEY:
                logger.warning("No AI API keys configured. AI features may not work in production.")
            
            if not self.SERPAPI_API_KEY:
                logger.warning("SERPAPI_API_KEY not set. SEO analysis features may not work.")
                
            if not self.TWILIO_ACCOUNT_SID or not self.TWILIO_AUTH_TOKEN:
                logger.warning("Twilio credentials not set. Voice and SMS features may not work.")
                
            if not self.PAYPAL_CLIENT_ID or not self.PAYPAL_CLIENT_SECRET:
                logger.warning("PayPal credentials not set. Payment features may not work.")
                
        return self

    model_config = ConfigDict(env_file=".env", case_sensitive=True)

# Create settings instance
settings = Settings()