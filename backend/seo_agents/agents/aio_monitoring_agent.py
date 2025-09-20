"""
AIO Monitoring Agent - Performs AI Optimization audits by querying LLMs
to check for brand mentions, sentiment, and accuracy across AI models.
"""
from typing import Dict, List, Any, Callable, Awaitable
import json
from datetime import datetime
import logging
import re

logger = logging.getLogger(__name__)

async def perform_aio_audit(
    brand_name: str,
    domain: str,
    topics: List[str],
    ai_generator: Callable[[str], Awaitable[str]]
) -> Dict[str, Any]:
    """
    Performs an AI Optimization (AIO) audit by querying LLMs
    to check for brand mentions, sentiment, and competitive landscape.
    
    Args:
        brand_name: The name of the brand to monitor
        domain: The domain of the brand
        topics: List of core topics related to the brand
        ai_generator: The AI generator function to use for the audit.
        
    Returns:
        Dictionary with audit results including mentions, sentiment, and recommendations
    """
    try:
        logger.info(f"Starting AIO audit for brand: {brand_name}, domain: {domain}")

        # Generate analytical prompts for each topic
        prompts = generate_analytical_prompts(brand_name, domain, topics)
        
        # Query the AI provider with the prompts
        try:
            provider_result = await query_ai_provider(ai_generator, prompts, brand_name)
        except Exception as e:
            logger.error(f"Error querying AI provider: {str(e)}")
            provider_result = {
                "error": str(e),
                "mentioned": False,
                "sentiment": "unknown",
                "summary": f"Failed to query AI provider: {str(e)}"
            }
        
        # Compile final report
        report = compile_audit_report(brand_name, domain, provider_result, topics)
        
        logger.info(f"Completed AIO audit for brand: {brand_name}")
        return report
        
    except Exception as e:
        logger.error(f"AIO audit failed: {str(e)}", exc_info=True)
        raise Exception(f"AIO audit failed: {str(e)}")

def generate_analytical_prompts(brand_name: str, domain: str, topics: List[str]) -> List[str]:
    """
    Generate analytical prompts for querying AI models about the brand.
    
    Args:
        brand_name: The brand name
        domain: The brand domain
        topics: List of core topics
        
    Returns:
        List of analytical prompts
    """
    prompts = []
    
    # Prompt 1: General brand awareness
    prompts.append(
        f"What do you know about {brand_name} ({domain})? "
        f"Please provide a brief overview of what this company does and its reputation."
    )
    
    # Prompt 2: Industry positioning
    prompts.append(
        f"Where does {brand_name} rank among competitors in the {topics[0] if topics else 'industry'} space? "
        f"Who are their main competitors and how do they compare?"
    )
    
    # Prompt 3: Specific topic expertise
    for topic in topics[:3]:  # Limit to top 3 topics
        prompts.append(
            f"Is {brand_name} considered an expert or leader in {topic}? "
            f"What specific products, services, or content do they offer related to {topic}?"
        )
    
    # Prompt 4: Sentiment and perception
    prompts.append(
        f"What is the general sentiment and perception of {brand_name} in the market? "
        f"Are they viewed positively, negatively, or neutrally by customers and industry experts?"
    )
    
    # Prompt 5: Accuracy check
    prompts.append(
        f"Please verify the accuracy of information about {brand_name}. "
        f"What are some common misconceptions or inaccurate facts about this company?"
    )
    
    return prompts

async def query_ai_provider(
    generator: Any,
    prompts: List[str],
    brand_name: str
) -> Dict[str, Any]:
    """
    Query the AI provider with all analytical prompts.
    
    Args:
        generator: AI text generation function
        prompts: List of analytical prompts
        brand_name: The brand name being queried
        
    Returns:
        Dictionary with parsed results from the provider
    """
    try:
        logger.info(f"Querying AI provider for brand: {brand_name}")
        
        # Combine prompts into a single query for efficiency
        combined_prompt = "\n\n".join([
            f"Question {i+1}: {prompt}" for i, prompt in enumerate(prompts)
        ])
        
        # Add instruction for structured response
        structured_prompt = f"""Please answer the following questions about {brand_name}.
Provide your responses in a structured JSON format with the following keys for each question:
- mentioned: boolean indicating if the brand was mentioned
- sentiment: string (positive, negative, neutral, or unknown)
- accuracy: string (accurate, inaccurate, or unknown)
- summary: brief summary of the response
- competitors_mentioned: list of competitor names if any

Questions:
{combined_prompt}

Please respond with valid JSON only."""

        # Generate response from AI provider
        response = await generator(structured_prompt)
        
        # Parse the JSON response
        try:
            parsed_response = json.loads(response)
            return parse_ai_response(parsed_response, brand_name)
        except json.JSONDecodeError:
            # Fallback parsing if JSON is invalid
            return parse_unstructured_response(response, brand_name)
            
    except Exception as e:
        logger.error(f"Error querying AI provider: {str(e)}")
        raise

