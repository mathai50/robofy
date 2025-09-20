"""
High-performance FastMCP server for SEO analysis with process pooling and AI-powered agents.
Uses modular agents from the seo_agents package.
"""
from fastmcp import FastMCP
import asyncio
import logging
from typing import List, Optional
from datetime import datetime

# Import modular SEO agents
from seo_agents.agents.seo_audit_agent import perform_seo_audit
from seo_agents.agents.keyword_research_agent import perform_keyword_research
from seo_agents.agents.competition_analysis_agent import analyze_competition
from seo_agents.agents.content_gap_agent import identify_content_gaps
from seo_agents.agents.content_summarizer_agent import summarize_and_recommend
from seo_agents.agents.aio_monitoring_agent import perform_aio_audit
from seo_agents.agents.lead_prospecting_agent import prospect_for_leads

# Import AI service manager for multi-provider support
try:
    from ai_service import AIServiceManager
except ImportError:
    # Fallback for direct script execution
    from backend.ai_service import AIServiceManager

# Configure logging with more detailed format
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# Add file handler for persistent logs
log_file = "/tmp/fastmcp-seo-server-detailed.log"
file_handler = logging.FileHandler(log_file)
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.addHandler(file_handler)

# Import centralized agent prompts
from .agent_prompts import TOOL_CONTEXTS

# Initialize FastMCP server
mcp = FastMCP("seo-analysis")

# Initialize AI service manager for multi-provider support
ai_service_manager = AIServiceManager()
available_providers = ai_service_manager.get_available_providers()
logger.info(f"AI Service Manager initialized. Available providers: {available_providers}")

# Add context manager for timing and error handling
async def log_tool_execution(tool_name, **kwargs):
    """Log tool execution with timing and error handling"""
    start_time = datetime.now()
    logger.info(f"Starting {tool_name} with args: {kwargs}")
    
    try:
        result = await kwargs['func']()
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        logger.info(f"Completed {tool_name} in {duration:.2f}s")
        return result
    except Exception as e:
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        logger.error(f"Failed {tool_name} after {duration:.2f}s: {str(e)}", exc_info=True)
        raise

# Simple AI service function for FastMCP server context
async def generate_ai_text(prompt: str, context_name: str = "seo agent") -> str:
    """
    Simple AI text generation function for FastMCP server context.
    Uses the AIServiceManager to support multiple providers.
    Accepts a context_name to use a specific system prompt.
    """
    try:
        system_prompt = TOOL_CONTEXTS.get(context_name, TOOL_CONTEXTS["seo agent"])
        # Use the initialized AI service manager
        return await ai_service_manager.generate_text(prompt, system_prompt=system_prompt)
    except Exception as e:
        logger.error(f"AI text generation failed: {str(e)}")
        # Fallback to a simple response if AI fails
        return f"AI analysis unavailable. Error: {str(e)}. Please check your AI API key configuration."

