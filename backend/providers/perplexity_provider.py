"""
Perplexity AI provider implementation using Perplexity API.
"""
import os
import logging
from typing import Optional, Dict, Any, AsyncGenerator
import httpx
import json
from .base_provider import BaseAIProvider, AIProviderError

logger = logging.getLogger(__name__)

class PerplexityProvider(BaseAIProvider):
    """Perplexity AI provider implementation using Perplexity API."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "sonar", **kwargs):
        super().__init__(**kwargs)
        self.api_key = api_key or os.getenv("PERPLEXITY_API_KEY")
        self.model = model or os.getenv("PERPLEXITY_MODEL", "sonar")
        self.base_url = "https://api.perplexity.ai"
        
    def is_available(self) -> bool:
        """Check if Perplexity provider is available (has API key)."""
        return bool(self.api_key)
    
    async def generate_text(self, prompt: str, **kwargs) -> str:
        """Generate text using Perplexity API."""
        if not self.is_available():
            raise AIProviderError("Perplexity provider is not available (missing API key)")
        
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
                "max_tokens": kwargs.get("max_tokens", 1000),
                "temperature": kwargs.get("temperature", 0.7),
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
            logger.error(f"Perplexity API error: {str(e)}")
            raise AIProviderError(f"Perplexity API error: {str(e)}") from e

    async def generate_text_stream(self, prompt: str, **kwargs) -> AsyncGenerator[str, None]:
        """Generate text stream using Perplexity API."""
        if not self.is_available():
            raise AIProviderError("Perplexity provider is not available (missing API key)")
        
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
                "max_tokens": kwargs.get("max_tokens", 1000),
                "temperature": kwargs.get("temperature", 0.7),
                "stream": True
            }
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload
                ) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            data = line[6:].strip()
                            if data == "[DONE]":
                                break
                            try:
                                chunk = json.loads(data)
                                if "choices" in chunk and chunk["choices"]:
                                    delta = chunk["choices"][0].get("delta", {})
                                    if "content" in delta:
                                        yield delta["content"]
                            except (json.JSONDecodeError, KeyError):
                                continue
            
        except Exception as e:
            logger.error(f"Perplexity API error: {str(e)}")
            raise AIProviderError(f"Perplexity API error: {str(e)}") from e