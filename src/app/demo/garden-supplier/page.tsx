'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { RobofyCTA, FloatingCTAButton } from '@/components/ui/RobofyCTA';
import {
  Sprout,
  ShoppingCart,
  Truck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Leaf,
  Flower,
  TreePine,
  Bug,
  Calendar,
  Droplets,
  Sun,
  Cloud,
  Wind,
  Thermometer,
  Eye,
  Heart,
  Sparkles,
  ChevronDown,
  X,
  Menu,
  Search,
  Filter,
  Plus,
  Minus
} from 'lucide-react';

// Garden-inspired color palette
const gardenColors = {
  primary: '#2D5A27',      // Deep forest green
  secondary: '#8B5A3C',    // Rich earth brown
  accent1: '#F4D03F',      // Sunny yellow
  accent2: '#58D68D',      // Fresh leaf green
  accent3: '#AED6F1',      // Sky blue
  neutral: '#34495E',      // Dark slate
  light: '#F8F9FA'         // Soft white
};

// Business configuration
const business = {
  name: 'Bloom & Grow Garden Supplies',
  tagline: 'Cultivate Your Perfect Garden Oasis',
  subtitle: 'Premium garden supplies, organic seeds, expert tools, and seasonal plants delivered to your doorstep.',
  phone: '(555) GARDEN-1',
  email: 'hello@bloomandgrow.com',
  address: '456 Garden Way, Green Valley, GV 12345',
  hours: 'Mon - Sat: 8:00 AM - 6:00 PM, Sun: 10:00 AM - 4:00 PM',
};

// Garden services
const gardenServices = [
  {
    title: 'Premium Plants & Seeds',
    description: 'Organic seeds, seedlings, flowering plants, shrubs, and trees selected for your local climate and soil conditions.',
    icon: Sprout,
    features: ['Organic Certification', 'Local Climate Adapted', 'Expert Selection', 'Guaranteed Growth']
  },
  {
    title: 'Garden Tools & Equipment',
    description: 'Professional-grade tools, ergonomic hand tools, watering systems, and garden machinery for every gardening need.',
    icon: ShoppingCart,
    features: ['Professional Grade', 'Ergonomic Design', 'Lifetime Warranty', 'Expert Training']
  },
  {
    title: 'Soil & Fertilizers',
    description: 'Premium organic soils, compost, natural fertilizers, and soil amendments to nourish your garden naturally.',
    icon: Leaf,
    features: ['100% Organic', 'pH Balanced', 'Nutrient Rich', 'Eco-Friendly']
  },
  {
    title: 'Garden Décor & Furniture',
    description: 'Beautiful garden ornaments, outdoor furniture, lighting, and decorative elements to enhance your outdoor space.',
    icon: TreePine,
    features: ['Weather Resistant', 'Artisan Crafted', 'Unique Designs', 'Easy Assembly']
  },
  {
    title: 'Pest Control & Plant Care',
    description: 'Organic pest control solutions, plant protection products, and expert advice for maintaining healthy plants.',
    icon: Bug,
    features: ['Organic Solutions', 'Plant-Safe', 'Expert Guidance', 'Preventive Care']
  },
  {
    title: 'Seasonal Garden Planning',
    description: 'Expert consultation on seasonal planting schedules, garden design, and landscape planning services.',
    icon: Calendar,
    features: ['Personal Consultation', 'Custom Planning', 'Ongoing Support', 'Success Guarantee']
  }
];

// Seasonal features
const seasonalFeatures = [
  {
    season: 'Spring',
    icon: Flower,
    color: gardenColors.accent2,
    features: ['Flower Seeds', 'Vegetable Starts', 'Fertilizer Application', 'Pest Prevention']
  },
  {
    season: 'Summer',
    icon: Sun,
    color: gardenColors.accent1,
    features: ['Watering Systems', 'Shade Solutions', 'Heat Tolerant Plants', 'Mulching Services']
  },
  {
    season: 'Fall',
    icon: Leaf,
    color: gardenColors.primary,
    features: ['Bulb Planting', 'Tree Selection', 'Soil Amendment', 'Winter Preparation']
  },
  {
    season: 'Winter',
    icon: Cloud,
    color: gardenColors.accent3,
    features: ['Indoor Growing', 'Planning Tools', 'Equipment Storage', 'Spring Preparation']
  }
];

// Animation variants
const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
};

// Floating Navigation Component
const FloatingNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { id: 'hero', label: 'Home', icon: Sprout },
    { id: 'products', label: 'Products', icon: Leaf },
    { id: 'seasons', label: 'Seasons', icon: Sun },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          size="icon"
          className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-primary hover:scale-110 transition-all duration-300"
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl z-50 border-l border-gray-200"
          >
            <div className="p-6 pt-20">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      variants={fadeInUp}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-primary text-white shadow-lg'
                          : 'hover:bg-gray-50 hover:shadow-md'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive ? 'bg-white/20' : 'bg-primary/10 group-hover:bg-primary/20'
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-primary'}`} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-2 h-2 bg-white rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Interactive Product Card
const InteractiveProductCard = ({ service, index }: { service: any, index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="group cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <CardContent className="p-6">
          <motion.div
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300"
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <service.icon className="w-8 h-8 text-primary" />
          </motion.div>

          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
            {service.title}
          </h3>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {service.description}
          </p>

          {/* Expandable content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    {service.features.map((feature: string, featureIndex: number) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                  >
                    <Button className="w-full" size="sm">
                      Learn More
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand hint */}
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 2 + index * 0.5 }}
            className="flex justify-center mt-4"
          >
            <ChevronDown className="w-4 h-4 text-primary/30" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Seasonal Feature Component
