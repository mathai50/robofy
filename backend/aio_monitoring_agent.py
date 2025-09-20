"""
AIO Monitoring Agent - Simplified version for AI Optimization audits
Performs brand monitoring by querying LLMs for mentions, sentiment, and accuracy.
"""
import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Callable, Awaitable

# Setup logging
logger = logging.getLogger(__name__)

def generate_analytical_prompts(brand_name: str, domain: str, topics: List[str]) -> List[str]:
    """Generate simple analytical prompts for each topic."""
    prompts = []
    for topic in topics:
        prompt = f"Analyze {brand_name} ({domain}) in relation to {topic}. " \
                 f"Check for brand mentions, sentiment, and competitive landscape."
        prompts.append(prompt)
    return prompts

async def query_ai_provider(provider_name: str, ai_generator: Callable[[str], Awaitable[str]], 
                           prompts: List[str], brand_name: str) -> Dict[str, Any]:
    """Query AI provider with simplified error handling."""
    try:
        responses = []
        for prompt in prompts:
            response = await ai_generator(prompt)
            responses.append(response)
        
        # Simple analysis - check if brand is mentioned and basic sentiment
        combined_response = " ".join(responses).lower()
        mentioned = brand_name.lower() in combined_response
        sentiment = "positive" if "excellent" in combined_response or "great" in combined_response else "neutral"
        
        return {
            "mentioned": mentioned,
            "sentiment": sentiment,
            "summary": f"Brand mentioned: {mentioned}, Sentiment: {sentiment}",
            "responses": responses
        }
    except Exception as e:
        logger.warning(f"AI provider {provider_name} failed: {str(e)}")
        return {
            "error": str(e),
            "mentioned": False,
            "sentiment": "unknown",
            "summary": f"Provider error: {str(e)}"
        }

def compile_audit_report(brand_name: str, domain: str, provider_results: Dict[str, Any], 
                        topics: List[str]) -> Dict[str, Any]:
    """Compile simple audit report from provider results."""
    total_mentions = sum(1 for result in provider_results.values() if result.get("mentioned", False))
    sentiments = [result.get("sentiment", "unknown") for result in provider_results.values()]
    
    # Simple sentiment aggregation
    positive_count = sentiments.count("positive")
    sentiment_score = "positive" if positive_count > 0 else "neutral"
    
    return {
        "brand": brand_name,
        "domain": domain,
        "timestamp": datetime.now().isoformat(),
        "topics_analyzed": topics,
        "total_mentions": total_mentions,
        "overall_sentiment": sentiment_score,
        "provider_results": provider_results,
        "recommendations": [
            "Continue monitoring brand mentions across AI platforms",
            "Focus on positive sentiment reinforcement" if sentiment_score == "positive" else "Improve brand sentiment"
        ]
    }

async def perform_aio_audit(
    brand_name: str,
    domain: str,
    topics: List[str],
    ai_generator: Callable[[str], Awaitable[str]]
) -> Dict[str, Any]:
    """
    Simplified AIO audit - queries LLMs for brand mentions and sentiment.
    
    Args:
        brand_name: Brand to monitor
        domain: Brand domain
        topics: Core topics related to brand
        ai_generator: Async AI function to generate responses
        
    Returns:
        Audit results with mentions, sentiment, and recommendations
    """
    logger.info(f"Starting AIO audit for {brand_name} ({domain})")
    
    # Generate prompts and query AI
    prompts = generate_analytical_prompts(brand_name, domain, topics)
    provider_result = await query_ai_provider("default", ai_generator, prompts, brand_name)
    
    # Compile final report
    report = compile_audit_report(brand_name, domain, {"default": provider_result}, topics)
    
    logger.info(f"Completed AIO audit for {brand_name}")
    return report