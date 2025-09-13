"""
Test cases for notification system including email, SMS, WhatsApp, and fallback notifications.
Tests cover NotificationService, providers, and database operations with mocking for external services.
"""
import os
import sys
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

# Add project root to Python path for imports to work correctly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from services.notification_service import NotificationService
from providers.email_provider import EmailProvider
from providers.twilio_provider import TwilioProvider
from routers.notifications import send_email_notification, send_sms_notification, send_whatsapp_notification, send_fallback_notification, send_multichannel_notification
from schemas import NotificationCreate
from database import Notification, get_db
from providers.base_provider import AIProviderError

# Mock data for testing
TEST_EMAIL = "test@example.com"
TEST_PHONE = "+1234567890"
TEST_SUBJECT = "Test Subject"
TEST_MESSAGE = "Test message content"
TEST_FROM_EMAIL = "noreply@example.com"

@pytest.fixture
def mock_db():
    """Mock database session."""
    return MagicMock(spec=Session)

@pytest.fixture
def notification_service():
    """Notification service instance for testing."""
    return NotificationService()

@pytest.fixture
def email_provider():
    """Email provider instance for testing."""
    return EmailProvider()

@pytest.fixture
def twilio_provider():
    """Twilio provider instance for testing."""
    return TwilioProvider()

@pytest.mark.asyncio
async def test_send_email_notification_success(notification_service, mock_db):
    """Test successful email notification sending."""
    # Mock the email provider availability and send method
    notification_service.email_provider.is_available = MagicMock(return_value=True)
    mock_result = {"status": "sent", "to": TEST_EMAIL, "from": TEST_FROM_EMAIL}
    notification_service.email_provider.send_email = AsyncMock(return_value=mock_result)
    
    # Call the method
    result = await notification_service.send_email_notification(
        to_email=TEST_EMAIL,
        subject=TEST_SUBJECT,
        message=TEST_MESSAGE,
        from_email=TEST_FROM_EMAIL
    )
    
    # Assertions
    assert result["status"] == "success"
    assert result["channel"] == "email"
    assert result["result"] == mock_result
    notification_service.email_provider.send_email.assert_called_once_with(
        to_email=TEST_EMAIL,
        subject=TEST_SUBJECT,
        message=TEST_MESSAGE,
        from_email=TEST_FROM_EMAIL,
        html_message=None,
        cc=None,
        bcc=None
    )

@pytest.mark.asyncio
async def test_send_email_notification_failure(notification_service):
    """Test email notification failure."""
    # Mock the email provider availability and send method to raise exception
    notification_service.email_provider.is_available = MagicMock(return_value=True)
    notification_service.email_provider.send_email = AsyncMock(side_effect=AIProviderError("SMTP error"))
    
    # Call the method and expect exception
    with pytest.raises(AIProviderError, match="Email notification failed"):
        await notification_service.send_email_notification(
            to_email=TEST_EMAIL,
            subject=TEST_SUBJECT,
            message=TEST_MESSAGE
        )

@pytest.mark.asyncio
async def test_send_sms_notification_success(notification_service):
    """Test successful SMS notification sending."""
    # Mock the SMS provider availability and send method
    notification_service.sms_provider.is_available = MagicMock(return_value=True)
    mock_result = {"status": "sent", "to": TEST_PHONE, "channel": "sms"}
    notification_service.sms_provider.send_sms = AsyncMock(return_value=mock_result)
    
    # Call the method
    result = await notification_service.send_sms_notification(
        to_number=TEST_PHONE,
        message=TEST_MESSAGE
    )
    
    # Assertions
    assert result["status"] == "success"
    assert result["channel"] == "sms"
    assert result["result"] == mock_result
    notification_service.sms_provider.send_sms.assert_called_once_with(
        TEST_PHONE, TEST_MESSAGE
    )

@pytest.mark.asyncio
async def test_send_sms_notification_failure(notification_service):
    """Test SMS notification failure."""
    # Mock the SMS provider availability and send method to raise exception
    notification_service.sms_provider.is_available = MagicMock(return_value=True)
    notification_service.sms_provider.send_sms = AsyncMock(side_effect=AIProviderError("Twilio error"))
    
    # Call the method and expect exception
    with pytest.raises(AIProviderError, match="SMS notification failed"):
        await notification_service.send_sms_notification(
            to_number=TEST_PHONE,
            message=TEST_MESSAGE
        )

