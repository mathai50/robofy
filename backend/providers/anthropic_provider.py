"""
Anthropic AI provider implementation using Claude API.
"""
import os
import logging
from typing import Optional, Dict, Any, AsyncGenerator
import httpx
import json
from .base_provider import BaseAIProvider, AIProviderError

logger = logging.getLogger(__name__)

class AnthropicProvider(BaseAIProvider):
    """Anthropic AI provider implementation using Claude API."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "claude-3-sonnet-20240229", **kwargs):
        super().__init__(**kwargs)
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.model = model or os.getenv("ANTHROPIC_MODEL", "claude-3-sonnet-20240229")
        self.base_url = "https://api.anthropic.com/v1"
        
    def is_available(self) -> bool:
        """Check if Anthropic provider is available (has API key)."""
        return bool(self.api_key)
    
    async def generate_text(self, prompt: str, **kwargs) -> str:
        """Generate text using Anthropic Claude API."""
        if not self.is_available():
            raise AIProviderError("Anthropic provider is not available (missing API key)")
        
        try:
            headers = {
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01",
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
                f"{self.base_url}/messages",
                headers=headers,
                json=payload
            )
            
            return response["content"][0]["text"]
            
        except Exception as e:
            logger.error(f"Anthropic API error: {str(e)}")
            raise AIProviderError(f"Anthropic API error: {str(e)}") from e

    async def generate_text_stream(self, prompt: str, **kwargs) -> AsyncGenerator[str, None]:
        """Generate text stream using Anthropic Claude API."""
        if not self.is_available():
            raise AIProviderError("Anthropic provider is not available (missing API key)")
        
        try:
            headers = {
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01",
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
                    f"{self.base_url}/messages",
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
                                if chunk["type"] == "content_block_delta":
                                    yield chunk["delta"]["text"]
                            except (json.JSONDecodeError, KeyError):
                                continue
            
        except Exception as e:
            logger.error(f"Anthropic API error: {str(e)}")
            raise AIProviderError(f"Anthropic API error: {str(e)}") from e