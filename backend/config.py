"""
Configuration settings loaded from environment variables.
Uses pydantic-settings for validation and type safety.
"""
from pydantic_settings import BaseSettings
from pydantic import Field, AnyUrl
from typing import List
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
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()