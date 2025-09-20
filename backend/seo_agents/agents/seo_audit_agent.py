import serpapi
import os
import json
from typing import Optional, Dict, Any

def get_serpapi_key():
    """Get SerpAPI key from environment variable with error handling"""
    SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
    if not SERPAPI_API_KEY:
        raise ValueError("SERPAPI_API_KEY environment variable is not set.")
    return SERPAPI_API_KEY

async def perform_seo_audit(
    url: str,
    generate_ai_text,  # AI service function passed as parameter
    location: Optional[str] = "us",
    language: Optional[str] = "en",
    start: Optional[int] = 0
) -> Dict[str, Any]:
    """
    Performs comprehensive SEO audit including technical SEO, on-page SEO, and backlink analysis.
    """
    try:
        # System prompt for the AI model
        system_prompt = """You are an expert SEO auditor. Your task is to analyze a given website URL based on technical SEO, on-page SEO, and backlink health. Use the SERP API to fetch domain information, top-ranking pages, and backlink data. Provide a detailed report of critical issues, including page speed problems, broken links, meta tag inconsistencies, and toxic backlinks. Rank the findings by severity and provide actionable recommendations for each issue. Structure your output in a clear, sectioned report format."""

        # Initialize the SerpApi client
        client = serpapi.Client(api_key=get_serpapi_key())

        # Get SERP results for the domain to analyze technical and on-page SEO
        domain = url.split('//')[-1].split('/')[0]  # Extract domain from URL
        serp_results = client.search(
            engine="google",
            q=f"site:{domain}",
            num=20,
            gl=location.lower(),
            hl=language.lower(),
            start=start
        )

        # For backlink analysis, use a more targeted approach since SERP API doesn't directly provide backlinks
        # Search for the domain to see how it's mentioned and potential backlink opportunities
        domain_mention_results = client.search(
            engine="google",
            q=f"\"{domain}\" -site:{domain}",
            num=10,
            gl=location.lower(),
            hl=language.lower(),
            start=start
        )

        # Extract relevant SERP data for technical and on-page analysis
        organic_results = serp_results.get("organic_results", [])
        search_information = serp_results.get("search_information", {})
        people_also_ask = serp_results.get("related_questions", [])
        
        # Extract domain mention data for backlink context
        domain_mentions = domain_mention_results.get("organic_results", [])

        # Compile data for the LLM prompt
        serp_data_str = "## Domain Analysis:\n"
        serp_data_str += f"Domain: {domain}\n"
        serp_data_str += f"Total Results: {search_information.get('total_results', 'N/A')}\n"
        serp_data_str += f"Search Time: {search_information.get('time_taken_displayed', 'N/A')}\n\n"
        
        serp_data_str += "## Top Pages:\n"
        for result in organic_results[:10]:
            serp_data_str += f"- {result.get('title', 'No title')} ({result.get('link', 'No link')})\n"
            serp_data_str += f"  Position: {result.get('position', 'N/A')}\n"
            serp_data_str += f"  Snippet: {result.get('snippet', 'No snippet')}\n"
        
        serp_data_str += "\n## People Also Ask:\n"
        for question in people_also_ask[:10]:
            serp_data_str += f"- {question.get('question', 'No question')}\n"
        
        serp_data_str += "\n## Domain Mentions (Potential Backlink Context):\n"
        for result in domain_mentions[:5]:
            serp_data_str += f"- {result.get('title', 'No title')} ({result.get('link', 'No link')})\n"
            serp_data_str += f"  Snippet: {result.get('snippet', 'No snippet')}\n"

        # Combine all data into a single input for the AI
        ai_input = f"{system_prompt}\n\nUser Input:\nURL: {url}\nLocation: {location}\nLanguage: {language}\nStart: {start}\n\nAnalysis Data:\n{serp_data_str}"

        # Use provided AI service function to process the SERP data
        ai_response = await generate_ai_text(ai_input)
        
        # Parse AI response as JSON
        import json
        try:
            audit_result = json.loads(ai_response)
        except json.JSONDecodeError:
            # If AI doesn't return valid JSON, create a structured response
            audit_result = {
                "technical_seo_issues": [],
                "on_page_seo_issues": [],
                "backlink_health": {
                    "toxic_backlinks": 0,
                    "quality_backlinks": 0,
                    "recommendation": "No backlink data available"
                },
                "overall_score": 0,
                "priority_recommendations": [],
                "ai_analysis": ai_response
            }

        return audit_result

    except Exception as e:
        raise Exception(f"SEO audit failed: {str(e)}")