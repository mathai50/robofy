'use client';

import React, { useState, useEffect } from 'react';
import FormModal from '@/components/FormModal';
import { ModalWalkthrough, WalkthroughStep } from '@/components/ui';
import { Marquee } from '@/components/ui/Marquee';
import { ClientLogosMarquee } from '@/components/ui/ClientLogosMarquee';
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
import CaseStudyGrid from '@/components/CaseStudyGrid';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import ProcessStepper from '@/components/ProcessStepper';
import TeamSection from '@/components/ui/TeamSection';
import { teamMembers } from '@/data/team';
import { InteractiveDemoWidget } from '@/components/ui';
import { LineChart, BarChart, DonutChart, LinearProgressBar, CircularProgressBar, FloatingDemoButton } from '@/components/ui';
import { lineChartData, barChartData, donutChartData } from '@/data/chart-data';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);

  const handleFormOpen = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleWalkthroughOpen = () => {
    setIsWalkthroughOpen(true);
  };

  const handleWalkthroughClose = () => {
    setIsWalkthroughOpen(false);
  };

  const handleWalkthroughComplete = () => {
    console.log('Product tour completed!');
    setIsWalkthroughOpen(false);
  };

  // Product tour walkthrough steps
  const walkthroughSteps: WalkthroughStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Robofy AI',
      content: {
        type: 'text',
        data: 'Discover how our AI-powered automation can transform your business operations. This interactive tour will show you key features and benefits of our platform.',
        description: 'Get started with a comprehensive overview'
      }
    },
    {
      id: 'ai-capabilities',
      title: 'AI-Powered Intelligence',
      content: {
        type: 'text',
        data: 'Our advanced AI algorithms analyze your business processes and automatically identify optimization opportunities. The system learns from your data to deliver increasingly accurate results over time.',
        description: 'Smart automation that gets smarter'
      }
    },
    {
      id: 'automation-features',
      title: 'Comprehensive Automation Suite',
      content: {
        type: 'text',
        data: 'From content creation and social media management to CRM integration and customer support - we automate it all. Our platform handles repetitive tasks so your team can focus on strategic work.',
        description: 'End-to-end automation solutions'
      }
    },
    {
      id: 'results-demo',
      title: 'Measurable Business Impact',
      content: {
        type: 'text',
        data: 'Businesses using Robofy typically see:\n• 80% reduction in manual tasks\n• 40% decrease in operational costs\n• 3x faster response times\n• 65% increase in customer engagement\n• 50% higher conversion rates',
        description: 'Proven results across industries'
      }
    },
    {
      id: 'integration',
      title: 'Seamless Integrations',
      content: {
        type: 'text',
        data: 'Connect with your favorite tools and platforms. Our AI adapts to your existing workflow and works with popular CRMs, email platforms, social media, and more.',
        description: 'Works with the tools you already use'
      }
    },
    {
      id: 'get-started',
      title: 'Ready to Transform Your Business?',
      content: {
        type: 'text',
        data: 'Join thousands of businesses that have revolutionized their operations with Robofy. Start with a free automation audit and see exactly how we can help you save time and increase efficiency.',
        description: 'Your automation journey starts here'
      }
    }
  ];

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
        {/* Minimal Hero Section with Monochrome Design */}
        <section className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-black py-20">
          {/* Animated particle overlay - Monochrome version */}
          <div className="absolute inset-0 z-0">
            {/* Floating particles in monochrome */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-70 animate-float-1"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-gray-400 rounded-full opacity-60 animate-float-2"></div>
            <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-gray-300 rounded-full opacity-50 animate-float-3"></div>
            <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-white rounded-full opacity-80 animate-float-4"></div>
            <div className="absolute top-2/3 left-2/5 w-3 h-3 bg-gray-400 rounded-full opacity-70 animate-float-5"></div>
          </div>
          
          {/* Abstract shape overlays - Monochrome */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-500 rounded-full blur-3xl animate-pulse-slower"></div>
          </div>
          
          {/* Main container */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left column - Text content */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white font-inter leading-tight mb-6 mt-6">
                  AI-Powered Business <span className="text-gray-300">Automation</span>
                </h1>
                <p className="text-xl sm:text-2xl lg:text-2xl text-gray-300 font-inter leading-relaxed mb-8 max-w-2xl">
                  Transform your operations with intelligent automation that works 24/7 to drive growth and efficiency
                </p>
                
                {/* Primary CTA */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-8">
                  <button
                    onClick={handleFormOpen}
                    className="bg-white text-black font-bold py-3.5 px-7 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-gray-100 text-base sm:text-lg"
                  >
                    Start Your Free Automation Audit
                  </button>
                  <button
                    onClick={handleWalkthroughOpen}
                    className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3.5 px-5.6 rounded-full transition-all duration-300 transform hover:scale-105 text-base sm:text-lg"
                  >
                    Watch Demo
                  </button>
                </div>
                
                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-base text-gray-300 mb-6">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white mr-2">✓</span>
                    <span className="font-medium">80% Time Savings</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white mr-2">✓</span>
                    <span className="font-medium">40% Cost Reduction</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white mr-2">✓</span>
                    <span className="font-medium">500+ Happy Clients</span>
                  </div>
                </div>
              </div>
              
              {/* Right column - Enhanced AI animation with monochrome avatars */}
              <div className="flex items-center justify-center relative">
                <div className="relative w-[350px] h-[350px] sm:w-[400px] sm:h-[400px]">
                  {/* Enhanced orbiting animation with AI avatars */}
                  <div className="absolute inset-0">
                    <OrbitingCircles
                      radius={180}
                      duration={18}
                      delay={0}
                      iconSize={50}
                      reverse={false}
                    >
                      <div className="w-12 h-12 bg-gray-800 border border-gray-600 rounded-full flex items-center justify-center">
                        <Bot size={24} className="text-white" />
                      </div>
                      <div className="w-12 h-12 bg-gray-700 border border-gray-500 rounded-full flex items-center justify-center">
                        <Bot size={24} className="text-white" />
                      </div>
                      <div className="w-12 h-12 bg-gray-600 border border-gray-400 rounded-full flex items-center justify-center">
                        <Bot size={24} className="text-white" />
                      </div>
                      <div className="w-12 h-12 bg-gray-500 border border-gray-300 rounded-full flex items-center justify-center">
                        <Bot size={24} className="text-white" />
                      </div>
                    </OrbitingCircles>
                  </div>
                  
                  {/* Inner orbiting circle with platform icons */}
                  <div className="absolute inset-0" style={{ transform: 'scale(0.6)' }}>
                    <OrbitingCircles
                      radius={120}
                      duration={12}
                      delay={1.5}
                      iconSize={40}
                      reverse={true}
                    >
                      <div className="text-gray-300"><GoogleDriveIcon size={32} /></div>
                      <div className="text-gray-400"><NotionIcon size={32} /></div>
                      <div className="text-gray-300"><WhatsAppIcon size={32} /></div>
                      <div className="text-gray-400"><AIIcon size={32} /></div>
                    </OrbitingCircles>
                  </div>
                  
                  {/* Central AI core with glow effect */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center shadow-2xl shadow-gray-500/50 animate-pulse">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <Bot size={36} className="text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating AI particles around the central core - Monochrome version */}
                  <div className="absolute top-8 left-8 w-6 h-6 bg-white rounded-full opacity-80 animate-bounce"></div>
                  <div className="absolute bottom-8 right-8 w-6 h-6 bg-gray-400 rounded-full opacity-80 animate-bounce delay-300"></div>
                  <div className="absolute top-8 right-8 w-6 h-6 bg-gray-300 rounded-full opacity-80 animate-bounce delay-700"></div>
                  <div className="absolute bottom-8 left-8 w-6 h-6 bg-white rounded-full opacity-80 animate-bounce delay-1000"></div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Stats preview with Monochrome Design */}
        <div className="w-full bg-black py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-gray-400 transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-sm text-gray-300">Happy Clients</div>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-gray-400 transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-2">99%</div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-gray-400 transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-gray-300">AI Support</div>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-gray-400 transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-2">3x</div>
              <div className="text-sm text-gray-300">ROI Average</div>
            </div>
          </div>
        </div>

        {/* KPI & ROI Charts Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white font-inter mb-6">
                Performance Metrics & ROI
              </h2>
              <p className="text-lg text-gray-300 font-inter leading-relaxed max-w-3xl mx-auto">
                Track your business transformation with real-time KPI improvements and ROI metrics
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Line Chart - KPI Trends */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-400 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 text-white font-inter">
                  KPI Trends Over Time
                </h3>
                <LineChart
                  data={lineChartData}
                  title="Monthly Performance Metrics"
                  height={350}
                />
                <p className="text-sm text-gray-400 mt-4 font-inter">
                  Track process efficiency, automation rate, and error reduction progress
                </p>
              </div>

              {/* Bar Chart - ROI Comparison */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-400 transition-all duration-300">
                <h3 className="text-xl sm:text-2xl font-medium text-white font-inter mb-4">
                  ROI by Department
                </h3>
                <BarChart
                  data={barChartData}
                  title="Cost Savings & Revenue Impact"
                  height={350}
                />
                <p className="text-sm text-gray-400 mt-4 font-inter">
                  Compare cost savings, revenue increase, and productivity gains across departments
                </p>
              </div>
            </div>

            {/* Donut Chart - Resource Allocation */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-400 transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-medium text-white font-inter mb-4 text-center">
                Automated Workflow Distribution
              </h3>
              <DonutChart
                data={donutChartData}
                title="Workflows Automated by Department"
                height={400}
              />
              <p className="text-sm text-gray-400 mt-4 text-center font-inter">
                Distribution of automated workflows across different business departments
              </p>
            </div>

            {/* Enhanced Progress Bars & KPI Visualization Demo Section */}
            <div className="mt-16">
              <h3 className="text-xl sm:text-2xl font-medium text-white font-inter mb-8 text-center">
                Enhanced Progress Metrics & KPI Visualization
              </h3>
              
              {/* Enhanced Linear Progress Bars with Tooltips */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-8">
                <h4 className="text-xl sm:text-2xl font-medium text-white font-inter mb-4">Process Completion with Detailed Insights</h4>
                <div className="space-y-6">
                  <LinearProgressBar
                    value={75}
                    label="Automation Setup"
                    description="All core tasks configured, final integrations pending"
                    tooltip="Includes: Workflow design, API integrations, testing protocols, and documentation"
                    color="primary"
                    size="md"
                    showValue={true}
                    trend="up"
                  />
                  <LinearProgressBar
                    value={90}
                    label="Data Migration"
                    description="Historical data transferred, real-time sync in progress"
                    tooltip="Data integrity checks completed, sync performance optimized"
                    color="success"
                    size="md"
                    showValue={true}
                    trend="steady"
                  />
                  <LinearProgressBar
                    value={45}
                    label="AI Training"
                    description="Model training underway with initial dataset"
                    tooltip="Using 12 months of historical data, expected completion in 3 days"
                    color="warning"
                    size="md"
                    showValue={true}
                    trend="up"
                  />
                  <LinearProgressBar
                    value={25}
                    label="Integration Testing"
                    description="Initial test cycles completed, comprehensive testing ongoing"
                    tooltip="Testing all API endpoints, webhook integrations, and error handling"
                    color="error"
                    size="md"
                    showValue={true}
                    trend="down"
                  />
                </div>
              </div>

              {/* Enhanced Circular KPI Charts */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-8">
                <h4 className="text-xl sm:text-2xl font-medium text-white font-inter mb-4">Performance KPIs with Context</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <CircularProgressBar
                    value={82}
                    label="Efficiency"
                    description="Workflow throughput at optimal levels"
                    tooltip="Measured by tasks completed per hour vs. manual processing"
                    color="primary"
                    size="md"
                    showValue={true}
                    trend="up"
                  />
                  <CircularProgressBar
                    value={95}
                    label="Uptime"
                    description="System reliability exceeding SLA targets"
                    tooltip="99.95% uptime over last 30 days, zero critical incidents"
                    color="success"
                    size="md"
                    showValue={true}
                    trend="steady"
                  />
                  <CircularProgressBar
                    value={67}
                    label="Adoption"
                    description="Team engagement growing steadily"
                    tooltip="45% of team actively using new features, training ongoing"
                    color="warning"
                    size="md"
                    showValue={true}
                    trend="up"
                  />
                  <CircularProgressBar
                    value={38}
                    label="Cost Savings"
                    description="Initial ROI calculations showing positive trend"
                    tooltip="Projected 65% reduction in operational costs at full implementation"
                    color="error"
                    size="md"
                    showValue={true}
                    trend="up"
                  />
                </div>
              </div>

              {/* Metrics Section Demo */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <h4 className="text-xl sm:text-2xl font-medium text-white font-inter mb-4">Comprehensive Metrics Dashboard</h4>
                <p className="text-gray-300 mb-6 text-sm">
                  Track all key performance indicators in one unified view with real-time updates and trend analysis
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Business Metrics */}
                  <div>
                    <h5 className="text-md font-semibold mb-4 text-white">Business Performance</h5>
                    <LinearProgressBar
                      value={88}
                      label="Revenue Growth"
                      description="Quarter-over-quarter increase exceeding targets"
                      tooltip="Attributed to improved customer retention and new feature adoption"
                      color="success"
                      size="sm"
                      showValue={true}
                      trend="up"
                    />
                    <LinearProgressBar
                      value={72}
                      label="Customer Satisfaction"
                      description="NPS scores showing positive momentum"
                      tooltip="Survey responses indicate 94% satisfaction with automation features"
                      color="primary"
                      size="sm"
                      showValue={true}
                      trend="up"
                    />
                    <LinearProgressBar
                      value={63}
                      label="Market Penetration"
                      description="New customer acquisition accelerating"
                      tooltip="Expanding into 3 new verticals with targeted campaigns"
                      color="warning"
                      size="sm"
                      showValue={true}
                      trend="steady"
                    />
                  </div>
                  
                  {/* Technical Metrics */}
                  <div>
                    <h5 className="text-md font-semibold mb-4 text-white">Technical Performance</h5>
                    <LinearProgressBar
                      value={97}
                      label="System Reliability"
                      description="Infrastructure performing at optimal levels"
                      tooltip="Zero downtime incidents, all systems meeting performance SLAs"
                      color="success"
                      size="sm"
                      showValue={true}
                      trend="steady"
                    />
                    <LinearProgressBar
                      value={81}
                      label="Data Accuracy"
                      description="AI predictions matching expected outcomes"
                      tooltip="Machine learning models achieving 92% prediction accuracy"
                      color="primary"
                      size="sm"
                      showValue={true}
                      trend="up"
                    />
                    <LinearProgressBar
                      value={56}
                      label="Integration Coverage"
                      description="Third-party platform connections expanding"
                      tooltip="15+ integrated platforms, with 8 more in development pipeline"
                      color="warning"
                      size="sm"
                      showValue={true}
                      trend="up"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State Demo (commented out for production) */}
            {/*
            <div className="mt-16">
              <h3 className="text-2xl font-semibold mb-8 text-white text-center">Loading States Demo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30">
                  <h4 className="text-lg font-semibold mb-4 text-white">Loading Progress Bars</h4>
                  <LinearProgressBar
                    isLoading={true}
                    label="Loading Automation Data"
                    description="Fetching real-time performance metrics"
                    size="md"
                  />
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
                  <h4 className="text-lg font-semibold mb-4 text-white">Loading KPI Charts</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <CircularProgressBar
                      isLoading={true}
                      label="Loading Efficiency"
                      size="sm"
                    />
                    <CircularProgressBar
                      isLoading={true}
                      label="Loading Uptime"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            */}
          </div>
        </section>

        {/* Sectors Section with MagicBento and Dark Gradient - Hidden per request */}
        {/*
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-inter">
                Sectors We Transform
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-inter font-normal">
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
        */}

        {/* Case Studies Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-inter">
                Success Stories
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-inter">
                Discover how our AI-powered solutions have transformed businesses across various industries
              </p>
            </div>
            <CaseStudyGrid />
          </div>
        </section>

        {/* Social and Automation Icons Dock with Monochrome Effects */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <Dock direction="middle" iconSize={60} iconMagnification={100} iconDistance={140}>
                <DockIcon>
                  <div className="text-white hover:text-gray-300 transition-all duration-300"><Share2 size={28} /></div>
                </DockIcon>
                <DockIcon>
                  <div className="text-white hover:text-gray-300 transition-all duration-300"><Bot size={28} /></div>
                </DockIcon>
                <DockIcon>
                  <div className="text-white hover:text-gray-300 transition-all duration-300"><Mail size={28} /></div>
                </DockIcon>
                <DockIcon>
                  <div className="text-white hover:text-gray-300 transition-all duration-300"><Linkedin size={28} /></div>
                </DockIcon>
                <DockIcon>
                  <div className="text-white hover:text-gray-300 transition-all duration-300"><Twitter size={28} /></div>
                </DockIcon>
                <DockIcon>
                  <div className="text-white hover:text-gray-300 transition-all duration-300"><Instagram size={28} /></div>
                </DockIcon>
              </Dock>
            </div>
          </div>
        </section>

        {/* Client Logos Marquee Section with Monochrome Design */}
        <section className="py-20 bg-black overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h5 className="text-xl font-semibold text-center text-white mb-8 font-inter">
              Trusted by Industry Leaders
            </h5>
            <ClientLogosMarquee />
          </div>
        </section>

        {/* Automation Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-inter">
                How We Automate Your Success
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-inter">
                Our AI-powered platform handles the heavy lifting so you can focus on what matters most - growing your business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {automationFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-400 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white font-inter">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm font-inter">
                    {feature.description}
                  </p>
                  <div className="text-white text-sm font-medium font-inter">
                    {feature.stats}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Presentation Strategy with Tabbed Interface */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-inter">
                Our AI-Powered Services
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-inter">
                Comprehensive automation solutions tailored to your business needs
              </p>
            </div>

            {/* Process Stepper - Enhanced 4-Step Visualization */}
            <div className="mb-16">
              <ProcessStepper
                currentStep={2}
                className="bg-gray-900 rounded-xl p-8 border border-gray-700"
              />
            </div>

            {/* Tabbed Service Interface */}
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
              <div className="flex flex-wrap gap-4 mb-8">
                <button className="px-6 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-white font-semibold hover:bg-gray-700 transition-all duration-300">
                  AI Marketing Automation
                </button>
                <button className="px-6 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-white font-semibold hover:bg-gray-700 transition-all duration-300">
                  NextJS/React Development
                </button>
                <button className="px-6 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-white font-semibold hover:bg-gray-700 transition-all duration-300">
                  CRM Automation
                </button>
                <button className="px-6 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-white font-semibold hover:bg-gray-700 transition-all duration-300">
                  Content Automation
                </button>
                <button className="px-6 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-white font-semibold hover:bg-gray-700 transition-all duration-300">
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
                      <span className="text-gray-300">40% Conversion Rate</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">After Automation</span>
                      <span className="text-white">85% Conversion Rate</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-inter">
                Trusted by Industry Leaders
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-inter font-normal">
                Real results from businesses that transformed with Robofy
              </p>
            </div>

            {/* Success Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-gray-400 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">80%</div>
                <h3 className="text-xl font-semibold text-white mb-2">Time Savings</h3>
                <p className="text-gray-300">Average reduction in manual tasks</p>
              </div>
              <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-gray-400 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">40%</div>
                <h3 className="text-xl font-semibold text-white mb-2">Cost Reduction</h3>
                <p className="text-gray-300">Average operational cost savings</p>
              </div>
              <div className="text-center p-6 bg-gray-900 rounded-xl border border-gray-700 hover:border-gray-400 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">3x</div>
                <h3 className="text-xl font-semibold text-white mb-2">ROI Increase</h3>
                <p className="text-gray-300">Average return on investment</p>
              </div>
            </div>

            {/* Testimonials Carousel */}
            <TestimonialsCarousel />

            {/* Industry Certifications */}
            <div className="text-center mt-16">
              <h3 className="text-2xl font-semibold text-white mb-6">Industry Recognized & Certified</h3>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <span className="text-white font-semibold">AI Ethics Certified</span>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <span className="text-white font-semibold">GDPR Compliant</span>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <span className="text-white font-semibold">ISO 27001 Certified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team & Culture Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <TeamSection teamMembers={teamMembers} />
        </section>

        {/* Pricing Section - Hidden per request */}

        {/* Final CTA Section with Conversion Optimization */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-inter">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-inter font-normal">
              Join thousands of businesses already revolutionizing their operations with Robofy
            </p>
            
            {/* Multiple CTA Options for A/B Testing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <button
                 onClick={handleFormOpen}
                 className="bg-white hover:bg-gray-100 text-black font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg"
               >
                 Start Free Automation Audit
               </button>
               <button
                 onClick={handleFormOpen}
                 className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg"
               >
                 Get Personalized Demo
               </button>
             </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button className="border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-lg transition-all duration-300 text-lg">
                 Watch Case Studies
               </button>
               <button className="border-2 border-gray-400 text-gray-400 hover:bg-gray-400/10 font-semibold py-4 px-8 rounded-lg transition-all duration-300 text-lg">
                 Compare Plans
               </button>
             </div>

          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <InteractiveDemoWidget />
          </div>
        </section>

        {/* MagicBento Showcase Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white font-inter">
                Interactive Platform Features
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-inter font-normal">
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

      {/* Modal Walkthrough for Product Demo */}
      <ModalWalkthrough
        isOpen={isWalkthroughOpen}
        onClose={handleWalkthroughClose}
        steps={walkthroughSteps}
        onComplete={handleWalkthroughComplete}
        skipButtonText="Skip Tour"
        closeButtonText="Get Started"
      />
      
      {/* Floating Demo Button */}
      <FloatingDemoButton onClick={handleFormOpen} />

    </>
  );
}