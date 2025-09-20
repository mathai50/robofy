import serpapi
import os
import json
from typing import List, Optional, Dict, Any

def get_serpapi_key():
    """Get SerpAPI key from environment variable with error handling"""
    SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
    if not SERPAPI_API_KEY:
        raise ValueError("SERPAPI_API_KEY environment variable is not set.")
    return SERPAPI_API_KEY

async def analyze_competition(
    target_domain: str,
    competitors: List[str],
    generate_ai_text,  # AI service function passed as parameter
    location: Optional[str] = "us",
    language: Optional[str] = "en",
    start: Optional[int] = 0
) -> Dict[str, Any]:
    """
    Performs comprehensive competition analysis by comparing the target domain against competitors.
    Identifies top-ranking keywords, content strategies, and backlink profiles.
    """
    try:
        # System prompt for the AI model
        system_prompt = """You are a competitive intelligence analyst. For a given list of competitor domains, use the SERP API to identify their top-ranking keywords, content strategies, and backlink profiles. Find opportunities where competitors are ranking for keywords that the client's site is not. Compare their content's comprehensiveness and suggest areas where the client can create a more authoritative piece. The final output must be a comparative table of strengths and weaknesses, a list of 'unexploited' keywords, and an overview of their content topics."""

        # Initialize the SerpApi client
        client = serpapi.Client(api_key=get_serpapi_key())

        # If no competitors provided, discover them using SERP API
        if not competitors:
            # Search for competitors using multiple query strategies
            competitor_queries = [
                f"competitors of {target_domain}",
                f"best {target_domain} alternatives",
                f"{target_domain} vs competitors"
            ]
            
            discovered_competitors = set()
            for query in competitor_queries:
                try:
                    search_results = client.search(
                        engine="google",
                        q=query,
                        num=10,
                        gl=location.lower(),
                        hl=language.lower(),
                        start=start
                    )
                    
                    # Extract competitor domains from organic results
                    if "organic_results" in search_results:
                        for result in search_results["organic_results"]:
                            if "link" in result:
                                url = result["link"]
                                domain = url.split('//')[-1].split('/')[0]
                                if domain != target_domain and '.' in domain:
                                    discovered_competitors.add(domain)
                    
                    # Also check related searches for competitor names
                    if "related_searches" in search_results:
                        for related in search_results["related_searches"]:
                            if "query" in related:
                                query_text = related["query"].lower()
                                if target_domain not in query_text and 'competitor' in query_text:
                                    discovered_competitors.update(extract_domains_from_text(query_text))
                
                except Exception as e:
                    logger.warning(f"Competitor discovery query failed for '{query}': {str(e)}")
                    continue
            
            competitors = list(discovered_competitors)[:5]  # Limit to top 5 competitors

        # Analyze each competitor and the target domain
        all_domains = [target_domain] + competitors
        domain_data = {}

        for domain in all_domains:
            # Get SERP results for the domain to understand their top content
            serp_results = client.search(
                engine="google",
                q=f"site:{domain}",
                num=20,
                gl=location.lower(),
                hl=language.lower(),
                start=start
            )

            # Get related searches to understand their keyword strategy
            related_searches = client.search(
                engine="google",
                q=domain,
                num=10,
                gl=location.lower(),
                hl=language.lower(),
                start=start
            )

            # Extract relevant data
            organic_results = serp_results.get("organic_results", [])
            related_queries = related_searches.get("related_searches", [])
            
            # Compile domain data
            domain_data[domain] = {
                "top_pages": [
                    {
                        "title": result.get("title", ""),
                        "url": result.get("link", ""),
                        "snippet": result.get("snippet", ""),
                        "position": result.get("position", 0)
                    } for result in organic_results[:10]  # Top 10 pages
                ],
                "related_keywords": [
                    search.get("query", "") for search in related_queries[:10]
                ],
                "total_results": serp_results.get("search_information", {}).get("total_results", 0),
                "search_metrics": serp_results.get("search_information", {})
            }

        # Compile data for the LLM prompt
        analysis_data_str = "## Target Domain Analysis:\n"
        analysis_data_str += f"Target Domain: {target_domain}\n"
        analysis_data_str += f"Total Indexed Pages: {domain_data[target_domain].get('total_results', 'N/A')}\n\n"
        
        analysis_data_str += "## Competitor Analysis:\n"
        for competitor in competitors:
            analysis_data_str += f"### {competitor}:\n"
            analysis_data_str += f"Total Indexed Pages: {domain_data[competitor].get('total_results', 'N/A')}\n"
            analysis_data_str += "Top Pages:\n"
            for page in domain_data[competitor].get("top_pages", []):
                analysis_data_str += f"- {page['title']} ({page['url']}) - Position: {page.get('position', 'N/A')}\n"
            analysis_data_str += "Related Keywords:\n"
            for keyword in domain_data[competitor].get("related_keywords", []):
                analysis_data_str += f"- {keyword}\n"
            analysis_data_str += "\n"

        # Combine all data into a single input for the AI
        ai_input = f"{system_prompt}\n\nUser Input:\nTarget Domain: {target_domain}\nCompetitors: {', '.join(competitors)}\nLocation: {location}\nLanguage: {language}\nStart: {start}\n\nAnalysis Data:\n{analysis_data_str}"

        # Use provided AI service function to process the SERP data
        ai_response = await generate_ai_text(ai_input)
        
        # Parse AI response as JSON
        import json
        try:
            analysis_result = json.loads(ai_response)
        except json.JSONDecodeError:
            # If AI doesn't return valid JSON, create a structured response
            analysis_result = {
                "comparative_analysis": {
                    "strengths": {},
                    "weaknesses": {}
                },
                "unexploited_keywords": [],
                "content_topics_overview": {},
                "actionable_recommendations": [],
                "ai_analysis": ai_response
            }

        return analysis_result

    except Exception as e:
        raise Exception(f"Competition analysis failed: {str(e)}")

def extract_domains_from_text(text: str) -> List[str]:
    """Extract potential domain names from text"""
    import re
    # Simple regex to find domain-like patterns
    domains = re.findall(r'[a-zA-Z0-9-]+\.[a-zA-Z]{2,}', text)
    return domains