'use client';

import React from 'react';
import Link from 'next/link';

export default function SectorsPage() {
  const sectors = [
    {
      name: 'Beauty & Cosmetics',
      slug: 'beauty',
      description: 'AI-powered marketing solutions for salons, spas, and beauty product companies',
      image: '/api/placeholder/400/250'
    },
    {
      name: 'Dental & Healthcare',
      slug: 'dental',
      description: 'Digital transformation for dental practices and healthcare providers',
      image: '/api/placeholder/400/250'
    },
    {
      name: 'Healthcare',
      slug: 'healthcare',
      description: 'AI-driven patient engagement and medical practice automation',
      image: '/api/placeholder/400/250'
    },
    {
      name: 'Retail & E-commerce',
      slug: 'retail',
      description: 'Automated inventory management and customer retention strategies',
      image: '/api/placeholder/400/250'
    },
    {
      name: 'Fitness & Wellness',
      slug: 'fitness',
      description: 'Member acquisition and personalized fitness program automation',
      image: '/api/placeholder/400/250'
    },
    {
      name: 'Solar & Renewable Energy',
      slug: 'solar',
      description: 'Lead generation and marketing automation for solar energy companies',
      image: '/api/placeholder/400/250'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 font-inter">
            Sectors We Serve
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto font-inter">
            Discover how our AI-powered solutions are transforming businesses across various sectors with tailored digital marketing automation.
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map((sector) => (
            <div
              key={sector.slug}
              className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-300 border border-gray-700"
            >
              <div className="mb-4">
                <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {sector.name.split(' ')[0]}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 font-inter">
                {sector.name}
              </h3>
              
              <p className="text-gray-300 mb-4 text-sm font-inter">
                {sector.description}
              </p>
              
              <Link
                href={`/sectors/${sector.slug}`}
                className="inline-block bg-white text-black hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm font-inter"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-inter">
            Ready to Transform Your Sector?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto font-inter">
            Join hundreds of businesses that have already revolutionized their digital marketing with our AI-powered solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-black hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 font-inter"
            >
              Get Started Today
            </Link>
            <Link
              href="/"
              className="border border-gray-300 text-white hover:bg-white hover:text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 font-inter"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}