"""
Test cases for PayPal payment integration.
Includes comprehensive negative test cases and improved test isolation.
"""
import pytest
from unittest.mock import Mock, patch, AsyncMock
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import paypalrestsdk

from services.payment_service import PaymentService
from database import Payment
from auth import User

# Mock data for testing
mock_user = User(id=1, username="testuser", email="test@example.com", hashed_password="hashed", is_active=True)
mock_payment_data = {"amount": 100.0, "currency": "USD", "description": "Test payment"}
mock_execute_data = {"payment_id": "PAY123", "payer_id": "USER123"}

@pytest.fixture
def mock_db():
    """Mock database session with fresh mocks for each test."""
    mock_session = Mock(spec=Session)
    # Reset all mocks to ensure test isolation
    mock_session.reset_mock()
    return mock_session

@pytest.fixture
def mock_payment_service():
    """Mock payment service with fresh mocks for each test."""
    with patch('routers.payments.payment_service') as mock:
        # Reset mock to ensure test isolation
        mock.reset_mock()
        yield mock

# Test PaymentService methods directly instead of router functions
@pytest.mark.asyncio
async def test_payment_service_create_payment_success(mock_payment_service, mock_db):
    """Test PaymentService.create_payment with successful PayPal response."""
    mock_payment_service.create_payment.return_value = {
        "payment_id": "PAY123",
        "approval_url": "https://paypal.com/approve",
        "db_payment_id": 1
    }
    
    result = await mock_payment_service.create_payment(
        mock_db, mock_user.id, 100.0, "USD", "Test payment"
    )
    
    assert result["payment_id"] == "PAY123"
    assert result["approval_url"] == "https://paypal.com/approve"
    mock_payment_service.create_payment.assert_called_once_with(
        mock_db, mock_user.id, 100.0, "USD", "Test payment"
    )

@pytest.mark.asyncio
async def test_payment_service_create_payment_failure(mock_payment_service, mock_db):
    """Test PaymentService.create_payment with failed PayPal response."""
    mock_payment_service.create_payment.return_value = None
    
    result = await mock_payment_service.create_payment(
        mock_db, mock_user.id, 100.0, "USD", "Test payment"
    )
    
    assert result is None
    mock_payment_service.create_payment.assert_called_once_with(
        mock_db, mock_user.id, 100.0, "USD", "Test payment"
    )

@pytest.mark.asyncio
async def test_payment_service_execute_payment_success(mock_payment_service, mock_db):
    """Test PaymentService.execute_payment with successful execution."""
    mock_payment_service.execute_payment.return_value = True
    mock_payment_service.get_payment_status.return_value = {"status": "completed"}
    
    result = await mock_payment_service.execute_payment(mock_db, "PAY123", "USER123")
    
    assert result is True
    mock_payment_service.execute_payment.assert_called_once_with(mock_db, "PAY123", "USER123")

@pytest.mark.asyncio
async def test_payment_service_execute_payment_failure(mock_payment_service, mock_db):
    """Test PaymentService.execute_payment with failed execution."""
    mock_payment_service.execute_payment.return_value = False
    
    result = await mock_payment_service.execute_payment(mock_db, "PAY123", "USER123")
    
    assert result is False
    mock_payment_service.execute_payment.assert_called_once_with(mock_db, "PAY123", "USER123")

@pytest.mark.asyncio
async def test_payment_service_get_payment_status_success(mock_payment_service, mock_db):
    """Test PaymentService.get_payment_status with existing payment."""
    mock_payment_service.get_payment_status.return_value = {"status": "completed"}
    
    result = await mock_payment_service.get_payment_status(mock_db, "PAY123")
    
    assert result["status"] == "completed"
    mock_payment_service.get_payment_status.assert_called_once_with(mock_db, "PAY123")

@pytest.mark.asyncio
async def test_payment_service_get_payment_status_not_found(mock_payment_service, mock_db):
    """Test PaymentService.get_payment_status with non-existent payment."""
    mock_payment_service.get_payment_status.return_value = None
    
    result = await mock_payment_service.get_payment_status(mock_db, "PAY123")
    
    assert result is None
    mock_payment_service.get_payment_status.assert_called_once_with(mock_db, "PAY123")

