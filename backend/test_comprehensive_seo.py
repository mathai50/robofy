#!/usr/bin/env python3
"""
Test script for comprehensive SEO analysis of cgi.com using the FastMCP server.
This script uses the comprehensive analysis tool that runs all SEO agents together.
"""
import asyncio
import os
import sys

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mcp_client import SEOAnalysisClient

async def test_comprehensive_seo_analysis():
    """Test comprehensive SEO analysis for cgi.com"""
    try:
        # Create SEO client with HTTP connection
        client = SEOAnalysisClient(base_url="http://localhost:8001")
        print("✅ Using HTTP connection to SEO analysis MCP server")
        
        # Perform comprehensive SEO analysis for cgi.com
        print("🚀 Starting comprehensive SEO analysis for cgi.com...")
        result = await client.comprehensive_seo_analysis("https://cgi.com")
        
        print("✅ Comprehensive SEO Analysis Result:")
        print("=" * 60)
        print(result)
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error during comprehensive SEO analysis: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # No cleanup needed for HTTP client
        pass

if __name__ == "__main__":
    # Run the test
    asyncio.run(test_comprehensive_seo_analysis())