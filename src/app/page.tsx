"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import TeamSection from '@/components/ui/TeamSection';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import { teamMembers } from '@/data/team';
import { useGestureNavigation, useSectionNavigation } from '@/app/demo/gym/hooks/useGestureNavigation';
import {
  Zap,
  Brain,
  Target,
  TrendingUp,
  Users,
  Settings,
  Play,
  X,
  ChevronDown,
  ChevronUp,
  Menu,
  Sparkles,
  Rocket,
  Eye,
  MessageCircle
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
    { id: 'hero', label: 'Home', icon: Sparkles },
    { id: 'about', label: 'About', icon: Brain },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'demos', label: 'Demos', icon: Play },
    { id: 'contact', label: 'Contact', icon: MessageCircle },
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
      {/* Floating Action Buttons */}
      <motion.div
        className="fixed top-6 right-6 z-50 flex gap-3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        {/* Dark Mode Toggle */}
        <DarkModeToggle />

        {/* Main Menu Button */}
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          size="icon"
          className="w-12 h-12 rounded-full bg-primary/90 dark:bg-primary/80 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-lg hover:bg-primary dark:hover:bg-primary/70 hover:scale-110 transition-all duration-300"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
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
            className="fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl z-50 border-l border-gray-200 dark:border-gray-700"
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
                          ? 'bg-primary text-white shadow-lg'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive ? 'bg-white/20' : 'bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30'
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-primary dark:text-primary'}`} />
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