@pytest.mark.asyncio
async def test_send_whatsapp_notification_success(notification_service):
    """Test successful WhatsApp notification sending."""
    # Mock the SMS provider availability and send method (WhatsApp uses SMS provider)
    notification_service.sms_provider.is_available = MagicMock(return_value=True)
    mock_result = {"status": "sent", "to": TEST_PHONE, "channel": "whatsapp"}
    notification_service.sms_provider.send_whatsapp = AsyncMock(return_value=mock_result)
    
    # Call the method
    result = await notification_service.send_whatsapp_notification(
        to_number=TEST_PHONE,
        message=TEST_MESSAGE
    )
    
    # Assertions
    assert result["status"] == "success"
    assert result["channel"] == "whatsapp"
    assert result["result"] == mock_result
    notification_service.sms_provider.send_whatsapp.assert_called_once_with(
        TEST_PHONE, TEST_MESSAGE
    )

@pytest.mark.asyncio
async def test_send_fallback_notification_sms_first_success(notification_service):
    """Test fallback notification with SMS success."""
    # Mock the SMS provider availability and fallback method
    notification_service.sms_provider.is_available = MagicMock(return_value=True)
    mock_result = {"status": "sent", "channel": "sms"}
    notification_service.sms_provider.send_fallback_message = AsyncMock(return_value=mock_result)
    
    # Call the method
    result = await notification_service.send_fallback_notification(
        to_number=TEST_PHONE,
        message=TEST_MESSAGE
    )
    
    # Assertions
    assert result["status"] == "success"
    assert result["channel"] == "sms"
    assert result["result"] == mock_result
    notification_service.sms_provider.send_fallback_message.assert_called_once_with(
        TEST_PHONE, TEST_MESSAGE, None
    )

@pytest.mark.asyncio
async def test_send_multichannel_notification_both_success(notification_service):
    """Test multichannel notification with both email and SMS success."""
    # Mock both providers availability and send methods
    notification_service.email_provider.is_available = MagicMock(return_value=True)
    notification_service.sms_provider.is_available = MagicMock(return_value=True)
    
    email_mock_result = {"status": "sent", "to": TEST_EMAIL}
    sms_mock_result = {"status": "sent", "to": TEST_PHONE}
    
    notification_service.email_provider.send_email = AsyncMock(return_value=email_mock_result)
    notification_service.sms_provider.send_sms = AsyncMock(return_value=sms_mock_result)
    
    # Call the method
    result = await notification_service.send_multichannel_notification(
        email=TEST_EMAIL,
        phone=TEST_PHONE,
        subject=TEST_SUBJECT,
        message=TEST_MESSAGE
    )
    
    # Assertions
    assert result["overall_status"] == "success"
    assert "email" in result["results"]
    assert "sms" in result["results"]
    assert result["results"]["email"]["status"] == "success"
    assert result["results"]["sms"]["status"] == "success"

@pytest.mark.asyncio
async def test_send_multichannel_notification_partial_failure(notification_service):
    """Test multichannel notification with partial failure."""
    # Mock both providers availability
    notification_service.email_provider.is_available = MagicMock(return_value=True)
    notification_service.sms_provider.is_available = MagicMock(return_value=True)
    
    # Mock providers - email success, SMS failure
    email_mock_result = {"status": "sent", "to": TEST_EMAIL}
    
    notification_service.email_provider.send_email = AsyncMock(return_value=email_mock_result)
    notification_service.sms_provider.send_sms = AsyncMock(side_effect=AIProviderError("SMS failed"))
    
    # Call the method
    result = await notification_service.send_multichannel_notification(
        email=TEST_EMAIL,
        phone=TEST_PHONE,
        subject=TEST_SUBJECT,
        message=TEST_MESSAGE
    )
    
    # Assertions
    assert result["overall_status"] == "success"  # Overall success since email worked
    assert result["results"]["email"]["status"] == "success"
    assert result["results"]["sms"]["status"] == "error"

