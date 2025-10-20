import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/services/aiService';
import conversationStore from '@/lib/conversation-store';
import { createLead } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, leadInfo } = body;

    // Validate required fields
    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    // Get or create conversation session
    let session = conversationStore.getSession(sessionId);
    if (!session) {
      // If session doesn't exist, create a new one
      session = conversationStore.createSession();
    }

    // Generate AI response
    const aiResponse = await aiService.generateResponse(message, session.context);

    // Update session with new context
    conversationStore.updateSession(sessionId, aiResponse);

    // Check if we should create a lead
    if (leadInfo && leadInfo.email) {
      try {
        const leadData = {
          name: leadInfo.name || 'AI Chat Lead',
          email: leadInfo.email,
          company: leadInfo.company,
          phone: leadInfo.phone,
          industry: session.context.industry,
          message: `AI Chat Lead - Score: ${aiResponse.leadScore}. ${aiResponse.conversationContext.extractedInfo.goals?.join(', ') || 'Interested in services'}`,
          leadSource: 'ai_chat_widget',
          leadScore: aiResponse.leadScore,
          gdprConsent: true // Assume consent given through chat interaction
        };

        const leadResponse = await createLead(leadData);
        if (leadResponse.success) {
          conversationStore.markLeadCreated(sessionId, leadResponse.data?.leadId || '');
        }
      } catch (error) {
        console.error('Error creating lead from chat:', error);
      }
    }

    // Check for automatic lead creation based on high lead score
    if (aiResponse.leadScore >= 75 && !session.leadCreated) {
      try {
        const qualification = await aiService.qualifyLead(aiResponse.conversationContext);

        if (qualification.shouldCreateLead && qualification.leadData) {
          const leadResponse = await createLead(qualification.leadData);
          if (leadResponse.success) {
            conversationStore.markLeadCreated(sessionId, leadResponse.data?.leadId || '');

            // Add lead creation confirmation to response
            aiResponse.message += " I've also captured your information and created a lead for you. Our team will be in touch within 24 hours with personalized recommendations.";
          }
        }
      } catch (error) {
        console.error('Error auto-creating lead:', error);
      }
    }

    return NextResponse.json({
      message: aiResponse.message,
      leadScore: aiResponse.leadScore,
      intent: aiResponse.intent,
      confidence: aiResponse.confidence,
      shouldAskForLeadInfo: aiResponse.shouldAskForLeadInfo,
      suggestedQuestions: aiResponse.suggestedQuestions,
      sessionId: sessionId,
      leadCreated: session.leadCreated
    });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get conversation session info
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId parameter is required' },
        { status: 400 }
      );
    }

    const session = conversationStore.getSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sessionId: session.sessionId,
      leadScore: session.context.leadScore,
      industry: session.context.industry,
      messageCount: session.context.conversationHistory.length,
      leadCreated: session.leadCreated,
      extractedInfo: session.context.extractedInfo
    });

  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new conversation session
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    const session = conversationStore.createSession(userId);

    return NextResponse.json({
      sessionId: session.sessionId,
      message: "New conversation session created successfully"
    });

  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get conversation analytics
export async function PATCH(request: NextRequest) {
  try {
    const stats = conversationStore.getStats();

    return NextResponse.json({
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}