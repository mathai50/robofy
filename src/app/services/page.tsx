'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Workflow,
  MessageSquare,
  Database,
  BarChart3,
  Zap,
  Cpu,
  Cloud,
  Shield,
  Clock,
  TrendingUp,
  Code,
  Server,
  Brain,
  Bot,
  FileText,
  Users,
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  timeline: string;
  roi: string;
  technologies: { name: string; icon: React.ReactNode }[];
}

const servicesData: Service[] = [
  {
    id: 'workflow-automation',
    title: 'Workflow Automation',
    icon: <Workflow className="w-8 h-8" />,
    description: 'Streamline your business operations with intelligent workflow automation that eliminates manual tasks and reduces errors. Our AI-powered solutions analyze your existing processes to identify optimization opportunities and implement seamless automation that integrates with your current systems.',
    features: [
      'Custom workflow design and implementation',
      'Multi-system integration capabilities',
      'Real-time process monitoring and analytics',
      'Automated task assignment and escalation',
      'Error handling and recovery systems',
      'Scalable architecture for business growth'
    ],
    timeline: '2-4 weeks implementation',
    roi: '60-80% reduction in manual processing time',
    technologies: [
      { name: 'Python', icon: <Code className="w-5 h-5" /> },
      { name: 'Node.js', icon: <Server className="w-5 h-5" /> },
      { name: 'AWS', icon: <Cloud className="w-5 h-5" /> },
      { name: 'Docker', icon: <Cpu className="w-5 h-5" /> }
    ]
  },
  {
    id: 'ai-chatbots',
    title: 'AI Chatbots',
    icon: <MessageSquare className="w-8 h-8" />,
    description: 'Enhance customer engagement with intelligent AI chatbots that provide 24/7 support and personalized interactions. Our chatbots leverage natural language processing and machine learning to understand customer intent and deliver accurate, context-aware responses.',
    features: [
      'Natural language understanding (NLU)',
      'Multi-channel deployment (web, mobile, social)',
      'Sentiment analysis and emotion detection',
      'Seamless handoff to human agents',
      'Continuous learning and improvement',
      'Integration with CRM and support systems'
    ],
    timeline: '3-5 weeks development',
    roi: '40% reduction in support costs, 24/7 availability',
    technologies: [
      { name: 'React', icon: <Code className="w-5 h-5" /> },
      { name: 'TensorFlow', icon: <Brain className="w-5 h-5" /> },
      { name: 'Dialogflow', icon: <Bot className="w-5 h-5" /> },
      { name: 'AWS Lambda', icon: <Zap className="w-5 h-5" /> }
    ]
  },
  {
    id: 'data-pipelines',
    title: 'Data Pipelines',
    icon: <Database className="w-8 h-8" />,
    description: 'Transform raw data into actionable insights with robust data pipeline solutions. Our ETL processes ensure data quality, consistency, and reliability while providing real-time analytics capabilities for informed decision-making.',
    features: [
      'Real-time data ingestion and processing',
      'Data validation and quality assurance',
      'Automated data transformation workflows',
      'Scalable storage and processing infrastructure',
      'Data lineage and audit trails',
      'Integration with BI and visualization tools'
    ],
    timeline: '4-6 weeks setup and optimization',
    roi: '50% faster data processing, improved decision accuracy',
    technologies: [
      { name: 'Apache Spark', icon: <Zap className="w-5 h-5" /> },
      { name: 'Kafka', icon: <Server className="w-5 h-5" /> },
      { name: 'Snowflake', icon: <Cloud className="w-5 h-5" /> },
      { name: 'dbt', icon: <Database className="w-5 h-5" /> }
    ]
  },
  {
    id: 'analytics-reporting',
    title: 'Analytics & Reporting',
    icon: <BarChart3 className="w-8 h-8" />,
    description: 'Gain deep insights into your business performance with advanced analytics and automated reporting solutions. Our dashboards provide real-time visibility into key metrics, trends, and opportunities for optimization across all business functions.',
    features: [
      'Custom dashboard development',
      'Real-time KPI monitoring',
      'Predictive analytics and forecasting',
      'Automated report generation and distribution',
      'Data visualization and storytelling',
      'Cross-platform data integration'
    ],
    timeline: '3-5 weeks implementation',
    roi: '45% improvement in data-driven decisions, time savings',
    technologies: [
      { name: 'Tableau', icon: <BarChart3 className="w-5 h-5" /> },
      { name: 'Power BI', icon: <TrendingUp className="w-5 h-5" /> },
      { name: 'Looker', icon: <Target className="w-5 h-5" /> },
      { name: 'Python', icon: <Code className="w-5 h-5" /> }
    ]
  }
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(servicesData[0].id);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for mobile view on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleServiceChange = (serviceId: string) => {
    if (serviceId === activeService) return;
    
    setIsTransitioning(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setActiveService(serviceId);
      setIsTransitioning(false);
    }, 300);
  };

  const currentService = servicesData.find(service => service.id === activeService);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Our Services
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive AI-powered solutions designed to transform your business operations and drive growth
          </p>
        </div>

        {/* Tab Navigation - Horizontal for desktop, Vertical accordion for mobile */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          {/* Desktop Tab Navigation */}
          <div className="hidden md:block">
            <div 
              className="flex border-b border-gray-700"
              role="tablist"
              aria-label="Service categories"
            >
              {servicesData.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceChange(service.id)}
                  className={`flex items-center px-6 py-4 font-semibold text-lg transition-all duration-300 border-b-2 ${
                    activeService === service.id
                      ? 'border-blue-400 text-blue-400 bg-blue-500/10'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                  role="tab"
                  aria-selected={activeService === service.id}
                  aria-controls={`tabpanel-${service.id}`}
                  id={`tab-${service.id}`}
                  tabIndex={activeService === service.id ? 0 : -1}
                >
                  <span className="mr-3" aria-hidden="true">{service.icon}</span>
                  {service.title}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Accordion Navigation */}
          <div className="md:hidden">
            {servicesData.map((service) => (
              <div key={service.id} className="border-b border-gray-700 last:border-b-0">
                <button
                  onClick={() => handleServiceChange(activeService === service.id ? '' : service.id)}
                  className="flex items-center justify-between w-full px-6 py-4 font-semibold text-lg text-left"
                  aria-expanded={activeService === service.id}
                  aria-controls={`accordion-panel-${service.id}`}
                  id={`accordion-${service.id}`}
                >
                  <div className="flex items-center">
                    <span className="mr-3" aria-hidden="true">{service.icon}</span>
                    {service.title}
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                      activeService === service.id ? 'rotate-90' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`accordion-panel-${service.id}`}
                  className={`px-6 pb-4 transition-all duration-300 ease-in-out overflow-hidden ${
                    activeService === service.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  role="region"
                  aria-labelledby={`accordion-${service.id}`}
                >
                  {activeService === service.id && (
                    <ServiceContent service={service} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Tab Content */}
          <div className="hidden md:block">
            {servicesData.map((service) => (
              <div
                key={service.id}
                id={`tabpanel-${service.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${service.id}`}
                className={`p-6 transition-all duration-500 ease-in-out ${
                  activeService === service.id
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 absolute pointer-events-none'
                }`}
                style={{
                  transition: 'opacity 500ms ease-in-out, transform 500ms ease-in-out'
                }}
              >
                {activeService === service.id && (
                  <ServiceContent service={service} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how our AI-powered services can help you achieve your business goals
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}

function ServiceContent({ service }: { service: Service }) {
  return (
    <div className="space-y-8">
      {/* Service Header */}
      <div className="flex items-center">
        <div className="p-3 bg-blue-500/20 rounded-lg mr-4">
          {service.icon}
        </div>
        <h2 className="text-3xl font-bold text-white">{service.title}</h2>
      </div>

      {/* Description */}
      <div>
        <p className="text-lg text-gray-300 leading-relaxed">
          {service.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Features List */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
            Core Features & Benefits
          </h3>
          <ul className="space-y-3">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline and ROI */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-400" />
              Project Timeline
            </h3>
            <p className="text-gray-300">{service.timeline}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-400/30">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Expected ROI
            </h3>
            <p className="text-gray-300">{service.roi}</p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Cpu className="w-5 h-5 mr-2 text-purple-400" />
          Technology Stack
        </h3>
        <div className="flex flex-wrap gap-4">
          {service.technologies.map((tech, index) => (
            <div
              key={index}
              className="flex items-center px-4 py-2 bg-white/5 rounded-lg border border-gray-600"
            >
              <span className="mr-2 text-blue-400">{tech.icon}</span>
              <span className="text-gray-300">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}