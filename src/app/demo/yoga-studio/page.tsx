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
  CheckCircle
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

// Floating Navigation Component
const FloatingNavigation = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Heart },
    { id: 'about', label: 'About', icon: Users },
    { id: 'classes', label: 'Classes', icon: Calendar },
    { id: 'instructors', label: 'Instructors', icon: Award },
    { id: 'pricing', label: 'Membership', icon: Star },
    { id: 'testimonials', label: 'Reviews', icon: Star },
    { id: 'contact', label: 'Contact', icon: Phone },
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
      {/* Main Menu Button - Floating */}
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          size="icon"
          className="w-12 h-12 rounded-full bg-yoga-deep-green/90 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-yoga-deep-green hover:scale-110 transition-all duration-300"
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
                <X className="w-5 h-5 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5 text-white" />
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
            className="fixed top-0 right-0 h-full w-80 bg-yoga-cream/95 backdrop-blur-md shadow-2xl z-50 border-l border-yoga-sage/30"
          >
            <div className="p-6 pt-20">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
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
                          ? 'bg-yoga-deep-green text-white shadow-lg'
                          : 'hover:bg-yoga-light-green/50 hover:shadow-md'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive ? 'bg-white/20' : 'bg-yoga-sage/20 group-hover:bg-yoga-sage/30'
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-yoga-deep-green'}`} />
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

// Hero Section Component
const HeroSection = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-yoga-cream">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <Badge className="mb-4 px-4 py-2 text-sm bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Heart className="w-4 h-4 mr-2" />
              Find Your Inner Peace
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight"
          >
            Find Your Balance at
            <span className="block text-yoga-light-green">Serenity Yoga Studio</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Yoga, wellness, and mindfulness in the heart of the city. Join our community for transformation and inner peace.
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
                className="px-8 py-4 text-lg bg-yoga-deep-green hover:bg-yoga-deep-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Join a Free Trial Class
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="w-5 h-5 mr-2" />
                Explore Classes
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
        <ChevronDown className="w-6 h-6 text-white/70" />
      </motion.div>
    </section>
  );
};

