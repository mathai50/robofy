"""
Comprehensive tests for distributed rate limiting implementation.
Tests both Redis-based rate limiting and database fallback scenarios.
"""
import pytest
import asyncio
from unittest.mock import patch, MagicMock, AsyncMock
from datetime import datetime, timedelta
from fastapi import status
from fastapi.testclient import TestClient

from main import app
from rate_limiting import RateLimitingService, RateLimitMiddleware
from database import RateLimit, get_db
from redis_client import redis_client

client = TestClient(app)

@pytest.fixture
def mock_db_session():
    """Create a mock database session for testing."""
    with patch('rate_limiting.get_db') as mock_get_db:
        mock_session = MagicMock()
        mock_get_db.return_value = iter([mock_session])
        yield mock_session

@pytest.fixture
def rate_limiting_service():
    """Create a RateLimitingService instance for testing."""
    return RateLimitingService()

@pytest.mark.asyncio
async def test_rate_limiting_service_redis_available(rate_limiting_service, mock_db_session):
    """Test rate limiting when Redis is available."""
    # Mock Redis to be available and return success
    with patch.object(redis_client, 'is_available', return_value=True):
        with patch.object(redis_client, 'increment_rate_limit', return_value={"count": 5, "limit": 10}):
            is_limited = await rate_limiting_service.is_rate_limited(
                mock_db_session, "test-identifier", "ip", "/api/test", 10, 1
            )
            assert is_limited == False  # 5 < 10, not limited

        # Test when count exceeds limit
        with patch.object(redis_client, 'increment_rate_limit', return_value={"count": 15, "limit": 10}):
            is_limited = await rate_limiting_service.is_rate_limited(
                mock_db_session, "test-identifier", "ip", "/api/test", 10, 1
            )
            assert is_limited == True  # 15 > 10, limited

@pytest.mark.asyncio
async def test_rate_limiting_service_redis_unavailable(rate_limiting_service, mock_db_session):
    """Test rate limiting when Redis is unavailable, falling back to database."""
    # Mock Redis to be unavailable
    with patch.object(redis_client, 'is_available', return_value=False):
        # Mock database query to return existing rate limit record
        mock_rate_limit = MagicMock()
        mock_rate_limit.request_count = 5
        mock_rate_limit.window_end = datetime.now() + timedelta(minutes=1)
        mock_db_session.query.return_value.filter.return_value.first.return_value = mock_rate_limit

        is_limited = await rate_limiting_service.is_rate_limited(
            mock_db_session, "test-identifier", "ip", "/api/test", 10, 1
        )
        assert is_limited == False  # 5 < 10, not limited

        # Test when count exceeds limit in database
        mock_rate_limit.request_count = 15
        is_limited = await rate_limiting_service.is_rate_limited(
            mock_db_session, "test-identifier", "ip", "/api/test", 10, 1
        )
        assert is_limited == True  # 15 > 10, limited

@pytest.mark.asyncio
async def test_rate_limiting_service_redis_error(rate_limiting_service, mock_db_session):
    """Test rate limiting when Redis returns an error, falling back to database."""
    with patch.object(redis_client, 'is_available', return_value=True):
        with patch.object(redis_client, 'increment_rate_limit', return_value={"error": "Redis error"}):
            # Mock database fallback
            mock_rate_limit = MagicMock()
            mock_rate_limit.request_count = 5
            mock_rate_limit.window_end = datetime.now() + timedelta(minutes=1)
            mock_db_session.query.return_value.filter.return_value.first.return_value = mock_rate_limit

            is_limited = await rate_limiting_service.is_rate_limited(
                mock_db_session, "test-identifier", "ip", "/api/test", 10, 1
            )
            assert is_limited == False  # Database fallback, 5 < 10

@pytest.mark.asyncio
async def test_rate_limiting_service_new_record(rate_limiting_service, mock_db_session):
    """Test rate limiting when no existing record exists in database."""
    with patch.object(redis_client, 'is_available', return_value=False):
        # Mock no existing record
        mock_db_session.query.return_value.filter.return_value.first.return_value = None

        is_limited = await rate_limiting_service.is_rate_limited(
            mock_db_session, "test-identifier", "ip", "/api/test", 10, 1
        )
        # New record should have count=1, which is less than limit=10
        assert is_limited == False
        # Verify that a new record was added
        assert mock_db_session.add.called
        assert mock_db_session.commit.called

