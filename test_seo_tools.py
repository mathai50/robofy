#!/usr/bin/env python3
"""
Test script to verify SEO tools functionality with the updated backend.
This tests the API endpoints directly to ensure proper tool routing and URL handling.
"""

import asyncio
import aiohttp
import json
import sys
from typing import Dict, Any

async def test_seo_endpoint(session: aiohttp.ClientSession, endpoint: str, payload: Dict[str, Any]) -> None:
    """Test a specific SEO endpoint and print the results."""
    try:
        print(f"\n🔍 Testing endpoint: {endpoint}")
        print(f"📤 Payload: {json.dumps(payload, indent=2)}")
        
        async with session.post(
            f"http://localhost:8000{endpoint}",
            json=payload,
            headers={"Content-Type": "application/json"}
        ) as response:
            if response.status == 200:
                result = await response.json()
                print(f"✅ Success! Response:")
                print(json.dumps(result, indent=2))
            else:
                print(f"❌ Error: Status {response.status}")
                error_text = await response.text()
                print(f"Error details: {error_text}")
                
    except Exception as e:
        print(f"❌ Exception during test: {e}")

async def main():
    """Run all SEO tool tests."""
    async with aiohttp.ClientSession() as session:
        # Test 1: SEO Audit with full URL
        print("=" * 60)
        print("🧪 TEST 1: SEO AUDIT WITH FULL URL")
        print("=" * 60)
        await test_seo_endpoint(session, "/api/ai/message", {
            "message": "https://example.com",
            "tool": "seo-audit"
        })
        
        # Test 2: Competitor Analysis with domain
        print("\n" + "=" * 60)
        print("🧪 TEST 2: COMPETITOR ANALYSIS WITH DOMAIN")
        print("=" * 60)
        await test_seo_endpoint(session, "/api/ai/message", {
            "message": "https://cgi.com",
            "tool": "competitor-analysis"
        })
        
        # Test 3: Keyword Research with topic
        print("\n" + "=" * 60)
        print("🧪 TEST 3: KEYWORD RESEARCH WITH TOPIC")
        print("=" * 60)
        await test_seo_endpoint(session, "/api/ai/message", {
            "message": "digital marketing",
            "tool": "keyword-research"
        })
        
        # Test 4: Generic message without tool (should use AI service)
        print("\n" + "=" * 60)
        print("🧪 TEST 4: GENERIC MESSAGE (NO TOOL)")
        print("=" * 60)
        await test_seo_endpoint(session, "/api/ai/message", {
            "message": "Hello, how are you?",
            "tool": ""
        })
        
        # Test 5: Invalid URL format
        print("\n" + "=" * 60)
        print("🧪 TEST 5: INVALID URL FORMAT")
        print("=" * 60)
        await test_seo_endpoint(session, "/api/ai/message", {
            "message": "just a domain without protocol",
            "tool": "seo-audit"
        })

if __name__ == "__main__":
    print("🚀 Starting SEO Tools Functional Test")
    print("Note: Make sure the backend server is running on localhost:8000")
    print("=" * 60)
    
    # Run the tests
    asyncio.run(main())
    
    print("\n" + "=" * 60)
    print("🧪 All tests completed!")
    print("=" * 60)