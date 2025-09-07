"""
MCP Client Service for communicating with MCP servers.
Handles connections to various MCP services including SEO analysis.
"""
import logging
from typing import Dict, Any, Optional
import httpx
from mcp import ClientSession
from mcp.client.stdio import stdio_client
import asyncio
from contextlib import asynccontextmanager

logger = logging.getLogger(__name__)

class MCPClient:
    """MCP Client for communicating with MCP servers"""
    
    def __init__(self):
        self.sessions: Dict[str, ClientSession] = {}
    
    async def connect_to_server(self, server_name: str, server_url: str = None):
        """Connect to an MCP server"""
        try:
            if server_url and server_url.startswith('http'):
                # HTTP-based MCP server
                # For now, we'll handle HTTP servers differently
                logger.info(f"HTTP MCP server detected for {server_name}")
                return
            else:
                # Stdio-based MCP server
                session = ClientSession()
                transport = await stdio_client(server_url)
                await session.initialize(transport)
                self.sessions[server_name] = session
                logger.info(f"Connected to MCP server: {server_name}")
                
        except Exception as e:
            logger.error(f"Failed to connect to MCP server {server_name}: {e}")
            raise
    
    async def call_tool(self, server_name: str, tool_name: str, arguments: Dict[str, Any]) -> str:
        """Call a tool on the specified MCP server"""
        try:
            if server_name not in self.sessions:
                raise ValueError(f"No connection to MCP server: {server_name}")
            
            session = self.sessions[server_name]
            result = await session.call_tool(tool_name, arguments)
            
            if result.content and len(result.content) > 0:
                return result.content[0].text
            else:
                return "No response content received"
                
        except Exception as e:
            logger.error(f"Error calling tool {tool_name} on {server_name}: {e}")
            raise
    
    async def close_all(self):
        """Close all MCP server connections"""
        for server_name, session in self.sessions.items():
            try:
                await session.close()
                logger.info(f"Closed connection to MCP server: {server_name}")
            except Exception as e:
                logger.error(f"Error closing connection to {server_name}: {e}")
        
        self.sessions.clear()

# Global MCP client instance
mcp_client = MCPClient()

class SEOAnalysisClient:
    """Specialized client for SEO analysis MCP operations"""
    
    def __init__(self, base_url: str = None):
        self.base_url = base_url
        self.timeout = 30
    
    async def analyze_competitors(self, domain: str, competitors: list = None) -> str:
        """Perform competitor SEO analysis"""
        if self.base_url and self.base_url.startswith('http'):
            # HTTP-based MCP server
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "domain": domain,
                    "competitors": competitors or []
                }
                response = await client.post(
                    f"{self.base_url}/tools/analyze_competitors",
                    json=payload
                )
                response.raise_for_status()
                return response.text
        else:
            # Stdio-based MCP server
            return await mcp_client.call_tool(
                "seo_analysis",
                "analyze_competitors",
                {"domain": domain, "competitors": competitors or []}
            )
    
    async def conduct_keyword_research(self, topic: str, industry: str = None) -> str:
        """Perform keyword research"""
        if self.base_url and self.base_url.startswith('http'):
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "topic": topic,
                    "industry": industry
                }
                response = await client.post(
                    f"{self.base_url}/tools/conduct_keyword_research",
                    json=payload
                )
                response.raise_for_status()
                return response.text
        else:
            return await mcp_client.call_tool(
                "seo_analysis",
                "conduct_keyword_research",
                {"topic": topic, "industry": industry}
            )
    
    async def backlink_analysis(self, domain: str) -> str:
        """Analyze backlink profile"""
        if self.base_url and self.base_url.startswith('http'):
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {"domain": domain}
                response = await client.post(
                    f"{self.base_url}/tools/backlink_analysis",
                    json=payload
                )
                response.raise_for_status()
                return response.text
        else:
            return await mcp_client.call_tool(
                "seo_analysis",
                "backlink_analysis",
                {"domain": domain}
            )
    
    async def content_gap_analysis(self, domain: str, competitor: str) -> str:
        """Identify content gaps"""
        if self.base_url and self.base_url.startswith('http'):
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "domain": domain,
                    "competitor": competitor
                }
                response = await client.post(
                    f"{self.base_url}/tools/content_gap_analysis",
                    json=payload
                )
                response.raise_for_status()
                return response.text
        else:
            return await mcp_client.call_tool(
                "seo_analysis",
                "content_gap_analysis",
                {"domain": domain, "competitor": competitor}
            )
    
    async def seo_audit(self, url: str) -> str:
        """Perform SEO audit"""
        if self.base_url and self.base_url.startswith('http'):
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {"url": url}
                response = await client.post(
                    f"{self.base_url}/tools/seo_audit",
                    json=payload
                )
                response.raise_for_status()
                return response.text
        else:
            return await mcp_client.call_tool(
                "seo_analysis",
                "seo_audit",
                {"url": url}
            )
    
    async def rank_tracking(self, keywords: list, domain: str) -> str:
        """Track keyword rankings"""
        if self.base_url and self.base_url.startswith('http'):
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "keywords": keywords,
                    "domain": domain
                }
                response = await client.post(
                    f"{self.base_url}/tools/rank_tracking",
                    json=payload
                )
                response.raise_for_status()
                return response.text
        else:
            return await mcp_client.call_tool(
                "seo_analysis",
                "rank_tracking",
                {"keywords": keywords, "domain": domain}
            )

@asynccontextmanager
async def get_seo_client(seo_server_url: str = None):
    """Context manager for SEO analysis client"""
    client = SEOAnalysisClient(seo_server_url)
    try:
        yield client
    finally:
        pass  # No cleanup needed for HTTP client