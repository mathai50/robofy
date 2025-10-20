import { businessKnowledge } from '@/lib/business-knowledge';
import GeminiService from '@/lib/geminiService';

export interface VoiceMessageData {
  audioUrl?: string;
  duration?: number;
  transcript?: string;
  isVoiceMessage: boolean;
  confidence?: number;
}

export interface ConversationContext {
  sessionId: string;
  userId?: string;
  industry?: string;
  businessSize?: string;
  currentIntent?: 'information' | 'pricing' | 'consultation' | 'lead_qualification' | 'voice_inquiry';
  leadScore: number;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    intent?: string;
    entities?: string[];
    voiceData?: VoiceMessageData;
  }>;
  extractedInfo: {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    budget?: string;
    timeline?: string;
    painPoints?: string[];
    goals?: string[];
    voicePreference?: boolean;
    preferredVoiceId?: string;
  };
}

export interface AIResponse {
  message: string;
  leadScore: number;
  intent: string;
  confidence: number;
  shouldAskForLeadInfo: boolean;
  suggestedQuestions?: string[];
  entities?: string[];
  conversationContext: ConversationContext;
}

export interface LeadScoreFactors {
  engagement: number; // How long and actively engaged
  specificity: number; // How specific their questions/needs are
  budgetMentioned: number; // Have they mentioned budget
  timelineMentioned: number; // Have they mentioned timeline
  painPointsExpressed: number; // Have they shared challenges
  industryIdentified: number; // Have they specified their industry
  companyInfoShared: number; // Have they shared company details
}

class AIService {
  private geminiService: GeminiService;

  constructor() {
    try {
      this.geminiService = new GeminiService();
      console.log('AI Service initialized successfully with Gemini');
    } catch (error) {
      console.error('Failed to initialize AI services:', error);
      console.log('Continuing with fallback rule-based responses');
      // For now, we'll throw the error but this could be made optional
      throw error;
    }
  }

