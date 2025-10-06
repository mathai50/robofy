"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { RobofyCTA, FloatingCTAButton } from '@/components/ui/RobofyCTA';
import { useGestureNavigation, useSectionNavigation } from '@/app/demo/gym/hooks/useGestureNavigation';
import {
  Scissors,
  Palette,
  Sparkles,
  Crown,
  Star,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Clock,
  CheckCircle,
  Heart,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Play,
  Award,
  Gem,
  Zap,
  Flower,
  Sun,
  Moon,
  Camera,
  Music,
  Coffee,
  Leaf,
  Droplets,
  Flame
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

// Floating Navigation Component with 70s Salon Styling
const FloatingNavigation = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Studio', icon: Crown },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'stylists', label: 'Artists', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'testimonials', label: 'Reviews', icon: Star },
    { id: 'booking', label: 'Book', icon: Calendar },
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
      {/* Main Menu Button - Floating with 70s Styling */}
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
                <Scissors className="w-6 h-6 text-white" />
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

      {/* Navigation Menu with 70s Styling */}
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

// Hero Section Component with 70s Salon Styling
const HeroSection = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-retro-linen">
      {/* Background Image with 70s Filter */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1744095407400-aa337918bbb1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-retro-walnut/60 via-retro-terracotta/40 to-retro-sage/50" />

      {/* 70s Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[radial-gradient(circle_at_20%_80%,#E2B857_3px,transparent_3px)] bg-[length:80px_80px]" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <Badge className="mb-4 px-4 py-2 text-sm bg-retro-gold/20 text-retro-walnut border border-retro-gold/30 backdrop-blur-sm">
              <Crown className="w-4 h-4 mr-2" />
              Premier Beauty Studio
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight drop-shadow-lg"
          >
            Retro Glamour
            <span className="block text-retro-gold">70s Hair Studio</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
          >
            Step into a world of vintage elegance where classic cuts meet modern artistry.
            Transform your look with our expert stylists and premium beauty services.
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
                Book Your Transformation
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-2 border-retro-gold/30 text-retro-gold hover:bg-retro-gold/20 backdrop-blur-sm"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Explore Services
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator with 70s styling */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-retro-gold/50" />
          <ChevronDown className="w-6 h-6 text-retro-gold/60" />
        </div>
      </motion.div>
    </section>
  );
};

// Services Section Component
const ServicesSection = () => {
  const services = [
    {
      name: "Signature Haircuts",
      description: "Expert cuts tailored to your face shape and lifestyle, from classic bobs to modern layers",
      duration: "45-60 min",
      price: "From $85",
      icon: Scissors,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop",
      features: ["Consultation", "Wash & Style", "Product Recommendations", "Follow-up Care"]
    },
    {
      name: "Vibrant Color Services",
      description: "Professional coloring techniques from subtle highlights to bold transformations",
      duration: "90-120 min",
      price: "From $120",
      icon: Palette,
      image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop",
      features: ["Color Consultation", "Premium Products", "Toning Treatment", "Aftercare Kit"]
    },
    {
      name: "Luxury Styling",
      description: "Special occasion styling, bridal hair, and editorial looks for every event",
      duration: "60-90 min",
      price: "From $95",
      icon: Crown,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop",
      features: ["Event Consultation", "Trial Run", "Premium Products", "Style Guide"]
    },
    {
      name: "Hair Treatments",
      description: "Deep conditioning, keratin treatments, and scalp therapies for healthy hair",
      duration: "45-75 min",
      price: "From $75",
      icon: Droplets,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1974&auto=format&fit=crop",
      features: ["Scalp Analysis", "Custom Treatment", "Take-home Products", "Maintenance Plan"]
    },
    {
      name: "Bridal Packages",
      description: "Complete bridal party styling with rehearsal and wedding day services",
      duration: "Varies",
      price: "From $200",
      icon: Heart,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1974&auto=format&fit=crop",
      features: ["Bridal Trial", "Wedding Day Style", "Bridal Party", "Touch-up Kit"]
    },
    {
      name: "Men's Grooming",
      description: "Classic cuts, beard styling, and modern grooming services for the modern man",
      duration: "30-45 min",
      price: "From $45",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1974&auto=format&fit=crop",
      features: ["Hair Cut", "Beard Trim", "Hot Towel", "Styling Products"]
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
              <Scissors className="w-4 h-4 mr-2" />
              Our Signature Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-retro-walnut mb-6">
              Transform Your Look
            </h2>
            <p className="text-xl text-retro-walnut/80 max-w-3xl mx-auto">
              From classic cuts to avant-garde styling, our expert team creates looks that turn heads and boost confidence
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

// Stylists Section Component
const StylistsSection = () => {
  const stylists = [
    {
      name: "Luna Voss",
      role: "Master Stylist & Color Expert",
      experience: "15 years",
      specialties: ["Balayage", "Color Correction", "Editorial Styling"],
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=1887&auto=format&fit=crop",
      bio: "Luna's artistic vision and technical expertise have made her a go-to stylist for celebrities and fashion-forward clients."
    },
    {
      name: "Marco Silva",
      role: "Senior Barber & Men's Specialist",
      experience: "12 years",
      specialties: ["Classic Cuts", "Beard Design", "Modern Styling"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
      bio: "Marco brings precision and artistry to men's grooming, specializing in both traditional barbering and contemporary styles."
    },
    {
      name: "Aria Chen",
      role: "Bridal & Special Events Stylist",
      experience: "10 years",
      specialties: ["Bridal Hair", "Updos", "Editorial Work"],
      image: "https://images.unsplash.com/photo-1594829881289-6306538435d2?q=80&w=1887&auto=format&fit=crop",
      bio: "Aria creates magical transformations for weddings and special events, ensuring every bride feels like royalty."
    },
    {
      name: "Jax Rivera",
      role: "Creative Director & Educator",
      experience: "18 years",
      specialties: ["Avant-garde", "Hair Art", "Training"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1887&auto=format&fit=crop",
      bio: "Jax pushes creative boundaries while mentoring the next generation of stylists with innovative techniques."
    }
  ];

  return (
    <section id="stylists" className="min-h-screen flex items-center justify-center relative py-32 bg-retro-linen">
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
              Meet Our Artists
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-retro-walnut mb-6">
              Masters of Their Craft
            </h2>
            <p className="text-xl text-retro-walnut/80 max-w-3xl mx-auto">
              Our talented team of stylists brings decades of experience and artistic vision to every appointment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stylists.map((stylist, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="h-full bg-retro-cream/90 backdrop-blur-sm border-2 border-retro-sage/30 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div
                    className="h-64 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${stylist.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-retro-walnut/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{stylist.name}</h3>
                      <p className="text-white/90 text-sm">{stylist.role}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Badge className="mb-2 bg-retro-terracotta/20 text-retro-walnut text-xs">
                        {stylist.experience} Experience
                      </Badge>
                    </div>

                    <p className="text-retro-walnut/70 text-sm mb-4 leading-relaxed">
                      {stylist.bio}
                    </p>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-retro-walnut mb-2">Specialties:</p>
                      {stylist.specialties.map((specialty, specialtyIndex) => (
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

// Gallery Section Component
const GallerySection = () => {
  const galleryImages = [
    {
      image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop",
      title: "Balayage Transformation",
      category: "Color"
    },
    {
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop",
      title: "Bridal Updo",
      category: "Styling"
    },
    {
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop",
      title: "Modern Bob Cut",
      category: "Cut"
    },
    {
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1974&auto=format&fit=crop",
      title: "Editorial Styling",
      category: "Editorial"
    },
    {
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1974&auto=format&fit=crop",
      title: "Men's Classic Cut",
      category: "Men's"
    },
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1974&auto=format&fit=crop",
      title: "Hair Treatment",
      category: "Treatment"
    }
  ];

  return (
    <section id="gallery" className="min-h-screen flex items-center justify-center relative py-32 bg-retro-cream">
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
              <Camera className="w-4 h-4 mr-2" />
              Our Work
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-retro-walnut mb-6">
              Portfolio of Transformations
            </h2>
            <p className="text-xl text-retro-walnut/80 max-w-3xl mx-auto">
              Every cut, color, and style tells a story of transformation and beauty
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((item, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer relative overflow-hidden rounded-2xl"
              >
                <div
                  className="h-80 bg-cover bg-center relative transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-retro-walnut/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="mb-2 bg-retro-terracotta/90 text-white text-xs">
                      {item.category}
                    </Badge>
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                  </div>
                </div>
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
      name: "Sophia Martinez",
      role: "Regular Client",
      content: "Luna transformed my hair completely! The balayage is absolutely stunning and I've never received so many compliments. The 70s vibe of the salon makes every visit feel special.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "David Kim",
      role: "Groom",
      content: "Marco gave me the perfect cut for my wedding day. Professional, precise, and the hot towel treatment was incredible. The vintage atmosphere added such a cool touch to the experience.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Elena Rodriguez",
      role: "Bride",
      content: "Aria made me feel like a princess on my wedding day. The trial run and final styling were perfect. The attention to detail and the retro elegance of the studio made it magical.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section id="testimonials" className="min-h-screen flex items-center justify-center relative py-32 bg-retro-linen">
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
              Client Love
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-retro-walnut mb-6">
              Rave Reviews
            </h2>
            <p className="text-xl text-retro-walnut/80 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied clients
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
                <Card className="h-full bg-retro-cream/90 backdrop-blur-sm border-2 border-retro-sage/30 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-retro-gold fill-current" />
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
    service: '',
    stylist: '',
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
    <section id="booking" className="min-h-screen flex items-center justify-center relative py-32 bg-retro-cream">
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
              Book Your Appointment
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-retro-walnut mb-6">
              Ready for Your Transformation?
            </h2>
            <p className="text-xl text-retro-walnut/80 max-w-3xl mx-auto">
              Book your appointment and let our expert stylists create your perfect look
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Booking Form */}
            <motion.div
              variants={fadeInUp}
              className="bg-retro-linen/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-retro-sage/40"
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
                      className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-cream/50"
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
                      className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-cream/50"
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
                      className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-cream/50"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-retro-walnut mb-2">
                      Preferred Service
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-cream/50"
                    >
                      <option value="">Select a service</option>
                      <option value="haircut">Signature Haircut</option>
                      <option value="color">Color Service</option>
                      <option value="styling">Luxury Styling</option>
                      <option value="treatment">Hair Treatment</option>
                      <option value="bridal">Bridal Package</option>
                      <option value="mens">Men's Grooming</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-retro-walnut mb-2">
                      Preferred Stylist
                    </label>
                    <select
                      name="stylist"
                      value={formData.stylist}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-cream/50"
                    >
                      <option value="">Any available stylist</option>
                      <option value="luna">Luna Voss</option>
                      <option value="marco">Marco Silva</option>
                      <option value="aria">Aria Chen</option>
                      <option value="jax">Jax Rivera</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-retro-walnut mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-cream/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-retro-walnut mb-2">
                    Preferred Time
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-cream/50"
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

                <div>
                  <label className="block text-sm font-medium text-retro-walnut mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-retro-sage/30 rounded-lg focus:ring-2 focus:ring-retro-terracotta focus:border-transparent bg-retro-cream/50"
                    placeholder="Any special requests or inspiration photos..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-retro-terracotta hover:bg-retro-terracotta/90 text-white py-3 text-lg border-2 border-retro-gold/30"
                  size="lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Book Your Appointment
                </Button>
              </form>
            </motion.div>

            {/* Contact Info & Hours */}
            <motion.div variants={fadeInUp} className="space-y-8">
              {/* Hours & Info */}
              <div className="bg-retro-linen/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-retro-sage/40">
                <h3 className="text-2xl font-bold text-retro-walnut mb-6">Visit Our Studio</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-retro-sage/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-retro-walnut" />
                    </div>
                    <div>
                      <p className="font-medium text-retro-walnut">Address</p>
                      <p className="text-retro-walnut/70">456 Glamour Avenue<br />Style District, SD 12345</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-retro-sage/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-retro-walnut" />
                    </div>
                    <div>
                      <p className="font-medium text-retro-walnut">Phone</p>
                      <p className="text-retro-walnut/70">(555) STYLE-UP</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-retro-sage/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-retro-walnut" />
                    </div>
                    <div>
                      <p className="font-medium text-retro-walnut">Email</p>
                      <p className="text-retro-walnut/70">hello@retroglamourstudio.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-retro-sage/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-retro-walnut" />
                    </div>
                    <div>
                      <p className="font-medium text-retro-walnut">Hours</p>
                      <p className="text-retro-walnut/70">Tue - Sat: 9:00 AM - 7:00 PM<br />Sun: 10:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Offers */}
              <div className="bg-retro-linen/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-retro-sage/40">
                <h3 className="text-xl font-bold text-retro-walnut mb-4">Special Offers</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-retro-terracotta/10 rounded-lg">
                    <Crown className="w-5 h-5 text-retro-terracotta" />
                    <div>
                      <p className="font-medium text-retro-walnut text-sm">New Client Special</p>
                      <p className="text-xs text-retro-walnut/60">25% off your first visit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-retro-sage/10 rounded-lg">
                    <Scissors className="w-5 h-5 text-retro-walnut" />
                    <div>
                      <p className="font-medium text-retro-walnut text-sm">Student Discount</p>
                      <p className="text-xs text-retro-walnut/60">15% off with valid ID</p>
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
          {/* Studio Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-retro-linen">Retro Glamour Studio</h3>
            <p className="text-retro-linen/80 mb-6 leading-relaxed">
              Where vintage elegance meets modern artistry. Transform your look with our expert stylists in our beautifully curated 70s-inspired salon.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-retro-terracotta/20 rounded-lg flex items-center justify-center hover:bg-retro-terracotta/30 transition-colors cursor-pointer">
                <Instagram className="w-5 h-5 text-retro-linen" />
              </div>
              <div className="w-10 h-10 bg-retro-terracotta/20 rounded-lg flex items-center justify-center hover:bg-retro-terracotta/30 transition-colors cursor-pointer">
                <Facebook className="w-5 h-5 text-retro-linen" />
              </div>
              <div className="w-10 h-10 bg-retro-terracotta/20 rounded-lg flex items-center justify-center hover:bg-retro-terracotta/30 transition-colors cursor-pointer">
                <Phone className="w-5 h-5 text-retro-linen" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-retro-linen">Services</h4>
            <ul className="space-y-2">
              {['Hair Cuts', 'Hair Color', 'Styling', 'Treatments', 'Bridal', 'Men\'s Grooming'].map((service) => (
                <li key={service}>
                  <span className="text-retro-linen/80 hover:text-retro-linen transition-colors text-sm cursor-pointer">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4 text-retro-linen">Info</h4>
            <ul className="space-y-2">
              {['About Us', 'Our Team', 'Gallery', 'Reviews', 'Contact', 'Gift Cards'].map((item) => (
                <li key={item}>
                  <span className="text-retro-linen/80 hover:text-retro-linen transition-colors text-sm cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-retro-linen/20 mt-12 pt-8 text-center">
          <p className="text-retro-linen/60 text-sm">
            © 2024 Retro Glamour Studio. All rights reserved. |
            <span className="mx-2">Premier hair salon in [City]</span> |
            <span className="mx-2">Vintage hair studio, professional styling, beauty salon</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Page Component
export default function Retro70sSalonDemo() {
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
    const sections = ['hero', 'services', 'stylists', 'gallery', 'testimonials', 'booking'];
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
    const sections = ['hero', 'services', 'stylists', 'gallery', 'testimonials', 'booking'];
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
    const sections = ['hero', 'services', 'stylists', 'gallery', 'testimonials', 'booking'];
    const nextIndex = (currentSection + 1) % sections.length;
    const nextSection = document.getElementById(sections[nextIndex]);
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToPreviousSection = () => {
    goToPrevious();
    const sections = ['hero', 'services', 'stylists', 'gallery', 'testimonials', 'booking'];
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
      <ServicesSection />
      <StylistsSection />
      <GallerySection />
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
        businessType="Hair Salon & Beauty"
        primaryColor="#C7533B"
        secondaryColor="#758E85"
      />
    </div>
  );
}