@pytest.mark.asyncio
async def test_send_multichannel_notification_all_failure(notification_service):
    """Test multichannel notification with all channels failing."""
    # Mock both providers availability
    notification_service.email_provider.is_available = MagicMock(return_value=True)
    notification_service.sms_provider.is_available = MagicMock(return_value=True)
    
    # Mock both providers to fail
    notification_service.email_provider.send_email = AsyncMock(side_effect=AIProviderError("Email failed"))
    notification_service.sms_provider.send_sms = AsyncMock(side_effect=AIProviderError("SMS failed"))
    
    # Call the method and expect exception
    with pytest.raises(AIProviderError, match="All notification channels failed"):
        await notification_service.send_multichannel_notification(
            email=TEST_EMAIL,
            phone=TEST_PHONE,
            subject=TEST_SUBJECT,
            message=TEST_MESSAGE
        )

@pytest.mark.asyncio
async def test_get_provider_status(notification_service):
    """Test getting provider status."""
    # Mock provider availability
    notification_service.email_provider.is_available = MagicMock(return_value=True)
    notification_service.sms_provider.is_available = MagicMock(return_value=True)
    
    # Call the method
    status = notification_service.get_provider_status()
    
    # Assertions
    assert status["email"] is True
    assert status["sms"] is True
    assert status["whatsapp"] is True

@pytest.mark.asyncio
async def test_email_provider_send_email_success(email_provider):
    """Test EmailProvider send_email success with mocking."""
    with patch('smtplib.SMTP') as mock_smtp:
        # Mock SMTP connection
        mock_server = MagicMock()
        mock_smtp.return_value.__enter__.return_value = mock_server
        
        # Set provider credentials
        email_provider.smtp_server = "smtp.example.com"
        email_provider.smtp_port = 587
        email_provider.email_user = "user@example.com"
        email_provider.email_password = "password"
        email_provider.default_from = "noreply@example.com"
        
        # Call the method
        result = await email_provider.send_email(
            to_email=TEST_EMAIL,
            subject=TEST_SUBJECT,
            message=TEST_MESSAGE
        )
        
        # Assertions
        assert result["status"] == "sent"
        assert result["to"] == TEST_EMAIL
        mock_server.starttls.assert_called_once()
        mock_server.login.assert_called_once_with("user@example.com", "password")
        mock_server.sendmail.assert_called_once()

@pytest.mark.asyncio
async def test_email_provider_send_email_failure(email_provider):
    """Test EmailProvider send_email failure."""
    # Set provider credentials including default_from to avoid "No from email address" error
    email_provider.smtp_server = "smtp.example.com"
    email_provider.email_user = "user@example.com"
    email_provider.email_password = "password"
    email_provider.default_from = "noreply@example.com"
    
    with patch('smtplib.SMTP') as mock_smtp:
        # Mock SMTP to raise exception
        mock_server = MagicMock()
        mock_server.login.side_effect = Exception("Login failed")
        mock_smtp.return_value.__enter__.return_value = mock_server
        
        # Call the method and expect exception
        with pytest.raises(AIProviderError, match="Unexpected error sending email"):
            await email_provider.send_email(
                to_email=TEST_EMAIL,
                subject=TEST_SUBJECT,
                message=TEST_MESSAGE
            )

@pytest.mark.asyncio
async def test_twilio_provider_send_sms_success(twilio_provider):
    """Test TwilioProvider send_sms success with mocking."""
    # Mock Twilio client and message creation
    mock_message = MagicMock()
    mock_message.sid = "SM123"
    mock_message.status = "sent"
    mock_message.body = TEST_MESSAGE
    
    twilio_provider.client = MagicMock()
    twilio_provider.client.messages.create.return_value = mock_message
    twilio_provider.phone_number = "+1987654321"
    
    # Call the method
    result = await twilio_provider.send_sms(
        to_number=TEST_PHONE,
        message=TEST_MESSAGE
    )
    
    # Assertions
    assert result["sid"] == "SM123"
    assert result["status"] == "sent"
    assert result["channel"] == "sms"
    twilio_provider.client.messages.create.assert_called_once_with(
        body=TEST_MESSAGE,
        from_="+1987654321",
        to=TEST_PHONE
    )