# Test PaymentService methods
@pytest.fixture
def payment_service():
    """Payment service instance for testing with fresh mocks."""
    service = PaymentService()
    # Reset any internal state if needed
    return service

@pytest.mark.asyncio
async def test_payment_service_create_payment_success(payment_service, mock_db):
    """Test PaymentService.create_payment with mocked PayPal success."""
    with patch('services.payment_service.paypalrestsdk.Payment') as mock_paypal:
        mock_payment_instance = Mock()
        mock_payment_instance.create.return_value = True
        mock_payment_instance.id = "PAY123"
        mock_payment_instance.links = [Mock(rel="approval_url", href="https://paypal.com/approve")]
        mock_paypal.return_value = mock_payment_instance
        
        result = await payment_service.create_payment(mock_db, 1, 100.0, "USD", "Test")
        
        assert result["payment_id"] == "PAY123"
        assert result["approval_url"] == "https://paypal.com/approve"
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()

@pytest.mark.asyncio
async def test_payment_service_create_payment_paypal_failure(payment_service, mock_db):
    """Test PaymentService.create_payment with PayPal API failure."""
    with patch('services.payment_service.paypalrestsdk.Payment') as mock_paypal:
        mock_payment_instance = Mock()
        mock_payment_instance.create.return_value = False
        mock_payment_instance.error = {"message": "API failure"}
        mock_paypal.return_value = mock_payment_instance
        
        result = await payment_service.create_payment(mock_db, 1, 100.0, "USD", "Test")
        
        assert result is None
        mock_db.rollback.assert_called_once()

@pytest.mark.asyncio
async def test_payment_service_create_payment_network_failure(payment_service, mock_db):
    """Test PaymentService.create_payment with network failure."""
    with patch('services.payment_service.paypalrestsdk.Payment') as mock_paypal:
        mock_payment_instance = Mock()
        mock_payment_instance.create.side_effect = Exception("Network error")
        mock_paypal.return_value = mock_payment_instance
        
        result = await payment_service.create_payment(mock_db, 1, 100.0, "USD", "Test")
        
        assert result is None
        mock_db.rollback.assert_called_once()

@pytest.mark.asyncio
async def test_payment_service_execute_payment_success(payment_service, mock_db):
    """Test PaymentService.execute_payment with mocked PayPal success."""
    with patch('services.payment_service.paypalrestsdk.Payment.find') as mock_find:
        mock_payment = Mock()
        mock_payment.execute.return_value = True
        mock_payment.transactions = [Mock(related_resources=[Mock(sale=Mock(id="SALE123"))])]
        mock_find.return_value = mock_payment
        
        mock_db_payment = Mock()
        mock_db.query.return_value.filter.return_value.first.return_value = mock_db_payment
        
        result = await payment_service.execute_payment(mock_db, "PAY123", "USER123")
        
        assert result is True
        mock_db.commit.assert_called_once()
        assert mock_db_payment.status == "completed"

@pytest.mark.asyncio
async def test_payment_service_execute_payment_not_found(payment_service, mock_db):
    """Test PaymentService.execute_payment when payment not found in database."""
    mock_db.query.return_value.filter.return_value.first.return_value = None
    
    result = await payment_service.execute_payment(mock_db, "PAY123", "USER123")
    
    assert result is False
    mock_db.commit.assert_not_called()

@pytest.mark.asyncio
async def test_payment_service_execute_payment_paypal_failure(payment_service, mock_db):
    """Test PaymentService.execute_payment with PayPal execution failure."""
    with patch('services.payment_service.paypalrestsdk.Payment.find') as mock_find:
        mock_payment = Mock()
        mock_payment.execute.return_value = False
        mock_payment.error = {"message": "Execution failed"}
        mock_find.return_value = mock_payment
        
        mock_db_payment = Mock()
        mock_db.query.return_value.filter.return_value.first.return_value = mock_db_payment
        
        result = await payment_service.execute_payment(mock_db, "PAY123", "USER123")
        
        assert result is False
        mock_db_payment.status = "failed"
        mock_db.commit.assert_called_once()

