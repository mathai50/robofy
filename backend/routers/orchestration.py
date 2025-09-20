"""
Orchestration Router for event-triggered analysis endpoints.
Provides API endpoints to trigger comprehensive SEO analysis and retrieve results.
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging
from datetime import datetime

# Import orchestration service
from orchestration_service import AnalysisRequest, orchestrator, cleanup_task
from database import get_db
from sqlalchemy.orm import Session
from auth import get_current_active_user
from schemas import UserInDB

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/orchestrate", tags=["orchestration"])

# Pydantic models for API requests/responses
class OrchestrationRequest(BaseModel):
    domain: str
    analysis_type: str = "comprehensive"
    competitors: Optional[List[str]] = None
    keywords: Optional[List[str]] = None

class OrchestrationResponse(BaseModel):
    analysis_id: str
    status: str
    message: str
    estimated_completion_time: Optional[int] = None
    created_at: datetime

class AnalysisStatusResponse(BaseModel):
    analysis_id: str
    status: str
    progress: Optional[Dict[str, Any]] = None
    results: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

@router.post("/analysis", response_model=OrchestrationResponse)
async def trigger_analysis(
    request: OrchestrationRequest,
    background_tasks: BackgroundTasks,
    current_user: UserInDB = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Trigger a comprehensive SEO analysis for a domain.
    
    This endpoint initiates an event-triggered analysis that synchronizes multiple
    agents (competitor analysis, SEO audit, keyword research, content gap analysis)
    and returns a analysis ID for tracking progress.
    
    Args:
        request: Analysis request containing domain and optional parameters
        background_tasks: FastAPI background tasks for async processing
        current_user: Authenticated user from JWT token
        db: Database session
    
    Returns:
        OrchestrationResponse: Analysis ID and initial status
    
    Raises:
        HTTPException: 400 for invalid requests, 429 for too many concurrent analyses
    """
    try:
        # Check if domain is provided
        if not request.domain:
            raise HTTPException(status_code=400, detail="Domain is required")
        
        # Check concurrent analysis limit
        active_count = sum(1 for analysis in orchestrator.active_analyses.values() 
                          if analysis.status == "processing")
        if active_count >= orchestrator.max_concurrent_analyses:
            raise HTTPException(
                status_code=429,
                detail=f"Too many concurrent analyses. Maximum allowed: {orchestrator.max_concurrent_analyses}"
            )
        
        # Create analysis request with user context
        analysis_request = AnalysisRequest(
            domain=request.domain,
            analysis_type=request.analysis_type,
            competitors=request.competitors,
            keywords=request.keywords,
            user_id=str(current_user.id) if current_user else None
        )
        
        # Generate analysis ID first to ensure consistency
        import uuid
        analysis_id = str(uuid.uuid4())
        
        # Execute analysis in background with the generated analysis ID
        if request.analysis_type == "comprehensive":
            background_tasks.add_task(
                orchestrator.execute_comprehensive_analysis,
                analysis_request,
                analysis_id
            )
        else:
            background_tasks.add_task(
                orchestrator.execute_targeted_analysis,
                analysis_request,
                analysis_id
            )
        
        # Create response with the generated analysis ID
        response = OrchestrationResponse(
            analysis_id=analysis_id,
            status="queued",
            message="Analysis has been queued for processing",
            estimated_completion_time=300,  # 5 minutes estimate
            created_at=datetime.now()
        )
        
        logger.info(f"Analysis triggered for {request.domain} by user {current_user.username if current_user else 'anonymous'}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error triggering analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to trigger analysis")

