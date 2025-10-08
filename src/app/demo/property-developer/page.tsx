"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import Select from '@/components/ui/Select';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Calendar,
  Home,
  Building2,
  Leaf,
  Palette,
  TrendingUp,
  MapPin as MapPinIcon,
  ChevronRight,
  Play,
  Pause,
  Eye,
  Camera,
  Ruler,
  Award,
  Users,
  Sparkles,
  Crown,
  Gem,
  ArrowRight,
  X,
  CheckCircle,
  Filter,
  Search,
  Heart,
  Share2,
  BookmarkPlus,
  Zap
} from 'lucide-react';
import { propertyDeveloperBusiness, propertyDeveloperServices, propertyDeveloperTestimonials, generateBusinessSchema } from '@/config/demo-businesses';

// Floating Architectural Navigation Elements
const FloatingArchElement = ({ icon: Icon, label, position, delay = 0, onClick, variant = "default" }: {
  icon: any;
  label: string;
  position: string;
  delay?: number;
  onClick: () => void;
  variant?: "default" | "gold" | "emerald";
}) => {
  const colors = {
    default: "from-white/20 to-white/10 border-white/30",
    gold: "from-yellow-400/30 to-yellow-600/20 border-yellow-400/40",
    emerald: "from-emerald-400/30 to-emerald-600/20 border-emerald-400/40"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      className={`fixed ${position} z-50`}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotateY: 15 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        <div className={`absolute -inset-1 bg-gradient-to-r ${colors[variant]} rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500`} />
        <div className={`relative bg-gradient-to-br ${colors[variant]} backdrop-blur-md border rounded-full p-4 cursor-pointer hover:shadow-2xl transition-all duration-500`}>
          <Icon className={`w-6 h-6 ${variant === 'gold' ? 'text-yellow-600' : variant === 'emerald' ? 'text-emerald-600' : 'text-white'}`} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap backdrop-blur-md"
        >
          {label}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Interactive Property Hotspot
const PropertyHotspot = ({ children, onClick, className = "", delay = 0 }: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 0.9 }}
    className={`absolute cursor-pointer z-20 ${className}`}
    onClick={onClick}
  >
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-lg"
    />
    <motion.div
      animate={{ scale: [1, 2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-yellow-400/50 to-yellow-600/50 rounded-full"
    />
  </motion.div>
);

// Luxury Property Card with Interactive Elements
const LuxuryPropertyCard = ({ property, index, onViewDetails }: {
  property: any;
  index: number;
  onViewDetails: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50, rotateX: -15 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ y: -10, rotateY: 5 }}
    className="relative group"
  >
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-500">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={property.image}
          alt={property.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Interactive hotspots on property image */}
        <PropertyHotspot onClick={() => {}} className="top-4 left-4" delay={0.5}>{null}</PropertyHotspot>
        <PropertyHotspot onClick={() => {}} className="top-8 right-6" delay={0.7}>{null}</PropertyHotspot>
        <PropertyHotspot onClick={() => {}} className="bottom-6 left-8" delay={0.9}>{null}</PropertyHotspot>

        <div className="absolute top-4 right-4">
          <Badge className="bg-yellow-500/90 text-black font-semibold px-3 py-1">
            {property.status}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-bold mb-2">{property.name}</h3>
          <p className="text-white/90 text-sm">{property.location}</p>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-yellow-400">{property.price}</span>
          <div className="flex items-center space-x-4 text-sm text-white/80">
            <span className="flex items-center">
              <Home className="w-4 h-4 mr-1" />
              {property.bedrooms} beds
            </span>
            <span className="flex items-center">
              <Ruler className="w-4 h-4 mr-1" />
              {property.sqft} sqft
            </span>
          </div>
        </div>

        <p className="text-white/90 text-sm mb-4 leading-relaxed">{property.description}</p>

        <div className="flex space-x-2">
          <Button
            onClick={onViewDetails}
            size="sm"
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button size="sm" variant="outline" className="border-white/50 text-white hover:bg-white/20">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

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
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
};

export default function PropertyDeveloperPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Sample luxury properties data
  const luxuryProperties = [
    {
      id: 1,
      name: "Crown Jewel Estate",
      location: "Beverly Hills, CA",
      price: "$15,900,000",
      bedrooms: 6,
      sqft: 8500,
      description: "An architectural masterpiece featuring panoramic city views, infinity pool, and state-of-the-art smart home technology.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      status: "Available"
    },
    {
      id: 2,
      name: "Azure Vista Manor",
      location: "Malibu, CA",
      price: "$22,500,000",
      bedrooms: 8,
      sqft: 12000,
      description: "Oceanfront luxury with private beach access, guest house, and sustainable design elements throughout.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      status: "Available"
    },
    {
      id: 3,
      name: "Eternal Horizon Residence",
      location: "Bel Air, CA",
      price: "$18,750,000",
      bedrooms: 7,
      sqft: 9500,
      description: "Modern elegance meets timeless design with floor-to-ceiling windows, wine cellar, and resort-style amenities.",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      status: "Pending"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % propertyDeveloperTestimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll handler
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video/Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury Property Development"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-yellow-900/20 to-black/60" />
      </div>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBusinessSchema(propertyDeveloperBusiness, propertyDeveloperServices, propertyDeveloperTestimonials))
        }}
      />

      {/* Floating Architectural Navigation */}
      <FloatingArchElement
        icon={Crown}
        label="Luxury Portfolio"
        position="top-1/4 left-8"
        delay={0.3}
        onClick={() => scrollToSection('portfolio')}
        variant="gold"
      />
      <FloatingArchElement
        icon={Building2}
        label="Our Services"
        position="top-1/3 right-8"
        delay={0.5}
        onClick={() => scrollToSection('services')}
        variant="emerald"
      />
      <FloatingArchElement
        icon={Users}
        label="Client Stories"
        position="top-1/2 left-8"
        delay={0.7}
        onClick={() => scrollToSection('testimonials')}
        variant="default"
      />
      <FloatingArchElement
        icon={Calendar}
        label="Schedule Consultation"
        position="top-2/3 right-8"
        delay={0.9}
        onClick={() => setIsConsultationOpen(true)}
        variant="gold"
      />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center">
        <div className="relative px-8 max-w-6xl mx-auto">
          {/* Luxury glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-yellow-900/30 backdrop-blur-sm rounded-3xl border border-yellow-400/20 shadow-2xl -z-10" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center text-white relative z-10 py-16"
          >
            <motion.div
              variants={scaleIn}
              className="mb-8"
            >
              <Badge className="mb-6 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-100 border-yellow-400/40 px-6 py-3 text-sm font-semibold">
                <Award className="w-4 h-4 mr-2" />
                Award-Winning Property Developer 2025
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-yellow-100 to-yellow-200 bg-clip-text text-transparent leading-tight"
            >
              Aureum
              <span className="block text-yellow-400">Properties</span>
            </motion.h1>

            <motion.div
              variants={fadeInUp}
              className="relative mb-12"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-yellow-400/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl -z-10" />
              <p className="text-xl md:text-3xl text-white/95 max-w-4xl mx-auto leading-relaxed p-12 relative z-10">
                Crafting architectural masterpieces that redefine luxury living through innovative design,
                sustainable practices, and unparalleled attention to detail.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col lg:flex-row gap-6 justify-center items-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={() => scrollToSection('portfolio')}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-10 py-6 text-lg font-bold rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300"
                >
                  <Crown className="w-6 h-6 mr-3" />
                  Explore Portfolio
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsConsultationOpen(true)}
                  className="border-2 border-white/60 text-white hover:bg-white/20 hover:border-white px-10 py-6 text-lg font-semibold rounded-full backdrop-blur-sm"
                >
                  <Calendar className="w-6 h-6 mr-3" />
                  Schedule Consultation
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">500+</div>
                <div className="text-white/80 text-sm">Luxury Homes Built</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">25+</div>
                <div className="text-white/80 text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">15+</div>
                <div className="text-white/80 text-sm">Awards Won</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">100%</div>
                <div className="text-white/80 text-sm">Client Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronRight className="w-6 h-6 text-white/60 rotate-90" />
        </motion.div>
      </section>

      {/* Luxury Property Portfolio */}
      <section id="portfolio" className="relative min-h-screen flex items-center py-20">
        <div className="container mx-auto px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold text-white mb-6 text-center">
              Exclusive Portfolio
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-white/90 mb-16 text-center max-w-3xl mx-auto">
              Discover our collection of architectural masterpieces, each crafted with meticulous attention to detail and uncompromising quality
            </motion.p>

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {luxuryProperties.map((property, index) => (
                <LuxuryPropertyCard
                  key={property.id}
                  property={property}
                  index={index}
                  onViewDetails={() => setSelectedProperty(property)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section with Asymmetrical Layout */}
      <section id="services" className="relative min-h-screen flex items-center py-20">
        <div className="container mx-auto px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold text-white mb-16 text-center">
              Premium Services
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeInUp} className="space-y-8">
                {propertyDeveloperServices.slice(0, 3).map((service, index) => (
                  <motion.div
                    key={service.title}
                    variants={scaleIn}
                    whileHover={{ x: 10 }}
                    className="relative"
                  >
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-500">
                      <CardContent className="p-8">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{service.icon}</div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                            <p className="text-white/90 leading-relaxed">{service.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="relative">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-emerald-400/20 rounded-3xl blur opacity-30" />
                  <Image
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Architectural Design Process"
                    width={600}
                    height={800}
                    className="relative rounded-3xl shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="mt-16 grid md:grid-cols-3 gap-8">
              {propertyDeveloperServices.slice(3).map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={scaleIn}
                  whileHover={{ y: -5 }}
                >
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl mb-4">{service.icon}</div>
                      <h3 className="text-lg font-semibold text-white mb-3">{service.title}</h3>
                      <p className="text-white/80 text-sm leading-relaxed">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative min-h-screen flex items-center py-20">
        <div className="container mx-auto px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold text-white mb-16">
              Client Stories
            </motion.h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-white/10 to-yellow-400/10 backdrop-blur-md border border-white/20 rounded-3xl p-12"
              >
                <div className="flex justify-center mb-6">
                  {[...Array(propertyDeveloperTestimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl text-white/95 mb-8 leading-relaxed italic">
                  "{propertyDeveloperTestimonials[currentTestimonial].review}"
                </blockquote>
                <div className="text-yellow-300 font-semibold text-lg">
                  {propertyDeveloperTestimonials[currentTestimonial].name}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {propertyDeveloperTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-yellow-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Consultation Booking Dialog */}
      <Dialog open={isConsultationOpen} onOpenChange={setIsConsultationOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Schedule Luxury Consultation</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30 rounded-lg p-6">
              <h3 className="text-yellow-100 font-semibold mb-2">Complimentary Consultation Includes:</h3>
              <ul className="text-white/90 space-y-2">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-yellow-400" /> Investment Portfolio Analysis</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-yellow-400" /> Custom Property Design Concepts</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-yellow-400" /> Market Trend Insights</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-yellow-400" /> ROI Projections & Timeline</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Full Name" className="bg-white/20 border-white/40 text-white placeholder:text-gray-200 focus:bg-white/30 focus:border-white/60" />
              <Input placeholder="Phone Number" className="bg-white/20 border-white/40 text-white placeholder:text-gray-200 focus:bg-white/30 focus:border-white/60" />
              <Input type="email" placeholder="Email Address" className="bg-white/20 border-white/40 text-white placeholder:text-gray-200 focus:bg-white/30 focus:border-white/60" />
              <Select
                label="Consultation Type"
                options={[
                  { value: "residential", label: "Luxury Residential" },
                  { value: "commercial", label: "Commercial Development" },
                  { value: "investment", label: "Investment Advisory" },
                  { value: "custom", label: "Custom Project" }
                ]}
                className="bg-white/20 border-white/40 text-white"
              />
            </div>

            <Textarea
              placeholder="Tell us about your project vision, budget range, and preferred timeline..."
              className="bg-white/20 border-white/40 text-white placeholder:text-gray-200 focus:bg-white/30 focus:border-white/60 min-h-[100px]"
            />

            <div className="flex space-x-4">
              <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Button>
              <Button variant="outline" onClick={() => setIsConsultationOpen(false)} className="border-white/50 text-white hover:bg-white/20">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Property Details Modal */}
      {selectedProperty && (
        <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl">{selectedProperty.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={selectedProperty.image}
                  alt={selectedProperty.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-yellow-400 text-xl font-semibold mb-4">Property Details</h3>
                  <div className="space-y-3 text-white/90">
                    <p><span className="text-yellow-400">Price:</span> {selectedProperty.price}</p>
                    <p><span className="text-yellow-400">Location:</span> {selectedProperty.location}</p>
                    <p><span className="text-yellow-400">Bedrooms:</span> {selectedProperty.bedrooms}</p>
                    <p><span className="text-yellow-400">Square Feet:</span> {selectedProperty.sqft.toLocaleString()}</p>
                    <p><span className="text-yellow-400">Status:</span> {selectedProperty.status}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-yellow-400 text-xl font-semibold mb-4">Features</h3>
                  <div className="space-y-2 text-white/90">
                    <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-yellow-400" /> Smart Home Technology</div>
                    <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-yellow-400" /> Premium Finishes</div>
                    <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-yellow-400" /> Energy Efficient Design</div>
                    <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-yellow-400" /> Private Outdoor Spaces</div>
                  </div>
                </div>
              </div>

              <p className="text-white/90 leading-relaxed">{selectedProperty.description}</p>

              <div className="flex space-x-4">
                <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Viewing
                </Button>
                <Button variant="outline" className="border-white/50 text-white hover:bg-white/20">
                  <Heart className="w-5 h-5 mr-2" />
                  Add to Wishlist
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}