def parse_ai_response(response: Any, brand_name: str) -> Dict[str, Any]:
    """
    Parse structured JSON response from AI provider.
    
    Args:
        response: Parsed JSON response
        brand_name: The brand name
        
    Returns:
        Parsed results dictionary
    """
    # Default result structure
    result = {
        "mentioned": False,
        "sentiment": "unknown",
        "accuracy": "unknown",
        "summary": f"No clear mention of {brand_name} in AI response",
        "competitors_mentioned": [],
        "action_items": []
    }
    
    if isinstance(response, dict):
        # Handle single response object
        if "mentioned" in response:
            result["mentioned"] = bool(response.get("mentioned", False))
        if "sentiment" in response:
            result["sentiment"] = str(response.get("sentiment", "unknown")).lower()
        if "accuracy" in response:
            result["accuracy"] = str(response.get("accuracy", "unknown")).lower()
        if "summary" in response:
            result["summary"] = str(response.get("summary", ""))
        if "competitors_mentioned" in response:
            competitors = response.get("competitors_mentioned", [])
            if isinstance(competitors, list):
                result["competitors_mentioned"] = [str(c) for c in competitors]
    
    elif isinstance(response, list):
        # Handle multiple responses (one per question)
        mentions = []
        sentiments = []
        accuracies = []
        competitors = set()
        
        for item in response:
            if isinstance(item, dict):
                if item.get("mentioned", False):
                    mentions.append(True)
                if "sentiment" in item:
                    sentiments.append(item["sentiment"])
                if "accuracy" in item:
                    accuracies.append(item["accuracy"])
                if "competitors_mentioned" in item:
                    comps = item.get("competitors_mentioned", [])
                    if isinstance(comps, list):
                        competitors.update(comps)
        
        if mentions:
            result["mentioned"] = any(mentions)
        if sentiments:
            # Take the most common sentiment
            sentiment_counts = {}
            for sentiment in sentiments:
                sentiment_counts[sentiment] = sentiment_counts.get(sentiment, 0) + 1
            if sentiment_counts:
                result["sentiment"] = max(sentiment_counts.items(), key=lambda x: x[1])[0]
        if accuracies:
            accuracy_counts = {}
            for accuracy in accuracies:
                accuracy_counts[accuracy] = accuracy_counts.get(accuracy, 0) + 1
            if accuracy_counts:
                result["accuracy"] = max(accuracy_counts.items(), key=lambda x: x[1])[0]
        if competitors:
            result["competitors_mentioned"] = list(competitors)
        
        result["summary"] = f"Brand mentioned in {sum(mentions)} out of {len(response)} questions"
    
    # Generate action items based on results
    if not result["mentioned"]:
        result["action_items"].append("Create content to increase brand visibility")
    if result["accuracy"] == "inaccurate":
        result["action_items"].append("Correct inaccurate information about the brand")
    if result["sentiment"] == "negative":
        result["action_items"].append("Address negative sentiment about the brand")
    
    return result

