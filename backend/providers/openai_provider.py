"""
OpenAI provider implementation using direct API calls.
"""
import os
import logging
from typing import Optional, Dict, Any
import httpx
from .base_provider import BaseAIProvider, AIProviderError, RateLimitError, AuthenticationError, ServiceUnavailableError

logger = logging.getLogger(__name__)

class OpenAIProvider(BaseAIProvider):
    """OpenAI provider implementation using direct API calls."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-3.5-turbo", **kwargs):
        super().__init__(**kwargs)
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model or os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        self.base_url = "https://api.openai.com/v1"
        
    def is_available(self) -> bool:
        """Check if OpenAI provider is available (has API key)."""
        return bool(self.api_key)
    
    async def generate_text(self, prompt: str, **kwargs) -> str:
        """Generate text using OpenAI API."""
        if not self.is_available():
            raise AIProviderError("OpenAI provider is not available (missing API key)")
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": kwargs.get("temperature", 0.7),
                "max_tokens": kwargs.get("max_tokens", 1000),
                "stream": False
            }
            
            response = await self._make_request(
                "POST",
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload
            )
            
            return response["choices"][0]["message"]["content"]
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise AIProviderError(f"OpenAI API error: {str(e)}") from e
    
    async def models(self) -> Dict[str, Any]:
        """Get available OpenAI models."""
        if not self.is_available():
            raise AIProviderError("OpenAI provider is not available (missing API key)")
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = await self._make_request(
                "GET",
                f"{self.base_url}/models",
                headers=headers
            )
            
            return response
            
        except Exception as e:
            logger.error(f"OpenAI models error: {str(e)}")
            raise AIProviderError(f"OpenAI models error: {str(e)}") from e