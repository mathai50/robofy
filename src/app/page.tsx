"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Carousel, Card as AppleCard } from '@/components/ui/apple-cards-carousel';
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
    { id: 'deliverables', label: 'Solutions', icon: Rocket },
    { id: 'how-it-works', label: 'Process', icon: Zap },
    { id: 'methodology', label: 'Methodology', icon: Target },
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
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden min-h-[200px]">
        <CardContent className="p-6 md:p-8">
          <motion.div
            className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0"
            whileHover={{ rotate: 5, scale: 1.1 }}
          >
            <service.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
          </motion.div>

          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-primary transition-colors">
            {service.title}
          </h3>

          <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
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
            <div className="pt-3 md:pt-4 border-t border-gray-100">
              <div className="space-y-2 mb-4">
                {service.features.map((feature: string, featureIndex: number) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                    transition={{ delay: featureIndex * 0.1 }}
                    className="flex items-center gap-2 text-sm text-gray-500"
                  >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                    <span className="leading-relaxed">{feature}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 10 }}
                transition={{ delay: 0.3 }}
                className="mt-4 md:mt-6"
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
    <section id="hero" className="min-h-screen md:min-h-screen flex items-center justify-center relative overflow-hidden py-16 md:py-0">
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

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <Badge className="mb-4 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              All-in-One AI Business Transformation
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent leading-tight"
          >
            <MorphingText texts={[
              "AI-Powered Websites",
              "Automated Lead Generation",
              "Voice Appointment Booking",
              "Smart Calendar Management"
            ]} />
          </motion.h1>

          <motion.div
            variants={fadeInUp}
            className="mb-4 p-4 bg-primary/10 backdrop-blur-sm rounded-xl border border-primary/20 max-w-3xl mx-auto"
          >
            <p className="text-lg md:text-xl text-gray-200 dark:text-gray-200 leading-relaxed">
              <strong className="text-primary">All-in-one AI transformation for small & medium businesses:</strong> Get your own NextJS website, automated lead generation, seamless voice appointment booking, and 24/7 calendar & mail assistant.
              <span className="text-primary font-semibold block mt-2">Start seeing results in days—not months.</span>
            </p>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-gray-300 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Turn visitors into confirmed appointments in 60 seconds with AI that works while you sleep.
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
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Schedule Free Demo
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
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Rocket className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Get Started Now
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
    <section id="about" className="min-h-screen md:min-h-screen flex items-center justify-center relative py-16 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
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
    <section id="services" className="min-h-screen md:min-h-screen flex items-center justify-center relative py-16 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          ref={servicesRef as React.RefObject<HTMLDivElement>}
          variants={staggerContainer}
          initial="visible"
          animate="visible"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="w-full"
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

