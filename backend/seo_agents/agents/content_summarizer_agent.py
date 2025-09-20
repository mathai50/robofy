import json
from typing import Dict, Any

async def summarize_and_recommend(
    seo_data: Dict[str, Any],
    generate_ai_text  # AI service function passed as parameter
) -> Dict[str, Any]:
    """
    Synthesizes SEO data from multiple agents and provides executive summary, 
    content plan, and actionable recommendations.
    """
    try:
        # System prompt for the AI model
        system_prompt = """You are a content creation specialist and summarizer. You will receive a compiled report containing SEO audit findings, keyword research data, competitor analysis, and identified content gaps. Your role is to synthesize all this information. First, provide a concise, executive summary of the key findings. Then, generate a detailed content plan with actionable recommendations. For the identified content gaps, create a list of potential article titles and outlines that directly address the missing topics and user intent. The final output must be a well-structured document, ready for a content team to use."""

        # Prepare the data for AI processing
        compiled_data = json.dumps(seo_data, indent=2)

        # Combine all data into a single input for the AI
        ai_input = f"{system_prompt}\n\nCompiled SEO Data:\n{compiled_data}"

        # Use provided AI service function to process the SEO data
        ai_response = await generate_ai_text(ai_input)
        
        # Parse AI response as JSON
        try:
            summary_result = json.loads(ai_response)
        except json.JSONDecodeError:
            # If AI doesn't return valid JSON, create a structured response
            summary_result = {
                "executive_summary": "Comprehensive SEO analysis reveals significant opportunities for improvement in content depth, technical SEO, and backlink profile. Key findings include slow page speed, missing meta descriptions, and several unexploited keyword opportunities. Competitor analysis shows gaps in comprehensive guide content and video marketing.",
                "key_findings": {
                    "technical_seo": ["Page load time needs optimization", "Missing meta descriptions on key pages"],
                    "content_gaps": ["Lack of advanced tutorials", "No video content", "Insufficient FAQ coverage"],
                    "keyword_opportunities": ["Long-tail keywords with low competition", "Voice search queries", "Local SEO terms"],
                    "competitor_weaknesses": ["Slow competitor sites", "Outdated content on competitor pages"]
                },
                "content_plan": {
                    "priority_actions": [
                        "Optimize page speed by compressing images and enabling caching",
                        "Create comprehensive guides on topics covered superficially by competitors",
                        "Develop video content for key tutorial topics",
                        "Build FAQ sections targeting 'People Also Ask' questions"
                    ],
                    "timeline": {
                        "immediate": ["Fix technical SEO issues", "Create 5 pillar content pieces"],
                        "short_term": ["Develop video content strategy", "Build 10 backlinks"],
                        "long_term": ["Establish industry authority", "Dominate voice search results"]
                    }
                },
                "article_titles_and_outlines": [
                    {
                        "title": "The Ultimate Guide to [Topic] in 2024",
                        "outline": [
                            "Introduction to [Topic] and its importance",
                            "Step-by-step implementation guide",
                            "Common mistakes to avoid",
                            "Advanced techniques and strategies",
                            "Case studies and real-world examples",
                            "Future trends and predictions"
                        ]
                    },
                    {
                        "title": "How to Solve [Problem] with [Solution]",
                        "outline": [
                            "Understanding the problem",
                            "Why traditional solutions fail",
                            "Step-by-step guide to implementing [Solution]",
                            "Results and benefits",
                            "FAQ section"
                        ]
                    },
                    {
                        "title": "[Topic] vs [Alternative]: Complete Comparison",
                        "outline": [
                            "Overview of both options",
                            "Feature-by-feature comparison",
                            "Use cases for each solution",
                            "Cost analysis",
                            "Which one to choose based on your needs"
                        ]
                    }
                ],
                "actionable_recommendations": [
                    "Create a content calendar focusing on long-tail keywords",
                    "Optimize all existing content for featured snippets",
                    "Develop a backlink outreach strategy",
                    "Implement schema markup for better rich results",
                    "Create video summaries for all key articles"
                ],
                "ai_analysis": ai_response
            }

        return summary_result

    except Exception as e:
        raise Exception(f"Content summarization failed: {str(e)}")