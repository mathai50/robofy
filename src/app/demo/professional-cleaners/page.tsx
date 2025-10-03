'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Inter } from 'next/font/google';
import Image from 'next/image';
import { RobofyCTA, FloatingCTAButton } from '@/components/ui/RobofyCTA';

// Load fonts locally for this page
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair'
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter'
});

// Professional Cleaning Color Palette
const cleanColors = {
  trust: '#007BFF',      // Professional blue for trust
  fresh: '#00CFC1',      // Fresh aqua for cleanliness
  pure: '#FFFFFF',       // Pure white for simplicity
  soft: '#F8FAFC',       // Soft gray for backgrounds
  deep: '#1E293B'        // Deep slate for text
};

// Business info for this demo
const cleanService = {
  name: 'Crystal Clear Pro',
  tagline: 'Professional Cleaning Excellence',
  subtitle: 'Where Cleanliness Meets Perfection',
  phone: '(555) 123-CLEAN',
  email: 'hello@crystalclearpro.com',
  address: '456 Sparkle Avenue, Clean City, State 12345',
  hours: 'Mon-Sun: 6AM-10PM',
  description: 'Professional Cleaning Services with AI-Powered Quality Assurance'
};

// Interactive hotspots for hero section - organized and balanced
const heroHotspots = [
  {
    id: 'services',
    title: 'Services',
    description: 'Explore our cleaning solutions',
    position: { x: 15, y: 35 },
    icon: '✨',
    color: cleanColors.fresh,
    pulseDelay: 0
  },
  {
    id: 'booking',
    title: 'Book Now',
    description: 'Schedule your service',
    position: { x: 85, y: 35 },
    icon: '📅',
    color: cleanColors.trust,
    pulseDelay: 0.7
  },
  {
    id: 'about',
    title: 'About',
    description: 'Learn our story',
    position: { x: 15, y: 65 },
    icon: '🏆',
    color: cleanColors.fresh,
    pulseDelay: 1.4
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Get in touch',
    position: { x: 85, y: 65 },
    icon: '💬',
    color: cleanColors.trust,
    pulseDelay: 2.1
  }
];

