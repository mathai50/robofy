"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { RobofyCTA, FloatingCTAButton } from '@/components/ui/RobofyCTA';
import {
  Sparkles,
  Users,
  Calendar,
  Star,
  Phone,
  Mail,
  MapPin,
  Instagram,
  ChevronDown,
  Menu,
  X,
  Play,
  Award,
  Clock,
  CheckCircle,
  Camera,
  Music,
  Utensils,
  Palette,
  Heart,
  Zap,
  ArrowRight,
  Quote,
  Send,
  ExternalLink
} from 'lucide-react';

// Particle effect component for hero background
const ParticleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#ffbe0b'];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Draw connections
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = particle.color + Math.floor((1 - distance / 100) * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

// Morphing Navigation Component
const MorphingNavigation = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Sparkles },
    { id: 'services', label: 'Services', icon: Palette },
    { id: 'portfolio', label: 'Portfolio', icon: Camera },
    { id: 'about', label: 'About', icon: Users },
    { id: 'process', label: 'Process', icon: Clock },
    { id: 'testimonials', label: 'Reviews', icon: Quote },
    { id: 'contact', label: 'Contact', icon: Send },
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
      {/* Main Menu Button - Morphing Shape */}
      <motion.div
        className="fixed top-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-pink-600 to-purple-600"
            initial={false}
            animate={isMenuOpen ? { opacity: 1 } : { opacity: 0 }}
          />
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <X className="w-6 h-6 text-white mx-auto mt-1" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <Menu className="w-6 h-6 text-white mx-auto mt-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
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

      {/* Morphing Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-md shadow-2xl z-50 border-l border-purple-500/30"
          >
            <div className="p-6 pt-20">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.1
                    }
                  }
                }}
                className="space-y-2"
              >
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      variants={{
                        hidden: { x: 50, opacity: 0 },
                        visible: { x: 0, opacity: 1 }
                      }}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'hover:bg-white/10 text-gray-300 hover:text-white'
                      }`}
                    >
                      <motion.div
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive ? 'bg-white/20' : 'bg-purple-500/20 group-hover:bg-purple-500/30'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                      </motion.div>
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute right-4 w-2 h-2 bg-white rounded-full"
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

// Hero Section Component with Diagonal Layout
const HeroSection = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-pink-900/80" />

      <ParticleEffect />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
          {/* Left side - Content */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white space-y-8"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge className="mb-4 px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                Premium Event Management
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              Turning Moments into
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Magical Experiences
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-lg"
            >
              We craft extraordinary events that captivate, inspire, and create lasting memories for your most important celebrations.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Start Planning
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-2 border-purple-400/30 text-white hover:bg-purple-400/10 backdrop-blur-sm"
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="w-5 h-5 mr-2" />
                  View Our Work
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right side - Interactive Element */}
          <motion.div
            initial={{ x: 100, opacity: 0, rotateY: -30 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative w-full h-96 lg:h-[600px]">
              {/* Floating Cards */}
              {[
                { icon: Heart, label: 'Weddings', color: 'from-pink-500 to-rose-500', delay: 0.6 },
                { icon: Users, label: 'Corporate', color: 'from-purple-500 to-indigo-500', delay: 0.8 },
                { icon: Music, label: 'Festivals', color: 'from-cyan-500 to-blue-500', delay: 1.0 },
                { icon: Utensils, label: 'Private', color: 'from-emerald-500 to-teal-500', delay: 1.2 }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: item.delay,
                    type: "spring",
                    stiffness: 200,
                    damping: 10
                  }}
                  className={`absolute w-32 h-32 bg-gradient-to-br ${item.color} rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl cursor-pointer group`}
                  style={{
                    top: `${20 + index * 15}%`,
                    left: `${10 + index * 15}%`,
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotateZ: 5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                  }}
                >
                  <item.icon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-white/70" />
      </motion.div>
    </section>
  );
};

