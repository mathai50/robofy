'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { RobofyCTA, FloatingCTAButton } from '@/components/ui/RobofyCTA';
import { Playfair_Display, Inter } from 'next/font/google';

// Load fonts locally for this page
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair'
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter'
});

// Accounting Firm Professional Color Palette
const accountingColors = {
  primary: '#1e40af',     // Deep blue for trust and professionalism
  secondary: '#059669',   // Emerald green for growth and success
  accent: '#7c3aed',      // Purple for innovation and technology
  neutral: '#374151',     // Dark gray for text and structure
  light: '#f8fafc',       // Light backgrounds
  white: '#ffffff',       // Pure white for highlights
  silver: '#9ca3af',      // Silver for subtle elements
  gold: '#d97706'         // Gold for premium services
};

// Business info for this demo
const accountingFirm = {
  name: 'Summit Financial Partners',
  tagline: 'Precision. Integrity. Growth.',
  subtitle: 'Strategic Financial Solutions for Modern Businesses',
  phone: '(555) 123-LEDGER',
  email: 'info@summitfinancial.com',
  address: '1000 Financial Plaza, Business District, BD 12345',
  hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM',
  description: 'Leading accounting and financial consulting firm specializing in strategic tax planning, audit excellence, and business growth advisory services.'
};

// Interactive Service Hotspots for Hero Section - Organized Layout
const serviceHotspots = [
  // Top row - Core Services
  {
    id: 'audit',
    title: 'Audit & Assurance',
    description: 'Comprehensive audit services with cutting-edge technology',
    position: { x: 25, y: 25 },
    icon: '🔍',
    color: accountingColors.primary,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'tax',
    title: 'Tax Strategy',
    description: 'Strategic tax planning and compliance solutions',
    position: { x: 50, y: 25 },
    icon: '📊',
    color: accountingColors.secondary,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'technology',
    title: 'Financial Technology',
    description: 'AI-powered financial insights and automation',
    position: { x: 75, y: 25 },
    icon: '⚡',
    color: accountingColors.accent,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
  },

  // Middle row - Advisory Services
  {
    id: 'consulting',
    title: 'Business Consulting',
    description: 'Strategic advisory for sustainable business growth',
    position: { x: 35, y: 50 },
    icon: '🚀',
    color: accountingColors.gold,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'payroll',
    title: 'Payroll Services',
    description: 'Efficient payroll management and HR solutions',
    position: { x: 65, y: 50 },
    icon: '💼',
    color: accountingColors.primary,
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=2070&auto=format&fit=crop'
  },

  // Bottom row - Action
  {
    id: 'contact',
    title: 'Get Started',
    description: 'Begin your financial transformation journey',
    position: { x: 50, y: 75 },
    icon: '✨',
    color: accountingColors.secondary,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2126&auto=format&fit=crop'
  }
];

// Animation variants for micro-animations
const hotspotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  hover: { scale: 1.1 }
};

const overlayVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

const slideUpVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

// Floating Calculator Navigation Element
const FloatingCalculator = ({ onClick, position }: {
  onClick: () => void;
  position: { x: number; y: number };
}) => (
  <motion.button
    className="fixed z-40 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50"
    style={{ left: `${position.x}%`, top: `${position.y}%` }}
    whileHover={{ scale: 1.05, rotate: 15 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1, duration: 0.3 }}
  >
    <span className="text-2xl">🧮</span>
  </motion.button>
);

// Service Hotspot Component
const ServiceHotspot = ({ hotspot, onClick, isVisible }: {
  hotspot: typeof serviceHotspots[0];
  onClick: () => void;
  isVisible: boolean;
}) => (
  <motion.button
    className="absolute z-30 group"
    style={{
      left: `${hotspot.position.x}%`,
      top: `${hotspot.position.y}%`,
      transform: 'translate(-50%, -50%)'
    }}
    variants={hotspotVariants}
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    whileHover="hover"
    transition={{ duration: 0.3, ease: "easeOut" }}
    onClick={onClick}
  >
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/50"
      style={{ backgroundColor: hotspot.color }}
    >
      <span className="text-2xl">{hotspot.icon}</span>
    </div>
    <motion.div
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none backdrop-blur-sm"
      initial={{ opacity: 0, y: -10 }}
      whileHover={{ opacity: 1, y: 0 }}
    >
      {hotspot.title}
    </motion.div>
  </motion.button>
);

