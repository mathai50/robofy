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

async def identify_content_gaps(
    topic: str,
    provided_url: str,
    generate_ai_text,  # AI service function passed as parameter
    location: str = "us",
    language: str = "en",
    start: int = 0
) -> Dict[str, Any]:
    """
    Identifies content gaps by comparing a URL to the top SERP results for a topic.
    Uses gl parameter for geographic location and hl for language.
    """
    try:
        # System prompt for the AI model
        system_prompt = """You are a content strategist specializing in gap analysis. Your task is to compare the top-ranking content for a specific topic against a provided URL. Use the SERP API to fetch the top SERP results. Analyze the subtopics, questions, and entities covered by the ranking pages that the provided URL is missing. Focus on the 'People Also Ask' and 'Related Searches' sections from the SERP results. Identify key content gaps that can be filled to improve the provided URL's ranking. Output a list of recommended subtopics and questions in JSON format."""

        # Initialize the SerpApi client
        client = serpapi.Client(api_key=get_serpapi_key())

        # Get SERP results for the topic with enhanced parameters
        serp_results = client.search(
            engine="google",
            q=topic,
            num=20,
            gl=location.lower(),
            hl=language.lower(),
            start=start
        )

        # Extract relevant SERP data
        organic_results = serp_results.get("organic_results", [])
        people_also_ask = serp_results.get("related_questions", [])
        related_searches = serp_results.get("related_searches", [])
        search_information = serp_results.get("search_information", {})

        # Compile data for the LLM prompt
        serp_data_str = "## Search Metrics:\n"
        serp_data_str += f"Total Results: {search_information.get('total_results', 'N/A')}\n"
        serp_data_str += f"Search Time: {search_information.get('time_taken_displayed', 'N/A')}\n\n"
        
        serp_data_str += "## Top Ranking URLs:\n"
        for result in organic_results[:15]:
            serp_data_str += f"- {result.get('title', 'No title')} ({result.get('link', 'No link')})\n"
            serp_data_str += f"  Position: {result.get('position', 'N/A')}\n"
            serp_data_str += f"  Snippet: {result.get('snippet', 'No snippet')}\n"
        
        serp_data_str += "\n## People Also Ask:\n"
        for question in people_also_ask[:15]:
            serp_data_str += f"- {question.get('question', 'No question')}\n"
            if 'snippet' in question:
                serp_data_str += f"  Answer: {question.get('snippet', 'No answer')}\n"
        
        serp_data_str += "\n## Related Searches:\n"
        for search in related_searches[:15]:
            serp_data_str += f"- {search.get('query', 'No query')}\n"

        # Combine all data into a single input for the AI
        ai_input = f"{system_prompt}\n\nUser Input:\nTopic: {topic}\nProvided URL: {provided_url}\nLocation: {location}\nLanguage: {language}\nStart: {start}\n\nSERP Data:\n{serp_data_str}"

        # Use provided AI service function to process the SERP data
        ai_response = await generate_ai_text(ai_input)
        
        # Parse AI response as JSON
        import json
        try:
            gap_analysis = json.loads(ai_response)
        except json.JSONDecodeError:
            # If AI doesn't return valid JSON, create a structured response
            gap_analysis = {
                "gaps_identified": [],
                "recommended_questions": [],
                "recommended_subtopics": [],
                "ai_analysis": ai_response
            }

        return gap_analysis

    except Exception as e:
        raise Exception(f"Content gap analysis failed: {str(e)}")