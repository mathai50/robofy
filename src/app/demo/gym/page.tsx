'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Montserrat } from 'next/font/google';
import Image from 'next/image';
import { ImmersiveCarousel } from './components/ImmersiveCarousel';
import { TrainerShowcase } from './components/TrainerShowcase';
import { MembershipPortal } from './components/MembershipPortal';
import { CommunityWall } from './components/CommunityWall';
import { RobofyCTA, FloatingCTAButton } from '@/components/ui/RobofyCTA';

// Load fonts locally for this page
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair'
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat'
});

// Gym Color Palette
const gymColors = {
  energy: '#ff6b35',     // Electric orange for CTAs
  power: '#1e40af',      // Deep blue for trust
  vitality: '#059669',   // Success green for achievements
  neutral: '#1f2937',    // Dark gray for text
  light: '#f8fafc'       // Light backgrounds
};

// Business info for this demo
const gym = {
  name: 'Play Fair Gym',
  tagline: 'AI-Powered Fitness Revolution',
  subtitle: 'Where Technology Meets Fitness Excellence',
  phone: '(555) 123-4567',
  email: 'hello@playfairgym.com',
  address: '123 Fitness Avenue, City, State 12345',
  hours: 'Mon-Fri: 5AM-11PM, Sat-Sun: 6AM-10PM',
  description: 'AI-Powered Fitness Training & Revolutionary Workout Programs',
};

