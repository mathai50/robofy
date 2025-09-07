# AI Integration Documentation

## Overview

This backend integrates multiple AI services with priority-based fallback logic for robust content generation. The system supports DeepSeek, Google Gemini, OpenAI, and Hugging Face APIs with automatic failover between providers.

## Supported AI Providers

1. **DeepSeek** (Primary) - High performance, cost-effective
2. **Google Gemini** (Secondary) - Reliable, good quality
3. **OpenAI GPT** (Tertiary) - Well-established API
4. **Hugging Face** (Fallback) - Open-source alternatives

## Configuration

### Environment Variables

Create a `.env` file in the backend directory with your API keys:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/robofy

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Settings
ENVIRONMENT=development
DEBUG=True

# Security Settings
CORS_ORIGINS=http://localhost:3000,https://robofy.uk
ALLOWED_HOSTS=localhost,robofy.uk

# AI Service Configuration
# DeepSeek API Settings
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com

# Google AI Settings
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_MODEL=gemini-pro

# OpenAI API Settings (optional)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Hugging Face Settings (optional)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
HUGGINGFACE_MODEL=google/flan-t5-xxl

# AI Service Fallback Settings
AI_SERVICE_PRIORITY=deepseek,google,openai,huggingface
AI_MAX_RETRIES=3
AI_TIMEOUT=30
AI_FALLBACK_ENABLED=true
```

## API Endpoints

### Content Generation

**POST** `/api/ai/content`

Generate AI content for blogs, industry pages, and service descriptions.

```json
{
  "title": "AI-Powered Marketing Strategies",
  "industry": "healthcare",
  "content_type": "blog"
}
```

Response:
```json
{
  "id": 1,
  "title": "AI-Powered Marketing Strategies",
  "content": "Generated AI content in markdown format...",
  "industry": "healthcare",
  "status": "published",
  "created_at": "2024-01-15T10:30:00",
  "published_at": "2024-01-15T10:30:00"
}
```

### Health Check

**GET** `/api/health`

Check API status and AI service availability.

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00"
}
```

## Usage Examples

### Python Client

```python
import httpx
import asyncio

async def generate_content():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/api/ai/content",
            json={
                "title": "Digital Transformation in Healthcare",
                "industry": "healthcare",
                "content_type": "blog"
            }
        )
        return response.json()

# Run the example
result = asyncio.run(generate_content())
print(result)
```

### JavaScript/TypeScript Client

```javascript
const generateContent = async () => {
  const response = await fetch('http://localhost:8000/api/ai/content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'AI in Retail Automation',
      industry: 'retail',
      content_type: 'industry_page'
    }),
  });
  
  return await response.json();
};

generateContent().then(console.log);
```

### cURL Example

```bash
curl -X POST "http://localhost:8000/api/ai/content" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Solar Energy Marketing",
    "industry": "solar",
    "content_type": "blog"
  }'
```

## Autoblogging Script

The `autoblogging.py` script can generate content in bulk:

```bash
# Run autoblogging script
python backend/autoblogging.py

# Output example:
# ✅ Autoblogging complete! Generated 12 files (8 AI-generated, 4 fallback) in src/content/
```

## Error Handling

The system includes comprehensive error handling:

1. **Rate Limiting**: Automatic retry with exponential backoff
2. **Authentication Errors**: Proper error messages for invalid API keys
3. **Service Unavailable**: Fallback to secondary providers
4. **Complete Failure**: Fallback to static templates with logging

## Monitoring and Logging

Check logs for AI service performance:

```bash
# View provider status
INFO:ai_service:AI service initialized. Available providers: {
  "deepseek": {"available": true, "configured": true},
  "google": {"available": true, "configured": true},
  "openai": {"available": false, "configured": false},
  "huggingface": {"available": true, "configured": true}
}

# Content generation logs
INFO:ai_service:Attempting text generation with deepseek provider
INFO:ai_service:Successfully generated text with deepseek provider
```

## Testing

Run the test suite to verify AI integration:

```bash
# Run tests
cd backend
python -m pytest tests/ -v

# Test specific AI functionality
python -m pytest tests/test_ai_integration.py -v
```

## Deployment Considerations

1. **API Key Security**: Use environment variables or secret management
2. **Rate Limits**: Monitor usage and implement throttling
3. **Cost Optimization**: Set usage limits and monitor billing
4. **Fallback Strategy**: Ensure static templates are maintained
5. **Monitoring**: Implement health checks and alerting

## Troubleshooting

### Common Issues

1. **No AI Providers Available**
   - Check API keys are set in environment variables
   - Verify internet connectivity for API calls

2. **Rate Limit Errors**
   - Implement retry logic with backoff
   - Consider upgrading API plans

3. **Authentication Failures**
   - Verify API keys are valid and not expired
   - Check provider-specific authentication requirements

### Debug Mode

Enable debug logging for detailed troubleshooting:

```bash
export DEBUG=true
python backend/main.py
```

## Support

For issues with AI integration:

1. Check the provider API documentation
2. Verify API key permissions and quotas
3. Review application logs for specific error messages
4. Test with individual providers to isolate issues

## License

This AI integration is part of the Robofy backend system. See main project documentation for licensing details.