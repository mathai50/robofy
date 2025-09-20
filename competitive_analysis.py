#!/usr/bin/env python3
"""
Simple script to perform competitive analysis for CGI using SerpAPI directly.
This will help compare raw SerpAPI results with the current system's output.
"""
import os
import json
import serpapi
from dotenv import load_dotenv
from urllib.parse import urlparse

# Load environment variables from .env file
load_dotenv()

def extract_domain_from_url(url):
    """Extract domain from URL"""
    try:
        parsed = urlparse(url)
        return parsed.netloc
    except:
        return url

def competitive_analysis(domain):
    """Perform competitive analysis using SerpAPI"""
    api_key = os.getenv('SERPAPI_API_KEY')
    
    if not api_key:
        print("❌ SERPAPI_API_KEY not found in environment variables.")
        return None
    
    print(f"🔑 Using SerpAPI key: {api_key[:8]}...{api_key[-8:]}")
    print(f"🎯 Analyzing competitors for: {domain}")
    
    try:
        # Initialize SerpAPI client
        client = serpapi.Client(api_key=api_key)
        
        # Search for competitors directly
        print("🔍 Searching for competitors...")
        results = client.search(
            engine="google",
            q=f"competitors of {domain}",
            num=10
        )
        
        if "error" in results:
            print(f"❌ SerpAPI Error: {results['error']}")
            return None
        
        competitors = set()
        
        # Extract from organic results
        if "organic_results" in results:
            for result in results["organic_results"]:
                if "link" in result:
                    competitor_domain = extract_domain_from_url(result["link"])
                    competitors.add(competitor_domain)
        
        # Extract from related searches
        if "related_searches" in results:
            for related in results["related_searches"]:
                if "query" in related:
                    # Sometimes related searches contain competitor names
                    competitors.add(related["query"])
        
        # Also search for the company itself to see related results
        print("🔍 Searching for company to find related competitors...")
        company_results = client.search(
            engine="google",
            q=domain,
            num=10
        )
        
        if "organic_results" in company_results:
            for result in company_results["organic_results"]:
                if "link" in result:
                    competitor_domain = extract_domain_from_url(result["link"])
                    # Only add if it's not the same domain
                    if domain not in competitor_domain:
                        competitors.add(competitor_domain)
        
        # Filter out non-competitor domains and the target domain itself
        filtered_competitors = [
            comp for comp in competitors
            if comp and domain not in comp and len(comp) > 5
        ]
        
        print(f"✅ Found {len(filtered_competitors)} potential competitors:")
        for i, competitor in enumerate(filtered_competitors, 1):
            print(f"   {i}. {competitor}")
        
        # Get additional data for analysis
        analysis_data = {
            "target_domain": domain,
            "competitors": list(filtered_competitors),
            "total_organic_results": len(results.get("organic_results", [])),
            "serp_features": list(results.keys()),
            "raw_results_sample": results.get("organic_results", [])[:2] if results.get("organic_results") else []
        }
        
        return analysis_data
        
    except Exception as e:
        print(f"❌ Exception during competitive analysis: {str(e)}")
        return None

if __name__ == "__main__":
    target_domain = "cgi.com"  # Focus on the main domain
    analysis = competitive_analysis(target_domain)
    
    if analysis:
        print("\n📊 Analysis Summary:")
        print(f"Target Domain: {analysis['target_domain']}")
        print(f"Competitors Found: {len(analysis['competitors'])}")
        print(f"Total Organic Results: {analysis['total_organic_results']}")
        print(f"SERP Features: {analysis['serp_features']}")
        
        # Save detailed results to file for comparison
        with open(f"competitive_analysis_{target_domain}.json", "w") as f:
            json.dump(analysis, f, indent=2)
        print(f"💾 Detailed results saved to competitive_analysis_{target_domain}.json")
    else:
        print("❌ Competitive analysis failed.")