"""
AI Service Manager with priority-based fallback logic.
Manages multiple AI providers and handles fallback between them.
"""
import logging
from typing import List, Optional, Dict, Any, AsyncGenerator
import asyncio
from config import settings
from providers.deepseek_provider import DeepSeekProvider
from providers.google_provider import GoogleAIProvider
from providers.openai_provider import OpenAIProvider
from providers.huggingface_provider import HuggingFaceProvider
from providers.assemblyai_provider import AssemblyAIProvider
from providers.twilio_provider import TwilioProvider
from providers.base_provider import AIProviderError
from database import get_async_db, APIKey as APIKeyModel
from security import decrypt_api_key
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Optional
from circuit_breaker import CircuitBreaker

logger = logging.getLogger(__name__)

class AIServiceManager:
    """Manages multiple AI providers with priority-based fallback."""
    
    def __init__(self):
        self.providers = {}
        self.circuit_breakers = {}
        self.provider_priority = settings.AI_SERVICE_PRIORITY
        self._initialize_providers()
        self._initialize_circuit_breakers()
    
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
            ),
            "assemblyai": AssemblyAIProvider(
                api_key=settings.ASSEMBLYAI_API_KEY,
                timeout=settings.AI_TIMEOUT,
                max_retries=settings.AI_MAX_RETRIES
            ),
            "twilio": TwilioProvider(
                account_sid=settings.TWILIO_ACCOUNT_SID,
                auth_token=settings.TWILIO_AUTH_TOKEN,
                phone_number=settings.TWILIO_PHONE_NUMBER,
                timeout=settings.AI_TIMEOUT,
                max_retries=settings.AI_MAX_RETRIES
            )
        }
    
    def _initialize_circuit_breakers(self):
        """Initialize circuit breakers for all AI providers."""
        from circuit_breaker import CircuitBreaker, CircuitBreakerConfig
        
        circuit_config = CircuitBreakerConfig(
            failure_threshold=settings.CIRCUIT_BREAKER_FAILURE_THRESHOLD,
            recovery_timeout=settings.CIRCUIT_BREAKER_RECOVERY_TIMEOUT,
            half_open_max_attempts=settings.CIRCUIT_BREAKER_HALF_OPEN_MAX_ATTEMPTS,
            reset_timeout=settings.CIRCUIT_BREAKER_RESET_TIMEOUT
        )
        
        for provider_name in self.providers.keys():
            self.circuit_breakers[provider_name] = CircuitBreaker(
                name=f"ai_provider_{provider_name}",
                config=circuit_config
            )
    
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
    
    async def generate_text(self, prompt: str, user_id: Optional[int] = None, **kwargs) -> str:
        """
        Generate text using available AI providers with fallback logic.
        Supports user-specific API keys when user_id is provided.
        Includes circuit breaker pattern to handle failing providers.
        
        Args:
            prompt: The prompt to send to the AI service
            user_id: Optional user ID to use user-specific API keys
            **kwargs: Additional parameters for text generation
            
        Returns:
            Generated text from the first successful provider
            
        Raises:
            AIProviderError: If all providers fail or no providers are available
        """
        # Get priority order based on available providers
        priority_order = self.get_provider_priority(user_id)
        
        if not priority_order:
            raise AIProviderError("No AI providers are available. Please configure API keys.")
        
        errors = []
        
        for provider_name in priority_order:
            provider = self.providers[provider_name]
            circuit_breaker = self.circuit_breakers[provider_name]
            
            # Check if circuit breaker allows execution
            if not circuit_breaker.can_execute():
                errors.append(f"{provider_name}: Circuit breaker is open - service temporarily unavailable")
                logger.warning(f"Circuit breaker for {provider_name} is open, skipping provider")
                continue
            
            # If user_id is provided, try to use user-specific API key
            if user_id:
                user_api_key = await self._get_user_api_key(user_id, provider_name)
                if user_api_key:
                    # Temporarily override provider's API key with user's key
                    original_api_key = provider.api_key
                    provider.api_key = user_api_key
                    try:
                        logger.info(f"Attempting text generation with {provider_name} provider using user API key")
                        result = await provider.generate_text(prompt, **kwargs)
                        circuit_breaker.record_success()
                        logger.info(f"Successfully generated text with {provider_name} provider using user API key")
                        return result
                    except Exception as e:
                        circuit_breaker.record_failure()
                        errors.append(f"{provider_name}: {str(e)}")
                        logger.warning(f"Provider {provider_name} failed: {str(e)}")
                    finally:
                        # Restore original API key
                        provider.api_key = original_api_key
            
            # Fall back to environment variable keys or try without user key
            try:
                logger.info(f"Attempting text generation with {provider_name} provider")
                result = await provider.generate_text(prompt, **kwargs)
                circuit_breaker.record_success()
                logger.info(f"Successfully generated text with {provider_name} provider")
                return result
                
            except Exception as e:
                circuit_breaker.record_failure()
                errors.append(f"{provider_name}: {str(e)}")
                logger.warning(f"Provider {provider_name} failed: {str(e)}")
                
                # Continue to next provider if fallback is enabled
                if not settings.AI_FALLBACK_ENABLED:
                    break
        
        # If we get here, all providers failed
        error_message = "All AI providers failed:\n" + "\n".join(errors)
        logger.error(error_message)
        raise AIProviderError(error_message)
    
    async def generate_text_stream(self, prompt: str, user_id: Optional[int] = None, **kwargs) -> AsyncGenerator[str, None]:
        """
        Generate text stream using available AI providers with fallback logic.
        Supports user-specific API keys when user_id is provided.
        Includes circuit breaker pattern to handle failing providers.
        
        Args:
            prompt: The prompt to send to the AI service
            user_id: Optional user ID to use user-specific API keys
            **kwargs: Additional parameters for text generation
            
        Yields:
            Text chunks from the first successful provider
            
        Raises:
            AIProviderError: If all providers fail or no providers are available
        """
        # Get priority order based on available providers
        priority_order = self.get_provider_priority(user_id)
        
        if not priority_order:
            raise AIProviderError("No AI providers are available. Please configure API keys.")
        
        errors = []
        
        for provider_name in priority_order:
            provider = self.providers[provider_name]
            circuit_breaker = self.circuit_breakers[provider_name]
            
            # Check if circuit breaker allows execution
            if not circuit_breaker.can_execute():
                errors.append(f"{provider_name}: Circuit breaker is open - service temporarily unavailable")
                logger.warning(f"Circuit breaker for {provider_name} is open, skipping provider")
                continue
            
            # If user_id is provided, try to use user-specific API key
            if user_id:
                user_api_key = await self._get_user_api_key(user_id, provider_name)
                if user_api_key:
                    # Temporarily override provider's API key with user's key
                    original_api_key = provider.api_key
                    provider.api_key = user_api_key
                    try:
                        logger.info(f"Attempting text generation with {provider_name} provider using user API key (streaming)")
                        async for chunk in provider.generate_text_stream(prompt, **kwargs):
                            yield chunk
                        circuit_breaker.record_success()
                        logger.info(f"Successfully generated text stream with {provider_name} provider using user API key")
                        return
                    except Exception as e:
                        circuit_breaker.record_failure()
                        errors.append(f"{provider_name}: {str(e)}")
                        logger.warning(f"Provider {provider_name} failed: {str(e)}")
                    finally:
                        # Restore original API key
                        provider.api_key = original_api_key
            
            # Fall back to environment variable keys or try without user key
            try:
                logger.info(f"Attempting text generation with {provider_name} provider (streaming)")
                async for chunk in provider.generate_text_stream(prompt, **kwargs):
                    yield chunk
                circuit_breaker.record_success()
                logger.info(f"Successfully generated text stream with {provider_name} provider")
                return
                
            except Exception as e:
                circuit_breaker.record_failure()
                errors.append(f"{provider_name}: {str(e)}")
                logger.warning(f"Provider {provider_name} failed: {str(e)}")
                
                # Continue to next provider if fallback is enabled
                if not settings.AI_FALLBACK_ENABLED:
                    break
        
        # If we get here, all providers failed
        error_message = "All AI providers failed:\n" + "\n".join(errors)
        logger.error(error_message)
        raise AIProviderError(error_message)

    async def get_provider_status(self, user_id: Optional[int] = None) -> Dict[str, Any]:
        """Get status information for all providers."""
        status = {}
        
        for name, provider in self.providers.items():
            # Check if user has API key for this provider
            user_has_key = False
            if user_id:
                user_api_key = await self._get_user_api_key(user_id, name)
                user_has_key = user_api_key is not None
            
            status[name] = {
                "available": provider.is_available() or user_has_key,
                "configured": bool(
                    (name == "google" and settings.GOOGLE_API_KEY) or
                    (name == "deepseek" and settings.DEEPSEEK_API_KEY) or
                    (name == "openai" and settings.OPENAI_API_KEY) or
                    (name == "huggingface" and settings.HUGGINGFACE_API_KEY)
                ),
                "user_has_key": user_has_key
            }
        
        return status
    
    async def close(self):
        """Close all provider connections."""
        for provider in self.providers.values():
            try:
                await provider.close()
            except Exception as e:
                logger.warning(f"Error closing provider: {str(e)}")

    async def _get_user_api_key(self, user_id: int, provider_name: str) -> Optional[str]:
        """Get a user's API key for a specific provider using async database operations."""
        try:
            # Get async database session
            async for db in get_async_db():
                # Find active API key for this user and provider using async query
                result = await db.execute(
                    select(APIKeyModel).where(
                        APIKeyModel.user_id == user_id,
                        APIKeyModel.provider == provider_name,
                        APIKeyModel.is_active == True
                    )
                )
                api_key = result.scalar_one_or_none()
                
                if api_key:
                    # Decrypt the API key
                    return decrypt_api_key(api_key.encrypted_key)
                return None
                
        except Exception as e:
            logger.error(f"Error retrieving user API key: {str(e)}")
            return None

    def get_provider_priority(self, user_id: Optional[int] = None) -> List[str]:
        """Get the priority order of providers to use, considering user-specific keys."""
        available_providers = self.get_available_providers(user_id)
        
        # Filter priority list to only include available providers
        priority_order = [p for p in self.provider_priority if p in available_providers]
        
        # If no providers are available, return empty list
        if not priority_order:
            logger.warning("No AI providers are available. Please configure API keys.")
        
        return priority_order

    def get_available_providers(self, user_id: Optional[int] = None) -> List[str]:
        """Get list of available providers that have API keys configured, including user-specific keys."""
        available_providers = []
        
        for name, provider in self.providers.items():
            # Check if provider is available via environment variables and circuit breaker allows execution
            circuit_breaker = self.circuit_breakers[name]
            if provider.is_available() and circuit_breaker.can_execute():
                available_providers.append(name)
            else:
                # Check if user has an API key for this provider and circuit breaker allows execution
                if user_id and circuit_breaker.can_execute():
                    # We can't use async here, so we'll check synchronously
                    # For simplicity, we'll assume user might have a key
                    # The actual key retrieval will happen in generate_text
                    available_providers.append(name)
        
        return available_providers

# Global instance for easy access
ai_service = AIServiceManager()