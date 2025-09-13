'use client';

import React, { useState } from 'react';
import ModalWalkthrough, { WalkthroughStep } from './ModalWalkthrough';

const ModalWalkthroughDemo: React.FC = () => {
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);

  // Sample walkthrough steps with different content types
  const demoSteps: WalkthroughStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Robofy AI',
      content: {
        type: 'text',
        data: 'Discover how our AI-powered automation can transform your business operations. This interactive walkthrough will show you key features and benefits.',
        description: 'Get started with a comprehensive overview'
      }
    },
    {
      id: 'chatbot-demo',
      title: 'AI Chatbot Integration',
      content: {
        type: 'chatbot',
        data: [
          {
            type: 'bot',
            content: 'Hello! I\'m Robofy AI Assistant. How can I help you automate your business today?',
            delay: 1000
          },
          {
            type: 'user',
            content: 'I want to learn about customer support automation'
          },
          {
            type: 'bot',
            content: 'Great choice! Our AI can handle 80% of customer inquiries automatically, reducing response times from hours to seconds.',
            delay: 1500
          },
          {
            type: 'bot',
            content: 'Would you like to see specific examples for your industry?',
            delay: 1000
          }
        ]
      },
      interactive: true
    },
    {
      id: 'analytics-demo',
      title: 'Real-time Analytics Dashboard',
      content: {
        type: 'image',
        data: {
          src: '/api/placeholder/600/400', // Placeholder for actual image
          alt: 'Analytics dashboard showing real-time metrics'
        },
        description: 'Track performance with intuitive dashboards and automated reports'
      }
    },
    {
      id: 'workflow-video',
      title: 'Automated Workflow Builder',
      content: {
        type: 'video',
        data: '/api/placeholder/video/demo.mp4', // Placeholder for actual video
        description: 'Watch how easy it is to create custom automation workflows'
      }
    },
    {
      id: 'integration',
      title: 'Seamless Integrations',
      content: {
        type: 'text',
        data: 'Connect with your favorite tools: CRM systems, email platforms, social media, and more. Our AI adapts to your existing workflow.',
        description: 'Works with the tools you already use'
      }
    },
    {
      id: 'results',
      title: 'Measurable Results',
      content: {
        type: 'text',
        data: 'Businesses using Robofy AI typically see:\n• 65% reduction in manual tasks\n• 40% increase in customer engagement\n• 3x faster response times\n• 50% cost savings on operations',
        description: 'Proven outcomes across industries'
      }
    }
  ];

  const handleOpenWalkthrough = () => {
    setIsWalkthroughOpen(true);
  };

  const handleCloseWalkthrough = () => {
    setIsWalkthroughOpen(false);
  };

  const handleWalkthroughComplete = () => {
    console.log('Walkthrough completed!');
    setIsWalkthroughOpen(false);
  };

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-6">
          Modal Walkthrough Component Demo
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Experience our interactive product tour with AI chatbot simulations and multimedia content
        </p>

        <button
          onClick={handleOpenWalkthrough}
          className="px-8 py-4 bg-white text-black rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-lg font-semibold shadow-lg"
        >
          Start Product Tour
        </button>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-3 text-white">🎯 Features Demonstrated</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Interactive chatbot simulations</li>
              <li>• Mixed media content (text, images, video)</li>
              <li>• Step-by-step navigation</li>
              <li>• Progress indicators</li>
              <li>• Keyboard accessibility</li>
              <li>• Responsive design</li>
              <li>• ARIA accessibility features</li>
            </ul>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-3 text-white">🚀 Use Cases</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Product onboarding</li>
              <li>• Feature demonstrations</li>
              <li>• Customer education</li>
              <li>• Interactive tutorials</li>
              <li>• Sales presentations</li>
              <li>• Training simulations</li>
            </ul>
          </div>
        </div>
      </div>

      <ModalWalkthrough
        isOpen={isWalkthroughOpen}
        onClose={handleCloseWalkthrough}
        steps={demoSteps}
        onComplete={handleWalkthroughComplete}
        skipButtonText="Skip Tour"
        closeButtonText="Finish Tour"
        className="shadow-2xl"
      />
    </div>
  );
};

export default ModalWalkthroughDemo;