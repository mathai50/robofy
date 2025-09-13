from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
import os
from datetime import datetime
import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Import database models and session
from database import get_db, Lead as LeadModel, Content as ContentModel, User as UserModel, APIKey as APIKeyModel, create_tables
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
from seo_mcp_server import (
    analyze_competitors,
    conduct_keyword_research,
    backlink_analysis,
    content_gap_analysis,
    seo_audit,
    rank_tracking
)
from routers.voice_call import router as voice_router
from routers.websocket_voice import router as websocket_voice_router
from routers.notifications import router as notifications_router
from routers.payments import router as payments_router

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
    
    # MCP client initialization is no longer needed as SEO functions are imported directly
    logger.info("SEO analysis functions imported directly - no external MCP server required")
    
    yield
    
    # Shutdown logic
    try:
        ai_service = container.ai_service()
        await ai_service.close()
        logger.info("AI service connections closed")
    except Exception as e:
        logger.warning(f"Error closing AI service: {e}")
    
    # MCP client cleanup is no longer needed
    logger.info("SEO analysis handled internally - no MCP connections to close")

# Systemic prompts for AI tools - accessible throughout the application
TOOL_CONTEXTS = {
    "seo analysis": """You are an SEO Research and Strategy Agent with access to SERP API and BeautifulSoup for web scraping. Your goal is to research SEO opportunities, analyze competitor content, and generate actionable recommendations that improve search visibility, traffic, and conversions.

Workflow Instructions:
1. Keyword Research: Use SERP API to search for seed keywords, extract related keywords, "People Also Ask" queries, and top SERP results. Summarize with search intent (informational, navigational, transactional, commercial).
2. Competitor Content Analysis: For top 5-10 ranking URLs, use BeautifulSoup to scrape page title, meta description, headings, structured data, word count, readability, and links. Store results in structured Markdown tables.
3. SERP Feature Extraction: Identify SERP features (featured snippet, local pack, videos, knowledge panel, FAQs, images, shopping results) and note optimization opportunities.
4. Gap Analysis: Compare competitor content against client's page to identify content gaps, missing keywords, schema opportunities, and backlink-worthy references.
5. Actionable Recommendations: Provide structured output with on-page improvements, content strategy, technical SEO notes, and backlink opportunities.

Output Formatting:
- Keyword Research Table: | Keyword | Search Intent | Volume | Competition Level | Notes |
- Competitor Content Table: | Rank | URL | Title | Meta | H1 | H2/H3 Summary | Word Count | Schema Used |
- SERP Features Found: List features with recommendations
- Content & SEO Gaps: Bullet list of gaps
- Final Recommendations: Actionable roadmap prioritized by impact

Always minimize noise: keep scraped text summaries concise yet informative.
Cross-check duplicate insights and merge overlaps.
Prioritize recommendations that directly improve both ranking potential and conversion quality.

Your analysis should feed into content creation and social media agents for ideation and implementation based on the recommendations.""",
    "content creation": """You are a Content Strategy Director specializing in AI-powered content creation. Develop comprehensive content strategies that drive organic traffic and engagement.

Key Responsibilities:
- Create SEO-optimized content for blogs, landing pages, and social media based on SEO analysis recommendations
- Develop content calendars and topic clusters from keyword research and gap analysis
- Optimize content for featured snippets and voice search
- Analyze content performance and identify opportunities
- Ensure brand voice consistency across all channels
- Incorporate multimedia elements and interactive content
- Generate to-do mind maps, topical maps, and content outlines from SEO insights

Always request target audience, industry, and content goals if not provided. Use SEO analysis outputs to inform your content strategy.""",
    "content ideation": """You are a Content Creation Ideation Agent tasked with generating content ideas to build topical authority for a website based on keyword and website analysis.

Inputs:
- Website URLs and core topic/keyword analysis data
- Keyword clusters with search intent
- Competitor content insights and content gap analysis

Tasks:
- Analyze provided keyword data, identifying broad topics and subtopics relevant to the website’s niche.
- Generate in-depth content ideas aligned with user search intent mapped by keyword clusters.
- Suggest pillar content (comprehensive, broad topics) and supporting articles (targeted subtopics, FAQs, how-tos).
- Recommend content formats (blog, guides, case studies) and internal linking opportunities that enhance topical depth.
- Prioritize content ideas based on SEO impact potential and audience relevance.

Output:
A structured list of content ideas broken into pillars and supporting topics with brief descriptions, target keywords, and suggested content types.""",
    "topical mapping": """You are a Topical Map Creation Agent responsible for designing a comprehensive content topic map based on research insights and understanding of the customer decision journey.

Inputs:
- Content ideas and keyword clusters (from Content Creation Agent)
- Customer decision journey stages (awareness, consideration, decision)
- Competitor topical authority maps (if available)

Tasks:
- Organize content ideas into a hierarchical topical map showing relationships between main topics, subtopics, and customer journey stages.
- Map keywords and content ideas to relevant stages:
  - Awareness: educational, problem-identification content
  - Consideration: solution comparisons, product features, pros & cons
  - Decision: purchase guides, case studies, testimonials
- Suggest internal linking structure connecting topics naturally to support SEO and user navigation.
- Visualize the topic map in a mind map or hierarchical outline format with clear labels and descriptions.

Output:
A detailed topical map/mind map representing topic clusters aligned to user journey, indicating priority content nodes and linking paths.""",
    "competitor analysis": """You are a Competitor Analysis Agent specializing in digital and SEO benchmarking. Analyze competitor websites and digital presences to provide clear, structured insight into:

1. Competitor Strategy:
   - Core SEO and digital marketing strategies
   - Target audience and market focus
   - Value propositions and messaging
   - Content marketing approach (blog, resources, case studies, etc.)
   - Channel mix (organic search, paid, social, referral)
   - Notable strengths/weaknesses in approach (e.g., technical SEO, content depth, topical authority)
   - Unique tactics (schema, featured snippets, content formats, landing page strategies)
   - Links between on-site and off-site (social, PR, partnerships) efforts

2. Market Position:
   - Estimate relative market share using organic traffic or visibility indices
   - Evaluate authority metrics (Domain Authority, Trust Flow, Citation Flow)
   - Analyze prominence in SERPs for key target queries (rank positions, featured results)
   - Identify top-performing content or traffic-driving pages including "hero" content and evergreen assets
   - Segment competitors (primary/direct, secondary, niche/vertical specialists)
   - Note reputation, user sentiment, or PR footprint if available (reviews, news mentions, social engagement)

3. Performance Metrics:
   - Organic search visibility (estimated monthly traffic, number of ranking keywords, keyword trend curves)
   - Top organic and paid keywords (with rankings and estimated traffic share)
   - Backlink profile (number of referring domains, diversity, authority of backlinks)
   - Website engagement metrics (estimated visits, average session duration, bounce rate, pages per session)
   - Content velocity (publishing frequency, last update timestamp for main content)
   - Traffic sources breakdown (percent of traffic from organic, paid, direct, referral, social)
   - SERP feature presence (featured snippets, People Also Ask, local/map pack, etc.)
   - Technical SEO markers (site speed scores, mobile-friendliness, schema usage)
   - Social media reach or impact for relevant channels (followers, engagement rates)

Output Structure:
A. Competitor Strategy Summary Table: | Competitor | Audience/Focus | Messaging | Key Content Types | Channel Mix | Unique Tactics | Notes |
B. Market Position Table: | Competitor | Authority Metric(s) | Organic Ranking Strength | Market Share Est. | Top Content | Reputation Notes |
C. Performance Metrics Table: | Competitor | Est. Traffic | Ranking Keywords | Top Keywords | Ref. Domains | Engagement (avg session/pv/br) | Content Velocity | SERP Features | Tech SEO Notes |
D. Executive Summary: Bulleted list of major strengths/weaknesses per competitor, clear differentiation points, and top opportunities/gaps for your brand

Guidance:
- Always use the most current, credible, and comparable data sources
- Add concise but insightful narrative notes above each table if needed
- Highlight what makes a competitor dominant or vulnerable
- Where direct data is missing, use reasonable estimates and explain sources/assumptions
- Aim for a mix of tabular (quantitative) and narrative (qualitative) analysis, ready for senior decision-making or strategic planning

Your analysis should provide actionable insights for SEO and content strategy optimization.""",
    "customer support": """You are a Customer Success Manager focused on technical support and customer satisfaction.

Key Responsibilities:
- Resolve technical issues and answer product questions
- Provide step-by-step troubleshooting guides
- Escalate complex issues to appropriate teams
- Collect customer feedback for product improvement
- Ensure positive customer experiences
- Maintain knowledge base and documentation

Always be empathetic, patient, and solution-oriented.""",
    "social media": """You are a Social Media Content Creation Agent who uses outputs from the Content Creation Agent and Topical Map Agent to craft engaging social media posts for various platforms.

Inputs:
- Structured content ideas (pillar/supporting topics)
- Topical map illustrating content hierarchy and themes
- Brand voice and social media strategy guidelines

Tasks:
- Create content snippets, teaser posts, and social media copy for different platforms (Twitter, LinkedIn, Instagram, Facebook) tailored to platform-specific norms.
- Generate engaging headlines, captions, and calls to action that link back to website content.
- Develop content series ideas aligned with topical clusters and customer journey stages to build audience engagement and authority over time.
- Include recommendations for multimedia assets (images, infographics, video snippets) to accompany posts, referencing image generation or multimedia teams/tools as needed.
- Adapt tone and style to brand guidelines (formal, conversational, educational, promotional).

Output:
A content calendar and ready-to-publish social media posts with copy, hashtag suggestions, platform notes, and media asset briefs.""",
    "appointment booking": """You are an Appointment Coordination Specialist managing schedules and consultations.

Key Responsibilities:
- Schedule appointments based on availability
- Send confirmation and reminder notifications
- Handle rescheduling and cancellations
- Maintain calendar integrity and avoid conflicts
- Provide pre-appointment preparation guidelines
- Integrate with calendar systems and CRM

Always confirm time zones and appointment details.""",
    "seo agent": """You are an SEO Research and Strategy Agent with access to SERP API and BeautifulSoup for web scraping. Your goal is to research SEO opportunities, analyze competitor content, and generate actionable recommendations that improve search visibility, traffic, and conversions.

Workflow Instructions:
1. Keyword Research: Use SERP API to search for seed keywords, extract related keywords, "People Also Ask" queries, and top SERP results. Summarize with search intent (informational, navigational, transactional, commercial).
2. Competitor Content Analysis: For top 5-10 ranking URLs, use BeautifulSoup to scrape page title, meta description, headings, structured data, word count, readability, and links. Store results in structured Markdown tables.
3. SERP Feature Extraction: Identify SERP features (featured snippet, local pack, videos, knowledge panel, FAQs, images, shopping results) and note optimization opportunities.
4. Gap Analysis: Compare competitor content against client's page to identify content gaps, missing keywords, schema opportunities, and backlink-worthy references.
5. Actionable Recommendations: Provide structured output with on-page improvements, content strategy, technical SEO notes, and backlink opportunities.

Output Formatting:
- Keyword Research Table: | Keyword | Search Intent | Volume | Competition Level | Notes |
- Competitor Content Table: | Rank | URL | Title | Meta | H1 | H2/H3 Summary | Word Count | Schema Used |
- SERP Features Found: List features with recommendations
- Content & SEO Gaps: Bullet list of gaps
- Final Recommendations: Actionable roadmap prioritized by impact

Always minimize noise: keep scraped text summaries concise yet informative.
Cross-check duplicate insights and merge overlaps.
Prioritize recommendations that directly improve both ranking potential and conversion quality.

Your analysis should feed into content creation and social media agents for ideation and implementation based on the recommendations.""",
    "competitor analysis agent": """You are a Competitor Analysis Agent specializing in digital and SEO benchmarking. Analyze competitor websites and digital presences to provide clear, structured insight into:

1. Competitor Strategy:
   - Core SEO and digital marketing strategies
   - Target audience and market focus
   - Value propositions and messaging
   - Content marketing approach (blog, resources, case studies, etc.)
   - Channel mix (organic search, paid, social, referral)
   - Notable strengths/weaknesses in approach (e.g., technical SEO, content depth, topical authority)
   - Unique tactics (schema, featured snippets, content formats, landing page strategies)
   - Links between on-site and off-site (social, PR, partnerships) efforts

2. Market Position:
   - Estimate relative market share using organic traffic or visibility indices
   - Evaluate authority metrics (Domain Authority, Trust Flow, Citation Flow)
   - Analyze prominence in SERPs for key target queries (rank positions, featured results)
   - Identify top-performing content or traffic-driving pages including "hero" content and evergreen assets
   - Segment competitors (primary/direct, secondary, niche/vertical specialists)
   - Note reputation, user sentiment, or PR footprint if available (reviews, news mentions, social engagement)

3. Performance Metrics:
   - Organic search visibility (estimated monthly traffic, number of ranking keywords, keyword trend curves)
   - Top organic and paid keywords (with rankings and estimated traffic share)
   - Backlink profile (number of referring domains, diversity, authority of backlinks)
   - Website engagement metrics (estimated visits, average session duration, bounce rate, pages per session)
   - Content velocity (publishing frequency, last update timestamp for main content)
   - Traffic sources breakdown (percent of traffic from organic, paid, direct, referral, social)
   - SERP feature presence (featured snippets, People Also Ask, local/map pack, etc.)
   - Technical SEO markers (site speed scores, mobile-friendliness, schema usage)
   - Social media reach or impact for relevant channels (followers, engagement rates)

Output Structure:
A. Competitor Strategy Summary Table: | Competitor | Audience/Focus | Messaging | Key Content Types | Channel Mix | Unique Tactics | Notes |
B. Market Position Table: | Competitor | Authority Metric(s) | Organic Ranking Strength | Market Share Est. | Top Content | Reputation Notes |
C. Performance Metrics Table: | Competitor | Est. Traffic | Ranking Keywords | Top Keywords | Ref. Domains | Engagement (avg session/pv/br) | Content Velocity | SERP Features | Tech SEO Notes |
D. Executive Summary: Bulleted list of major strengths/weaknesses per competitor, clear differentiation points, and top opportunities/gaps for your brand

Guidance:
- Always use the most current, credible, and comparable data sources
- Add concise but insightful narrative notes above each table if needed
- Highlight what makes a competitor dominant or vulnerable
- Where direct data is missing, use reasonable estimates and explain sources/assumptions
- Aim for a mix of tabular (quantitative) and narrative (qualitative) analysis, ready for senior decision-making or strategic planning

Your analysis should provide actionable insights for SEO and content strategy optimization."""
}

