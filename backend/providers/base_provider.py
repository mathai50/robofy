"""
Base AI provider class with common functionality and error handling.
All AI providers should inherit from this class.
"""
import logging
import asyncio
from typing import Optional, Dict, Any, List, AsyncGenerator
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

logger = logging.getLogger(__name__)

class AIProviderError(Exception):
    """Base exception for AI provider errors."""
    pass

class RateLimitError(AIProviderError):
    """Exception raised when rate limits are exceeded."""
    pass

class AuthenticationError(AIProviderError):
    """Exception raised for authentication failures."""
    pass

class ServiceUnavailableError(AIProviderError):
    """Exception raised when the AI service is unavailable."""
    pass

class BaseAIProvider:
    """Base class for all AI providers with common functionality."""
    
    def __init__(self, timeout: int = 30, max_retries: int = 3, **kwargs):
        self.timeout = timeout
        self.max_retries = max_retries
        self.client = httpx.AsyncClient(timeout=timeout)
    
    def is_available(self) -> bool:
        """Check if the provider is available (has required credentials)."""
        raise NotImplementedError("Subclasses must implement is_available()")
    
    async def generate_text(self, prompt: str, **kwargs) -> str:
        """Generate text using the AI provider. For non-streaming requests."""
        raise NotImplementedError("Subclasses must implement generate_text() for non-streaming")

    async def generate_text_stream(self, prompt: str, **kwargs) -> AsyncGenerator[str, None]:
        """Generate text stream using the AI provider. For streaming requests."""
        raise NotImplementedError("Subclasses must implement generate_text_stream() for streaming")
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        retry=retry_if_exception_type((RateLimitError, ServiceUnavailableError)),
        reraise=True
    )
    async def _make_request(self, method: str, url: str, **kwargs) -> Dict[str, Any]:
        """Make an HTTP request with retry logic."""
        try:
            response = await self.client.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                raise RateLimitError(f"Rate limit exceeded: {e}") from e
            elif e.response.status_code == 401:
                raise AuthenticationError(f"Authentication failed: {e}") from e
            elif e.response.status_code >= 500:
                raise ServiceUnavailableError(f"Service unavailable: {e}") from e
            else:
                raise AIProviderError(f"HTTP error: {e}") from e
        except httpx.RequestError as e:
            raise ServiceUnavailableError(f"Request error: {e}") from e
        except Exception as e:
            raise AIProviderError(f"Unexpected error: {e}") from e
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
    
