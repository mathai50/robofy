import { NextRequest, NextResponse } from 'next/server';

function extractDomain(text: string): string | null {
  // Simple URL extraction that requires full http/https URLs
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  if (urlMatch) {
    try {
      const url = new URL(urlMatch[0]);
      return url.hostname; // Returns domain without protocol
    } catch {
      return null;
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    // Handle both message-based and direct domain-based requests
    let domain: string | null = null;
    
    if (body.message) {
      // Extract domain from message for chat interface
      const message = body.message || '';
      domain = extractDomain(message);
    } else if (body.domain) {
      // Direct domain request from ModernChatDashboard
      domain = body.domain;
    }
    
    if (!domain) {
      return NextResponse.json(
        { error: 'Please provide a valid website URL starting with http:// or https://' },
        { status: 400 }
      );
    }

    // Prepare backend request body
    const backendBody = {
      domain: domain,
      competitors: body.competitors || [] // Include competitors if provided
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
    const response = await fetch('http://127.0.0.1:8000/api/seo/competitor-analysis', {
      method: 'POST',
      headers: backendHeaders,
      body: JSON.stringify(backendBody),
    });

    if (!response.ok) {
      // Try to parse the backend error response as JSON
      let errorData;
      try {
        const errorText = await response.text();
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: 'Backend error' };
      }
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in SEO competitor analysis:', error);
    return NextResponse.json(
      { error: 'Failed to perform competitor analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}