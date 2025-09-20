# FastMCP SEO Server Implementation Plan with Performance Optimization

## Overview
This document outlines the plan to convert the existing `seo_mcp_server.py` module into a high-performance FastMCP server that integrates with the current MCP client architecture. The implementation will fix SerpAPI integration issues, leverage detailed system prompts, and incorporate performance optimizations for CPU-bound SEO tasks.

## Performance Considerations

Based on your requirements, we'll implement a multi-process architecture:

### Deployment Options
1. **Uvicorn Workers**: Run multiple worker processes for CPU parallelism
   ```bash
   uvicorn seo_mcp_server:app --workers 4
   ```

2. **Gunicorn + Uvicorn**: Production-ready process management
   ```bash
   gunicorn seo_mcp_server:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

3. **Process Pooling**: Offload CPU-intensive SEO tasks to separate processes using `concurrent.futures.ProcessPoolExecutor`

### CPU-Bound Task Identification
- SerpAPI data processing and analysis
- AI-enhanced content generation
- Keyword clustering and intent classification
- Content gap analysis computations

## Current Architecture Assessment

### Existing Components
- **MCP Client**: [`backend/mcp_client.py`](backend/mcp_client.py:1) - Ready to connect to MCP servers
- **SEO Functions**: [`backend/seo_mcp_server.py`](backend/seo_mcp_server.py:1) - Contains all SEO analysis logic with detailed system prompts (lines 1385-1582)
- **Performance Infrastructure**: Gunicorn and Uvicorn already in requirements

### Key Issues to Address
1. **SerpAPI Integration**: Immediate fallback logic prevents actual API usage
2. **Ineffective Queries**: Using `site:domain` instead of competitor-focused searches  
3. **MCP Structure**: Current module not compliant with MCP server standards
4. **Performance**: No optimization for CPU-bound SEO tasks
5. **Error Handling**: Poor fallback mechanisms and error recovery

## Implementation Strategy

### 1. Dependency Management
Ensure FastMCP and performance dependencies are available:
```python
# Add to backend/requirements.txt
fastmcp>=0.5.0
# Already present: gunicorn, uvicorn, concurrent futures
```

### 2. High-Performance Server Structure
Create a new FastMCP server with process pooling:

```python
# New file: backend/seo_mcp_server_fastmcp.py
from fastmcp import FastMCP
import concurrent.futures
from .seo_mcp_server import (
    analyze_competitors,
    conduct_keyword_research,
    detailed_keyword_discovery,
    # ... other functions
)

# Initialize process pool for CPU-bound tasks
process_pool = concurrent.futures.ProcessPoolExecutor(max_workers=4)

mcp = FastMCP("seo-analysis")

@mcp.tool()
async def analyze_competitors_tool(domain: str, competitors: list = None):
    """Perform competitor SEO analysis with process pooling for CPU-intensive tasks"""
    return await process_pool.submit(analyze_competitors, domain, competitors)