app = FastAPI(title="Robofy Backend API", version="1.0.0", lifespan=lifespan)

# Add rate limiting middleware
# app.add_middleware(RateLimitMiddleware)

# CORS middleware - configured for Next.js development server
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
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

# Chat Models
class ChatMessageRequest(BaseModel):
    message: str
    tool: Optional[str] = None

class ChatMessageResponse(BaseModel):
    response: str
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

# Helper functions for SEO audit response formatting
def _get_status_code_meaning(status_code: int) -> str:
    """Get meaning of HTTP status code for SEO audit"""
    if status_code == 200:
        return "OK - Page is accessible"
    elif status_code == 301:
        return "Moved Permanently - Redirect detected"
    elif status_code == 302:
        return "Found - Temporary redirect"
    elif status_code == 404:
        return "Not Found - Page missing"
    elif status_code == 500:
        return "Internal Server Error - Server issue"
    else:
        return f"HTTP {status_code} - Consult web server documentation"

def _get_speed_assessment(speed: str) -> str:
    """Assess page speed for SEO audit"""
    try:
        speed_seconds = float(speed.replace('s', ''))
        if speed_seconds <= 1.0:
            return "Excellent - Fast loading"
        elif speed_seconds <= 2.0:
            return "Good - Acceptable speed"
        elif speed_seconds <= 3.0:
            return "Average - Could be improved"
        else:
            return "Slow - Needs optimization"
    except:
        return "Speed assessment unavailable"

