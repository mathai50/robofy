"""
Error handling utilities for the Robofy backend API.
Provides standardized error responses and handling functions.
"""
from fastapi import HTTPException, status
from typing import Any, Dict
import logging

logger = logging.getLogger(__name__)

def http_error(
    status_code: int,
    detail: str,
    error_code: str = None,
    additional_info: Dict[str, Any] = None
) -> HTTPException:
    """
    Create a standardized HTTP error response.
    
    Args:
        status_code: HTTP status code
        detail: Human-readable error message
        error_code: Machine-readable error code (optional)
        additional_info: Additional error context (optional)
    
    Returns:
        HTTPException with standardized error format
    """
    error_response = {
        "error": {
            "code": error_code or f"HTTP_{status_code}",
            "message": detail,
            "details": additional_info or {}
        }
    }
    
    return HTTPException(
        status_code=status_code,
        detail=error_response
    )

# Common error types
def bad_request_error(detail: str, error_code: str = "BAD_REQUEST", additional_info: Dict[str, Any] = None) -> HTTPException:
    """400 Bad Request error"""
    return http_error(status.HTTP_400_BAD_REQUEST, detail, error_code, additional_info)

def unauthorized_error(detail: str, error_code: str = "UNAUTHORIZED", additional_info: Dict[str, Any] = None) -> HTTPException:
    """401 Unauthorized error"""
    return http_error(status.HTTP_401_UNAUTHORIZED, detail, error_code, additional_info)

def not_found_error(detail: str, error_code: str = "NOT_FOUND", additional_info: Dict[str, Any] = None) -> HTTPException:
    """404 Not Found error"""
    return http_error(status.HTTP_404_NOT_FOUND, detail, error_code, additional_info)

def conflict_error(detail: str, error_code: str = "CONFLICT", additional_info: Dict[str, Any] = None) -> HTTPException:
    """409 Conflict error"""
    return http_error(status.HTTP_409_CONFLICT, detail, error_code, additional_info)

def internal_server_error(detail: str, error_code: str = "INTERNAL_SERVER_ERROR", additional_info: Dict[str, Any] = None) -> HTTPException:
    """500 Internal Server Error"""
    return http_error(status.HTTP_500_INTERNAL_SERVER_ERROR, detail, error_code, additional_info)

def service_unavailable_error(detail: str, error_code: str = "SERVICE_UNAVAILABLE", additional_info: Dict[str, Any] = None) -> HTTPException:
    """503 Service Unavailable"""
    return http_error(status.HTTP_503_SERVICE_UNAVAILABLE, detail, error_code, additional_info)

def too_many_requests_error(detail: str, error_code: str = "TOO_MANY_REQUESTS", additional_info: Dict[str, Any] = None) -> HTTPException:
    """429 Too Many Requests"""
    return http_error(status.HTTP_429_TOO_MANY_REQUESTS, detail, error_code, additional_info)