// Floating particle animation component
const FloatingParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.4 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        // Boundary check with bounce
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Draw particle as rotating sparkle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = particle.opacity;

        // Draw sparkle shape
        ctx.beginPath();
        ctx.moveTo(0, -particle.size);
        ctx.lineTo(particle.size * 0.3, -particle.size * 0.3);
        ctx.lineTo(particle.size, 0);
        ctx.lineTo(particle.size * 0.3, particle.size * 0.3);
        ctx.lineTo(0, particle.size);
        ctx.lineTo(-particle.size * 0.3, particle.size * 0.3);
        ctx.lineTo(-particle.size, 0);
        ctx.lineTo(-particle.size * 0.3, -particle.size * 0.3);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(-particle.size, -particle.size, particle.size, particle.size);
        gradient.addColorStop(0, cleanColors.fresh + '40');
        gradient.addColorStop(0.5, cleanColors.trust + '60');
        gradient.addColorStop(1, cleanColors.pure + '30');

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();

        // Connect nearby particles
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(0, 207, 193, ${0.1 * (1 - distance / 80)})`;
            ctx.lineWidth = 0.5;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

// Interactive hotspot component - cleaner and more organized
const InteractiveHotspot = ({ hotspot, onClick, delay = 0 }: {
  hotspot: typeof heroHotspots[0];
  onClick: () => void;
  delay?: number;
}) => (
  <motion.button
    className="absolute z-30 group"
    style={{
      left: `${hotspot.position.x}%`,
      top: `${hotspot.position.y}%`,
      transform: 'translate(-50%, -50%)'
    }}
    initial={{ scale: 0, opacity: 0, y: 20 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{
      delay: delay,
      duration: 0.5,
      ease: "easeOut"
    }}
    whileHover={{
      scale: 1.15,
      transition: { duration: 0.2 }
    }}
    whileTap={{ scale: 0.85 }}
    onClick={onClick}
  >
    <div
      className="relative w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-xl backdrop-blur-sm border border-white/20"
      style={{
        background: `linear-gradient(135deg, ${hotspot.color}F0, ${hotspot.color}D0)`,
        boxShadow: `0 4px 20px ${hotspot.color}30`
      }}
    >
      <motion.span
        className="text-2xl"
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        }}
      >
        {hotspot.icon}
      </motion.span>

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${hotspot.color}20, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.1, 0.3]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        }}
      />
    </div>

    {/* Simplified tooltip */}
    <motion.div
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none backdrop-blur-sm"
      initial={{ opacity: 0, y: -5 }}
      whileHover={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="font-medium">{hotspot.title}</div>
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-black/90 rotate-45" />
    </motion.div>
  </motion.button>
);

// Main hero section component
const HeroSection = ({ onHotspotClick }: { onHotspotClick: (id: string) => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Multi-layered background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1724026822916-3da5df1260f8?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Professional cleaning service with sparkling clean modern interior"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,207,193,0.08),transparent_60%)]" />
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Interactive hotspots - positioned to avoid main content */}
      {heroHotspots.map((hotspot, index) => (
        <InteractiveHotspot
          key={hotspot.id}
          hotspot={hotspot}
          onClick={() => onHotspotClick(hotspot.id)}
          delay={index * 0.3 + 1.5}
        />
      ))}

      {/* Main content - positioned to avoid hotspots */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto" style={{ marginTop: '-10vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-8 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse shadow-sm" />
            <span className="text-white font-medium text-sm">Professional Cleaning Services</span>
          </motion.div>

          <motion.h1
            className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-tight text-white drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Crystal Clear
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-8 font-light drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Professional Cleaning Excellence
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-white/85 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Experience the pinnacle of cleanliness with our AI-powered cleaning solutions that deliver exceptional results every time.
          </motion.p>

          <motion.button
            className="bg-white/95 backdrop-blur-sm text-gray-900 px-10 py-5 text-xl font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white/30 hover:bg-white"
            whileHover={{
              scale: 1.05,
              boxShadow: `0 20px 40px rgba(255,255,255,0.3)`
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            onClick={() => onHotspotClick('booking')}
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              Book Your Clean
              <span className="text-2xl">✨</span>
            </span>
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
          <span className="text-sm font-light">Discover Our Services</span>
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
  );
};

// Services showcase section component
const ServicesShowcase = () => {
  const services = [
    {
      icon: '🏠',
      title: 'Residential',
      subtitle: 'Home Cleaning',
      description: 'Transform your living space into a pristine sanctuary',
      features: ['Deep Cleaning', 'Regular Maintenance', 'Move Services', 'Organization'],
      color: 'from-blue-400 to-cyan-400',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    {
      icon: '🏢',
      title: 'Commercial',
      subtitle: 'Office Cleaning',
      description: 'Create productive, healthy work environments',
      features: ['Office Buildings', 'Retail Spaces', 'Medical Centers', 'Warehouses'],
      color: 'from-emerald-400 to-teal-400',
      bgPattern: 'bg-gradient-to-br from-emerald-50 to-teal-50'
    },
    {
      icon: '✨',
      title: 'Specialized',
      subtitle: 'Expert Services',
      description: 'Advanced cleaning for unique requirements',
      features: ['Carpet Deep Clean', 'Window Restoration', 'Upholstery', 'Sanitization'],
      color: 'from-violet-400 to-purple-400',
      bgPattern: 'bg-gradient-to-br from-violet-50 to-purple-50'
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/50" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-2xl mr-2">✨</span>
              <span className="font-medium text-gray-700">Our Services</span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)]">
              Comprehensive Cleaning Solutions
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From residential homes to commercial spaces, we deliver exceptional cleaning services tailored to your needs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className={`${service.bgPattern} rounded-3xl p-8 border border-white/50 shadow-lg backdrop-blur-sm`}
                initial={{ opacity: 0, y: 40, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {service.icon}
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {service.title}
                </h3>

                <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                  {service.subtitle}
                </h4>

                <p className="text-gray-600 mb-6 text-center leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index * 0.2) + (featureIndex * 0.1) }}
                    >
                      <div className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full`} />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  className={`w-full mt-8 bg-gradient-to-r ${service.color} text-white py-4 px-6 rounded-2xl font-semibold shadow-lg`}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: `0 20px 40px ${service.color.replace('400', '500').replace('from-', '').replace('to-', '')}40`
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Booking overlay component
const BookingOverlay = ({ onClose }: { onClose: () => void }) => {
  const [selectedService, setSelectedService] = useState('');
  const [step, setStep] = useState(1);

  const services = [
    'Residential Cleaning',
    'Commercial Cleaning',
    'Deep Cleaning',
    'Move-in/Move-out',
    'Post-construction',
    'Carpet Cleaning',
    'Window Cleaning'
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 100 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
            Book Your Cleaning
          </h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  stepNumber <= step ? 'bg-[var(--fresh)] text-white' : 'bg-gray-200 text-gray-500'
                }`}
                animate={{ scale: stepNumber === step ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                {stepNumber}
              </motion.div>
              {stepNumber < 3 && (
                <motion.div
                  className={`flex-1 h-1 mx-4 rounded ${
                    stepNumber < step ? 'bg-[var(--fresh)]' : 'bg-gray-200'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: stepNumber < step ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900">Choose Your Service</h3>
            <div className="grid gap-4">
              {services.map((service, index) => (
                <motion.button
                  key={service}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedService === service
                      ? 'border-[var(--fresh)] bg-cyan-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedService(service)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="font-semibold text-gray-900">{service}</div>
                </motion.button>
              ))}
            </div>
            <motion.button
              className="w-full bg-gradient-to-r from-[var(--fresh)] to-[var(--trust)] text-white py-4 rounded-xl font-semibold"
              disabled={!selectedService}
              onClick={() => setStep(2)}
              whileHover={{ scale: selectedService ? 1.02 : 1 }}
              whileTap={{ scale: selectedService ? 0.98 : 1 }}
            >
              Continue
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900">Contact Information</h3>
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--fresh)] focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--fresh)] focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--fresh)] focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <motion.button
                className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold"
                onClick={() => setStep(1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
              <motion.button
                className="flex-1 bg-gradient-to-r from-[var(--fresh)] to-[var(--trust)] text-white py-4 rounded-xl font-semibold"
                onClick={() => setStep(3)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center space-y-6"
          >
            <motion.div
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
            >
              ✨
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h3>
            <p className="text-gray-600">We'll contact you shortly to finalize the details.</p>
            <motion.button
              className="bg-gradient-to-r from-[var(--fresh)] to-[var(--trust)] text-white py-4 px-8 rounded-xl font-semibold"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Done
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Testimonials section component
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Homeowner',
      content: 'Crystal Clear Pro transformed our home. The attention to detail is incredible!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'Business Owner',
      content: 'Our office has never looked better. Professional service and amazing results.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Real Estate Agent',
      content: 'They make my properties shine! Essential partner for my business.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50/30 to-pink-50/50" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-2xl mr-2">⭐</span>
              <span className="font-medium text-gray-700">Client Reviews</span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)]">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50"
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="flex items-center mb-6">
                  <motion.img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="text-yellow-400 text-xl"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (index * 0.2) + (i * 0.1) }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Services overlay component