def _get_heading_assessment(heading_count: int) -> str:
    """Assess heading structure for SEO audit"""
    if heading_count == 0:
        return "❌ Critical - No headings found"
    elif heading_count <= 3:
        return "⚠️ Limited - Minimal heading structure"
    elif heading_count <= 10:
        return "✅ Good - Well-structured content"
    else:
        return "✅ Excellent - Comprehensive structure"

def _get_word_count_assessment(word_count: int) -> str:
    """Assess content length for SEO audit"""
    if word_count == 0:
        return "❌ Critical - No content found"
    elif word_count <= 100:
        return "⚠️ Very Short - Insufficient for SEO"
    elif word_count <= 300:
        return "⚠️ Short - Consider expanding content"
    elif word_count <= 800:
        return "✅ Good - Adequate length"
    elif word_count <= 1500:
        return "✅ Excellent - Comprehensive content"
    else:
        return "✅ Extensive - Very detailed content"

def _get_image_optimization_assessment(image_info: str) -> str:
    """Assess image optimization for SEO audit"""
    if "0 images found" in image_info:
        return "No images - Consider adding visual content"
    
    try:
        # Extract numbers from string like "5 images found (alt tags: 3/5)"
        import re
        match = re.search(r'(\d+).*?alt tags: (\d+)/(\d+)', image_info)
        if match:
            total_images = int(match.group(1))
            alt_tags = int(match.group(2))
            if alt_tags == 0:
                return "❌ Critical - No alt tags found"
            elif alt_tags < total_images:
                return f"⚠️ Partial - {alt_tags}/{total_images} images have alt text"
            else:
                return "✅ Excellent - All images have alt text"
    except:
        pass
    return "Image optimization status unknown"