@pytest.mark.asyncio
async def test_rate_limiting_service_window_expired(rate_limiting_service, mock_db_session):
    """Test rate limiting when the time window has expired."""
    with patch.object(redis_client, 'is_available', return_value=False):
        # Mock existing record with expired window
        mock_rate_limit = MagicMock()
        mock_rate_limit.request_count = 15  # Previously exceeded limit
        mock_rate_limit.window_end = datetime.now() - timedelta(minutes=1)  # Expired
        mock_db_session.query.return_value.filter.return_value.first.return_value = mock_rate_limit

        is_limited = await rate_limiting_service.is_rate_limited(
            mock_db_session, "test-identifier", "ip", "/api/test", 10, 1
        )
        # Window expired, count should reset to 1, which is less than limit=10
        assert is_limited == False
        assert mock_rate_limit.request_count == 1  # Should be reset

def test_rate_limit_middleware_skip_endpoints():
    """Test that rate limiting middleware skips certain endpoints."""
    middleware = RateLimitMiddleware(app=MagicMock())
    request = MagicMock()
    request.url.path = "/api/health"
    request.client.host = "127.0.0.1"
    request.headers.get.return_value = None

    # Should skip health check endpoint
    with patch.object(middleware, 'call_next', AsyncMock()) as mock_call_next:
        asyncio.run(middleware.dispatch(request, mock_call_next))
        mock_call_next.assert_called_once()  # Should proceed without rate limiting

@pytest.mark.asyncio
async def test_rate_limit_middleware_rate_limited():
    """Test rate limiting middleware when rate limit is exceeded."""
    middleware = RateLimitMiddleware(app=MagicMock())
    middleware.rate_limiting_service = MagicMock()
    middleware.rate_limiting_service.is_rate_limited = AsyncMock(return_value=True)

    request = MagicMock()
    request.url.path = "/api/test"
    request.client.host = "127.0.0.1"
    request.headers.get.return_value = None

    # Should raise 429 error when rate limited
    with pytest.raises(Exception) as exc_info:
        await middleware.dispatch(request, AsyncMock())
    
    assert exc_info.value.status_code == status.HTTP_429_TOO_MANY_REQUESTS

@pytest.mark.asyncio
async def test_rate_limit_middleware_success():
    """Test rate limiting middleware when request is allowed."""
    middleware = RateLimitMiddleware(app=MagicMock())
    middleware.rate_limiting_service = MagicMock()
    middleware.rate_limiting_service.is_rate_limited = AsyncMock(return_value=False)
    middleware.rate_limiting_service.track_usage = AsyncMock()

    request = MagicMock()
    request.url.path = "/api/test"
    request.client.host = "127.0.0.1"
    request.headers.get.return_value = None

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_call_next = AsyncMock(return_value=mock_response)

    response = await middleware.dispatch(request, mock_call_next)
    assert response == mock_response
    mock_call_next.assert_called_once()
    middleware.rate_limiting_service.track_usage.assert_called_once()

def test_seo_endpoint_rate_limits():
    """Test that SEO endpoints have different rate limits."""
    middleware = RateLimitMiddleware(app=MagicMock())
    
    # Regular endpoint should use requests_per_minute
    is_seo = middleware._is_seo_endpoint("/api/test")
    assert is_seo == False

    # SEO endpoint should use seo_requests_per_day
    is_seo = middleware._is_seo_endpoint("/api/seo/competitor-analysis")
    assert is_seo == True

    is_seo = middleware._is_seo_endpoint("/api/seo/keyword-research")
    assert is_seo == True

@pytest.mark.asyncio
async def test_rate_limiting_track_usage(rate_limiting_service, mock_db_session):
    """Test that usage tracking works correctly."""
    request = MagicMock()
    request.url.path = "/api/test"
    request.method = "GET"
    request.headers.get.return_value = None

    await rate_limiting_service.track_usage(
        mock_db_session, request, "127.0.0.1", None, 200, 150.0
    )

    # Verify that a usage record was added
    assert mock_db_session.add.called
    assert mock_db_session.commit.called

def test_rate_limit_configuration():
    """Test rate limit configuration values."""
    service = RateLimitingService()
    assert service.requests_per_minute == 60
    assert service.requests_per_hour == 1000
    assert service.seo_requests_per_day == 50

    # Test with custom config
    custom_config = {
        "requests_per_minute": 30,
        "requests_per_hour": 500,
        "seo_requests_per_day": 25
    }
    service = RateLimitingService(custom_config)
    assert service.requests_per_minute == 30
    assert service.requests_per_hour == 500
    assert service.seo_requests_per_day == 25

if __name__ == "__main__":
    pytest.main([__file__, "-v"])