from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import os
from datetime import datetime
import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Import database models and session
from database import get_db, Lead as LeadModel, Content as ContentModel, User as UserModel, create_tables
from errors import (
    bad_request_error, conflict_error,
    internal_server_error, service_unavailable_error
)
from auth import get_password_hash, authenticate_user, create_access_token, get_current_active_user
from schemas import Token, UserCreate, UserResponse, LoginRequest
from config import settings
from ai_service import ai_service
from providers.base_provider import AIProviderError
from mcp_client import SEOAnalysisClient, get_seo_client
from .routers import chat

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    create_tables()
    logger.info("Database tables created (if not exists)")
    
    # Initialize AI service (already done by import, but we can log status)
    try:
        status = await ai_service.get_provider_status()
        logger.info(f"AI service initialized. Available providers: {status}")
    except Exception as e:
        logger.warning(f"Could not initialize AI service: {e}")
    
    # Initialize MCP client connections if needed
    try:
        from mcp_client import mcp_client
        if settings.MCP_SEO_ANALYSIS_URL and not settings.MCP_SEO_ANALYSIS_URL.startswith('http'):
            await mcp_client.connect_to_server("seo_analysis", settings.MCP_SEO_ANALYSIS_URL)
            logger.info(f"Connected to SEO analysis MCP server: {settings.MCP_SEO_ANALYSIS_URL}")
    except Exception as e:
        logger.warning(f"Could not initialize MCP client: {e}")
    
    yield
    
    # Shutdown logic
    await ai_service.close()
    logger.info("AI service connections closed")
    
    # Close MCP client connections
    try:
        from mcp_client import mcp_client
        await mcp_client.close_all()
        logger.info("MCP client connections closed")
    except Exception as e:
        logger.warning(f"Error closing MCP connections: {e}")

