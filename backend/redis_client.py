"""
Redis client for distributed rate limiting and caching.
Provides connection pooling and utility functions for Redis operations.
"""
import redis
from redis.exceptions import RedisError, ConnectionError, TimeoutError
import logging
from typing import Optional, Any, Union, List, Dict
import json
from datetime import timedelta
from contextlib import contextmanager

from config import settings

logger = logging.getLogger(__name__)

class RedisClient:
    """Redis client with connection pooling and error handling."""
    
    _pool = None
    
    @classmethod
    def get_pool(cls):
        """Get Redis connection pool (singleton)."""
        if cls._pool is None:
            try:
                cls._pool = redis.ConnectionPool.from_url(
                    settings.REDIS_URL,
                    db=settings.REDIS_RATE_LIMIT_DB,
                    socket_timeout=settings.REDIS_CONNECTION_TIMEOUT,
                    max_connections=settings.REDIS_MAX_CONNECTIONS,
                    decode_responses=True
                )
                logger.info("Redis connection pool created successfully")
            except Exception as e:
                logger.error(f"Failed to create Redis connection pool: {str(e)}")
                raise
        return cls._pool
    
    @classmethod
    @contextmanager
    def get_connection(cls):
        """Get a Redis connection from the pool with context management."""
        connection = None
        try:
            pool = cls.get_pool()
            connection = redis.Redis(connection_pool=pool)
            yield connection
        except (ConnectionError, TimeoutError) as e:
            logger.error(f"Redis connection error: {str(e)}")
            raise
        except RedisError as e:
            logger.error(f"Redis operation error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected Redis error: {str(e)}")
            raise
        finally:
            if connection:
                connection.close()
    
    @classmethod
    def is_available(cls) -> bool:
        """Check if Redis is available."""
        try:
            with cls.get_connection() as conn:
                conn.ping()
                return True
        except Exception:
            return False
    
    @classmethod
    def increment_rate_limit(
        cls, 
        key: str, 
        window_seconds: int, 
        limit: int
    ) -> Dict[str, Any]:
        """
        Increment rate limit counter using Redis.
        Returns dictionary with current count, remaining, and reset time.
        """
        try:
            with cls.get_connection() as conn:
                # Use Redis transactions for atomic operations
                pipe = conn.pipeline()
                
                # Get current timestamp
                current_time = conn.time()[0]
                
                # Create window key
                window_key = f"{key}:{current_time // window_seconds}"
                
                # Increment counter
                pipe.incr(window_key)
                pipe.expire(window_key, window_seconds)
                
                # Get current count
                current_count = pipe.execute()[0]
                
                # Calculate remaining requests and reset time
                remaining = max(0, limit - current_count)
                reset_time = ((current_time // window_seconds) + 1) * window_seconds
                
                return {
                    "count": current_count,
                    "remaining": remaining,
                    "reset_time": reset_time,
                    "limit": limit
                }
                
        except RedisError as e:
            logger.error(f"Redis rate limit error for key {key}: {str(e)}")
            # Fallback: allow request if Redis fails
            return {
                "count": 0,
                "remaining": limit,
                "reset_time": 0,
                "limit": limit,
                "error": str(e)
            }
    
    @classmethod
    def get_rate_limit_status(
        cls, 
        key: str, 
        window_seconds: int, 
        limit: int
    ) -> Dict[str, Any]:
        """Get current rate limit status without incrementing."""
        try:
            with cls.get_connection() as conn:
                current_time = conn.time()[0]
                window_key = f"{key}:{current_time // window_seconds}"
                
                current_count = conn.get(window_key)
                if current_count is None:
                    current_count = 0
                else:
                    current_count = int(current_count)
                
                remaining = max(0, limit - current_count)
                reset_time = ((current_time // window_seconds) + 1) * window_seconds
                
                return {
                    "count": current_count,
                    "remaining": remaining,
                    "reset_time": reset_time,
                    "limit": limit
                }
                
        except RedisError as e:
            logger.error(f"Redis rate limit status error for key {key}: {str(e)}")
            return {
                "count": 0,
                "remaining": limit,
                "reset_time": 0,
                "limit": limit,
                "error": str(e)
            }
    
    @classmethod
    def set_key(cls, key: str, value: Any, expire_seconds: Optional[int] = None) -> bool:
        """Set a key-value pair with optional expiration."""
        try:
            with cls.get_connection() as conn:
                if expire_seconds:
                    conn.setex(key, expire_seconds, json.dumps(value))
                else:
                    conn.set(key, json.dumps(value))
                return True
        except RedisError as e:
            logger.error(f"Redis set error for key {key}: {str(e)}")
            return False
    
    @classmethod
    def get_key(cls, key: str) -> Optional[Any]:
        """Get a value by key."""
        try:
            with cls.get_connection() as conn:
                value = conn.get(key)
                if value:
                    return json.loads(value)
                return None
        except RedisError as e:
            logger.error(f"Redis get error for key {key}: {str(e)}")
            return None
    
    @classmethod
    def delete_key(cls, key: str) -> bool:
        """Delete a key."""
        try:
            with cls.get_connection() as conn:
                conn.delete(key)
                return True
        except RedisError as e:
            logger.error(f"Redis delete error for key {key}: {str(e)}")
            return False
    
    @classmethod
    def increment_key(cls, key: str, amount: int = 1) -> Optional[int]:
        """Increment a key by specified amount."""
        try:
            with cls.get_connection() as conn:
                return conn.incrby(key, amount)
        except RedisError as e:
            logger.error(f"Redis increment error for key {key}: {str(e)}")
            return None

# Global Redis client instance
redis_client = RedisClient()