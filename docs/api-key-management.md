# API Key Management System

## Overview

The Robofy application now includes a secure API key management system that allows users to store and manage their AI service API keys. This feature enables personalized AI experiences by using user-specific API keys instead of system-wide environment variables.

## Key Features

- **Secure Encryption**: All API keys are encrypted at rest using Fernet symmetric encryption
- **User Isolation**: Each user can only access their own API keys
- **Multiple Providers**: Support for OpenAI, Google AI, DeepSeek, and Hugging Face
- **Client-side Validation**: Real-time validation of API key formats
- **Fallback System**: Maintains backward compatibility with environment variables

## Database Schema

### API Key Table Structure

The system adds a new `api_keys` table with the following structure:

```sql
CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    encrypted_key VARCHAR(512) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP NULL
);
```

## Backend API Endpoints

### Create API Key
**POST** `/api/api-keys`

Creates a new encrypted API key for the authenticated user.

**Request Body:**
```json
{
  "provider": "openai",
  "api_key": "sk-your-api-key-here"
}
```

**Response:**
```json
{
  "id": 1,
  "provider": "openai",
  "is_active": true,
  "created_at": "2025-09-11T06:53:00.000000",
  "updated_at": "2025-09-11T06:53:00.000000",
  "last_used": null
}
```

### List API Keys
**GET** `/api/api-keys`

Retrieves all API keys for the authenticated user (returns metadata only, not actual keys).

**Response:**
```json
[
  {
    "id": 1,
    "provider": "openai",
    "is_active": true,
    "created_at": "2025-09-11T06:53:00.000000",
    "updated_at": "2025-09-11T06:53:00.000000",
    "last_used": null
  }
]
```

### Delete API Key
**DELETE** `/api/api-keys/{id}`

Deletes a specific API key.

**Response:**
```json
{
  "message": "API key deleted successfully"
}
```

### Validate API Key
**POST** `/api/api-keys/{id}/validate`

Validates an API key against the provider (currently returns success, actual validation to be implemented).

**Response:**
```json
{
  "valid": true,
  "message": "API key is valid"
}
```

## Frontend Integration

### API Key Form Component

The frontend includes a new [`APIKeyForm`](src/components/APIKeyForm.tsx:1) component that provides:

- Provider selection dropdown
- Secure password input field
- Real-time format validation
- Error handling and success feedback

### Integration in AI Tools Page

The API key management form is integrated into the [`AI Tools page`](src/app/ai-tools/page.tsx:51) with a dedicated section below the tools grid.

## Security Implementation

### Encryption Service

The [`security.py`](backend/security.py:1) module handles encryption and decryption using Fernet symmetric encryption:

```python
# Encryption
encrypted_key = encrypt_api_key(plain_text_key)

# Decryption  
decrypted_key = decrypt_api_key(encrypted_key)
```

### Configuration

Add to your environment variables:
```bash
API_KEY_ENCRYPTION_KEY=your-base64-encoded-encryption-key
```

Generate a new encryption key:
```bash
python -c "from security import generate_encryption_key; print(generate_encryption_key())"
```

## AI Service Integration

The [`ai_service.py`](backend/ai_service.py:17) has been updated to support user-specific API keys:

```python
# Use user-specific keys
result = await ai_service.generate_text(prompt, user_id=current_user.id)

# Fallback to environment variables
result = await ai_service.generate_text(prompt)
```

## Setup and Deployment

### Database Migration

1. Run the database migration to create the API keys table:
```bash
alembic upgrade head
```

2. Verify the migration was successful by checking the database schema.

### Environment Configuration

1. Generate an encryption key:
```bash
python -c "from backend.security import generate_encryption_key; print(generate_encryption_key())"
```

2. Add the encryption key to your environment variables in `.env`:
```bash
API_KEY_ENCRYPTION_KEY=your-generated-key-here
```

3. Restart the backend server to apply changes.

### Testing

Run the security test to verify encryption/decryption works:
```bash
cd backend && python test_security.py
```

## Usage Examples

### Adding an API Key

1. Navigate to the AI Tools page
2. Scroll to the "API Key Management" section
3. Select your AI provider from the dropdown
4. Enter your API key in the password field
5. Click "Save API Key"

### Using User-Specific Keys

Once API keys are configured, the AI service will automatically use the user's keys when available, falling back to environment variables if no user key is configured.

## Security Best Practices

1. **Encryption at Rest**: All API keys are encrypted before storage
2. **Secure Transmission**: Use HTTPS for all API key transactions
3. **Input Validation**: Validate API key formats before storage
4. **Access Control**: Users can only access their own API keys
5. **Audit Logging**: All API key operations are logged for security monitoring

## Troubleshooting

### Common Issues

1. **Encryption Key Not Set**: Ensure `API_KEY_ENCRYPTION_KEY` is set in your environment variables
2. **Database Errors**: Verify the database migration ran successfully
3. **Validation Errors**: Check that API keys match the expected format for each provider

### Provider Key Formats

- **OpenAI**: `sk-` followed by 48 alphanumeric characters (51 characters total)
- **Google AI**: 40 characters with alphanumeric and hyphen characters
- **DeepSeek**: 64 alphanumeric characters
- **Hugging Face**: `hf_` followed by 32 alphanumeric characters (35 characters total)

## Future Enhancements

1. **Actual API Key Validation**: Implement real validation against provider APIs
2. **Key Rotation**: Add support for encryption key rotation
3. **Usage Analytics**: Track API key usage and provide insights
4. **Bulk Operations**: Support for importing/exporting multiple API keys

For any issues or questions, please refer to the backend logs or contact the development team.