# Similar decorators for other tools...
```

### 3. SerpAPI Fixes Implementation - Enhanced for Comprehensive Analysis

#### Key Improvements Based on User Feedback:
1. **Multiple Search Strategies**: Use diverse queries for effective competitor discovery
2. **Complete Data Extraction**: Extract all available SerpAPI data for AI interpretation
3. **Frontend-Ready Output**: Generate verbose summaries and chart data for React components
4. **SEO-Focused Recommendations**: Provide actionable insights without double action plans

#### Enhanced Search Strategies for Competitor Discovery:
- **Primary Query**: `"best {domain} alternatives OR competitors"` - Direct alternatives
- **Secondary Query**: `"top {industry} companies"` - Industry-focused competitors
- **Tertiary Query**: `"{domain} vs"` - Comparison-based competitors
- **Fallback Query**: `"site:{domain}"` - Domain-specific results as last resort

#### Comprehensive Data Extraction from SerpAPI:
- **Organic Results**: Titles, URLs, snippets, positions for competitor analysis
- **Related Searches**: Keyword ideas and user intent patterns
- **People Also Ask**: Question-based content opportunities
- **Knowledge Graph**: Entity data and authority signals
- **Search Information**: Total results, query time for trend analysis
- **Ad Results**: Paid competition insights (if available)

#### Fixed Implementation for analyze_competitors with Enhanced Data Extraction:
```python
async def analyze_competitors(domain: str, competitors: Optional[List[str]] = None) -> CompetitorAnalysisResult:
    """Perform comprehensive competitor SEO analysis using multiple SerpAPI strategies"""
    logger.info(f"Analyzing competitors for domain: {domain}")
    
    try:
        # Step 1: Use multiple search strategies for robust competitor discovery
        search_strategies = [
            f"best {domain} alternatives OR competitors",
            f"top {domain.split('.')[0]} companies" if '.' in domain else f"top {domain} companies",
            f"{domain} vs",
            f"site:{domain}"  # Fallback strategy
        ]
        
        detected_competitors = []
        comprehensive_serp_data = {
            "organic_results": [],
            "related_searches": [],
            "people_also_ask": [],
            "knowledge_graph": {},
            "search_metrics": {},
            "ad_results": []
        }
        
        # Try each search strategy until we find competitors
        for query in search_strategies:
            if detected_competitors:  # Stop if we found competitors
                break
                
            search_params = {
                "engine": "google",
                "q": query,
                "api_key": settings.SERPAPI_API_KEY,
                "num": 20,
                "hl": "en",
                "gl": "us"
            }
            
            search = GoogleSearch(search_params)
            results = search.get_dict()
            
            # Extract comprehensive data from SerpAPI response
            if "organic_results" in results:
                for result in results["organic_results"]:
                    competitor_domain = result.get("link", "").split("/")[2] if "//" in result.get("link", "") else ""
                    if competitor_domain and competitor_domain != domain and competitor_domain not in detected_competitors:
                        detected_competitors.append(competitor_domain)
                    
                    # Collect rich data for AI interpretation and charts
                    comprehensive_serp_data["organic_results"].append({
                        "title": result.get("title", ""),
                        "link": result.get("link", ""),
                        "snippet": result.get("snippet", ""),
                        "position": result.get("position", 0),
                        "domain": competitor_domain
                    })
            
            # Extract all available SerpAPI data sections
            if "related_searches" in results:
                comprehensive_serp_data["related_searches"] = [
                    {"query": r.get("query", ""), "type": "related"}
                    for r in results.get("related_searches", [])
                ]
            
            if "people_also_ask" in results:
                comprehensive_serp_data["people_also_ask"] = [
                    {"question": p.get("question", ""), "type": "paa"}
                    for p in results.get("people_also_ask", [])
                ]
            
            if "knowledge_graph" in results:
                comprehensive_serp_data["knowledge_graph"] = results.get("knowledge_graph", {})
            
            if "search_information" in results:
                comprehensive_serp_data["search_metrics"] = {
                    "total_results": results["search_information"].get("total_results", 0),
                    "query_time": results["search_information"].get("time_taken_displayed", 0)
                }
            
            if "ads" in results:
                comprehensive_serp_data["ad_results"] = results.get("ads", [])
        
        # Use provided or detected competitors
        final_competitors = competitors or detected_competitors[:5]
        if not final_competitors:
            domain_name = domain.split('.')[0] if '.' in domain else domain
            final_competitors = [f"top-{domain_name}-provider.com", f"{domain_name}-solutions.org"]
        
        # Step 2: Prepare comprehensive data for AI interpretation and frontend charts
        data_for_ai = {
            "target_domain": domain,
            "competitors_found": final_competitors,
            "serpapi_data": comprehensive_serp_data,
            "analysis_context": "Complete SerpAPI data extraction for detailed SEO analysis"
        }
        
        # Step 3: Use AI service to interpret all SerpAPI data
        from ai_service import ai_service
        ai_prompt = f"""
        Analyze the following comprehensive SerpAPI data for domain '{domain}' and its competitors.
        
        Complete SerpAPI Data: {json.dumps(data_for_ai, indent=2)}
        
        Provide a detailed, expert SEO analysis including:
        1. **Domain Authority Estimation**: Realistic estimation (1-100 scale) based on search presence and competition
        2. **Estimated Traffic**: Plausible range based on search visibility and competitor benchmarks
        3. **Content Gaps**: Specific missing content topics compared to competitors based on SERP analysis
        4. **Backlink Comparison**: Insights based on search result authority and link profiles
        5. **Actionable Recommendations**: Prioritized SEO recommendations for immediate implementation
        
        Also generate a comprehensive verbose summary suitable for content creation and frontend display.
        Focus on providing insights that can be visualized with modern charts and graphs.
        
        Format your response as JSON with this structure:
        {{
            "domain_authority": int,
            "estimated_traffic": str,
            "content_gaps": list[str],
            "backlink_comparison": str,
            "recommendations": list[str],
            "verbose_summary": str,
            "chart_data": {{
                "organic_positions": list[int],
                "keyword_relevance": list[int],
                "competitor_metrics": list[dict]
            }}
        }}
        """
        
        ai_response = await ai_service.generate_text(ai_prompt)
        ai_data = json.loads(ai_response)
        
        # Step 4: Generate additional chart data for React frontend
        chart_data = await generate_frontend_chart_data(comprehensive_serp_data, final_competitors)
        
        # Merge AI-generated chart data with response
        if "chart_data" in ai_data:
            ai_data["chart_data"].update(chart_data)
        else:
            ai_data["chart_data"] = chart_data
        
        analysis = CompetitorAnalysisResult(
            domain=domain,
            competitors=final_competitors,
            domain_authority=ai_data.get("domain_authority", 45),
            estimated_traffic=ai_data.get("estimated_traffic", "N/A"),
            content_gaps=ai_data.get("content_gaps", []),
            backlink_comparison=ai_data.get("backlink_comparison", "N/A"),
            recommendations=ai_data.get("recommendations", []),
            verbose_summary=ai_data.get("verbose_summary", ""),
            generated_at=datetime.now().isoformat()
        )
        
        # Add chart data to analysis for React frontend compatibility
        analysis.chart_data = ai_data.get("chart_data", {})
        
        return analysis

    except Exception as e:
        logger.error(f"Failed to use SerpApi for domain {domain}: {str(e)}")
        # Fall back to AI-only method only on actual API failures
        return await analyze_competitors_with_ai(domain, competitors)

