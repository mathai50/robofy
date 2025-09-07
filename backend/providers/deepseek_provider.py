"""
DeepSeek AI provider implementation.
Uses the DeepSeek API for text generation.
"""
import os
import logging
from typing import Optional, Dict, Any, Generator, AsyncGenerator
import httpx
import json
from .base_provider import BaseAIProvider, AIProviderError, RateLimitError, AuthenticationError

logger = logging.getLogger(__name__)

class DeepSeekProvider(BaseAIProvider):
    """DeepSeek AI provider implementation."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "deepseek-chat", 
                 base_url: str = "https://api.deepseek.com", **kwargs):
        super().__init__(**kwargs)
        self.api_key = api_key or os.getenv("DEEPSEEK_API_KEY")
        self.model = model or os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
        self.base_url = base_url or os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
        
    def is_available(self) -> bool:
        """Check if DeepSeek provider is available (has API key)."""
        return bool(self.api_key)
    
    async def generate_text(self, prompt: str, **kwargs) -> str:
        """Generate text using DeepSeek API (non-streaming)."""
        if not self.is_available():
            raise AIProviderError("DeepSeek provider is not available (missing API key)")
        
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
                f"{self.base_url}/v1/chat/completions",
                headers=headers,
                json=payload
            )
            return response["choices"][0]["message"]["content"]
            
        except Exception as e:
            logger.error(f"DeepSeek API error: {str(e)}")
            raise AIProviderError(f"DeepSeek API error: {str(e)}") from e

    async def generate_text_stream(self, prompt: str, **kwargs) -> AsyncGenerator[str, None]:
        """Generate text stream using DeepSeek API."""
        if not self.is_available():
            raise AIProviderError("DeepSeek provider is not available (missing API key)")
        
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
                "stream": True
            }
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/v1/chat/completions",
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
                            except json.JSONDecodeError:
                                continue
            
        except Exception as e:
            logger.error(f"DeepSeek API error: {str(e)}")
            raise AIProviderError(f"DeepSeek API error: {str(e)}") from e
    
    async def models(self) -> Dict[str, Any]:
        """Get available DeepSeek models."""
        if not self.is_available():
            raise AIProviderError("DeepSeek provider is not available (missing API key)")
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = await self._make_request(
                "GET",
                f"{self.base_url}/v1/models",
                headers=headers
            )
            
            return response
            
        except Exception as e:
            logger.error(f"DeepSeek models error: {str(e)}")
            raise AIProviderError(f"DeepSeek models error: {str(e)}") from e