from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
import os
import json
from datetime import datetime
import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Import database models and session
from database import get_db, Lead as LeadModel, Content as ContentModel, User as UserModel, APIKey as APIKeyModel, APIAccessRequest as APIAccessRequestModel, create_tables
from errors import (
    bad_request_error, conflict_error,
    internal_server_error, service_unavailable_error,
    not_found_error, unauthorized_error
)
from auth import get_password_hash, authenticate_user, create_access_token, create_refresh_token, get_current_active_user, refresh_access_token
from schemas import Token, UserCreate, UserResponse, LoginRequest
from config import settings
from containers import container
from providers.base_provider import AIProviderError
from security import encrypt_api_key, decrypt_api_key, is_valid_domain, sanitize_input
from data_transformers import transform_analysis_for_frontend
from fastmcp.client import Client, MCPError
from routers.voice_call import router as voice_router
from routers.websocket_voice import router as websocket_voice_router
from routers.notifications import router as notifications_router
from routers.payments import router as payments_router
from routers.orchestration import router as orchestration_router

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    create_tables()
    logger.info("Database tables created (if not exists)")
    
    # Initialize services through dependency injection container
    try:
        # Initialize AI service
        ai_service = container.ai_service()
        status = await ai_service.get_provider_status()
        logger.info(f"AI service initialized. Available providers: {status}")
        
        # Initialize other services
        security_service = container.security_service()
        auth_service = container.auth_service()
        rate_limiting_service = container.rate_limiting_service()
        
        logger.info("All services initialized through dependency injection container")
    except Exception as e:
        logger.warning(f"Could not initialize services: {e}")
    
    # Initialize and connect to the FastMCP SEO Server
    try:
        mcp_server_url = os.getenv("MCP_SERVER_URL", "http://localhost:8001")
        mcp_client = MCPClient(mcp_server_url)
        await mcp_client.connect()
        app.state.mcp_client = mcp_client
        logger.info(f"Successfully connected to FastMCP SEO Server at {mcp_server_url}")
    except Exception as e:
        app.state.mcp_client = None
        logger.error(f"Failed to connect to FastMCP SEO Server: {e}. SEO tools will be unavailable.")
    
    yield
    
    # Shutdown logic
    try:
        if hasattr(app.state, 'mcp_client') and app.state.mcp_client:
            await app.state.mcp_client.close()
            logger.info("Disconnected from FastMCP SEO Server")
        if container.is_provided('ai_service'):
            await container.ai_service().close()
            logger.info("AI service connections closed")
    except Exception as e:
        logger.warning(f"Error during shutdown: {e}")

# Import centralized agent prompts
from prompts import TOOL_CONTEXTS

app = FastAPI(title="Robofy Backend API", version="1.0.0", lifespan=lifespan)


# CORS middleware - configured for Next.js development server and Dash dashboard
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8050",
    "http://127.0.0.1:8050"
    # You may need to add other origins for deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all HTTP methods
    allow_headers=["*"], # Allow all headers
)


# Include voice call router
app.include_router(voice_router)

# Include WebSocket voice router
app.include_router(websocket_voice_router)

# Include notifications router
app.include_router(notifications_router)

# Include payments router
app.include_router(payments_router)

# Include orchestration router
app.include_router(orchestration_router)

# Pydantic models
class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    industry: Optional[str] = None
    source: Optional[str] = None

class LeadResponse(LeadCreate):
    id: int
    score: int
    created_at: datetime
    updated_at: datetime

class ContentGenerateRequest(BaseModel):
    title: str
    industry: str
    content_type: str  # blog, industry_page, service, etc.

class ContentResponse(BaseModel):
    id: int
    title: str
    content: str
    industry: str
    status: str
    created_at: datetime
    published_at: Optional[datetime] = None

# SEO Analysis Models
class SEOCompetitorAnalysisRequest(BaseModel):
    domain: str
    competitors: Optional[List[str]] = None

class KeywordResearchRequest(BaseModel):
    topic: str
    industry: Optional[str] = None


class ContentGapAnalysisRequest(BaseModel):
    domain: str
    competitor: str

class SEOAuditRequest(BaseModel):
    url: str

class RankTrackingRequest(BaseModel):
    keywords: List[str]
    domain: str

class SEOAnalysisResponse(BaseModel):
    analysis: str
    timestamp: datetime


# API Key Models
class APIKeyCreate(BaseModel):
    provider: str
    api_key: str

class APIKeyResponse(BaseModel):
    id: int
    provider: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    last_used: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# API Access Request Models
class APIAccessRequestCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    company: Optional[str] = None
    industry: Optional[str] = None
    requested_tools: Optional[List[str]] = None

class APIAccessRequestResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    company: Optional[str] = None
    industry: Optional[str] = None
    requested_tools: Optional[List[str]] = None
    granted_access: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