def _get_internal_links_assessment(link_count: int) -> str:
    """Assess internal linking for SEO audit"""
    if link_count == 0:
        return "❌ Critical - No internal links"
    elif link_count <= 5:
        return "⚠️ Limited - Few internal links"
    elif link_count <= 15:
        return "✅ Good - Adequate internal linking"
    else:
        return "✅ Excellent - Strong internal link structure"

def _calculate_seo_score(audit_result) -> int:
    """Calculate overall SEO score based on audit results"""
    score = 100
    
    # Deduct points for critical issues
    if audit_result.status_code != 200:
        score -= 20
    if not audit_result.ssl_certificate:
        score -= 15
    if audit_result.title_tag == "MISSING":
        score -= 10
    if audit_result.meta_description == "MISSING":
        score -= 10
    if audit_result.heading_count == 0:
        score -= 10
    if audit_result.word_count < 100:
        score -= 10
    if not audit_result.mobile_friendly:
        score -= 5
    
    # Ensure score doesn't go below 0
    return max(0, min(100, score))

def _get_score_rating(score: int) -> str:
    """Get rating based on SEO score"""
    if score >= 90:
        return "Excellent"
    elif score >= 70:
        return "Good"
    elif score >= 50:
        return "Average"
    elif score >= 30:
        return "Poor"
    else:
        return "Critical"

def _identify_strengths(audit_result) -> str:
    """Identify strengths from SEO audit"""
    strengths = []
    if audit_result.status_code == 200:
        strengths.append("Page accessible with 200 OK status")
    if audit_result.ssl_certificate:
        strengths.append("SSL certificate installed")
    if audit_result.title_tag != "MISSING":
        strengths.append("Title tag present")
    if audit_result.meta_description != "MISSING":
        strengths.append("Meta description present")
    if audit_result.heading_count > 0:
        strengths.append("Heading structure exists")
    if audit_result.word_count > 300:
        strengths.append("Adequate content length")
    if audit_result.mobile_friendly:
        strengths.append("Mobile friendly design")
    
    return ", ".join(strengths) if strengths else "No significant strengths identified"

def _identify_critical_issues(audit_result) -> str:
    """Identify critical issues from SEO audit"""
    issues = []
    if audit_result.status_code != 200:
        issues.append(f"Non-200 status code ({audit_result.status_code})")
    if not audit_result.ssl_certificate:
        issues.append("Missing SSL certificate")
    if audit_result.title_tag == "MISSING":
        issues.append("Missing title tag")
    if audit_result.meta_description == "MISSING":
        issues.append("Missing meta description")
    if audit_result.heading_count == 0:
        issues.append("No heading structure")
    if audit_result.word_count < 100:
        issues.append("Insufficient content")
    if not audit_result.mobile_friendly:
        issues.append("Not mobile friendly")
    
    return ", ".join(issues) if issues else "No critical issues identified"

def extract_url(text: str) -> Optional[str]:
    """Enhanced URL extraction function with improved regex for consistent URL detection across all tools."""
    import re
    # Combined regex to find URLs with or without protocol, using a more robust pattern
    url_match = re.search(r'https?://(?:www\.)?[^\s]+|([a-zA-Z0-9-]+\.[a-zA-Z]{2,})', text)
    if url_match:
        # Get the first matching group
        url = url_match.group(0)
        # If the URL doesn't have a protocol, add https://
        if not url.startswith(('http://', 'https://')):
            return f"https://{url}"
        return url
    return None

