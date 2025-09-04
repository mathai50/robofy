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
      image: "https://via.placeholder.com/80x80"
    },
    {
      name: "Dr. Michael Chen",
      company: "City Dental Care",
      rating: 5,
      text: "The appointment reminder system has reduced our no-shows by 85%. Incredible ROI and seamless integration.",
      image: "https://via.placeholder.com/80x80"
    },
    {
      name: "Lisa Rodriguez",
      company: "FitLife Studios",
      rating: 5,
      text: "Member acquisition has never been easier. The personalized workout programs keep our clients engaged and coming back.",
      image: "https://via.placeholder.com/80x80"
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
        {/* Enhanced Hero Section with Dark Gradient and Neon Accents */}
        <section className="min-h-[calc(100vh-64px)] w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
          
          {/* Background Lines covering the entire hero section */}
          <div className="absolute inset-0 z-0 w-full h-full">
            <BackgroundLines className="h-full w-full">{null}</BackgroundLines>
          </div>
          
          {/* Main container */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left column - Text content */}
              <div className="text-center lg:text-left">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 text-white font-roboto bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  AI-Powered Business Automation
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-8 text-gray-300">
                  Transform your operations with intelligent automation that works 24/7
                </p>
                
                {/* Primary CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <ShimmerButton
                    onClick={handleFormOpen}
                    className="font-semibold text-lg px-8 py-4"
                    background="linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)"
                    shimmerColor="#ffffff"
                  >
                    Start Your Free Automation Audit
                  </ShimmerButton>
                  <button className="border border-blue-400 text-blue-400 hover:bg-blue-400/10 font-semibold py-4 px-6 rounded-lg transition-all duration-300 text-lg">
                    Watch Demo
                  </button>
                </div>
                
                {/* Trust indicators */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>80% Time Savings</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>40% Cost Reduction</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>500+ Happy Clients</span>
                  </div>
                </div>
              </div>
              
              {/* Right column - Orbiting animation */}
              <div className="flex items-center justify-center">
                <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px]">
                  {/* Outer orbiting circle with 4 icons clockwise */}
                  <div className="absolute inset-0">
                    <OrbitingCircles
                      radius={150}
                      duration={20}
                      delay={0}
                      iconSize={40}
                      reverse={false}
                    >
                      <div className="text-blue-400"><GoogleDriveIcon size={40} /></div>
                      <div className="text-purple-400"><NotionIcon size={40} /></div>
                      <div className="text-green-400"><WhatsAppIcon size={40} /></div>
                      <div className="text-pink-400"><AIIcon size={40} /></div>
                    </OrbitingCircles>
                  </div>
                  {/* Inner orbiting circle with 4 icons anticlockwise */}
                  <div className="absolute inset-0" style={{ transform: 'scale(0.7)' }}>
                    <OrbitingCircles
                      radius={100}
                      duration={15}
                      delay={2.5}
                      iconSize={30}
                      reverse={true}
                    >
                      <div className="text-blue-300"><GoogleDriveIcon size={30} /></div>
                      <div className="text-purple-300"><NotionIcon size={30} /></div>
                      <div className="text-green-300"><WhatsAppIcon size={30} /></div>
                      <div className="text-pink-300"><AIIcon size={30} /></div>
                    </OrbitingCircles>
                  </div>
                  {/* Central icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
                      <Bot size={32} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animated List for Announcements with Dark Gradient */}
        <div className="w-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <AnimatedList delay={1000} className="mt-8">
              <div className="p-6 border border-blue-400/50 rounded-xl bg-blue-500/20 backdrop-blur-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">New AI Feature Released</h3>
                <p className="text-blue-100">Enhanced content generation with GPT-4 integration for more natural marketing copy</p>
              </div>
              <div className="p-6 border border-green-400/50 rounded-xl bg-green-500/20 backdrop-blur-sm shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">System Update Complete</h3>
                <p className="text-green-100">Improved performance and new dashboard analytics for better insights</p>
              </div>
              <div className="p-6 border border-purple-400/50 rounded-xl bg-purple-500/20 backdrop-blur-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">Upcoming Webinar</h3>
                <p className="text-purple-100">Join our live demo on AI automation strategies for retail businesses - Dec 15th</p>
              </div>
            </AnimatedList>
          </div>
        </div>

        {/* Stats preview with Dark Gradient and Neon Accents */}
        <div className="w-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto py-8">
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-sm text-gray-300">Happy Clients</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-green-400/30 hover:border-green-400/60 transition-all duration-300">
              <div className="text-3xl font-bold text-green-400 mb-2">99%</div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-sm text-gray-300">AI Support</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-pink-400/30 hover:border-pink-400/60 transition-all duration-300">
              <div className="text-3xl font-bold text-pink-400 mb-2">3x</div>
              <div className="text-sm text-gray-300">ROI Average</div>
            </div>
          </div>
        </div>

        {/* Sectors Section with MagicBento and Dark Gradient */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-alegreya font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
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

        {/* Social and Automation Icons Dock with Neon Effects */}
        <section className="py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <Dock direction="middle" iconSize={60} iconMagnification={100} iconDistance={140}>
                <DockIcon>
                  <div className="text-blue-400 hover:text-blue-300 transition-all duration-300"><Share2 size={28} /></div>
                </DockIcon>
                <DockIcon>
                  <div className="text-purple-400 hover:text-purple-300 transition-all duration-300"><Bot size={28} /></div>
                </DockIcon>
                <DockIcon>
                  <div className="text-green-400 hover:text-green-300 transition-all duration-300"><Mail size={28} /></div>
                </DockIcon>
                <DockIcon>
                  <div className="text-pink-400 hover:text-pink-300 transition-all duration-300"><Linkedin size={28} /></div>
                </DockIcon>
                <DockIcon>
                  <div className="text-cyan-400 hover:text-cyan-300 transition-all duration-300"><Twitter size={28} /></div>
                </DockIcon>
                <DockIcon>
                  <div className="text-yellow-400 hover:text-yellow-300 transition-all duration-300"><Instagram size={28} /></div>
                </DockIcon>
              </Dock>
            </div>
          </div>
        </section>

        {/* Client Logos Marquee Section with Dark Gradient */}
        <section className="py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h5 className="text-xl font-semibold text-center text-white mb-8 font-alegreya font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Trusted by Industry Leaders
            </h5>
            <Marquee speed={40} pauseOnHover={true} className="py-6">
              <div className="flex items-center justify-center mx-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-blue-400/20">
                <span className="text-2xl">🏢</span>
                <span className="ml-2 text-white font-semibold">Enterprise Clients</span>
              </div>
              <div className="flex items-center justify-center mx-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-purple-400/20">
                <span className="text-2xl">💄</span>
                <span className="ml-2 text-white font-semibold">Beauty Brands</span>
              </div>
              <div className="flex items-center justify-center mx-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-400/20">
                <span className="text-2xl">🏥</span>
                <span className="ml-2 text-white font-semibold">Healthcare Providers</span>
              </div>
              <div className="flex items-center justify-center mx-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-pink-400/20">
                <span className="text-2xl">🛒</span>
                <span className="ml-2 text-white font-semibold">Retail Stores</span>
              </div>
              <div className="flex items-center justify-center mx-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-yellow-400/20">
                <span className="text-2xl">💪</span>
                <span className="ml-2 text-white font-semibold">Fitness Studios</span>
              </div>
              <div className="flex items-center justify-center mx-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-cyan-400/20">
                <span className="text-2xl">☀️</span>
                <span className="ml-2 text-white font-semibold">Solar Companies</span>
              </div>
            </Marquee>
          </div>
        </section>

        {/* Automation Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-alegreya font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
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

        {/* Service Presentation Strategy with Tabbed Interface */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-alegreya font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Our AI-Powered Services
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-alegreya font-normal">
                Comprehensive automation solutions tailored to your business needs
              </p>
            </div>

            {/* 3-Step Process */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-blue-400/30">
                <div className="text-4xl text-blue-400 mb-4">1</div>
                <h3 className="text-xl font-semibold text-white mb-2">Analyzes</h3>
                <p className="text-gray-300">Deep analysis of your current processes and opportunities</p>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-purple-400/30">
                <div className="text-4xl text-purple-400 mb-4">2</div>
                <h3 className="text-xl font-semibold text-white mb-2">Automates</h3>
                <p className="text-gray-300">Seamless implementation of AI-driven automation solutions</p>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-pink-400/30">
                <div className="text-4xl text-pink-400 mb-4">3</div>
                <h3 className="text-xl font-semibold text-white mb-2">Optimizes</h3>
                <p className="text-gray-300">Continuous optimization for maximum efficiency and ROI</p>
              </div>
            </div>

            {/* Tabbed Service Interface */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="flex flex-wrap gap-2 mb-8">
                <button className="px-6 py-3 bg-blue-500/20 border border-blue-400/50 rounded-lg text-blue-400 font-semibold hover:bg-blue-500/30 transition-all duration-300">
                  AI Marketing Automation
                </button>
                <button className="px-6 py-3 bg-purple-500/20 border border-purple-400/50 rounded-lg text-purple-400 font-semibold hover:bg-purple-500/30 transition-all duration-300">
                  NextJS/React Development
                </button>
                <button className="px-6 py-3 bg-green-500/20 border border-green-400/50 rounded-lg text-green-400 font-semibold hover:bg-green-500/30 transition-all duration-300">
                  CRM Automation
                </button>
                <button className="px-6 py-3 bg-pink-500/20 border border-pink-400/50 rounded-lg text-pink-400 font-semibold hover:bg-pink-500/30 transition-all duration-300">
                  Content Automation
                </button>
                <button className="px-6 py-3 bg-cyan-500/20 border border-cyan-400/50 rounded-lg text-cyan-400 font-semibold hover:bg-cyan-500/30 transition-all duration-300">
                  Process Workflows
                </button>
              </div>

              {/* Tab Content - AI Marketing Automation (default) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">AI Marketing Automation</h3>
                  <p className="text-gray-300 mb-4">
                    Transform your marketing with intelligent automation that delivers personalized experiences at scale. Our AI-driven solutions increase engagement and conversions while reducing manual effort.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Before Automation</span>
                      <span className="text-red-400">40% Conversion Rate</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">After Automation</span>
                      <span className="text-green-400">85% Conversion Rate</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30">
                  <h4 className="text-lg font-semibold text-white mb-2">Key Features</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Personalized customer journeys</li>
                    <li>• Multi-channel campaign management</li>
                    <li>• Real-time analytics and insights</li>
                    <li>• Predictive lead scoring</li>
                    <li>• Automated A/B testing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        

        {/* Enhanced Testimonials Section with Trust Building Elements */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-alegreya font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Trusted by Industry Leaders
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-alegreya font-normal">
                Real results from businesses that transformed with Robofy
              </p>
            </div>

            {/* Success Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-blue-400/30">
                <div className="text-4xl font-bold text-blue-400 mb-2">80%</div>
                <h3 className="text-xl font-semibold text-white mb-2">Time Savings</h3>
                <p className="text-gray-300">Average reduction in manual tasks</p>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-green-400/30">
                <div className="text-4xl font-bold text-green-400 mb-2">40%</div>
                <h3 className="text-xl font-semibold text-white mb-2">Cost Reduction</h3>
                <p className="text-gray-300">Average operational cost savings</p>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-purple-400/30">
                <div className="text-4xl font-bold text-purple-400 mb-2">3x</div>
                <h3 className="text-xl font-semibold text-white mb-2">ROI Increase</h3>
                <p className="text-gray-300">Average return on investment</p>
              </div>
            </div>

            {/* Testimonials Marquee */}
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

            {/* Industry Certifications */}
            <div className="text-center mt-16">
              <h3 className="text-2xl font-semibold text-white mb-6">Industry Recognized & Certified</h3>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-green-400/30">
                  <span className="text-green-400 font-semibold">AI Ethics Certified</span>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-blue-400/30">
                  <span className="text-blue-400 font-semibold">GDPR Compliant</span>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-purple-400/30">
                  <span className="text-purple-400 font-semibold">ISO 27001 Certified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Hidden per request */}

        {/* Final CTA Section with Conversion Optimization */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-alegreya font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-alegreya font-normal">
              Join thousands of businesses already revolutionizing their operations with Robofy
            </p>
            
            {/* Multiple CTA Options for A/B Testing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ShimmerButton
                onClick={handleFormOpen}
                className="font-semibold text-lg py-4"
                background="linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)"
                shimmerColor="#ffffff"
              >
                Start Free Automation Audit
              </ShimmerButton>
              <ShimmerButton
                onClick={handleFormOpen}
                className="font-semibold text-lg py-4"
                background="linear-gradient(45deg, #10b981, #06b6d4, #8b5cf6)"
                shimmerColor="#ffffff"
              >
                Get Personalized Demo
              </ShimmerButton>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="border border-blue-400 text-blue-400 hover:bg-blue-400/10 font-semibold py-4 px-8 rounded-lg transition-all duration-300 text-lg">
                Watch Case Studies
              </button>
              <button className="border border-green-400 text-green-400 hover:bg-green-400/10 font-semibold py-4 px-8 rounded-lg transition-all duration-300 text-lg">
                Compare Plans
              </button>
            </div>

            {/* Live Chat Integration Space */}
            <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Need Immediate Assistance?</h4>
              <p className="text-gray-300 mb-4">Our AI experts are ready to help you 24/7</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300">
                Start Live Chat
              </button>
            </div>
          </div>
        </section>

        {/* MagicBento Showcase Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-alegreya font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
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