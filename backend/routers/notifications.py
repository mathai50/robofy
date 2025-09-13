"""
Notification router for handling email and SMS notifications API endpoints.
"""
import logging
from typing import Optional, List, Literal
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db, Notification
from services.notification_service import NotificationService
from schemas import NotificationCreate, NotificationResponse, ProviderStatusResponse
from errors import internal_server_error

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.post("/email", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def send_email_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db)
):
    """
    Send an email notification.
    
    Args:
        notification: Notification details including recipient, subject, and message
        db: Database session
        
    Returns:
        Notification response with status and details
    """
    try:
        service = NotificationService()
        result = await service.send_email_notification(
            to_email=notification.recipient,
            subject=notification.subject,
            message=notification.message,
            from_email=notification.from_email,
            html_message=notification.html_message,
            cc=notification.cc,
            bcc=notification.bcc
        )
        
        # Save notification to database
        db_notification = Notification(
            channel="email",
            recipient=notification.recipient,
            subject=notification.subject,
            message=notification.message,
            status=result["status"],
            provider_response=result["result"]
        )
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        
        return {
            "id": db_notification.id,
            "channel": "email",
            "status": result["status"],
            "recipient": notification.recipient,
            "message": notification.message,
            "details": result
        }
        
    except Exception as e:
        logger.error(f"Failed to send email notification: {str(e)}")
        raise internal_server_error(
            f"Failed to send email notification: {str(e)}",
            "EMAIL_NOTIFICATION_FAILED"
        )

@router.post("/sms", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def send_sms_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db)
):
    """
    Send an SMS notification.
    
    Args:
        notification: Notification details including recipient phone number and message
        db: Database session
        
    Returns:
        Notification response with status and details
    """
    try:
        service = NotificationService()
        result = await service.send_sms_notification(
            to_number=notification.recipient,
            message=notification.message
        )
        
        # Save notification to database
        db_notification = Notification(
            channel="sms",
            recipient=notification.recipient,
            message=notification.message,
            status=result["status"],
            provider_response=result["result"]
        )
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        
        return {
            "id": db_notification.id,
            "channel": "sms",
            "status": result["status"],
            "recipient": notification.recipient,
            "message": notification.message,
            "details": result
        }
        
    except Exception as e:
        logger.error(f"Failed to send SMS notification: {str(e)}")
        raise internal_server_error(
            f"Failed to send SMS notification: {str(e)}",
            "SMS_NOTIFICATION_FAILED"
        )

@router.post("/whatsapp", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def send_whatsapp_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db)
):
    """
    Send a WhatsApp notification.
    
    Args:
        notification: Notification details including recipient phone number and message
        db: Database session
        
    Returns:
        Notification response with status and details
    """
    try:
        service = NotificationService()
        result = await service.send_whatsapp_notification(
            to_number=notification.recipient,
            message=notification.message
        )
        
        # Save notification to database
        db_notification = Notification(
            channel="whatsapp",
            recipient=notification.recipient,
            message=notification.message,
            status=result["status"],
            provider_response=result["result"]
        )
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        
        return {
            "id": db_notification.id,
            "channel": "whatsapp",
            "status": result["status"],
            "recipient": notification.recipient,
            "message": notification.message,
            "details": result
        }
        
    except Exception as e:
        logger.error(f"Failed to send WhatsApp notification: {str(e)}")
        raise internal_server_error(
            f"Failed to send WhatsApp notification: {str(e)}",
            "WHATSAPP_NOTIFICATION_FAILED"
        )

@router.post("/fallback", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def send_fallback_notification(
    notification: NotificationCreate,
    fallback_type: Optional[Literal["sms", "whatsapp"]] = None,
    db: Session = Depends(get_db)
):
    """
    Send a fallback notification (SMS or WhatsApp with fallback to alternative).
    
    Args:
        notification: Notification details including recipient phone number and message
        fallback_type: Preferred fallback channel (sms or whatsapp)
        db: Database session
        
    Returns:
        Notification response with status and details
    """
    try:
        service = NotificationService()
        result = await service.send_fallback_notification(
            to_number=notification.recipient,
            message=notification.message,
            fallback_type=fallback_type
        )
        
        # Save notification to database
        db_notification = Notification(
            channel=result["channel"],
            recipient=notification.recipient,
            message=notification.message,
            status=result["status"],
            provider_response=result["result"]
        )
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        
        return {
            "id": db_notification.id,
            "channel": result["channel"],
            "status": result["status"],
            "recipient": notification.recipient,
            "message": notification.message,
            "details": result
        }
        
    except Exception as e:
        logger.error(f"Failed to send fallback notification: {str(e)}")
        raise internal_server_error(
            f"Failed to send fallback notification: {str(e)}",
            "FALLBACK_NOTIFICATION_FAILED"
        )

@router.post("/multichannel", response_model=dict, status_code=status.HTTP_201_CREATED)
async def send_multichannel_notification(
    email: Optional[str] = None,
    phone: Optional[str] = None,
    subject: str = "",
    message: str = "",
    html_message: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Send notification through multiple channels (email and/or SMS).
    
    Args:
        email: Recipient email address (optional)
        phone: Recipient phone number (optional)
        subject: Notification subject (for email)
        message: Message content
        html_message: HTML content for email (optional)
        db: Database session
        
    Returns:
        Dictionary with results for each channel
    """
    try:
        service = NotificationService()
        result = await service.send_multichannel_notification(
            email=email,
            phone=phone,
            subject=subject,
            message=message,
            html_message=html_message
        )
        
        # Save notifications to database for each successful channel
        for channel, channel_result in result["results"].items():
            if channel_result.get("status") == "success":
                db_notification = Notification(
                    channel=channel,
                    recipient=email if channel == "email" else phone,
                    subject=subject if channel == "email" else None,
                    message=message,
                    status=channel_result["status"],
                    provider_response=channel_result.get("result")
                )
                db.add(db_notification)
        
        db.commit()
        
        return result
        
    except Exception as e:
        logger.error(f"Failed to send multichannel notification: {str(e)}")
        raise internal_server_error(
            f"Failed to send multichannel notification: {str(e)}",
            "MULTICHANNEL_NOTIFICATION_FAILED"
        )

@router.get("/status", response_model=ProviderStatusResponse)
async def get_notification_status():
    """
    Get the availability status of all notification providers.
    
    Returns:
        Dictionary with provider availability status
    """
    try:
        service = NotificationService()
        status = service.get_provider_status()
        return {"providers": status}
    except Exception as e:
        logger.error(f"Failed to get notification status: {str(e)}")
        raise internal_server_error(
            f"Failed to get notification status: {str(e)}",
            "NOTIFICATION_STATUS_FAILED"
        )