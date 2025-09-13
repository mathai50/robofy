"""
PayPal payment router for handling payment-related API endpoints.
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from database import get_db, Payment
from auth import get_current_active_user
from services.payment_service import payment_service
from errors import bad_request_error, not_found_error, internal_server_error

# Pydantic models for payment requests and responses
class PaymentCreate(BaseModel):
    amount: float
    currency: str = "USD"
    description: str

class PaymentExecute(BaseModel):
    payment_id: str
    payer_id: str

class PaymentResponse(BaseModel):
    payment_id: str
    status: str
    amount: Optional[float] = None
    currency: Optional[str] = None
    created_at: Optional[datetime] = None

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/create", response_model=PaymentResponse)
async def create_payment(
    payment_data: PaymentCreate,
    current_user=Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new PayPal payment."""
    try:
        result = await payment_service.create_payment(
            db=db,
            user_id=current_user.id,
            amount=payment_data.amount,
            currency=payment_data.currency,
            description=payment_data.description
        )
        
        if not result:
            raise bad_request_error(
                "Failed to create payment",
                "PAYMENT_CREATION_FAILED"
            )
            
        return {
            "payment_id": result["payment_id"],
            "approval_url": result["approval_url"],
            "status": "pending"
        }
        
    except Exception as e:
        raise internal_server_error(
            f"Error creating payment: {str(e)}",
            "PAYMENT_CREATION_ERROR"
        )

@router.post("/execute", response_model=PaymentResponse)
async def execute_payment(
    execute_data: PaymentExecute,
    current_user=Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Execute a PayPal payment after user approval."""
    try:
        success = await payment_service.execute_payment(
            db=db,
            payment_id=execute_data.payment_id,
            payer_id=execute_data.payer_id
        )
        
        if not success:
            raise bad_request_error(
                "Failed to execute payment",
                "PAYMENT_EXECUTION_FAILED"
            )
            
        # Get updated payment status
        payment_status = await payment_service.get_payment_status(db, execute_data.payment_id)
        
        return {
            "payment_id": execute_data.payment_id,
            "status": payment_status["status"] if payment_status else "completed"
        }
        
    except Exception as e:
        raise internal_server_error(
            f"Error executing payment: {str(e)}",
            "PAYMENT_EXECUTION_ERROR"
        )

@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment_status(
    payment_id: str,
    current_user=Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get the status of a specific payment."""
    try:
        payment_status = await payment_service.get_payment_status(db, payment_id)
        
        if not payment_status:
            raise not_found_error(
                "Payment not found",
                "PAYMENT_NOT_FOUND"
            )
            
        return {
            "payment_id": payment_id,
            "status": payment_status["status"]
        }
        
    except Exception as e:
        raise internal_server_error(
            f"Error getting payment status: {str(e)}",
            "PAYMENT_STATUS_ERROR"
        )

@router.get("/", response_model=List[PaymentResponse])
async def get_user_payments(
    current_user=Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all payments for the current user."""
    try:
        payments = db.query(Payment).filter(Payment.user_id == current_user.id).all()
        
        return [
            {
                "payment_id": payment.paypal_payment_id,
                "status": payment.status,
                "amount": payment.amount,
                "currency": payment.currency,
                "created_at": payment.created_at
            }
            for payment in payments
        ]
        
    except Exception as e:
        raise internal_server_error(
            f"Error retrieving payments: {str(e)}",
            "PAYMENTS_RETRIEVAL_ERROR"
        )

@router.post("/webhook")
async def handle_paypal_webhook(
    request: dict,
    db: Session = Depends(get_db)
):
    """Handle PayPal webhook events for payment notifications."""
    try:
        # Verify webhook signature (implementation depends on PayPal SDK)
        # For now, we'll process the webhook data directly
        
        event_type = request.get("event_type")
        resource = request.get("resource", {})
        
        if event_type == "PAYMENT.SALE.COMPLETED":
            payment_id = resource.get("id")
            if payment_id:
                # Update payment status in database
                db_payment = db.query(Payment).filter(Payment.paypal_payment_id == payment_id).first()
                if db_payment:
                    db_payment.status = "completed"
                    db.commit()
        
        elif event_type == "PAYMENT.SALE.REFUNDED":
            payment_id = resource.get("id")
            if payment_id:
                db_payment = db.query(Payment).filter(Payment.paypal_payment_id == payment_id).first()
                if db_payment:
                    db_payment.status = "refunded"
                    db.commit()
        
        return {"status": "webhook_processed"}
        
    except Exception as e:
        raise internal_server_error(
            f"Error processing webhook: {str(e)}",
            "WEBHOOK_PROCESSING_ERROR"
        )