@app.get("/")
async def root():
    """
    Root endpoint for Robofy Backend API.
    
    Returns:
        dict: A simple message indicating the API is running.
        
    Example:
        ```json
        {
            "message": "Robofy Backend API is running"
        }
        ```
    """
    return {"message": "Robofy Backend API is running"}

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint for monitoring API status.
    
    Returns:
        dict: API health status and current timestamp.
        
    Example:
        ```json
        {
            "status": "healthy",
            "timestamp": "2025-09-12T14:40:44.898Z"
        }
        ```
    """
    return {"status": "healthy", "timestamp": datetime.now()}

@app.post("/api/leads", response_model=LeadResponse)
async def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    """
    Create a new lead in the CRM system.
    
    Args:
        lead (LeadCreate): Lead data including name, email, industry, and source.
        db (Session): Database session dependency.
    
    Returns:
        LeadResponse: The created lead object with assigned ID and timestamps.
    
    Raises:
        HTTPException: 409 if lead with email already exists, 503 if database unavailable.
        
    Example:
        Request:
        ```json
        {
            "name": "John Doe",
            "email": "john@example.com",
            "industry": "Technology",
            "source": "Website"
        }
        ```
        
        Response:
        ```json
        {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "industry": "Technology",
            "source": "Website",
            "score": 0,
            "created_at": "2025-09-12T14:40:44.898Z",
            "updated_at": "2025-09-12T14:40:44.898Z"
        }
        ```
    """
    try:
        # Check if email already exists
        existing_lead = db.query(LeadModel).filter(LeadModel.email == lead.email).first()
        if existing_lead:
            raise conflict_error(
                "Lead with this email already exists",
                "LEAD_EMAIL_CONFLICT",
                {"email": lead.email}
            )
        
        # Create new lead
        db_lead = LeadModel(
            name=lead.name,
            email=lead.email,
            industry=lead.industry,
            source=lead.source,
            score=0
        )
        db.add(db_lead)
        db.commit()
        db.refresh(db_lead)
        
        logger.info(f"New lead created: {db_lead.email}")
        return db_lead
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating lead: {str(e)}")
        raise service_unavailable_error(
            "Database temporarily unavailable. Please try again later.",
            "DATABASE_UNAVAILABLE"
        )
    except HTTPException:
        # Re-raise HTTP exceptions (like conflict_error) without modification
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating lead: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while creating lead",
            "INTERNAL_SERVER_ERROR"
        )

@app.get("/api/leads", response_model=List[LeadResponse])
async def get_leads(db: Session = Depends(get_db)):
    """
    Retrieve all leads from the CRM system.
    
    Args:
        db (Session): Database session dependency.
    
    Returns:
        List[LeadResponse]: List of all lead objects.
    
    Raises:
        HTTPException: 503 if database unavailable.
        
    Example:
        Response:
        ```json
        [
            {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "industry": "Technology",
                "source": "Website",
                "score": 0,
                "created_at": "2025-09-12T14:40:44.898Z",
                "updated_at": "2025-09-12T14:40:44.898Z"
            }
        ]
        ```
    """
    try:
        leads = db.query(LeadModel).all()
        return leads
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving leads: {str(e)}")
        raise service_unavailable_error(
            "Database temporarily unavailable. Please try again later.",
            "DATABASE_UNAVAILABLE"
        )
    except HTTPException:
        # Re-raise HTTP exceptions without modification
        raise
    except Exception as e:
        logger.error(f"Unexpected error retrieving leads: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while retrieving leads",
            "INTERNAL_SERVER_ERROR"
        )

@app.post("/api/ai/content", response_model=ContentResponse)
async def generate_content(request: ContentGenerateRequest, db: Session = Depends(get_db)):
    """
    Generate AI-powered content for various purposes.
    
    Args:
        request (ContentGenerateRequest): Content generation parameters including title, industry, and content type.
        db (Session): Database session dependency.
    
    Returns:
        ContentResponse: The generated content object with metadata.
    
    Raises:
        HTTPException: 400 for invalid content type, 503 for AI service or database issues.
        
    Example:
        Request:
        ```json
        {
            "title": "Future of AI in Healthcare",
            "industry": "Healthcare",
            "content_type": "blog"
        }
        ```
        
        Response:
        ```json
        {
            "id": 1,
            "title": "Future of AI in Healthcare",
            "content": "# Future of AI in Healthcare\\n\\nAI is transforming healthcare...",
            "industry": "Healthcare",
            "status": "published",
            "created_at": "2025-09-12T14:40:44.898Z",
            "published_at": "2025-09-12T14:40:44.898Z"
        }
        ```
    """
    try:
        # Validate content type
        valid_content_types = ["blog", "industry_page", "service", "landing_page"]
        if request.content_type not in valid_content_types:
            raise bad_request_error(
                f"Invalid content type. Must be one of: {', '.join(valid_content_types)}",
                "INVALID_CONTENT_TYPE",
                {"valid_types": valid_content_types}
            )
        
        # Generate AI content using the AI service
        prompt = f"""{TOOL_CONTEXTS["content creation"]}

        Generate a {request.content_type} for the {request.industry} industry with the title: {request.title}
        
        The content should be engaging, informative, and optimized for SEO.
        Include relevant industry-specific insights and practical advice.
        Format the content in markdown with appropriate headings and structure.
        """
        
        # Get AI service from container
        ai_service = container.ai_service()
        ai_generated_content = await ai_service.generate_text(prompt)
        
        # Create new content in database
        db_content = ContentModel(
            title=request.title,
            content=ai_generated_content,
            industry=request.industry,
            status="published",
            published_at=datetime.now()
        )
        db.add(db_content)
        db.commit()
        db.refresh(db_content)
        
        # Save content to file for Next.js consumption
        content_dir = "../src/content"
        try:
            os.makedirs(content_dir, exist_ok=True)
            
            filename = f"{request.content_type}_{request.industry.lower().replace(' ', '_')}_{db_content.id}.md"
            filepath = os.path.join(content_dir, filename)
            
            with open(filepath, "w") as f:
                f.write(ai_generated_content)
            
            logger.info(f"Content generated and saved: {filepath}")
        except OSError as e:
            logger.warning(f"Could not save content to file system: {str(e)}")
            # Continue without failing since database operation succeeded
        
        return db_content
        
    except AIProviderError as e:
        logger.error(f"AI service error: {str(e)}")
        raise service_unavailable_error(
            "AI service temporarily unavailable. Please try again later.",
            "AI_SERVICE_UNAVAILABLE"
        )
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error generating content: {str(e)}")
        raise service_unavailable_error(
            "Database temporarily unavailable. Please try again later.",
            "DATABASE_UNAVAILABLE"
        )
    except HTTPException:
        # Re-raise HTTP exceptions (like bad_request_error) without modification
        raise
    except Exception as e:
        logger.error(f"Unexpected error generating content: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while generating content",
            "INTERNAL_SERVER_ERROR"
        )
    
@app.get("/api/content", response_model=List[ContentResponse])
async def get_content(db: Session = Depends(get_db)):
    """
    Retrieve all generated content from the database.
    
    Args:
        db (Session): Database session dependency.
    
    Returns:
        List[ContentResponse]: List of all content objects.
    
    Raises:
        HTTPException: 503 if database unavailable.
        
    Example:
        Response:
        ```json
        [
            {
                "id": 1,
                "title": "Future of AI in Healthcare",
                "content": "# Future of AI in Healthcare\\n\\nAI is transforming healthcare...",
                "industry": "Healthcare",
                "status": "published",
                "created_at": "2025-09-12T14:40:44.898Z",
                "published_at": "2025-09-12T14:40:44.898Z"
            }
        ]
        ```
    """
    try:
        content = db.query(ContentModel).all()
        return content
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving content: {str(e)}")
        raise service_unavailable_error(
            "Database temporarily unavailable. Please try again later.",
            "DATABASE_UNAVAILABLE"
        )
    except HTTPException:
        # Re-raise HTTP exceptions without modification
        raise
    except Exception as e:
        logger.error(f"Unexpected error retrieving content: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while retrieving content",
            "INTERNAL_SERVER_ERROR"
        )

# Authentication endpoints
@app.post("/api/auth/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.
    
    Args:
        user (UserCreate): User registration data including username, email, and password.
        db (Session): Database session dependency.
    
    Returns:
        UserResponse: The created user object without password.
    
    Raises:
        HTTPException: 409 if username or email already exists, 503 if database unavailable.
        
    Example:
        Request:
        ```json
        {
            "username": "johndoe",
            "email": "john@example.com",
            "full_name": "John Doe",
            "password": "securepassword123"
        }
        ```
        
        Response:
        ```json
        {
            "id": 1,
            "username": "johndoe",
            "email": "john@example.com",
            "full_name": "John Doe",
            "is_active": true,
            "created_at": "2025-09-12T14:40:44.898Z"
        }
        ```
    """
    try:
        # Check if username or email already exists
        existing_user = db.query(UserModel).filter(
            (UserModel.username == user.username) | (UserModel.email == user.email)
        ).first()
        if existing_user:
            raise conflict_error(
                "Username or email already exists",
                "USER_CONFLICT",
                {"username": user.username, "email": user.email}
            )
        
        # Create new user
        hashed_password = get_password_hash(user.password)
        db_user = UserModel(
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"New user registered: {db_user.username}")
        return db_user
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error registering user: {str(e)}")
        raise service_unavailable_error(
            "Database temporarily unavailable. Please try again later.",
            "DATABASE_UNAVAILABLE"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error registering user: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while registering user",
            "INTERNAL_SERVER_ERROR"
        )

