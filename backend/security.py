"""
Security utilities for API key encryption and decryption.
Uses Fernet symmetric encryption for secure storage of API keys.
"""
from cryptography.fernet import Fernet, MultiFernet
import base64
import logging
from typing import Optional, List
import re
import ipaddress
import binascii
from config import settings

logger = logging.getLogger(__name__)

def validate_encryption_key(key: str) -> bool:
    """
    Validate encryption key format and strength.
    
    Args:
        key: The encryption key to validate
        
    Returns:
        bool: True if key is valid, False otherwise
    """
    if not key:
        return False
    
    # Check if key is a valid base64 string
    try:
        # Ensure proper padding
        key_bytes = key.encode()
        missing_padding = len(key_bytes) % 4
        if missing_padding:
            key_bytes += b'=' * (4 - missing_padding)
        
        decoded_key = base64.urlsafe_b64decode(key_bytes)
        
        # Check key length (Fernet requires 32 bytes)
        if len(decoded_key) != 32:
            return False
            
        # Check if key contains only valid base64 characters
        base64_pattern = r'^[A-Za-z0-9+/=]+$'
        if not re.match(base64_pattern, key):
            return False
            
        return True
        
    except (ValueError, binascii.Error):
        return False

def get_encryption_key() -> bytes:
    """
    Get the encryption key from settings with validation.
    
    Returns:
        bytes: Encryption key for Fernet
    
    Raises:
        ValueError: If encryption key is not configured or invalid
    """
    key = settings.API_KEY_ENCRYPTION_KEY
    if not key:
        raise ValueError("API_KEY_ENCRYPTION_KEY environment variable is required")
    
    # Validate key format
    if not validate_encryption_key(key):
        raise ValueError("Invalid encryption key format. Must be a valid base64 encoded 32-byte key")
    
    # Ensure the key is properly padded for base64 decoding
    key_bytes = key.encode()
    missing_padding = len(key_bytes) % 4
    if missing_padding:
        key_bytes += b'=' * (4 - missing_padding)
    
    return base64.urlsafe_b64decode(key_bytes)

def get_encryption_keys() -> List[bytes]:
    """
    Get multiple encryption keys for key rotation support.
    Returns current key and any previous keys for decryption.
    
    Returns:
        List[bytes]: List of encryption keys for MultiFernet
    
    Raises:
        ValueError: If no valid keys are configured
    """
    keys = []
    
    # Get current key
    try:
        keys.append(get_encryption_key())
    except ValueError:
        logger.warning("Current encryption key is not configured or invalid")
    
    # Get previous keys from environment if available
    previous_keys = getattr(settings, 'API_KEY_ENCRYPTION_PREVIOUS_KEYS', [])
    if isinstance(previous_keys, str):
        previous_keys = [k.strip() for k in previous_keys.split(',') if k.strip()]
    
    for prev_key in previous_keys:
        try:
            # Validate and decode previous key
            if validate_encryption_key(prev_key):
                key_bytes = prev_key.encode()
                missing_padding = len(key_bytes) % 4
                if missing_padding:
                    key_bytes += b'=' * (4 - missing_padding)
                keys.append(base64.urlsafe_b64decode(key_bytes))
        except (ValueError, binascii.Error):
            logger.warning(f"Invalid previous encryption key: {prev_key}")
    
    if not keys:
        raise ValueError("No valid encryption keys configured")
    
    return keys

def encrypt_api_key(plain_key: str) -> str:
    """
    Encrypt an API key using Fernet encryption with key rotation support.
    
    Args:
        plain_key: The plain text API key to encrypt
        
    Returns:
        str: Encrypted API key as base64 string
        
    Raises:
        ValueError: If encryption fails
    """
    try:
        # Use MultiFernet with all available keys for encryption
        # MultiFernet will encrypt with the first key (current key)
        keys = get_encryption_keys()
        fernet = MultiFernet([Fernet(key) for key in keys])
        encrypted = fernet.encrypt(plain_key.encode())
        return encrypted.decode()
    except Exception as e:
        logger.error(f"Failed to encrypt API key: {str(e)}")
        raise ValueError(f"Failed to encrypt API key: {str(e)}")

def decrypt_api_key(encrypted_key: str) -> str:
    """
    Decrypt an API key using Fernet encryption with key rotation support.
    MultiFernet will try all keys until one works for decryption.
    
    Args:
        encrypted_key: The encrypted API key as base64 string
        
    Returns:
        str: Decrypted plain text API key
        
    Raises:
        ValueError: If decryption fails or key is invalid
    """
    try:
        # Use MultiFernet with all available keys for decryption
        # MultiFernet will try all keys until one succeeds
        keys = get_encryption_keys()
        fernet = MultiFernet([Fernet(key) for key in keys])
        decrypted = fernet.decrypt(encrypted_key.encode())
        return decrypted.decode()
    except Exception as e:
        logger.error(f"Failed to decrypt API key: {str(e)}")
        raise ValueError(f"Failed to decrypt API key: {str(e)}")