// Morphing Text Component
const MorphingText = ({ texts }: { texts: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <motion.div className="relative h-16 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};

// Typewriter Text Component
const TypewriterText = ({ text, speed = 50 }: { text: string, speed?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className="relative">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1 w-0.5 h-5 bg-primary inline-block"
      />
    </span>
  );
};

// useScrollAnimation Hook
const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

// useReducedMotion Hook
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Particle Background Component
const ParticleBackground = ({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mouse interaction
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          particle.vx += dx * 0.0001;
          particle.vy += dy * 0.0001;
        }

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
        ctx.fill();

        // Connect nearby particles
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePosition, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
    />
  );
};

// Interactive Service Card Component
const InteractiveServiceCard = ({ service, index }: { service: any, index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref: gestureRef, isGestureActive } = useGestureNavigation({
    onSwipeUp: () => setIsExpanded(true),
    onSwipeDown: () => setIsExpanded(false)
  });

  return (
    <motion.div
      ref={gestureRef as React.RefObject<HTMLDivElement>}
      layout
      animate={{
        height: isExpanded ? 'auto' : 'fixed-height',
        scale: isGestureActive ? 0.98 : 1
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <CardContent className="p-8">
          <motion.div
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300"
            whileHover={{ rotate: 5, scale: 1.1 }}
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isExpanded ? 1 : 0,
              height: isExpanded ? 'auto' : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-gray-100">
              <div className="space-y-2">
                {service.features.map((feature: string, featureIndex: number) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                    transition={{ delay: featureIndex * 0.1 }}
                    className="flex items-center gap-2 text-sm text-gray-500"
                  >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {feature}
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 10 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Button className="w-full" size="sm">
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Swipe hint */}
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2 + index * 0.5 }}
              className="flex justify-center mt-4"
            >
              <ChevronUp className="w-4 h-4 text-primary/30" />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Hero Section Component
const HeroSection = ({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  const [floatingPositions, setFloatingPositions] = useState<Array<{left: string, top: string}>>([]);
  const heroTexts = [
    "AI-First Digital Agency",
    "Automate Your Growth",
    "Intelligent Solutions",
    "Future-Ready Business"
  ];

  // Generate random positions only on client side to prevent hydration mismatch
  useEffect(() => {
    const positions = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    setFloatingPositions(positions);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.2),transparent_50%)]" />

      {/* Particle Background */}
      <ParticleBackground prefersReducedMotion={prefersReducedMotion} />

      {/* Animated background elements */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {floatingPositions.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: position.left,
                top: position.top,
              }}
              animate={{
                y: [0, -20, 0],
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
      )}

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <Badge className="mb-4 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Next-Generation AI Solutions
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent leading-tight"
          >
            <MorphingText texts={heroTexts} />
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-300 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            <TypewriterText
              text="Transform your business with cutting-edge AI automation, intelligent content generation, and data-driven growth strategies that deliver measurable results."
              speed={30}
            />
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
                className="px-8 py-4 text-lg bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                See Demos
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-2 hover:bg-primary hover:text-white transition-all duration-300 group"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Eye className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Our Approach
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
        <ChevronDown className="w-6 h-6 text-gray-300" />
      </motion.div>
    </section>
  );
};

// About Section Component
const AboutSection = () => {
  const facts = [
    { number: "500+", label: "Projects Automated" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "50+", label: "AI Solutions Deployed" },
    { number: "24/7", label: "AI Monitoring" }
  ];

  const { ref: aboutRef, isVisible: isAboutVisible } = useScrollAnimation(0.2);

  return (
    <section id="about" className="min-h-screen flex items-center justify-center relative py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            ref={aboutRef as React.RefObject<HTMLDivElement>}
            variants={staggerContainer}
            initial="hidden"
            animate={isAboutVisible ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">
                <Brain className="w-4 h-4 mr-2" />
                About Robofy
              </Badge>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              Pioneering the Future of
              <span className="text-primary block">AI-Driven Business</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              We're not just another digital agency. We're AI-first innovators who believe that
              intelligent automation shouldn't be complex or expensive. Our mission is to democratize
              cutting-edge AI technology for businesses of all sizes.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 gap-6"
            >
              {facts.map((fact, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{fact.number}</div>
                  <div className="text-sm text-gray-600">{fact.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Interactive Panel */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Strategy</h3>
                    <p className="text-sm text-gray-600">Custom AI roadmaps for your business</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Automation</h3>
                    <p className="text-sm text-gray-600">Streamline operations with smart workflows</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Growth</h3>
                    <p className="text-sm text-gray-600">Data-driven strategies that scale</p>
                  </div>
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
  const { ref: servicesRef, isVisible: isServicesVisible } = useScrollAnimation(0.2);

  const services = [
    {
      icon: Brain,
      title: "AI Strategy",
      description: "Custom AI implementation roadmaps tailored to your business goals and industry",
      features: ["Market Analysis", "ROI Forecasting", "Implementation Planning"]
    },
    {
      icon: Settings,
      title: "Process Automation",
      description: "Transform manual workflows into intelligent, self-optimizing systems",
      features: ["Workflow Analysis", "Bot Development", "Performance Monitoring"]
    },
    {
      icon: Target,
      title: "Content Intelligence",
      description: "AI-powered content creation and optimization for maximum engagement",
      features: ["Content Generation", "SEO Optimization", "Performance Analytics"]
    },
    {
      icon: Users,
      title: "Customer Experience",
      description: "Personalized customer journeys powered by machine learning insights",
      features: ["Personalization", "Chat Automation", "Feedback Analysis"]
    },
    {
      icon: TrendingUp,
      title: "Growth Marketing",
      description: "Data-driven marketing strategies that adapt and optimize in real-time",
      features: ["Campaign Automation", "A/B Testing", "Conversion Optimization"]
    },
    {
      icon: Rocket,
      title: "Custom Integrations",
      description: "Seamless AI integration with your existing tools and platforms",
      features: ["API Development", "System Integration", "Custom Solutions"]
    }
  ];

  return (
    <section id="services" className="min-h-screen flex items-center justify-center relative py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={servicesRef as React.RefObject<HTMLDivElement>}
          variants={staggerContainer}
          initial="hidden"
          animate={isServicesVisible ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">
              <Settings className="w-4 h-4 mr-2" />
              Our Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Comprehensive AI Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From strategy to implementation, we provide end-to-end AI solutions that drive real business results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
              >
                <InteractiveServiceCard service={service} index={index} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Apple Card Carousel Component
const AppleCardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const demoShowcases = [
    {
      title: "Fitness Studio AI",
      subtitle: "Member Experience Platform",
      description: "Comprehensive gym management with AI-powered class scheduling and member engagement",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1740&auto=format&fit=crop",
      features: ["Class Management", "Member Portal", "Progress Tracking", "Community Features"],
      demoUrl: "/demo/gym",
      industry: "Fitness"
    },
    {
      title: "Real Estate AI",
      subtitle: "Property Marketing Automation",
      description: "Intelligent property listings, virtual tours, and lead management for real estate professionals",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2874&auto=format&fit=crop",
      features: ["Smart Listings", "Virtual Tours", "Lead Scoring", "Market Analytics"],
      demoUrl: "/demo/property-developer",
      industry: "Real Estate"
    },
    {
      title: "Vintage Vibe Salon",
      subtitle: "Organic Beauty Experience",
      description: "Modern salon management with vintage charm, personalized consultations, and eco-friendly services",
      image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop",
      features: ["Expert Stylists", "Organic Products", "Personalized Care", "Vintage Atmosphere"],
      demoUrl: "/demo/salon-organic",
      industry: "Beauty"
    },
    {
      title: "Serenity Yoga Studio",
      subtitle: "Wellness & Mindfulness Platform",
      description: "Peaceful yoga studio website with organic design, calming aesthetics, and seamless booking experience",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      features: ["Class Scheduling", "Instructor Profiles", "Membership Management", "Organic Navigation"],
      demoUrl: "/demo/yoga-studio",
      industry: "Wellness"
    },
    {
      title: "Magical Events",
      subtitle: "Premium Event Management",
      description: "Artistic event planning website with immersive design, interactive elements, and seamless booking for luxury events",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      features: ["Event Planning", "Portfolio Gallery", "Interactive Timeline", "Premium Design"],
      demoUrl: "/demo/event-manager",
      industry: "Events"
    },
    {
      title: "Crystal Clear Pro",
      subtitle: "Professional Cleaning Service",
      description: "Modern cleaning service website with organic design, interactive hotspots, and intelligent booking system for residential and commercial cleaning",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0",
      features: ["Interactive Hotspots", "Smart Booking", "Service Showcase", "Organic Navigation"],
      demoUrl: "/demo/professional-cleaners",
      industry: "Cleaning"
    },
    {
      title: "Pawfect Care",
      subtitle: "Compassionate Pet Services",
      description: "Full-service pet care website with organic navigation, interactive hotspots, and comprehensive booking system for grooming, veterinary care, and training",
      image: "https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      features: ["Pet Grooming", "Veterinary Care", "Pet Sitting", "Training Programs"],
      demoUrl: "/demo/pet-care",
      industry: "Pet Care"
    },
    {
      title: "Caldwell Medicine",
      subtitle: "Comprehensive Family Healthcare",
      description: "Modern physician practice website with floating navigation orbs, interactive medical services showcase, and intelligent appointment booking system",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      features: ["Family Medicine", "Chronic Disease Management", "Preventive Care", "Telemedicine"],
      demoUrl: "/demo/physician",
      industry: "Healthcare"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % demoShowcases.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + demoShowcases.length) % demoShowcases.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Container */}
      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {demoShowcases.map((demo, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <div className="relative h-96 overflow-hidden">
                {/* Background Image with Parallax Effect */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
                  style={{
                    backgroundImage: `url(${demo.image})`,
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full p-8">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="max-w-2xl"
                    >
                      {/* Industry Badge */}
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                        {demo.industry}
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {demo.title}
                      </h3>
                      <p className="text-white/90 text-lg mb-4">
                        {demo.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-white/80 text-sm leading-relaxed mb-6 line-clamp-2">
                        {demo.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {demo.features.slice(0, 3).map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          className="bg-white text-black hover:bg-white/90"
                          asChild
                        >
                          <a href={demo.demoUrl} target="_blank" rel="noopener noreferrer">
                            <Play className="w-4 h-4 mr-2" />
                            View Demo
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          Learn More
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isHovered ? 1 : 0.3, x: isHovered ? 0 : -20 }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300"
        onClick={prevSlide}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHovered ? 1 : 0.3, x: isHovered ? 0 : 20 }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300"
        onClick={nextSlide}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Progress Indicators & Info */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
        {/* Slide Counter */}
        <div className="text-white/60 text-sm">
          {String(currentIndex + 1).padStart(2, '0')} / {String(demoShowcases.length).padStart(2, '0')}
        </div>

        {/* Dot Indicators */}
        <div className="flex space-x-2">
          {demoShowcases.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Current Demo Name */}
        <div className="text-white/60 text-sm">
          {demoShowcases[currentIndex].title}
        </div>
      </div>
    </div>
  );
};

// Enhanced Demos Section Component
const DemosSection = () => {
  return (
    <section id="demos" className="min-h-screen flex items-center justify-center relative py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-cyan-900/20" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true}}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">
              <Play className="w-4 h-4 mr-2" />
              Live Demo Showcase
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Experience AI in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Interactive demonstrations of our AI solutions working in real-time across different industries
            </p>
          </motion.div>

          {/* Apple Card Carousel */}
          <div className="mb-16">
            <AppleCardCarousel />
          </div>

          {/* Demo Grid - Additional Showcase */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {[
              { name: "Fitness AI", url: "/demo/gym", color: "bg-green-500" },
              { name: "Real Estate AI", url: "/demo/property-developer", color: "bg-purple-500" },
              { name: "Salon AI", url: "/demo/salon-organic", color: "bg-pink-500" },
              { name: "Yoga Studio", url: "/demo/yoga-studio", color: "bg-blue-500" },
              { name: "Event Manager", url: "/demo/event-manager", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
              { name: "Pet Care", url: "/demo/pet-care", color: "bg-gradient-to-br from-orange-400 to-teal-500" },
              { name: "Healthcare AI", url: "/demo/physician", color: "bg-gradient-to-br from-teal-500 to-cyan-500" }
            ].map((demo, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="group cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${demo.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {demo.name.split(' ')[0][0]}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-primary transition-colors">
                      {demo.name}
                    </h4>
                    <Button size="sm" variant="outline" className="w-full text-xs" asChild>
                      <a href={demo.url} target="_blank" rel="noopener noreferrer">
                        View Demo
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            <motion.div
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="group cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    🧽
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-primary transition-colors">
                    Crystal Clear Pro
                  </h4>
                  <Button size="sm" variant="outline" className="w-full text-xs" asChild>
                    <a href="/demo/professional-cleaners" target="_blank" rel="noopener noreferrer">
                      View Demo
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Contact Section Component
const ContactSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center relative py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 dark:from-black dark:via-gray-900 dark:to-black" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp}>
            <Badge className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
              <MessageCircle className="w-4 h-4 mr-2" />
              Get In Touch
            </Badge>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-white dark:text-gray-100 mb-6"
          >
            Ready to Transform Your Business?
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-300 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Let's discuss how AI can revolutionize your operations and drive unprecedented growth
          </motion.p>

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
                onClick={() => setIsFormOpen(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Your AI Journey
              </Button>
            </motion.div>

            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-px h-6 bg-gray-600" />
              <span>or</span>
              <div className="w-px h-6 bg-gray-600" />
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
                <Eye className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Contact Form */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsFormOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Get Started</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFormOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <Button className="w-full" type="submit">
                    Send Message
                  </Button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

// Swipe Indicator Component
const SwipeIndicator = ({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  if (prefersReducedMotion) {
    return (
      <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 flex gap-6 z-[60] pointer-events-none">
        <div className="flex flex-col gap-3 bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
          <ChevronUp className="w-5 h-5 text-white/80" />
          <ChevronDown className="w-5 h-5 text-white/80" />
        </div>
        <div className="flex gap-3 bg-black/20 backdrop-blur-sm rounded-full p-3">
          <ChevronDown className="w-5 h-5 text-white/80" />
          <ChevronDown className="w-5 h-5 text-white/80" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, 20] }}
      transition={{ duration: 4, times: [0, 0.2, 0.8, 1], delay: 2 }}
      className="fixed bottom-32 left-1/2 transform -translate-x-1/2 flex gap-6 z-[60] pointer-events-none"
    >
      {/* Vertical swipe indicators (up/down) */}
      <motion.div
        animate={{ x: [-8, 8, -8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col gap-3 bg-white/15 backdrop-blur-md rounded-full p-4 border border-white/30 shadow-lg"
      >
        <ChevronUp className="w-6 h-6 text-white/90 drop-shadow-sm" />
        <ChevronDown className="w-6 h-6 text-white/90 drop-shadow-sm" />
      </motion.div>

      {/* Horizontal swipe indicators (left/right) */}
      <motion.div
        animate={{ x: [-8, 8, -8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="flex gap-3 bg-white/15 backdrop-blur-md rounded-full p-4 border border-white/30 shadow-lg"
      >
        <motion.div
          animate={{ rotate: [0, 180, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <ChevronDown className="w-6 h-6 text-white/90 drop-shadow-sm" />
        </motion.div>
        <motion.div
          animate={{ rotate: [180, 0, 180] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <ChevronDown className="w-6 h-6 text-white/90 drop-shadow-sm" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Main Page Component
export default function HomePage() {
  // Accessibility - Reduced motion support
  const prefersReducedMotion = useReducedMotion();

  // Section-based swipe navigation
  const { ref: gestureRef, isGestureActive } = useGestureNavigation({
    onSwipeUp: () => scrollToNextSection(),
    onSwipeDown: () => scrollToPreviousSection(),
    onSwipeLeft: () => goToNextSection(),
    onSwipeRight: () => goToPreviousSection()
  });

  // Fix TypeScript ref type issue
  const divRef = gestureRef as React.RefObject<HTMLDivElement>;

  const { currentSection, goToNext, goToPrevious } = useSectionNavigation(6); // 6 sections total

  // Section navigation functions
  const scrollToNextSection = () => {
    const sections = ['hero', 'about', 'services', 'demos', 'contact'];
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
    const sections = ['hero', 'about', 'services', 'demos', 'contact'];
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
    const sections = ['hero', 'about', 'services', 'demos', 'contact'];
    const nextIndex = (currentSection + 1) % sections.length;
    const nextSection = document.getElementById(sections[nextIndex]);
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToPreviousSection = () => {
    goToPrevious();
    const sections = ['hero', 'about', 'services', 'demos', 'contact'];
    const prevIndex = currentSection === 0 ? sections.length - 1 : currentSection - 1;
    const prevSection = document.getElementById(sections[prevIndex]);
    prevSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={divRef}
      className={`bg-black dark:bg-gray-900 transition-colors duration-300 ${isGestureActive ? 'cursor-grabbing' : 'cursor-default'}`}
      tabIndex={0}
    >
      {/* Gesture Active Indicator */}
      {isGestureActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white/90 text-black px-3 py-1 rounded-full text-sm z-[70] pointer-events-none shadow-lg font-medium"
        >
          Gesture Active - Swipe to navigate
        </motion.div>
      )}
      <SwipeIndicator prefersReducedMotion={prefersReducedMotion} />
      <FloatingNavigation />
      <HeroSection prefersReducedMotion={prefersReducedMotion} />
      <AboutSection />
      <ServicesSection />
      <TeamSection teamMembers={teamMembers} />
      <DemosSection />
      <ContactSection />
    </div>
  );
}