import serpapi
import os
import json
from typing import Optional, List, Dict, Any

def get_serpapi_key():
    """Get SerpAPI key from environment variable with error handling"""
    SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
    if not SERPAPI_API_KEY:
        raise ValueError("SERPAPI_API_KEY environment variable is not set.")
    return SERPAPI_API_KEY

async def perform_keyword_research(
    seed_keyword: str,
    generate_ai_text,  # AI service function passed as parameter
    location: Optional[str] = "us",
    language: Optional[str] = "en",
    start: Optional[int] = 0
) -> List[Dict[str, Any]]:
    """
    Performs comprehensive keyword research based on a seed keyword, finding high-volume,
    low-competition keywords and related long-tail queries.
    """
    try:
        # System prompt for the AI model
        system_prompt = """You are a professional keyword research specialist. Given a seed keyword and a target location, use the SERP API to find high-volume, low-competition keywords, and related long-tail queries. Identify user search intent (informational, commercial, transactional, navigational) for each keyword. Output the results in a JSON format with keys for 'keyword', 'search_volume', 'competition_level', 'search_intent', and 'potential_content_ideas'."""

        # Initialize the SerpApi client
        client = serpapi.Client(api_key=get_serpapi_key())

        # Get SERP results for the seed keyword to find related keywords and search volume data
        serp_results = client.search(
            engine="google",
            q=seed_keyword,
            num=20,
            gl=location.lower(),
            hl=language.lower(),
            start=start
        )

        # Get related searches and autocomplete suggestions for long-tail keywords
        related_searches = serp_results.get("related_searches", [])
        autocomplete_suggestions = client.search(
            engine="google_autocomplete",
            q=seed_keyword,
            gl=location.lower(),
            hl=language.lower()
        )

        # Extract relevant SERP data for keyword analysis
        organic_results = serp_results.get("organic_results", [])
        search_information = serp_results.get("search_information", {})
        people_also_ask = serp_results.get("related_questions", [])
        
        # Compile data for the LLM prompt
        serp_data_str = "## Seed Keyword Analysis:\n"
        serp_data_str += f"Seed Keyword: {seed_keyword}\n"
        serp_data_str += f"Total Results: {search_information.get('total_results', 'N/A')}\n"
        serp_data_str += f"Search Time: {search_information.get('time_taken_displayed', 'N/A')}\n\n"
        
        serp_data_str += "## Top Organic Results:\n"
        for result in organic_results[:10]:
            serp_data_str += f"- {result.get('title', 'No title')} ({result.get('link', 'No link')})\n"
            serp_data_str += f"  Position: {result.get('position', 'N/A')}\n"
            serp_data_str += f"  Snippet: {result.get('snippet', 'No snippet')}\n"
        
        serp_data_str += "\n## Related Searches:\n"
        for search in related_searches[:10]:
            serp_data_str += f"- {search.get('query', 'No query')}\n"
        
        serp_data_str += "\n## People Also Ask:\n"
        for question in people_also_ask[:10]:
            serp_data_str += f"- {question.get('question', 'No question')}\n"
        
        serp_data_str += "\n## Autocomplete Suggestions:\n"
        if "suggestions" in autocomplete_suggestions:
            for suggestion in autocomplete_suggestions["suggestions"][:10]:
                serp_data_str += f"- {suggestion}\n"

        # Combine all data into a single input for the AI
        ai_input = f"{system_prompt}\n\nUser Input:\nSeed Keyword: {seed_keyword}\nLocation: {location}\nLanguage: {language}\nStart: {start}\n\nResearch Data:\n{serp_data_str}"

        # Use provided AI service function to process the SERP data
        ai_response = await generate_ai_text(ai_input)
        
        # Parse AI response as JSON
        import json
        try:
            keyword_data = json.loads(ai_response)
        except json.JSONDecodeError:
            # If AI doesn't return valid JSON, create a structured response based on the analysis
            keyword_data = [
                {
                    "keyword": seed_keyword,
                    "search_volume": "N/A",
                    "competition_level": "N/A",
                    "search_intent": "Informational",
                    "potential_content_ideas": ["General guide", "FAQ content", "Tutorial"]
                }
            ]

        return keyword_data

    except Exception as e:
        raise Exception(f"Keyword research failed: {str(e)}")