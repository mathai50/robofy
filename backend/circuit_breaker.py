"""
Circuit Breaker pattern implementation for handling failing services.
Prevents cascading failures by temporarily disabling failing services.
"""
import time
import logging
from typing import Optional, Callable, Any
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

@dataclass
class CircuitBreakerConfig:
    failure_threshold: int = 5
    recovery_timeout: int = 60  # seconds
    half_open_max_attempts: int = 3
    reset_timeout: int = 300  # seconds after which circuit resets to closed

class CircuitBreaker:
    """Circuit breaker implementation for managing service failures."""
    
    def __init__(self, name: str, config: Optional[CircuitBreakerConfig] = None):
        self.name = name
        self.config = config or CircuitBreakerConfig()
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time: Optional[float] = None
        self.half_open_attempts = 0
        self.reset_time: Optional[float] = None
        
    def can_execute(self) -> bool:
        """Check if the circuit breaker allows execution."""
        current_time = time.time()
        
        if self.state == CircuitState.CLOSED:
            return True
            
        elif self.state == CircuitState.OPEN:
            # Check if recovery timeout has passed
            if self.last_failure_time and \
               current_time - self.last_failure_time >= self.config.recovery_timeout:
                self.state = CircuitState.HALF_OPEN
                self.half_open_attempts = 0
                logger.info(f"Circuit breaker {self.name} moving to HALF_OPEN state")
                return True
            return False
            
        elif self.state == CircuitState.HALF_OPEN:
            if self.half_open_attempts < self.config.half_open_max_attempts:
                return True
            return False
            
        return False
    
    def record_success(self):
        """Record a successful execution."""
        if self.state == CircuitState.HALF_OPEN:
            # Successful execution in half-open state, close the circuit
            self.state = CircuitState.CLOSED
            self.failure_count = 0
            self.last_failure_time = None
            self.half_open_attempts = 0
            self.reset_time = time.time() + self.config.reset_timeout
            logger.info(f"Circuit breaker {self.name} moving to CLOSED state")
            
        elif self.state == CircuitState.CLOSED:
            # Reset failure count on consecutive successes
            if self.failure_count > 0:
                self.failure_count = 0
                self.last_failure_time = None
    
    def record_failure(self):
        """Record a failed execution."""
        current_time = time.time()
        
        if self.state == CircuitState.CLOSED:
            self.failure_count += 1
            self.last_failure_time = current_time
            
            if self.failure_count >= self.config.failure_threshold:
                self.state = CircuitState.OPEN
                logger.warning(f"Circuit breaker {self.name} moving to OPEN state after {self.failure_count} failures")
                
        elif self.state == CircuitState.HALF_OPEN:
            self.half_open_attempts += 1
            self.last_failure_time = current_time
            
            if self.half_open_attempts >= self.config.half_open_max_attempts:
                self.state = CircuitState.OPEN
                logger.warning(f"Circuit breaker {self.name} moving back to OPEN state after {self.half_open_attempts} failed half-open attempts")
                
        elif self.state == CircuitState.OPEN:
            # Update last failure time to extend open state
            self.last_failure_time = current_time
    
    def reset(self):
        """Force reset the circuit breaker to closed state."""
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time = None
        self.half_open_attempts = 0
        self.reset_time = None
        logger.info(f"Circuit breaker {self.name} manually reset to CLOSED state")
    
    def get_status(self) -> dict:
        """Get current status of the circuit breaker."""
        return {
            "name": self.name,
            "state": self.state.value,
            "failure_count": self.failure_count,
            "last_failure_time": self.last_failure_time,
            "half_open_attempts": self.half_open_attempts,
            "reset_time": self.reset_time,
            "can_execute": self.can_execute()
        }

def circuit_breaker_decorator(circuit_breaker: CircuitBreaker):
    """Decorator for applying circuit breaker pattern to async functions."""
    def decorator(func: Callable):
        async def wrapper(*args, **kwargs):
            if not circuit_breaker.can_execute():
                raise AIProviderError(f"Circuit breaker {circuit_breaker.name} is open - service temporarily unavailable")
            
            try:
                result = await func(*args, **kwargs)
                circuit_breaker.record_success()
                return result
            except Exception as e:
                circuit_breaker.record_failure()
                raise e
        return wrapper
    return decorator

# Import here to avoid circular imports
from providers.base_provider import AIProviderError