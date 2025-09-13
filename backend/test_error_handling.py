"""
Comprehensive tests for error handling standardization.
Ensures all endpoints consistently use standardized error responses.
"""
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

from errors import (
    http_error,
    bad_request_error,
    unauthorized_error,
    not_found_error,
    conflict_error,
    internal_server_error,
    service_unavailable_error,
    too_many_requests_error
)

# Create test client with mocked dependencies to avoid import issues
@pytest.fixture
def client():
    """Create a test client with mocked dependencies."""
    with patch('main.get_db'), \
         patch('main.authenticate_user'), \
         patch('main.get_current_active_user'), \
         patch('main.payment_service'), \
         patch('main.NotificationService'), \
         patch('main.is_valid_domain'):
        
        # Import main app after mocking to avoid DB connections during test collection
        from main import app
        with TestClient(app) as test_client:
            yield test_client

def test_http_error_function():
    """Test the base http_error function with various scenarios."""
    # Test with minimal parameters
    error = http_error(status.HTTP_400_BAD_REQUEST, "Test error")
    assert error.status_code == status.HTTP_400_BAD_REQUEST
    assert error.detail["error"]["message"] == "Test error"
    assert error.detail["error"]["code"] == "HTTP_400"

    # Test with custom error code
    error = http_error(status.HTTP_404_NOT_FOUND, "Not found", "CUSTOM_NOT_FOUND")
    assert error.status_code == status.HTTP_404_NOT_FOUND
    assert error.detail["error"]["code"] == "CUSTOM_NOT_FOUND"

    # Test with additional info
    additional_info = {"field": "email", "reason": "already exists"}
    error = http_error(status.HTTP_409_CONFLICT, "Conflict", "CONFLICT", additional_info)
    assert error.detail["error"]["details"] == additional_info

def test_standard_error_functions():
    """Test all standard error helper functions."""
    # Test bad_request_error
    error = bad_request_error("Invalid input", "INVALID_INPUT")
    assert error.status_code == status.HTTP_400_BAD_REQUEST
    assert error.detail["error"]["code"] == "INVALID_INPUT"

    # Test unauthorized_error
    error = unauthorized_error("Authentication required", "AUTH_REQUIRED")
    assert error.status_code == status.HTTP_401_UNAUTHORIZED

    # Test not_found_error
    error = not_found_error("Resource not found", "RESOURCE_NOT_FOUND")
    assert error.status_code == status.HTTP_404_NOT_FOUND

    # Test conflict_error
    error = conflict_error("Resource conflict", "RESOURCE_CONFLICT")
    assert error.status_code == status.HTTP_409_CONFLICT

    # Test internal_server_error
    error = internal_server_error("Internal error", "INTERNAL_ERROR")
    assert error.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    # Test service_unavailable_error
    error = service_unavailable_error("Service unavailable", "SERVICE_UNAVAILABLE")
    assert error.status_code == status.HTTP_503_SERVICE_UNAVAILABLE

    # Test too_many_requests_error
    error = too_many_requests_error("Rate limit exceeded", "RATE_LIMIT_EXCEEDED")
    assert error.status_code == status.HTTP_429_TOO_MANY_REQUESTS

def test_leads_endpoint_error_handling():
    """Test error handling in leads endpoints."""
    # Test conflict error when creating duplicate lead
    with patch('main.db') as mock_db:
        mock_session = MagicMock()
        mock_session.query.return_value.filter.return_value.first.return_value = MagicMock()  # Existing lead
        
        with patch('main.get_db', return_value=mock_session):
            response = client.post("/api/leads", json={
                "name": "Test User",
                "email": "test@example.com",
                "industry": "Technology"
            })
            
            assert response.status_code == status.HTTP_409_CONFLICT
            assert response.json()["error"]["code"] == "LEAD_EMAIL_CONFLICT"

def test_auth_endpoint_error_handling():
    """Test error handling in authentication endpoints."""
    # Test unauthorized error for invalid credentials
    with patch('main.authenticate_user', return_value=None):
        response = client.post("/api/auth/login", data={
            "username": "invalid",
            "password": "invalid"
        })
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.json()["error"]["code"] == "INVALID_CREDENTIALS"

def test_api_key_endpoint_error_handling():
    """Test error handling in API key endpoints."""
    # Test not found error for non-existent API key
    with patch('main.get_current_active_user', return_value=MagicMock(id=1)):
        with patch('main.db') as mock_db:
            mock_session = MagicMock()
            mock_session.query.return_value.filter.return_value.first.return_value = None  # No API key found
            
            with patch('main.get_db', return_value=mock_session):
                response = client.delete("/api/api-keys/999")
                
                assert response.status_code == status.HTTP_404_NOT_FOUND
                assert response.json()["error"]["code"] == "API_KEY_NOT_FOUND"

def test_payments_endpoint_error_format():
    """Test that payments endpoints return standardized error format."""
    # Mock payment service to return failure
    with patch('main.payment_service.create_payment', return_value=None):
        with patch('main.get_current_active_user', return_value=MagicMock(id=1)):
            response = client.post("/payments/create", json={
                "amount": 100.0,
                "currency": "USD",
                "description": "Test payment"
            })
            
            # Should return standardized error format
            assert "error" in response.json()
            assert "code" in response.json()["error"]
            assert "message" in response.json()["error"]

def test_notifications_endpoint_error_format():
    """Test that notifications endpoints return standardized error format."""
    # Mock notification service to raise exception
    with patch('main.NotificationService.send_email_notification', side_effect=Exception("Test error")):
        response = client.post("/notifications/email", json={
            "recipient": "test@example.com",
            "subject": "Test",
            "message": "Test message"
        })
        
        # Should return standardized error format
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert "error" in response.json()
        assert response.json()["error"]["code"] == "EMAIL_NOTIFICATION_FAILED"

def test_seo_endpoint_error_handling():
    """Test error handling in SEO endpoints."""
    # Test bad request for invalid domain
    with patch('main.is_valid_domain', return_value=False):
        with patch('main.get_current_active_user', return_value=MagicMock()):
            response = client.post("/api/seo/competitor-analysis", json={
                "domain": "invalid-domain",
                "competitors": ["comp1.com"]
            })
            
            assert response.status_code == status.HTTP_400_BAD_REQUEST
            assert response.json()["error"]["code"] == "INVALID_DOMAIN"

def test_error_response_structure():
    """Test that all error responses follow the standardized structure."""
    # Test various endpoints to ensure consistent error structure
    endpoints_to_test = [
        ("/api/leads", "post", {"name": "Test", "email": "test@example.com"}),
        ("/api/auth/login", "post", {"username": "test", "password": "test"}),
        ("/api/api-keys/999", "delete", None),
        ("/payments/create", "post", {"amount": 100, "description": "test"}),
        ("/notifications/email", "post", {"recipient": "test@example.com", "subject": "test", "message": "test"})
    ]
    
    for endpoint, method, data in endpoints_to_test:
        # Force an error by providing invalid data or mocking failures
        if method == "post":
            response = client.post(endpoint, json=data if data else {})
        elif method == "delete":
            response = client.delete(endpoint)
        
        if 400 <= response.status_code < 600:
            # Verify standardized error structure
            error_data = response.json()
            assert "error" in error_data
            assert "code" in error_data["error"]
            assert "message" in error_data["error"]
            assert "details" in error_data["error"]

if __name__ == "__main__":
    pytest.main([__file__, "-v"])