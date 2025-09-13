"""
Notification service for handling email and SMS notifications.
Provides a unified interface for sending notifications through multiple channels.
"""
import logging
from typing import Dict, Any, Optional, List, Literal
from providers.email_provider import EmailProvider
from providers.twilio_provider import TwilioProvider
from providers.base_provider import AIProviderError

logger = logging.getLogger(__name__)

class NotificationService:
    """Service for sending notifications via email and SMS."""
    
    def __init__(self):
        """Initialize notification service with email and SMS providers."""
        self.email_provider = EmailProvider()
        self.sms_provider = TwilioProvider()
    
    async def send_email_notification(self, to_email: str, subject: str, message: str, 
                                    from_email: Optional[str] = None, 
                                    html_message: Optional[str] = None,
                                    cc: Optional[List[str]] = None, 
                                    bcc: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Send an email notification.
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            message: Plain text message content
            from_email: Sender email address (optional)
            html_message: HTML content (optional)
            cc: List of CC email addresses (optional)
            bcc: List of BCC email addresses (optional)
            
        Returns:
            Dictionary with notification details and status
            
        Raises:
            AIProviderError: If email sending fails
        """
        if not self.email_provider.is_available():
            raise AIProviderError("Email provider is not available")
        
        try:
            result = await self.email_provider.send_email(
                to_email=to_email,
                subject=subject,
                message=message,
                from_email=from_email,
                html_message=html_message,
                cc=cc,
                bcc=bcc
            )
            
            logger.info(f"Email notification sent to {to_email}: {subject}")
            return {
                "channel": "email",
                "status": "success",
                "result": result
            }
            
        except AIProviderError as e:
            logger.error(f"Failed to send email notification to {to_email}: {str(e)}")
            raise AIProviderError(f"Email notification failed: {str(e)}") from e
    
    async def send_sms_notification(self, to_number: str, message: str) -> Dict[str, Any]:
        """
        Send an SMS notification.
        
        Args:
            to_number: Recipient phone number
            message: Message content to send
            
        Returns:
            Dictionary with notification details and status
            
        Raises:
            AIProviderError: If SMS sending fails
        """
        if not self.sms_provider.is_available():
            raise AIProviderError("SMS provider is not available")
        
        try:
            result = await self.sms_provider.send_sms(to_number, message)
            
            logger.info(f"SMS notification sent to {to_number}")
            return {
                "channel": "sms",
                "status": "success",
                "result": result
            }
            
        except AIProviderError as e:
            logger.error(f"Failed to send SMS notification to {to_number}: {str(e)}")
            raise AIProviderError(f"SMS notification failed: {str(e)}") from e
    
    async def send_whatsapp_notification(self, to_number: str, message: str) -> Dict[str, Any]:
        """
        Send a WhatsApp notification.
        
        Args:
            to_number: Recipient phone number
            message: Message content to send
            
        Returns:
            Dictionary with notification details and status
            
        Raises:
            AIProviderError: If WhatsApp sending fails
        """
        if not self.sms_provider.is_available():
            raise AIProviderError("WhatsApp provider is not available")
        
        try:
            result = await self.sms_provider.send_whatsapp(to_number, message)
            
            logger.info(f"WhatsApp notification sent to {to_number}")
            return {
                "channel": "whatsapp",
                "status": "success",
                "result": result
            }
            
        except AIProviderError as e:
            logger.error(f"Failed to send WhatsApp notification to {to_number}: {str(e)}")
            raise AIProviderError(f"WhatsApp notification failed: {str(e)}") from e
    
    async def send_fallback_notification(self, to_number: str, message: str,
                                       fallback_type: Optional[Literal["sms", "whatsapp"]] = None) -> Dict[str, Any]:
        """
        Send a fallback notification using preferred channel (SMS or WhatsApp).
        If the preferred channel fails, tries the alternative.
        
        Args:
            to_number: Recipient phone number
            message: Message content to send
            fallback_type: Override the default fallback preference
            
        Returns:
            Dictionary with notification details and status
            
        Raises:
            AIProviderError: If both SMS and WhatsApp sending fail
        """
        if not self.sms_provider.is_available():
            raise AIProviderError("SMS provider is not available for fallback")
        
        try:
            result = await self.sms_provider.send_fallback_message(to_number, message, fallback_type)
            
            logger.info(f"Fallback notification sent to {to_number} via {result.get('channel', 'unknown')}")
            return {
                "channel": result.get("channel", "fallback"),
                "status": "success",
                "result": result
            }
            
        except AIProviderError as e:
            logger.error(f"All fallback methods failed for {to_number}: {str(e)}")
            raise AIProviderError(f"All fallback notification methods failed: {str(e)}") from e
    
    async def send_multichannel_notification(self, email: Optional[str] = None, 
                                           phone: Optional[str] = None,
                                           subject: str = "", message: str = "",
                                           html_message: Optional[str] = None) -> Dict[str, Any]:
        """
        Send notification through multiple channels (email and/or SMS).
        
        Args:
            email: Recipient email address (optional)
            phone: Recipient phone number (optional)
            subject: Notification subject (for email)
            message: Message content
            html_message: HTML content for email (optional)
            
        Returns:
            Dictionary with results for each channel
            
        Raises:
            AIProviderError: If all available channels fail
        """
        results = {}
        
        # Send email if provided and provider available
        if email and self.email_provider.is_available():
            try:
                email_result = await self.send_email_notification(
                    to_email=email,
                    subject=subject,
                    message=message,
                    html_message=html_message
                )
                results["email"] = email_result
            except AIProviderError as e:
                results["email"] = {
                    "channel": "email",
                    "status": "error",
                    "error": str(e)
                }
                logger.error(f"Email notification failed for {email}: {str(e)}")
        
        # Send SMS if provided and provider available
        if phone and self.sms_provider.is_available():
            try:
                sms_result = await self.send_sms_notification(phone, message)
                results["sms"] = sms_result
            except AIProviderError as e:
                results["sms"] = {
                    "channel": "sms",
                    "status": "error",
                    "error": str(e)
                }
                logger.error(f"SMS notification failed for {phone}: {str(e)}")
        
        # Check if any notification was successful
        successful = any(result.get("status") == "success" for result in results.values())
        
        if not successful:
            error_msg = "All notification channels failed"
            logger.error(error_msg)
            raise AIProviderError(error_msg)
        
        return {
            "overall_status": "success" if successful else "partial_failure",
            "results": results
        }
    
    def get_provider_status(self) -> Dict[str, bool]:
        """
        Get the availability status of all notification providers.
        
        Returns:
            Dictionary with provider availability status
        """
        return {
            "email": self.email_provider.is_available(),
            "sms": self.sms_provider.is_available(),
            "whatsapp": self.sms_provider.is_available()  # WhatsApp uses same provider as SMS
        }