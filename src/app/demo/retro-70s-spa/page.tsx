"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { RobofyCTA, FloatingCTAButton } from '@/components/ui/RobofyCTA';
import { useGestureNavigation, useSectionNavigation } from '@/app/demo/gym/hooks/useGestureNavigation';
import {
  Heart,
  Users,
  Calendar,
  Star,
  Phone,
  Mail,
  MapPin,
  Instagram,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Play,
  Award,
  Clock,
  CheckCircle,
  Sparkles,
  Flower,
  Sun,
  Moon,
  Droplets,
  Leaf,
  Coffee,
  Music,
  Camera,
  Palette
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
};

// Floating Navigation Component with Retro Styling
const FloatingNavigation = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Sanctuary', icon: Sparkles },
    { id: 'about', label: 'Our Story', icon: Heart },
    { id: 'services', label: 'Treatments', icon: Droplets },
    { id: 'therapists', label: 'Therapists', icon: Users },
    { id: 'testimonials', label: 'Experiences', icon: Star },
    { id: 'booking', label: 'Book Now', icon: Calendar },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

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
      {/* Main Menu Button - Floating with Retro Styling */}
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-retro-terracotta to-retro-brass shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border-2 border-retro-gold/30"
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
                <Flower className="w-6 h-6 text-white" />
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Menu with Retro Styling */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-retro-linen/95 backdrop-blur-md shadow-2xl z-50 border-l border-retro-sage/40"
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
                          ? 'bg-retro-terracotta text-white shadow-lg'
                          : 'hover:bg-retro-sage/20 hover:shadow-md'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive ? 'bg-white/20' : 'bg-retro-sage/30 group-hover:bg-retro-sage/40'
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-retro-walnut'}`} />
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

// Hero Section Component with Retro 70s Styling
const HeroSection = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-retro-linen">
      {/* Background Image with Retro Filter */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1693578538512-fc66f318c833?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-retro-walnut/40 to-black/30" />

      {/* Retro Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[radial-gradient(circle_at_25%_25%,#C7533B_2px,transparent_2px)] bg-[length:60px_60px]" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <Badge className="mb-4 px-4 py-2 text-sm bg-white/20 text-white border border-white/30 backdrop-blur-sm">
              <Sun className="w-4 h-4 mr-2" />
              Vintage Luxury Spa Experience
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight drop-shadow-lg"
          >
            Reawaken Your Senses
            <span className="block text-retro-terracotta">70s-Inspired Sanctuary</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
          >
            Step into a world of vintage luxury where ancient healing meets 70s elegance.
            Restore your natural balance in our sun-drenched sanctuary.
          </motion.p>

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
                className="px-8 py-4 text-lg bg-retro-terracotta hover:bg-retro-terracotta/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-retro-gold/30"
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Escape
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-2 border-retro-walnut/30 text-retro-walnut hover:bg-retro-sage/20 backdrop-blur-sm"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Explore Treatments
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator with retro styling */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-retro-walnut/30" />
          <ChevronDown className="w-6 h-6 text-retro-walnut/50" />
        </div>
      </motion.div>
    </section>
  );
};

