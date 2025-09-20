import { NextRequest, NextResponse } from 'next/server';

function extractTopic(text: string): string {
  // For keyword research, use the entire message as the topic
  // Remove URLs if present and use the remaining text
  const cleanedText = text.replace(/https?:\/\/[^\s]+/g, '').trim();
  return cleanedText || 'digital marketing'; // Default topic if message is empty
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    // Extract topic from message for keyword research
    const message = body.message || '';
    const topic = extractTopic(message);
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Please provide a topic for keyword research' },
        { status: 400 }
      );
    }

    // Prepare backend request body
    const backendBody = {
      topic: topic,
      industry: '' // Optional: can be enhanced to extract industry from message
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
    const response = await fetch('http://127.0.0.1:8000/api/seo/keyword-research', {
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
    console.error('Error in SEO keyword research:', error);
    return NextResponse.json(
      { error: 'Failed to perform keyword research', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}