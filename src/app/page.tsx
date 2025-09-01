'use client';

import React, { useState } from 'react';
import SplineScene from '@/components/SplineScene';
import FormModal from '@/components/FormModal';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormOpen = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  return (
    <>
    <div className="relative">
      {/* Hero Section with Full-viewport Spline 3D Scene */}
      <section className="h-screen w-full relative">
        <SplineScene className="w-full h-full" onFormOpen={handleFormOpen} />
      </section>

      {/* Content Section Below Hero */}
      <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 font-source-code-pro">
            AI-Powered Digital Marketing Automation
          </h2>

          {/* Subheading */}
          <p className="text-sm sm:text-base lg:text-lg mb-8 text-gray-300 max-w-4xl mx-auto font-source-code-pro">
            Transform your business with AI-driven digital marketing solutions tailored for beauty, dental, healthcare, retail, fitness, and solar industries.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs font-source-code-pro">
              Get Started Free
            </button>
            <button className="border border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300 text-xs font-source-code-pro">
              View Our Services
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-sm text-gray-300">Happy Clients</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">99%</div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-sm text-gray-300">AI Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    {/* Form Modal */}
    <FormModal isOpen={isFormOpen} onClose={handleFormClose} />
  </>
  );
}