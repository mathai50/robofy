#!/usr/bin/env python3
"""
Test script for API key encryption and decryption functionality.
Run this script to verify the security module works correctly.
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.'))

from security import encrypt_api_key, decrypt_api_key, generate_encryption_key

def test_encryption_decryption():
    """Test that encryption and decryption work correctly."""
    print("🔐 Testing API Key Encryption and Decryption")
    print("=" * 50)
    
    # Test API keys for different providers
    test_api_keys = {
        'openai': 'sk-test1234567890123456789012345678901234567890123',
        'google': 'test-google-api-key-1234567890123456789012',
        'deepseek': 'test_deepseek_api_key_12345678901234567890123456789012',
        'huggingface': 'hf_test_huggingface_api_key_1234567890'
    }
    
    # Generate a test encryption key
    test_key = generate_encryption_key()
    print(f"Generated encryption key: {test_key}")
    
    # Set the encryption key as environment variable
    os.environ['API_KEY_ENCRYPTION_KEY'] = test_key
    
    success_count = 0
    total_tests = len(test_api_keys)
    
    for provider, api_key in test_api_keys.items():
        print(f"\nTesting {provider.upper()} API key...")
        print(f"Original key: {api_key}")
        
        try:
            # Encrypt the API key
            encrypted = encrypt_api_key(api_key)
            print(f"✅ Encrypted successfully")
            
            # Decrypt the API key
            decrypted = decrypt_api_key(encrypted)
            print(f"✅ Decrypted successfully")
            
            # Verify the decrypted key matches the original
            if decrypted == api_key:
                print(f"✅ Verification passed: Original and decrypted keys match")
                success_count += 1
            else:
                print(f"❌ Verification failed: Original and decrypted keys don't match")
                print(f"   Original: {api_key}")
                print(f"   Decrypted: {decrypted}")
                
        except Exception as e:
            print(f"❌ Error processing {provider} key: {str(e)}")
    
    print(f"\n{'='*50}")
    print(f"Test Results: {success_count}/{total_tests} tests passed")
    
    if success_count == total_tests:
        print("🎉 All encryption/decryption tests passed!")
        return True
    else:
        print("❌ Some tests failed!")
        return False

def test_error_handling():
    """Test error handling for invalid inputs."""
    print(f"\n{'='*50}")
    print("🧪 Testing Error Handling")
    print("=" * 50)
    
    # Test with empty encryption key
    original_key = os.environ.get('API_KEY_ENCRYPTION_KEY', '')
    os.environ['API_KEY_ENCRYPTION_KEY'] = ''
    
    try:
        encrypt_api_key('test-key')
        print("❌ Should have failed with empty encryption key")
    except ValueError as e:
        print(f"✅ Correctly handled empty encryption key: {str(e)}")
    
    # Restore original key
    os.environ['API_KEY_ENCRYPTION_KEY'] = original_key
    
    # Test with invalid encrypted data
    try:
        decrypt_api_key('invalid-encrypted-data')
        print("❌ Should have failed with invalid encrypted data")
    except ValueError as e:
        print(f"✅ Correctly handled invalid encrypted data: {str(e)}")
    
    print("✅ Error handling tests completed")

if __name__ == "__main__":
    print("Starting security module tests...")
    
    # Run encryption/decryption tests
    encryption_success = test_encryption_decryption()
    
    # Run error handling tests
    test_error_handling()
    
    print(f"\n{'='*50}")
    if encryption_success:
        print("🎉 All security tests completed successfully!")
        sys.exit(0)
    else:
        print("❌ Security tests failed!")
        sys.exit(1)