'use client';

import ModernChatDashboard from '@/components/ModernChatDashboard';
import { FileText, PenTool, Image, Mic, BarChart3, Sparkles } from 'lucide-react';

const contentAgents = [
  {
    id: 'blog-content',
    name: 'Blog Content Creator',
    description: 'Create engaging blog articles',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-blue-500'
  },
  {
    id: 'social-media',
    name: 'Social Media Creator',
    description: 'Generate social media content',
    icon: <PenTool className="w-5 h-5" />,
    color: 'text-purple-500'
  },
  {
    id: 'ad-copy',
    name: 'Ad Copy Writer',
    description: 'Create compelling ad copy',
    icon: <Image className="w-5 h-5" />,
    color: 'text-orange-500'
  },
  {
    id: 'video-scripts',
    name: 'Video Script Writer',
    description: 'Create video content scripts',
    icon: <Mic className="w-5 h-5" />,
    color: 'text-red-500'
  },
  {
    id: 'seo-content',
    name: 'SEO Content Strategist',
    description: 'Execute SEO recommendations',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'text-green-500'
  }
];

export default function ContentCreationPage() {
  return (
    <ModernChatDashboard
      toolName="Content Creation"
      toolDescription="Generate engaging marketing content, blog posts, and social media content"
      apiEndpoint="/api/ai/message"
      agents={contentAgents}
      defaultAgent="blog-content"
      placeholder="Ask for help with content creation, blog posts, or marketing copy..."
      welcomeMessage="Welcome to Content Creation! I can help you create blog posts, social media content, ad copy, video scripts, and SEO-optimized content."
    />
  );
}