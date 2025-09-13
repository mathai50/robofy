'use client';

import React from 'react';
import CaseStudyGrid from '@/components/CaseStudyGrid';

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white font-inter">
              Case Studies
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter">
              Explore our success stories and see how we've helped businesses across various industries achieve remarkable results with AI-powered automation.
            </p>
          </div>
          <CaseStudyGrid />
        </div>
      </div>
    </div>
  );
}