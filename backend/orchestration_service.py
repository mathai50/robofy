"""
Orchestration Service for synchronized agent execution.
Handles event-triggered analysis and consolidates results.
"""
import asyncio
import logging
import json
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import uuid
from pydantic import BaseModel, Field
import httpx

# Import FastMCP client for SEO analysis
from fastmcp.client import Client
import os

logger = logging.getLogger(__name__)

# Pydantic models for structured data
class AnalysisRequest(BaseModel):
    domain: str
    analysis_type: str = "comprehensive"
    competitors: Optional[List[str]] = None
    keywords: Optional[List[str]] = None
    user_id: Optional[str] = None

class AnalysisResult(BaseModel):
    analysis_id: str
    domain: str
    status: str
    results: Dict[str, Any]
    created_at: datetime
    completed_at: Optional[datetime] = None
    error: Optional[str] = None

class AgentTask(BaseModel):
    model_config = {"arbitrary_types_allowed": True}
    
    name: str
    function: callable
    args: List[Any]
    kwargs: Dict[str, Any]

class AnalysisOrchestrator:
    """Orchestrates multiple agents for comprehensive SEO analysis."""
    
    def __init__(self):
        self.active_analyses: Dict[str, AnalysisResult] = {}
        self.agent_timeout = 300  # 5 minutes per agent
        self.max_concurrent_analyses = 5
    
    async def execute_agent_task(self, task: AgentTask) -> Dict[str, Any]:
        """Execute a single agent task with timeout handling."""
        try:
            result = await asyncio.wait_for(
                task.function(*task.args, **task.kwargs),
                timeout=self.agent_timeout
            )
            return {"success": True, "data": result}
        except asyncio.TimeoutError:
            logger.error(f"Agent task {task.name} timed out after {self.agent_timeout}s")
            return {"success": False, "error": f"Task timed out after {self.agent_timeout}s"}
        except Exception as e:
            logger.error(f"Agent task {task.name} failed: {str(e)}")
            return {"success": False, "error": str(e)}
    
    async def execute_comprehensive_analysis(self, request: AnalysisRequest, analysis_id: Optional[str] = None) -> AnalysisResult:
        """Execute comprehensive SEO analysis using all available agents."""
        if not analysis_id:
            analysis_id = str(uuid.uuid4())
        logger.info(f"Starting comprehensive analysis {analysis_id} for {request.domain}")
        
        # Create analysis result
        analysis_result = AnalysisResult(
            analysis_id=analysis_id,
            domain=request.domain,
            status="processing",
            results={},
            created_at=datetime.now()
        )
        self.active_analyses[analysis_id] = analysis_result
        
        try:
            # Define agent tasks for comprehensive analysis
            agent_tasks = [
                AgentTask(
                    name="competitor_analysis",
                    function=analyze_competitors,
                    args=[request.domain],
                    kwargs={"competitors": request.competitors}
                ),
                AgentTask(
                    name="seo_audit",
                    function=seo_audit,
                    args=[f"https://{request.domain}"],
                    kwargs={}
                ),
                AgentTask(
                    name="keyword_research",
                    function=conduct_keyword_research,
                    args=[request.domain],
                    kwargs={}
                ),
                AgentTask(
                    name="content_gap_analysis",
                    function=comprehensive_content_gap_analysis,
                    args=[request.domain, request.competitors or []],
                    kwargs={}
                )
            ]
            
            # Execute all agent tasks concurrently
            tasks = [self.execute_agent_task(task) for task in agent_tasks]
            results = await asyncio.gather(*tasks)
            
            # Consolidate results
            consolidated_results = {}
            for i, result in enumerate(results):
                task_name = agent_tasks[i].name
                if result["success"]:
                    consolidated_results[task_name] = result["data"]
                else:
                    consolidated_results[task_name] = {"error": result["error"]}
            
            # Generate recommendations based on consolidated results
            recommendations = await generate_seo_recommendations(
                consolidated_results.get("keyword_research", {}),
                consolidated_results.get("competitor_analysis", {}),
                consolidated_results.get("content_gap_analysis", {})
            )
            
            consolidated_results["recommendations"] = recommendations
            
            # Update analysis result
            analysis_result.status = "completed"
            analysis_result.results = consolidated_results
            analysis_result.completed_at = datetime.now()
            
            logger.info(f"Analysis {analysis_id} completed successfully")
            
        except Exception as e:
            logger.error(f"Analysis {analysis_id} failed: {str(e)}")
            analysis_result.status = "failed"
            analysis_result.error = str(e)
            analysis_result.completed_at = datetime.now()
        
        return analysis_result
    
    async def execute_targeted_analysis(self, request: AnalysisRequest, analysis_id: Optional[str] = None) -> AnalysisResult:
        """Execute targeted analysis based on specific analysis type."""
        if not analysis_id:
            analysis_id = str(uuid.uuid4())
        logger.info(f"Starting targeted analysis {analysis_id} for {request.domain}, type: {request.analysis_type}")
        
        analysis_result = AnalysisResult(
            analysis_id=analysis_id,
            domain=request.domain,
            status="processing",
            results={},
            created_at=datetime.now()
        )
        self.active_analyses[analysis_id] = analysis_result
        
        try:
            # Execute based on analysis type
            if request.analysis_type == "competitor":
                result = await analyze_competitors(request.domain, request.competitors)
                analysis_result.results = {"competitor_analysis": result}
            elif request.analysis_type == "seo_audit":
                result = await seo_audit(f"https://{request.domain}")
                analysis_result.results = {"seo_audit": result}
            elif request.analysis_type == "keyword":
                result = await conduct_keyword_research(request.domain)
                analysis_result.results = {"keyword_research": result}
            elif request.analysis_type == "content_gap":
                result = await content_gap_analysis(request.domain, request.competitors[0] if request.competitors else "")
                analysis_result.results = {"content_gap_analysis": result}
            else:
                raise ValueError(f"Unknown analysis type: {request.analysis_type}")
            
            analysis_result.status = "completed"
            analysis_result.completed_at = datetime.now()
            
            logger.info(f"Targeted analysis {analysis_id} completed")
            
        except Exception as e:
            logger.error(f"Targeted analysis {analysis_id} failed: {str(e)}")
            analysis_result.status = "failed"
            analysis_result.error = str(e)
            analysis_result.completed_at = datetime.now()
        
        return analysis_result
    
    def get_analysis(self, analysis_id: str) -> Optional[AnalysisResult]:
        """Retrieve analysis result by ID."""
        return self.active_analyses.get(analysis_id)
    
    def cleanup_old_analyses(self, max_age_hours: int = 24):
        """Clean up analyses older than specified hours."""
        cutoff_time = datetime.now() - timedelta(hours=max_age_hours)
        analyses_to_remove = [
            aid for aid, analysis in self.active_analyses.items()
            if analysis.completed_at and analysis.completed_at < cutoff_time
        ]
        
        for analysis_id in analyses_to_remove:
            del self.active_analyses[analysis_id]
            logger.info(f"Removed old analysis: {analysis_id}")
        
        return len(analyses_to_remove)

# Global orchestrator instance
orchestrator = AnalysisOrchestrator()

# Background task for cleanup
async def cleanup_task():
    """Background task to clean up old analyses periodically."""
    while True:
        try:
            removed_count = orchestrator.cleanup_old_analyses()
            if removed_count > 0:
                logger.info(f"Cleaned up {removed_count} old analyses")
            await asyncio.sleep(3600)  # Run every hour
        except Exception as e:
            logger.error(f"Cleanup task failed: {str(e)}")
            await asyncio.sleep(300)  # Wait 5 minutes on error