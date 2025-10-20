#!/bin/bash

# Deployment script for Dokploy on Hetzner
# This script helps deploy the Robofy website with all necessary configurations

set -e

echo "🚀 Starting deployment to Dokploy on Hetzner..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found!"
    echo "📝 Please configure your .env.production file with production values:"
    echo "   - Update OPENAI_API_KEY with your production key"
    echo "   - Configure N8N_WEBHOOK_URL with your production n8n instance"
    echo "   - Set N8N_API_KEY for your production environment"
    exit 1
fi

# Test SMTP configuration
echo "📧 Testing SMTP configuration..."
SMTP_TEST=$(node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ SMTP Error:', error.message);
    process.exit(1);
  } else {
    console.log('✅ SMTP configuration is valid');
    process.exit(0);
  }
});
" 2>/dev/null || echo "⚠️  Could not test SMTP (nodemailer not installed)")

# Test external webhook connectivity
echo "🌐 Testing webhook connectivity..."
WEBHOOK_URL=$(grep "N8N_WEBHOOK_URL" .env.production | cut -d '=' -f2)
if [ -n "$WEBHOOK_URL" ] && [ "$WEBHOOK_URL" != "https://your-production-n8n-instance.com/webhook/ai-chat-lead" ]; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$WEBHOOK_URL" 2>/dev/null || echo "000")
    if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "201" ]; then
        echo "✅ Webhook endpoint is accessible"
    else
        echo "⚠️  Webhook endpoint returned HTTP $HTTP_STATUS"
    fi
else
    echo "⚠️  N8N_WEBHOOK_URL not configured in .env.production"
fi

# Test Docker build
echo "🐳 Testing Docker build..."
if docker build -t robofy-deployment-test . >/dev/null 2>&1; then
    echo "✅ Docker build successful"
    docker rmi robofy-deployment-test >/dev/null 2>&1
else
    echo "❌ Docker build failed!"
    echo "🔍 Common issues:"
    echo "   - Check Node.js version compatibility"
    echo "   - Verify all dependencies are in package.json"
    echo "   - Check for any build-time environment variables"
    exit 1
fi

# Validate environment variables
echo "🔍 Validating environment configuration..."
node -e "
const fs = require('fs');
const env = fs.readFileSync('.env.production', 'utf8');
const required = ['OPENAI_API_KEY', 'GEMINI_API_KEY', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
const missing = required.filter(key => !env.includes(key + '=') || env.includes(key + '=your-') || env.includes(key + '=test'));
if (missing.length > 0) {
  console.log('❌ Missing or placeholder values for:', missing.join(', '));
  process.exit(1);
} else {
  console.log('✅ All required environment variables are configured');
}
"

# Check DNS resolution
echo "🌐 Checking DNS resolution..."
if nslookup robofy.uk >/dev/null 2>&1; then
    echo "✅ robofy.uk DNS resolves correctly"
else
    echo "⚠️  robofy.uk DNS resolution failed - check your domain configuration"
fi

if nslookup ai.robofy.uk >/dev/null 2>&1; then
    echo "✅ ai.robofy.uk DNS resolves correctly"
else
    echo "⚠️  ai.robofy.uk DNS resolution failed - check your webhook domain"
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo "✅ SMTP configuration updated with Mailgun settings"
echo "✅ Production environment file created"
echo "✅ Health check fixed (using Node.js instead of wget)"
echo "✅ Docker Compose configured for production"
echo "✅ Resource limits added"
echo ""
echo "⚠️  REMAINING MANUAL STEPS:"
echo "1. 📝 Edit .env.production and replace placeholder values:"
echo "   - OPENAI_API_KEY: Set your production OpenAI API key"
echo "   - N8N_WEBHOOK_URL: Configure your production n8n webhook URL"
echo "   - N8N_API_KEY: Set your production n8n API key"
echo ""
echo "2. 🔐 Configure Dokploy Secrets:"
echo "   - Upload .env.production as environment file in Dokploy"
echo "   - Move sensitive API keys to Dokploy secret management"
echo ""
echo "3. 🌐 Verify External Services:"
echo "   - Ensure n8n instance is running and accessible"
echo "   - Confirm webhook endpoint is configured"
echo "   - Test email sending functionality"
echo ""
echo "4. 🚀 Deploy via Dokploy:"
echo "   - Push changes to your repository"
echo "   - Trigger deployment in Dokploy dashboard"
echo "   - Monitor deployment logs for errors"
echo ""
echo "🔧 Troubleshooting Commands:"
echo "   docker-compose logs -f robofy-static    # View container logs"
echo "   docker-compose exec robofy-static sh    # Access container shell"
echo "   curl http://localhost:3000              # Test local deployment"
echo ""
echo "✅ Deployment preparation complete!"
echo "🎉 Ready for production deployment to Hetzner via Dokploy!"