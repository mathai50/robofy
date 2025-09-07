"""
AI Service Manager with priority-based fallback logic.
Manages multiple AI providers and handles fallback between them.
"""
import logging
from typing import List, Optional, Dict, Any, AsyncGenerator
import asyncio
from config import settings
from .providers.deepseek_provider import DeepSeekProvider
from .providers.google_provider import GoogleAIProvider
from .providers.openai_provider import OpenAIProvider
from .providers.huggingface_provider import HuggingFaceProvider
from .providers.base_provider import AIProviderError

logger = logging.getLogger(__name__)

class AIServiceManager:
    """Manages multiple AI providers with priority-based fallback."""
    
    def __init__(self):
        self.providers = {}
        self.provider_priority = settings.AI_SERVICE_PRIORITY
        self._initialize_providers()
    
    def _initialize_providers(self):
        """Initialize all available AI providers."""
        self.providers = {
            "deepseek": DeepSeekProvider(
                api_key=settings.DEEPSEEK_API_KEY,
                model=settings.DEEPSEEK_MODEL,
                base_url=settings.DEEPSEEK_BASE_URL,
                timeout=settings.AI_TIMEOUT,
                max_retries=settings.AI_MAX_RETRIES
            ),
            "google": GoogleAIProvider(
                api_key=settings.GOOGLE_API_KEY,
                model=settings.GOOGLE_MODEL,
                timeout=settings.AI_TIMEOUT,
                max_retries=settings.AI_MAX_RETRIES
            ),
            "openai": OpenAIProvider(
                api_key=settings.OPENAI_API_KEY,
                model=settings.OPENAI_MODEL,
                timeout=settings.AI_TIMEOUT,
                max_retries=settings.AI_MAX_RETRIES
            ),
            "huggingface": HuggingFaceProvider(
                api_key=settings.HUGGINGFACE_API_KEY,
                model=settings.HUGGINGFACE_MODEL,
                timeout=settings.AI_TIMEOUT,
                max_retries=settings.AI_MAX_RETRIES
            )
        }
    
    def get_available_providers(self) -> List[str]:
        """Get list of available providers that have API keys configured."""
        return [name for name, provider in self.providers.items() if provider.is_available()]
    
    def get_provider_priority(self) -> List[str]:
        """Get the priority order of providers to use."""
        available_providers = self.get_available_providers()
        
        # Filter priority list to only include available providers
        priority_order = [p for p in self.provider_priority if p in available_providers]
        
        # If no providers are available, return empty list
        if not priority_order:
            logger.warning("No AI providers are available. Please configure API keys.")
        
        return priority_order
    
    async def generate_text(self, prompt: str, **kwargs) -> str:
        """
        Generate text using available AI providers with fallback logic.
        
        Args:
            prompt: The prompt to send to the AI service
            **kwargs: Additional parameters for text generation
            
        Returns:
            Generated text from the first successful provider
            
        Raises:
            AIProviderError: If all providers fail or no providers are available
        """
        priority_order = self.get_provider_priority()
        
        if not priority_order:
            raise AIProviderError("No AI providers are available. Please configure API keys.")
        
        errors = []
        
        for provider_name in priority_order:
            provider = self.providers[provider_name]
            
            try:
                logger.info(f"Attempting text generation with {provider_name} provider")
                result = await provider.generate_text(prompt, **kwargs)
                logger.info(f"Successfully generated text with {provider_name} provider")
                return result
                
            except AIProviderError as e:
                errors.append(f"{provider_name}: {str(e)}")
                logger.warning(f"Provider {provider_name} failed: {str(e)}")
                
                # Continue to next provider if fallback is enabled
                if not settings.AI_FALLBACK_ENABLED:
                    break
        
        # If we get here, all providers failed
        error_message = "All AI providers failed:\n" + "\n".join(errors)
        logger.error(error_message)
        raise AIProviderError(error_message)
    
    async def generate_text_stream(self, prompt: str, **kwargs) -> AsyncGenerator[str, None]:
        """
        Generate text stream using available AI providers with fallback logic.
        
        Args:
            prompt: The prompt to send to the AI service
            **kwargs: Additional parameters for text generation
            
        Yields:
            Text chunks from the first successful provider
            
        Raises:
            AIProviderError: If all providers fail or no providers are available
        """
        priority_order = self.get_provider_priority()
        
        if not priority_order:
            raise AIProviderError("No AI providers are available. Please configure API keys.")
        
        errors = []
        
        for provider_name in priority_order:
            provider = self.providers[provider_name]
            
            try:
                logger.info(f"Attempting text generation with {provider_name} provider (streaming)")
                async for chunk in provider.generate_text_stream(prompt, **kwargs):
                    yield chunk
                logger.info(f"Successfully generated text stream with {provider_name} provider")
                return
                
            except AIProviderError as e:
                errors.append(f"{provider_name}: {str(e)}")
                logger.warning(f"Provider {provider_name} failed: {str(e)}")
                
                # Continue to next provider if fallback is enabled
                if not settings.AI_FALLBACK_ENABLED:
                    break
        
        # If we get here, all providers failed
        error_message = "All AI providers failed:\n" + "\n".join(errors)
        logger.error(error_message)
        raise AIProviderError(error_message)

    async def get_provider_status(self) -> Dict[str, Any]:
        """Get status information for all providers."""
        status = {}
        
        for name, provider in self.providers.items():
            status[name] = {
                "available": provider.is_available(),
                "configured": bool(
                    (name == "deepseek" and settings.DEEPSEEK_API_KEY) or
                    (name == "google" and settings.GOOGLE_API_KEY) or
                    (name == "openai" and settings.OPENAI_API_KEY) or
                    (name == "huggingface" and settings.HUGGINGFACE_API_KEY)
                )
            }
        
        return status
    
    async def close(self):
        """Close all provider connections."""
        for provider in self.providers.values():
            try:
                await provider.close()
            except Exception as e:
                logger.warning(f"Error closing provider: {str(e)}")

# Global instance for easy access
ai_service = AIServiceManager()