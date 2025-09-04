'use client';

import React, { useState } from 'react';
import FormModal from '@/components/FormModal';

export default function ContactPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormOpen = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const contactInfo = [
    {
      icon: '📞',
      title: 'Phone',
      details: '+1 (555) 123-ROBO',
      description: 'Mon-Fri from 9am to 5pm'
    },
    {
      icon: '✉️',
      title: 'Email',
      details: 'hello@robofy.com',
      description: 'Send us a message anytime'
    },
    {
      icon: '🏢',
      title: 'Office',
      details: '123 AI Street',
      description: 'Tech City, TC 12345'
    }
  ];

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="min-h-[50vh] w-full relative bg-gradient-to-br from-blue-900 via-black to-purple-900 flex items-center justify-center overflow-hidden py-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-purple-500/10"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent font-source-code-pro">
            Contact Us
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 font-source-code-pro">
            Ready to transform your business with AI-powered digital marketing? Let's start the conversation.
          </p>
        </div>
      </section>

      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700 hover:border-blue-400 transition-all duration-300 hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6 text-2xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white font-source-code-pro">
                  {item.title}
                </h3>
                <p className="text-blue-400 font-medium mb-3 text-lg font-source-code-pro">
                  {item.details}
                </p>
                <p className="text-gray-300 text-sm font-source-code-pro">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Form CTA */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-gray-700 mb-20">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white font-source-code-pro">
                Let's Start a Conversation
              </h2>
              <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto font-source-code-pro">
                Fill out our quick contact form and one of our AI specialists will get back to you within 24 hours to discuss your specific needs.
              </p>
              <button
                onClick={handleFormOpen}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg font-source-code-pro"
              >
                📩 Get In Touch
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-12 text-white font-source-code-pro">
              Why Businesses Choose Robofy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-gray-300 font-source-code-pro">Successful Projects</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">99%</div>
                <div className="text-gray-300 font-source-code-pro">Client Satisfaction</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-300 font-source-code-pro">AI Support</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-yellow-400 mb-2">3x</div>
                <div className="text-gray-300 font-source-code-pro">Average ROI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <FormModal isOpen={isFormOpen} onClose={handleFormClose} />
    </>
  );
}