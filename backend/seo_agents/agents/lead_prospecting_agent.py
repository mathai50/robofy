"""
Lead Prospecting Agent

This agent uses Apify's professional web scraping services to find potential customer
leads by searching forums, social media, and Q&A sites for buying signals.
"""
import asyncio
from typing import Dict, List, Any, Callable, Awaitable
import logging
import os
import httpx

logger = logging.getLogger(__name__)

async def prospect_for_leads(
    topic: str,
    keywords: List[str],
    ai_generator: Callable[[str], Awaitable[str]]
) -> Dict[str, Any]:
    """
    Uses Apify's scraping API to find and qualify customer leads.

    Args:
        topic: The general topic or industry to search within.
        keywords: Specific keywords indicating buying intent (e.g., "best tool for", "how to solve").
        ai_generator: The AI function to summarize and qualify the findings.

    Returns:
        A dictionary containing a list of qualified leads.
    """
    logger.info(f"Starting lead prospecting for topic: {topic}")

    # --- Integration with Apify Professional Scraping API ---
    apify_api_token = os.getenv("APIFY_API_TOKEN")
    # You need to specify which Apify Actor you want to run.
    # For example, you could use an actor for scraping Reddit, Twitter, etc.
    # Replace 'YOUR_ACTOR_ID' with the actual Actor ID from the Apify platform.
    actor_id = "YOUR_ACTOR_ID"

    if not apify_api_token or actor_id == "YOUR_ACTOR_ID":
        logger.warning("APIFY_API_TOKEN is not set or ACTOR_ID is not configured. Returning mock data for lead prospecting.")
        return {
            "topic": topic,
            "leads_found": [
                {"source": "reddit.com/r/mock", "contact": "User 'dev_dave'", "summary": "Asked for recommendations on the best SEO analysis tools.", "qualification": "High-intent lead."},
                {"source": "twitter.com", "contact": "Handle '@marketing_meg'", "summary": "Complained about their current analytics platform being too slow.", "qualification": "Medium-intent lead, potential pain point."}
            ],
            "message": "This is mock data. Please configure your APIFY_API_TOKEN and Actor ID in the agent."
        }

    # This endpoint runs an Apify Actor and waits for it to finish, then returns the dataset items.
    apify_run_url = f"https://api.apify.com/v2/acts/{actor_id}/run-sync-get-dataset-items"

    # The input for the actor will depend on the specific actor you choose.
    # This is a generic example for a web search actor.
    actor_input = {
        "queries": [f"{topic} {keyword}" for keyword in keywords],
        "maxPagesPerQuery": 1,
        "resultsPerPage": 10,
    }

    scraped_data = []
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                apify_run_url,
                params={"token": apify_api_token},
                json=actor_input
            )
            response.raise_for_status()
            scraped_data = response.json()
    except httpx.HTTPStatusError as e:
        logger.error(f"Apify request failed: {e.response.status_code} - {e.response.text}")
        raise Exception("Failed to fetch data from Apify.")

    if not scraped_data:
        return {"topic": topic, "leads_found": [], "message": "No results returned from Apify."}

    # Use the AI to qualify the scraped leads
    qualification_prompt = f"""Here is a list of scraped items from the web about '{topic}'. Please analyze each item and qualify it as a potential customer lead. Identify buying signals, pain points, or explicit requests for recommendations.

Scraped Data:
{str(scraped_data[:10])}

Based on this data, provide a JSON list of qualified leads. Each lead should have 'source', 'contact', 'summary', and 'qualification' keys."""

    qualified_leads_str = await ai_generator(qualification_prompt)

    return {"topic": topic, "leads_found": qualified_leads_str}