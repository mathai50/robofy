"""
Pydantic schemas for authentication and user management.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    """JWT token response schema."""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Data contained in JWT token."""
    username: Optional[str] = None

class UserBase(BaseModel):
    """Base user schema."""
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    """Schema for user creation."""
    password: str

class UserUpdate(BaseModel):
    """Schema for user updates."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class UserInDB(UserBase):
    """User schema as stored in database."""
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserResponse(UserInDB):
    """User response schema (excludes sensitive data)."""
    pass

class LoginRequest(BaseModel):
    """Schema for login requests."""
    username: str
    password: str