'use client';

import React from 'react';
import CaseStudyGrid from '@/components/CaseStudyGrid';

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white font-alegreya bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Case Studies
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-alegreya">
              Explore our success stories and see how we've helped businesses across various industries achieve remarkable results with AI-powered automation.
            </p>
          </div>
          <CaseStudyGrid />
        </div>
      </div>
    </div>
  );
}