import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    // Prepare headers for backend request
    const backendHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Include authorization header if present
    if (authHeader) {
      backendHeaders['Authorization'] = authHeader;
    }
    
    // Forward the request to the Python backend SEO endpoint
    const response = await fetch('http://127.0.0.1:8000/api/seo/rank-tracking', {
      method: 'POST',
      headers: backendHeaders,
      body: JSON.stringify(body),
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
    console.error('Error in SEO rank tracking:', error);
    return NextResponse.json(
      { error: 'Failed to perform rank tracking', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}