// About Section Component
const AboutSection = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center relative py-32 bg-retro-linen">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 px-4 py-2 bg-retro-sage/20 text-retro-walnut">
                <Heart className="w-4 h-4 mr-2" />
                Our Story
              </Badge>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-retro-walnut leading-tight"
            >
              Where Vintage Charm Meets
              <span className="text-retro-terracotta block">Modern Wellness</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-retro-walnut/80 leading-relaxed"
            >
              Born from the golden era of self-care, our spa blends the nostalgic warmth of 1970s luxury with contemporary healing practices. Every treatment is crafted to transport you to a time when relaxation was an art form.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { number: "15+", label: "Years of Serenity" },
                { number: "5000+", label: "Happy Guests" },
                { number: "25", label: "Signature Treatments" },
                { number: "100%", label: "Natural Ingredients" }
              ].map((fact, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 bg-retro-cream/80 backdrop-blur-sm rounded-xl border border-retro-sage/30"
                >
                  <div className="text-3xl font-bold text-retro-terracotta mb-2">{fact.number}</div>
                  <div className="text-sm text-retro-walnut">{fact.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Image with Retro Frame */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-retro-cream/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-retro-sage/40">
              <div
                className="h-96 bg-cover bg-center rounded-2xl relative overflow-hidden"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1740&auto=format&fit=crop')"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-retro-walnut/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-retro-terracotta/90 text-white px-3 py-1">
                    Vintage Spa Lounge
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Services Section Component
const ServicesSection = () => {
  const services = [
    {
      name: "Therapeutic Massages",
      description: "Deep tissue, Swedish, and hot stone therapies to melt away tension",
      duration: "60-90 min",
      price: "From $120",
      icon: Droplets,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1740&auto=format&fit=crop",
      features: ["Swedish Massage", "Deep Tissue", "Hot Stone Therapy", "Aromatherapy"]
    },
    {
      name: "Luxury Facials",
      description: "Rejuvenating treatments with organic botanicals and ancient rituals",
      duration: "75 min",
      price: "From $95",
      icon: Flower,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1740&auto=format&fit=crop",
      features: ["Anti-Aging Facial", "Hydrating Treatment", "Silk Cocoon Therapy", "LED Light Therapy"]
    },
    {
      name: "Foot & Reflexology",
      description: "Ancient pressure point therapy for total body wellness",
      duration: "45 min",
      price: "From $75",
      icon: Leaf,
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1887&auto=format&fit=crop",
      features: ["Reflexology", "Foot Soak", "Essential Oils", "Pressure Point Massage"]
    },
    {
      name: "Couples Packages",
      description: "Shared serenity in our private sanctuary suite",
      duration: "90 min",
      price: "From $250",
      icon: Heart,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1740&auto=format&fit=crop",
      features: ["Side-by-Side Massage", "Champagne Service", "Private Lounge", "Aromatherapy"]
    },
    {
      name: "Ayurvedic Treatments",
      description: "Ancient healing wisdom tailored to your constitution",
      duration: "90 min",
      price: "From $140",
      icon: Sun,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1740&auto=format&fit=crop",
      features: ["Dosha Consultation", "Herbal Oils", "Marma Therapy", "Meditation"]
    },
    {
      name: "Body Wraps & Scrubs",
      description: "Detoxifying and nourishing treatments for silky smooth skin",
      duration: "60 min",
      price: "From $110",
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1740&auto=format&fit=crop",
      features: ["Seaweed Wrap", "Coffee Scrub", "Mud Therapy", "Herbal Infusions"]
    }
  ];

  return (
    <section id="services" className="min-h-screen flex items-center justify-center relative py-32 bg-retro-cream">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-retro-terracotta/20 text-retro-walnut">
              <Droplets className="w-4 h-4 mr-2" />
              Our Signature Treatments
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-retro-walnut mb-6">
              Indulge in Vintage Luxury
            </h2>
            <p className="text-xl text-retro-walnut/80 max-w-3xl mx-auto">
              Each treatment is a journey back to the golden age of self-care, enhanced with modern wellness wisdom
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="h-full bg-retro-linen/90 backdrop-blur-sm border-2 border-retro-sage/30 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div
                    className="h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${service.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-retro-walnut/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-retro-terracotta/90 rounded-full flex items-center justify-center">
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-retro-sage/90 text-white">
                        {service.price}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-retro-walnut mb-2 group-hover:text-retro-terracotta transition-colors">
                      {service.name}
                    </h3>

                    <p className="text-retro-walnut/70 mb-4 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2 text-sm text-retro-walnut/60 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {service.features.slice(0, 2).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-xs text-retro-walnut/60">
                          <div className="w-1.5 h-1.5 bg-retro-sage rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Therapists Section Component
const TherapistsSection = () => {
  const therapists = [
    {
      name: "Luna Martinez",
      role: "Master Massage Therapist",
      experience: "12 years",
      specialties: ["Deep Tissue", "Hot Stone", "Swedish"],
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1887&auto=format&fit=crop",
      bio: "Luna brings ancient healing wisdom to every treatment, specializing in therapeutic techniques that restore balance and vitality."
    },
    {
      name: "Aurora Chen",
      role: "Facial & Skincare Expert",
      experience: "8 years",
      specialties: ["Anti-Aging", "Organic Facials", "LED Therapy"],
      image: "https://images.unsplash.com/photo-1594829881289-6306538435d2?q=80&w=1887&auto=format&fit=crop",
      bio: "Aurora's gentle touch and botanical expertise create transformative skincare experiences that reveal your natural radiance."
    },
    {
      name: "Sage Thompson",
      role: "Wellness & Ayurvedic Specialist",
      experience: "15 years",
      specialties: ["Ayurveda", "Energy Work", "Meditation"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
      bio: "Sage guides guests through personalized wellness journeys, blending Eastern traditions with modern healing practices."
    },
    {
      name: "Harmony Williams",
      role: "Couples & Reflexology Therapist",
      experience: "10 years",
      specialties: ["Couples Massage", "Reflexology", "Aromatherapy"],
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1887&auto=format&fit=crop",
      bio: "Harmony's intuitive approach creates deeply relaxing experiences that nurture both body and spirit."
    }
  ];

  return (
    <section id="therapists" className="min-h-screen flex items-center justify-center relative py-32 bg-retro-linen">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-retro-sage/20 text-retro-walnut">
              <Users className="w-4 h-4 mr-2" />
              Meet Our Therapists
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-retro-walnut mb-6">
              Masters of Healing Arts
            </h2>
            <p className="text-xl text-retro-walnut/80 max-w-3xl mx-auto">
              Our certified therapists bring decades of combined experience and genuine passion to every treatment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {therapists.map((therapist, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="h-full bg-retro-cream/90 backdrop-blur-sm border-2 border-retro-sage/30 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div
                    className="h-64 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${therapist.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-retro-walnut/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{therapist.name}</h3>
                      <p className="text-white/90 text-sm">{therapist.role}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Badge className="mb-2 bg-retro-terracotta/20 text-retro-walnut text-xs">
                        {therapist.experience} Experience
                      </Badge>
                    </div>

                    <p className="text-retro-walnut/70 text-sm mb-4 leading-relaxed">
                      {therapist.bio}
                    </p>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-retro-walnut mb-2">Specialties:</p>
                      {therapist.specialties.map((specialty, specialtyIndex) => (
                        <div key={specialtyIndex} className="flex items-center gap-2 text-xs text-retro-walnut/60">
                          <div className="w-1.5 h-1.5 bg-retro-terracotta rounded-full" />
                          {specialty}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Isabella Santos",
      role: "Monthly Guest",
      content: "This spa is like stepping into a time capsule of luxury. The 70s aesthetic creates such a warm, inviting atmosphere that immediately puts you at ease. Every treatment feels like a journey back to simpler times.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Marcus Thompson",
      role: "Couples Package Guest",
      content: "My wife and I celebrated our anniversary here and it was magical. The attention to detail, the vintage charm, and the genuine care from the therapists made it an unforgettable experience.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Elena Rodriguez",
      role: "Regular Client",
      content: "As someone who appreciates both modern wellness and vintage aesthetics, this spa is perfection. The treatments are effective, the atmosphere is divine, and the therapists are true artists.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section id="testimonials" className="min-h-screen flex items-center justify-center relative py-32 bg-retro-cream">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-retro-sage/20 text-retro-walnut">
              <Star className="w-4 h-4 mr-2" />
              Guest Experiences
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-retro-walnut mb-6">
              Stories of Transformation
            </h2>
            <p className="text-xl text-retro-walnut/80 max-w-3xl mx-auto">
              Real experiences from our cherished guests
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="h-full bg-retro-linen/90 backdrop-blur-sm border-2 border-retro-sage/30 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-retro-yellow fill-current" />
                      ))}
                    </div>

                    <p className="text-retro-walnut/80 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 bg-cover bg-center rounded-full border-2 border-retro-sage"
                        style={{ backgroundImage: `url(${testimonial.image})` }}
                      />
                      <div>
                        <h4 className="font-semibold text-retro-walnut">{testimonial.name}</h4>
                        <p className="text-sm text-retro-walnut/60">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Booking Section Component
const BookingSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    treatment: '',
    date: '',
    time: '',
    specialRequests: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="booking" className="min-h-screen flex items-center justify-center relative py-32 bg-retro-linen">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-retro-terracotta/20 text-retro-walnut">
              <Calendar className="w-4 h-4 mr-2" />
              Book Your Sanctuary Experience
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-retro-walnut mb-6">
              Reserve Your Moment of Peace
            </h2>
            <p className="text-xl text-retro-walnut/80 max-w-3xl mx-auto">
              Begin your journey to restoration and book your personalized spa experience
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Booking Form */}
            <motion.div
              variants={fadeInUp}
              className="bg-retro-cream/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-retro-sage/40"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-retro-walnut mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-linen/50"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-retro-walnut mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-linen/50"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-retro-walnut mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-linen/50"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-retro-walnut mb-2">
                      Preferred Treatment
                    </label>
                    <select
                      name="treatment"
                      value={formData.treatment}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-linen/50"
                    >
                      <option value="">Select a treatment</option>
                      <option value="therapeutic-massage">Therapeutic Massage</option>
                      <option value="luxury-facial">Luxury Facial</option>
                      <option value="foot-reflexology">Foot & Reflexology</option>
                      <option value="couples-package">Couples Package</option>
                      <option value="ayurvedic">Ayurvedic Treatment</option>
                      <option value="body-wrap">Body Wrap & Scrub</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-retro-walnut mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-linen/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-retro-walnut mb-2">
                      Preferred Time
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-linen/50"
                    >
                      <option value="">Select time</option>
                      <option value="9:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="2:00">2:00 PM</option>
                      <option value="3:00">3:00 PM</option>
                      <option value="4:00">4:00 PM</option>
                      <option value="5:00">5:00 PM</option>
                      <option value="6:00">6:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-retro-walnut mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-linen/50"
                    placeholder="Any special requests or preferences..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-retro-terracotta hover:bg-retro-terracotta/90 text-white py-3 text-lg border-2 border-retro-gold/30"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Reserve Your Experience
                </Button>
              </form>
            </motion.div>

            {/* Contact Info & Hours */}
            <motion.div variants={fadeInUp} className="space-y-8">
              {/* Hours & Info */}
              <div className="bg-retro-cream/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-retro-sage/40">
                <h3 className="text-2xl font-bold text-retro-walnut mb-6">Visit Our Sanctuary</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-retro-sage/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-retro-walnut" />
                    </div>
                    <div>
                      <p className="font-medium text-retro-walnut">Address</p>
                      <p className="text-retro-walnut/70">123 Serenity Lane<br />Peaceful Valley, PV 12345</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-retro-sage/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-retro-walnut" />
                    </div>
                    <div>
                      <p className="font-medium text-retro-walnut">Phone</p>
                      <p className="text-retro-walnut/70">(555) 123-ZEN</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-retro-sage/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-retro-walnut" />
                    </div>
                    <div>
                      <p className="font-medium text-retro-walnut">Email</p>
                      <p className="text-retro-walnut/70">hello@serenityspringsspa.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-retro-sage/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-retro-walnut" />
                    </div>
                    <div>
                      <p className="font-medium text-retro-walnut">Hours</p>
                      <p className="text-retro-walnut/70">Tue - Sun: 9:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Offers */}
              <div className="bg-retro-cream/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-retro-sage/40">
                <h3 className="text-xl font-bold text-retro-walnut mb-4">Special Offers</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-retro-terracotta/10 rounded-lg">
                    <Sun className="w-5 h-5 text-retro-terracotta" />
                    <div>
                      <p className="font-medium text-retro-walnut text-sm">First Visit Special</p>
                      <p className="text-xs text-retro-walnut/60">20% off your first treatment</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-retro-sage/10 rounded-lg">
                    <Moon className="w-5 h-5 text-retro-walnut" />
                    <div>
                      <p className="font-medium text-retro-walnut text-sm">Couples Package</p>
                      <p className="text-xs text-retro-walnut/60">Complimentary champagne</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-retro-walnut text-retro-linen py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Spa Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-retro-linen">Serenity Springs Spa</h3>
            <p className="text-retro-linen/80 mb-6 leading-relaxed">
              Your vintage sanctuary for wellness and rejuvenation. Experience the perfect blend of 70s luxury and modern healing practices.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-retro-terracotta/20 rounded-lg flex items-center justify-center hover:bg-retro-terracotta/30 transition-colors cursor-pointer">
                <Instagram className="w-5 h-5 text-retro-linen" />
              </div>
              <div className="w-10 h-10 bg-retro-terracotta/20 rounded-lg flex items-center justify-center hover:bg-retro-terracotta/30 transition-colors cursor-pointer">
                <Phone className="w-5 h-5 text-retro-linen" />
              </div>
              <div className="w-10 h-10 bg-retro-terracotta/20 rounded-lg flex items-center justify-center hover:bg-retro-terracotta/30 transition-colors cursor-pointer">
                <Mail className="w-5 h-5 text-retro-linen" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-retro-linen">Treatments</h4>
            <ul className="space-y-2">
              {['Massage Therapy', 'Luxury Facials', 'Reflexology', 'Couples Packages', 'Ayurvedic', 'Body Treatments'].map((treatment) => (
                <li key={treatment}>
                  <span className="text-retro-linen/80 hover:text-retro-linen transition-colors text-sm cursor-pointer">
                    {treatment}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-retro-linen">Services</h4>
            <ul className="space-y-2">
              {['Spa Packages', 'Gift Cards', 'Group Events', 'Corporate Wellness', 'Membership', 'Consultations'].map((service) => (
                <li key={service}>
                  <span className="text-retro-linen/80 hover:text-retro-linen transition-colors text-sm cursor-pointer">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-retro-linen/20 mt-12 pt-8 text-center">
          <p className="text-retro-linen/60 text-sm">
            © 2024 Serenity Springs Spa. All rights reserved. |
            <span className="mx-2">Luxury spa treatments in [City]</span> |
            <span className="mx-2">Vintage spa experience, wellness retreat, massage therapy</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Page Component
export default function Retro70sSpaDemo() {
  const { ref: gestureRef, isGestureActive } = useGestureNavigation({
    onSwipeUp: () => scrollToNextSection(),
    onSwipeDown: () => scrollToPreviousSection(),
    onSwipeLeft: () => goToNextSection(),
    onSwipeRight: () => goToPreviousSection()
  });

  const divRef = gestureRef as React.RefObject<HTMLDivElement>;
  const [showRobofyCTA, setShowRobofyCTA] = useState(false);

  const { currentSection, goToNext, goToPrevious } = useSectionNavigation(6);

  const scrollToNextSection = () => {
    const sections = ['hero', 'about', 'services', 'therapists', 'testimonials', 'booking'];
    const currentIndex = sections.findIndex(id => {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      }
      return false;
    });

    if (currentIndex < sections.length - 1) {
      const nextSection = document.getElementById(sections[currentIndex + 1]);
      nextSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPreviousSection = () => {
    const sections = ['hero', 'about', 'services', 'therapists', 'testimonials', 'booking'];
    const currentIndex = sections.findIndex(id => {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      }
      return false;
    });

    if (currentIndex > 0) {
      const prevSection = document.getElementById(sections[currentIndex - 1]);
      prevSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToNextSection = () => {
    goToNext();
    const sections = ['hero', 'about', 'services', 'therapists', 'testimonials', 'booking'];
    const nextIndex = (currentSection + 1) % sections.length;
    const nextSection = document.getElementById(sections[nextIndex]);
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToPreviousSection = () => {
    goToPrevious();
    const sections = ['hero', 'about', 'services', 'therapists', 'testimonials', 'booking'];
    const prevIndex = currentSection === 0 ? sections.length - 1 : currentSection - 1;
    const prevSection = document.getElementById(sections[prevIndex]);
    prevSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={divRef}
      className={`bg-retro-linen transition-colors duration-300 ${isGestureActive ? 'cursor-grabbing' : 'cursor-default'}`}
      tabIndex={0}
    >
      {/* Gesture Active Indicator */}
      {isGestureActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-retro-terracotta/90 text-white px-3 py-1 rounded-full text-sm z-[70] pointer-events-none shadow-lg font-medium"
        >
          Gesture Active - Swipe to navigate
        </motion.div>
      )}

      <FloatingNavigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TherapistsSection />
      <TestimonialsSection />
      <BookingSection />
      <Footer />

      {/* Robofy CTA Components */}
      <FloatingCTAButton
        onClick={() => setShowRobofyCTA(true)}
        className="bg-retro-terracotta hover:bg-retro-terracotta/90"
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Spa & Wellness"
        primaryColor="#C7533B"
        secondaryColor="#758E85"
      />
    </div>
  );
}