import { GoogleGenerativeAI } from '@google/generative-ai';
import { businessKnowledge } from './business-knowledge';
import { testAPIKeys } from './test-api-keys';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey?: string) {
    // Test API key configuration first
    const keyTest = testAPIKeys();

    // Try multiple ways to get the API key
    const key = apiKey ||
               process.env.GEMINI_API_KEY ||
               process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    console.log('🔑 Gemini Service Initialization');
    console.log('API Key available:', !!key);
    console.log('Environment check:', {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasNextPublicGeminiKey: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      providedKey: !!apiKey
    });
    console.log('Key test results:', keyTest);

    if (!key) {
      console.error('Gemini API key not found. Checked:', [
        'apiKey parameter',
        'process.env.GEMINI_API_KEY',
        'process.env.NEXT_PUBLIC_GEMINI_API_KEY'
      ]);
      throw new Error('Gemini API key is required. Please check your .env.local file.');
    }

    try {
      this.genAI = new GoogleGenerativeAI(key);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      console.log('Gemini service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
      throw error;
    }
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>
  ): Promise<{
    message: string;
    leadScore: number;
    intent: string;
    confidence: number;
    shouldAskForLeadInfo: boolean;
  }> {
    try {
      // Build conversation context
      const contextPrompt = this.buildContextPrompt(userMessage, conversationHistory);

      // Create the full prompt
      const prompt = `
${contextPrompt}

USER MESSAGE: ${userMessage}

Please respond as a helpful AI assistant for Robofy, a website building and marketing automation company.
Be conversational, helpful, and focus on understanding the user's business needs.

If the user seems interested in getting a website or marketing services, ask relevant follow-up questions.
If they're asking about pricing, timelines, or specific services, provide helpful information.

Response guidelines:
- Be friendly and professional
- Show expertise in web development and digital marketing
- Ask clarifying questions when needed
- Keep responses concise but informative

Generate a response that:
1. Addresses the user's specific question or concern
2. Provides relevant business knowledge when applicable
3. Moves the conversation forward naturally
4. Identifies if this is a potential lead opportunity

RESPONSE:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Analyze the response for lead scoring
      const analysis = this.analyzeResponseForLeadScoring(text, userMessage);

      return {
        message: text,
        leadScore: analysis.leadScore,
        intent: analysis.intent,
        confidence: analysis.confidence,
        shouldAskForLeadInfo: analysis.shouldAskForLeadInfo
      };

    } catch (error) {
      console.error('Error calling Gemini API:', error);

      // Fallback to rule-based response
      return this.getFallbackResponse(userMessage, conversationHistory);
    }
  }

  private buildContextPrompt(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>
  ): string {
    let context = `You are an AI assistant for Robofy, specializing in website building and marketing automation for businesses in beauty, dental, healthcare, fitness, retail, and solar industries.

BUSINESS CONTEXT:
${businessKnowledge.company.description}

INDUSTRIES WE SERVE:
${Object.entries(businessKnowledge.industries).map(([key, industry]) => `${key}: ${industry.description}`).join('\n')}

OUR SERVICES:
${Object.entries(businessKnowledge.services).map(([key, service]) => `${key}: ${service.description}`).join('\n')}

CONVERSATION HISTORY:
`;

    // Add recent conversation history (last 5 messages)
    const recentHistory = conversationHistory.slice(-5);
    recentHistory.forEach(msg => {
      context += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    });

    return context;
  }

  private analyzeResponseForLeadScoring(response: string, userMessage: string): {
    leadScore: number;
    intent: string;
    confidence: number;
    shouldAskForLeadInfo: boolean;
  } {
    const lowerResponse = response.toLowerCase();
    const lowerMessage = userMessage.toLowerCase();

    let leadScore = 0;
    let intent = 'general_inquiry';
    let confidence = 0.5;

    // Intent analysis
    if (lowerMessage.match(/\b(cost|price|pricing|budget|expensive|cheap|afford|money)\b/)) {
      intent = 'pricing_inquiry';
      confidence = 0.8;
      leadScore += 20;
    } else if (lowerMessage.match(/\b(time|timeline|deadline|when|soon|quick|fast|long)\b/)) {
      intent = 'timeline_inquiry';
      confidence = 0.8;
      leadScore += 15;
    } else if (lowerMessage.match(/\b(website|web|site|online|digital|seo|marketing|leads)\b/)) {
      intent = 'service_inquiry';
      confidence = 0.7;
      leadScore += 10;
    } else if (lowerMessage.match(/\b(help|need|want|looking for|interested in)\b/)) {
      intent = 'assistance_request';
      confidence = 0.7;
      leadScore += 5;
    }

    // Industry mention bonus
    for (const [industryKey, industry] of Object.entries(businessKnowledge.industries)) {
      if (lowerMessage.includes(industryKey)) {
        leadScore += 15;
        break;
      }
    }

    // Specificity bonus
    if (lowerMessage.match(/\b(specific|exactly|particularly|need|want|looking for|requirements)\b/)) {
      leadScore += 10;
    }

    // Contact info or business details
    if (lowerMessage.match(/\b(company|business|organization|firm|agency|email|phone|contact)\b/)) {
      leadScore += 10;
    }

    // Response-based scoring
    if (lowerResponse.includes('tell me more') || lowerResponse.includes('can you share')) {
      leadScore += 5;
    }

    if (lowerResponse.includes('budget') || lowerResponse.includes('timeline') || lowerResponse.includes('requirements')) {
      // We're asking qualifying questions
      leadScore += 10;
    }

    // Cap at 100
    leadScore = Math.min(leadScore, 100);

    // Determine if we should ask for lead info
    const shouldAskForLeadInfo = leadScore >= 60 && !lowerMessage.match(/\b(email|phone|contact|name)\b/);

    return {
      leadScore,
      intent,
      confidence,
      shouldAskForLeadInfo
    };
  }

  private getFallbackResponse(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>
  ): {
    message: string;
    leadScore: number;
    intent: string;
    confidence: number;
    shouldAskForLeadInfo: boolean;
  } {
    // Simple rule-based fallback responses
    const lowerMessage = userMessage.toLowerCase();

    let response = "I'd be happy to help you with your website and marketing needs! ";

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = "Hello! I'm here to help you learn about Robofy's AI-powered website building and marketing automation services. What specific industry are you in, or what questions do you have?";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      response = "Our pricing depends on your specific needs and business goals. We offer packages from $2,000 for basic websites to $15,000 for comprehensive marketing automation. Most importantly, we focus on ROI - our websites typically pay for themselves within 3-6 months through increased leads and sales.";
    } else if (lowerMessage.includes('time') || lowerMessage.includes('timeline')) {
      response = "Most websites are completed within 2-4 weeks! We use AI-powered tools that accelerate development while maintaining high quality. The exact timeline depends on project complexity and content requirements.";
    } else {
      response += "We specialize in creating high-converting websites for businesses in beauty, dental, healthcare, fitness, retail, and solar industries. What specific questions do you have?";
    }

    return {
      message: response,
      leadScore: 0,
      intent: 'general_inquiry',
      confidence: 0.3,
      shouldAskForLeadInfo: false
    };
  }

  async generateBusinessInsight(userQuery: string, industry?: string): Promise<string> {
    try {
      const industryContext = industry && businessKnowledge.industries[industry]
        ? `Focusing on ${industry} industry: ${businessKnowledge.industries[industry].description}`
        : 'General business context';

      const prompt = `
${industryContext}

USER QUERY: ${userQuery}

Provide a helpful, insightful response based on business and industry knowledge.
Keep the response professional, actionable, and relevant to Robofy's services.

RESPONSE:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Error generating business insight:', error);
      return "I can help you with insights about website building and digital marketing. Could you provide more specific details about what you're looking for?";
    }
  }
}

export default GeminiService;