// Service Overlay Component
const ServiceOverlay = ({ hotspot, onClose }: {
  hotspot: typeof serviceHotspots[0];
  onClose: () => void;
}) => (
  <motion.div
    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    variants={overlayVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{ duration: 0.3, ease: "easeOut" }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
      variants={overlayVariants}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
          {hotspot.title}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden">
          <Image
            src={hotspot.image}
            alt={hotspot.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 text-lg leading-relaxed">
            {hotspot.description}
          </p>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">Key Services:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Strategic financial planning and analysis
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Risk assessment and mitigation strategies
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Compliance monitoring and reporting
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Technology integration and automation
              </li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
              Learn More
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 px-6 py-3">
              Get Quote
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Contact Consultation Overlay
const ContactConsultationOverlay = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    variants={overlayVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{ duration: 0.3, ease: "easeOut" }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
      variants={overlayVariants}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
          Schedule Consultation
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        <p className="text-gray-700 text-lg">
          Let's discuss how we can optimize your financial strategy and drive sustainable growth for your business.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Company"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Technology</option>
              <option>Healthcare</option>
              <option>Manufacturing</option>
              <option>Retail</option>
              <option>Professional Services</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
            <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Video Call</option>
              <option>Phone Call</option>
              <option>In-Person Meeting</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Focus Area</label>
          <div className="grid grid-cols-2 gap-3">
            {['Tax Strategy', 'Audit Services', 'Business Growth', 'Technology Integration', 'Payroll Optimization', 'Financial Planning'].map((focus) => (
              <button
                key={focus}
                className="p-3 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg text-gray-700 hover:text-blue-700 transition-all duration-300"
              >
                {focus}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
          <textarea
            rows={4}
            placeholder="Tell us about your current challenges and goals..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-4">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3">
            Schedule Consultation
          </Button>
          <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 py-3">
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Main component
export default function AccountingFirmLandingPage() {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [hotspotsVisible, setHotspotsVisible] = useState(false);
  const [showRobofyCTA, setShowRobofyCTA] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show hotspots after a short delay
    const timer = setTimeout(() => {
      setHotspotsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleHotspotClick = (hotspotId: string) => {
    setActiveOverlay(hotspotId);
  };

  const handleOverlayClose = () => {
    setActiveOverlay(null);
  };

  const selectedHotspot = serviceHotspots.find(hotspot => hotspot.id === activeOverlay);

  // Industries data
  const industries = [
    {
      name: 'Technology',
      description: 'SaaS, software development, and tech startups',
      metrics: { clients: '150+', growth: '45%', satisfaction: '98%' },
      color: accountingColors.primary
    },
    {
      name: 'Healthcare',
      description: 'Medical practices, clinics, and healthcare organizations',
      metrics: { clients: '85+', growth: '32%', satisfaction: '96%' },
      color: accountingColors.secondary
    },
    {
      name: 'Manufacturing',
      description: 'Production facilities and industrial companies',
      metrics: { clients: '120+', growth: '28%', satisfaction: '94%' },
      color: accountingColors.accent
    },
    {
      name: 'Professional Services',
      description: 'Law firms, consulting, and service providers',
      metrics: { clients: '200+', growth: '38%', satisfaction: '97%' },
      color: accountingColors.gold
    }
  ];

  // JSON-LD Schema for SEO
  const generateAccountingSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "AccountingService",
      "name": "Summit Financial Partners",
      "description": "Strategic Financial Solutions for Modern Businesses",
      "telephone": "(555) 123-LEDGER",
      "email": "info@summitfinancial.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1000 Financial Plaza",
        "addressLocality": "Business District",
        "addressRegion": "BD",
        "postalCode": "12345"
      },
      "openingHours": "Mo-Fr 08:00-18:00, Sa 09:00-14:00",
      "serviceOffered": [
        "Audit & Assurance",
        "Tax Strategy & Planning",
        "Business Consulting",
        "Payroll Services",
        "Financial Technology Solutions"
      ]
    };
  };

  const schema = generateAccountingSchema();

  return (
    <div className={`${playfair.variable} ${inter.variable}`} style={{
      '--accounting-primary': accountingColors.primary,
      '--accounting-secondary': accountingColors.secondary,
      '--accounting-accent': accountingColors.accent,
      '--accounting-neutral': accountingColors.neutral,
      '--accounting-light': accountingColors.light,
      '--accounting-gold': accountingColors.gold
    } as React.CSSProperties}>
     {/* SEO Schema */}
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
     />

     {/* Fullscreen Hero Section */}
     <section
       ref={heroRef}
       className="relative min-h-screen flex items-center justify-center overflow-hidden"
     >
       {/* Background Video/Image */}
       <div className="absolute inset-0 z-0">
         <Image
           src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
           alt="Modern business financial district skyline"
           fill
           className="object-cover"
           priority
         />
         <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/30 to-emerald-900/20" />
       </div>

        {/* Interactive Service Hotspots - Organized Layout */}
        {serviceHotspots.map((hotspot, index) => (
          <ServiceHotspot
            key={hotspot.id}
            hotspot={hotspot}
            onClick={() => handleHotspotClick(hotspot.id)}
            isVisible={hotspotsVisible}
          />
        ))}

        {/* Visual Flow Lines - Only show after hotspots are visible */}
        {hotspotsVisible && (
          <>
            {/* Top row connection line */}
            <div className="fixed top-[25%] left-[25%] w-[50%] h-[1px] z-20">
              <div className="w-full h-full bg-gradient-to-r from-blue-500/30 via-emerald-500/30 to-purple-500/30"></div>
            </div>
            {/* Middle row connection line */}
            <div className="fixed top-[50%] left-[35%] w-[30%] h-[1px] z-20">
              <div className="w-full h-full bg-gradient-to-r from-yellow-500/30 to-blue-500/30"></div>
            </div>
            {/* Bottom arrow pointing to calculator */}
            <div className="fixed top-[75%] left-[49%] w-[2%] h-[15%] z-20">
              <div className="w-full h-full bg-gradient-to-b from-emerald-500/30 to-transparent"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[8px] border-l-transparent border-r-transparent border-t-emerald-500/50"></div>
            </div>
          </>
        )}

        {/* Floating Calculator Navigation - Centered below main hotspots */}
        <FloatingCalculator
          onClick={() => handleHotspotClick('contact')}
          position={{ x: 50, y: 90 }}
        />

        {/* Main Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h1
              className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Summit
              <span className="block text-blue-300">Financial</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl lg:text-3xl mb-8 font-light opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Precision. Integrity. Growth.
            </motion.p>

            <motion.p
              className="text-lg md:text-xl mb-12 opacity-80 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Strategic Financial Solutions for Modern Businesses - Partner with us to navigate complexity and achieve sustainable growth.
            </motion.p>

            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-400/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => handleHotspotClick('contact')}
            >
              Start Your Success Story
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm">Explore Services</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-white/70 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services Excellence Section */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-blue-600/20 text-blue-700 border-blue-400/30">
                ✨ Service Excellence
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)]">
                Comprehensive Financial Solutions
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                From audit assurance to strategic tax planning, we deliver integrated financial services that drive business success.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Audit & Assurance',
                  description: 'Comprehensive audit services with advanced risk assessment and compliance monitoring.',
                  icon: '🔍',
                  color: accountingColors.primary,
                  metrics: '99.8% accuracy rate'
                },
                {
                  title: 'Tax Strategy',
                  description: 'Strategic tax planning and optimization to minimize liabilities and maximize savings.',
                  icon: '📊',
                  color: accountingColors.secondary,
                  metrics: 'Average 23% tax savings'
                },
                {
                  title: 'Business Consulting',
                  description: 'Strategic advisory services for sustainable growth and operational efficiency.',
                  icon: '🚀',
                  color: accountingColors.accent,
                  metrics: '85% growth improvement'
                },
                {
                  title: 'Payroll Services',
                  description: 'Streamlined payroll management with integrated HR solutions and compliance.',
                  icon: '💼',
                  color: accountingColors.gold,
                  metrics: '100% compliance record'
                }
              ].map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={slideUpVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group cursor-pointer bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50"
                  onClick={() => handleHotspotClick(service.title.toLowerCase().split(' ')[0])}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: service.color }}
                  >
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 text-center">
                    {service.description}
                  </p>
                  <div className="text-center">
                    <Badge className="bg-gray-100 text-gray-700">
                      {service.metrics}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="max-w-7xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-emerald-600/20 text-emerald-300 border-emerald-400/30">
                🏢 Industry Expertise
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-playfair)]">
                Specialized by Industry
              </h2>
              <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                Our deep industry knowledge ensures tailored solutions that address sector-specific challenges and opportunities.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {industries.map((industry, index) => (
                <motion.div
                  key={industry.name}
                  variants={slideUpVariants}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="group cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto"
                    style={{ backgroundColor: industry.color }}
                  >
                    🏭
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center group-hover:text-blue-300 transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-white/80 leading-relaxed mb-6 text-center">
                    {industry.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Active Clients</span>
                      <span className="text-white font-semibold">{industry.metrics.clients}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Avg. Growth</span>
                      <span className="text-white font-semibold">{industry.metrics.growth}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Satisfaction</span>
                      <span className="text-white font-semibold">{industry.metrics.satisfaction}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Integration Section */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-white via-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.3
                }
              }
            }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-purple-600/20 text-purple-700 border-purple-400/30">
                ⚡ Financial Technology
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)]">
                AI-Powered Financial Insights
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Leverage cutting-edge technology for real-time financial analytics, predictive insights, and automated reporting.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={slideUpVariants}
                className="space-y-8"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                      🤖
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 ml-4">AI Analytics</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Advanced machine learning algorithms analyze your financial data to identify trends, predict outcomes, and optimize strategies.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                      📈
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 ml-4">Real-Time Dashboards</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Interactive dashboards provide live financial metrics, KPI tracking, and performance indicators for informed decision-making.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl">
                      🔒
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 ml-4">Secure Automation</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Automated financial processes with bank-level security ensure accuracy, compliance, and operational efficiency.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={slideUpVariants}
                className="relative"
              >
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 backdrop-blur-sm border border-white/50">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Technology Benefits</h3>
                    <p className="text-gray-700">See the impact of our integrated financial technology solutions</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/60 rounded-lg">
                      <span className="text-gray-700">Manual Processing</span>
                      <span className="text-gray-500 line-through">Time-intensive & error-prone</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                      <span className="font-semibold">AI-Powered Automation</span>
                      <span className="font-bold">⚡ 90% faster • 99.9% accurate</span>
                    </div>
                  </div>

                  <button className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    Explore Technology Solutions
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Client Success Stories */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="max-w-7xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-emerald-600/20 text-emerald-700 border-emerald-400/30">
                📈 Success Stories
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)]">
                Proven Results Across Industries
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Real clients. Real results. Discover how our strategic financial solutions have transformed businesses and driven sustainable growth.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  company: 'TechFlow Solutions',
                  industry: 'SaaS Technology',
                  challenge: 'Scaling financial operations during rapid growth',
                  solution: 'Implemented automated financial systems and strategic tax planning',
                  results: ['45% cost reduction', '99.5% reporting accuracy', '30% faster month-end close'],
                  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop',
                  color: accountingColors.primary
                },
                {
                  company: 'MedCare Partners',
                  industry: 'Healthcare',
                  challenge: 'Complex regulatory compliance and revenue optimization',
                  solution: 'Comprehensive audit framework and reimbursement strategy',
                  results: ['$2.3M revenue increase', '100% compliance record', '25% operational efficiency'],
                  image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2070&auto=format&fit=crop',
                  color: accountingColors.secondary
                },
                {
                  company: 'Prime Manufacturing',
                  industry: 'Industrial',
                  challenge: 'Cost control and supply chain financial visibility',
                  solution: 'Integrated cost accounting and predictive analytics',
                  results: ['32% cost optimization', 'Real-time visibility', '28% profit margin increase'],
                  image: 'https://images.unsplash.com/photo-1581092335878-4b8f23c0ad6e?q=80&w=2070&auto=format&fit=crop',
                  color: accountingColors.accent
                }
              ].map((success, index) => (
                <motion.div
                  key={success.company}
                  variants={slideUpVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={success.image}
                      alt={success.company}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className={`bg-${success.color.split('#')[1]}/90 text-white`}>
                        {success.industry}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {success.company}
                    </h3>
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Challenge:</strong> {success.challenge}
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        <strong>Solution:</strong> {success.solution}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {success.results.map((result) => (
                        <div key={result} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Expertise Section */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="max-w-7xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-blue-600/20 text-blue-300 border-blue-400/30">
                👥 Expert Team
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-playfair)]">
                Seasoned Financial Professionals
              </h2>
              <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                Our team combines decades of experience with innovative thinking to deliver exceptional financial solutions.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: 'Sarah Chen',
                  role: 'Managing Partner',
                  credentials: 'CPA, MBA • 20+ years',
                  expertise: ['Strategic Planning', 'M&A Advisory', 'Risk Management'],
                  image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070&auto=format&fit=crop',
                  color: accountingColors.primary
                },
                {
                  name: 'Michael Rodriguez',
                  role: 'Tax Strategy Director',
                  credentials: 'CPA, JD • 15+ years',
                  expertise: ['International Tax', 'Corporate Structuring', 'Compliance'],
                  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
                  color: accountingColors.secondary
                },
                {
                  name: 'Jennifer Park',
                  role: 'Audit Partner',
                  credentials: 'CPA, CFE • 18+ years',
                  expertise: ['Financial Audits', 'Internal Controls', 'Forensic Accounting'],
                  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
                  color: accountingColors.accent
                },
                {
                  name: 'David Thompson',
                  role: 'Technology Director',
                  credentials: 'CPA, MS • 12+ years',
                  expertise: ['Financial Systems', 'Data Analytics', 'Process Automation'],
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop',
                  color: accountingColors.gold
                }
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  variants={slideUpVariants}
                  whileHover={{ y: -15, scale: 1.05 }}
                  className="group cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg mb-2"
                        style={{ backgroundColor: member.color }}
                      >
                        👤
                      </div>
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-white/80 text-sm">{member.role}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-white/70 text-sm mb-4">{member.credentials}</p>
                    <div className="space-y-2">
                      {member.expertise.map((skill) => (
                        <div key={skill} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span className="text-white/80 text-sm">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overlay Modals */}
      <AnimatePresence>
        {selectedHotspot && selectedHotspot.id !== 'contact' && (
          <ServiceOverlay hotspot={selectedHotspot} onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'contact' && (
          <ContactConsultationOverlay onClose={handleOverlayClose} />
        )}
      </AnimatePresence>

      {/* Robofy CTA Components */}
      <FloatingCTAButton
        onClick={() => setShowRobofyCTA(true)}
        primaryColor={accountingColors.primary}
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Accounting Firm"
        primaryColor={accountingColors.primary}
        secondaryColor={accountingColors.secondary}
      />
    </div>
  );
}