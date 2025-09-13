"""
Twilio provider for SMS, WhatsApp, and voice call functionalities.
Handles sending SMS/WhatsApp messages, making voice calls, and managing fallback communications.
"""
import os
import logging
from typing import Optional, Dict, Any, Literal
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse

from .base_provider import BaseAIProvider, AIProviderError

logger = logging.getLogger(__name__)

class TwilioProvider(BaseAIProvider):
    """Twilio provider for SMS, WhatsApp, and voice communications."""
    
    def __init__(self, account_sid: Optional[str] = None, auth_token: Optional[str] = None,
                 phone_number: Optional[str] = None, whatsapp_number: Optional[str] = None,
                 fallback_preference: Literal["sms", "whatsapp"] = "sms", **kwargs):
        super().__init__(**kwargs)
        self.account_sid = account_sid or os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = auth_token or os.getenv("TWILIO_AUTH_TOKEN")
        self.phone_number = phone_number or os.getenv("TWILIO_PHONE_NUMBER")
        self.whatsapp_number = whatsapp_number or os.getenv("TWILIO_WHATSAPP_NUMBER")
        self.fallback_preference = fallback_preference or os.getenv("TWILIO_FALLBACK_PREFERENCE", "sms")
        self.client = None
        self._initialize_client()
        
    def _initialize_client(self):
        """Initialize the Twilio client."""
        if self.account_sid and self.auth_token:
            try:
                self.client = Client(self.account_sid, self.auth_token)
                logger.info("Twilio client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Twilio client: {str(e)}")
                self.client = None
    
    def is_available(self) -> bool:
        """Check if Twilio provider is available (has required credentials)."""
        return bool(self.client and (self.phone_number or self.whatsapp_number))
    
    async def send_sms(self, to_number: str, message: str) -> Dict[str, Any]:
        """
        Send an SMS message using Twilio.
        
        Args:
            to_number: The recipient's phone number
            message: The message content to send
            
        Returns:
            Dictionary with message details and status
            
        Raises:
            AIProviderError: If SMS sending fails
        """
        if not self.is_available() or not self.phone_number:
            raise AIProviderError("Twilio provider is not available (missing credentials)")
        
        try:
            message = self.client.messages.create(
                body=message,
                from_=self.phone_number,
                to=to_number
            )
            
            logger.info(f"SMS sent to {to_number}: {message.sid}")
            return {
                "sid": message.sid,
                "status": message.status,
                "to": to_number,
                "from": self.phone_number,
                "body": message.body,
                "channel": "sms"
            }
            
        except Exception as e:
            logger.error(f"Twilio SMS error: {str(e)}")
            raise AIProviderError(f"Failed to send SMS: {str(e)}") from e

    async def send_whatsapp(self, to_number: str, message: str) -> Dict[str, Any]:
        """
        Send a WhatsApp message using Twilio.
        
        Args:
            to_number: The recipient's phone number (with country code)
            message: The message content to send
            
        Returns:
            Dictionary with message details and status
            
        Raises:
            AIProviderError: If WhatsApp sending fails
        """
        if not self.is_available() or not self.whatsapp_number:
            raise AIProviderError("Twilio WhatsApp provider is not available (missing credentials)")
        
        try:
            # Format number for WhatsApp (whatsapp:+1234567890)
            whatsapp_to = f"whatsapp:{to_number}"
            whatsapp_from = f"whatsapp:{self.whatsapp_number}"
            
            message = self.client.messages.create(
                body=message,
                from_=whatsapp_from,
                to=whatsapp_to
            )
            
            logger.info(f"WhatsApp message sent to {to_number}: {message.sid}")
            return {
                "sid": message.sid,
                "status": message.status,
                "to": to_number,
                "from": self.whatsapp_number,
                "body": message.body,
                "channel": "whatsapp"
            }
            
        except Exception as e:
            logger.error(f"Twilio WhatsApp error: {str(e)}")
            raise AIProviderError(f"Failed to send WhatsApp message: {str(e)}") from e

    async def send_fallback_message(self, to_number: str, message: str,
                                  fallback_type: Optional[Literal["sms", "whatsapp"]] = None) -> Dict[str, Any]:
        """
        Send a fallback message using preferred channel (SMS or WhatsApp).
        If the preferred channel fails, tries the alternative.
        
        Args:
            to_number: The recipient's phone number
            message: The message content to send
            fallback_type: Override the default fallback preference
            
        Returns:
            Dictionary with message details and status
            
        Raises:
            AIProviderError: If both SMS and WhatsApp sending fail
        """
        fallback_type = fallback_type or self.fallback_preference
        
        try:
            if fallback_type == "whatsapp":
                try:
                    return await self.send_whatsapp(to_number, message)
                except AIProviderError:
                    logger.warning("WhatsApp fallback failed, trying SMS")
                    return await self.send_sms(to_number, message)
            else:
                try:
                    return await self.send_sms(to_number, message)
                except AIProviderError:
                    logger.warning("SMS fallback failed, trying WhatsApp")
                    return await self.send_whatsapp(to_number, message)
                    
        except Exception as e:
            logger.error(f"All fallback methods failed for {to_number}: {str(e)}")
            raise AIProviderError(f"All fallback communication methods failed: {str(e)}") from e
    
    async def make_voice_call(self, to_number: str, message: str, 
                            voice_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Make a voice call using Twilio.
        
        Args:
            to_number: The recipient's phone number
            message: The message to speak (if voice_url not provided)
            voice_url: Optional URL to TwiML for custom voice response
            
        Returns:
            Dictionary with call details and status
            
        Raises:
            AIProviderError: If voice call fails
        """
        if not self.is_available():
            raise AIProviderError("Twilio provider is not available (missing credentials)")
        
        try:
            if voice_url:
                # Use custom TwiML URL
                call = self.client.calls.create(
                    url=voice_url,
                    to=to_number,
                    from_=self.phone_number
                )
            else:
                # Generate basic TwiML for text-to-speech
                twiml = self._generate_twiml(message)
                call = self.client.calls.create(
                    twiml=twiml,
                    to=to_number,
                    from_=self.phone_number
                )
            
            logger.info(f"Voice call initiated to {to_number}: {call.sid}")
            return {
                "sid": call.sid,
                "status": call.status,
                "to": to_number,
                "from": self.phone_number
            }
            
        except Exception as e:
            logger.error(f"Twilio voice call error: {str(e)}")
            raise AIProviderError(f"Failed to make voice call: {str(e)}") from e
    
    def _generate_twiml(self, message: str) -> str:
        """
        Generate TwiML for text-to-speech voice response.
        
        Args:
            message: The text to convert to speech
            
        Returns:
            TwiML XML string
        """
        response = VoiceResponse()
        response.say(message, voice='alice', language='en-US')
        return str(response)
    
    async def get_message_status(self, message_sid: str) -> Dict[str, Any]:
        """
        Get the status of a sent message.
        
        Args:
            message_sid: The SID of the message to check
            
        Returns:
            Message status information
        """
        if not self.is_available():
            raise AIProviderError("Twilio provider is not available (missing credentials)")
        
        try:
            message = self.client.messages(message_sid).fetch()
            return {
                "sid": message.sid,
                "status": message.status,
                "to": message.to,
                "from": message.from_,
                "body": message.body,
                "date_created": message.date_created,
                "date_sent": message.date_sent
            }
            
        except Exception as e:
            logger.error(f"Twilio message status error: {str(e)}")
            raise AIProviderError(f"Failed to get message status: {str(e)}") from e
    
    async def get_call_status(self, call_sid: str) -> Dict[str, Any]:
        """
        Get the status of a voice call.
        
        Args:
            call_sid: The SID of the call to check
            
        Returns:
            Call status information
        """
        if not self.is_available():
            raise AIProviderError("Twilio provider is not available (missing credentials)")
        
        try:
            call = self.client.calls(call_sid).fetch()
            return {
                "sid": call.sid,
                "status": call.status,
                "to": call.to,
                "from": call.from_,
                "start_time": call.start_time,
                "end_time": call.end_time,
                "duration": call.duration
            }
            
        except Exception as e:
            logger.error(f"Twilio call status error: {str(e)}")
            raise AIProviderError(f"Failed to get call status: {str(e)}") from e