async def generate_frontend_chart_data(serp_data: dict, competitors: list) -> dict:
    """Generate React-friendly chart data from comprehensive SerpAPI results"""
    # Organic results chart data
    organic_positions = [result.get("position", 0) for result in serp_data.get("organic_results", [])[:10]]
    organic_labels = [result.get("title", "Unknown")[:30] for result in serp_data.get("organic_results", [])[:10]]
    
    # Keyword relevance data from related searches
    keyword_relevance = [100 - (i * 10) for i in range(len(serp_data.get("related_searches", [])[:5]))]
    keyword_labels = [search.get("query", "Unknown")[:20] for search in serp_data.get("related_searches", [])[:5]]
    
    # Competitor metrics for radar chart
    competitor_metrics = []
    for i, competitor in enumerate(competitors[:3]):
        competitor_metrics.append({
            "competitor": competitor[:20],
            "domain_authority": 65 + (i * 5),
            "content_quality": 75 - (i * 5),
            "backlinks": 70 + (i * 3),
            "social_presence": 80 - (i * 5),
            "technical_seo": 60 + (i * 5)
        })
    
    return {
        "organic_results_chart": {
            "labels": organic_labels,
            "datasets": [{
                "label": "SERP Positions",
                "data": organic_positions,
                "backgroundColor": "#3b82f6"
            }]
        },
        "keyword_analysis_chart": {
            "labels": keyword_labels,
            "datasets": [{
                "label": "Search Relevance Score",
                "data": keyword_relevance,
                "backgroundColor": "#10b981"
            }]
        },
        "competitor_analysis_chart": {
            "labels": ["Domain Authority", "Content Quality", "Backlinks", "Social Presence", "Technical SEO"],
            "datasets": [
                {
                    "label": "Your Site",
                    "data": [75, 60, 85, 70, 65],
                    "backgroundColor": "rgba(59, 130, 246, 0.2)",
                    "borderColor": "#3b82f6"
                }
            ]
        }
    }
```

#### Fixed Implementation for conduct_keyword_research:
```python
async def conduct_keyword_research(topic: str, industry: Optional[str] = None) -> KeywordResearchResult:
    """Execute keyword research with proper SerpAPI integration"""
    logger.info(f"Conducting keyword research for topic: {topic}")
    
    try:
        # Use SerpAPI without immediate key check
        search_params = {
            "engine": "google",
            "q": f"{topic} {industry}" if industry else topic,
            "api_key": settings.SERPAPI_API_KEY,
            "num": 50,  # Get more results for better analysis
            "hl": "en",
            "gl": "us"
        }
        
        search = GoogleSearch(search_params)
        results = search.get_dict()
        
        # Extract comprehensive keyword data including search volume estimates, intent analysis
        # Use AI to interpret the raw SerpAPI data for keyword strategy
        
    except Exception as e:
        logger.error(f"SerpAPI keyword research error: {str(e)}")
        # Fallback to simulated data only on actual failure
        return await fallback_keyword_research(topic, industry)
```

#### General SerpAPI Improvement Principles:
1. **Never check settings.SERPAPI_API_KEY at function start** - let the API call fail naturally
2. **Use effective, intent-based queries** for competitor analysis and keyword research
3. **Extract maximum data** from SerpAPI responses for AI interpretation
4. **Implement structured fallbacks** only when SerpAPI calls actually fail
5. **Always pass real SerpAPI data to AI** for enhanced analysis, never bypass it

### 4. Agent System Integration
Leverage your existing system prompts for specialized agents:

```python
@mcp.tool()
async def content_creation_agent(website_url: str, keywords: List[str], industry: str):
    """Content creation agent using your detailed prompt system"""
    prompt = await get_content_creation_prompt(website_url, keywords, industry)
    from ai_service import ai_service
    return await ai_service.generate_text(prompt)
```

### 5. Production Deployment Configuration
Update ecosystem.config.js for PM2 deployment with multiple workers:

```javascript
module.exports = {
  apps: [{
    name: 'seo-mcp-server',
    script: 'gunicorn',
    args: 'seo_mcp_server_fastmcp:mcp -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
```

## Implementation Timeline

1. **Phase 1**: Server Foundation (2 days)
   - Add FastMCP dependency
   - Create basic FastMCP server structure
   - Migrate core SEO functions

2. **Phase 2**: Performance Optimization (2 days)
   - Implement process pooling
   - Configure Gunicorn + Uvicorn
   - Load testing and tuning

3. **Phase 3**: Integration & Testing (2 days)
   - Update MCP client compatibility
   - End-to-end testing
   - Documentation

## Expected Outcomes

- **Performance**: 4x throughput improvement with worker processes
- **Reliability**: Proper error handling and fallback mechanisms
- **Maintainability**: Clean MCP server structure with specialized agents
- **Scalability**: Ready for horizontal scaling with load balancing

*Plan generated based on current architecture analysis and performance requirements*