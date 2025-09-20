# Google Calendar & Gmail API Setup Guide

This guide will help you set up the Google Calendar and Gmail API integration for the appointment booking system.

## Prerequisites

1. A Google account with access to Google Cloud Console
2. Python 3.8+ installed
3. The required dependencies installed:
   ```bash
   pip install -r requirements.txt
   ```

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Robofy Appointment System")
4. Click "Create"

## Step 2: Enable the Required APIs

1. In your Google Cloud project, go to "APIs & Services" → "Library"
2. Search for and enable the following APIs:
   - **Google Calendar API**
   - **Gmail API**

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type and click "Create"
3. Fill in the required app information:
   - App name: "Robofy Appointment System"
   - User support email: Your email address
   - Developer contact information: Your email address
4. Add the following scopes:
   - `.../auth/calendar` (Google Calendar API)
   - `.../auth/gmail.send` (Gmail API)
5. Add test users (your email address) if needed
6. Save and continue through the remaining steps

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Choose "Web application" as the application type
4. Name: "Robofy Backend"
5. Add authorized redirect URIs:
   - `http://localhost:8000` (for development)
   - `http://localhost:8000/oauth2callback` (for the OAuth flow)
6. Click "Create"
7. Download the credentials JSON file

## Step 5: Configure the Backend

1. Rename the downloaded credentials file to `credentials.json`
2. Place it in the `backend/` directory
3. The appointment booking agent will automatically:
   - Create a `token.json` file on first run
   - Handle OAuth authentication
   - Refresh tokens as needed

## Step 6: First-Time Authentication

When you run the backend for the first time after setting up the Google APIs:

1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```

2. The system will detect that no `token.json` exists and will:
   - Open a browser window for OAuth authentication
   - Ask you to log in with your Google account
   - Request permissions for Calendar and Gmail access

3. After successful authentication, a `token.json` file will be created
4. The system will now be able to:
   - Check calendar availability
   - Create appointments in Google Calendar
   - Send confirmation emails via Gmail

## Step 7: Testing the Integration

Test the appointment booking functionality:

1. Make a POST request to the voice tools endpoint:
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your_voice_tools_api_key" \
     -d '{"date":"2025-09-19"}' \
     http://localhost:8000/api/voice-tools/get_availability
   ```

2. Test appointment creation:
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your_voice_tools_api_key" \
     -d '{"start_timestamp":"2025-09-19T10:00:00Z","patient_name":"John Doe"}' \
     http://localhost:8000/api/voice-tools/create_appointment
   ```

## Environment Variables

Make sure to set the following environment variables:

```bash
# In your .env file
VOICE_TOOLS_API_KEY=your_secure_api_key_here
```

## Troubleshooting

### Common Issues

1. **"credentials.json not found"**
   - Ensure the file is in the `backend/` directory
   - Check that the filename is exactly `credentials.json`

2. **OAuth authentication fails**
   - Verify your redirect URIs in Google Cloud Console
   - Check that you're using the correct OAuth client ID

3. **API quota limits**
   - Google APIs have daily quotas
   - Monitor usage in Google Cloud Console

4. **Token refresh issues**
   - Delete `token.json` and restart to re-authenticate
   - Check that the OAuth scopes are correctly configured

### Fallback Mode

If the Google APIs are not configured, the system will:
- Use simulated availability checking
- Store appointments in memory (not persistent)
- Log patient details without sending emails

## Security Notes

- Keep your `credentials.json` and `token.json` files secure
- Never commit these files to version control
- Use strong API keys for the voice tools endpoint
- Regularly rotate your API keys and OAuth tokens

## Production Deployment

For production deployment:

1. Update authorized redirect URIs in Google Cloud Console
2. Use environment-specific credentials
3. Implement proper token storage and rotation
4. Set up monitoring for API usage and errors
5. Configure proper logging and alerting

## Support

If you encounter issues:
1. Check the backend logs for detailed error messages
2. Verify your Google Cloud project configuration
3. Ensure all required APIs are enabled
4. Confirm that the OAuth consent screen is properly configured