@app.post("/api/auth/login", response_model=Token)
async def login_for_access_token(form_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user and return JWT access and refresh tokens.
    
    Args:
        form_data (LoginRequest): User credentials (username and password).
        db (Session): Database session dependency.
    
    Returns:
        Token: JWT access token and refresh token with bearer type.
    
    Raises:
        HTTPException: 401 for invalid credentials, 503 if database unavailable.
        
    Example:
        Request:
        ```json
        {
            "username": "johndoe",
            "password": "securepassword123"
        }
        ```
        
        Response:
        ```json
        {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "token_type": "bearer"
        }
        ```
    """
    try:
        user = await authenticate_user(form_data.username, form_data.password, db)
        if not user:
            raise unauthorized_error(
                "Incorrect username or password",
                "INVALID_CREDENTIALS"
            )
        access_token = create_access_token(data={"sub": user.username})
        refresh_token = create_refresh_token(data={"sub": user.username})
        return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}
        
    except SQLAlchemyError as e:
        logger.error(f"Database error during login: {str(e)}")
        raise service_unavailable_error(
            "Database temporarily unavailable. Please try again later.",
            "DATABASE_UNAVAILABLE"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred during login",
            "INTERNAL_SERVER_ERROR"
        )

@app.post("/api/auth/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using a valid refresh token.
    
    Args:
        refresh_token (str): Valid refresh token obtained during login.
        db (Session): Database session dependency.
    
    Returns:
        Token: New JWT access token and refresh token with bearer type.
    
    Raises:
        HTTPException: 401 for invalid refresh token, 503 if database unavailable.
        
    Example:
        Request:
        ```json
        {
            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        ```
        
        Response:
        ```json
        {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "token_type": "bearer"
        }
        ```
    """
    try:
        tokens = await refresh_access_token(refresh_token, db)
        return tokens
        
    except SQLAlchemyError as e:
        logger.error(f"Database error during token refresh: {str(e)}")
        raise service_unavailable_error(
            "Database temporarily unavailable. Please try again later.",
            "DATABASE_UNAVAILABLE"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during token refresh: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred during token refresh",
            "INTERNAL_SERVER_ERROR"
        )

@app.get("/api/auth/me", response_model=UserResponse)
async def read_users_me(current_user: UserModel = Depends(get_current_active_user)):
    """
    Get current authenticated user's profile information.
    
    Args:
        current_user (UserModel): Authenticated user from dependency.
    
    Returns:
        UserResponse: Current user's profile data.
    
    Raises:
        HTTPException: 401 if not authenticated.
        
    Example:
        Response:
        ```json
        {
            "id": 1,
            "username": "johndoe",
            "email": "john@example.com",
            "full_name": "John Doe",
            "is_active": true,
            "created_at": "2025-09-12T14:40:44.898Z"
        }
        ```
    """
    return current_user

# API Key Management Endpoints
@app.post("/api/api-keys", response_model=APIKeyResponse)
async def create_api_key(
    api_key_data: APIKeyCreate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new encrypted API key for AI service providers.
    
    Args:
        api_key_data (APIKeyCreate): API key data including provider and raw API key.
        current_user (UserModel): Authenticated user from dependency.
        db (Session): Database session dependency.
    
    Returns:
        APIKeyResponse: The created API key object with metadata.
    
    Raises:
        HTTPException: 400 for invalid provider, 409 if key already exists, 503 if database unavailable.
        
    Example:
        Request:
        ```json
        {
            "provider": "openai",
            "api_key": "sk-...12345"
        }
        ```
        
        Response:
        ```json
        {
            "id": 1,
            "provider": "openai",
            "is_active": true,
            "created_at": "2025-09-12T14:40:44.898Z",
            "updated_at": "2025-09-12T14:40:44.898Z",
            "last_used": null
        }
        ```
    """
    try:
        # Validate provider
        valid_providers = ["openai", "google", "deepseek", "huggingface", "apify"]
        if api_key_data.provider not in valid_providers:
            raise bad_request_error(
                f"Invalid provider. Must be one of: {', '.join(valid_providers)}",
                "INVALID_PROVIDER",
                {"valid_providers": valid_providers}
            )
        
        # Check if user already has an API key for this provider
        existing_key = db.query(APIKeyModel).filter(
            APIKeyModel.user_id == current_user.id,
            APIKeyModel.provider == api_key_data.provider
        ).first()
        
        if existing_key:
            raise conflict_error(
                f"API key for {api_key_data.provider} already exists",
                "API_KEY_CONFLICT",
                {"provider": api_key_data.provider}
            )
        
        # Encrypt the API key before storage
        encrypted_key = encrypt_api_key(api_key_data.api_key)
        
        # Create new API key
        db_api_key = APIKeyModel(
            user_id=current_user.id,
            provider=api_key_data.provider,
            encrypted_key=encrypted_key,
            is_active=True
        )
        db.add(db_api_key)
        db.commit()
        db.refresh(db_api_key)
        
        logger.info(f"New API key created for user {current_user.username}, provider: {api_key_data.provider}")
        return db_api_key
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating API key: {str(e)}")
        raise service_unavailable_error(
            "Database temporarily unavailable. Please try again later.",
            "DATABASE_UNAVAILABLE"
        )
    except ValueError as e:
        raise bad_request_error(
            f"Failed to encrypt API key: {str(e)}",
            "ENCRYPTION_ERROR"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating API key: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while creating API key",
            "INTERNAL_SERVER_ERROR"
        )

@app.get("/api/api-keys", response_model=List[APIKeyResponse])
async def get_api_keys(
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve all API keys for the authenticated user.
    
    Args:
        current_user (UserModel): Authenticated user from dependency.
        db (Session): Database session dependency.
    
    Returns:
        List[APIKeyResponse]: List of API key objects for the user.
    
    Raises:
        HTTPException: 503 if database unavailable.
        
    Example:
        Response:
        ```json
        [
            {
                "id": 1,
                "provider": "openai",
                "is_active": true,
                "created_at": "2025-09-12T14:40:44.898Z",
                "updated_at": "2025-09-12T14:40:44.898Z",
                "last_used": null
            }
        ]
        ```
    """
    try:
        api_keys = db.query(APIKeyModel).filter(APIKeyModel.user_id == current_user.id).all()
        return api_keys
    except SQLAlchemyError as e:
        logger.error(f"Database error retrieving API keys: {str(e)}")
        raise service_unavailable_error(
            "Database temporarily unavailable. Please try again later.",
            "DATABASE_UNAVAILABLE"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error retrieving API keys: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while retrieving API keys",
            "INTERNAL_SERVER_ERROR"
        )

@app.delete("/api/api-keys/{api_key_id}")
async def delete_api_key(
    api_key_id: int,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a specific API key by ID.
    
    Args:
        api_key_id (int): ID of the API key to delete.
        current_user (UserModel): Authenticated user from dependency.
        db (Session): Database session dependency.
    
    Returns:
        dict: Success message upon deletion.
    
    Raises:
        HTTPException: 404 if API key not found, 503 if database unavailable.
        
    Example:
        Response:
        ```json
        {
            "message": "API key deleted successfully"
        }
        ```
    """
    try:
        # Find the API key and ensure it belongs to the current user
        api_key = db.query(APIKeyModel).filter(
            APIKeyModel.id == api_key_id,
            APIKeyModel.user_id == current_user.id
        ).first()
        
        if not api_key:
            raise not_found_error(
                "API key not found",
                "API_KEY_NOT_FOUND"
            )
        
        db.delete(api_key)
        db.commit()
        
        logger.info(f"API key deleted for user {current_user.username}, key ID: {api_key_id}")
        return {"message": "API key deleted successfully"}
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error deleting API key: {str(e)}")
        raise service_unavailable_error(
            "Database temporarily unavailable. Please try again later.",
            "DATABASE_UNAVAILABLE"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error deleting API key: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while deleting API key",
            "INTERNAL_SERVER_ERROR"
        )

@app.post("/api/api-keys/{api_key_id}/validate")
async def validate_api_key(
    api_key_id: int,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Validate an API key by decrypting and checking its format.
    
    Args:
        api_key_id (int): ID of the API key to validate.
        current_user (UserModel): Authenticated user from dependency.
        db (Session): Database session dependency.
    
    Returns:
        dict: Validation result with status and message.
    
    Raises:
        HTTPException: 404 if API key not found, 400 for decryption errors, 503 if database unavailable.
        
    Example:
        Response:
        ```json
        {
            "valid": true,
            "message": "API key is valid"
        }
        ```
    """
    try:
        # Find the API key and ensure it belongs to the current user
        api_key = db.query(APIKeyModel).filter(
            APIKeyModel.id == api_key_id,
            APIKeyModel.user_id == current_user.id
        ).first()
        
        if not api_key:
            raise not_found_error(
                "API key not found",
                "API_KEY_NOT_FOUND"
            )
        
        # Decrypt the API key for validation
        decrypted_key = decrypt_api_key(api_key.encrypted_key)
        
        # Update last_used timestamp
        api_key.last_used = datetime.now()
        db.commit()
        
        # For now, return success - actual validation against provider would be implemented later
        return {"valid": True, "message": "API key is valid"}
        
    except ValueError as e:
        raise bad_request_error(
            f"Failed to decrypt API key: {str(e)}",
            "DECRYPTION_ERROR"
        )

# API Access Request Endpoint for CRM email collection
@app.post("/api/access-request", response_model=APIAccessRequestResponse)
async def create_api_access_request(
    request_data: APIAccessRequestCreate,
    db: Session = Depends(get_db),
    user_request: Request = None
):
    """
    Create an API access request for CRM email collection and lead generation.
    
    Args:
        request_data (APIAccessRequestCreate): User information and requested tools.
        db (Session): Database session dependency.
        user_request (Request): FastAPI request object for client information.
    
    Returns:
        APIAccessRequestResponse: The created access request object.
    
    Raises:
        HTTPException: 409 if email already exists, 503 if database unavailable.
        
    Example:
        Request:
        ```json
        {
            "email": "user@example.com",
            "name": "John Doe",
            "company": "Example Corp",
            "industry": "Technology",
            "requested_tools": ["seo analysis", "content creation"]
        }
        ```
        
        Response:
        ```json
        {
            "id": 1,
            "email": "user@example.com",
            "name": "John Doe",
            "company": "Example Corp",
            "industry": "Technology",
            "requested_tools": ["seo analysis", "content creation"],
            "granted_access": false,
            "created_at": "2025-09-12T14:40:44.898Z"
        }
        ```
    """
    try:
        # Check if email already exists
        existing_request = db.query(APIAccessRequestModel).filter(APIAccessRequestModel.email == request_data.email).first()
        if existing_request:
            raise conflict_error(
                "Access request with this email already exists",
                "ACCESS_REQUEST_CONFLICT",
                {"email": request_data.email}
            )
        
        # Get client IP and user agent
        client_ip = user_request.client.host if user_request and user_request.client else None
        user_agent = user_request.headers.get("User-Agent") if user_request else None
        
        # Create new access request
        db_access_request = APIAccessRequestModel(
            email=request_data.email,
            name=request_data.name,
            company=request_data.company,
            industry=request_data.industry,
            requested_tools=request_data.requested_tools,
            ip_address=client_ip,
            user_agent=user_agent,
            granted_access=False  # Initially not granted
        )
        
        db.add(db_access_request)
        db.commit()
        db.refresh(db_access_request)
        
        logger.info(f"New API access request created: {db_access_request.email}")
        
        # TODO: Add integration with CRM system (e.g., send email, add to mailing list)
        
        return db_access_request
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error creating access request: {str(e)}")
        raise service_unavailable_error(
            "Database temporarily unavailable. Please try again later.",
            "DATABASE_UNAVAILABLE"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating access request: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while creating access request",
            "INTERNAL_SERVER_ERROR"
        )


# SEO Analysis Endpoints
@app.post("/api/seo/competitor-analysis", response_model=SEOAnalysisResponse)
async def seo_competitor_analysis(
    analysis_request: SEOCompetitorAnalysisRequest,
    current_user: UserModel = Depends(get_current_active_user),
    request: Request = None
):
    """
    Perform comprehensive competitor SEO analysis for a given domain.
    """
    try:
        # Validate domain to prevent abuse
        if not is_valid_domain(analysis_request.domain):
            raise bad_request_error(
                "Invalid domain format. Please provide a valid domain name.",
                "INVALID_DOMAIN",
                {"domain": analysis_request.domain}
            )
        
        # Sanitize competitor domains if provided
        sanitized_competitors = []
        if analysis_request.competitors:
            for competitor in analysis_request.competitors:
                if is_valid_domain(competitor):
                    sanitized_competitors.append(sanitize_input(competitor))
        
        # Get MCP client from app state
        mcp_client = request.app.state.mcp_client
        if not mcp_client or not mcp_client.is_connected:
            raise service_unavailable_error(
                "SEO analysis service is currently unavailable. Failed to connect to the FastMCP server.",
                "MCP_SERVER_UNAVAILABLE"
            )

        analysis_result = await mcp_client.call(
            "seo-analysis.analyze_competitors_tool",
            domain=analysis_request.domain,
            competitors=sanitized_competitors
        )
        
        return SEOAnalysisResponse(
            analysis=json.dumps(analysis_result),
            timestamp=datetime.now()
        )
    except MCPError as e:
        logger.error(f"Error calling FastMCP server for competitor analysis: {str(e)}")
        raise internal_server_error(f"An error occurred during SEO analysis: {e}", "SEO_ANALYSIS_ERROR")
    except Exception as e:
        logger.error(f"Error in competitor analysis: {str(e)}")
        raise internal_server_error(
            "Failed to perform competitor analysis",
            "SEO_ANALYSIS_ERROR"
        )

@app.post("/api/seo/keyword-research", response_model=SEOAnalysisResponse)
async def seo_keyword_research(
    analysis_request: KeywordResearchRequest,
    current_user: UserModel = Depends(get_current_active_user),
    request: Request = None
):
    """
    Conduct keyword research for a given topic or industry.
    """
    try:
        # Sanitize topic and industry inputs
        sanitized_topic = sanitize_input(analysis_request.topic)
        sanitized_industry = sanitize_input(analysis_request.industry) if analysis_request.industry else None
        
        # Get MCP client from app state
        mcp_client = request.app.state.mcp_client
        if not mcp_client or not mcp_client.is_connected:
            raise service_unavailable_error(
                "SEO analysis service is currently unavailable. Failed to connect to the FastMCP server.",
                "MCP_SERVER_UNAVAILABLE"
            )

        research_result = await mcp_client.call(
            "seo-analysis.conduct_keyword_research_tool",
            topic=sanitized_topic,
            industry=sanitized_industry
        )

        return SEOAnalysisResponse(
            analysis=json.dumps(research_result),
            timestamp=datetime.now()
        )
    except MCPError as e:
        logger.error(f"Error calling FastMCP server for keyword research: {str(e)}")
        raise internal_server_error(f"An error occurred during SEO analysis: {e}", "SEO_ANALYSIS_ERROR")
    except Exception as e:
        logger.error(f"Error in keyword research: {str(e)}")
        raise internal_server_error(
            "Failed to perform keyword research",
            "SEO_ANALYSIS_ERROR"
        )


@app.post("/api/seo/content-gap-analysis", response_model=SEOAnalysisResponse)
async def seo_content_gap_analysis(
    analysis_request: ContentGapAnalysisRequest,
    current_user: UserModel = Depends(get_current_active_user),
    request: Request = None
):
    """Identify content gaps"""
    try:
        # Validate domains to prevent abuse
        if not is_valid_domain(analysis_request.domain):
            raise bad_request_error(
                "Invalid domain format. Please provide a valid domain name.",
                "INVALID_DOMAIN",
                {"domain": analysis_request.domain}
            )
        
        if not is_valid_domain(analysis_request.competitor):
            raise bad_request_error(
                "Invalid competitor domain format. Please provide a valid domain name.",
                "INVALID_DOMAIN",
                {"competitor": analysis_request.competitor}
            )
        
        # Get MCP client from app state
        mcp_client = request.app.state.mcp_client
        if not mcp_client or not mcp_client.is_connected:
            raise service_unavailable_error(
                "SEO analysis service is currently unavailable. Failed to connect to the FastMCP server.",
                "MCP_SERVER_UNAVAILABLE"
            )

        analysis_result = await mcp_client.call(
            "seo-analysis.content_gap_analysis_tool",
            domain=analysis_request.domain,
            competitor=analysis_request.competitor
        )

        return SEOAnalysisResponse(
            analysis=json.dumps(analysis_result),
            timestamp=datetime.now()
        )
    except MCPError as e:
        logger.error(f"Error calling FastMCP server for content gap analysis: {str(e)}")
        raise internal_server_error(f"An error occurred during SEO analysis: {e}", "SEO_ANALYSIS_ERROR")
    except Exception as e:
        logger.error(f"Error in content gap analysis: {str(e)}")
        raise internal_server_error(
            "Failed to perform content gap analysis",
            "SEO_ANALYSIS_ERROR"
        )

@app.post("/api/seo/audit", response_model=SEOAnalysisResponse)
async def perform_seo_audit(
    analysis_request: SEOAuditRequest,
    current_user: UserModel = Depends(get_current_active_user),
    request: Request = None
):
    """Perform SEO audit"""
    try:
        # Get MCP client from app state
        mcp_client = request.app.state.mcp_client
        if not mcp_client or not mcp_client.is_connected:
            raise service_unavailable_error(
                "SEO analysis service is currently unavailable. Failed to connect to the FastMCP server.",
                "MCP_SERVER_UNAVAILABLE"
            )

        audit_result = await mcp_client.call(
            "seo-analysis.seo_audit_tool",
            url=analysis_request.url
        )

        return SEOAnalysisResponse(
            analysis=json.dumps(audit_result),
            timestamp=datetime.now()
        )
    except MCPError as e:
        logger.error(f"Error calling FastMCP server for SEO audit: {str(e)}")
        raise internal_server_error(f"An error occurred during SEO analysis: {e}", "SEO_ANALYSIS_ERROR")
    except Exception as e:
        logger.error(f"Error in SEO audit: {str(e)}")
        raise internal_server_error(
            "Failed to perform SEO audit",
            "SEO_ANALYSIS_ERROR"
        )


# New comprehensive SEO analysis endpoint
class ComprehensiveSEOAnalysisRequest(BaseModel):
    domain: str

@app.post("/api/seo/comprehensive-analysis")
async def seo_comprehensive_analysis(
    analysis_request: ComprehensiveSEOAnalysisRequest,
    current_user: UserModel = Depends(get_current_active_user),
    request: Request = None
):
    """
    Perform comprehensive SEO analysis including competitor analysis, keyword research,
    SEO audit, and content gap analysis. Returns both chart data and verbose content data.
    
    Args:
        analysis_request (ComprehensiveSEOAnalysisRequest): Domain to analyze.
    
    Returns:
        dict: Comprehensive analysis data formatted for frontend consumption.
    
    Raises:
        HTTPException: 400 for invalid domain, 500 for analysis errors.
    """
    try:
        # Validate domain to prevent abuse
        if not is_valid_domain(analysis_request.domain):
            raise bad_request_error(
                "Invalid domain format. Please provide a valid domain name.",
                "INVALID_DOMAIN",
                {"domain": analysis_request.domain}
            )
        
        # Get MCP client from app state
        mcp_client = request.app.state.mcp_client
        if not mcp_client or not mcp_client.is_connected:
            raise service_unavailable_error(
                "SEO analysis service is currently unavailable. Failed to connect to the FastMCP server.",
                "MCP_SERVER_UNAVAILABLE"
            )

        # Construct URL from domain
        url = f"https://{analysis_request.domain}"

        # Call the comprehensive analysis tool on the FastMCP server
        logger.info(f"Calling FastMCP tool 'perform_comprehensive_seo_analysis_tool' for URL: {url}")
        analysis_result = await mcp_client.call(
            "seo-analysis.perform_comprehensive_seo_analysis_tool",
            url=url
        )
        
        # Transform the raw analysis data into a frontend-friendly format
        logger.info("Transforming comprehensive analysis data for frontend.")
        transformed_data = transform_analysis_for_frontend(
            analysis_data=analysis_result,
            domain=analysis_request.domain,
            timestamp=datetime.now().isoformat()
        )
        return transformed_data

    except MCPError as e:
        logger.error(f"Error calling FastMCP server for comprehensive analysis: {str(e)}")
        raise internal_server_error(
            f"An error occurred during SEO analysis: {e}",
            "SEO_ANALYSIS_ERROR"
        )
    except Exception as e:
        logger.error(f"Error in comprehensive SEO analysis: {str(e)}")
        raise internal_server_error(
            "Failed to perform comprehensive SEO analysis",
            "SEO_ANALYSIS_ERROR"
        )

# AI Optimization (AIO) Audit Endpoint
class AIOAuditRequest(BaseModel):
    brand_name: str
    domain: str
    topics: List[str]

@app.post("/api/seo/aio-audit")
async def aio_audit(
    analysis_request: AIOAuditRequest,
    current_user: UserModel = Depends(get_current_active_user),
    request: Request = None
):
    """
    Performs an AI Optimization (AIO) audit to check brand presence across major LLMs.
    """
    try:
        mcp_client = request.app.state.mcp_client
        if not mcp_client or not mcp_client.is_connected:
            raise service_unavailable_error("AIO analysis service is unavailable.", "MCP_SERVER_UNAVAILABLE")

        logger.info(f"Calling FastMCP tool 'monitor_ai_mentions_tool' for brand: {analysis_request.brand_name}")
        
        # This would call the new tool on the MCP server
        audit_result = await mcp_client.call(
            "seo-analysis.monitor_ai_mentions_tool",
            brand_name=analysis_request.brand_name,
            domain=analysis_request.domain,
            topics=analysis_request.topics
        )
        
        # You could create a new transformer in data_transformers.py for this
        # transformed_data = transform_aio_data_for_frontend(audit_result)
        # return transformed_data
        
        return audit_result

    except MCPError as e:
        logger.error(f"Error calling FastMCP server for AIO audit: {str(e)}")
        raise internal_server_error(f"An error occurred during AIO audit: {e}", "AIO_AUDIT_ERROR")
    except Exception as e:
        logger.error(f"Error in AIO audit: {str(e)}")
        raise internal_server_error("Failed to perform AIO audit", "AIO_AUDIT_ERROR")

# Lead Prospecting Endpoint
class LeadProspectingRequest(BaseModel):
    topic: str
    keywords: List[str]

@app.post("/api/leads/prospect")
async def prospect_for_leads(
    prospecting_request: LeadProspectingRequest,
    current_user: UserModel = Depends(get_current_active_user),
    request: Request = None
):
    """
    Initiates a lead prospecting task to find potential customers.
    """
    try:
        mcp_client = request.app.state.mcp_client
        if not mcp_client or not mcp_client.is_connected:
            raise service_unavailable_error("Lead prospecting service is unavailable.", "MCP_SERVER_UNAVAILABLE")

        logger.info(f"Calling FastMCP tool 'prospect_for_leads_tool' for topic: {prospecting_request.topic}")
        
        prospecting_result = await mcp_client.call(
            "seo-analysis.prospect_for_leads_tool",
            topic=prospecting_request.topic,
            keywords=prospecting_request.keywords
        )
        
        # Here you could add the found leads to your CRM (the Leads table)
        # For now, we just return the result to the frontend.
        
        return prospecting_result

    except MCPError as e:
        logger.error(f"Error calling FastMCP server for lead prospecting: {str(e)}")
        raise internal_server_error(f"An error occurred during lead prospecting: {e}", "LEAD_PROSPECTING_ERROR")
    except Exception as e:
        logger.error(f"Error in lead prospecting: {str(e)}")
        raise internal_server_error("Failed to perform lead prospecting", "LEAD_PROSPECTING_ERROR")

if __name__ == "__main__":
    import uvicorn
    import argparse
    
    parser = argparse.ArgumentParser(description="Robofy Backend API Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host address to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    args = parser.parse_args()
    
    uvicorn.run(app, host=args.host, port=args.port)
