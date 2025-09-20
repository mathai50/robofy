#!/usr/bin/env python3
"""
Test script to verify SerpAPI key validity and functionality.
"""
import os
import sys
from serpapi import GoogleSearch
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_serpapi_key():
    """Test SerpAPI key by performing a simple search."""
    api_key = os.getenv('SERPAPI_API_KEY')
    
    if not api_key:
        print("❌ SERPAPI_API_KEY not found in environment variables.")
        return False
    
    print(f"🔑 Using SerpAPI key: {api_key[:8]}...{api_key[-8:]}")
    
    try:
        # Perform a simple search to test the key
        search_params = {
            "engine": "google",
            "q": "test search",
            "api_key": api_key,
            "num": 1
        }
        
        print("🔍 Performing test search with SerpAPI...")
        search = GoogleSearch(search_params)
        results = search.get_dict()
        
        if "error" in results:
            print(f"❌ SerpAPI Error: {results['error']}")
            return False
        else:
            print("✅ SerpAPI key is valid and working!")
            if "organic_results" in results:
                print(f"📊 Found {len(results.get('organic_results', []))} organic results")
            return True
            
    except Exception as e:
        print(f"❌ Exception during SerpAPI test: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_serpapi_key()
    sys.exit(0 if success else 1)