def parse_unstructured_response(response: str, brand_name: str) -> Dict[str, Any]:
    """
    Parse unstructured text response from AI provider.
    
    Args:
        response: Text response from AI
        brand_name: The brand name
        
    Returns:
        Parsed results dictionary
    """
    # Simple text analysis for brand mentions and sentiment
    text = response.lower()
    mentioned = brand_name.lower() in text
    sentiment = "unknown"
    accuracy = "unknown"
    competitors = []
    
    # Basic sentiment analysis
    positive_words = ["good", "great", "excellent", "positive", "recommend", "best", "leader", "expert"]
    negative_words = ["bad", "poor", "negative", "avoid", "worst", "problem", "issue", "complaint"]
    
    positive_count = sum(1 for word in positive_words if word in text)
    negative_count = sum(1 for word in negative_words if word in text)
    
    if positive_count > negative_count:
        sentiment = "positive"
    elif negative_count > positive_count:
        sentiment = "negative"
    elif positive_count == negative_count and positive_count > 0:
        sentiment = "neutral"
    
    # Extract potential competitors (simple heuristic)
    competitor_patterns = [
        r"competitors?[:]\s*([^\.]+)",
        r"similar to\s+([^\.]+)",
        r"like\s+([^\.]+)",
        r"compared to\s+([^\.]+)"
    ]
    
    for pattern in competitor_patterns:
        matches = re.findall(pattern, response, re.IGNORECASE)
        for match in matches:
            # Split by commas, and, or, etc.
            names = re.split(r",|\band\b|\bor\b", match)
            competitors.extend([name.strip() for name in names if name.strip()])
    
    # Remove duplicates and empty strings
    competitors = list(set([c for c in competitors if c and c.lower() != brand_name.lower()]))
    
    summary = f"Brand {'' if mentioned else 'not '}mentioned in AI response. "
    summary += f"Sentiment appears {sentiment} based on keyword analysis."
    
    result = {
        "mentioned": mentioned,
        "sentiment": sentiment,
        "accuracy": accuracy,
        "summary": summary,
        "competitors_mentioned": competitors[:5],  # Limit to top 5
        "action_items": []
    }
    
    # Generate action items
    if not mentioned:
        result["action_items"].append("Increase brand visibility")
    if sentiment == "negative":
        result["action_items"].append("Address negative sentiment")
    
    return result

def compile_audit_report(
    brand_name: str,
    domain: str,
    provider_result: Dict[str, Any],
    topics: List[str]
) -> Dict[str, Any]:
    """
    Compile final audit report from provider result.
    
    Args:
        brand_name: The brand name
        domain: The brand domain
        provider_result: Results from the AI provider
        topics: List of core topics
        
    Returns:
        Comprehensive audit report
    """
    # Calculate overall metrics
    mentioned = provider_result.get("mentioned", False)
    
    # Collect action items and recommendations
    action_items = provider_result.get("action_items", [])
    
    # Collect competitors mentioned
    competitors = provider_result.get("competitors_mentioned", [])
    
    return {
        "brand_name": brand_name,
        "domain": domain,
        "audit_timestamp": datetime.now().isoformat(),
        "topics_analyzed": topics,
        "mentions_summary": {
            "mentioned": mentioned,
            "sentiment": provider_result.get("sentiment", "unknown"),
            "accuracy": provider_result.get("accuracy", "unknown")
        },
        "provider_result": provider_result,
        "competitive_landscape": {
            "competitors_identified": competitors[:10],  # Limit to top 10
            "total_competitors_mentioned": len(competitors)
        },
        "recommendations": action_items,
        "overall_assessment": generate_overall_assessment(provider_result, brand_name)
    }

def generate_overall_assessment(provider_result: Dict[str, Any], brand_name: str) -> str:
    """
    Generate an overall assessment based on the provider result.
    
    Args:
        provider_result: Results from the AI provider
        brand_name: The brand name
        
    Returns:
        Overall assessment text
    """
    mentioned = provider_result.get("mentioned", False)
    sentiment = provider_result.get("sentiment", "unknown")
    
    if not mentioned:
        return f"{brand_name} has low visibility in AI models. Significant content creation and brand building needed."
    elif sentiment == "positive":
        return f"{brand_name} has good visibility with positive sentiment. Continue building on this positive perception."
    elif sentiment == "negative":
        return f"{brand_name} is mentioned but with negative sentiment. Address negative perceptions and improve brand reputation."
    elif sentiment == "neutral":
        return f"{brand_name} has visibility with neutral sentiment. Work on building more positive brand associations."
    else:
        return f"{brand_name} has visibility but sentiment is unclear. Focus on building clear and positive brand messaging."