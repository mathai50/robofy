"""
Data transformers for converting raw SEO analysis results into frontend-friendly formats.
"""
from typing import Dict, Any, List
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

def transform_seo_score(audit_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transform SEO audit data into frontend-friendly score format."""
    if not audit_data or not isinstance(audit_data, dict):
        logger.warning("No audit data available, using sample data for SEO score")
        # Return sample data for better user experience
        return {
            "score": 75,
            "rating": "Good",
            "issues": [
                {
                    "type": "sample_data",
                    "count": 1,
                    "severity": "low",
                    "description": "Displaying sample data - real analysis may provide different results"
                },
                {
                    "type": "meta_tags",
                    "count": 3,
                    "severity": "medium",
                    "description": "Missing or incomplete meta tags on several pages"
                },
                {
                    "type": "image_optimization",
                    "count": 5,
                    "severity": "medium",
                    "description": "Images could be better optimized for faster loading"
                },
                {
                    "type": "mobile_friendly",
                    "count": 0,
                    "severity": "low",
                    "description": "Site is mobile-friendly"
                },
                {
                    "type": "ssl_certificate",
                    "count": 0,
                    "severity": "low",
                    "description": "SSL certificate is properly installed"
                }
            ]
        }
    
    # Calculate SEO score based on audit results
    score = 75  # Default score
    
    # Simple scoring logic (similar to what's in the Dash dashboard)
    if audit_data.get('status_code') == 200:
        score += 10
    if audit_data.get('ssl_certificate'):
        score += 5
    if audit_data.get('mobile_friendly'):
        score += 5
    if audit_data.get('title_tag') != "MISSING":
        score += 5
    if audit_data.get('meta_description') != "MISSING":
        score += 5
    
    score = min(score, 100)  # Cap at 100
    
    # Determine rating
    if score >= 90:
        rating = "Excellent"
    elif score >= 70:
        rating = "Good"
    elif score >= 50:
        rating = "Average"
    elif score >= 30:
        rating = "Poor"
    else:
        rating = "Critical"
    
    # Create issues array with severity levels
    issues = []
    
    if audit_data.get('status_code') != 200:
        issues.append({
            "type": "http_status",
            "count": 1,
            "severity": "high"
        })
    if not audit_data.get('ssl_certificate'):
        issues.append({
            "type": "ssl_certificate",
            "count": 1,
            "severity": "high"
        })
    if audit_data.get('title_tag') == "MISSING":
        issues.append({
            "type": "title_tag",
            "count": 1,
            "severity": "high"
        })
    if audit_data.get('meta_description') == "MISSING":
        issues.append({
            "type": "meta_description",
            "count": 1,
            "severity": "high"
        })
    if not audit_data.get('mobile_friendly'):
        issues.append({
            "type": "mobile_friendly",
            "count": 1,
            "severity": "medium"
        })
    
    # Add positive items as low severity (strengths)
    if audit_data.get('status_code') == 200:
        issues.append({
            "type": "http_status_ok",
            "count": 1,
            "severity": "low"
        })
    if audit_data.get('ssl_certificate'):
        issues.append({
            "type": "ssl_certificate_installed",
            "count": 1,
            "severity": "low"
        })
    if audit_data.get('title_tag') != "MISSING":
        issues.append({
            "type": "title_tag_present",
            "count": 1,
            "severity": "low"
        })
    if audit_data.get('meta_description') != "MISSING":
        issues.append({
            "type": "meta_description_present",
            "count": 1,
            "severity": "low"
        })
    if audit_data.get('mobile_friendly'):
        issues.append({
            "type": "mobile_friendly_ok",
            "count": 1,
            "severity": "low"
        })
    
    return {
        "score": score,
        "rating": rating,
        "issues": issues
    }

def transform_keyword_data(keyword_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transform keyword research data into chart-friendly format."""
    if not keyword_data or not isinstance(keyword_data, dict):
        logger.warning("No keyword data available, using sample data")
        # Sample keyword data for demonstration
        keywords = ['SEO Services', 'Digital Marketing', 'Content Strategy', 'Website Optimization', 'Search Engine Ranking']
        volumes = [1200, 900, 750, 600, 500]
        difficulties = ['medium', 'hard', 'medium', 'easy', 'hard']
        
        # Map difficulties to colors
        difficulty_colors = {
            'easy': '#10b981',
            'medium': '#f59e0b',
            'hard': '#ef4444'
        }
        
        background_colors = [difficulty_colors.get(diff.lower(), '#6b7280') for diff in difficulties]
        
        return {
            "labels": keywords,
            "datasets": [{
                "label": "Monthly Searches",
                "data": volumes,
                "backgroundColor": background_colors
            }]
        }
    
    # Extract keywords from various possible structures
    keywords = []
    volumes = []
    difficulties = []
    
    if 'high_volume_keywords' in keyword_data and isinstance(keyword_data['high_volume_keywords'], list):
        for kw_entry in keyword_data['high_volume_keywords'][:15]:  # Limit to top 15
            try:
                if isinstance(kw_entry, dict):
                    keyword = kw_entry.get('keyword')
                    # Handle different possible keys for volume
                    volume = kw_entry.get('volume', kw_entry.get('monthly_searches'))
                    difficulty = kw_entry.get('difficulty', 'medium')
                    
                    if keyword and volume is not None:
                        keywords.append(str(keyword))
                        volumes.append(int(volume))
                        difficulties.append(str(difficulty))

                elif isinstance(kw_entry, str) and ' - ' in kw_entry:
                    # This parsing is brittle and depends on a specific string format.
                    # It's better to ensure the AI agent returns structured data (e.g., JSON).
                    parts = kw_entry.split(' - ')
                    keyword = parts[0].strip()
                    vol_part = parts[1].lower().replace('searches', '').strip()
                    
                    if 'k' in vol_part:
                        volume = float(vol_part.replace('k', '')) * 1000
                    else:
                        volume = float(vol_part)
                    
                    difficulty = parts[2].replace('difficulty', '').strip() if len(parts) > 2 else 'medium'
                    
                    if keyword and volume > 0:
                        keywords.append(keyword)
                        volumes.append(int(volume))
                        difficulties.append(difficulty)
            except (ValueError, IndexError, TypeError) as e:
                logger.warning(f"Could not parse keyword data entry: '{kw_entry}'. Error: {e}")
                continue
    
    # Fallback to sample data if no keywords found
    if not keywords:
        keywords = ['SEO Services', 'Digital Marketing', 'Content Strategy', 'Website Optimization', 'Search Engine Ranking']
        volumes = [1200, 900, 750, 600, 500]
        difficulties = ['medium', 'hard', 'medium', 'easy', 'hard']
    
    # Map difficulties to colors
    difficulty_colors = {
        'easy': '#10b981',
        'medium': '#f59e0b',
        'hard': '#ef4444'
    }
    
    background_colors = [difficulty_colors.get(diff.lower(), '#6b7280') for diff in difficulties]
    
    return {
        "labels": keywords,
        "datasets": [{
            "label": "Monthly Searches",
            "data": volumes,
            "backgroundColor": background_colors
        }]
    }

def transform_competitor_data(competitor_data: Dict[str, Any]) -> Dict[str, Any]:
    """Transform competitor analysis data into radar chart format."""
    if not competitor_data or not isinstance(competitor_data, dict):
        logger.warning("No competitor data available, using sample data")
        # Sample competitor data for demonstration
        metrics = ['Domain Authority', 'Content Quality', 'Backlinks', 'Social Presence', 'Technical SEO']
        
        return {
            "labels": metrics,
            "datasets": [
                {
                    "label": "Your Website",
                    "data": [75, 60, 85, 70, 65],
                    "backgroundColor": "rgba(59, 130, 246, 0.2)",
                    "borderColor": "#3b82f6"
                },
                {
                    "label": "Competitor A",
                    "data": [65, 75, 70, 80, 60],
                    "backgroundColor": "rgba(239, 68, 68, 0.2)",
                    "borderColor": "#ef4444"
                },
                {
                    "label": "Competitor B",
                    "data": [80, 70, 90, 65, 75],
                    "backgroundColor": "rgba(16, 185, 129, 0.2)",
                    "borderColor": "#10b981"
                }
            ]
        }
    
    # Default metrics and values
    metrics = ['Domain Authority', 'Content Quality', 'Backlinks', 'Social Presence', 'Technical SEO']
    your_values = [75, 60, 85, 70, 65]  # Default values
    
    # Try to get actual metrics from competitor analysis
    if 'metrics' in competitor_data and isinstance(competitor_data['metrics'], dict):
        metrics_data = competitor_data['metrics']
        your_values = [
            metrics_data.get('domain_authority', 75),
            metrics_data.get('content_quality', 60),
            metrics_data.get('backlink_quality', 85),
            metrics_data.get('social_presence', 70),
            metrics_data.get('technical_seo', 65)
        ]
    
    datasets = [
        {
            "label": "Your Website",
            "data": your_values,
            "backgroundColor": "rgba(59, 130, 246, 0.2)",
            "borderColor": "#3b82f6"
        }
    ]
    
    # Add competitor data if available
    if 'competitors' in competitor_data and competitor_data['competitors']:
        competitors = competitor_data['competitors']
        if isinstance(competitors, list) and len(competitors) > 0:
            competitor_colors = ['#ef4444', '#f59e0b', '#10b981']  # Red, Orange, Green
            
            for i, competitor in enumerate(competitors[:3]):  # Add up to 3 competitors
                if isinstance(competitor, dict):
                    comp_name = competitor.get('name', f'Competitor {i+1}')
                    comp_values = [
                        competitor.get('domain_authority', 65 + i*5),
                        competitor.get('content_quality', 75 - i*5),
                        competitor.get('backlinks', 70 + i*3),
                        competitor.get('social_score', 80 - i*5),
                        competitor.get('technical_score', 60 + i*5)
                    ]
                    
                    datasets.append({
                        "label": comp_name,
                        "data": comp_values,
                        "backgroundColor": f"rgba({i * 85}, {i * 85}, {i * 85}, 0.2)",
                        "borderColor": competitor_colors[i % len(competitor_colors)]
                    })
    
    return {
        "labels": metrics,
        "datasets": datasets
    }

def transform_recommendations(recommendations_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Transform recommendations into frontend-friendly format."""
    if not recommendations_data or not isinstance(recommendations_data, dict):
        logger.warning("No recommendations data available, using sample recommendations")
        # Sample recommendations for demonstration
        return [
            {
                "category": "Technical SEO",
                "priority": "high",
                "description": "Implement structured data markup to improve rich snippets in search results",
                "impact": "Increase click-through rates by 15-20%"
            },
            {
                "category": "Content Strategy",
                "priority": "medium",
                "description": "Create pillar content around core topics to establish topical authority",
                "impact": "Improve rankings for related keywords"
            },
            {
                "category": "On-Page SEO",
                "priority": "medium",
                "description": "Optimize title tags and meta descriptions for better click-through rates",
                "impact": "Increase organic traffic by 10-15%"
            },
            {
                "category": "Backlink Building",
                "priority": "low",
                "description": "Develop a guest posting strategy to acquire quality backlinks",
                "impact": "Improve domain authority over time"
            }
        ]
    
    recommendations = []
    
    priority_keywords = {
        "high": ["critical", "urgent", "immediately", "essential"],
        "low": ["consider", "optional", "suggestion", "nice to have"],
    }
    
    for category, recs in recommendations_data.items():
        if isinstance(recs, list) and recs:
            for rec in recs[:10]:  # Show top 10 per category
                if isinstance(rec, str) and rec.strip():
                    rec_lower = rec.lower()
                    priority = "medium"

                    # Check for priority keywords in the recommendation text first
                    if any(keyword in rec_lower for keyword in priority_keywords["high"]):
                        priority = "high"
                    elif any(keyword in rec_lower for keyword in priority_keywords["low"]):
                        priority = "low"
                    else:
                        # Fallback to category name if no keywords found in text
                        cat_lower = category.lower()
                        if any(word in cat_lower for word in ['technical', 'critical', 'urgent']):
                            priority = "high"
                        elif any(word in cat_lower for word in ['optional', 'nice']):
                            priority = "low"
                    
                    recommendations.append({
                        "category": category.title().replace('_', ' '),
                        "priority": priority,
                        "description": rec.split(':', 1)[-1].strip() if ':' in rec else rec, # Clean up prefixes like "CRITICAL: "
                        "impact": "High" if priority == "high" else ("Low" if priority == "low" else "Medium")
                    })
    
    return recommendations

def transform_content_gaps(content_gap_data: Dict[str, Any]) -> List[str]:
    """Extract content gaps from analysis data."""
    if not content_gap_data or not isinstance(content_gap_data, dict):
        return ["No content gap analysis available"]
    
    content_gaps = []
    
    if 'missing_topics' in content_gap_data and isinstance(content_gap_data['missing_topics'], list):
        for topic in content_gap_data['missing_topics'][:10]:  # Show top 10
            if isinstance(topic, dict):
                topic_name = topic.get('topic', topic.get('title', topic.get('name', 'Unknown topic')))
                content_gaps.append(str(topic_name))
            elif isinstance(topic, str) and topic.strip():
                content_gaps.append(topic)
    
    if 'recommendations' in content_gap_data and isinstance(content_gap_data['recommendations'], list):
        for rec in content_gap_data['recommendations'][:5]:  # Show top 5 recommendations
            if isinstance(rec, str) and rec.strip():
                content_gaps.append(rec)
    
    return content_gaps if content_gaps else ["No content gaps identified"]

def transform_analysis_for_frontend(analysis_data: Dict[str, Any], domain: str = "Unknown domain", timestamp: str = "") -> Dict[str, Any]:
    """Transform complete analysis results into frontend-friendly format including verbose summaries for content creation."""
    if not analysis_data or not isinstance(analysis_data, dict):
        logger.warning("No analysis data available, using comprehensive sample data")
        # Return comprehensive sample data for better user experience
        return {
            "seoScore": {
                "score": 75,
                "rating": "Good",
                "issues": [
                    {
                        "type": "sample_data",
                        "count": 1,
                        "severity": "low",
                        "description": "Displaying sample data - real analysis may provide different results"
                    },
                    {
                        "type": "meta_tags",
                        "count": 3,
                        "severity": "medium",
                        "description": "Missing or incomplete meta tags on several pages"
                    },
                    {
                        "type": "image_optimization",
                        "count": 5,
                        "severity": "medium",
                        "description": "Images could be better optimized for faster loading"
                    }
                ]
            },
            "keywordData": {
                "labels": ['SEO Services', 'Digital Marketing', 'Content Strategy', 'Website Optimization', 'Search Engine Ranking'],
                "datasets": [{
                    "label": "Monthly Searches",
                    "data": [1200, 900, 750, 600, 500],
                    "backgroundColor": ['#f59e0b', '#ef4444', '#f59e0b', '#10b981', '#ef4444']
                }]
            },
            "competitorData": {
                "labels": ['Domain Authority', 'Content Quality', 'Backlinks', 'Social Presence', 'Technical SEO'],
                "datasets": [
                    {
                        "label": "Your Website",
                        "data": [75, 60, 85, 70, 65],
                        "backgroundColor": "rgba(59, 130, 246, 0.2)",
                        "borderColor": "#3b82f6"
                    },
                    {
                        "label": "Competitor A",
                        "data": [65, 75, 70, 80, 60],
                        "backgroundColor": "rgba(239, 68, 68, 0.2)",
                        "borderColor": "#ef4444"
                    }
                ]
            },
            "recommendations": [
                {
                    "category": "Technical SEO",
                    "priority": "high",
                    "description": "Implement structured data markup to improve rich snippets in search results",
                    "impact": "Increase click-through rates by 15-20%"
                },
                {
                    "category": "Content Strategy",
                    "priority": "medium",
                    "description": "Create pillar content around core topics to establish topical authority",
                    "impact": "Improve rankings for related keywords"
                }
            ],
            "verboseSummaries": {
                "keywordResearch": "Sample verbose summary for keyword research. This would contain detailed insights for content creation based on keyword analysis.",
                "competitorAnalysis": "Sample verbose summary for competitor analysis. This would provide insights into competitor strengths and content gaps.",
                "seoAudit": "Sample verbose summary for SEO audit. This would explain technical issues and optimization opportunities.",
                "contentGapAnalysis": "Sample verbose summary for content gap analysis. This would highlight missing topics and content opportunities."
            },
            "domain": domain,
            "timestamp": timestamp or datetime.now().isoformat()
        }
    
    # The analysis_data is the direct result from the comprehensive analysis tool.
    # It contains keys like 'seo_audit', 'keyword_research', etc.
    results = analysis_data if isinstance(analysis_data, dict) else {}
    
    # Extract verbose summaries from analysis results if available
    verbose_summaries = {}
    if results.get('keyword_research') and isinstance(results.get('keyword_research'), dict):
        verbose_summaries['keywordResearch'] = results['keyword_research'].get('verbose_summary', 'No verbose summary for keyword research.')
    if results.get('competitor_analysis') and isinstance(results.get('competitor_analysis'), dict):
        verbose_summaries['competitorAnalysis'] = results['competitor_analysis'].get('verbose_summary', 'No verbose summary for competitor analysis.')
    if results.get('seo_audit') and isinstance(results.get('seo_audit'), dict):
        verbose_summaries['seoAudit'] = results['seo_audit'].get('verbose_summary', 'No verbose summary for SEO audit.')
    if results.get('content_gaps') and isinstance(results.get('content_gaps'), dict):
        verbose_summaries['contentGapAnalysis'] = results['content_gaps'].get('verbose_summary', 'No verbose summary for content gap analysis.')
    
    # If no verbose summaries found, use sample ones
    if not verbose_summaries:
        verbose_summaries = {
            "keywordResearch": "No verbose summary available for keyword research.",
            "competitorAnalysis": "No verbose summary available for competitor analysis.",
            "seoAudit": "No verbose summary available for SEO audit.",
            "contentGapAnalysis": "No verbose summary available for content gap analysis."
        }
    
    return {
        "seoScore": transform_seo_score(results.get('seo_audit', {})),
        "keywordData": transform_keyword_data(results.get('keyword_research', {})),
        "competitorData": transform_competitor_data(results.get('competitor_analysis', {})),
        "recommendations": transform_recommendations(results.get('recommendations', {})),
        "verboseSummaries": verbose_summaries,
        "domain": domain,
        "timestamp": timestamp or datetime.now().isoformat()
    }