  async generateResponse(
    userMessage: string,
    context: ConversationContext,
    voiceMessageData?: VoiceMessageData
  ): Promise<AIResponse> {
    try {
      // Use Gemini AI to generate response
      const geminiResponse = await this.geminiService.generateResponse(
        userMessage,
        context.conversationHistory
      );

      // Extract entities from user message
      const entities = this.extractEntities(userMessage);

      // Handle voice-aware conversation flow
      const voiceAnalysis = this.detectVoiceIntent(userMessage, voiceMessageData);
      const voiceFlow = this.handleVoiceConversationFlow(userMessage, context, voiceMessageData);

      // Use voice-optimized response if voice features are enabled
      const finalResponse = voiceFlow.shouldPlayAudio && context.extractedInfo.voicePreference !== false
        ? voiceFlow.response
        : geminiResponse.message;

      // Update conversation context
      const updatedContext = this.updateConversationContext(
        context,
        userMessage,
        finalResponse,
        {
          intent: voiceAnalysis.intent,
          confidence: voiceAnalysis.confidence,
          entities,
          sentiment: 'neutral'
        }
      );

      return {
        message: finalResponse,
        leadScore: geminiResponse.leadScore,
        intent: voiceAnalysis.intent,
        confidence: voiceAnalysis.confidence,
        shouldAskForLeadInfo: geminiResponse.shouldAskForLeadInfo,
        suggestedQuestions: voiceFlow.followUpQuestions || this.generateSuggestedQuestions(voiceAnalysis.intent, context),
        entities,
        conversationContext: updatedContext
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getFallbackResponse(context);
    }
  }

  private analyzeMessageInternal(message: string): {
    intent: string;
    confidence: number;
    entities: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
  } {
    const lowerMessage = message.toLowerCase();

    // Simple rule-based intent analysis (synchronous version)
    let intent = 'general_inquiry';
    let confidence = 0.5;

    // Intent detection based on keywords and context
    if (lowerMessage.match(/\b(cost|price|pricing|budget|expensive|cheap|afford)\b/)) {
      intent = 'pricing_inquiry';
      confidence = 0.8;
    } else if (lowerMessage.match(/\b(time|timeline|deadline|when|soon|quick|fast)\b/)) {
      intent = 'timeline_inquiry';
      confidence = 0.8;
    } else if (lowerMessage.match(/\b(website|web|site|online|digital|seo|marketing)\b/)) {
      intent = 'service_inquiry';
      confidence = 0.7;
    } else if (lowerMessage.match(/\b(lead|customer|sale|grow|increase|more)\b/)) {
      intent = 'lead_generation';
      confidence = 0.7;
    } else if (lowerMessage.match(/\b(industry|business|company|type|field|sector)\b/)) {
      intent = 'industry_inquiry';
      confidence = 0.6;
    }

    // Entity extraction
    const entities = this.extractEntities(message);

    // Simple sentiment analysis
    const positiveWords = ['great', 'excellent', 'amazing', 'perfect', 'love', 'awesome', 'fantastic'];
    const negativeWords = ['terrible', 'awful', 'bad', 'horrible', 'hate', 'worst', 'disappointed'];

    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) negativeCount++;
    });

    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    return { intent, confidence, entities, sentiment };
  }

  private async analyzeMessage(
    message: string,
    context: ConversationContext
  ): Promise<{
    intent: string;
    confidence: number;
    entities: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
  }> {
    const lowerMessage = message.toLowerCase();

    // Simple rule-based intent analysis (can be enhanced with AI)
    let intent = 'general_inquiry';
    let confidence = 0.5;

    // Intent detection based on keywords and context
    if (lowerMessage.match(/\b(cost|price|pricing|budget|expensive|cheap|afford)\b/)) {
      intent = 'pricing_inquiry';
      confidence = 0.8;
    } else if (lowerMessage.match(/\b(time|timeline|deadline|when|soon|quick|fast)\b/)) {
      intent = 'timeline_inquiry';
      confidence = 0.8;
    } else if (lowerMessage.match(/\b(website|web|site|online|digital|seo|marketing)\b/)) {
      intent = 'service_inquiry';
      confidence = 0.7;
    } else if (lowerMessage.match(/\b(lead|customer|sale|grow|increase|more)\b/)) {
      intent = 'lead_generation';
      confidence = 0.7;
    } else if (lowerMessage.match(/\b(industry|business|company|type|field|sector)\b/)) {
      intent = 'industry_inquiry';
      confidence = 0.6;
    }

    // Entity extraction
    const entities = this.extractEntities(message);

    // Simple sentiment analysis
    const positiveWords = ['great', 'excellent', 'amazing', 'perfect', 'love', 'awesome', 'fantastic'];
    const negativeWords = ['terrible', 'awful', 'bad', 'horrible', 'hate', 'worst', 'disappointed'];

    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) negativeCount++;
    });

    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    return { intent, confidence, entities, sentiment };
  }

  private extractEntities(message: string): string[] {
    const entities: string[] = [];
    const lowerMessage = message.toLowerCase();

    // Extract industries
    Object.keys(businessKnowledge.industries).forEach(industry => {
      if (lowerMessage.includes(industry)) {
        entities.push(`industry:${industry}`);
      }
    });

    // Extract services
    Object.keys(businessKnowledge.services).forEach(service => {
      if (lowerMessage.includes(service.replace('-', ' ')) || lowerMessage.includes(service)) {
        entities.push(`service:${service}`);
      }
    });

    // Extract contact information patterns
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /(\+\d{1,3}[- ]?)?\d{10}/;

    const emailMatch = message.match(emailRegex);
    if (emailMatch) entities.push(`email:${emailMatch[0]}`);

    const phoneMatch = message.match(phoneRegex);
    if (phoneMatch) entities.push(`phone:${phoneMatch[0]}`);

    return entities;
  }

  private generateBusinessResponse(
    message: string,
    context: ConversationContext,
    analysis: any
  ): string {
    // Use business knowledge to generate contextual responses
    const lowerMessage = message.toLowerCase();

    // Check for matching conversation templates
    for (const template of businessKnowledge.conversationTemplates) {
      for (const trigger of template.trigger) {
        if (lowerMessage.includes(trigger)) {
          return template.response;
        }
      }
    }

    // Generate industry-specific response
    if (context.industry && businessKnowledge.industries[context.industry]) {
      const industryKnowledge = businessKnowledge.industries[context.industry];

      if (lowerMessage.includes('challenge') || lowerMessage.includes('problem')) {
        return `I understand the challenges in the ${context.industry} industry. Common issues include: ${industryKnowledge.challenges.slice(0, 2).join(', ')}. We help solve these with ${industryKnowledge.solutions[0]}. Would you like to hear more about how we've helped similar businesses?`;
      }
    }

    // Generate service-specific response
    for (const [serviceKey, service] of Object.entries(businessKnowledge.services)) {
      if (lowerMessage.includes(serviceKey.replace('-', ' '))) {
        return `${service.description} Key benefits include: ${service.benefits.slice(0, 2).join(', ')}. ${service.features[0]} is particularly effective for your needs.`;
      }
    }

    // Default responses based on intent
    switch (analysis.intent) {
      case 'pricing_inquiry':
        return "Our pricing is tailored to your specific needs and business goals. We offer packages from $2,000 for basic websites to $15,000 for comprehensive marketing automation. Most importantly, we focus on ROI - our clients typically see their investment returned within 3-6 months through increased leads and sales.";
      case 'timeline_inquiry':
        return "Most projects are completed within 2-4 weeks! We use AI-powered development tools that speed up the process while maintaining high quality. The exact timeline depends on project complexity and content requirements.";
      case 'service_inquiry':
        return "We offer AI-powered website building, SEO optimization, content marketing, and lead generation services. Our platform creates professional websites that actually convert visitors into customers, with built-in marketing automation.";
      default:
        return "I'd be happy to help you with your website and marketing needs! We specialize in creating high-converting websites for businesses in beauty, dental, healthcare, fitness, retail, and solar industries. What specific questions do you have?";
    }
  }

  private updateConversationContext(
    context: ConversationContext,
    userMessage: string,
    response: string,
    analysis: any
  ): ConversationContext {
    const newHistory = [
      ...context.conversationHistory,
      {
        role: 'user' as const,
        content: userMessage,
        timestamp: new Date(),
        intent: analysis.intent,
        entities: analysis.entities
      },
      {
        role: 'assistant' as const,
        content: response,
        timestamp: new Date()
      }
    ];

    // Extract and update lead information
    const extractedInfo = { ...context.extractedInfo };
    analysis.entities.forEach((entity: string) => {
      if (entity.startsWith('email:')) {
        extractedInfo.email = entity.replace('email:', '');
      } else if (entity.startsWith('phone:')) {
        extractedInfo.phone = entity.replace('phone:', '');
      } else if (entity.startsWith('industry:')) {
        const industry = entity.replace('industry:', '');
        if (businessKnowledge.industries[industry]) {
          context.industry = industry;
        }
      }
    });

    return {
      ...context,
      conversationHistory: newHistory,
      extractedInfo,
      leadScore: this.calculateLeadScore({ ...context, conversationHistory: newHistory, extractedInfo })
    };
  }

  private calculateLeadScore(context: ConversationContext): number {
    const factors: LeadScoreFactors = {
      engagement: Math.min(context.conversationHistory.length * 5, 25),
      specificity: 0,
      budgetMentioned: 0,
      timelineMentioned: 0,
      painPointsExpressed: 0,
      industryIdentified: context.industry ? 15 : 0,
      companyInfoShared: 0
    };

    // Analyze conversation for specificity and intent
    const recentMessages = context.conversationHistory.slice(-4);
    recentMessages.forEach(msg => {
      if (msg.role === 'user') {
        const lowerContent = msg.content.toLowerCase();

        if (lowerContent.match(/\b(specific|exactly|particularly|need|want|looking for)\b/)) {
          factors.specificity += 5;
        }

        if (lowerContent.match(/\b(budget|cost|price|pricing|expensive|afford)\b/)) {
          factors.budgetMentioned = 20;
        }

        if (lowerContent.match(/\b(timeline|deadline|when|soon|urgent|asap)\b/)) {
          factors.timelineMentioned = 15;
        }

        if (lowerContent.match(/\b(problem|issue|challenge|struggle|difficult|frustrated)\b/)) {
          factors.painPointsExpressed += 10;
        }

        if (lowerContent.match(/\b(company|business|organization|firm|agency)\b/) && context.extractedInfo.company) {
          factors.companyInfoShared = 10;
        }
      }
    });

    // Cap specificity at 20
    factors.specificity = Math.min(factors.specificity, 20);

    // Calculate total score
    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);

    // Normalize to 0-100 scale
    return Math.min(Math.round(totalScore), 100);
  }

  private shouldAskForLeadInfo(context: ConversationContext, analysis: any): boolean {
    // Ask for lead info if:
    // 1. Lead score is above 60
    // 2. User has shown clear buying intent
    // 3. We don't have enough contact information
    // 4. Conversation has been going for a while (at least 3 exchanges)

    const hasContactInfo = context.extractedInfo.email || context.extractedInfo.phone;
    const hasBuyingIntent = ['pricing_inquiry', 'timeline_inquiry', 'lead_generation'].includes(analysis.intent);
    const conversationLength = context.conversationHistory.length;

    return context.leadScore >= 60 &&
           (hasBuyingIntent || conversationLength >= 6) &&
           !hasContactInfo;
  }

  private generateSuggestedQuestions(intent: string, context: ConversationContext): string[] {
    const baseQuestions = [
      "What type of business do you have?",
      "What are your main goals for a new website?",
      "What's your budget range for this project?",
      "When would you like to get started?"
    ];

    // Context-specific questions
    if (context.industry) {
      const industry = context.industry;
      if (businessKnowledge.industries[industry]) {
        return [
          `What specific challenges are you facing in the ${industry} industry?`,
          "How many customers do you currently serve?",
          "What would success look like for your website project?"
        ];
      }
    }

    switch (intent) {
      case 'pricing_inquiry':
        return [
          "What's your budget range for this project?",
          "What features are most important to you?",
          "Are you looking for ongoing marketing support?"
        ];
      case 'timeline_inquiry':
        return [
          "What's your ideal launch timeline?",
          "Do you have content ready, or do you need help creating it?",
          "Are there any specific deadlines I should know about?"
        ];
      default:
        return baseQuestions;
    }
  }

  private getFallbackResponse(context: ConversationContext): AIResponse {
    return {
      message: "I'm here to help you with your website and marketing needs! Could you tell me more about what you're looking for?",
      leadScore: context.leadScore,
      intent: 'general_inquiry',
      confidence: 0.5,
      shouldAskForLeadInfo: false,
      conversationContext: context
    };
  }

  // Voice-aware conversation methods
  detectVoiceIntent(userMessage: string, voiceData?: VoiceMessageData): {
    intent: string;
    confidence: number;
    isVoiceSpecific: boolean;
    suggestedVoiceTone?: string;
  } {
    const lowerMessage = userMessage.toLowerCase();

    // Voice-specific intents
    if (lowerMessage.match(/\b(voice|audio|sound|speak|talk|listen|hear)\b/)) {
      return {
        intent: 'voice_inquiry',
        confidence: 0.9,
        isVoiceSpecific: true,
        suggestedVoiceTone: 'conversational'
      };
    }

    if (lowerMessage.match(/\b(speak louder|speak softer|change voice|faster|slower)\b/)) {
      return {
        intent: 'voice_settings',
        confidence: 0.9,
        isVoiceSpecific: true,
        suggestedVoiceTone: 'technical'
      };
    }

    if (lowerMessage.match(/\b(repeat|say again|what was that|pardon|excuse me)\b/)) {
      return {
        intent: 'repeat_request',
        confidence: 0.8,
        isVoiceSpecific: true,
        suggestedVoiceTone: 'patient'
      };
    }

    // Analyze sentiment from voice data if available
    if (voiceData && voiceData.confidence !== undefined) {
      if (voiceData.confidence < 0.5) {
        return {
          intent: 'clarification_needed',
          confidence: 0.7,
          isVoiceSpecific: true,
          suggestedVoiceTone: 'clear'
        };
      }
    }

    // Regular intent analysis using synchronous rule-based approach
    const regularAnalysis = this.analyzeMessageInternal(userMessage);

    return {
      intent: regularAnalysis.intent,
      confidence: regularAnalysis.confidence,
      isVoiceSpecific: false,
      suggestedVoiceTone: this.getSuggestedVoiceTone(regularAnalysis.intent)
    };
  }

  private getSuggestedVoiceTone(intent: string): string {
    switch (intent) {
      case 'pricing_inquiry':
        return 'professional';
      case 'timeline_inquiry':
        return 'enthusiastic';
      case 'service_inquiry':
        return 'knowledgeable';
      case 'lead_generation':
        return 'persuasive';
      case 'voice_inquiry':
        return 'conversational';
      default:
        return 'friendly';
    }
  }

  generateVoiceOptimizedResponse(
    message: string,
    intent: string,
    voiceTone: string,
    context: ConversationContext
  ): string {
    let optimizedMessage = message;

    // Add voice-friendly elements based on tone
    switch (voiceTone) {
      case 'professional':
        optimizedMessage = this.addProfessionalVoiceElements(optimizedMessage);
        break;
      case 'enthusiastic':
        optimizedMessage = this.addEnthusiasticVoiceElements(optimizedMessage);
        break;
      case 'conversational':
        optimizedMessage = this.addConversationalVoiceElements(optimizedMessage);
        break;
      case 'patient':
        optimizedMessage = this.addPatientVoiceElements(optimizedMessage);
        break;
      case 'clear':
        optimizedMessage = this.addClearVoiceElements(optimizedMessage);
        break;
    }

    // Add contextual voice elements
    if (context.industry) {
      optimizedMessage = this.addIndustrySpecificVoiceElements(optimizedMessage, context.industry);
    }

    return optimizedMessage;
  }

  private addProfessionalVoiceElements(message: string): string {
    // Add pauses for emphasis on key business points
    return message
      .replace(/(\$\d+[k,m]?)/g, '$1 <break time="200ms" />')
      .replace(/(\d+\s*weeks?)/g, '$1 <break time="150ms" />');
  }

  private addEnthusiasticVoiceElements(message: string): string {
    // Add enthusiasm markers for positive outcomes
    return message
      .replace(/\b(great|excellent|perfect|amazing)\b/g, '$1 <emphasis level="moderate" />')
      .replace(/(!)/g, '! <break time="100ms" />');
  }

  private addConversationalVoiceElements(message: string): string {
    // Make it more conversational and natural
    return message
      .replace(/^(Hi|Hello)/, '$1 there')
      .replace(/(\?)/g, '? <break time="300ms" />');
  }

  private addPatientVoiceElements(message: string): string {
    // Add pauses for clarity and patience
    return message
      .replace(/(\.)/g, '. <break time="200ms" />')
      .replace(/(\,)/g, ', <break time="100ms" />');
  }

  private addClearVoiceElements(message: string): string {
    // Optimize for clarity and understanding
    return message
      .replace(/(\b[A-Z]{2,}\b)/g, '<emphasis level="moderate">$1</emphasis>')
      .replace(/(\d+)/g, '<prosody rate="90%">$1</prosody>');
  }

  private addIndustrySpecificVoiceElements(message: string, industry: string): string {
    // Add industry-specific voice styling
    const industryVoiceStyles: Record<string, string> = {
      beauty: '<prosody pitch="+5%" rate="95%">',
      dental: '<prosody pitch="0%" rate="90%">',
      healthcare: '<prosody pitch="-5%" rate="85%">',
      fitness: '<prosody pitch="+10%" rate="100%">',
      solar: '<prosody pitch="0%" rate="95%">'
    };

    const style = industryVoiceStyles[industry] || '';
    return style ? style + message + (style ? '</prosody>' : '') : message;
  }

  // Voice conversation flow management
  handleVoiceConversationFlow(
    userMessage: string,
    context: ConversationContext,
    voiceData?: VoiceMessageData
  ): {
    response: string;
    shouldPlayAudio: boolean;
    voiceSettings?: any;
    followUpQuestions?: string[];
  } {
    const voiceIntent = this.detectVoiceIntent(userMessage, voiceData);

    if (voiceIntent.isVoiceSpecific) {
      return this.handleVoiceSpecificIntent(userMessage, voiceIntent, context);
    }

    // Regular conversation but voice-optimized
    const baseResponse = this.generateBusinessResponse(userMessage, context, voiceIntent);
    const optimizedResponse = this.generateVoiceOptimizedResponse(
      baseResponse,
      voiceIntent.intent,
      voiceIntent.suggestedVoiceTone || 'friendly',
      context
    );

    return {
      response: optimizedResponse,
      shouldPlayAudio: context.extractedInfo.voicePreference !== false,
      voiceSettings: this.getOptimalVoiceSettings(voiceIntent.suggestedVoiceTone || 'friendly'),
      followUpQuestions: this.generateSuggestedQuestions(voiceIntent.intent, context)
    };
  }

  private handleVoiceSpecificIntent(
    userMessage: string,
    voiceIntent: any,
    context: ConversationContext
  ): {
    response: string;
    shouldPlayAudio: boolean;
    voiceSettings?: any;
    followUpQuestions?: string[];
  } {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('voice') || lowerMessage.includes('speak') || lowerMessage.includes('talk')) {
      return {
        response: this.generateVoiceIntroductionResponse(context),
        shouldPlayAudio: true,
        voiceSettings: this.getOptimalVoiceSettings('conversational'),
        followUpQuestions: [
          "Would you like me to speak slower or faster?",
          "Do you prefer a different voice style?",
          "What specific questions do you have about our services?"
        ]
      };
    }

    if (lowerMessage.includes('repeat') || lowerMessage.includes('again')) {
      const lastMessage = context.conversationHistory
        .slice()
        .reverse()
        .find(msg => msg.role === 'assistant');

      return {
        response: lastMessage ? `Certainly, let me repeat that: ${lastMessage.content}` : "I'd be happy to repeat that for you. Could you clarify what you'd like me to repeat?",
        shouldPlayAudio: true,
        voiceSettings: this.getOptimalVoiceSettings('patient')
      };
    }

    if (lowerMessage.includes('louder') || lowerMessage.includes('softer') || lowerMessage.includes('volume')) {
      return {
        response: "I can help you adjust the voice settings. For now, I'll continue with clear, comfortable volume levels. Would you like me to speak slower or faster instead?",
        shouldPlayAudio: true,
        voiceSettings: this.getOptimalVoiceSettings('conversational')
      };
    }

    return {
      response: "I'm here to help with voice features and any questions you have about our services. What would you like to know?",
      shouldPlayAudio: true,
      voiceSettings: this.getOptimalVoiceSettings('friendly')
    };
  }

  private generateVoiceIntroductionResponse(context: ConversationContext): string {
    const baseIntro = "I can speak to you using voice synthesis! This makes our conversation more natural and accessible. I can adjust my speaking speed, tone, and style to better suit your preferences.";

    if (context.industry) {
      return `${baseIntro} Since you're in the ${context.industry} industry, I can also provide specific insights and recommendations tailored to your business needs.`;
    }

    return baseIntro;
  }

  private getOptimalVoiceSettings(tone: string): any {
    const settings = {
      professional: { stability: 0.6, similarity_boost: 0.8, style: 0.4 },
      enthusiastic: { stability: 0.4, similarity_boost: 0.9, style: 0.7 },
      conversational: { stability: 0.5, similarity_boost: 0.8, style: 0.5 },
      patient: { stability: 0.7, similarity_boost: 0.7, style: 0.3 },
      clear: { stability: 0.8, similarity_boost: 0.6, style: 0.2 },
      friendly: { stability: 0.5, similarity_boost: 0.8, style: 0.5 }
    };

    return settings[tone as keyof typeof settings] || settings.friendly;
  }

  // Lead qualification methods
  async qualifyLead(context: ConversationContext): Promise<{
    shouldCreateLead: boolean;
    leadData?: any;
    nextQuestion?: string;
  }> {
    if (context.leadScore < 50) {
      return { shouldCreateLead: false };
    }

    const missingInfo = [];
    if (!context.extractedInfo.email) missingInfo.push("email address");
    if (!context.extractedInfo.company && context.leadScore > 70) missingInfo.push("company name");
    if (!context.extractedInfo.phone && context.leadScore > 80) missingInfo.push("phone number");

    if (missingInfo.length === 0 || (missingInfo.length === 1 && missingInfo[0] === "phone number")) {
      // We have enough info to create a lead
      return {
        shouldCreateLead: true,
        leadData: {
          name: context.extractedInfo.name || "Website Visitor",
          email: context.extractedInfo.email,
          company: context.extractedInfo.company,
          phone: context.extractedInfo.phone,
          industry: context.industry,
          message: `AI Chat Lead - Score: ${context.leadScore}. Goals: ${context.extractedInfo.goals?.join(', ') || 'Not specified'}`,
          leadSource: 'ai_chat',
          leadScore: context.leadScore,
          conversationSummary: this.generateConversationSummary(context)
        }
      };
    } else {
      // Ask for missing information
      const nextQuestion = `To help you better, could you share your ${missingInfo[0]}?`;
      return {
        shouldCreateLead: false,
        nextQuestion
      };
    }
  }

  private generateConversationSummary(context: ConversationContext): string {
    const recentMessages = context.conversationHistory.slice(-6);
    return recentMessages.map(msg => `${msg.role}: ${msg.content}`).join(' | ');
  }
}

export const aiService = new AIService();
export default aiService;