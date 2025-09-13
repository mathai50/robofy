'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { Search, TrendingUp, Globe, BarChart3, FileText, Users } from 'lucide-react';

const seoTabs = [
  {
    id: 'audit',
    label: 'Audit',
    icon: <FileText className="w-5 h-5" />,
    quickActions: [
      {
        id: 'website-analysis',
        label: 'Website Analysis',
        description: 'Analyze my website SEO',
        icon: <Globe className="w-5 h-5" />,
        prompt: 'Can you perform a comprehensive SEO audit of my website?'
      },
      {
        id: 'technical-seo',
        label: 'Technical SEO',
        description: 'Check technical issues',
        icon: <Search className="w-5 h-5" />,
        prompt: 'Analyze technical SEO aspects of my website.'
      }
    ]
  },
  {
    id: 'keywords',
    label: 'Keywords',
    icon: <Search className="w-5 h-5" />,
    quickActions: [
      {
        id: 'keyword-research',
        label: 'Keyword Research',
        description: 'Find relevant keywords',
        icon: <Search className="w-5 h-5" />,
        prompt: 'Help me with keyword research for my business.'
      },
      {
        id: 'keyword-analysis',
        label: 'Keyword Analysis',
        description: 'Analyze keyword performance',
        icon: <BarChart3 className="w-5 h-5" />,
        prompt: 'Analyze the performance of my target keywords.'
      }
    ]
  },
  {
    id: 'competitors',
    label: 'Competitors',
    icon: <Users className="w-5 h-5" />,
    quickActions: [
      {
        id: 'competitor-seo',
        label: 'Competitor SEO',
        description: 'Analyze competitor SEO',
        icon: <TrendingUp className="w-5 h-5" />,
        prompt: 'Analyze my competitors SEO strategies.'
      },
      {
        id: 'competitor-analysis',
        label: 'Competitor Analysis',
        description: 'Compare with competitors',
        icon: <Users className="w-5 h-5" />,
        prompt: 'Compare my SEO performance with key competitors.'
      }
    ]
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: <BarChart3 className="w-5 h-5" />,
    quickActions: [
      {
        id: 'performance-metrics',
        label: 'Performance Metrics',
        description: 'Check SEO performance with data sources',
        icon: <BarChart3 className="w-5 h-5" />,
        prompt: 'What are the key SEO performance metrics I should track? Note: This analysis combines content parsing via Beautiful Soup for on-page data and SERP API for search engine results and ranking data.'
      },
      {
        id: 'traffic-analysis',
        label: 'Traffic Analysis',
        description: 'Analyze website traffic with data sources',
        icon: <TrendingUp className="w-5 h-5" />,
        prompt: 'Analyze my website traffic and SEO performance. Note: This analysis combines content parsing via Beautiful Soup for on-page data and SERP API for search engine results and ranking data.'
      },
      {
        id: 'comprehensive-summary',
        label: 'Comprehensive Summary',
        description: 'Generate full report with visualizations',
        icon: <BarChart3 className="w-5 h-5" />,
        prompt: 'Generate a comprehensive SEO summary report with visual data representations, competitor SERP analysis, actionable insights, and key metric comparisons. Include Python-generated charts for performance metrics.'
      }
    ]
  }
];

export default function SEOPage() {
  const [activeTab, setActiveTab] = useState('audit');

  const currentTab = seoTabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-[#0f1117] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#f0f0f0] mb-4">
            SEO Analysis
          </h1>
          <p className="text-lg text-gray-300">
            Get detailed SEO recommendations, keyword research, and competitor analysis
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-[#1a1c22] p-1 rounded-lg border border-[#2e3039]">
            {seoTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#2e3039] text-[#f0f0f0]'
                    : 'text-gray-400 hover:text-[#f0f0f0] hover:bg-[#2e3039]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface with tab-specific quick actions */}
        <ChatInterface
          toolName="SEO Analysis"
          toolDescription={`Focused on ${currentTab?.label.toLowerCase()} analysis`}
          apiEndpoint="/api/ai/message"
          quickActions={currentTab?.quickActions || []}
          placeholder={`Ask about ${currentTab?.label.toLowerCase()} analysis...`}
          welcomeMessage="Please input the website URL for SEO analysis."
        />
      </div>
    </div>
  );
}