// Services Section with Radial Layout
const ServicesSection = () => {
  const services = [
    {
      icon: Heart,
      title: "Wedding Planning",
      description: "From intimate ceremonies to grand celebrations, we create magical wedding experiences.",
      features: ["Venue Selection", "Theme Design", "Vendor Coordination", "Day-of Management"],
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Users,
      title: "Corporate Events",
      description: "Professional events that impress clients and motivate teams.",
      features: ["Product Launches", "Team Building", "Conferences", "Award Ceremonies"],
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: Music,
      title: "Festival Management",
      description: "Large-scale festivals and cultural events that bring communities together.",
      features: ["Artist Booking", "Stage Management", "Crowd Control", "Marketing"],
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: Utensils,
      title: "Private Parties",
      description: "Exclusive celebrations tailored to your unique vision and style.",
      features: ["Birthday Parties", "Anniversaries", "Dinner Parties", "Social Events"],
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Palette,
      title: "Event Design",
      description: "Creative theming and decor that transforms spaces into immersive experiences.",
      features: ["Concept Development", "Decor Styling", "Lighting Design", "Branding"],
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Award,
      title: "Luxury Events",
      description: "Premium experiences for discerning clients who demand perfection.",
      features: ["VIP Services", "Luxury Venues", "Premium Catering", "Concierge"],
      color: "from-yellow-500 to-orange-600"
    }
  ];

  return (
    <section id="services" className="min-h-screen flex items-center justify-center relative py-32 bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <Palette className="w-4 h-4 mr-2" />
            Our Services
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Crafting
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Unforgettable Moments
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From intimate gatherings to grand celebrations, we bring your vision to life with creativity and precision
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <Card className="h-full bg-slate-800/80 backdrop-blur-sm border border-purple-500/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                <CardContent className="p-8">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-all duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <service.icon className="w-8 h-8" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index * 0.1) + (featureIndex * 0.1) }}
                        className="flex items-center gap-3 text-sm text-gray-300"
                      >
                        <div className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full`} />
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Portfolio Section with Masonry Grid
const PortfolioSection = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const projects = [
    {
      title: "Luxury Wedding Gala",
      category: "Wedding",
      image: "https://images.unsplash.com/photo-1519167758481-83f2183b805f?q=80&w=1000&auto=format&fit=crop",
      description: "An enchanted forest-themed wedding with 300 guests",
      tags: ["Luxury", "Outdoor", "300 Guests"]
    },
    {
      title: "Tech Conference 2024",
      category: "Corporate",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
      description: "Three-day technology conference with international speakers",
      tags: ["Conference", "Technology", "500+ Attendees"]
    },
    {
      title: "Summer Music Festival",
      category: "Festival",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1000&auto=format&fit=crop",
      description: "Two-day outdoor music festival with 15+ artists",
      tags: ["Music", "Outdoor", "15 Artists"]
    },
    {
      title: "Intimate Birthday Soirée",
      category: "Private",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000&auto=format&fit=crop",
      description: "Elegant 50th birthday celebration with close family",
      tags: ["Birthday", "Intimate", "Family"]
    },
    {
      title: "Product Launch Event",
      category: "Corporate",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop",
      description: "Exclusive product launch with media and VIP guests",
      tags: ["Product Launch", "Media", "VIP"]
    },
    {
      title: "Charity Gala Dinner",
      category: "Social",
      image: "https://images.unsplash.com/photo-1464047736614-af63643285bf?q=80&w=1000&auto=format&fit=crop",
      description: "Annual charity gala raising funds for local causes",
      tags: ["Charity", "Gala", "Fundraising"]
    }
  ];

  return (
    <section id="portfolio" className="min-h-screen flex items-center justify-center relative py-32 bg-slate-900">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0">
            <Camera className="w-4 h-4 mr-2" />
            Our Portfolio
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Events That
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Inspire & Delight
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Every event tells a unique story. Explore our recent creations and see how we bring visions to life.
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="break-inside-avoid cursor-pointer group"
              onClick={() => setSelectedProject(index)}
            >
              <div className="relative bg-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                <div
                  className="h-64 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${project.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                      {project.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-white/90 text-sm">{project.description}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={projects[selectedProject].image}
                  alt={projects[selectedProject].title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    {projects[selectedProject].category}
                  </Badge>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-4">{projects[selectedProject].title}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">{projects[selectedProject].description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {projects[selectedProject].tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                onClick={() => setSelectedProject(null)}
              >
                Close Project
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// About Section with Animated Timeline
const AboutSection = () => {
  const milestones = [
    {
      year: "2018",
      title: "Founded with Passion",
      description: "Started with a vision to transform ordinary events into extraordinary experiences",
      icon: Sparkles,
      color: "from-pink-500 to-rose-500"
    },
    {
      year: "2019",
      title: "First Major Event",
      description: "Successfully managed our first 500+ guest corporate conference",
      icon: Users,
      color: "from-purple-500 to-indigo-500"
    },
    {
      year: "2020",
      title: "Expanded Services",
      description: "Added wedding planning and luxury event services to our portfolio",
      icon: Heart,
      color: "from-cyan-500 to-blue-500"
    },
    {
      year: "2022",
      title: "Award Recognition",
      description: "Won 'Event Planner of the Year' for innovative festival management",
      icon: Award,
      color: "from-emerald-500 to-teal-500"
    },
    {
      year: "2024",
      title: "International Reach",
      description: "Expanded operations to serve clients across three continents",
      icon: MapPin,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="about" className="min-h-screen flex items-center justify-center relative py-32 bg-gradient-to-br from-slate-800 to-purple-900">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Timeline */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="flex gap-6 items-start relative"
                >
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${milestone.color} rounded-full flex items-center justify-center text-white shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <milestone.icon className="w-8 h-8" />
                  </motion.div>

                  <div className="flex-1">
                    <div className="text-sm font-bold text-purple-400 mb-1">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{milestone.description}</p>
                  </div>

                  {index < milestones.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-16 bg-gradient-to-b from-purple-500 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white space-y-8"
          >
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <Users className="w-4 h-4 mr-2" />
              About Us
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Passionate Event
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Creators & Innovators
              </span>
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed">
              With over six years of experience in creating magical events, our team combines creativity,
              precision, and passion to deliver unforgettable experiences. We believe every event should
              tell a unique story and leave a lasting impression.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "500+", label: "Events Managed" },
                { number: "50+", label: "Team Members" },
                { number: "98%", label: "Client Satisfaction" },
                { number: "24/7", label: "Support Available" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Process Section with Interactive Flowchart
const ProcessSection = () => {
  const steps = [
    {
      step: "01",
      title: "Discovery & Consultation",
      description: "We start with understanding your vision, preferences, and requirements",
      icon: Users,
      color: "from-pink-500 to-rose-500"
    },
    {
      step: "02",
      title: "Concept Development",
      description: "Creative brainstorming and theme development tailored to your event",
      icon: Palette,
      color: "from-purple-500 to-indigo-500"
    },
    {
      step: "03",
      title: "Planning & Logistics",
      description: "Detailed planning, vendor coordination, and timeline creation",
      icon: Calendar,
      color: "from-cyan-500 to-blue-500"
    },
    {
      step: "04",
      title: "Execution & Management",
      description: "Flawless execution with our experienced team on-site",
      icon: Zap,
      color: "from-emerald-500 to-teal-500"
    },
    {
      step: "05",
      title: "Post-Event Follow-up",
      description: "Debrief, feedback collection, and ongoing support",
      icon: Heart,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="process" className="min-h-screen flex items-center justify-center relative py-32 bg-slate-900">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
            <Clock className="w-4 h-4 mr-2" />
            Our Process
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Seamless Event
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Planning Journey
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our proven 5-step process ensures every detail is perfect, from initial consultation to post-event follow-up.
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transform -translate-y-1/2" />

          <div className="grid lg:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group"
              >
                <div className="text-center">
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 relative shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {step.step}
                    <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>

                  <div className="relative">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white mx-auto mb-4 absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <step.icon className="w-8 h-8" />
                    </motion.div>

                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section with Floating Cards
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Bride",
      event: "Wedding",
      content: "They transformed our wedding into a fairytale. Every detail was perfect, and our guests are still talking about it months later.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop",
      color: "from-pink-500 to-rose-500"
    },
    {
      name: "Michael Chen",
      role: "CEO",
      event: "Product Launch",
      content: "Professional, creative, and incredibly organized. They made our product launch the talk of the industry.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      color: "from-purple-500 to-indigo-500"
    },
    {
      name: "Emma Rodriguez",
      role: "Festival Organizer",
      event: "Music Festival",
      content: "Outstanding festival management! They handled everything from artist coordination to crowd management flawlessly.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <section id="testimonials" className="min-h-screen flex items-center justify-center relative py-32 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white border-0">
            <Quote className="w-4 h-4 mr-2" />
            Client Love
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            What Our
            <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Clients Say
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about their experience working with us.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0, rotateX: -30 }}
              whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{
                y: -10,
                rotateY: 5,
                scale: 1.02
              }}
              className="group cursor-pointer"
            >
              <Card className="h-full bg-slate-800/80 backdrop-blur-sm border border-purple-500/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${testimonial.color}`} />

                <CardContent className="p-8">
                  <motion.div
                    className="mb-6"
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Quote className={`w-12 h-12 text-purple-400`} />
                  </motion.div>

                  <p className="text-gray-300 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 bg-cover bg-center rounded-full border-2 border-purple-500"
                      style={{ backgroundImage: `url(${testimonial.image})` }}
                    />
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role} • {testimonial.event}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Section with Enhanced Form
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    budget: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center relative py-32 bg-slate-900">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <Send className="w-4 h-4 mr-2" />
            Let's Connect
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Create
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Something Amazing?
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Let's discuss your vision and start planning your unforgettable event. We're here to make magic happen.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-500/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
                  >
                    <option value="">Select event type</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="festival">Festival</option>
                    <option value="private">Private Party</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Guest Count
                  </label>
                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Number of guests"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Budget Range
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
                >
                  <option value="">Select budget range</option>
                  <option value="under-10k">Under $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="over-100k">Over $100,000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tell us about your event
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 resize-none"
                  placeholder="Share your vision, theme ideas, special requirements..."
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-5 h-5 mr-2 inline" />
                Start Planning My Event
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info & Social */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Info */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>

              <div className="space-y-6">
                {[
                  { icon: Phone, label: "Phone", value: "(555) 123-EVENT", color: "from-pink-500 to-rose-500" },
                  { icon: Mail, label: "Email", value: "hello@magicalevents.com", color: "from-purple-500 to-indigo-500" },
                  { icon: MapPin, label: "Office", value: "123 Celebration Ave, Event City", color: "from-cyan-500 to-blue-500" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-gray-400">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Follow Our Journey</h3>
              <p className="text-gray-400 mb-6">Stay updated with our latest events and behind-the-scenes magic</p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Instagram, label: "Instagram", handle: "@magicalevents" },
                  { icon: ExternalLink, label: "Website", handle: "magicalevents.com" }
                ].map((social, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (index * 0.1) }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="bg-slate-700/50 rounded-xl p-4 text-center border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer"
                  >
                    <social.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="font-medium text-white text-sm">{social.label}</p>
                    <p className="text-gray-400 text-xs">{social.handle}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-purple-500/20 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Magical Events
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Creating extraordinary events that captivate, inspire, and create lasting memories.
              Your vision, our expertise, magical results.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, color: "hover:text-pink-400" },
                { icon: Phone, color: "hover:text-purple-400" },
                { icon: Mail, color: "hover:text-cyan-400" }
              ].map((social, index) => (
                <motion.div
                  key={index}
                  className={`w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-colors cursor-pointer`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {['Wedding Planning', 'Corporate Events', 'Festival Management', 'Private Parties', 'Event Design'].map((service) => (
                <li key={service}>
                  <span className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>(555) 123-EVENT</p>
              <p>hello@magicalevents.com</p>
              <p>123 Celebration Ave<br />Event City, EC 12345</p>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/20 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Magical Events. All rights reserved. |
            <span className="mx-2">Event Planning</span> |
            <span className="mx-2">Wedding Coordination</span> |
            <span className="mx-2">Corporate Events</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Page Component
export default function EventManagerDemo() {
  const [showRobofyCTA, setShowRobofyCTA] = useState(false);

  return (
    <div className="bg-slate-900">
      <MorphingNavigation />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <AboutSection />
      <ProcessSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />

      {/* Robofy CTA Components */}
      <FloatingCTAButton
        onClick={() => setShowRobofyCTA(true)}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Event Management"
        primaryColor="#9333EA"
        secondaryColor="#EC4899"
      />
    </div>
  );
}