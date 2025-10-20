// Environment Configuration
// Simplified configuration after removing AI chat system

export const envConfig = {
  // Basic Application Configuration
  app: {
    name: 'Robofy',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://robofy.uk',
    environment: process.env.NODE_ENV || 'development',
  },

  // Chatwoot Integration (replaces AI chat)
  chatwoot: {
    websiteToken: process.env.CHATWOOT_WEBSITE_TOKEN || 'FsPKLkzLPzqog7qSCdrVr4PD',
    baseUrl: process.env.CHATWOOT_BASE_URL || 'https://chat.robofy.uk',
    enabled: process.env.ENABLE_CHATWOOT === 'true',
  },

  // Email Configuration for notifications (Mailgun SMTP)
  email: {
    fromEmail: process.env.EMAIL_FROM || 'postmaster@robofy.uk',
    smtpHost: process.env.SMTP_HOST || 'smtp.eu.mailgun.org',
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpUser: process.env.SMTP_USER || 'postmaster@robofy.uk',
    smtpPass: process.env.SMTP_PASS || '5e1ffd43-599b32c9',
  },

  // CRM Integration
  crm: {
    webhookUrl: process.env.CRM_WEBHOOK_URL || 'https://ai.robofy.uk/webhook-test/a80eccd4-eb3f-418c-9a0c-bebdc40cbf46',
    timeout: parseInt(process.env.CRM_TIMEOUT || '10000'),
  },

  // Basic Analytics Configuration
  analytics: {
    enableTracking: process.env.ENABLE_ANALYTICS === 'true',
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
  }
};

// Validation function to check required environment variables
export function validateEnvironment(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  // Check Chatwoot configuration
  if (!envConfig.chatwoot.websiteToken) {
    missing.push('CHATWOOT_WEBSITE_TOKEN must be set');
  }

  if (!envConfig.chatwoot.baseUrl) {
    missing.push('CHATWOOT_BASE_URL must be set');
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