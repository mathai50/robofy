#!/usr/bin/env python3
"""
Test script for the transform_recommendations function in data_transformers.py
"""
import sys
import os

# Add the backend directory to the path so we can import data_transformers
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from data_transformers import transform_recommendations

def test_transform_recommendations():
    """Test the smarter parsing logic in transform_recommendations"""
    
    # Test data with various priority indicators
    test_data = {
        "technical_seo": [
            "CRITICAL: Fix broken links immediately to improve user experience",
            "URGENT: Implement SSL certificate for secure connections",
            "Essential: Add structured data markup for rich snippets",
            "Regular SEO optimization tasks"
        ],
        "content_strategy": [
            "Consider creating more pillar content",
            "Optional: Add video content to engage users",
            "Suggestion: Update blog posts with current statistics",
            "Nice to have: Create infographics for social sharing"
        ],
        "on_page_seo": [
            "Optimize title tags and meta descriptions",
            "Improve internal linking structure"
        ],
        "backlink_building": [
            "Develop guest posting strategy",
            "Reach out to industry influencers"
        ]
    }
    
    print("Testing transform_recommendations with smart parsing...")
    print("=" * 60)
    
    # Call the function
    result = transform_recommendations(test_data)
    
    # Print the results
    print(f"Generated {len(result)} recommendations:")
    print("-" * 60)
    
    for i, rec in enumerate(result, 1):
        print(f"{i}. Category: {rec['category']}")
        print(f"   Priority: {rec['priority']}")
        print(f"   Description: {rec['description']}")
        print(f"   Impact: {rec['impact']}")
        print()
    
    # Verify some key expectations
    high_priority_count = sum(1 for rec in result if rec['priority'] == 'high')
    low_priority_count = sum(1 for rec in result if rec['priority'] == 'low')
    medium_priority_count = sum(1 for rec in result if rec['priority'] == 'medium')
    
    print("Verification Summary:")
    print(f"- High priority recommendations: {high_priority_count}")
    print(f"- Medium priority recommendations: {medium_priority_count}")
    print(f"- Low priority recommendations: {low_priority_count}")
    
    # Check if CRITICAL: prefix was cleaned
    critical_recs = [rec for rec in result if "CRITICAL:" not in rec['description'] and "Fix broken links" in rec['description']]
    if critical_recs:
        print("✓ CRITICAL: prefix successfully cleaned from descriptions")
    else:
        print("✗ CRITICAL: prefix cleaning may not be working")
    
    print("=" * 60)
    print("Test completed!")

if __name__ == "__main__":
    test_transform_recommendations()