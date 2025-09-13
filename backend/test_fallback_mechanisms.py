"""
Test script for fallback mechanisms (SMS/WhatsApp) in voice communication system.
Tests the Twilio provider fallback functionality and integration with voice routers.
"""
import asyncio
import os
import sys
from unittest.mock import AsyncMock, patch, MagicMock

# Add backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from providers.twilio_provider import TwilioProvider, AIProviderError
from routers.voice_call import send_fallback_notification
from database import get_db, User as UserModel, create_tables
from sqlalchemy.orm import Session

async def test_twilio_fallback_sms_success():
    """Test successful SMS fallback when WhatsApp fails."""
    print("=== Testing SMS Fallback Success ===")
    
    # Mock Twilio client
    mock_client = MagicMock()
    mock_messages = MagicMock()
    mock_client.messages = mock_messages
    
    # Mock WhatsApp failure, SMS success
    mock_messages.create.side_effect = [
        Exception("WhatsApp failed"),  # First call fails (WhatsApp)
        MagicMock(sid="sms_sid_123", status="sent", body="Test message")  # Second call succeeds (SMS)
    ]
    
    with patch.object(TwilioProvider, '_initialize_client'), \
         patch.object(TwilioProvider, 'client', mock_client):
        
        provider = TwilioProvider(
            account_sid="test_sid",
            auth_token="test_token",
            phone_number="+1234567890",
            whatsapp_number="+14155238886",
            fallback_preference="whatsapp"
        )
        provider.client = mock_client
        
        try:
            result = await provider.send_fallback_message("+15551234567", "Test fallback message")
            print(f"✅ Fallback SMS successful: {result}")
            assert result["channel"] == "sms"
            assert result["sid"] == "sms_sid_123"
            print("✅ SMS fallback test passed!\n")
            
        except Exception as e:
            print(f"❌ SMS fallback test failed: {e}")
            raise

async def test_twilio_fallback_whatsapp_success():
    """Test successful WhatsApp fallback when SMS fails."""
    print("=== Testing WhatsApp Fallback Success ===")
    
    # Mock Twilio client
    mock_client = MagicMock()
    mock_messages = MagicMock()
    mock_client.messages = mock_messages
    
    # Mock SMS failure, WhatsApp success
    mock_messages.create.side_effect = [
        Exception("SMS failed"),  # First call fails (SMS)
        MagicMock(sid="whatsapp_sid_123", status="sent", body="Test message")  # Second call succeeds (WhatsApp)
    ]
    
    with patch.object(TwilioProvider, '_initialize_client'), \
         patch.object(TwilioProvider, 'client', mock_client):
        
        provider = TwilioProvider(
            account_sid="test_sid",
            auth_token="test_token",
            phone_number="+1234567890",
            whatsapp_number="+14155238886",
            fallback_preference="sms"
        )
        provider.client = mock_client
        
        try:
            result = await provider.send_fallback_message("+15551234567", "Test fallback message")
            print(f"✅ Fallback WhatsApp successful: {result}")
            assert result["channel"] == "whatsapp"
            assert result["sid"] == "whatsapp_sid_123"
            print("✅ WhatsApp fallback test passed!\n")
            
        except Exception as e:
            print(f"❌ WhatsApp fallback test failed: {e}")
            raise

async def test_twilio_fallback_both_fail():
    """Test when both SMS and WhatsApp fallback methods fail."""
    print("=== Testing Both Fallback Methods Failure ===")
    
    # Mock Twilio client
    mock_client = MagicMock()
    mock_messages = MagicMock()
    mock_client.messages = mock_messages
    
    # Mock both SMS and WhatsApp failure
    mock_messages.create.side_effect = [
        Exception("SMS failed"),
        Exception("WhatsApp failed")
    ]
    
    with patch.object(TwilioProvider, '_initialize_client'), \
         patch.object(TwilioProvider, 'client', mock_client):
        
        provider = TwilioProvider(
            account_sid="test_sid",
            auth_token="test_token",
            phone_number="+1234567890",
            whatsapp_number="+14155238886",
            fallback_preference="sms"
        )
        provider.client = mock_client
        
        try:
            await provider.send_fallback_message("+15551234567", "Test fallback message")
            print("❌ Expected AIProviderError but got success")
            raise AssertionError("Should have raised AIProviderError")
            
        except AIProviderError as e:
            print(f"✅ Both fallback methods failed as expected: {e}")
            print("✅ Both failures test passed!\n")
            
        except Exception as e:
            print(f"❌ Unexpected error type: {e}")
            raise

async def test_voice_call_fallback_integration():
    """Test voice call router integration with fallback notifications."""
    print("=== Testing Voice Call Router Fallback Integration ===")
    
    # Mock database and user
    mock_db = MagicMock()
    mock_user = MagicMock()
    mock_user.id = 1
    mock_user.phone_number = "+15551234567"
    
    mock_db.query.return_value.filter.return_value.first.return_value = mock_user
    
    # Mock Twilio provider success
    mock_twilio = AsyncMock()
    mock_twilio.send_fallback_message.return_value = {
        "sid": "test_sid_123",
        "status": "sent",
        "channel": "sms"
    }
    
    with patch('routers.voice_call.twilio_provider', mock_twilio), \
         patch('routers.voice_call.get_db', return_value=mock_db):
        
        try:
            result = await send_fallback_notification(1, "Test fallback message", mock_db)
            print(f"✅ Voice call fallback integration successful: {result}")
            assert result["channel"] == "sms"
            assert result["status"] == "sent"
            print("✅ Voice call fallback integration test passed!\n")
            
        except Exception as e:
            print(f"❌ Voice call fallback integration test failed: {e}")
            raise

async def test_voice_call_fallback_no_phone_number():
    """Test fallback notification when user has no phone number."""
    print("=== Testing Fallback with No Phone Number ===")
    
    # Mock database and user without phone number
    mock_db = MagicMock()
    mock_user = MagicMock()
    mock_user.id = 1
    mock_user.phone_number = None
    
    mock_db.query.return_value.filter.return_value.first.return_value = mock_user
    
    with patch('routers.voice_call.get_db', return_value=mock_db):
        
        try:
            result = await send_fallback_notification(1, "Test fallback message", mock_db)
            assert result is None
            print("✅ Fallback with no phone number test passed (returned None as expected)\n")
            
        except Exception as e:
            print(f"❌ Fallback with no phone number test failed: {e}")
            raise

async def main():
    """Run all fallback mechanism tests."""
    print("Running Fallback Mechanism Tests...\n")
    
    # Ensure tables are created for integration tests
    create_tables()
    
    await test_twilio_fallback_sms_success()
    await test_twilio_fallback_whatsapp_success()
    await test_twilio_fallback_both_fail()
    await test_voice_call_fallback_integration()
    await test_voice_call_fallback_no_phone_number()
    
    print("🎉 All fallback mechanism tests completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())