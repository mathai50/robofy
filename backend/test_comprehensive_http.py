#!/usr/bin/env python3
"""
Test script for comprehensive SEO analysis of cgi.com using HTTP transport.
This script directly tests the FastMCP server running on http://127.0.0.1:8000
"""
import httpx
import asyncio
import json

async def test_comprehensive_seo_analysis():
    """Test comprehensive SEO analysis for cgi.com via HTTP"""
    try:
        # FastMCP server endpoint
        url = "http://127.0.0.1:8000/mcp/tools/perform_comprehensive_seo_analysis_tool"
        
        # Payload for cgi.com analysis
        payload = {
            "url": "https://cgi.com"
        }
        
        print("🚀 Testing comprehensive SEO analysis for cgi.com...")
        print(f"📡 Server: {url}")
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            # Call the comprehensive analysis tool
            response = await client.post(url, json=payload)
            response.raise_for_status()
            
            result = response.json()
            
            print("✅ Comprehensive SEO Analysis Result:")
            print("=" * 60)
            print(json.dumps(result, indent=2))
            print("=" * 60)
            
            # Check if we got real data or mock data
            if "seo_audit" in result and "technical_seo_issues" in result["seo_audit"]:
                print("🎉 SUCCESS: Real SEO data received from SerpAPI!")
                print(f"📊 Technical SEO issues found: {len(result['seo_audit']['technical_seo_issues'])}")
            else:
                print("⚠️  Mock data received - check SerpAPI key configuration")
                
    except httpx.HTTPStatusError as e:
        print(f"❌ HTTP error: {e}")
        print(f"Response: {e.response.text}")
    except Exception as e:
        print(f"❌ Error during comprehensive SEO analysis: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Run the test
    asyncio.run(test_comprehensive_seo_analysis())