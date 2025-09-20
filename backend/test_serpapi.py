#!/usr/bin/env python3
"""
Quick test script to verify SerpAPI connectivity and configuration.
"""
import os
import sys
from serpapi import GoogleSearch
from config import settings

def test_serpapi_connectivity():
    """Test connectivity to SerpAPI with a simple search."""
    print("Testing SerpAPI connectivity...")
    print(f"SERPAPI_API_KEY: {settings.SERPAPI_API_KEY}")
    
    if not settings.SERPAPI_API_KEY or settings.SERPAPI_API_KEY == "your_serpapi_api_key_here":
        print("ERROR: SERPAPI_API_KEY is not properly configured.")
        return False
    
    # Simple test search to verify API key works
    search_params = {
        "engine": "google",
        "q": "test",
        "api_key": settings.SERPAPI_API_KEY,
        "num": 1
    }
    
    try:
        search = GoogleSearch(search_params)
        results = search.get_dict()
        print("SUCCESS: SerpAPI connectivity test passed!")
        print(f"Results keys: {list(results.keys())}")
        if "search_information" in results:
            print(f"Total results: {results['search_information'].get('total_results', 'N/A')}")
        return True
    except Exception as e:
        print(f"ERROR: SerpAPI connectivity test failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_serpapi_connectivity()
    sys.exit(0 if success else 1)