# Health check endpoint for monitoring
@mcp.tool()
async def health_check():
    """Health check endpoint for server monitoring"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "server": "seo-analysis",
        "version": "1.0.0"
    }

# FastMCP Tools using modular agents with enhanced logging
@mcp.tool()
async def analyze_competitors_tool(domain: str, competitors: Optional[List[str]] = None):
    """Perform competitor SEO analysis"""
    ai_generator = lambda p: generate_ai_text(p, context_name="competitor analysis agent")
    return await log_tool_execution(
        "analyze_competitors_tool",
        func=lambda: analyze_competition(domain, competitors or [], ai_generator),
        domain=domain,
        competitors=competitors
    )

@mcp.tool()
async def conduct_keyword_research_tool(topic: str, industry: Optional[str] = None):
    """Execute keyword research"""
    ai_generator = lambda p: generate_ai_text(p, context_name="seo agent")
    return await log_tool_execution(
        "conduct_keyword_research_tool",
        func=lambda: perform_keyword_research(topic, ai_generator, location=industry or "us"),
        topic=topic,
        industry=industry
    )

@mcp.tool()
async def detailed_keyword_discovery_tool(seed_input: str):
    """Perform detailed keyword discovery"""
    ai_generator = lambda p: generate_ai_text(p, context_name="seo agent")
    return await log_tool_execution(
        "detailed_keyword_discovery_tool",
        func=lambda: perform_keyword_research(seed_input, ai_generator),
        seed_input=seed_input
    )

@mcp.tool()
async def seo_audit_tool(url: str):
    """Perform SEO audit"""
    ai_generator = lambda p: generate_ai_text(p, context_name="seo agent")
    return await log_tool_execution(
        "seo_audit_tool",
        func=lambda: perform_seo_audit(url, ai_generator),
        url=url
    )

@mcp.tool()
async def content_gap_analysis_tool(domain: str, competitor: str):
    """Identify content gaps by comparing a domain to top SERP results for a topic."""
    ai_generator = lambda p: generate_ai_text(p, context_name="seo agent")
    topic = domain
    provided_url = f"https://{domain}"
    return await log_tool_execution(
        "content_gap_analysis_tool",
        func=lambda: identify_content_gaps(topic, provided_url, ai_generator),
        domain=domain,
        competitor=competitor
    )

@mcp.tool()
async def competitor_content_analysis_tool(url: str):
    """Analyze competitor content"""
    ai_generator = lambda p: generate_ai_text(p, context_name="competitor analysis agent")
    domain = url.split('//')[-1].split('/')[0]
    return await log_tool_execution(
        "competitor_content_analysis_tool",
        func=lambda: analyze_competition(domain, [], ai_generator),
        url=url
    )

@mcp.tool()
async def comprehensive_content_gap_analysis_tool(target_domain: str, competitors: List[str]):
    """Perform comprehensive content gap analysis"""
    ai_generator = lambda p: generate_ai_text(p, context_name="seo agent")
    topic = target_domain
    provided_url = f"https://{target_domain}"
    return await log_tool_execution(
        "comprehensive_content_gap_analysis_tool",
        func=lambda: identify_content_gaps(topic, provided_url, ai_generator),
        target_domain=target_domain,
        competitors=competitors
    )

@mcp.tool()
async def generate_seo_recommendations_tool(keyword_data: dict, competitor_analysis: dict, content_gaps: dict):
    """Generate SEO recommendations"""
    ai_generator = lambda p: generate_ai_text(p, context_name="seo agent")
    compiled_data = {
        "keyword_research": keyword_data,
        "competitor_analysis": competitor_analysis,
        "content_gaps": content_gaps
    }
    return await log_tool_execution(
        "generate_seo_recommendations_tool",
        func=lambda: summarize_and_recommend(compiled_data, ai_generator),
        keyword_data_keys=list(keyword_data.keys()) if keyword_data else [],
        competitor_analysis_keys=list(competitor_analysis.keys()) if competitor_analysis else [],
        content_gaps_keys=list(content_gaps.keys()) if content_gaps else []
    )

@mcp.tool()
async def perform_comprehensive_seo_analysis_tool(url: str):
    """Perform comprehensive SEO analysis"""
    domain = url.split('//')[-1].split('/')[0]
    
    logger.info(f"Starting comprehensive SEO analysis for URL: {url}, domain: {domain}")
    
    # Run all analyses in parallel with timing
    start_time = datetime.now()
    
    try:
        # Create specialized AI text generators for each task
        seo_agent_generator = lambda p: generate_ai_text(p, context_name="seo agent")
        competitor_agent_generator = lambda p: generate_ai_text(p, context_name="competitor analysis agent")

        # Use asyncio.gather to run I/O-bound tasks concurrently
        audit_results, keyword_results, competition_results, content_gap_results = await asyncio.gather(
            perform_seo_audit(url, seo_agent_generator),
            perform_keyword_research(domain, seo_agent_generator),
            analyze_competition(domain, [], competitor_agent_generator),
            identify_content_gaps(domain, url, seo_agent_generator),
            return_exceptions=True  # Capture exceptions instead of failing immediately
        )
        
        # Check for exceptions in any of the tasks
        for i, result in enumerate([audit_results, keyword_results, competition_results, content_gap_results]):
            if isinstance(result, Exception):
                logger.error(f"Sub-task failed in comprehensive analysis: {str(result)}")
                # Re-raise the first exception found
                raise result
        
        # Compile results for summarization
        compiled_data = {
            "seo_audit": audit_results,
            "keyword_research": keyword_results,
            "competitor_analysis": competition_results,
            "content_gaps": content_gap_results
        }
        
        # The summarization is also an I/O-bound task (calling OpenAI)
        final_result = await summarize_and_recommend(compiled_data, seo_agent_generator)
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        logger.info(f"Completed comprehensive SEO analysis in {duration:.2f}s for URL: {url}")
        
        return final_result
        
    except Exception as e:
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        logger.error(f"Comprehensive SEO analysis failed after {duration:.2f}s: {str(e)}", exc_info=True)
        raise

# AI Optimization (AIO) Monitoring Tool
@mcp.tool()
async def monitor_ai_mentions_tool(brand_name: str, domain: str, topics: List[str]):
    """
    Performs an AI Optimization (AIO) audit by querying major LLMs
    to check for brand mentions, sentiment, and competitive landscape.
    """
    # Use the centralized AI text generation function for consistency
    ai_generator = lambda p: generate_ai_text(p, context_name="aio monitoring agent")
    
    return await log_tool_execution(
        "monitor_ai_mentions_tool",
        func=lambda: perform_aio_audit(brand_name, domain, topics, ai_generator),
        brand_name=brand_name,
        domain=domain,
        topics=topics
    )

# Lead Prospecting Tool
@mcp.tool()
async def prospect_for_leads_tool(topic: str, keywords: List[str]):
    """
    Uses a professional scraping service to find potential customer leads.
    """
    ai_generator = lambda p: generate_ai_text(p, context_name="lead prospecting agent")
    return await log_tool_execution(
        "prospect_for_leads_tool",
        func=lambda: prospect_for_leads(topic, keywords, ai_generator),
        topic=topic,
        keywords=keywords
    )

if __name__ == "__main__":
    # Run the FastMCP server with STDIO transport
    # This script is intended to be run via the `fastmcp run` command-line tool,
    # which allows specifying transport and port, e.g.:
    # fastmcp run seo_mcp_server_fastmcp.py --transport http --port 8001
    #
    # The `manage-fastmcp-server.sh` script handles this for you.
    # The following allows direct execution for debugging with HTTP transport.
    import argparse
    parser = argparse.ArgumentParser(description="FastMCP SEO Analysis Server")
    parser.add_argument("--transport", default="http", help="FastMCP transport protocol (e.g., http, stdio)")
    parser.add_argument("--port", type=int, default=8001, help="Port for HTTP transport")
    args = parser.parse_args()

    logger.info(f"Starting FastMCP server with {args.transport} transport...")
    mcp.run(transport=args.transport, port=args.port if args.transport == "http" else None)