// Hotspot data for hero section
const heroHotspots = [
  {
    id: 'programs',
    title: 'Training Programs',
    description: 'Discover our revolutionary workout programs',
    position: { x: 25, y: 35 },
    icon: '💪',
    color: gymColors.energy
  },
  {
    id: 'trainers',
    title: 'Expert Trainers',
    description: 'Meet our certified fitness professionals',
    position: { x: 75, y: 25 },
    icon: '👨‍💼',
    color: gymColors.power
  },
  {
    id: 'membership',
    title: 'Membership Plans',
    description: 'Find the perfect membership for your goals',
    position: { x: 60, y: 70 },
    icon: '⭐',
    color: gymColors.vitality
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Join our supportive fitness community',
    position: { x: 15, y: 80 },
    icon: '🤝',
    color: gymColors.light
  },
  {
    id: 'location',
    title: 'Find Us',
    description: 'Visit our state-of-the-art facility',
    position: { x: 85, y: 15 },
    icon: '📍',
    color: gymColors.power
  },
  {
    id: 'contact',
    title: 'Contact Us',
    description: 'Get in touch with our team',
    position: { x: 85, y: 85 },
    icon: '📞',
    color: gymColors.energy
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

// Floating action buttons
const FloatingActionButton = ({ icon, label, onClick, position }: {
  icon: string;
  label: string;
  onClick: () => void;
  position: { x: number; y: number };
}) => (
  <motion.button
    className="fixed z-40 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300"
    style={{ left: `${position.x}%`, top: `${position.y}%` }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1, duration: 0.3 }}
  >
    <span className="text-2xl">{icon}</span>
    <span className="sr-only">{label}</span>
  </motion.button>
);

// Hotspot component
const Hotspot = ({ hotspot, onClick, isVisible }: {
  hotspot: typeof heroHotspots[0];
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
      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
      style={{ backgroundColor: hotspot.color }}
    >
      <span className="text-2xl">{hotspot.icon}</span>
    </div>
    <motion.div
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      initial={{ opacity: 0, y: -10 }}
      whileHover={{ opacity: 1, y: 0 }}
    >
      {hotspot.title}
    </motion.div>
  </motion.button>
);

// Location overlay content
const LocationOverlay = ({ onClose }: { onClose: () => void }) => (
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
          Visit Our Gym
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Location</h3>
            <p className="text-gray-700">{gym.address}</p>
            <p className="text-gray-700">Phone: {gym.phone}</p>
            <p className="text-gray-700">Email: {gym.email}</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Hours</h3>
            <p className="text-gray-700">{gym.hours}</p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Contact overlay content
const ContactOverlay = ({ onClose }: { onClose: () => void }) => (
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
          Contact Us
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Get in Touch</h3>
            <p className="text-gray-700">Phone: {gym.phone}</p>
            <p className="text-gray-700">Email: {gym.email}</p>
            <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Call Now
            </button>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Quick Info</h3>
            <p className="text-gray-700">{gym.hours}</p>
            <p className="text-gray-700">{gym.address}</p>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Trainers overlay content
const TrainersOverlay = ({ onClose }: { onClose: () => void }) => (
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
          Expert Trainers
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">👨‍💼</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Martinez</h3>
          <p className="text-blue-600 mb-2">HIIT & Strength Training</p>
          <p className="text-gray-700 text-sm mb-4">8 years experience</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">
            View Profile
          </button>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg text-center">
          <div className="w-20 h-20 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">💪</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Mike Chen</h3>
          <p className="text-orange-600 mb-2">Powerlifting & Bodybuilding</p>
          <p className="text-gray-700 text-sm mb-4">12 years experience</p>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors w-full">
            View Profile
          </button>
        </div>

        <div className="bg-green-50 p-6 rounded-lg text-center">
          <div className="w-20 h-20 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🧘‍♀️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Emma Thompson</h3>
          <p className="text-green-600 mb-2">Yoga & Mobility</p>
          <p className="text-gray-700 text-sm mb-4">10 years experience</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full">
            View Profile
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Membership overlay content
const MembershipOverlay = ({ onClose }: { onClose: () => void }) => (
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
          Membership Plans
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
          <p className="text-3xl font-bold text-blue-600 mb-2">$29<span className="text-sm">/month</span></p>
          <ul className="text-gray-700 text-sm space-y-2 mb-4">
            <li>• Unlimited gym access</li>
            <li>• Basic group classes</li>
            <li>• Locker room access</li>
          </ul>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full">
            Choose Basic
          </button>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-400 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs">Most Popular</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
          <p className="text-3xl font-bold text-orange-600 mb-2">$79<span className="text-sm">/month</span></p>
          <ul className="text-gray-700 text-sm space-y-2 mb-4">
            <li>• All group classes</li>
            <li>• 2 PT sessions/month</li>
            <li>• Sauna & spa access</li>
          </ul>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors w-full">
            Choose Premium
          </button>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Elite</h3>
          <p className="text-3xl font-bold text-purple-600 mb-2">$129<span className="text-sm">/month</span></p>
          <ul className="text-gray-700 text-sm space-y-2 mb-4">
            <li>• Unlimited personal training</li>
            <li>• Private coaching</li>
            <li>• Exclusive elite classes</li>
          </ul>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full">
            Choose Elite
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Community overlay content
const CommunityOverlay = ({ onClose }: { onClose: () => void }) => (
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
          Join Our Community
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">🤝 Community Support</h3>
            <p className="text-gray-700 mb-4">Connect with fellow fitness enthusiasts</p>
            <ul className="text-gray-700 text-sm space-y-2">
              <li>• Share workout achievements</li>
              <li>• Get motivation from others</li>
              <li>• Join fitness challenges</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">📱 Social Features</h3>
            <p className="text-gray-700 mb-4">Stay connected with our fitness community</p>
            <ul className="text-gray-700 text-sm space-y-2">
              <li>• Live workout feeds</li>
              <li>• Progress tracking</li>
              <li>• Achievement badges</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            Join Community
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Programs overlay content
const ProgramsOverlay = ({ onClose }: { onClose: () => void }) => (
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
          Training Programs
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">HIIT Revolution</h3>
            <p className="text-gray-700 mb-4">High-intensity interval training for maximum fat burn</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">45 min sessions</span>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Strength Training</h3>
            <p className="text-gray-700 mb-4">Build muscle and increase strength with progressive overload</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">60 min sessions</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Yoga & Flexibility</h3>
            <p className="text-gray-700 mb-4">Improve flexibility, balance, and mental clarity</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">75 min sessions</span>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Personal Training</h3>
            <p className="text-gray-700 mb-4">One-on-one sessions tailored to your goals</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">60 min sessions</span>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Main component
export default function GymLandingPage() {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [hotspotsVisible, setHotspotsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // JSON-LD Schema for SEO
  const generateGymSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "FitnessBusiness",
      "name": "Play Fair Gym",
      "description": "AI-Powered Fitness Training & Revolutionary Workout Programs",
      "telephone": "(555) 123-4567",
      "email": "hello@playfairgym.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Fitness Avenue",
        "addressLocality": "City",
        "addressRegion": "State",
        "postalCode": "12345"
      },
      "openingHours": "Mo-Fr 05:00-23:00, Sa-Su 06:00-22:00",
      "amenityFeature": [
        "Personal Training",
        "Group Classes",
        "Modern Equipment",
        "Locker Rooms",
        "Sauna",
        "AI-Powered Marketing",
        "Automated Member Management"
      ],
      "serviceOffered": [
        "AI Lead Generation",
        "Member Retention Automation",
        "Smart Analytics Dashboard",
        "Personalized Marketing Campaigns"
      ]
    };
  };

  const schema = generateGymSchema();

  return (
    <div className={`${playfair.variable} ${montserrat.variable}`} style={{
      '--gym-energy': gymColors.energy,
      '--gym-power': gymColors.power,
      '--gym-vitality': gymColors.vitality,
      '--gym-neutral': gymColors.neutral,
      '--gym-light': gymColors.light
    } as React.CSSProperties}>
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Floating Action Buttons - Removed duplicates since they're now hotspots */}

      {/* Fullscreen Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1641337221253-fdc7237f6b61?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Modern gym interior with state-of-the-art equipment"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Interactive Hotspots */}
        {heroHotspots.map((hotspot) => (
          <Hotspot
            key={hotspot.id}
            hotspot={hotspot}
            onClick={() => handleHotspotClick(hotspot.id)}
            isVisible={hotspotsVisible}
          />
        ))}

        {/* Main Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
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
              Play Fair
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl lg:text-3xl mb-8 font-light opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              AI-Powered Fitness Revolution
            </motion.p>

            <motion.p
              className="text-lg md:text-xl mb-12 opacity-80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Where Technology Meets Fitness Excellence - Experience the future of gym management and member engagement.
            </motion.p>

            <motion.button
              className="bg-[var(--gym-energy)] hover:bg-[var(--gym-energy)]/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => handleHotspotClick('membership')}
            >
              Start Your Journey
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
            <span className="text-sm">Explore</span>
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

      {/* Overlay Modals */}
      <AnimatePresence>
        {activeOverlay === 'programs' && (
          <ProgramsOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'trainers' && (
          <TrainersOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'membership' && (
          <MembershipOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'community' && (
          <CommunityOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'location' && (
          <LocationOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'contact' && (
          <ContactOverlay onClose={handleOverlayClose} />
        )}
      </AnimatePresence>

      {/* Robofy CTA Components */}
      <FloatingCTAButton
        onClick={() => setShowRobofyCTA(true)}
        primaryColor={gymColors.energy}
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Gym"
        primaryColor={gymColors.energy}
        secondaryColor={gymColors.power}
      />

      {/* Programs Discovery Section */}
      <ImmersiveCarousel />

      {/* Trainer Showcase Section */}
      <div className="relative">
        <TrainerShowcase />
      </div>

      {/* Membership Portal Section */}
      <div className="relative">
        <MembershipPortal />
      </div>

      {/* Community Wall Section */}
      <div className="relative bg-gray-900">
        <CommunityWall />
      </div>

      {/* Robofy Transformation Section for Gym Owners */}
      <div className="pt-0">
        <section className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-gray-900 to-blue-900/20" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="pt-[30px]"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold mb-6"
              >
                Transform Your Gym Business
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto mb-12"
              >
                Join hundreds of gym owners who've revolutionized their business with Robofy's AI-powered marketing automation
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="w-16 h-16 bg-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">AI Lead Generation</h3>
                  <p className="text-white/80">Automatically attract and convert more gym members with intelligent marketing campaigns</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Smart Analytics</h3>
                  <p className="text-white/80">Track member engagement, predict churn, and optimize your business performance</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Revenue Growth</h3>
                  <p className="text-white/80">Increase membership sales and retention with personalized automation</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Gym Business?</h3>
                  <p className="text-white/80 mb-6">Get a free AI marketing audit and see how Robofy can help you attract more members</p>

                  {/* Lead Generation Form */}
                  <form className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your Gym Name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                      <input
                        type="email"
                        placeholder="Business Email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <textarea
                      placeholder="Tell us about your gym and current challenges..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    />
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        type="submit"
                        className="bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full hover:bg-orange-700 transition-colors"
                      >
                        Get Free AI Audit
                      </button>
                      <button
                        type="button"
                        className="border-2 border-white/50 text-white px-8 py-4 text-lg font-semibold rounded-full hover:bg-white/10 transition-colors"
                      >
                        Schedule Demo Call
                      </button>
                    </div>
                  </form>
                </div>

                <p className="text-white/60 text-sm">
                  ✅ No setup costs • ✅ Cancel anytime • ✅ 30-day money-back guarantee
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}