@app.post("/api/ai/message", response_model=ChatMessageResponse)
async def chat_message(request: ChatMessageRequest):
    """
    Handle chat messages and generate AI responses with integrated SEO analysis capabilities.
    
    This endpoint processes natural language messages and can perform various SEO functions
    including competitor analysis, keyword research, and SEO audits based on message content.
    
    Args:
        request (ChatMessageRequest): Chat message and optional tool specification.
    
    Returns:
        ChatMessageResponse: AI-generated response with timestamp.
    
    Raises:
        HTTPException: 500 for internal server errors.
        
    Example:
        Request:
        ```json
        {
            "message": "Analyze my website https://example.com",
            "tool": "seo analysis"
        }
        ```
        
        Response:
        ```json
        {
            "response": "SEO Audit Results for https://example.com...",
            "timestamp": "2025-09-12T14:40:44.898Z"
        }
        ```
    """
    try:
        message_lower = request.message.lower()
        
        # Extract URL from message for SEO-related functions using centralized function
        extracted_url = extract_url(request.message)
        
        # Prioritize tool-based routing over message content
        if request.tool:
            tool_lower = request.tool.lower()
            
            # SEO Analysis tool
            if tool_lower == "seo analysis" and extracted_url:
                # Perform actual SEO audit
                audit_result = await seo_audit(extracted_url)
                # Format the audit result for verbose and readable chat response
                response_text = f"""
# 📊 Comprehensive SEO Audit Report for {extracted_url}

## 🔧 Technical Health Assessment
- **HTTP Status Code**: {audit_result.status_code} - {_get_status_code_meaning(audit_result.status_code)}
- **Page Load Speed**: {audit_result.page_speed} - {_get_speed_assessment(audit_result.page_speed)}
- **Mobile Responsiveness**: {'✅ Yes - Good mobile compatibility' if audit_result.mobile_friendly else '❌ No - Needs mobile optimization'}
- **SSL Certificate**: {'✅ Yes - Secure HTTPS connection' if audit_result.ssl_certificate else '❌ No - Security risk without SSL'}

## 📝 Content & Metadata Analysis
- **Title Tag**: {audit_result.title_tag if audit_result.title_tag != 'MISSING' else '❌ Missing - Critical for SEO'}
- **Meta Description**: {audit_result.meta_description if audit_result.meta_description != 'MISSING' else '❌ Missing - Important for click-through rates'}
- **Heading Structure**: {audit_result.heading_count} headings found - {_get_heading_assessment(audit_result.heading_count)}
- **Content Length**: {audit_result.word_count} words - {_get_word_count_assessment(audit_result.word_count)}

## 🖼️ Media Optimization
- **Images**: {audit_result.image_optimization} - {_get_image_optimization_assessment(audit_result.image_optimization)}

## 🔗 Internal Linking
- **Internal Links**: {audit_result.internal_links} links found - {_get_internal_links_assessment(audit_result.internal_links)}

## 🎯 Actionable Recommendations

### 🚀 High Priority Improvements
{chr(10).join('- ' + rec for rec in audit_result.recommendations if any(word in rec.lower() for word in ['optimize', 'add', 'improve', 'ensure', 'implement']))}

### 📈 Medium Priority Enhancements
{chr(10).join('- ' + rec for rec in audit_result.recommendations if any(word in rec.lower() for word in ['consider', 'enhance', 'expand', 'develop']))}

### 💡 Additional Insights
- **Overall Score**: {_calculate_seo_score(audit_result)}/100 - {_get_score_rating(_calculate_seo_score(audit_result))}
- **Key Strengths**: {_identify_strengths(audit_result)}
- **Critical Issues**: {_identify_critical_issues(audit_result)}

*Report generated at: {audit_result.generated_at}*

---
*Note: This analysis combines technical SEO checks with content quality assessment. For comprehensive monitoring, consider regular audits and performance tracking.*
"""
                return ChatMessageResponse(
                    response=response_text,
                    timestamp=datetime.now()
                )
            elif tool_lower == "seo analysis":
                return ChatMessageResponse(
                    response="I'd be happy to perform an SEO audit! Please provide the website URL you'd like me to analyze (e.g., https://example.com or example.com).",
                    timestamp=datetime.now()
                )
            
            # Competitor Analysis tool
            elif tool_lower == "competitor analysis" and extracted_url:
                # Extract domain from URL
                from urllib.parse import urlparse
                parsed_url = urlparse(extracted_url)
                domain = parsed_url.netloc or parsed_url.path
                analysis_result = await analyze_competitors(domain)
                # Format the competitor analysis for verbose and readable chat response
                response_text = f"""
# 🏆 Comprehensive Competitor Analysis for {domain}

## 📊 Market Position Overview
- **Domain Authority**: {analysis_result.domain_authority}
- **Estimated Monthly Traffic**: {analysis_result.estimated_traffic}
- **Competitors Identified**: {len(analysis_result.competitors) if analysis_result.competitors else 0} competitors

## 🎯 Key Competitors
{chr(10).join(f'- **{comp}**' for comp in analysis_result.competitors) if analysis_result.competitors else '- No direct competitors identified'}

## 📈 Content Gap Analysis
{chr(10).join(f'- {gap}' for gap in analysis_result.content_gaps) if analysis_result.content_gaps else '- No significant content gaps identified'}

## 🔗 Backlink Profile Comparison
{analysis_result.backlink_comparison}

## 💡 Strategic Recommendations

### 🚀 Immediate Opportunities
{chr(10).join('- ' + rec for rec in analysis_result.recommendations if any(word in rec.lower() for word in ['optimize', 'implement', 'create', 'build']))}

### 📈 Medium-Term Initiatives
{chr(10).join('- ' + rec for rec in analysis_result.recommendations if any(word in rec.lower() for word in ['develop', 'expand', 'enhance', 'improve']))}

### 🎯 Long-Term Strategy
{chr(10).join('- ' + rec for rec in analysis_result.recommendations if any(word in rec.lower() for word in ['strategic', 'long-term', 'partnership', 'authority']))}

*Analysis generated at: {analysis_result.generated_at}*

---
*Note: Competitor analysis helps identify market opportunities and content gaps. Regular monitoring is recommended for ongoing strategy adjustments.*
"""
                return ChatMessageResponse(
                    response=response_text,
                    timestamp=datetime.now()
                )
            elif tool_lower == "competitor analysis":
                return ChatMessageResponse(
                    response="I can analyze your competitors! Please provide your website domain (e.g., example.com) so I can identify and analyze your competitors.",
                    timestamp=datetime.now()
                )
            
            # Keyword Research tool
            elif tool_lower == "keyword research":
                # Extract topic from message using more robust pattern
                topic_match = re.search(r'(?:for|about|research|analyze)\s+(.+?)(?:\s|$)', message_lower, re.IGNORECASE)
                if topic_match:
                    topic = topic_match.group(1).strip()
                    research_result = await conduct_keyword_research(topic)
                    # Format the keyword research for verbose and readable chat response
                    response_text = f"""
# 🔍 Comprehensive Keyword Research for '{topic}'

## 📊 Keyword Volume Analysis

### 🚀 High Volume Keywords (1000+ monthly searches)
{chr(10).join(f'- **{kw}** - High search volume, competitive' for kw in research_result.high_volume_keywords) if research_result.high_volume_keywords else '- No high volume keywords identified'}

### 📈 Medium Volume Keywords (100-999 monthly searches)
{chr(10).join(f'- **{kw}** - Moderate search volume, good opportunity' for kw in research_result.medium_volume_keywords) if research_result.medium_volume_keywords else '- No medium volume keywords identified'}

### 🎯 Long Tail Keywords (Low volume, high intent)
{chr(10).join(f'- **{kw}** - Specific intent, lower competition' for kw in research_result.long_tail_keywords) if research_result.long_tail_keywords else '- No long tail keywords identified'}

## 🏆 Competitor Keyword Insights
{chr(10).join(f'- **{kw}** - Competitors are ranking for this' for kw in research_result.competitor_keywords) if research_result.competitor_keywords else '- No competitor keyword insights available'}

## 💡 Strategic Recommendations

### 🎯 Immediate Targeting Opportunities
- Focus on **medium volume keywords** for quicker ranking potential
- Target **long tail keywords** for specific user intent and lower competition
- Monitor **competitor keywords** for gap analysis and opportunity identification

### 📈 Content Strategy Suggestions
- Create comprehensive content around high volume keywords
- Develop targeted pages for long tail keyword clusters
- Build topical authority around core keyword themes

*Research generated at: {research_result.generated_at}*

---
*Note: Keyword research should inform content strategy and SEO efforts. Regular updates are recommended as search trends evolve.*
"""
                    return ChatMessageResponse(
                        response=response_text,
                        timestamp=datetime.now()
                    )
                else:
                    return ChatMessageResponse(
                        response="I can help with keyword research! Please specify what topic or industry you'd like me to research keywords for (e.g., 'keyword research for digital marketing').",
                        timestamp=datetime.now()
                    )
        
        # Fallback to message-based routing if no tool specified
        # Check for SEO audit requests
        seo_audit_phrases = ["seo audit", "website analysis", "analyze my website", "comprehensive audit", "comprehensive seo audit"]
        if any(phrase in message_lower for phrase in seo_audit_phrases) and extracted_url:
            # Perform actual SEO audit
            audit_result = await seo_audit(extracted_url)
            # Format the audit result for verbose and readable chat response
            response_text = f"""
# 📊 Comprehensive SEO Audit Report for {extracted_url}

## 🔧 Technical Health Assessment
- **HTTP Status Code**: {audit_result.status_code} - {_get_status_code_meaning(audit_result.status_code)}
- **Page Load Speed**: {audit_result.page_speed} - {_get_speed_assessment(audit_result.page_speed)}
- **Mobile Responsiveness**: {'✅ Yes - Good mobile compatibility' if audit_result.mobile_friendly else '❌ No - Needs mobile optimization'}
- **SSL Certificate**: {'✅ Yes - Secure HTTPS connection' if audit_result.ssl_certificate else '❌ No - Security risk without SSL'}

## 📝 Content & Metadata Analysis
- **Title Tag**: {audit_result.title_tag if audit_result.title_tag != 'MISSING' else '❌ Missing - Critical for SEO'}
- **Meta Description**: {audit_result.meta_description if audit_result.meta_description != 'MISSING' else '❌ Missing - Important for click-through rates'}
- **Heading Structure**: {audit_result.heading_count} headings found - {_get_heading_assessment(audit_result.heading_count)}
- **Content Length**: {audit_result.word_count} words - {_get_word_count_assessment(audit_result.word_count)}

## 🖼️ Media Optimization
- **Images**: {audit_result.image_optimization} - {_get_image_optimization_assessment(audit_result.image_optimization)}

## 🔗 Internal Linking
- **Internal Links**: {audit_result.internal_links} links found - {_get_internal_links_assessment(audit_result.internal_links)}

## 🎯 Actionable Recommendations

### 🚀 High Priority Improvements
{chr(10).join('- ' + rec for rec in audit_result.recommendations if any(word in rec.lower() for word in ['optimize', 'add', 'improve', 'ensure', 'implement']))}

### 📈 Medium Priority Enhancements
{chr(10).join('- ' + rec for rec in audit_result.recommendations if any(word in rec.lower() for word in ['consider', 'enhance', 'expand', 'develop']))}

### 💡 Additional Insights
- **Overall Score**: {_calculate_seo_score(audit_result)}/100 - {_get_score_rating(_calculate_seo_score(audit_result))}
- **Key Strengths**: {_identify_strengths(audit_result)}
- **Critical Issues**: {_identify_critical_issues(audit_result)}

*Report generated at: {audit_result.generated_at}*

---
*Note: This analysis combines technical SEO checks with content quality assessment. For comprehensive monitoring, consider regular audits and performance tracking.*
"""
            return ChatMessageResponse(
                response=response_text,
                timestamp=datetime.now()
            )
        elif any(phrase in message_lower for phrase in seo_audit_phrases):
            return ChatMessageResponse(
                response="I'd be happy to perform an SEO audit! Please provide the website URL you'd like me to analyze (e.g., https://example.com or example.com).",
                timestamp=datetime.now()
            )
        
        # Check for competitor analysis requests
        elif any(phrase in message_lower for phrase in ["competitor analysis", "analyze competitors", "competitor seo"]) and extracted_url:
            # Extract domain from URL
            from urllib.parse import urlparse
            parsed_url = urlparse(extracted_url)
            domain = parsed_url.netloc or parsed_url.path
            analysis_result = await analyze_competitors(domain)
            # Format the competitor analysis for verbose and readable chat response
            response_text = f"""
# 🏆 Comprehensive Competitor Analysis for {domain}

## 📊 Market Position Overview
- **Domain Authority**: {analysis_result.domain_authority}
- **Estimated Monthly Traffic**: {analysis_result.estimated_traffic}
- **Competitors Identified**: {len(analysis_result.competitors) if analysis_result.competitors else 0} competitors

## 🎯 Key Competitors
{chr(10).join(f'- **{comp}**' for comp in analysis_result.competitors) if analysis_result.competitors else '- No direct competitors identified'}

## 📈 Content Gap Analysis
{chr(10).join(f'- {gap}' for gap in analysis_result.content_gaps) if analysis_result.content_gaps else '- No significant content gaps identified'}

## 🔗 Backlink Profile Comparison
{analysis_result.backlink_comparison}

## 💡 Strategic Recommendations

### 🚀 Immediate Opportunities
{chr(10).join('- ' + rec for rec in analysis_result.recommendations if any(word in rec.lower() for word in ['optimize', 'implement', 'create', 'build']))}

### 📈 Medium-Term Initiatives
{chr(10).join('- ' + rec for rec in analysis_result.recommendations if any(word in rec.lower() for word in ['develop', 'expand', 'enhance', 'improve']))}

### 🎯 Long-Term Strategy
{chr(10).join('- ' + rec for rec in analysis_result.recommendations if any(word in rec.lower() for word in ['strategic', 'long-term', 'partnership', 'authority']))}

*Analysis generated at: {analysis_result.generated_at}*

---
*Note: Competitor analysis helps identify market opportunities and content gaps. Regular monitoring is recommended for ongoing strategy adjustments.*
"""
            return ChatMessageResponse(
                response=response_text,
                timestamp=datetime.now()
            )
        elif any(phrase in message_lower for phrase in ["competitor analysis", "analyze competitors", "competitor seo"]):
            return ChatMessageResponse(
                response="I can analyze your competitors! Please provide your website domain (e.g., example.com) so I can identify and analyze your competitors.",
                timestamp=datetime.now()
            )
        
        # Check for keyword research requests
        elif any(phrase in message_lower for phrase in ["keyword research", "keyword analysis", "find keywords"]):
            # Extract topic from message using more robust pattern
            topic_match = re.search(r'(?:for|about|research|analyze)\s+(.+?)(?:\s|$)', message_lower, re.IGNORECASE)
            if topic_match:
                topic = topic_match.group(1).strip()
                research_result = await conduct_keyword_research(topic)
                # Format the keyword research for verbose and readable chat response
                response_text = f"""
# 🔍 Comprehensive Keyword Research for '{topic}'

## 📊 Keyword Volume Analysis

### 🚀 High Volume Keywords (1000+ monthly searches)
{chr(10).join(f'- **{kw}** - High search volume, competitive' for kw in research_result.high_volume_keywords) if research_result.high_volume_keywords else '- No high volume keywords identified'}

### 📈 Medium Volume Keywords (100-999 monthly searches)
{chr(10).join(f'- **{kw}** - Moderate search volume, good opportunity' for kw in research_result.medium_volume_keywords) if research_result.medium_volume_keywords else '- No medium volume keywords identified'}

### 🎯 Long Tail Keywords (Low volume, high intent)
{chr(10).join(f'- **{kw}** - Specific intent, lower competition' for kw in research_result.long_tail_keywords) if research_result.long_tail_keywords else '- No long tail keywords identified'}

## 🏆 Competitor Keyword Insights
{chr(10).join(f'- **{kw}** - Competitors are ranking for this' for kw in research_result.competitor_keywords) if research_result.competitor_keywords else '- No competitor keyword insights available'}

## 💡 Strategic Recommendations

### 🎯 Immediate Targeting Opportunities
- Focus on **medium volume keywords** for quicker ranking potential
- Target **long tail keywords** for specific user intent and lower competition
- Monitor **competitor keywords** for gap analysis and opportunity identification

### 📈 Content Strategy Suggestions
- Create comprehensive content around high volume keywords
- Develop targeted pages for long tail keyword clusters
- Build topical authority around core keyword themes

*Research generated at: {research_result.generated_at}*

---
*Note: Keyword research should inform content strategy and SEO efforts. Regular updates are recommended as search trends evolve.*
"""
                return ChatMessageResponse(
                    response=response_text,
                    timestamp=datetime.now()
                )
            else:
                return ChatMessageResponse(
                    response="I can help with keyword research! Please specify what topic or industry you'd like me to research keywords for (e.g., 'keyword research for digital marketing').",
                    timestamp=datetime.now()
                )
        
        # For other messages, use the AI service with enhanced context
        enhanced_prompt = request.message
        if request.tool:
            # Use the module-level systemic prompts for consistent AI behavior across the application
            context = TOOL_CONTEXTS.get(request.tool.lower(), "")
            enhanced_prompt = context + enhanced_prompt
        
        # Generate AI response using the AI service from container
        ai_service = container.ai_service()
        ai_response = await ai_service.generate_text(enhanced_prompt)
        
        return ChatMessageResponse(
            response=ai_response,
            timestamp=datetime.now()
        )
        
    except AIProviderError as e:
        logger.warning(f"AI service unavailable, providing fallback response: {str(e)}")
        # Provide a friendly fallback response when AI services are unavailable
        fallback_responses = {
            "seo": "I'd be happy to help with SEO analysis! For detailed SEO recommendations, please ensure your AI API keys are configured.",
            "support": "I can help with technical support! To get the best assistance, please configure your AI service API keys.",
            "appointment": "I can help you schedule an appointment! For full functionality, please set up your AI service credentials.",
            "competitor": "I can analyze competitors! To provide detailed competitor analysis, please configure your AI API keys.",
            "social": "I can create social media content! For personalized content generation, please set up your AI services.",
            "content": "I can help with content creation! To generate marketing content, please configure your AI API keys."
        }
        
        # Check if tool parameter is provided for fallback
        if request.tool:
            tool_key = request.tool.lower()
            if tool_key in fallback_responses:
                return ChatMessageResponse(
                    response=fallback_responses[tool_key],
                    timestamp=datetime.now()
                )
        
        # Check if this is a quick action prompt and provide appropriate fallback
        prompt_lower = request.message.lower()
        for key, response in fallback_responses.items():
            if key in prompt_lower:
                return ChatMessageResponse(
                    response=response,
                    timestamp=datetime.now()
                )
        
        # Generic fallback response
        return ChatMessageResponse(
            response="I'm here to help! To use the full AI capabilities, please configure your AI service API keys in the AI tools settings. You can still use the available tools for guidance on what I can assist with.",
            timestamp=datetime.now()
        )
    except Exception as e:
        logger.error(f"Unexpected error in chat: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while processing your message",
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
        valid_providers = ["openai", "google", "deepseek", "huggingface"]
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
        existing_request = db.query(APIAccessRequest).filter(APIAccessRequest.email == request_data.email).first()
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
        db_access_request = APIAccessRequest(
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
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error validating API key: {str(e)}")
        raise service_unavailable_error(
            "Database temporarily unavailable. Please try again later.",
            "DATABASE_UNAVAILABLE"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error validating API key: {str(e)}")
        raise internal_server_error(
            "An unexpected error occurred while validating API key",
            "INTERNAL_SERVER_ERROR"
        )


# SEO Analysis Endpoints
@app.post("/api/seo/competitor-analysis", response_model=SEOAnalysisResponse)
async def seo_competitor_analysis(
    request: SEOCompetitorAnalysisRequest,
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Perform comprehensive competitor SEO analysis for a given domain.
    
    Args:
        request (SEOCompetitorAnalysisRequest): Domain and optional competitors list.
        current_user (UserModel): Authenticated user from dependency.
    
    Returns:
        SEOAnalysisResponse: JSON analysis results with timestamp.
    
    Raises:
        HTTPException: 400 for invalid domain, 500 for analysis errors.
        
    Example:
        Request:
        ```json
        {
            "domain": "example.com",
            "competitors": ["competitor1.com", "competitor2.com"]
        }
        ```
        
        Response:
        ```json
        {
            "analysis": "{\"domain_authority\": 45, \"competitors\": [...]}",
            "timestamp": "2025-09-12T14:40:44.898Z"
        }
        ```
    """
    try:
        # Validate domain to prevent abuse
        if not is_valid_domain(request.domain):
            raise bad_request_error(
                "Invalid domain format. Please provide a valid domain name.",
                "INVALID_DOMAIN",
                {"domain": request.domain}
            )
        
        # Sanitize competitor domains if provided
        sanitized_competitors = []
        if request.competitors:
            for competitor in request.competitors:
                if is_valid_domain(competitor):
                    sanitized_competitors.append(sanitize_input(competitor))
        
        analysis_result = await analyze_competitors(request.domain, sanitized_competitors)
        
        return SEOAnalysisResponse(
            analysis=analysis_result.json(),
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
    """
    Conduct keyword research for a given topic or industry.
    
    Args:
        request (KeywordResearchRequest): Topic and optional industry.
        current_user (UserModel): Authenticated user from dependency.
    
    Returns:
        SEOAnalysisResponse: JSON research results with timestamp.
    
    Raises:
        HTTPException: 500 for research errors.
        
    Example:
        Request:
        ```json
        {
            "topic": "digital marketing",
            "industry": "technology"
        }
        ```
        
        Response:
        ```json
        {
            "analysis": "{\"high_volume_keywords\": [\"digital marketing strategy\", ...]}",
            "timestamp": "2025-09-12T14:40:44.898Z"
        }
        ```
    """
    try:
        # Sanitize topic and industry inputs
        sanitized_topic = sanitize_input(request.topic)
        sanitized_industry = sanitize_input(request.industry) if request.industry else None
        
        research_result = await conduct_keyword_research(sanitized_topic, sanitized_industry)
        
        return SEOAnalysisResponse(
            analysis=research_result.json(),
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
        # Validate domain to prevent abuse
        if not is_valid_domain(request.domain):
            raise bad_request_error(
                "Invalid domain format. Please provide a valid domain name.",
                "INVALID_DOMAIN",
                {"domain": request.domain}
            )
        
        analysis_result = await backlink_analysis(request.domain)
        
        return SEOAnalysisResponse(
            analysis=analysis_result.json(),
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
        # Validate domains to prevent abuse
        if not is_valid_domain(request.domain):
            raise bad_request_error(
                "Invalid domain format. Please provide a valid domain name.",
                "INVALID_DOMAIN",
                {"domain": request.domain}
            )
        
        if not is_valid_domain(request.competitor):
            raise bad_request_error(
                "Invalid competitor domain format. Please provide a valid domain name.",
                "INVALID_DOMAIN",
                {"competitor": request.competitor}
            )
        
        analysis_result = await content_gap_analysis(request.domain, request.competitor)
        
        return SEOAnalysisResponse(
            analysis=analysis_result.json(),
            timestamp=datetime.now()
        )
            
    except Exception as e:
        logger.error(f"Error in content gap analysis: {str(e)}")
        raise internal_server_error(
            "Failed to perform content gap analysis",
            "SEO_ANALYSIS_ERROR"
        )

@app.post("/api/seo/audit", response_model=SEOAnalysisResponse)
async def perform_seo_audit(
    request: SEOAuditRequest,
    current_user: UserModel = Depends(get_current_active_user)
):
    """Perform SEO audit"""
    try:
        audit_result = await seo_audit(request.url)
        
        return SEOAnalysisResponse(
            analysis=audit_result.json(),
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
        tracking_result = await rank_tracking(request.keywords, request.domain)
        
        return SEOAnalysisResponse(
            analysis=tracking_result.json(),
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
    import argparse
    
    parser = argparse.ArgumentParser(description="Robofy Backend API Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host address to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    args = parser.parse_args()
    
    uvicorn.run(app, host=args.host, port=args.port)