const ServicesOverlay = ({ onClose }: { onClose: () => void }) => {
  const services = [
    {
      icon: '🏠',
      title: 'Residential Cleaning',
      description: 'Complete home cleaning services',
      features: ['Deep Cleaning', 'Regular Maintenance', 'Move-in/Move-out', 'Post-construction']
    },
    {
      icon: '🏢',
      title: 'Commercial Cleaning',
      description: 'Professional office and business cleaning',
      features: ['Office Buildings', 'Retail Spaces', 'Medical Facilities', 'Industrial Sites']
    },
    {
      icon: '🧽',
      title: 'Specialized Services',
      description: 'Expert cleaning for unique needs',
      features: ['Carpet Cleaning', 'Window Washing', 'Upholstery', 'Sanitization']
    }
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 100 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
            Our Services
          </h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    className="flex items-center gap-2 text-sm text-gray-500"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                  >
                    <div className="w-1.5 h-1.5 bg-[var(--fresh)] rounded-full" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Testimonials overlay component
const TestimonialsOverlay = ({ onClose }: { onClose: () => void }) => {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Homeowner',
      content: 'Crystal Clear Pro transformed our home. The attention to detail is incredible!',
      rating: 5,
      service: 'Deep Cleaning'
    },
    {
      name: 'Michael Chen',
      role: 'Business Owner',
      content: 'Our office has never looked better. Professional service and amazing results.',
      rating: 5,
      service: 'Commercial Cleaning'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Real Estate Agent',
      content: 'They make my properties shine! Essential partner for my business.',
      rating: 5,
      service: 'Move-out Cleaning'
    }
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 100 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
            Client Testimonials
          </h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
              <div className="border-t pt-4">
                <div className="font-bold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
                <div className="text-xs text-[var(--fresh)] font-medium">{testimonial.service}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// About overlay component
const AboutOverlay = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 100 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
            About Crystal Clear Pro
          </h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </div>

        <div className="space-y-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--fresh)] to-[var(--trust)] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              🏆
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide exceptional cleaning services that exceed expectations while maintaining the highest standards of quality, reliability, and customer satisfaction.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '✨', title: 'Quality First', desc: 'Every clean meets our rigorous standards' },
              { icon: '🤝', title: 'Trusted Service', desc: 'Insured and background-checked professionals' },
              { icon: '🌱', title: 'Eco-Friendly', desc: 'Safe, sustainable cleaning products' }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
              >
                <div className="text-3xl mb-4">{value.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Contact overlay component
const ContactOverlay = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 100 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
            Contact Us
          </h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-gray-900">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--trust)] rounded-full flex items-center justify-center text-white">
                  📞
                </div>
                <div>
                  <div className="font-semibold">{cleanService.phone}</div>
                  <div className="text-sm text-gray-600">Call us anytime</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--fresh)] rounded-full flex items-center justify-center text-white">
                  ✉️
                </div>
                <div>
                  <div className="font-semibold">{cleanService.email}</div>
                  <div className="text-sm text-gray-600">Email us</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--trust)] rounded-full flex items-center justify-center text-white">
                  📍
                </div>
                <div>
                  <div className="font-semibold">{cleanService.address}</div>
                  <div className="text-sm text-gray-600">Visit our office</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-900">Business Hours</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold">6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span className="font-semibold">6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency Service</span>
                  <span className="font-semibold text-[var(--fresh)]">24/7 Available</span>
                </div>
              </div>
            </div>

            <motion.button
              className="w-full bg-gradient-to-r from-[var(--fresh)] to-[var(--trust)] text-white py-4 rounded-xl font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Schedule Emergency Service
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Quote overlay component
const QuoteOverlay = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 100 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
            Get Your Free Quote
          </h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </div>

        <div className="text-center mb-8">
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-[var(--fresh)] to-[var(--trust)] rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💎
          </motion.div>
          <p className="text-gray-600">Get a personalized quote in under 2 minutes</p>
        </div>

        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--fresh)] focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--fresh)] focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--fresh)] focus:border-transparent"
            />
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--fresh)] focus:border-transparent">
              <option>Select Service Type</option>
              <option>Residential Cleaning</option>
              <option>Commercial Cleaning</option>
              <option>Deep Cleaning</option>
              <option>Move-in/Move-out</option>
            </select>
          </div>

          <textarea
            placeholder="Property details (size, bedrooms, bathrooms, special requirements...)"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--fresh)] focus:border-transparent resize-none"
          />

          <motion.button
            className="w-full bg-gradient-to-r from-[var(--fresh)] to-[var(--trust)] text-white py-4 rounded-xl font-semibold text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get My Free Quote ✨
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// FAQ Section component
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How far in advance should I book my cleaning service?',
      answer: 'We recommend booking at least 24-48 hours in advance for regular services. For deep cleaning or move-in/move-out services, we suggest booking 3-5 days ahead to ensure availability.'
    },
    {
      question: 'Are your cleaning products safe for pets and children?',
      answer: 'Absolutely! We use eco-friendly, non-toxic cleaning products that are safe for pets and children. All our products are biodegradable and meet the highest safety standards.'
    },
    {
      question: 'Do you provide all cleaning supplies and equipment?',
      answer: 'Yes, we come fully equipped with professional-grade cleaning supplies and equipment. You don\'t need to provide anything unless you have specific product preferences.'
    },
    {
      question: 'What if I need to cancel or reschedule my appointment?',
      answer: 'We understand that plans can change. You can cancel or reschedule up to 24 hours before your appointment without any fees. Cancellations within 24 hours may incur a small fee.'
    },
    {
      question: 'Are your cleaners insured and background-checked?',
      answer: 'Yes, all our cleaning professionals are fully insured, bonded, and have passed comprehensive background checks. Your peace of mind and security are our top priorities.'
    },
    {
      question: 'Do you offer satisfaction guarantee?',
      answer: 'Absolutely! If you\'re not completely satisfied with our service, we\'ll return within 24 hours to address any concerns at no additional cost.'
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/50" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-2xl mr-2">❓</span>
              <span className="font-medium text-gray-700">Frequently Asked Questions</span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)]">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl text-[var(--fresh)] flex-shrink-0"
                  >
                    +
                  </motion.div>
                </motion.button>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Section component