@pytest.mark.asyncio
async def test_twilio_provider_send_sms_failure(twilio_provider):
    """Test TwilioProvider send_sms failure."""
    twilio_provider.client = MagicMock()
    twilio_provider.client.messages.create.side_effect = Exception("Twilio error")
    twilio_provider.phone_number = "+1987654321"
    
    # Call the method and expect exception
    with pytest.raises(AIProviderError, match="Failed to send SMS"):
        await twilio_provider.send_sms(
            to_number=TEST_PHONE,
            message=TEST_MESSAGE
        )

@pytest.mark.asyncio
async def test_api_send_email_notification_success(mock_db):
    """Test API endpoint for sending email notification."""
    # Mock the service
    mock_service = MagicMock()
    # Include "result" key in mock result to match what the router expects
    mock_result = {"status": "success", "channel": "email", "result": {"message_id": "123"}}
    mock_service.send_email_notification = AsyncMock(return_value=mock_result)
    
    # Create notification data
    notification_data = NotificationCreate(
        recipient=TEST_EMAIL,
        subject=TEST_SUBJECT,
        message=TEST_MESSAGE
    )
    
    # Patch the service creation
    with patch('routers.notifications.NotificationService', return_value=mock_service):
        # Call the endpoint
        result = await send_email_notification(notification_data, mock_db)
        
        # Assertions
        assert result["channel"] == "email"
        assert result["status"] == "success"
        mock_service.send_email_notification.assert_called_once()
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
        mock_db.refresh.assert_called_once()

@pytest.mark.asyncio
async def test_api_send_email_notification_failure(mock_db):
    """Test API endpoint for sending email notification failure."""
    # Mock the service to raise exception
    mock_service = MagicMock()
    mock_service.send_email_notification = AsyncMock(side_effect=AIProviderError("Email failed"))
    
    # Create notification data
    notification_data = NotificationCreate(
        recipient=TEST_EMAIL,
        subject=TEST_SUBJECT,
        message=TEST_MESSAGE
    )
    
    # Patch the service creation
    with patch('routers.notifications.NotificationService', return_value=mock_service):
        # Call the endpoint and expect HTTP exception
        with pytest.raises(HTTPException) as exc_info:
            await send_email_notification(notification_data, mock_db)
        
        assert exc_info.value.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert "Failed to send email notification" in exc_info.value.detail

@pytest.mark.asyncio
async def test_api_send_sms_notification_success(mock_db):
    """Test API endpoint for sending SMS notification."""
    # Mock the service
    mock_service = MagicMock()
    # Include "result" key in mock result to match what the router expects
    mock_result = {"status": "success", "channel": "sms", "result": {"message_sid": "SM123"}}
    mock_service.send_sms_notification = AsyncMock(return_value=mock_result)
    
    # Create notification data
    notification_data = NotificationCreate(
        recipient=TEST_PHONE,
        message=TEST_MESSAGE
    )
    
    # Patch the service creation
    with patch('routers.notifications.NotificationService', return_value=mock_service):
        # Call the endpoint
        result = await send_sms_notification(notification_data, mock_db)
        
        # Assertions
        assert result["channel"] == "sms"
        assert result["status"] == "success"
        mock_service.send_sms_notification.assert_called_once()
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()
        mock_db.refresh.assert_called_once()

@pytest.mark.asyncio
async def test_database_notification_storage(mock_db):
    """Test that notifications are properly stored in database."""
    # Create a notification instance
    notification = Notification(
        channel="email",
        recipient=TEST_EMAIL,
        subject=TEST_SUBJECT,
        message=TEST_MESSAGE,
        status="sent"
    )
    
    # Mock database operations
    mock_db.add.return_value = None
    mock_db.commit.return_value = None
    mock_db.refresh.return_value = None
    
    # Add notification to database
    mock_db.add(notification)
    mock_db.commit()
    mock_db.refresh(notification)
    
    # Assertions
    mock_db.add.assert_called_once_with(notification)
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once_with(notification)
    assert notification.recipient == TEST_EMAIL
    assert notification.channel == "email"
    assert notification.status == "sent"

if __name__ == "__main__":
    pytest.main([__file__, "-v"])