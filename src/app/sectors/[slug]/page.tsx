import React from 'react';
import Link from 'next/link';

// Define industries data for both generateStaticParams and the page component
const industries = [
  {
    name: 'Beauty & Cosmetics',
    slug: 'beauty',
    description: 'AI-powered marketing solutions for salons, spas, and beauty product companies',
    longDescription: 'Our AI-driven platform helps beauty businesses automate their marketing, generate leads, and personalize customer experiences. From social media automation to personalized product recommendations, we transform how beauty brands connect with their audience.',
    services: [
      'Social Media Automation',
      'Personalized Customer Journeys',
      'Lead Generation & Nurturing',
      'Content Marketing Automation'
    ]
  },
  {
    name: 'Dental & Healthcare',
    slug: 'dental',
    description: 'Digital transformation for dental practices and healthcare providers',
    longDescription: 'Transform your dental or healthcare practice with our AI solutions. Automate patient communication, streamline appointment scheduling, and enhance patient engagement with personalized care recommendations.',
    services: [
      'Appointment Reminder Systems',
      'Patient Communication Automation',
      'Treatment Plan Personalization',
      'Healthcare Content Generation'
    ]
  },
  {
    name: 'Healthcare',
    slug: 'healthcare',
    description: 'AI-driven patient engagement and medical practice automation',
    longDescription: 'Leverage AI to improve patient outcomes and operational efficiency. Our solutions include automated patient follow-ups, medical content generation, and intelligent data analysis for better decision-making.',
    services: [
      'Patient Engagement Automation',
      'Medical Content Creation',
      'Data Analytics & Insights',
      'Telemedicine Integration'
    ]
  },
  {
    name: 'Retail & E-commerce',
    slug: 'retail',
    description: 'Automated inventory management and customer retention strategies',
    longDescription: 'Revolutionize your retail business with AI-powered automation. From inventory management to personalized shopping experiences, our platform helps you stay competitive in the digital marketplace.',
    services: [
      'Inventory Management Automation',
      'Personalized Product Recommendations',
      'Customer Retention Programs',
      'E-commerce Marketing Automation'
    ]
  },
  {
    name: 'Fitness & Wellness',
    slug: 'fitness',
    description: 'Member acquisition and personalized fitness program automation',
    longDescription: 'Grow your fitness business with AI-driven member acquisition and retention strategies. Personalize workout plans, automate member communications, and optimize your marketing efforts.',
    services: [
      'Member Acquisition Automation',
      'Personalized Fitness Programs',
      'Class Scheduling Optimization',
      'Wellness Content Generation'
    ]
  },
  {
    name: 'Solar & Renewable Energy',
    slug: 'solar',
    description: 'Lead generation and marketing automation for solar energy companies',
    longDescription: 'Accelerate your solar business growth with our AI-powered lead generation and customer engagement solutions. Generate qualified leads, automate follow-ups, and close more deals efficiently.',
    services: [
      'Solar Lead Generation',
      'Customer Education Automation',
      'Proposal Generation',
      'Renewable Energy Marketing'
    ]
  }
];

// Generate static params for static export
export async function generateStaticParams() {
  return industries.map((industry) => ({
    slug: industry.slug,
  }));
}

export default function IndustryDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const industry = industries.find(ind => ind.slug === slug);

  if (!industry) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Industry Not Found</h1>
          <p className="text-gray-300 mb-8">The requested industry page does not exist.</p>
          <Link href="/sectors" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all">
            Back to Sectors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/sectors"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 font-inter"
        >
          ← Back to Sectors
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 font-inter">
            {industry.name}
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto font-inter">
            {industry.longDescription}
          </p>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center font-inter">
            Our Services for {industry.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industry.services.map((service, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
              >
                <h3 className="text-xl font-semibold mb-3 text-blue-400 font-inter">
                  {service}
                </h3>
                <p className="text-gray-300 font-inter">
                  AI-powered solutions tailored for {industry.name.toLowerCase()} businesses to enhance efficiency and growth.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-inter">
            Ready to Transform Your {industry.name} Business?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto font-inter">
            Join industry leaders who have already revolutionized their operations with our AI-powered solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 font-inter"
            >
              Get Started Today
            </Link>
            <Link
              href="/"
              className="border border-white text-white hover:bg-white hover:text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 font-inter"
            >
              View All Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}