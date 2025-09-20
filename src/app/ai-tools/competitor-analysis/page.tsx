'use client';

import ModernChatDashboard from '@/components/ModernChatDashboard';
import { TrendingUp, Target, BarChart3, Users, Search } from 'lucide-react';

const competitorAgents = [
  {
    id: 'strategy-analysis',
    name: 'Strategy Analyst',
    description: 'Analyze competitor strategies',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'text-purple-500'
  },
  {
    id: 'market-position',
    name: 'Market Position Analyst',
    description: 'Understand market positioning',
    icon: <Target className="w-5 h-5" />,
    color: 'text-blue-500'
  },
  {
    id: 'performance-metrics',
    name: 'Performance Analyst',
    description: 'Compare performance metrics',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'text-green-500'
  },
  {
    id: 'customer-analysis',
    name: 'Customer Analyst',
    description: 'Analyze competitor customers',
    icon: <Users className="w-5 h-5" />,
    color: 'text-orange-500'
  },
  {
    id: 'competitor-analysis',
    name: 'SEO Competitor Specialist',
    description: 'Comprehensive SEO analysis',
    icon: <Search className="w-5 h-5" />,
    color: 'text-teal-500'
  }
];

export default function CompetitorAnalysisPage() {
  const agentEndpoints = {
    'strategy-analysis': '/api/seo/competitor-analysis',
    'market-position': '/api/seo/competitor-analysis',
    'performance-metrics': '/api/seo/competitor-analysis',
    'customer-analysis': '/api/seo/competitor-analysis',
    'competitor-analysis': '/api/seo/competitor-analysis',
  };

  return (
    <ModernChatDashboard
      toolName="Competitor Analysis"
      toolDescription="Analyze competitor strategies, market positioning, and performance metrics"
      apiEndpoint="/api/ai/message" // Fallback, but agentEndpoints will be used primarily
      agents={competitorAgents}
      defaultAgent="strategy-analysis"
      placeholder="Ask about competitor analysis, market research, or benchmarking..."
      welcomeMessage="Welcome to Competitor Analysis! I can help you analyze competitor strategies, market positioning, performance metrics, and customer insights."
      agentEndpoints={agentEndpoints}
    />
  );
}