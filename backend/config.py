"""
Configuration settings loaded from environment variables.
Uses pydantic-settings for validation and type safety.
"""
from pydantic_settings import BaseSettings
from pydantic import Field, AnyUrl
from typing import List, Optional
import secrets

class Settings(BaseSettings):
    # Database Configuration
    DATABASE_URL: AnyUrl = Field(
        default="postgresql://user:password@localhost:5432/robofy",
        description="PostgreSQL database connection URL"
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
    
    # Application Settings
    ENVIRONMENT: str = Field(
        default="development",
        description="Application environment (development, production)"
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
        default="gemini-pro",
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
        default=["deepseek", "google", "openai", "huggingface"],
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
    
    # Google Calendar Configuration
    GOOGLE_SERVICE_ACCOUNT_FILE: Optional[str] = Field(
        default=None,
        description="Path to Google Service Account JSON file for calendar access"
    )
    GOOGLE_CALENDAR_ID: str = Field(
        default="primary",
        description="Google Calendar ID to use for appointments"
    )
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()