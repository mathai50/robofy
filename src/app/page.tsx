'use client';

import React, { useState } from 'react';
import FormModal from '@/components/FormModal';
import { Marquee } from '@/components/ui/Marquee';
import MagicBento from '@/components/MagicBento';
import { Dock } from '@/components/magicui/dock';
import { DockIcon } from '@/components/magicui/dock-icon';
import { OrbitingCircles } from '@/components/magicui/orbiting-circles';
import { GoogleDriveIcon, NotionIcon, WhatsAppIcon, AIIcon } from '@/components/magicui/orbiting-icons';
import { StaticGridPattern } from '@/components/magicui/static-grid-pattern';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { ColourfulText } from '@/components/ui/colourful-text';
import { BackgroundLines } from '@/components/magicui/background-lines';
import { AnimatedList } from '@/components/magicui/animated-list';
import { Share2, Bot, Mail, Linkedin, Twitter, Instagram } from 'lucide-react';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormOpen = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Bliss Beauty Salon",
      rating: 5,
      text: "Robofy transformed our social media presence. We've seen a 300% increase in bookings since implementing their AI automation.",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Dr. Michael Chen",
      company: "City Dental Care",
      rating: 5,
      text: "The appointment reminder system has reduced our no-shows by 85%. Incredible ROI and seamless integration.",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Lisa Rodriguez",
      company: "FitLife Studios",
      rating: 5,
      text: "Member acquisition has never been easier. The personalized workout programs keep our clients engaged and coming back.",
      image: "/api/placeholder/80/80"
    },
  ]
  const pricingPlans = [
    {
      name: "Starter",
      price: "$299",
      period: "month",
      description: "Perfect for small businesses getting started with AI automation",
      features: [
        "Basic AI content generation",
        "Social media scheduling",
        "Email automation",
        "Analytics dashboard",
        "24/7 support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$699",
      period: "month",
      description: "Ideal for growing businesses with multiple channels",
      features: [
        "Advanced AI content generation",
        "Multi-platform social media",
        "CRM integration",
        "Advanced analytics",
        "Priority support",
        "Custom workflows"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$1,299",
      period: "month",
      description: "For large organizations needing full automation suite",
      features: [
        "Unlimited AI content generation",
        "Full platform integration",
        "Dedicated account manager",
        "Custom AI training",
        "API access",
        "White-label solutions"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const automationFeatures = [
    {
      title: "AI-Powered Content Creation",
      description: "Generate engaging, industry-specific content that resonates with your audience",
      icon: "✨",
      stats: "87% faster content production"
    },
    {
      title: "Multi-Channel Automation",
      description: "Seamlessly manage social media, email, and SMS campaigns from one platform",
      icon: "🔄",
      stats: "3x more engagement"
    },
    {
      title: "Smart Analytics",
      description: "Real-time insights and predictive analytics to optimize your marketing strategy",
      icon: "📊",
      stats: "45% higher conversion rates"
    },
    {
      title: "Personalized Customer Journeys",
      description: "Create tailored experiences that increase customer loyalty and retention",
      icon: "🎯",
      stats: "68% improved customer satisfaction"
    }
  ];

  const sectors = [
      {
        name: 'Beauty & Cosmetics',
        slug: 'beauty',
        description: 'AI-powered marketing solutions for salons, spas, and beauty product companies',
        icon: '💄'
      },
      {
        name: 'Dental & Healthcare',
        slug: 'dental',
        description: 'Digital transformation for dental practices and healthcare providers',
        icon: '🦷'
      },
      {
        name: 'Healthcare',
        slug: 'healthcare',
        description: 'AI-driven patient engagement and medical practice automation',
        icon: '🏥'
      },
      {
        name: 'Retail & E-commerce',
        slug: 'retail',
        description: 'Automated inventory management and customer retention strategies',
        icon: '🛒'
      },
      {
        name: 'Fitness & Wellness',
        slug: 'fitness',
        description: 'Member acquisition and personalized fitness program automation',
        icon: '💪'
      },
      {
        name: 'Solar & Renewable Energy',
        slug: 'solar',
        description: 'Lead generation and marketing automation for solar energy companies',
        icon: '☀️'
      }
    ];

  return (
    <>
      <div className="relative">
        {/* MagicUI Orbiting Circles Hero Section with Background Lines */}
        <section className="min-h-[calc(100vh-64px)] w-full relative overflow-hidden flex items-center justify-center">
          {/* Background Lines covering the entire hero section */}
          <div className="absolute inset-0 z-0 w-full h-full">
            <BackgroundLines className="h-full w-full">{null}</BackgroundLines>
          </div>
          
          {/* Main container - sidebar removed, so no margin needed */}
          <div className="relative z-10 w-full">
            {/* Grid layout for perfect centering */}
            <div className="grid grid-cols-[auto,1fr] w-full items-center justify-center">
              {/* Orbit animation with fixed width */}
              <div className="flex items-center justify-center">
                <div className="relative w-[360px] h-[360px] flex items-center justify-center pl-11">
                  {/* Outer orbiting circle with 4 icons clockwise */}
                  <div className="absolute" style={{ width: '360px', height: '360px' }}>
                    <OrbitingCircles
                      radius={180}
                      duration={25}
                      delay={0}
                      iconSize={30}
                      reverse={false}
                    >
                      <GoogleDriveIcon size={30} />
                      <NotionIcon size={30} />
                      <WhatsAppIcon size={30} />
                      <AIIcon size={30} />
                    </OrbitingCircles>
                  </div>
                  {/* Inner orbiting circle with 4 icons anticlockwise */}
                  <div className="absolute" style={{ width: '240px', height: '240px' }}>
                    <OrbitingCircles
                      radius={120}
                      duration={20}
                      delay={5}
                      iconSize={30}
                      reverse={true}
                    >
                      <GoogleDriveIcon size={30} />
                      <NotionIcon size={30} />
                      <WhatsAppIcon size={30} />
                      <AIIcon size={30} />
                    </OrbitingCircles>
                  </div>
                </div>
              </div>
              {/* Text content centered in available space */}
              <div className="flex items-center justify-center justify-self-center">
                <div className="text-center max-w-lg relative">
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold mb-6 text-white font-roboto">
                    Robo<ColourfulText text="fy" />
                  </h1>
                  <p className="text-3xl sm:text-4xl lg:text-4xl font-extrabold mb-6 text-white font-roboto">
                    Transform Your Business with{" "}<ColourfulText text="AI-Automation" />
                  </p>
                  <div className="flex justify-center mb-6">
                    <ShimmerButton
                      onClick={handleFormOpen}
                      className="font-semibold"
                    >
                      Contact Us
                    </ShimmerButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animated List for Announcements */}
        <div className="w-full bg-black py-12">
          <div className="max-w-4xl mx-auto px-4">
            <AnimatedList delay={1000} className="mt-8">
              <div className="p-6 border border-blue-400/30 rounded-xl bg-blue-500/10 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-2">New AI Feature Released</h3>
                <p className="text-blue-200">Enhanced content generation with GPT-4 integration for more natural marketing copy</p>
              </div>
              <div className="p-6 border border-green-400/30 rounded-xl bg-green-500/10 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-2">System Update Complete</h3>
                <p className="text-green-200">Improved performance and new dashboard analytics for better insights</p>
              </div>
              <div className="p-6 border border-purple-400/30 rounded-xl bg-purple-500/10 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-2">Upcoming Webinar</h3>
                <p className="text-purple-200">Join our live demo on AI automation strategies for retail businesses - Dec 15th</p>
              </div>
            </AnimatedList>
          </div>
        </div>

        {/* Stats preview - Moved outside hero section */}
        <div className="w-full bg-black">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto py-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">500+</div>
              <div className="text-sm text-gray-400">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">99%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">24/7</div>
              <div className="text-sm text-gray-400">AI Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">3x</div>
              <div className="text-sm text-gray-400">ROI Average</div>
            </div>
          </div>
        </div>

        {/* Sectors Section with MagicBento */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-l sm:text-1xl lg:text-3xl font-bold mb-6 text-white font-alegreya font-bold">
                Sectors We Transform
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-alegreya font-normal">
                Discover how our AI-powered solutions are revolutionizing businesses across key sectors
              </p>
            </div>

            <MagicBento
              cards={sectors.map(sector => ({
                color: '#060010',
                title: sector.name,
                description: sector.description,
                label: sector.icon
              }))}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              clickEffect={true}
              enableMagnetism={true}
            />
          </div>
        </section>

        {/* Social and Automation Icons Dock */}
        <section className="py-12 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <Dock direction="middle" iconSize={50} iconMagnification={80} iconDistance={120}>
                <DockIcon>
                  <Share2 size={24} className="text-white" /> {/* Social Media */}
                </DockIcon>
                <DockIcon>
                  <Bot size={24} className="text-white" /> {/* Automation */}
                </DockIcon>
                <DockIcon>
                  <Mail size={24} className="text-white" /> {/* Email */}
                </DockIcon>
                <DockIcon>
                  <Linkedin size={24} className="text-white" /> {/* LinkedIn */}
                </DockIcon>
                <DockIcon>
                  <Twitter size={24} className="text-white" /> {/* Twitter */}
                </DockIcon>
                <DockIcon>
                  <Instagram size={24} className="text-white" /> {/* Instagram */}
                </DockIcon>
              </Dock>
            </div>
          </div>
        </section>

        {/* Client Logos Marquee Section */}
        <section className="py-12 bg-black overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h5 className="text-lg font-semibold text-center text-white mb-8 font-alegreya font-bold">
              Trusted by Industry Leaders
            </h5>
            <Marquee speed={40} pauseOnHover={true} className="py-4">
              <div className="flex items-center justify-center mx-8">
                <span className="text-2xl">🏢</span>
                <span className="ml-2 text-white font-semibold">Enterprise Clients</span>
              </div>
              <div className="flex items-center justify-center mx-8">
                <span className="text-2xl">💄</span>
                <span className="ml-2 text-white font-semibold">Beauty Brands</span>
              </div>
              <div className="flex items-center justify-center mx-8">
                <span className="text-2xl">🏥</span>
                <span className="ml-2 text-white font-semibold">Healthcare Providers</span>
              </div>
              <div className="flex items-center justify-center mx-8">
                <span className="text-2xl">🛒</span>
                <span className="ml-2 text-white font-semibold">Retail Stores</span>
              </div>
              <div className="flex items-center justify-center mx-8">
                <span className="text-2xl">💪</span>
                <span className="ml-2 text-white font-semibold">Fitness Studios</span>
              </div>
              <div className="flex items-center justify-center mx-8">
                <span className="text-2xl">☀️</span>
                <span className="ml-2 text-white font-semibold">Solar Companies</span>
              </div>
            </Marquee>
          </div>
        </section>

        {/* Automation Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-alegreya font-bold">
                How We Automate Your Success
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-alegreya font-normal">
                Our AI-powered platform handles the heavy lifting so you can focus on what matters most - growing your business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {automationFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-400 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white font-alegreya font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm font-alegreya font-normal">
                    {feature.description}
                  </p>
                  <div className="text-blue-400 text-sm font-medium font-alegreya font-medium">
                    {feature.stats}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        

        {/* Testimonials Section with Marquee */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-alegreya font-bold">
                Trusted by Industry Leaders
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-alegreya font-normal">
                See what our clients say about their experience with Robofy
              </p>
            </div>

            <Marquee speed={40} pauseOnHover={true} className="py-8" gap={32}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 min-w-[400px] max-w-[400px] mx-4"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-white font-alegreya font-bold">{testimonial.name}</h4>
                      <p className="text-blue-400 text-sm font-alegreya font-medium">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-300 italic font-alegreya font-normal break-words whitespace-normal leading-relaxed">"{testimonial.text}"</p>
                </div>
              ))}
            </Marquee>
          </div>
        </section>

        {/* Pricing Section - Hidden per request */}

        {/* Final CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-white font-alegreya font-bold">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white mb-8 font-alegreya font-normal">
              Join thousands of businesses already revolutionizing their digital marketing with Robofy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ShimmerButton
                onClick={handleFormOpen}
                className="font-semibold text-lg"
                background="rgba(255, 255, 255, 1)"
                shimmerColor="#3b82f6"
              >
                Start Free Trial
              </ShimmerButton>
              <button className="border border-white text-white hover:bg-white/10 font-semibold py-4 px-10 rounded-lg transition-all duration-300 text-lg font-alegreya font-medium">
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* MagicBento Showcase Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-white font-alegreya font-bold">
                Interactive Platform Features
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-alegreya font-normal">
                Experience our AI-powered features through this interactive demonstration
              </p>
            </div>
            <MagicBento
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              clickEffect={true}
              enableMagnetism={true}
            />
          </div>
        </section>
      </div>
      
      {/* Form Modal */}
      <FormModal isOpen={isFormOpen} onClose={handleFormClose} />
    </>
  );
}