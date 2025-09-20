#!/usr/bin/env python3
"""
Script to extract competitive analysis JSON data to readable text format.
"""
import json
import os

def json_to_text(json_file_path, output_file_path=None):
    """Convert JSON competitive analysis to readable text format."""
    
    if not os.path.exists(json_file_path):
        print(f"❌ File not found: {json_file_path}")
        return False
    
    try:
        # Read the JSON file
        with open(json_file_path, 'r') as f:
            data = json.load(f)
        
        # Create text output
        text_output = []
        text_output.append("=" * 60)
        text_output.append("COMPETITIVE ANALYSIS REPORT")
        text_output.append("=" * 60)
        text_output.append("")
        
        # Target domain
        text_output.append(f"🎯 TARGET DOMAIN: {data.get('target_domain', 'N/A')}")
        text_output.append("")
        
        # Competitors
        competitors = data.get('competitors', [])
        text_output.append(f"🔍 COMPETITORS FOUND: {len(competitors)}")
        for i, competitor in enumerate(competitors, 1):
            text_output.append(f"   {i}. {competitor}")
        text_output.append("")
        
        # SERP metrics
        text_output.append(f"📊 SERP METRICS:")
        text_output.append(f"   • Total Organic Results: {data.get('total_organic_results', 'N/A')}")
        text_output.append(f"   • SERP Features Detected: {len(data.get('serp_features', []))}")
        text_output.append("")
        
        # SERP features
        serp_features = data.get('serp_features', [])
        text_output.append("📋 SERP FEATURES:")
        for feature in serp_features:
            text_output.append(f"   • {feature}")
        text_output.append("")
        
        # Sample results
        raw_samples = data.get('raw_results_sample', [])
        text_output.append("📝 SAMPLE SEARCH RESULTS:")
        for i, result in enumerate(raw_samples, 1):
            text_output.append(f"   {i}. {result.get('title', 'No title')}")
            text_output.append(f"      Link: {result.get('link', 'No link')}")
            text_output.append(f"      Snippet: {result.get('snippet', 'No snippet')}")
            text_output.append("")
        
        text_output.append("=" * 60)
        text_output.append("END OF REPORT")
        text_output.append("=" * 60)
        
        # Convert list to string
        full_text = "\n".join(text_output)
        
        # Output to file or console
        if output_file_path:
            with open(output_file_path, 'w') as f:
                f.write(full_text)
            print(f"✅ Text report saved to: {output_file_path}")
        else:
            print(full_text)
        
        return True
        
    except Exception as e:
        print(f"❌ Error processing JSON file: {str(e)}")
        return False

if __name__ == "__main__":
    # Input and output file paths
    json_file = "competitive_analysis_cgi.com.json"
    text_file = "competitive_analysis_report.txt"
    
    # Convert JSON to text
    success = json_to_text(json_file, text_file)
    
    if success:
        print("\n📋 Report Summary:")
        print(f"   • Source: {json_file}")
        print(f"   • Output: {text_file}")
        print("   • Use this to compare with current system output")
    else:
        print("❌ Failed to generate text report.")