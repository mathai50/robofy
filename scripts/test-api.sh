#!/bin/bash

# API Testing Script for Robofy Backend
# This script tests the backend API endpoints using curl
# Ensure the backend is running on port 8000 before using this script

API_BASE="http://localhost:8000"
TEST_MESSAGE="Hello, can you help me with SEO analysis?"
CONTENT_TITLE="Test Content"
CONTENT_INDUSTRY="technology"
CONTENT_TYPE="blog"

# Test data for SEO endpoints
DOMAIN="example.com"
COMPETITOR="competitor.com"
TOPIC="digital marketing"
KEYWORDS="seo, digital marketing, ai solutions"
URL="https://example.com"

echo "Testing Robofy Backend API endpoints..."
echo "API Base URL: $API_BASE"
echo ""

# Test health endpoint
echo "1. Testing health endpoint:"
curl -s -X GET "$API_BASE/api/health" | jq . || echo "Health check response (without jq):" && curl -s -X GET "$API_BASE/api/health"
echo ""

# Test root endpoint
echo "2. Testing root endpoint:"
curl -s -X GET "$API_BASE/" | jq . || echo "Root response (without jq):" && curl -s -X GET "$API_BASE/"
echo ""

# Test AI chat message endpoint with different tools
echo "3. Testing AI chat message endpoint with SEO tool:"
curl -s -X POST "$API_BASE/api/ai/message" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"$TEST_MESSAGE\", \"tool\": \"seo analysis\"}" \
  | jq . || echo "Chat response (without jq):" && curl -s -X POST "$API_BASE/api/ai/message" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"$TEST_MESSAGE\", \"tool\": \"seo analysis\"}"
echo ""

echo "4. Testing AI chat message endpoint with competitor analysis tool:"
curl -s -X POST "$API_BASE/api/ai/message" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Analyze my competitors in the tech industry\", \"tool\": \"competitor analysis\"}" \
  | jq . || echo "Chat response (without jq):" && curl -s -X POST "$API_BASE/api/ai/message" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Analyze my competitors in the tech industry\", \"tool\": \"competitor analysis\"}"
echo ""

echo "5. Testing AI chat message endpoint with content creation tool:"
curl -s -X POST "$API_BASE/api/ai/message" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Create a blog post about AI trends\", \"tool\": \"content creation\"}" \
  | jq . || echo "Chat response (without jq):" && curl -s -X POST "$API_BASE/api/ai/message" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Create a blog post about AI trends\", \"tool\": \"content creation\"}"
echo ""

# Test SEO-specific endpoints
echo "6. Testing SEO competitor analysis endpoint:"
curl -s -X POST "$API_BASE/api/seo/competitor-analysis" \
  -H "Content-Type: application/json" \
  -d "{\"domain\": \"$DOMAIN\", \"competitors\": [\"$COMPETITOR\"]}" \
  | jq . || echo "Competitor analysis response (without jq):" && curl -s -X POST "$API_BASE/api/seo/competitor-analysis" \
  -H "Content-Type: application/json" \
  -d "{\"domain\": \"$DOMAIN\", \"competitors\": [\"$COMPETITOR\"]}"
echo ""

echo "7. Testing SEO keyword research endpoint:"
curl -s -X POST "$API_BASE/api/seo/keyword-research" \
  -H "Content-Type: application/json" \
  -d "{\"topic\": \"$TOPIC\", \"industry\": \"$CONTENT_INDUSTRY\"}" \
  | jq . || echo "Keyword research response (without jq):" && curl -s -X POST "$API_BASE/api/seo/keyword-research" \
  -H "Content-Type: application/json" \
  -d "{\"topic\": \"$TOPIC\", \"industry\": \"$CONTENT_INDUSTRY\"}"
echo ""

echo "8. Testing SEO backlink analysis endpoint:"
curl -s -X POST "$API_BASE/api/seo/backlink-analysis" \
  -H "Content-Type: application/json" \
  -d "{\"domain\": \"$DOMAIN\"}" \
  | jq . || echo "Backlink analysis response (without jq):" && curl -s -X POST "$API_BASE/api/seo/backlink-analysis" \
  -H "Content-Type: application/json" \
  -d "{\"domain\": \"$DOMAIN\"}"
echo ""

echo "9. Testing SEO audit endpoint:"
curl -s -X POST "$API_BASE/api/seo/audit" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$URL\"}" \
  | jq . || echo "SEO audit response (without jq):" && curl -s -X POST "$API_BASE/api/seo/audit" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$URL\"}"
echo ""

# Test content generation endpoint
echo "10. Testing content generation endpoint:"
curl -s -X POST "$API_BASE/api/ai/content" \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"$CONTENT_TITLE\", \"industry\": \"$CONTENT_INDUSTRY\", \"content_type\": \"$CONTENT_TYPE\"}" \
  | jq . || echo "Content generation response (without jq):" && curl -s -X POST "$API_BASE/api/ai/content" \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"$CONTENT_TITLE\", \"industry\": \"$CONTENT_INDUSTRY\", \"content_type\": \"$CONTENT_TYPE\"}"
echo ""

# Test getting leads (requires authentication, might fail)
echo "11. Testing leads endpoint (might require auth):"
curl -s -X GET "$API_BASE/api/leads" | jq . || echo "Leads response (without jq, might be empty or error):" && curl -s -X GET "$API_BASE/api/leads"
echo ""

echo "API testing completed. If any endpoints failed, ensure the backend is running and check the logs."
echo ""
echo "Note: Some endpoints may require authentication or valid API keys for AI services."
echo "For SEO endpoints, ensure the SEO MCP server is properly configured if needed."