'use client';

import Link from 'next/link';
import { Search, HelpCircle, Calendar, TrendingUp, Users, Sparkles, Key } from 'lucide-react';
import { APIKeyForm } from '@/components/APIKeyForm';

const tools = [
  {
    id: 'seo',
    label: 'SEO Analysis',
    description: 'Get SEO recommendations and analysis',
    icon: <Search className="w-8 h-8 text-white" />,
    path: '/ai-tools/seo-analysis'
  },
  {
    id: 'support',
    label: 'Customer Support',
    description: 'Get help with technical issues',
    icon: <HelpCircle className="w-8 h-8 text-white" />,
    path: '/ai-tools/customer-support'
  },
  {
    id: 'appointment',
    label: 'Appointment Booking',
    description: 'Schedule consultations and manage appointments',
    icon: <Calendar className="w-8 h-8 text-white" />,
    path: '/ai-tools/appointment-booking'
  },
  {
    id: 'competitor',
    label: 'Competitor Analysis',
    description: 'Analyze competitor strategies',
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    path: '/ai-tools/competitor-analysis'
  },
  {
    id: 'social',
    label: 'Social Media',
    description: 'Create social media content',
    icon: <Users className="w-8 h-8 text-white" />,
    path: '/ai-tools/social-media'
  },
  {
    id: 'content',
    label: 'Content Creation',
    description: 'Generate marketing content',
    icon: <Sparkles className="w-8 h-8 text-white" />,
    path: '/ai-tools/content-creation'
  }
];

export default function AIToolsPage() {

  return (
    <div className="min-h-screen bg-[#0f1117] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#f0f0f0] mb-4">
            Robofy AI Tools
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Access powerful AI tools for digital marketing automation. Each tool provides specialized assistance for your specific needs.
          </p>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              className="bg-[#1a1c22] p-6 rounded-lg border border-[#2e3039] hover:border-[#f0f0f0] transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center mb-4">
                {tool.icon}
                <h3 className="text-xl font-semibold text-[#f0f0f0] ml-3">
                  {tool.label}
                </h3>
              </div>
              <p className="text-gray-300">
                {tool.description}
              </p>
              <div className="mt-4 text-[#f0f0f0] text-sm font-medium group-hover:text-gray-300 transition-colors">
                Use tool →
              </div>
            </Link>
          ))}
        </div>

        {/* API Key Management Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Key className="w-8 h-8 text-[#f0f0f0] mr-2" />
              <h2 className="text-2xl font-bold text-[#f0f0f0]">API Key Management</h2>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Configure your AI service API keys to enable personalized AI experiences and enhanced functionality.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <APIKeyForm />
          </div>
        </div>
      </div>
    </div>
  );
}