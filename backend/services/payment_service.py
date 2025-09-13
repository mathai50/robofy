"""
PayPal payment service for handling payment processing.
"""
import paypalrestsdk
import logging
from typing import Dict, Optional
from sqlalchemy.orm import Session

from config import settings
from database import Payment

# Configure logging
logger = logging.getLogger(__name__)

class PaymentService:
    def __init__(self):
        """Initialize PayPal SDK with configuration from settings."""
        self.configure_paypal()

    def configure_paypal(self):
        """Configure PayPal SDK with credentials from settings."""
        paypalrestsdk.configure({
            "mode": settings.PAYPAL_MODE,
            "client_id": settings.PAYPAL_CLIENT_ID,
            "client_secret": settings.PAYPAL_CLIENT_SECRET
        })

    async def create_payment(
        self,
        db: Session,
        user_id: int,
        amount: float,
        currency: str,
        description: str
    ) -> Optional[Dict]:
        """Create a PayPal payment and store it in the database."""
        try:
            # Create PayPal payment
            payment = paypalrestsdk.Payment({
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "transactions": [{
                    "amount": {
                        "total": f"{amount:.2f}",
                        "currency": currency
                    },
                    "description": description
                }],
                "redirect_urls": {
                    "return_url": f"{settings.CORS_ORIGINS[0]}/payment/success",
                    "cancel_url": f"{settings.CORS_ORIGINS[0]}/payment/cancel"
                }
            })

            if payment.create():
                # Store payment in database
                db_payment = Payment(
                    user_id=user_id,
                    amount=amount,
                    currency=currency,
                    status="pending",
                    paypal_payment_id=payment.id,
                    description=description
                )
                db.add(db_payment)
                db.commit()
                db.refresh(db_payment)

                logger.info(f"Payment created successfully: {payment.id}")
                return {
                    "payment_id": payment.id,
                    "approval_url": next(link.href for link in payment.links if link.rel == "approval_url"),
                    "db_payment_id": db_payment.id
                }
            else:
                logger.error(f"Failed to create PayPal payment: {payment.error}")
                return None

        except Exception as e:
            logger.error(f"Error creating payment: {str(e)}")
            return None

    async def execute_payment(
        self,
        db: Session,
        payment_id: str,
        payer_id: str
    ) -> bool:
        """Execute a PayPal payment after user approval."""
        try:
            payment = paypalrestsdk.Payment.find(payment_id)

            if payment.execute({"payer_id": payer_id}):
                # Update payment status in database
                db_payment = db.query(Payment).filter(Payment.paypal_payment_id == payment_id).first()
                if db_payment:
                    db_payment.status = "completed"
                    db.commit()
                    logger.info(f"Payment executed successfully: {payment_id}")
                    return True
            else:
                logger.error(f"Failed to execute payment: {payment.error}")
                return False

        except Exception as e:
            logger.error(f"Error executing payment: {str(e)}")
            return False

    async def get_payment_status(
        self,
        db: Session,
        payment_id: str
    ) -> Optional[Dict]:
        """Get payment status from PayPal and update database."""
        try:
            payment = paypalrestsdk.Payment.find(payment_id)
            db_payment = db.query(Payment).filter(Payment.paypal_payment_id == payment_id).first()

            if db_payment:
                db_payment.status = payment.state.lower()
                db.commit()
                return {
                    "status": payment.state.lower(),
                    "amount": payment.transactions[0].amount.total,
                    "currency": payment.transactions[0].amount.currency,
                    "created_at": db_payment.created_at
                }
            return None

        except Exception as e:
            logger.error(f"Error getting payment status: {str(e)}")
            return None

    async def refund_payment(
        self,
        db: Session,
        payment_id: str,
        amount: Optional[float] = None
    ) -> bool:
        """Refund a PayPal payment."""
        try:
            payment = paypalrestsdk.Payment.find(payment_id)
            sale_id = payment.transactions[0].related_resources[0].sale.id

            refund = paypalrestsdk.Refund({
                "amount": {
                    "total": f"{amount:.2f}" if amount else payment.transactions[0].amount.total,
                    "currency": payment.transactions[0].amount.currency
                }
            })

            if refund.create(sale_id):
                # Update payment status in database
                db_payment = db.query(Payment).filter(Payment.paypal_payment_id == payment_id).first()
                if db_payment:
                    db_payment.status = "refunded"
                    db.commit()
                    logger.info(f"Payment refunded successfully: {payment_id}")
                    return True
            else:
                logger.error(f"Failed to refund payment: {refund.error}")
                return False

        except Exception as e:
            logger.error(f"Error refunding payment: {str(e)}")
            return False

# Create global payment service instance
payment_service = PaymentService()