const FooterSection = () => {
  return (
    <footer className="relative bg-gray-900 text-white py-16">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/50 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,207,193,0.1),transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
                Crystal Clear Pro
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Professional cleaning services that deliver exceptional results with attention to detail and customer satisfaction.
              </p>
              <div className="flex gap-4">
                <motion.div
                  className="w-12 h-12 bg-[var(--fresh)] rounded-full flex items-center justify-center text-white cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  📘
                </motion.div>
                <motion.div
                  className="w-12 h-12 bg-[var(--trust)] rounded-full flex items-center justify-center text-white cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  📷
                </motion.div>
                <motion.div
                  className="w-12 h-12 bg-[var(--fresh)] rounded-full flex items-center justify-center text-white cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  💼
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-bold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:text-white transition-colors cursor-pointer">Residential Cleaning</li>
                <li className="hover:text-white transition-colors cursor-pointer">Commercial Cleaning</li>
                <li className="hover:text-white transition-colors cursor-pointer">Deep Cleaning</li>
                <li className="hover:text-white transition-colors cursor-pointer">Move Services</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <div>{cleanService.phone}</div>
                <div>{cleanService.email}</div>
                <div>{cleanService.address}</div>
                <div className="text-sm">{cleanService.hours}</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="border-t border-gray-700 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-400">
              © 2024 Crystal Clear Pro. All rights reserved. | Powered by Robofy AI
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

// Main component
export default function ProfessionalCleanersPage() {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [showRobofyCTA, setShowRobofyCTA] = useState(false);

  const handleHotspotClick = (hotspotId: string) => {
    setActiveOverlay(hotspotId);
  };

  const handleOverlayClose = () => {
    setActiveOverlay(null);
  };

  return (
    <div className={`${playfair.variable} ${inter.variable}`} style={{
      '--trust': cleanColors.trust,
      '--fresh': cleanColors.fresh,
      '--pure': cleanColors.pure,
      '--soft': cleanColors.soft,
      '--deep': cleanColors.deep
    } as React.CSSProperties}>
      {/* Hero Section */}
      <HeroSection onHotspotClick={handleHotspotClick} />

      {/* Services Showcase Section */}
      <ServicesShowcase />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer Section */}
      <FooterSection />

      {/* Overlay Modals */}
      <AnimatePresence>
        {activeOverlay === 'services' && (
          <ServicesOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'booking' && (
          <BookingOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'testimonials' && (
          <TestimonialsOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'about' && (
          <AboutOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'contact' && (
          <ContactOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'quote' && (
          <QuoteOverlay onClose={handleOverlayClose} />
        )}
      </AnimatePresence>

      {/* Robofy CTA Components */}
      <FloatingCTAButton
        onClick={() => setShowRobofyCTA(true)}
        primaryColor={cleanColors.fresh}
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Cleaning Business"
        primaryColor={cleanColors.fresh}
        secondaryColor={cleanColors.trust}
      />

      {/* Additional sections will be added here following organic design principles */}
    </div>
  );
}