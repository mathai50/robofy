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
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      details: '+1 (555) 123-ROBO',
      description: 'Mon-Fri from 9am to 5pm'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      details: 'hello@robofy.com',
      description: 'Send us a message anytime'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Office',
      details: '123 AI Street',
      description: 'Tech City, TC 12345'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 font-source-code-pro">
            Contact Us
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto font-source-code-pro">
            Ready to transform your business with AI-powered digital marketing? Get in touch with our team to discuss how we can help you achieve your goals.
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 font-source-code-pro">
                {item.title}
              </h3>
              <p className="text-blue-400 font-medium mb-2 font-source-code-pro">
                {item.details}
              </p>
              <p className="text-gray-300 text-sm font-source-code-pro">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Form CTA */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-source-code-pro">
              Let's Start a Conversation
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto font-source-code-pro">
              Fill out our quick contact form and one of our AI specialists will get back to you within 24 hours to discuss your specific needs and how we can help.
            </p>
            <button
              onClick={handleFormOpen}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 font-source-code-pro"
            >
              Get In Touch
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6 font-source-code-pro">
            Why Choose Robofy?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-300 font-source-code-pro">Successful Projects</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">99%</div>
              <div className="text-gray-300 font-source-code-pro">Client Satisfaction</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-300 font-source-code-pro">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <FormModal isOpen={isFormOpen} onClose={handleFormClose} />
    </div>
  );
}