'use client';

import ModernChatDashboard from '@/components/ModernChatDashboard';
import { HelpCircle, Phone, MessageCircle, Settings, Headphones, Star } from 'lucide-react';

const supportAgents = [
  {
    id: 'technical-support',
    name: 'Technical Support',
    description: 'Get technical assistance',
    icon: <Settings className="w-5 h-5" />,
    color: 'text-blue-500'
  },
  {
    id: 'faq-assistant',
    name: 'FAQ Assistant',
    description: 'Answer frequently asked questions',
    icon: <HelpCircle className="w-5 h-5" />,
    color: 'text-purple-500'
  },
  {
    id: 'contact-support',
    name: 'Contact Specialist',
    description: 'Reach support team directly',
    icon: <Phone className="w-5 h-5" />,
    color: 'text-green-500'
  },
  {
    id: 'feedback-collector',
    name: 'Feedback Collector',
    description: 'Gather and process feedback',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'text-orange-500'
  },
  {
    id: 'ecommerce-support',
    name: 'Ecommerce Specialist',
    description: 'Comprehensive ecommerce support',
    icon: <Headphones className="w-5 h-5" />,
    color: 'text-teal-500'
  }
];

export default function CustomerSupportPage() {
  return (
    <ModernChatDashboard
      toolName="Customer Support"
      toolDescription="Get help with technical issues, FAQs, and customer service inquiries"
      apiEndpoint="/api/ai/message"
      agents={supportAgents}
      defaultAgent="technical-support"
      placeholder="Ask for help with technical issues or customer service..."
      welcomeMessage="Hi! I'm your customer support assistant. How can I help you today with technical issues, FAQs, or general support?"
    />
  );
}