def generate_encryption_key() -> str:
    """
    Generate a new Fernet encryption key.

    Returns:
        str: Base64 encoded encryption key
    """
    key = Fernet.generate_key()
    return key.decode()

def is_valid_domain(domain: str) -> bool:
    """
    Validate domain format and check if it's a valid domain.
    This performs basic format validation and checks for obvious abuse patterns.
    
    Args:
        domain: Domain string to validate
        
    Returns:
        bool: True if domain appears valid, False otherwise
    """
    if not domain:
        return False
    
    # Remove protocol if present
    domain = domain.replace("https://", "").replace("http://", "").replace("www.", "")
    
    # Remove path and query parameters
    domain = domain.split('/')[0]
    domain = domain.split('?')[0]
    domain = domain.split('#')[0]
    
    # Basic domain format validation
    domain_pattern = r'^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$'
    if not re.match(domain_pattern, domain, re.IGNORECASE):
        return False
    
    # Check for common abuse patterns
    abuse_patterns = [
        r'localhost', r'127\.0\.0\.1', r'192\.168\.', r'10\.', r'172\.(1[6-9]|2[0-9]|3[0-1])\.',
        r'example\.com', r'test\.', r'fake\.', r'dummy\.'
    ]
    
    for pattern in abuse_patterns:
        if re.search(pattern, domain, re.IGNORECASE):
            return False
    
    # Check domain length (reasonable limits)
    if len(domain) > 253:  # Maximum domain length per RFC
        return False
    
    # Check for excessive subdomains (potential abuse)
    if domain.count('.') > 5:
        return False
    
    return True

def validate_ip_address(ip: str) -> bool:
    """
    Validate IP address format and check for private/reserved ranges.
    Allows loopback addresses in development environment.
    
    Args:
        ip: IP address string to validate
        
    Returns:
        bool: True if IP is valid and not in private range, False otherwise
    """
    try:
        ip_obj = ipaddress.ip_address(ip)
        
        # Allow loopback addresses in development environment
        from config import settings
        if settings.ENVIRONMENT == "development" and ip_obj.is_loopback:
            return True
            
        # Check for private/reserved IP ranges
        if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_link_local:
            return False
            
        # Check for multicast and other special ranges
        if ip_obj.is_multicast or ip_obj.is_reserved:
            return False
            
        return True
    except ValueError:
        return False

def sanitize_input(input_str: str, max_length: int = 255) -> str:
    """
    Sanitize user input to prevent injection attacks.
    
    Args:
        input_str: Input string to sanitize
        max_length: Maximum allowed length
        
    Returns:
        str: Sanitized input string
    """
    if not input_str:
        return ""
    
    # Trim whitespace
    input_str = input_str.strip()
    
    # Limit length
    if len(input_str) > max_length:
        input_str = input_str[:max_length]
    
    # Remove potentially dangerous characters
    # Note: This is basic sanitization - adjust based on specific use case
    input_str = re.sub(r'[<>"\'%;()&|]', '', input_str)
    
    return input_str

def generate_api_key() -> str:
    """
    Generate a secure random API key.
    
    Returns:
        str: Base64 encoded random API key
    """
    import secrets
    import base64
    
    # Generate 32 random bytes (256 bits)
    random_bytes = secrets.token_bytes(32)
    
    # Encode as base64 for storage
    api_key = base64.urlsafe_b64encode(random_bytes).decode('utf-8')
    
    # Remove padding for cleaner keys
    api_key = api_key.replace('=', '')
    
    return api_key

class SecurityService:
    """Service class for security operations including encryption, decryption, and validation."""
    
    def __init__(self, config: dict = None):
        self.config = config or {}
    
    def validate_encryption_key(self, key: str) -> bool:
        """Validate encryption key format and strength."""
        return validate_encryption_key(key)
    
    def get_encryption_key(self) -> bytes:
        """Get the encryption key from settings with validation."""
        return get_encryption_key()
    
    def get_encryption_keys(self) -> List[bytes]:
        """Get multiple encryption keys for key rotation support."""
        return get_encryption_keys()
    
    def encrypt_api_key(self, plain_key: str) -> str:
        """Encrypt an API key using Fernet encryption with key rotation support."""
        return encrypt_api_key(plain_key)
    
    def decrypt_api_key(self, encrypted_key: str) -> str:
        """Decrypt an API key using Fernet encryption with key rotation support."""
        return decrypt_api_key(encrypted_key)
    
    def generate_encryption_key(self) -> str:
        """Generate a new Fernet encryption key."""
        return generate_encryption_key()
    
    def is_valid_domain(self, domain: str) -> bool:
        """Validate domain format and check if it's a valid domain."""
        return is_valid_domain(domain)
    
    def validate_ip_address(self, ip: str) -> bool:
        """Validate IP address format and check for private/reserved ranges."""
        return validate_ip_address(ip)
    
    def sanitize_input(self, input_str: str, max_length: int = 255) -> str:
        """Sanitize user input to prevent injection attacks."""
        return sanitize_input(input_str, max_length)
    
    def generate_api_key(self) -> str:
        """Generate a secure random API key."""
        return generate_api_key()