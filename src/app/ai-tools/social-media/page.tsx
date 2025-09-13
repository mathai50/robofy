'use client';

import ChatInterface from '@/components/ChatInterface';
import { Share2, Instagram, Facebook, Twitter } from 'lucide-react';

const socialMediaQuickActions = [
  {
    id: 'content-ideas',
    label: 'Content Ideas',
    description: 'Generate social content ideas',
    icon: <Share2 className="w-5 h-5" />,
    prompt: 'Give me ideas for social media content for my business.'
  },
  {
    id: 'instagram-strategy',
    label: 'Instagram Strategy',
    description: 'Plan Instagram content',
    icon: <Instagram className="w-5 h-5" />,
    prompt: 'Help me create an Instagram content strategy.'
  },
  {
    id: 'facebook-posts',
    label: 'Facebook Posts',
    description: 'Create Facebook content',
    icon: <Facebook className="w-5 h-5" />,
    prompt: 'Help me write engaging Facebook posts.'
  },
  {
    id: 'twitter-engagement',
    label: 'Twitter Engagement',
    description: 'Boost Twitter engagement',
    icon: <Twitter className="w-5 h-5" />,
    prompt: 'How can I increase engagement on Twitter?'
  }
];

export default function SocialMediaPage() {
  return (
    <ChatInterface
      toolName="Social Media"
      toolDescription="Create engaging social media content, strategies, and boost engagement"
      apiEndpoint="/api/ai/message"
      quickActions={socialMediaQuickActions}
      placeholder="Ask for help with social media content, strategies, or engagement..."
    />
  );
}