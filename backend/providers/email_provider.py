"""
Email provider for sending email notifications using SMTP.
Handles email sending with support for HTML and plain text content.
"""
import os
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, Optional, List
from .base_provider import AIProviderError

logger = logging.getLogger(__name__)

class EmailProvider:
    """Email provider for SMTP-based email notifications."""
    
    def __init__(self, smtp_server: Optional[str] = None, smtp_port: Optional[int] = None,
                 email_user: Optional[str] = None, email_password: Optional[str] = None,
                 default_from: Optional[str] = None, **kwargs):
        """
        Initialize the email provider with SMTP settings.
        
        Args:
            smtp_server: SMTP server hostname
            smtp_port: SMTP server port
            email_user: Email username for authentication
            email_password: Email password for authentication
            default_from: Default from address for emails
        """
        self.smtp_server = smtp_server or os.getenv("SMTP_SERVER")
        self.smtp_port = smtp_port or int(os.getenv("SMTP_PORT", 587))
        self.email_user = email_user or os.getenv("EMAIL_USER")
        self.email_password = email_password or os.getenv("EMAIL_PASSWORD")
        self.default_from = default_from or os.getenv("EMAIL_FROM", self.email_user)
        
    def is_available(self) -> bool:
        """Check if email provider is available (has required credentials)."""
        return bool(self.smtp_server and self.email_user and self.email_password)
    
    async def send_email(self, to_email: str, subject: str, message: str, 
                        from_email: Optional[str] = None, html_message: Optional[str] = None,
                        cc: Optional[List[str]] = None, bcc: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Send an email using SMTP.
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            message: Plain text message content
            from_email: Sender email address (defaults to configured from address)
            html_message: HTML content (optional, for multipart emails)
            cc: List of CC email addresses
            bcc: List of BCC email addresses
            
        Returns:
            Dictionary with email details and status
            
        Raises:
            AIProviderError: If email sending fails
        """
        if not self.is_available():
            raise AIProviderError("Email provider is not available (missing SMTP credentials)")
        
        from_email = from_email or self.default_from
        if not from_email:
            raise AIProviderError("No from email address specified")
        
        try:
            # Create message container
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = from_email
            msg['To'] = to_email
            
            if cc:
                msg['Cc'] = ', '.join(cc)
            if bcc:
                msg['Bcc'] = ', '.join(bcc)
            
            # Create the body of the message (plain text and HTML versions)
            part1 = MIMEText(message, 'plain')
            msg.attach(part1)
            
            if html_message:
                part2 = MIMEText(html_message, 'html')
                msg.attach(part2)
            
            # Determine recipients
            recipients = [to_email]
            if cc:
                recipients.extend(cc)
            if bcc:
                recipients.extend(bcc)
            
            # Send the message via SMTP server
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()  # Secure the connection
                server.login(self.email_user, self.email_password)
                server.sendmail(from_email, recipients, msg.as_string())
            
            logger.info(f"Email sent to {to_email}: {subject}")
            return {
                "status": "sent",
                "to": to_email,
                "from": from_email,
                "subject": subject,
                "message": message,
                "has_html": html_message is not None
            }
            
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"SMTP authentication error: {str(e)}")
            raise AIProviderError(f"SMTP authentication failed: {str(e)}") from e
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error: {str(e)}")
            raise AIProviderError(f"Failed to send email: {str(e)}") from e
        except Exception as e:
            logger.error(f"Unexpected email error: {str(e)}")
            raise AIProviderError(f"Unexpected error sending email: {str(e)}") from e
    
    async def send_bulk_emails(self, to_emails: List[str], subject: str, message: str,
                              from_email: Optional[str] = None, html_message: Optional[str] = None,
                              cc: Optional[List[str]] = None, bcc: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Send bulk emails to multiple recipients.
        
        Args:
            to_emails: List of recipient email addresses
            subject: Email subject
            message: Plain text message content
            from_email: Sender email address
            html_message: HTML content (optional)
            cc: List of CC email addresses
            bcc: List of BCC email addresses
            
        Returns:
            Dictionary with results for each email
            
        Raises:
            AIProviderError: If bulk email sending fails
        """
        results = {}
        for email in to_emails:
            try:
                result = await self.send_email(
                    to_email=email,
                    subject=subject,
                    message=message,
                    from_email=from_email,
                    html_message=html_message,
                    cc=cc,
                    bcc=bcc
                )
                results[email] = {"status": "success", "result": result}
            except AIProviderError as e:
                results[email] = {"status": "error", "error": str(e)}
                logger.error(f"Failed to send email to {email}: {str(e)}")
        
        return {
            "total_recipients": len(to_emails),
            "successful": sum(1 for r in results.values() if r["status"] == "success"),
            "failed": sum(1 for r in results.values() if r["status"] == "error"),
            "results": results
        }