// About Section Component
const AboutSection = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center relative py-32 bg-yoga-beige">
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
              <Badge className="mb-4 px-4 py-2 bg-yoga-sage/20 text-yoga-deep-green">
                <Users className="w-4 h-4 mr-2" />
                About Serenity Yoga Studio
              </Badge>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-yoga-deep-green leading-tight"
            >
              A Community for
              <span className="text-yoga-warm-brown block">Mindfulness, Strength & Inner Peace</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-yoga-warm-brown/80 leading-relaxed"
            >
              At Serenity Yoga Studio, we believe that yoga is more than just physical exercise—it's a journey toward self-discovery, balance, and wellbeing. Our experienced instructors guide you through practices that nurture both body and mind in our calming, welcoming space.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { number: "500+", label: "Happy Students" },
                { number: "50+", label: "Classes Weekly" },
                { number: "10+", label: "Expert Instructors" },
                { number: "5+", label: "Years of Excellence" }
              ].map((fact, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 bg-yoga-cream/80 backdrop-blur-sm rounded-xl border border-yoga-sage/30"
                >
                  <div className="text-3xl font-bold text-yoga-deep-green mb-2">{fact.number}</div>
                  <div className="text-sm text-yoga-warm-brown">{fact.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Image */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-yoga-cream/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-yoga-sage/30">
              <div
                className="h-96 bg-cover bg-center rounded-2xl"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2020&q=80')"
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Classes Section Component
const ClassesSection = () => {
  const classes = [
    {
      name: "Hatha Yoga",
      description: "Gentle Hatha for beginners to improve flexibility and find inner peace",
      schedule: "Mon, Wed, Fri - 9:00 AM",
      duration: "60 min",
      level: "All Levels",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Vinyasa Flow",
      description: "Dynamic flowing sequences that build strength and cardiovascular health",
      schedule: "Tue, Thu - 6:00 PM",
      duration: "75 min",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Restorative Yoga",
      description: "Deep relaxation with supported poses to release tension and stress",
      schedule: "Sat, Sun - 10:00 AM",
      duration: "90 min",
      level: "All Levels",
      image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Power Yoga",
      description: "Energetic practice focusing on building core strength and endurance",
      schedule: "Mon, Wed - 7:00 PM",
      duration: "60 min",
      level: "Advanced",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Meditation & Mindfulness",
      description: "Guided meditation sessions for mental clarity and emotional balance",
      schedule: "Daily - 8:00 AM",
      duration: "30 min",
      level: "All Levels",
      image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Prenatal Yoga",
      description: "Safe, gentle yoga practice designed for expectant mothers",
      schedule: "Tue, Thu - 10:00 AM",
      duration: "60 min",
      level: "All Levels",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section id="classes" className="min-h-screen flex items-center justify-center relative py-32 bg-yoga-light-green/30">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-yoga-sage/20 text-yoga-deep-green">
              <Calendar className="w-4 h-4 mr-2" />
              Our Classes
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-yoga-deep-green mb-6">
              Find Your Perfect Practice
            </h2>
            <p className="text-xl text-yoga-warm-brown/80 max-w-3xl mx-auto">
              From gentle Hatha to dynamic Vinyasa, we offer classes for every body and every level
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classItem, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="h-full bg-yoga-cream/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div
                    className="h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${classItem.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-yoga-deep-green/90 text-white">
                        {classItem.level}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-yoga-deep-green mb-2 group-hover:text-yoga-warm-brown transition-colors">
                      {classItem.name}
                    </h3>

                    <p className="text-yoga-warm-brown/70 mb-4 leading-relaxed">
                      {classItem.description}
                    </p>

                    <div className="space-y-2 text-sm text-yoga-warm-brown/60">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {classItem.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {classItem.schedule}
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

// Instructors Section Component
const InstructorsSection = () => {
  const instructors = [
    {
      name: "Sarah Chen",
      role: "Senior Instructor & Studio Founder",
      certifications: "RYT-500, Mindfulness Coach",
      specialties: ["Hatha Yoga", "Meditation", "Teacher Training"],
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      bio: "Sarah has been practicing yoga for over 15 years and founded Serenity Studio to create a welcoming space for all practitioners."
    },
    {
      name: "Michael Rodriguez",
      role: "Vinyasa & Power Yoga Instructor",
      certifications: "RYT-300, NASM-CPT",
      specialties: ["Vinyasa Flow", "Power Yoga", "Strength Training"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      bio: "Michael brings his background in fitness and yoga together to help students build both physical and mental strength."
    },
    {
      name: "Priya Patel",
      role: "Restorative & Prenatal Instructor",
      certifications: "RYT-500, Prenatal Yoga Certified",
      specialties: ["Restorative Yoga", "Prenatal Yoga", "Yin Yoga"],
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      bio: "Priya specializes in gentle, therapeutic practices that help students find deep relaxation and healing."
    },
    {
      name: "David Kim",
      role: "Meditation & Mindfulness Guide",
      certifications: "Meditation Teacher, RYT-200",
      specialties: ["Meditation", "Mindfulness", "Breathwork"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      bio: "David guides students in meditation practices that cultivate present-moment awareness and inner peace."
    }
  ];

  return (
    <section id="instructors" className="min-h-screen flex items-center justify-center relative py-32 bg-yoga-cream">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-yoga-sage/20 text-yoga-deep-green">
              <Award className="w-4 h-4 mr-2" />
              Meet Our Instructors
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-yoga-deep-green mb-6">
              Expert Guidance Every Step
            </h2>
            <p className="text-xl text-yoga-warm-brown/80 max-w-3xl mx-auto">
              Our certified instructors bring years of experience and genuine passion to every class
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {instructors.map((instructor, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div
                    className="h-64 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${instructor.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{instructor.name}</h3>
                      <p className="text-white/90 text-sm">{instructor.role}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Badge className="mb-2 bg-yoga-light-green/20 text-yoga-deep-green text-xs">
                        {instructor.certifications}
                      </Badge>
                    </div>

                    <p className="text-yoga-warm-brown/70 text-sm mb-4 leading-relaxed">
                      {instructor.bio}
                    </p>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-yoga-deep-green mb-2">Specialties:</p>
                      {instructor.specialties.map((specialty, specialtyIndex) => (
                        <div key={specialtyIndex} className="flex items-center gap-2 text-xs text-yoga-warm-brown/60">
                          <div className="w-1.5 h-1.5 bg-yoga-sage rounded-full" />
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

// Pricing Section Component
const PricingSection = () => {
  const pricingPlans = [
    {
      name: "Drop-in",
      price: "$25",
      period: "per class",
      description: "Perfect for trying out our classes",
      features: [
        "Single class access",
        "All class types available",
        "Valid for 30 days",
        "No commitment required"
      ],
      popular: false,
      cta: "Book a Class"
    },
    {
      name: "Monthly",
      price: "$120",
      period: "per month",
      description: "Great for regular practitioners",
      features: [
        "Unlimited classes",
        "Priority booking",
        "Member discounts",
        "Free mat rental"
      ],
      popular: true,
      cta: "Start Monthly"
    },
    {
      name: "Annual",
      price: "$1,200",
      period: "per year",
      description: "Best value for dedicated yogis",
      features: [
        "Unlimited classes",
        "Priority booking",
        "Free workshops",
        "20% off retail items",
        "Bring a friend free (monthly)"
      ],
      popular: false,
      cta: "Go Annual"
    }
  ];

  return (
    <section id="pricing" className="min-h-screen flex items-center justify-center relative py-32 bg-yoga-beige">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-yoga-sage/20 text-yoga-deep-green">
              <Star className="w-4 h-4 mr-2" />
              Membership Options
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-yoga-deep-green mb-6">
              Choose Your Journey
            </h2>
            <p className="text-xl text-yoga-warm-brown/80 max-w-3xl mx-auto">
              Flexible options to fit your lifestyle and commitment level
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yoga-deep-green text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card className={`h-full ${plan.popular ? 'bg-yoga-cream border-2 border-yoga-deep-green' : 'bg-white/80'} backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500`}>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-yoga-deep-green mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-yoga-warm-brown">{plan.price}</span>
                      <span className="text-yoga-warm-brown/60">{plan.period}</span>
                    </div>
                    <p className="text-yoga-warm-brown/70 mb-6">{plan.description}</p>

                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center justify-center gap-2 text-sm text-yoga-warm-brown">
                          <CheckCircle className="w-4 h-4 text-yoga-sage flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full ${plan.popular ? 'bg-yoga-deep-green hover:bg-yoga-deep-green/90' : 'bg-yoga-sage hover:bg-yoga-sage/90'} text-white`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
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
      name: "Emma Thompson",
      role: "Monthly Member",
      content: "Serenity Yoga Studio has completely transformed my practice. The instructors are incredibly knowledgeable and the community is so welcoming. I always leave feeling centered and energized.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "James Wilson",
      role: "Annual Member",
      content: "After years of searching for the right yoga studio, I finally found my home at Serenity. The variety of classes and the peaceful atmosphere keep me coming back every week.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Maria Garcia",
      role: "Drop-in Student",
      content: "As a beginner, I was nervous about starting yoga. The instructors at Serenity made me feel comfortable from day one. The restorative classes are exactly what I needed for stress relief.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section id="testimonials" className="min-h-screen flex items-center justify-center relative py-32 bg-yoga-light-green/20">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-yoga-sage/20 text-yoga-deep-green">
              <Star className="w-4 h-4 mr-2" />
              What Our Students Say
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-yoga-deep-green mb-6">
              Stories of Transformation
            </h2>
            <p className="text-xl text-yoga-warm-brown/80 max-w-3xl mx-auto">
              Real experiences from our yoga community
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
                <Card className="h-full bg-yoga-cream/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <p className="text-yoga-warm-brown/80 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 bg-cover bg-center rounded-full"
                        style={{ backgroundImage: `url(${testimonial.image})` }}
                      />
                      <div>
                        <h4 className="font-semibold text-yoga-deep-green">{testimonial.name}</h4>
                        <p className="text-sm text-yoga-warm-brown/60">{testimonial.role}</p>
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

// Contact Section Component
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    classType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center relative py-32 bg-yoga-cream">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-yoga-sage/20 text-yoga-deep-green">
              <Phone className="w-4 h-4 mr-2" />
              Start Your Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-yoga-deep-green mb-6">
              Ready to Find Your Balance?
            </h2>
            <p className="text-xl text-yoga-warm-brown/80 max-w-3xl mx-auto">
              Join us for a free trial class or contact us with any questions
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-yoga-sage/30"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-yoga-deep-green mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-yoga-sage/30 rounded-lg focus:ring-2 focus:ring-yoga-deep-green focus:border-transparent bg-yoga-cream/50"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yoga-deep-green mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-yoga-sage/30 rounded-lg focus:ring-2 focus:ring-yoga-deep-green focus:border-transparent bg-yoga-cream/50"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yoga-deep-green mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-yoga-sage/30 rounded-lg focus:ring-2 focus:ring-yoga-deep-green focus:border-transparent bg-yoga-cream/50"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yoga-deep-green mb-2">
                    Interested Class
                  </label>
                  <select
                    name="classType"
                    value={formData.classType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-yoga-sage/30 rounded-lg focus:ring-2 focus:ring-yoga-deep-green focus:border-transparent bg-yoga-cream/50"
                  >
                    <option value="">Select a class type</option>
                    <option value="hatha">Hatha Yoga</option>
                    <option value="vinyasa">Vinyasa Flow</option>
                    <option value="restorative">Restorative Yoga</option>
                    <option value="power">Power Yoga</option>
                    <option value="meditation">Meditation</option>
                    <option value="prenatal">Prenatal Yoga</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yoga-deep-green hover:bg-yoga-deep-green/90 text-white py-3 text-lg"
                  size="lg"
                >
                  Book Your Free Trial Class
                </Button>
              </form>
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div variants={fadeInUp} className="space-y-8">
              {/* Studio Info */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-yoga-sage/30">
                <h3 className="text-2xl font-bold text-yoga-deep-green mb-6">Visit Our Studio</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yoga-sage/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-yoga-deep-green" />
                    </div>
                    <div>
                      <p className="font-medium text-yoga-deep-green">Address</p>
                      <p className="text-yoga-warm-brown/70">123 Peaceful Street<br />Mindful City, MC 12345</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yoga-sage/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-yoga-deep-green" />
                    </div>
                    <div>
                      <p className="font-medium text-yoga-deep-green">Phone</p>
                      <p className="text-yoga-warm-brown/70">(555) 123-YOGA</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yoga-sage/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-yoga-deep-green" />
                    </div>
                    <div>
                      <p className="font-medium text-yoga-deep-green">Email</p>
                      <p className="text-yoga-warm-brown/70">hello@serenityyogastudio.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yoga-sage/20 rounded-lg flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-yoga-deep-green" />
                    </div>
                    <div>
                      <p className="font-medium text-yoga-deep-green">Follow Us</p>
                      <p className="text-yoga-warm-brown/70">@serenityyogastudio</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-yoga-sage/30">
                <h3 className="text-xl font-bold text-yoga-deep-green mb-4">Find Us</h3>
                <div className="h-48 bg-yoga-light-green/30 rounded-lg flex items-center justify-center">
                  <div className="text-center text-yoga-deep-green">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Interactive Map Coming Soon</p>
                    <p className="text-sm text-yoga-warm-brown/60">123 Peaceful Street, Mindful City</p>
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
    <footer className="bg-yoga-deep-green text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Studio Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Serenity Yoga Studio</h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Your sanctuary for yoga, mindfulness, and wellness in the heart of the city.
              Join our community and discover your inner peace.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <Phone className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <Mail className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About', 'Classes', 'Instructors', 'Membership', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Class Types */}
          <div>
            <h4 className="font-semibold mb-4">Class Types</h4>
            <ul className="space-y-2">
              {['Hatha Yoga', 'Vinyasa Flow', 'Restorative', 'Power Yoga', 'Meditation', 'Prenatal'].map((classType) => (
                <li key={classType}>
                  <span className="text-white/80 text-sm">{classType}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2024 Serenity Yoga Studio. All rights reserved. |
            <span className="mx-2">Yoga classes in [City]</span> |
            <span className="mx-2">Hatha, Vinyasa, Meditation, Wellness workshops</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Page Component
export default function YogaStudioDemo() {
  const { ref: gestureRef, isGestureActive } = useGestureNavigation({
    onSwipeUp: () => scrollToNextSection(),
    onSwipeDown: () => scrollToPreviousSection(),
    onSwipeLeft: () => goToNextSection(),
    onSwipeRight: () => goToPreviousSection()
  });

  const divRef = gestureRef as React.RefObject<HTMLDivElement>;
  const [showRobofyCTA, setShowRobofyCTA] = useState(false);

  const { currentSection, goToNext, goToPrevious } = useSectionNavigation(7);

  const scrollToNextSection = () => {
    const sections = ['hero', 'about', 'classes', 'instructors', 'pricing', 'testimonials', 'contact'];
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
    const sections = ['hero', 'about', 'classes', 'instructors', 'pricing', 'testimonials', 'contact'];
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
    const sections = ['hero', 'about', 'classes', 'instructors', 'pricing', 'testimonials', 'contact'];
    const nextIndex = (currentSection + 1) % sections.length;
    const nextSection = document.getElementById(sections[nextIndex]);
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToPreviousSection = () => {
    goToPrevious();
    const sections = ['hero', 'about', 'classes', 'instructors', 'pricing', 'testimonials', 'contact'];
    const prevIndex = currentSection === 0 ? sections.length - 1 : currentSection - 1;
    const prevSection = document.getElementById(sections[prevIndex]);
    prevSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={divRef}
      className={`bg-yoga-cream transition-colors duration-300 ${isGestureActive ? 'cursor-grabbing' : 'cursor-default'}`}
      tabIndex={0}
    >
      {/* Gesture Active Indicator */}
      {isGestureActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yoga-deep-green/90 text-white px-3 py-1 rounded-full text-sm z-[70] pointer-events-none shadow-lg font-medium"
        >
          Gesture Active - Swipe to navigate
        </motion.div>
      )}

      <FloatingNavigation />
      <HeroSection />
      <AboutSection />
      <ClassesSection />
      <InstructorsSection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />

      {/* Robofy CTA Components */}
      <FloatingCTAButton
        onClick={() => setShowRobofyCTA(true)}
        className="bg-yoga-deep-green hover:bg-yoga-deep-green/90"
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Yoga Studio"
        primaryColor="#22C55E"
        secondaryColor="#16A34A"
      />
    </div>
  );
}