@router.get("/analysis/{analysis_id}", response_model=AnalysisStatusResponse)
async def get_analysis_status(
    analysis_id: str,
    current_user: UserInDB = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get the status and results of a specific analysis.
    
    Args:
        analysis_id: The ID of the analysis to check
        current_user: Authenticated user from JWT token
        db: Database session
    
    Returns:
        AnalysisStatusResponse: Current status and results if available
    
    Raises:
        HTTPException: 404 if analysis not found
    """
    try:
        analysis = orchestrator.get_analysis(analysis_id)
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        # Prepare progress information
        progress = {}
        if analysis.status == "processing":
            progress = {
                "agents_completed": len([k for k, v in analysis.results.items() if "error" not in v]),
                "total_agents": 4,  # competitor, audit, keyword, content gap
                "estimated_remaining": 120  # 2 minutes estimate
            }
        
        response = AnalysisStatusResponse(
            analysis_id=analysis.analysis_id,
            status=analysis.status,
            progress=progress if analysis.status == "processing" else None,
            results=analysis.results if analysis.status == "completed" else None,
            error=analysis.error,
            created_at=analysis.created_at,
            completed_at=analysis.completed_at
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving analysis status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve analysis status")

@router.get("/analysis/public/{analysis_id}", response_model=AnalysisStatusResponse)
async def get_analysis_public(
    analysis_id: str,
    db: Session = Depends(get_db)
):
    """
    Get the status and results of a specific analysis (public access for dashboards).
    
    Args:
        analysis_id: The ID of the analysis to check
        db: Database session
    
    Returns:
        AnalysisStatusResponse: Current status and results if available
    
    Raises:
        HTTPException: 404 if analysis not found
    """
    try:
        logger.info(f"Public endpoint called with analysis_id: {analysis_id}")
        logger.info(f"Active analyses keys: {list(orchestrator.active_analyses.keys())}")
        
        analysis = orchestrator.get_analysis(analysis_id)
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        # Prepare progress information
        progress = {}
        if analysis.status == "processing":
            progress = {
                "agents_completed": len([k for k, v in analysis.results.items() if "error" not in v]),
                "total_agents": 4,  # competitor, audit, keyword, content gap
                "estimated_remaining": 120  # 2 minutes estimate
            }
        
        response = AnalysisStatusResponse(
            analysis_id=analysis.analysis_id,
            status=analysis.status,
            progress=progress if analysis.status == "processing" else None,
            results=analysis.results if analysis.status == "completed" else None,
            error=analysis.error,
            created_at=analysis.created_at,
            completed_at=analysis.completed_at
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving analysis status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve analysis status")

@router.get("/analyses")
async def list_analyses(
    current_user: UserInDB = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    List all analyses for the current user.
    
    Args:
        current_user: Authenticated user from JWT token
        db: Database session
    
    Returns:
        List of analysis summaries
    """
    try:
        user_analyses = [
            {
                "analysis_id": analysis.analysis_id,
                "domain": analysis.domain,
                "status": analysis.status,
                "created_at": analysis.created_at,
                "completed_at": analysis.completed_at
            }
            for analysis in orchestrator.active_analyses.values()
            if analysis.user_id == str(current_user.id)
        ]
        
        return {"analyses": user_analyses}
        
    except Exception as e:
        logger.error(f"Error listing analyses: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list analyses")

@router.delete("/analysis/{analysis_id}")
async def cancel_analysis(
    analysis_id: str,
    current_user: UserInDB = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Cancel a running analysis.
    
    Args:
        analysis_id: The ID of the analysis to cancel
        current_user: Authenticated user from JWT token
        db: Database session
    
    Returns:
        Success message
    
    Raises:
        HTTPException: 404 if analysis not found, 400 if not cancellable
    """
    try:
        analysis = orchestrator.get_analysis(analysis_id)
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        if analysis.status != "processing":
            raise HTTPException(status_code=400, detail="Only processing analyses can be cancelled")
        
        # In a real implementation, we would have proper cancellation mechanism
        # For now, we'll just mark it as cancelled
        analysis.status = "cancelled"
        analysis.completed_at = datetime.now()
        
        return {"message": "Analysis cancelled successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to cancel analysis")

# Start background cleanup task when the router is initialized
@router.on_event("startup")
async def startup_event():
    import asyncio
    loop = asyncio.get_event_loop()
    loop.create_task(cleanup_task())
    logger.info("Orchestration router initialized with background cleanup task")

@router.get("/analysis/{analysis_id}/transformed")
async def get_transformed_analysis(
    analysis_id: str,
    db: Session = Depends(get_db)
):
    """
    Get transformed analysis data formatted for frontend consumption.
    
    This endpoint returns analysis results processed through data transformers
    to ensure compatibility with frontend charting libraries.
    
    Args:
        analysis_id: The ID of the analysis to transform
        db: Database session
    
    Returns:
        Transformed analysis data ready for frontend visualization
    
    Raises:
        HTTPException: 404 if analysis not found
    """
    try:
        analysis = orchestrator.get_analysis(analysis_id)
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        if analysis.status != "completed":
            raise HTTPException(
                status_code=400,
                detail="Analysis not completed yet. Current status: " + analysis.status
            )
        
        # Import data transformers
        from data_transformers import transform_analysis_for_frontend
        
        # Transform the analysis results for frontend consumption
        transformed_data = transform_analysis_for_frontend(
            analysis.results,
            domain=analysis.domain,
            timestamp=analysis.created_at.isoformat() if analysis.created_at else ""
        )
        
        return transformed_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error transforming analysis data: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to transform analysis data")