"""
Google AI provider implementation using Gemini API.
"""
import os
import logging
import asyncio
from typing import Optional, Dict, Any
import google.generativeai as genai
from .base_provider import BaseAIProvider, AIProviderError

logger = logging.getLogger(__name__)

class GoogleAIProvider(BaseAIProvider):
    """Google AI provider implementation using Gemini API."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-1.5-flash", **kwargs):
        super().__init__(**kwargs)
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        self.model = model or os.getenv("GOOGLE_MODEL", "gemini-1.5-flash")
        self._configured = False
        
    def _configure(self):
        """Configure the Google AI client."""
        if not self._configured and self.api_key:
            genai.configure(api_key=self.api_key)
            self._configured = True
    
    def is_available(self) -> bool:
        """Check if Google AI provider is available (has API key)."""
        return bool(self.api_key)
    
    async def generate_text(self, prompt: str, **kwargs) -> str:
        """Generate text using Google Gemini API."""
        if not self.is_available():
            raise AIProviderError("Google AI provider is not available (missing API key)")
        
        try:
            self._configure()
            logger.info(f"Using Google AI model: {self.model}")
            model = genai.GenerativeModel(self.model)
            
            generation_config = {
                "temperature": kwargs.get("temperature", 0.7),
                "max_output_tokens": kwargs.get("max_tokens", 1000),
                "top_p": kwargs.get("top_p", 0.9),
                "top_k": kwargs.get("top_k", 40),
            }
            
            response = await asyncio.to_thread(
                model.generate_content,
                prompt,
                generation_config=genai.types.GenerationConfig(**generation_config)
            )
            
            if response.text:
                return response.text
            else:
                raise AIProviderError("Google AI returned empty response")
                
        except Exception as e:
            logger.error(f"Google AI API error: {str(e)}")
            raise AIProviderError(f"Google AI API error: {str(e)}") from e