app = FastAPI(title="Robofy Backend API", version="1.0.0", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include chat router
app.include_router(chat.router)

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

class BacklinkAnalysisRequest(BaseModel):
    domain: str

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


@app.get("/")
async def root():
    return {"message": "Robofy Backend API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

@app.post("/api/leads", response_model=LeadResponse)
async def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
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
        prompt = f"""
        Generate a {request.content_type} for the {request.industry} industry with the title: {request.title}
        
        The content should be engaging, informative, and optimized for SEO.
        Include relevant industry-specific insights and practical advice.
        Format the content in markdown with appropriate headings and structure.
        """
        
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
    try:
        user = await authenticate_user(form_data.username, form_data.password, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = create_access_token(data={"sub": user.username})
        return {"access_token": access_token, "token_type": "bearer"}
        
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

@app.get("/api/auth/me", response_model=UserResponse)
async def read_users_me(current_user: UserModel = Depends(get_current_active_user)):
    return current_user

# Protected endpoints example - update existing endpoints to require authentication
@app.get("/api/leads", response_model=List[LeadResponse])
async def get_leads(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
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
        raise
    except Exception as e:
        logger.error(f"Unexpected error retrieving leads: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while retrieving leads",
            "INTERNAL_SERVER_ERROR"
        )

@app.post("/api/ai/content", response_model=ContentResponse)
async def generate_content(
    request: ContentGenerateRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
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
        prompt = f"""
        Generate a {request.content_type} for the {request.industry} industry with the title: {request.title}
        
        The content should be engaging, informative, and optimized for SEO.
        Include relevant industry-specific insights and practical advice.
        Format the content in markdown with appropriate headings and structure.
        """
        
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
        raise
    except Exception as e:
        logger.error(f"Unexpected error generating content: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while generating content",
            "INTERNAL_SERVER_ERROR"
        )

@app.get("/api/content", response_model=List[ContentResponse])
async def get_content(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
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
        raise
    except Exception as e:
        logger.error(f"Unexpected error retrieving content: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while retrieving content",
            "INTERNAL_SERVER_ERROR"
        )

# SEO Analysis Endpoints
@app.post("/api/seo/competitor-analysis", response_model=SEOAnalysisResponse)
async def seo_competitor_analysis(
    request: SEOCompetitorAnalysisRequest,
    current_user: UserModel = Depends(get_current_active_user)
):
    """Perform competitor SEO analysis"""
    try:
        async with get_seo_client(settings.MCP_SEO_ANALYSIS_URL) as seo_client:
            analysis = await seo_client.analyze_competitors(
                request.domain, request.competitors
            )
            
            return SEOAnalysisResponse(
                analysis=analysis,
                timestamp=datetime.now()
            )
            
    except Exception as e:
        logger.error(f"Error in competitor analysis: {str(e)}")
        raise internal_server_error(
            "Failed to perform competitor analysis",
            "SEO_ANALYSIS_ERROR"
        )

@app.post("/api/seo/keyword-research", response_model=SEOAnalysisResponse)
async def seo_keyword_research(
    request: KeywordResearchRequest,
    current_user: UserModel = Depends(get_current_active_user)
):
    """Perform keyword research"""
    try:
        async with get_seo_client(settings.MCP_SEO_ANALYSIS_URL) as seo_client:
            analysis = await seo_client.conduct_keyword_research(
                request.topic, request.industry
            )
            
            return SEOAnalysisResponse(
                analysis=analysis,
                timestamp=datetime.now()
            )
            
    except Exception as e:
        logger.error(f"Error in keyword research: {str(e)}")
        raise internal_server_error(
            "Failed to perform keyword research",
            "SEO_ANALYSIS_ERROR"
        )

@app.post("/api/seo/backlink-analysis", response_model=SEOAnalysisResponse)
async def seo_backlink_analysis(
    request: BacklinkAnalysisRequest,
    current_user: UserModel = Depends(get_current_active_user)
):
    """Analyze backlink profile"""
    try:
        async with get_seo_client(settings.MCP_SEO_ANALYSIS_URL) as seo_client:
            analysis = await seo_client.backlink_analysis(request.domain)
            
            return SEOAnalysisResponse(
                analysis=analysis,
                timestamp=datetime.now()
            )
            
    except Exception as e:
        logger.error(f"Error in backlink analysis: {str(e)}")
        raise internal_server_error(
            "Failed to perform backlink analysis",
            "SEO_ANALYSIS_ERROR"
        )

@app.post("/api/seo/content-gap-analysis", response_model=SEOAnalysisResponse)
async def seo_content_gap_analysis(
    request: ContentGapAnalysisRequest,
    current_user: UserModel = Depends(get_current_active_user)
):
    """Identify content gaps"""
    try:
        async with get_seo_client(settings.MCP_SEO_ANALYSIS_URL) as seo_client:
            analysis = await seo_client.content_gap_analysis(
                request.domain, request.competitor
            )
            
            return SEOAnalysisResponse(
                analysis=analysis,
                timestamp=datetime.now()
            )
            
    except Exception as e:
        logger.error(f"Error in content gap analysis: {str(e)}")
        raise internal_server_error(
            "Failed to perform content gap analysis",
            "SEO_ANALYSIS_ERROR"
        )

@app.post("/api/seo/audit", response_model=SEOAnalysisResponse)
async def seo_audit(
    request: SEOAuditRequest,
    current_user: UserModel = Depends(get_current_active_user)
):
    """Perform SEO audit"""
    try:
        async with get_seo_client(settings.MCP_SEO_ANALYSIS_URL) as seo_client:
            analysis = await seo_client.seo_audit(request.url)
            
            return SEOAnalysisResponse(
                analysis=analysis,
                timestamp=datetime.now()
            )
            
    except Exception as e:
        logger.error(f"Error in SEO audit: {str(e)}")
        raise internal_server_error(
            "Failed to perform SEO audit",
            "SEO_ANALYSIS_ERROR"
        )

@app.post("/api/seo/rank-tracking", response_model=SEOAnalysisResponse)
async def seo_rank_tracking(
    request: RankTrackingRequest,
    current_user: UserModel = Depends(get_current_active_user)
):
    """Track keyword rankings"""
    try:
        async with get_seo_client(settings.MCP_SEO_ANALYSIS_URL) as seo_client:
            analysis = await seo_client.rank_tracking(
                request.keywords, request.domain
            )
            
            return SEOAnalysisResponse(
                analysis=analysis,
                timestamp=datetime.now()
            )
            
    except Exception as e:
        logger.error(f"Error in rank tracking: {str(e)}")
        raise internal_server_error(
            "Failed to perform rank tracking",
            "SEO_ANALYSIS_ERROR"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)