// What We Deliver Section Component
const WhatWeDeliverSection = () => {
  const { ref: deliverRef, isVisible: isDeliverVisible } = useScrollAnimation(0.2);

  const deliverables = [
    {
      icon: Zap,
      title: "NextJS Website",
      description: "Modern, responsive, SEO-driven",
      outcome: "Convert more visitors",
      color: "bg-blue-500",
      features: ["Mobile-first design", "Lightning fast loading", "SEO optimization", "Modern animations"]
    },
    {
      icon: Target,
      title: "Intelligent Lead Capture",
      description: "AI chat, landing forms, CRM sync",
      outcome: "Grow your sales pipeline",
      color: "bg-green-500",
      features: ["24/7 lead capture", "Smart qualification", "CRM integration", "Follow-up automation"]
    },
    {
      icon: MessageCircle,
      title: "Voice Appointment System",
      description: "Natural-language booking, phone or web",
      outcome: "More appointments, less effort",
      color: "bg-purple-500",
      features: ["Voice recognition", "Smart scheduling", "Confirmation calls", "Calendar sync"]
    },
    {
      icon: Brain,
      title: "Calendar & Mail AI Assistant",
      description: "Handles scheduling, reminders, confirmations",
      outcome: "No missed leads or appointments",
      color: "bg-orange-500",
      features: ["Auto-scheduling", "Smart reminders", "Email automation", "Conflict resolution"]
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics & Automation",
      description: "Actionable business insights",
      outcome: "Smarter decisions, better results",
      color: "bg-indigo-500",
      features: ["Performance tracking", "ROI measurement", "Automated reporting", "Growth insights"]
    }
  ];

  return (
    <section id="deliverables" className="min-h-screen md:min-h-screen flex items-center justify-center relative py-16 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-purple-900/20" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          ref={deliverRef as React.RefObject<HTMLDivElement>}
          variants={staggerContainer}
          initial="visible"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">
              <Rocket className="w-4 h-4 mr-2" />
              What We Deliver
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Complete AI Business Transformation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to automate your business and scale growth—delivered as one integrated solution
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {deliverables.map((deliverable, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer w-full"
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden min-h-[280px]">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                      <motion.div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${deliverable.color} group-hover:scale-110 transition-all duration-300 flex-shrink-0`}
                        whileHover={{ rotate: 5 }}
                      >
                        <deliverable.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                          {deliverable.title}
                        </h3>
                        <p className="text-sm text-gray-600">{deliverable.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-semibold text-green-600 text-sm">{deliverable.outcome}</span>
                      </div>

                      <div className="space-y-2">
                        {deliverable.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                            <span className="leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Future-Ready Section */}
          <motion.div
            variants={fadeInUp}
            className="bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-8 border border-primary/20"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Future-Ready By Design
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                Robofy sites deliver seamless experiences on today's devices and tomorrow's platforms—fully supporting touch, voice, and gesture navigation for next-gen wearables like smart glasses.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Gesture Navigation Ready</h4>
                  <p className="text-sm text-gray-600">Effortless, touch-free browsing via hand motions on AR smart glasses</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Voice and Touch Compatible</h4>
                  <p className="text-sm text-gray-600">Book, browse, and interact however your users prefer</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Multi-Device Seamlessness</h4>
                  <p className="text-sm text-gray-600">Consistent experience from mobile to augmented reality</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// How It Works Section Component
const HowItWorksSection = () => {
  const { ref: worksRef, isVisible: isWorksVisible } = useScrollAnimation(0.2);

  const workflowSteps = [
    {
      step: "01",
      title: "Website Visitor Arrives",
      description: "Potential customer finds your AI-powered website",
      icon: Users,
      color: "bg-blue-500",
      details: "Modern NextJS design captures attention and builds trust instantly"
    },
    {
      step: "02",
      title: "AI Captures Lead",
      description: "Intelligent chat or form captures visitor information",
      icon: Target,
      color: "bg-green-500",
      details: "Smart qualification questions identify high-value prospects automatically"
    },
    {
      step: "03",
      title: "Voice Appointment Booking",
      description: "Customer books appointment via voice or chat",
      icon: MessageCircle,
      color: "bg-purple-500",
      details: "Natural language processing makes booking as easy as a phone call"
    },
    {
      step: "04",
      title: "Auto-Confirmation & Reminders",
      description: "AI sends confirmations and manages calendar",
      icon: Brain,
      color: "bg-orange-500",
      details: "Automated email/SMS reminders ensure no-shows are minimized"
    },
    {
      step: "05",
      title: "Real-Time Updates",
      description: "Your team gets instant notifications and updates",
      icon: TrendingUp,
      color: "bg-indigo-500",
      details: "CRM integration keeps your entire team informed and prepared"
    }
  ];

  const results = [
    { metric: "30%", label: "More leads captured", icon: TrendingUp },
    { metric: "20%", label: "Higher appointment conversion", icon: Target },
    { metric: "3 months", label: "Average ROI timeframe", icon: Rocket },
    { metric: "60 seconds", label: "Average booking time", icon: Zap }
  ];

  return (
    <section id="how-it-works" className="min-h-screen md:min-h-screen flex items-center justify-center relative py-16 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">
        <motion.div
          ref={worksRef as React.RefObject<HTMLDivElement>}
          variants={staggerContainer}
          initial="visible"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">
              <Zap className="w-4 h-4 mr-2" />
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              From Visitor to Customer in 60 Seconds
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how our AI transforms your customer journey with real-world scenarios
            </p>
          </motion.div>

          {/* Workflow Visualization */}
          <div className="mb-16">
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="relative min-h-0"
                >
                  {/* Connection Line - Hidden on mobile/tablet, shown on xl screens */}
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden xl:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 transform translate-x-4 z-0" />
                  )}

                  <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full min-h-[200px] sm:min-h-[220px]">
                    <CardContent className="p-3 sm:p-4 md:p-6 text-center flex flex-col h-full">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-2xl ${step.color} flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg group-hover:scale-110 transition-all duration-300 flex-shrink-0`}>
                        {step.step}
                      </div>

                      <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0`}>
                        <step.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                      </div>

                      <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-primary transition-colors text-xs sm:text-sm md:text-base leading-tight flex-shrink-0">
                        {step.title}
                      </h3>

                      <p className="text-xs text-gray-600 mb-1 sm:mb-2 md:mb-3 flex-grow leading-relaxed min-h-[2rem] sm:min-h-[2.5rem]">
                        {step.description}
                      </p>

                      <p className="text-xs text-gray-500 mt-auto leading-relaxed flex-shrink-0">
                        {step.details}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <motion.div
            variants={fadeInUp}
            className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-8 border border-green-200 dark:border-green-800"
          >
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Proven Results for SMBs Like Yours
            </h3>

            <div className="grid md:grid-cols-4 gap-6">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20"
                >
                  <result.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-primary mb-2">{result.metric}</div>
                  <div className="text-sm text-gray-600">{result.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                "Businesses using Robofy's AI package achieve these results in under 3 months"
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                See Case Studies
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Agile Methodology Section Component
const AgileMethodologySection = () => {
  const { ref: agileRef, isVisible: isAgileVisible } = useScrollAnimation(0.2);

  const agileSteps = [
    {
      step: "01",
      title: "Sprint Planning",
      description: "Weekly planning sessions with your team",
      icon: Target,
      color: "bg-blue-500",
      details: "We break your AI transformation into manageable sprints focused on quick wins"
    },
    {
      step: "02",
      title: "Rapid Development",
      description: "Build and deploy features in 1-2 week cycles",
      icon: Zap,
      color: "bg-green-500",
      details: "See progress every week with working features you can test immediately"
    },
    {
      step: "03",
      title: "Weekly Demos",
      description: "Live demonstrations of new functionality",
      icon: Play,
      color: "bg-purple-500",
      details: "Get hands-on experience with new features and provide real-time feedback"
    },
    {
      step: "04",
      title: "Continuous Feedback",
      description: "Adjust direction based on your input",
      icon: MessageCircle,
      color: "bg-orange-500",
      details: "We adapt quickly to your changing needs and market conditions"
    },
    {
      step: "05",
      title: "Measurable Results",
      description: "Track ROI and performance in real-time",
      icon: TrendingUp,
      color: "bg-indigo-500",
      details: "See exactly how your AI investment is driving business growth"
    }
  ];

  return (
    <section id="methodology" className="min-h-screen md:min-h-screen flex items-center justify-center relative py-16 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-red-900/20" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">
        <motion.div
          ref={agileRef as React.RefObject<HTMLDivElement>}
          variants={staggerContainer}
          initial="visible"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">
              <Settings className="w-4 h-4 mr-2" />
              Agile AI Deployment
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Built Fast, Built Right, Built for You
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our BMAD agile methodology ensures your AI transformation delivers maximum ROI with minimum risk
            </p>
          </motion.div>

          {/* Agile Process */}
          <div className="mb-16">
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {agileSteps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="relative min-h-0"
                >
                  {/* Connection Line - Hidden on mobile/tablet, shown on xl screens */}
                  {index < agileSteps.length - 1 && (
                    <div className="hidden xl:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 transform translate-x-4 z-0" />
                  )}

                  <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full min-h-[200px] sm:min-h-[220px]">
                    <CardContent className="p-3 sm:p-4 md:p-6 text-center flex flex-col h-full">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-2xl ${step.color} flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg group-hover:scale-110 transition-all duration-300 flex-shrink-0`}>
                        {step.step}
                      </div>

                      <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0`}>
                        <step.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                      </div>

                      <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-primary transition-colors text-xs sm:text-sm md:text-base leading-tight flex-shrink-0">
                        {step.title}
                      </h3>

                      <p className="text-xs text-gray-600 mb-1 sm:mb-2 md:mb-3 flex-grow leading-relaxed min-h-[2rem] sm:min-h-[2.5rem]">
                        {step.description}
                      </p>

                      <p className="text-xs text-gray-500 mt-auto leading-relaxed flex-shrink-0">
                        {step.details}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <motion.div
            variants={fadeInUp}
            className="grid md:grid-cols-2 gap-8"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Agile Works for AI</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Rapid Onboarding</h4>
                      <p className="text-sm text-gray-600">Get started in days, not months</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Real-Time Feedback</h4>
                      <p className="text-sm text-gray-600">Weekly demos ensure we're building what you need</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Flexible Approach</h4>
                      <p className="text-sm text-gray-600">Adjust features based on real business needs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Continuous Improvement</h4>
                      <p className="text-sm text-gray-600">Iterative launches with measurable outcomes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur-sm border border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Transform?</h3>
                <p className="text-gray-600 mb-6">
                  Join hundreds of SMBs who've accelerated their growth with our proven agile AI methodology.
                </p>

                <div className="space-y-4">
                  <Button className="w-full" size="lg">
                    Schedule Free Consultation
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    View Agile Process Guide
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    "The BMAD methodology delivered our AI solution 3x faster than traditional approaches"
                  </p>
                  <p className="text-sm text-primary font-semibold text-center mt-1">
                    - Sarah Chen, Salon Owner
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Apple Card Carousel Component using shadcn
const AppleCardCarousel = () => {
  const demoShowcases = [
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1740&auto=format&fit=crop",
      title: "Fitness Studio AI",
      category: "Fitness",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Comprehensive gym management with AI-powered class scheduling and member engagement platform.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Class Management</h4>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Member Portal</h4>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Progress Tracking</h4>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200">Community Features</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/gym" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Serenity Yoga Studio",
      category: "Wellness",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Peaceful yoga studio website with organic design, calming aesthetics, and seamless booking experience.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Class Scheduling</h4>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Instructor Profiles</h4>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Membership Management</h4>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200">Organic Navigation</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/yoga-studio" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Magical Events",
      category: "Events",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Artistic event planning website with immersive design, interactive elements, and seamless booking for luxury events.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Event Planning</h4>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-pink-800 dark:text-pink-200">Portfolio Gallery</h4>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-indigo-800 dark:text-indigo-200">Interactive Timeline</h4>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Premium Design</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/event-manager" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1724026822916-3da5df1260f8?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Crystal Clear Pro",
      category: "Cleaning",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Modern cleaning service website with organic design, interactive hotspots, and intelligent booking system.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-cyan-800 dark:text-cyan-200">Interactive Hotspots</h4>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Smart Booking</h4>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-teal-800 dark:text-teal-200">Service Showcase</h4>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Organic Navigation</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/professional-cleaners" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Pawfect Care",
      category: "Pet Care",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Full-service pet care website with organic navigation, interactive hotspots, and comprehensive booking system.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200">Pet Grooming</h4>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Veterinary Care</h4>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Pet Sitting</h4>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Training Programs</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/pet-care" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Caldwell Medicine",
      category: "Healthcare",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Modern physician practice website with floating navigation orbs, interactive medical services showcase, and intelligent appointment booking.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-teal-800 dark:text-teal-200">Family Medicine</h4>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Chronic Disease Management</h4>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Preventive Care</h4>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Telemedicine</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/physician" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Little Explorers",
      category: "Child Care",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Interactive child care website with age-based hotspots, parental dashboard preview, and comprehensive program information.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-sky-50 dark:bg-sky-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-sky-800 dark:text-sky-200">Age-Appropriate Programs</h4>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Interactive Hotspots</h4>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-pink-800 dark:text-pink-200">Parental Dashboard</h4>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Licensed Facility</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/child-care" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1718166166019-85ac4df18717?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Bloom & Grow",
      category: "Garden Supply",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Organic garden supplies website with fullscreen backgrounds, floating navigation, and seasonal planning tools.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Organic Products</h4>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Seasonal Guide</h4>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200">Expert Tools</h4>
            </div>
            <div className="bg-lime-50 dark:bg-lime-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-lime-800 dark:text-lime-200">Premium Plants</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/garden-supplier" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=1722&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Radiant Roots Dental",
      category: "Healthcare",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Modern dental practice with floating navigation orbs, AI-powered chatbot, HIPAA-compliant voice booking, and comprehensive patient care.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-cyan-800 dark:text-cyan-200">AI Chat Assistant</h4>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Voice Booking</h4>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-200">Emergency Care</h4>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Family Dentistry</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/dentist" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Aureum Properties",
      category: "Real Estate",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Award-winning property developer creating architectural masterpieces with floating navigation, interactive property showcases, and premium consultation booking.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Luxury Portfolio</h4>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200">Interactive Hotspots</h4>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200">Premium Consultation</h4>
            </div>
            <div className="bg-stone-50 dark:bg-stone-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-stone-800 dark:text-stone-200">Organic Navigation</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/property-developer" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1693578538512-fc66f318c833?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Serenity Springs Spa",
      category: "Wellness",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Immerse yourself in retro luxury with our 70s-inspired sanctuary featuring organic treatments, vintage aesthetics, and personalized wellness journeys.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200">Therapeutic Massage</h4>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-rose-800 dark:text-rose-200">Luxury Facials</h4>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Ayurvedic Treatments</h4>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-pink-800 dark:text-pink-200">Couples Packages</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/retro-70s-spa" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1744095407400-aa337918bbb1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Retro Glamour Studio",
      category: "Beauty",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Transform your look with vintage elegance and modern artistry at our beautifully curated salon featuring expert stylists and premium beauty services.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-rose-800 dark:text-rose-200">Expert Haircuts</h4>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Vibrant Colors</h4>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-pink-800 dark:text-pink-200">Bridal Styling</h4>
            </div>
            <div className="bg-violet-50 dark:bg-violet-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-violet-800 dark:text-violet-200">Hair Treatments</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/retro-70s-salon" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop",
      title: "Horizon Explorers",
      category: "Travel",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Immerse yourself in luxury travel experiences with interactive destination hotspots, floating compass navigation, and personalized journey planning.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-cyan-800 dark:text-cyan-200">Interactive Hotspots</h4>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Destination Planning</h4>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Luxury Experiences</h4>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-teal-800 dark:text-teal-200">Custom Itineraries</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/travel-agency" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      title: "Summit Financial Partners",
      category: "Finance",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Professional accounting firm website with floating service hotspots, interactive overlays, and comprehensive financial solutions for modern businesses.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Interactive Hotspots</h4>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Service Overlays</h4>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Industry Expertise</h4>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-indigo-800 dark:text-indigo-200">Professional Design</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="/demo/accounting-firm" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    },
    {
      src: "/images/testimonials/generated-image (14).png",
      title: "Smartglass Demo",
      category: "Technology",
      link: "http://localhost:3000/demo/smartglass-demo",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-300">
            Next-generation smart glass with adaptive technology, intelligent sensors, and seamless device integration.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 dark:bg-slate-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Adaptive Technology</h4>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Smart Sensors</h4>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Device Integration</h4>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-900/20 p-3 rounded-lg">
              <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">AI Features</h4>
            </div>
          </div>
          <Button asChild className="w-full">
            <a href="http://localhost:3000/demo/smartglass-demo" target="_blank" rel="noopener noreferrer">
              View Demo
            </a>
          </Button>
        </div>
      )
    }
  ];

  const cards = demoShowcases.map((demo, index) => (
    <AppleCard key={index} card={demo} index={index} />
  ));

  return (
    <div className="w-full">
      <Carousel items={cards} />
    </div>
  );
};

// Enhanced Demos Section Component
const DemosSection = () => {
  return (
    <section id="demos" className="min-h-screen md:min-h-screen flex items-center justify-center relative py-16 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-cyan-900/20" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
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

          {/* Demo Grid - Complete Showcase */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {[
              { name: "Fitness AI", url: "/demo/gym", color: "bg-green-500", icon: "💪" },
              { name: "Yoga Studio", url: "/demo/yoga-studio", color: "bg-blue-500", icon: "🧘‍♀️" },
              { name: "Event Manager", url: "/demo/event-manager", color: "bg-gradient-to-br from-purple-500 to-pink-500", icon: "🎉" },
              { name: "Pet Care", url: "/demo/pet-care", color: "bg-gradient-to-br from-orange-400 to-teal-500", icon: "🐕" },
              { name: "Healthcare AI", url: "/demo/physician", color: "bg-gradient-to-br from-teal-500 to-cyan-500", icon: "👩‍⚕️" },
              { name: "Child Care", url: "/demo/child-care", color: "bg-gradient-to-br from-sky-400 to-yellow-400", icon: "👶" },
              { name: "Dental AI", url: "/demo/dentist", color: "bg-gradient-to-br from-cyan-400 to-blue-500", icon: "🦷" },
              { name: "Serenity Spa", url: "/demo/retro-70s-spa", color: "bg-gradient-to-br from-orange-400 to-amber-500", icon: "🏞️" },
              { name: "Retro Glamour Studio", url: "/demo/retro-70s-salon", color: "bg-gradient-to-br from-rose-400 to-pink-500", icon: "💇‍♀️" },
              { name: "Bloom & Grow", url: "/demo/garden-supplier", color: "bg-gradient-to-br from-green-500 to-green-600", icon: "🌱" },
              { name: "Crystal Clear Pro", url: "/demo/professional-cleaners", color: "bg-gradient-to-br from-cyan-400 to-blue-500", icon: "🧽" },
              { name: "Property Developer", url: "/demo/property-developer", color: "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg", icon: "🏠" },
              { name: "Travel Agency", url: "/demo/travel-agency", color: "bg-gradient-to-br from-cyan-400 to-blue-500", icon: "✈️" },
              { name: "Accounting Firm", url: "/demo/accounting-firm", color: "bg-gradient-to-br from-blue-600 to-emerald-600", icon: "💼" },
              { name: "Smartglass Demo", url: "/demo/smartglass-demo", color: "bg-gradient-to-br from-slate-500 to-gray-600", icon: "🥽" }
            ].map((demo, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="group cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${demo.color} flex items-center justify-center text-white font-bold text-lg`}>
                        {demo.icon || demo.name.split(' ')[0][0]}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-primary transition-colors">
                        {demo.name}
                      </h4>
                      <Button size="sm" variant="outline" className={`w-full text-xs ${demo.name === 'Property Developer' ? 'border-yellow-400 text-yellow-600 hover:bg-yellow-50' : ''}`} asChild>
                        <a href={demo.url} target="_blank" rel="noopener noreferrer">
                          View Demo
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
    <section id="contact" className="min-h-screen md:min-h-screen flex items-center justify-center relative py-16 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 dark:from-black dark:via-gray-900 dark:to-black" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
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
                <Rocket className="w-5 h-5 mr-2" />
                Ready to Win with AI?
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
                <Play className="w-5 h-5 mr-2" />
                Schedule Free Demo
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

  const { currentSection, goToNext, goToPrevious } = useSectionNavigation(9); // 9 sections total

  // Section navigation functions
  const scrollToNextSection = () => {
    const sections = ['hero', 'about', 'services', 'deliverables', 'how-it-works', 'methodology', 'demos', 'contact'];
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
    const sections = ['hero', 'about', 'services', 'deliverables', 'how-it-works', 'methodology', 'demos', 'contact'];
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
    const sections = ['hero', 'about', 'services', 'deliverables', 'how-it-works', 'methodology', 'demos', 'contact'];
    const nextIndex = (currentSection + 1) % sections.length;
    const nextSection = document.getElementById(sections[nextIndex]);
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToPreviousSection = () => {
    goToPrevious();
    const sections = ['hero', 'about', 'services', 'deliverables', 'how-it-works', 'methodology', 'demos', 'contact'];
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
      <WhatWeDeliverSection />
      <HowItWorksSection />
      <AgileMethodologySection />
      <TeamSection teamMembers={teamMembers} />
      <DemosSection />
      <ContactSection />
    </div>
  );
}