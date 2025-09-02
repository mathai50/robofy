import os
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app
from database import get_db, Base, Lead as LeadModel, Content as ContentModel
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

# Setup test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Create test tables
Base.metadata.create_all(bind=test_engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Clear database before each test
@pytest.fixture(autouse=True)
def clear_database():
    """Clear all data from tables before each test"""
    db = TestingSessionLocal()
    try:
        db.query(LeadModel).delete()
        db.query(ContentModel).delete()
        db.commit()
    finally:
        db.close()

def test_root_endpoint():
    """Test the root endpoint returns correct message"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Robofy Backend API is running"}

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "timestamp" in response.json()

def test_create_lead_success():
    """Test creating a new lead successfully"""
    lead_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "industry": "technology",
        "source": "website"
    }
    response = client.post("/api/leads", json=lead_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == lead_data["name"]
    assert data["email"] == lead_data["email"]
    assert data["industry"] == lead_data["industry"]
    assert data["source"] == lead_data["source"]
    assert "id" in data
    assert "score" in data
    assert "created_at" in data
    assert "updated_at" in data

def test_create_lead_duplicate_email():
    """Test creating lead with duplicate email fails"""
    lead_data = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "industry": "healthcare",
        "source": "website"
    }
    # First request should succeed
    response1 = client.post("/api/leads", json=lead_data)
    assert response1.status_code == 200
    
    # Second request with same email should fail with 409 Conflict
    response2 = client.post("/api/leads", json=lead_data)
    assert response2.status_code == 409
    data = response2.json()
    assert data["detail"]["error"]["message"] == "Lead with this email already exists"

def test_get_leads():
    """Test retrieving all leads"""
    # Create a lead first
    lead_data = {
        "name": "Test User",
        "email": "test@example.com",
        "industry": "retail",
        "source": "website"
    }
    client.post("/api/leads", json=lead_data)
    
    # Get all leads
    response = client.get("/api/leads")
    assert response.status_code == 200
    leads = response.json()
    assert isinstance(leads, list)
    assert len(leads) > 0
    assert leads[0]["email"] == lead_data["email"]

def test_generate_content():
    """Test AI content generation endpoint"""
    content_data = {
        "title": "Test Content",
        "industry": "technology",
        "content_type": "blog"
    }
    response = client.post("/api/ai/content", json=content_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == content_data["title"]
    assert data["industry"] == content_data["industry"]
    assert "content" in data
    assert "id" in data
    assert "status" in data
    assert data["status"] == "published"

def test_get_content():
    """Test retrieving all content"""
    # Generate content first
    content_data = {
        "title": "Test Content 2",
        "industry": "healthcare",
        "content_type": "blog"
    }
    client.post("/api/ai/content", json=content_data)
    
    # Get all content
    response = client.get("/api/content")
    assert response.status_code == 200
    content_list = response.json()
    assert isinstance(content_list, list)
    assert len(content_list) > 0

def test_create_lead_missing_required_fields():
    """Test creating lead with missing required fields fails"""
    # Missing name
    lead_data_no_name = {
        "email": "test@example.com",
        "industry": "technology",
        "source": "website"
    }
    response = client.post("/api/leads", json=lead_data_no_name)
    assert response.status_code == 422  # Validation error
    
    # Missing email
    lead_data_no_email = {
        "name": "Test User",
        "industry": "technology",
        "source": "website"
    }
    response = client.post("/api/leads", json=lead_data_no_email)
    assert response.status_code == 422  # Validation error

def test_create_lead_invalid_email():
    """Test creating lead with invalid email format fails"""
    lead_data = {
        "name": "Test User",
        "email": "invalid-email",
        "industry": "technology",
        "source": "website"
    }
    response = client.post("/api/leads", json=lead_data)
    assert response.status_code == 422  # Validation error

def test_generate_content_missing_fields():
    """Test content generation with missing required fields fails"""
    # Missing title
    content_data_no_title = {
        "industry": "technology",
        "content_type": "blog"
    }
    response = client.post("/api/ai/content", json=content_data_no_title)
    assert response.status_code == 422
    
    # Missing industry
    content_data_no_industry = {
        "title": "Test Content",
        "content_type": "blog"
    }
    response = client.post("/api/ai/content", json=content_data_no_industry)
    assert response.status_code == 422
    
    # Missing content_type
    content_data_no_type = {
        "title": "Test Content",
        "industry": "technology"
    }
    response = client.post("/api/ai/content", json=content_data_no_type)
    assert response.status_code == 422

def test_generate_content_invalid_content_type():
    """Test content generation with invalid content type returns proper error"""
    content_data = {
        "title": "Test Content",
        "industry": "technology",
        "content_type": "invalid_type"
    }
    response = client.post("/api/ai/content", json=content_data)
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "error" in data["detail"]
    assert data["detail"]["error"]["code"] == "INVALID_CONTENT_TYPE"
    assert "valid_types" in data["detail"]["error"]["details"]

def test_get_leads_empty():
    """Test retrieving leads when no leads exist"""
    # Clear any existing leads by creating a fresh session
    db = TestingSessionLocal()
    try:
        db.query(LeadModel).delete()
        db.commit()
    finally:
        db.close()
    
    response = client.get("/api/leads")
    assert response.status_code == 200
    leads = response.json()
    assert isinstance(leads, list)
    assert len(leads) == 0

def test_get_content_empty():
    """Test retrieving content when no content exists"""
    # Clear any existing content by creating a fresh session
    db = TestingSessionLocal()
    try:
        db.query(ContentModel).delete()
        db.commit()
    finally:
        db.close()
    
    response = client.get("/api/content")
    assert response.status_code == 200
    content_list = response.json()
    assert isinstance(content_list, list)
    assert len(content_list) == 0

def test_lead_scoring_logic():
    """Test that lead scoring works correctly"""
    lead_data = {
        "name": "Scored Lead",
        "email": "scored@example.com",
        "industry": "technology",
        "source": "website"
    }
    response = client.post("/api/leads", json=lead_data)
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    # Default score should be 0 as per the model
    assert data["score"] == 0

def test_content_status_handling():
    """Test that content status is handled correctly"""
    content_data = {
        "title": "Status Test Content",
        "industry": "technology",
        "content_type": "blog"
    }
    response = client.post("/api/ai/content", json=content_data)
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "published"

def test_create_lead_database_error():
    """Test creating lead with database error returns proper response"""
    # Create a mock database session that raises SQLAlchemyError on add
    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = None
    mock_db.add.side_effect = SQLAlchemyError("Database connection failed")
    mock_db.commit.side_effect = SQLAlchemyError("Database connection failed")
    
    # Temporarily override get_db to return our mock session
    def mock_get_db():
        yield mock_db
    
    original_override = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = mock_get_db
    
    try:
        lead_data = {
            "name": "Test User",
            "email": "test@example.com",
            "industry": "technology",
            "source": "website"
        }
        response = client.post("/api/leads", json=lead_data)

        assert response.status_code == 503
        data = response.json()
        assert "detail" in data
        assert "error" in data["detail"]
        assert data["detail"]["error"]["code"] == "DATABASE_UNAVAILABLE"
    finally:
        # Restore original dependency override
        if original_override is None:
            del app.dependency_overrides[get_db]
        else:
            app.dependency_overrides[get_db] = original_override

def test_get_leads_database_error():
    """Test retrieving leads with database error returns proper response"""
    # Create a mock database session that raises SQLAlchemyError on query
    mock_db = MagicMock()
    mock_db.query.return_value.all.side_effect = SQLAlchemyError("Database connection failed")
    
    # Temporarily override get_db to return our mock session
    def mock_get_db():
        yield mock_db
    
    original_override = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = mock_get_db
    
    try:
        response = client.get("/api/leads")
        
        assert response.status_code == 503
        data = response.json()
        assert "detail" in data
        assert "error" in data["detail"]
        assert data["detail"]["error"]["code"] == "DATABASE_UNAVAILABLE"
    finally:
        # Restore original dependency override
        if original_override is None:
            del app.dependency_overrides[get_db]
        else:
            app.dependency_overrides[get_db] = original_override

def test_generate_content_file_system_error():
    """Test content generation continues when file system fails"""
    content_data = {
        "title": "Test Content",
        "industry": "technology",
        "content_type": "blog"
    }
    
    with patch('main.open', side_effect=OSError("Disk full")):
        response = client.post("/api/ai/content", json=content_data)
        
        # Should still succeed because database operation worked
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == content_data["title"]

def test_standardized_error_format():
    """Test that errors return standardized format"""
    # Test duplicate email error format
    lead_data = {
        "name": "Test User",
        "email": "duplicate@example.com",
        "industry": "technology",
        "source": "website"
    }
    
    # First request succeeds
    response1 = client.post("/api/leads", json=lead_data)
    assert response1.status_code == 200
    
    # Second request should fail with standardized error
    response2 = client.post("/api/leads", json=lead_data)
    assert response2.status_code == 409
    data = response2.json()
    assert "detail" in data
    assert "error" in data["detail"]
    assert data["detail"]["error"]["code"] == "LEAD_EMAIL_CONFLICT"
    assert "message" in data["detail"]["error"]
    assert "details" in data["detail"]["error"]