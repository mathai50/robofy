"""
Test script for SEO analysis MCP server and backend integration.
This script tests the backend API endpoints and MCP server functionality.
"""
import asyncio
import httpx
import json
from typing import Dict, Any
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_backend_endpoints():
    """Test the backend SEO analysis endpoints"""
    print("\nTesting backend SEO endpoints...")
    
    base_url = "http://localhost:8000"
    test_data = {
        "competitor_analysis": {
            "url": f"{base_url}/api/seo/competitor-analysis",
            "data": {
                "domain": "example.com",
                "competitors": ["competitor1.com", "competitor2.com"]
            }
        },
        "keyword_research": {
            "url": f"{base_url}/api/seo/keyword-research",
            "data": {
                "topic": "digital marketing",
                "industry": "technology"
            }
        },
        "backlink_analysis": {
            "url": f"{base_url}/api/seo/backlink-analysis",
            "data": {
                "domain": "example.com"
            }
        },
        "content_gap_analysis": {
            "url": f"{base_url}/api/seo/content-gap-analysis",
            "data": {
                "domain": "example.com",
                "competitor": "competitor.com"
            }
        },
        "seo_audit": {
            "url": f"{base_url}/api/seo/audit",
            "data": {
                "url": "https://example.com"
            }
        },
        "rank_tracking": {
            "url": f"{base_url}/api/seo/rank-tracking",
            "data": {
                "keywords": ["digital marketing", "seo services"],
                "domain": "example.com"
            }
        }
    }
    
    async with httpx.AsyncClient() as client:
        for endpoint_name, endpoint_info in test_data.items():
            try:
                print(f"Testing {endpoint_name}...")
                response = await client.post(
                    endpoint_info["url"],
                    json=endpoint_info["data"],
                    timeout=30
                )
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"✓ {endpoint_name}: SUCCESS")
                    print(f"  Analysis: {result.get('analysis', 'No analysis field')[:100]}...")
                    print(f"  Timestamp: {result.get('timestamp', 'No timestamp')}")
                else:
                    print(f"✗ {endpoint_name}: FAILED (Status: {response.status_code})")
                    print(f"  Response: {response.text}")
                    
            except Exception as e:
                print(f"✗ {endpoint_name}: ERROR - {str(e)}")

async def test_fastmcp_tools_direct():
    """Test FastMCP tools directly by importing and calling them"""
    print("\nTesting FastMCP tools directly...")
    
    try:
        # Import the FastMCP instance and tools
        from seo_mcp_server import mcp, analyze_competitors, conduct_keyword_research, backlink_analysis
        
        # Test competitor analysis
        print("Testing competitor analysis...")
        result = await analyze_competitors("test.com", ["comp1.com", "comp2.com"])
        print(f"✓ Competitor analysis: {result.domain} analyzed with {len(result.competitors)} competitors")
        
        # Test keyword research
        print("Testing keyword research...")
        result = await conduct_keyword_research("digital marketing", "technology")
        print(f"✓ Keyword research: {len(result.high_volume_keywords)} high-volume keywords found")
        
        # Test backlink analysis
        print("Testing backlink analysis...")
        result = await backlink_analysis("test.com")
        print(f"✓ Backlink analysis: {result.total_backlinks} total backlinks found")
        
        print("All direct tool tests passed! ✓")
        
    except Exception as e:
        print(f"✗ Direct tool test failed: {e}")
        import traceback
        traceback.print_exc()

async def main():
    """Main test function"""
    print("SEO Analysis MCP Integration Test")
    print("=" * 40)
    
    # Test 1: Direct FastMCP tool testing
    await test_fastmcp_tools_direct()
    
    # Test 2: Backend endpoints test (requires backend running)
    print("\nNote: Backend endpoint tests require the FastAPI server to be running.")
    print("Start the server with: cd backend && source venv/bin/activate && python3 main.py")
    print("Then run this test again to test the endpoints.")
    
    # Uncomment the line below to test endpoints when server is running
    # await test_backend_endpoints()
    
    print("\nTest completed!")

if __name__ == "__main__":
    asyncio.run(main())