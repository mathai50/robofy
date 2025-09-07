"""
Hugging Face provider implementation using Inference API.
"""
import os
import logging
from typing import Optional, Dict, Any
import httpx
from .base_provider import BaseAIProvider, AIProviderError, RateLimitError, AuthenticationError, ServiceUnavailableError

logger = logging.getLogger(__name__)

class HuggingFaceProvider(BaseAIProvider):
    """Hugging Face provider implementation using Inference API."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "google/flan-t5-xxl", **kwargs):
        super().__init__(**kwargs)
        self.api_key = api_key or os.getenv("HUGGINGFACE_API_KEY")
        self.model = model or os.getenv("HUGGINGFACE_MODEL", "google/flan-t5-xxl")
        self.base_url = "https://api-inference.huggingface.co/models"
        
    def is_available(self) -> bool:
        """Check if Hugging Face provider is available (has API key)."""
        return bool(self.api_key)
    
    async def generate_text(self, prompt: str, **kwargs) -> str:
        """Generate text using Hugging Face Inference API."""
        if not self.is_available():
            raise AIProviderError("Hugging Face provider is not available (missing API key)")
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "inputs": prompt,
                "parameters": {
                    "temperature": kwargs.get("temperature", 0.7),
                    "max_new_tokens": kwargs.get("max_tokens", 1000),
                    "top_p": kwargs.get("top_p", 0.9),
                    "top_k": kwargs.get("top_k", 50),
                    "do_sample": True
                }
            }
            
            response = await self._make_request(
                "POST",
                f"{self.base_url}/{self.model}",
                headers=headers,
                json=payload
            )
            
            # Handle different response formats from Hugging Face
            if isinstance(response, list) and len(response) > 0:
                return response[0].get("generated_text", "")
            elif isinstance(response, dict) and "generated_text" in response:
                return response["generated_text"]
            else:
                raise AIProviderError("Unexpected response format from Hugging Face API")
            
        except Exception as e:
            logger.error(f"Hugging Face API error: {str(e)}")
            raise AIProviderError(f"Hugging Face API error: {str(e)}") from e
    
    async def models(self) -> Dict[str, Any]:
        """Get available Hugging Face models (requires different endpoint)."""
        if not self.is_available():
            raise AIProviderError("Hugging Face provider is not available (missing API key)")
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Note: This endpoint might not be standard; adjust if needed
            response = await self._make_request(
                "GET",
                "https://huggingface.co/api/models",
                headers=headers
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Hugging Face models error: {str(e)}")
            raise AIProviderError(f"Hugging Face models error: {str(e)}") from e