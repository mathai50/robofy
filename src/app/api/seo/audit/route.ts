import { NextRequest, NextResponse } from 'next/server';

function extractUrl(text: string): string | null {
  // Simple URL extraction that requires full http/https URLs
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  return urlMatch ? urlMatch[0] : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    // Handle both message-based and direct URL requests
    let url: string | null = null;
    
    if (body.message) {
      // Extract URL from message for chat interface
      const message = body.message || '';
      url = extractUrl(message);
    } else if (body.url) {
      // Direct URL request from ModernChatDashboard
      url = body.url;
    }
    
    if (!url) {
      return NextResponse.json(
        { error: 'Please provide a valid website URL starting with http:// or https://' },
        { status: 400 }
      );
    }

    // Prepare backend request body
    const backendBody = {
      url: url
    };
    
    // Prepare headers for backend request
    const backendHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Include authorization header if present
    if (authHeader) {
      backendHeaders['Authorization'] = authHeader;
    }
    
    // Forward the request to the Python backend SEO endpoint
    const response = await fetch('http://127.0.0.1:8000/api/seo/audit', {
      method: 'POST',
      headers: backendHeaders,
      body: JSON.stringify(backendBody),
    });

    if (!response.ok) {
      // Return the backend response directly to preserve status code and error message
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Backend error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in SEO audit:', error);
    return NextResponse.json(
      { error: 'Failed to perform SEO audit', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}