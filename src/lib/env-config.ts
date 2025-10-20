// Environment Configuration for AI Chat Integration
// Copy this file to .env.local and fill in your actual values

export const envConfig = {
  // AI Service Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-pro',
  },

  // n8n Integration Configuration
  n8n: {
    webhookUrl: process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/ai-chat-lead',
    apiKey: process.env.N8N_API_KEY || '',
    timeout: parseInt(process.env.N8N_TIMEOUT || '30000'),
  },

  // CRM Integration (existing webhook)
  crm: {
    webhookUrl: 'https://ai.robofy.uk/webhook-test/a80eccd4-eb3f-418c-9a0c-bebdc40cbf46',
    timeout: 10000,
  },

  // Email Configuration for Follow-ups
  email: {
    fromEmail: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
  },

  // Lead Scoring Configuration
  leadScoring: {
    highPriorityThreshold: parseInt(process.env.LEAD_HIGH_THRESHOLD || '80'),
    mediumPriorityThreshold: parseInt(process.env.LEAD_MEDIUM_THRESHOLD || '60'),
    autoCreateThreshold: parseInt(process.env.LEAD_AUTO_CREATE_THRESHOLD || '75'),
  },

  // Conversation Settings
  conversation: {
    sessionTimeoutMinutes: parseInt(process.env.CONVERSATION_TIMEOUT || '30'),
    maxMessages: parseInt(process.env.MAX_MESSAGES || '100'),
    enableLogging: process.env.ENABLE_CONVERSATION_LOGGING === 'true',
  },

  // Analytics Configuration
  analytics: {
    enableTracking: process.env.ENABLE_ANALYTICS === 'true',
    trackEvents: ['chat_started', 'message_sent', 'lead_qualified', 'lead_created'],
  },

  // Voice Integration Configuration
  voice: {
    elevenLabs: {
      apiKey: process.env.ELEVENLABS_API_KEY || '',
      defaultVoiceId: process.env.ELEVENLABS_DEFAULT_VOICE_ID || '21m00Tcm4TlvDq8ikWAM',
      model: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v1',
      enabled: process.env.ENABLE_VOICE_FEATURES === 'true',
    },
    speechRecognition: {
      enabled: process.env.ENABLE_SPEECH_RECOGNITION === 'true',
      language: process.env.SPEECH_RECOGNITION_LANGUAGE || 'en-US',
      continuous: process.env.SPEECH_RECOGNITION_CONTINUOUS === 'true',
      interimResults: process.env.SPEECH_RECOGNITION_INTERIM_RESULTS === 'true',
    },
    audio: {
      defaultVolume: parseFloat(process.env.DEFAULT_AUDIO_VOLUME || '0.8'),
      defaultPlaybackSpeed: parseFloat(process.env.DEFAULT_PLAYBACK_SPEED || '1.0'),
      autoPlay: process.env.AUTO_PLAY_VOICE === 'true',
      maxAudioQueueSize: parseInt(process.env.MAX_AUDIO_QUEUE_SIZE || '5'),
    },
    preferences: {
      enableVoiceByDefault: process.env.ENABLE_VOICE_BY_DEFAULT === 'true',
      storeVoiceHistory: process.env.STORE_VOICE_HISTORY === 'true',
      allowVoiceDataCollection: process.env.ALLOW_VOICE_DATA_COLLECTION !== 'false',
    }
  }
};

// Validation function to check required environment variables
export function validateEnvironment(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  // Check AI service configuration
  if (!envConfig.openai.apiKey && !envConfig.gemini.apiKey) {
    missing.push('Either OPENAI_API_KEY or GEMINI_API_KEY must be set');
  }

  // Check email configuration for follow-ups
  if (!envConfig.email.smtpHost && !envConfig.email.fromEmail) {
    missing.push('Email configuration (SMTP_HOST, EMAIL_FROM) required for follow-up emails');
  }

  return {
    valid: missing.length === 0,
    missing
  };
}

// Development vs Production settings
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

export default envConfig;