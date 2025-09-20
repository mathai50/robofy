'use client';

import ModernChatDashboard from '@/components/ModernChatDashboard';
import { Share2, Instagram, Facebook, Twitter, MessageCircle, TrendingUp } from 'lucide-react';

const socialMediaAgents = [
  {
    id: 'content-ideas',
    name: 'Content Ideas',
    description: 'Generate social content ideas',
    icon: <Share2 className="w-5 h-5" />,
  },
  {
    id: 'instagram-strategy',
    name: 'Instagram Strategy',
    description: 'Plan Instagram content',
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    id: 'facebook-posts',
    name: 'Facebook Posts',
    description: 'Create Facebook content',
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    id: 'twitter-engagement',
    name: 'Twitter Engagement',
    description: 'Boost Twitter engagement',
    icon: <Twitter className="w-5 h-5" />,
  },
  {
    id: 'strategy-planner',
    name: 'Strategy Planner',
    description: 'Develop social media strategies',
    icon: <TrendingUp className="w-5 h-5" />,
  }
];

export default function SocialMediaPage() {
  return (
    <ModernChatDashboard
      toolName="Social Media"
      toolDescription="Create engaging social media content, strategies, and boost engagement"
      apiEndpoint="/api/ai/message"
      agents={socialMediaAgents}
      defaultAgent="content-ideas"
      placeholder="Ask for help with social media content, strategies, or engagement..."
      welcomeMessage="Welcome to Social Media tools! I can help you create content, plan strategies, and improve engagement across various platforms."
    />
  );
}