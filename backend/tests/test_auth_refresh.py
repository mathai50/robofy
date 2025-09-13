"""
Tests for JWT token refresh functionality.
"""
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from jose import jwt

from main import app
from config import settings
from database import get_db, User
from auth import create_access_token, create_refresh_token

client = TestClient(app)

def test_refresh_token_success(test_db: Session):
    """Test successful token refresh with valid refresh token."""
    # Create a test user
    from auth import get_password_hash
    user = User(
        username="testuser_refresh",
        email="test_refresh@example.com",
        hashed_password=get_password_hash("testpassword123"),
        is_active=True
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    
    # Create a refresh token
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    # Test refresh endpoint
    response = client.post("/api/auth/refresh", json={"refresh_token": refresh_token})
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"
    
    # Verify the new access token is valid
    payload = jwt.decode(
        data["access_token"], 
        settings.JWT_SECRET_KEY, 
        algorithms=[settings.JWT_ALGORITHM]
    )
    assert payload["sub"] == user.username
    assert payload["type"] == "access"

def test_refresh_token_invalid_token_type(test_db: Session):
    """Test refresh with access token instead of refresh token."""
    # Create an access token (wrong type)
    access_token = create_access_token(data={"sub": "testuser"})
    
    response = client.post("/api/auth/refresh", json={"refresh_token": access_token})
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Invalid token type: refresh token required" in response.json()["detail"]

def test_refresh_token_expired(test_db: Session):
    """Test refresh with expired refresh token."""
    from datetime import datetime, timedelta
    import time
    
    # Create an expired refresh token
    expired_payload = {"sub": "testuser", "type": "refresh", "exp": datetime.utcnow() - timedelta(seconds=1)}
    expired_token = jwt.encode(expired_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    
    response = client.post("/api/auth/refresh", json={"refresh_token": expired_token})
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Refresh token has expired" in response.json()["detail"]

def test_refresh_token_invalid_signature():
    """Test refresh with token signed with wrong secret."""
    invalid_token = jwt.encode(
        {"sub": "testuser", "type": "refresh"}, 
        "wrong-secret-key", 
        algorithm=settings.JWT_ALGORITHM
    )
    
    response = client.post("/api/auth/refresh", json={"refresh_token": invalid_token})
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Invalid refresh token" in response.json()["detail"]

def test_refresh_token_missing_subject():
    """Test refresh with token missing subject claim."""
    token_without_sub = jwt.encode(
        {"type": "refresh"}, 
        settings.JWT_SECRET_KEY, 
        algorithm=settings.JWT_ALGORITHM
    )
    
    response = client.post("/api/auth/refresh", json={"refresh_token": token_without_sub})
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "missing subject" in response.json()["detail"]

def test_refresh_token_nonexistent_user(test_db: Session):
    """Test refresh with valid token but user doesn't exist."""
    refresh_token = create_refresh_token(data={"sub": "nonexistent_user"})
    
    response = client.post("/api/auth/refresh", json={"refresh_token": refresh_token})
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "User not found" in response.json()["detail"]

def test_refresh_token_inactive_user(test_db: Session):
    """Test refresh with valid token but user is inactive."""
    from auth import get_password_hash
    
    user = User(
        username="inactive_user",
        email="inactive@example.com",
        hashed_password=get_password_hash("testpassword123"),
        is_active=False
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    response = client.post("/api/auth/refresh", json={"refresh_token": refresh_token})
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Inactive user" in response.json()["detail"]

def test_login_returns_refresh_token(test_db: Session):
    """Test that login endpoint returns both access and refresh tokens."""
    # Create test user first
    from auth import get_password_hash
    user = User(
        username="login_test_user",
        email="login_test@example.com",
        hashed_password=get_password_hash("testpassword123"),
        is_active=True
    )
    test_db.add(user)
    test_db.commit()
    
    # Test login
    response = client.post("/api/auth/login", data={
        "username": "login_test_user",
        "password": "testpassword123"
    })
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"
    
    # Verify both tokens are valid
    access_payload = jwt.decode(
        data["access_token"], 
        settings.JWT_SECRET_KEY, 
        algorithms=[settings.JWT_ALGORITHM]
    )
    refresh_payload = jwt.decode(
        data["refresh_token"], 
        settings.JWT_SECRET_KEY, 
        algorithms=[settings.JWT_ALGORITHM]
    )
    
    assert access_payload["sub"] == "login_test_user"
    assert access_payload["type"] == "access"
    assert refresh_payload["sub"] == "login_test_user"
    assert refresh_payload["type"] == "refresh"