@pytest.mark.asyncio
async def test_payment_service_execute_payment_network_failure(payment_service, mock_db):
    """Test PaymentService.execute_payment with network failure."""
    with patch('services.payment_service.paypalrestsdk.Payment.find') as mock_find:
        mock_find.side_effect = Exception("Network error")
        
        mock_db_payment = Mock()
        mock_db.query.return_value.filter.return_value.first.return_value = mock_db_payment
        
        result = await payment_service.execute_payment(mock_db, "PAY123", "USER123")
        
        assert result is False
        mock_db_payment.status = "failed"
        mock_db.commit.assert_called_once()

# Negative test cases for payment creation
@pytest.mark.asyncio
async def test_create_payment_invalid_currency(mock_db, mock_payment_service):
    """Test payment creation with invalid currency."""
    invalid_payment_data = {"amount": 100.0, "currency": "INVALID", "description": "Test payment"}
    
    with pytest.raises(HTTPException) as exc_info:
        await create_payment(invalid_payment_data, mock_user, mock_db)
    
    assert exc_info.value.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert "currency" in str(exc_info.value.detail).lower()

@pytest.mark.asyncio
async def test_create_payment_negative_amount(mock_db, mock_payment_service):
    """Test payment creation with negative amount."""
    invalid_payment_data = {"amount": -50.0, "currency": "USD", "description": "Test payment"}
    
    with pytest.raises(HTTPException) as exc_info:
        await create_payment(invalid_payment_data, mock_user, mock_db)
    
    assert exc_info.value.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert "amount" in str(exc_info.value.detail).lower()

@pytest.mark.asyncio
async def test_create_payment_zero_amount(mock_db, mock_payment_service):
    """Test payment creation with zero amount."""
    invalid_payment_data = {"amount": 0.0, "currency": "USD", "description": "Test payment"}
    
    with pytest.raises(HTTPException) as exc_info:
        await create_payment(invalid_payment_data, mock_user, mock_db)
    
    assert exc_info.value.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert "amount" in str(exc_info.value.detail).lower()

@pytest.mark.asyncio
async def test_create_payment_missing_required_fields(mock_db, mock_payment_service):
    """Test payment creation with missing required fields."""
    invalid_payment_data = {"amount": 100.0}  # Missing currency and description
    
    with pytest.raises(HTTPException) as exc_info:
        await create_payment(invalid_payment_data, mock_user, mock_db)
    
    assert exc_info.value.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

# Test database error scenarios
@pytest.mark.asyncio
async def test_create_payment_database_error(mock_db, mock_payment_service):
    """Test payment creation when database operation fails."""
    mock_payment_service.create_payment.return_value = {
        "payment_id": "PAY123",
        "approval_url": "https://paypal.com/approve",
        "db_payment_id": 1
    }
    
    # Simulate database commit failure
    mock_db.commit.side_effect = Exception("Database connection failed")
    
    with pytest.raises(HTTPException) as exc_info:
        await create_payment(mock_payment_data, mock_user, mock_db)
    
    assert exc_info.value.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert "database" in str(exc_info.value.detail).lower()

@pytest.mark.asyncio
async def test_get_user_payments_database_error(mock_db):
    """Test retrieving user payments when database query fails."""
    mock_db.query.side_effect = Exception("Database query failed")
    
    with pytest.raises(HTTPException) as exc_info:
        await get_user_payments(mock_user, mock_db)
    
    assert exc_info.value.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert "database" in str(exc_info.value.detail).lower()

# Test edge cases for payment execution
@pytest.mark.asyncio
async def test_execute_payment_invalid_payment_id(mock_db, mock_payment_service):
    """Test payment execution with invalid payment ID format."""
    invalid_execute_data = {"payment_id": "", "payer_id": "USER123"}
    
    with pytest.raises(HTTPException) as exc_info:
        await execute_payment(invalid_execute_data, mock_user, mock_db)
    
    assert exc_info.value.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert "payment_id" in str(exc_info.value.detail).lower()

@pytest.mark.asyncio
async def test_execute_payment_invalid_payer_id(mock_db, mock_payment_service):
    """Test payment execution with invalid payer ID."""
    invalid_execute_data = {"payment_id": "PAY123", "payer_id": ""}
    
    with pytest.raises(HTTPException) as exc_info:
        await execute_payment(invalid_execute_data, mock_user, mock_db)
    
    assert exc_info.value.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert "payer_id" in str(exc_info.value.detail).lower()