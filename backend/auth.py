"""
JWT Authentication utilities for FastAPI.
Includes token creation, verification, and password hashing.
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt, ExpiredSignatureError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional

from errors import unauthorized_error

from config import settings
from database import get_db, User

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password for storage."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    """Create a JWT refresh token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

def _validate_jwt_token(token: str, require_access_token: bool = True) -> dict:
    """
    Validate JWT token and return payload if valid.
    
    Args:
        token: JWT token string
        require_access_token: If True, validates token type is "access"
    
    Returns:
        Decoded JWT payload
    
    Raises:
        HTTPException with standardized error responses
    """
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        username: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if username is None:
            raise unauthorized_error(
                "Invalid token: missing subject",
                "TOKEN_MISSING_SUBJECT"
            )
        
        if require_access_token and token_type != "access":
            raise unauthorized_error(
                "Invalid token type: access token required",
                "INVALID_TOKEN_TYPE"
            )
            
        return payload
        
    except ExpiredSignatureError:
        raise unauthorized_error(
            "Token has expired",
            "TOKEN_EXPIRED"
        )
    except JWTError as e:
        raise unauthorized_error(
            f"Invalid token: {str(e)}",
            "INVALID_TOKEN"
        )

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Get the current authenticated user from JWT token."""
    payload = _validate_jwt_token(token)
    username: str = payload.get("sub")
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise unauthorized_error(
            "User not found",
            "USER_NOT_FOUND"
        )
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
):
    """Check if the current user is active."""
    if not current_user.is_active:
        raise unauthorized_error("Inactive user", "USER_INACTIVE")
    return current_user

async def authenticate_user(
    username: str, password: str, db: Session
) -> Optional[User]:
    """Authenticate a user with username and password."""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def get_current_user_from_token(token: str, db: Session) -> Optional[User]:
    """Get user from JWT token without dependency injection."""
    payload = _validate_jwt_token(token)
    username: str = payload.get("sub")
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise unauthorized_error(
            "User not found",
            "USER_NOT_FOUND"
        )
    return user

async def get_current_user_ws(token: str, db: Session) -> Optional[User]:
    """
    Get the current authenticated user from JWT token for WebSocket connections.
    This is similar to get_current_user but designed for WebSocket use.
    """
    payload = _validate_jwt_token(token)
    username: str = payload.get("sub")
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise unauthorized_error(
            "User not found",
            "USER_NOT_FOUND"
        )
    return user

def validate_refresh_token(token: str) -> dict:
    """Validate a refresh token and return its payload if valid."""
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        token_type: str = payload.get("type")
        
        if token_type != "refresh":
            raise unauthorized_error(
                "Invalid token type: refresh token required",
                "INVALID_TOKEN_TYPE"
            )
            
        return payload
        
    except ExpiredSignatureError:
        raise unauthorized_error(
            "Refresh token has expired",
            "TOKEN_EXPIRED"
        )
    except JWTError as e:
        raise unauthorized_error(
            f"Invalid refresh token: {str(e)}",
            "INVALID_TOKEN"
        )

async def refresh_access_token(refresh_token: str, db: Session) -> dict:
    """Refresh an access token using a valid refresh token."""
    payload = validate_refresh_token(refresh_token)
    username: str = payload.get("sub")
    
    if username is None:
        raise unauthorized_error(
            "Invalid refresh token: missing subject",
            "TOKEN_MISSING_SUBJECT"
        )
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise unauthorized_error(
            "User not found",
            "USER_NOT_FOUND"
        )
    
    if not user.is_active:
        raise unauthorized_error(
            "Inactive user",
            "USER_INACTIVE"
        )
    
    access_token = create_access_token(data={"sub": username})
    new_refresh_token = create_refresh_token(data={"sub": username})
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

class AuthService:
    """Service class for authentication operations."""
    
    def __init__(self, config: dict = None):
        self.config = config or {}
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return verify_password(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """Hash a password for storage."""
        return get_password_hash(password)
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create a JWT access token."""
        return create_access_token(data, expires_delta)
    
    def create_refresh_token(self, data: dict) -> str:
        """Create a JWT refresh token."""
        return create_refresh_token(data)
    
    def validate_jwt_token(self, token: str, require_access_token: bool = True) -> dict:
        """Validate JWT token and return payload if valid."""
        return _validate_jwt_token(token, require_access_token)
    
    async def get_current_user(self, token: str, db: Session) -> User:
        """Get the current authenticated user from JWT token."""
        return await get_current_user(token, db)
    
    async def get_current_active_user(self, current_user: User) -> User:
        """Check if the current user is active."""
        return await get_current_active_user(current_user)
    
    async def authenticate_user(self, username: str, password: str, db: Session) -> Optional[User]:
        """Authenticate a user with username and password."""
        return await authenticate_user(username, password, db)
    
    async def get_current_user_from_token(self, token: str, db: Session) -> Optional[User]:
        """Get user from JWT token without dependency injection."""
        return await get_current_user_from_token(token, db)
    
    async def get_current_user_ws(self, token: str, db: Session) -> Optional[User]:
        """Get the current authenticated user from JWT token for WebSocket connections."""
        return await get_current_user_ws(token, db)
    
    def validate_refresh_token(self, token: str) -> dict:
        """Validate a refresh token and return its payload if valid."""
        return validate_refresh_token(token)
    
    async def refresh_access_token(self, refresh_token: str, db: Session) -> dict:
        """Refresh an access token using a valid refresh token."""
        return await refresh_access_token(refresh_token, db)