const SeasonalFeature = ({ feature, index }: { feature: any, index: number }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group cursor-pointer"
    >
      <Card className="h-full bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardContent className="p-6 text-center">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: feature.color }}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {feature.season}
          </h3>

          <div className="space-y-2">
            {feature.features.map((item: string, itemIndex: number) => (
              <motion.div
                key={itemIndex}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index * 0.1) + (itemIndex * 0.05) }}
                className="text-sm text-gray-600"
              >
                • {item}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function GardenSupplierPage() {
  const [showRobofyCTA, setShowRobofyCTA] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full viewport background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1718166166019-85ac4df18717?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30" />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <FloatingNavigation />

        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="mb-8">
                <div className="mb-4 px-4 py-2 text-sm backdrop-blur-sm inline-flex items-center rounded-full font-medium" style={{
                  backgroundColor: '#F4D03F',
                  color: '#2D5A27'
                }}>
                  <Sprout className="w-4 h-4 mr-2" />
                  Premium Garden Supplies
                </div>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
                style={{
                  color: '#F4D03F', // Lemon yellow for better readability
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                Cultivate Your
                <br />
                <span style={{
                  color: '#58D68D', // Fresh leaf green
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  Perfect Garden
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed relative"
                style={{
                  color: '#FFFFFF',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.9), 1px 1px 3px rgba(0,0,0,0.8)',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  padding: '1rem 2rem',
                  borderRadius: '1rem',
                  backdropFilter: 'blur(2px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                Premium garden supplies, organic seeds, expert tools, and seasonal plants delivered to your doorstep.
              </motion.p>

              {/* Floating CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                      backgroundColor: '#2D5A27',
                      color: '#FFFFFF',
                      border: '2px solid #F4D03F'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1F3A1F';
                      e.currentTarget.style.color = '#F4D03F';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2D5A27';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shop Now
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300"
                    style={{
                      border: '2px solid #F4D03F',
                      color: '#F4D03F',
                      backgroundColor: 'rgba(244, 208, 63, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(244, 208, 63, 0.2)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(244, 208, 63, 0.1)';
                      e.currentTarget.style.color = '#F4D03F';
                    }}
                    onClick={() => document.getElementById('seasons')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Seasonal Guide
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-white/60" />
          </motion.div>
        </section>

        {/* Products Section */}
        <section id="products" className="min-h-screen flex items-center justify-center relative py-32">
          <div className="container mx-auto px-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{
                  color: '#F4D03F',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  Premium Garden Solutions
                </h2>
                <p className="text-xl max-w-3xl mx-auto" style={{
                  color: '#FFFFFF',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
                }}>
                  Everything you need to create and maintain your perfect garden oasis
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gardenServices.map((service, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                  >
                    <InteractiveProductCard service={service} index={index} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Seasonal Guide Section */}
        <section id="seasons" className="min-h-screen flex items-center justify-center relative py-32">
          <div className="container mx-auto px-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{
                  color: '#F4D03F',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  Seasonal Garden Guide
                </h2>
                <p className="text-xl max-w-3xl mx-auto" style={{
                  color: '#FFFFFF',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
                }}>
                  Expert recommendations for each season to keep your garden thriving year-round
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {seasonalFeatures.map((feature, index) => (
                  <SeasonalFeature key={index} feature={feature} index={index} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="min-h-screen flex items-center justify-center relative py-32">
          <div className="container mx-auto px-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{
                  color: '#F4D03F',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  Ready to Grow?
                </h2>
                <p className="text-xl mb-12 max-w-2xl mx-auto" style={{
                  color: '#FFFFFF',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
                }}>
                  Get in touch with our garden experts for personalized recommendations
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="px-8 py-4 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setShowRobofyCTA(true)}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Get Expert Advice
                  </Button>
                </motion.div>

                <div className="flex items-center gap-4 text-white/60">
                  <div className="w-px h-6 bg-white/30" />
                  <span>or</span>
                  <div className="w-px h-6 bg-white/30" />
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <Truck className="w-5 h-5 mr-2" />
                    Schedule Delivery
                  </Button>
                </motion.div>
              </motion.div>

              {/* Contact Info Cards */}
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
              >
                <motion.div variants={fadeInUp} className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">Visit Us</h3>
                  <p className="text-white/70 text-sm">{business.address}</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">Call</h3>
                  <p className="text-white/70 text-sm">{business.phone}</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">Email</h3>
                  <p className="text-white/70 text-sm">{business.email}</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">Hours</h3>
                  <p className="text-white/70 text-sm">{business.hours}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Robofy CTA Components */}
      <FloatingCTAButton
        onClick={() => setShowRobofyCTA(true)}
        className="bg-primary hover:bg-primary/90"
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Garden Supply Store"
        primaryColor={gardenColors.primary}
        secondaryColor={gardenColors.accent2}
      />
    </div>
  );
}