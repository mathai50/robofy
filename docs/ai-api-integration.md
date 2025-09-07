# AI API Integration Guide

## Overview
This document describes the API integration between the Next.js frontend and Python backend for AI features.

## API Endpoints

### 1. AI Content Generation
**Endpoint**: `POST /api/ai`
**Python Backend**: `POST /api/ai/content`
**Purpose**: Generate AI-powered content

**Request Body**:
```json
{
  "title": "Content Title",
  "industry": "Industry Name",
  "content_type": "blog|industry_page|service|landing_page"
}
```

**Response**:
```json
{
  "id": 1,
  "title": "Content Title",
  "content": "Generated content...",
  "industry": "Industry Name",
  "status": "published",
  "created_at": "2024-01-01T00:00:00",
  "published_at": "2024-01-01T00:00:00"
}
```

### 2. Chat Messages
**Endpoint**: `POST /api/chat/messages`
**Python Backend**: `POST /api/chat/messages`
**Purpose**: Handle AI chat conversations

**Request Body**:
```json
{
  "message": "User message",
  "session_id": "optional-session-id"
}
```

**Response**: Streamed SSE events or JSON response

### 3. Lead Management
**Endpoint**: `POST /api/leads`
**Python Backend**: `POST /api/leads`
**Purpose**: Create and manage leads

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "industry": "Technology",
  "source": "Website"
}
```

### 4. SEO Analysis
**Endpoint**: `POST /api/seo/competitor-analysis`
**Python Backend**: `POST /api/seo/competitor-analysis`
**Purpose**: Perform SEO competitor analysis

**Request Body**:
```json
{
  "domain": "example.com",
  "competitors": ["competitor1.com", "competitor2.com"]
}
```

## Environment Configuration

### Development (.env.local)
```
PYTHON_BACKEND_URL=http://localhost:8000
```

### Production (.env.production)
```
PYTHON_BACKEND_URL=https://your-actual-domain.pythonanywhere.com
```

## Error Handling

All API endpoints return standardized error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Testing

1. **Local Testing**: Set `PYTHON_BACKEND_URL=http://localhost:8000` and run both services
2. **Production Testing**: Update the production URL and verify connectivity
3. **API Testing**: Use tools like Postman or curl to test endpoints directly

## Integration Points

- Frontend components use relative paths (`/api/ai`) that proxy to Python backend
- All authentication and CORS are handled through the Next.js API routes
- Error handling is consistent across all endpoints