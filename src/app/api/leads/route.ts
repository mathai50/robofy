import { NextRequest, NextResponse } from 'next/server';

interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  message?: string;
  subject?: string;
  businessSize?: string;
  budget?: string;
  timeline?: string;
  leadSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  gdprConsent?: boolean;
}

// In a real application, you would save this to a database
// For now, we'll simulate saving and send to a CRM or email service
async function saveLeadToDatabase(leadData: LeadData): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    // Simulate database save
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Here you would typically:
    // 1. Save to your database (PostgreSQL, MongoDB, etc.)
    // 2. Send to CRM system (HubSpot, Salesforce, etc.)
    // 3. Send confirmation email
    // 4. Trigger internal notifications

    console.log('Lead saved:', { ...leadData, id: leadId });

    return { success: true, leadId };
  } catch (error) {
    console.error('Error saving lead:', error);
    return { success: false, error: 'Failed to save lead to database' };
  }
}

async function sendConfirmationEmail(leadData: LeadData): Promise<boolean> {
  try {
    // Here you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Nodemailer with SMTP

    console.log('Confirmation email would be sent to:', leadData.email);

    // Simulate email sending
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, gdprConsent } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check GDPR consent for EU compliance
    if (!gdprConsent) {
      return NextResponse.json(
        { error: 'GDPR consent is required to process your information' },
        { status: 400 }
      );
    }

    // Extract UTM parameters if present
    const url = new URL(request.url);
    const utmSource = url.searchParams.get('utm_source') || body.utmSource;
    const utmMedium = url.searchParams.get('utm_medium') || body.utmMedium;
    const utmCampaign = url.searchParams.get('utm_campaign') || body.utmCampaign;

    // Enhanced lead data with tracking
    const leadData: LeadData = {
      ...body,
      leadSource: body.leadSource || 'website',
      utmSource,
      utmMedium,
      utmCampaign,
      submittedAt: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') ||
                 request.headers.get('x-real-ip') ||
                 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Save lead to database
    const saveResult = await saveLeadToDatabase(leadData);

    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error || 'Failed to save lead' },
        { status: 500 }
      );
    }

    // Send confirmation email (don't fail the request if email fails)
    const emailSent = await sendConfirmationEmail(leadData);

    // Send webhook notification
    try {
      const webhookPayload = {
        event: 'lead_generated',
        leadData: leadData,
        source: 'api_route',
        timestamp: new Date().toISOString(),
        combinedMessage: leadData.message // Message already combined in form submission
      };

      console.log('Sending webhook to:', 'https://ai.robofy.uk/webhook-test/a80eccd4-eb3f-418c-9a0c-bebdc40cbf46');
      console.log('Webhook payload:', JSON.stringify(webhookPayload, null, 2));

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const webhookResponse = await fetch('https://ai.robofy.uk/webhook-test/a80eccd4-eb3f-418c-9a0c-bebdc40cbf46', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Robofy-Webhook/1.0'
        },
        body: JSON.stringify(webhookPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Webhook response status:', webhookResponse.status);
      console.log('Webhook response headers:', Object.fromEntries(webhookResponse.headers.entries()));

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('Webhook failed with status:', webhookResponse.status, 'Response:', errorText);
        throw new Error(`Webhook failed: ${webhookResponse.status} ${errorText}`);
      }

      const responseText = await webhookResponse.text();
      console.log('Webhook response body:', responseText);

    } catch (webhookError) {
      // Log webhook error but don't fail the request
      console.error('🚨 Webhook notification failed:', webhookError);
      console.error('🔍 Webhook error details:', {
        message: webhookError instanceof Error ? webhookError.message : 'Unknown error',
        stack: webhookError instanceof Error ? webhookError.stack : 'No stack trace',
        leadData: {
          name: leadData.name,
          email: leadData.email,
          company: leadData.company,
          hasMessage: !!leadData.message
        }
      });

      // Handle specific error types
      if (webhookError instanceof Error) {
        if (webhookError.name === 'AbortError') {
          console.error('⏰ Webhook request timed out after 10 seconds');
        } else if (webhookError.message.includes('ECONNREFUSED')) {
          console.error('🚫 Webhook endpoint refused connection - check if endpoint is running');
        } else if (webhookError.message.includes('ENOTFOUND')) {
          console.error('🌐 Webhook endpoint not found - check URL');
        } else if (webhookError.message.includes('network')) {
          console.error('📡 Network error - check internet connection');
        }
      }
    }

    // Return success response with lead ID for tracking
    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! We\'ll be in touch within 24 hours.',
      leadId: saveResult.leadId,
      emailConfirmed: emailSent,
    });

  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}