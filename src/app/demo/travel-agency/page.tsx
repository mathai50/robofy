'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { RobofyCTA, FloatingCTAButton } from '@/components/ui/RobofyCTA';
import { Playfair_Display, Montserrat } from 'next/font/google';

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

// Travel Agency Color Palette - Vibrant Summer Holiday Vibes
const travelColors = {
  azure: '#17aaf7',      // Vivid sky/ocean blue
  coral: '#ff7954',      // Sunset coral orange for energy
  gold: '#ffe082',       // Golden sand warmth
  palm: '#2bc49d',       // Palm green for lush getaways
  white: '#ffffff',      // Bright white for clean highlights
  pink: '#ffb1c1',       // Sunset pink for tropical accents
  neutral: '#1f2937',    // Dark gray for text
  light: '#f8fafc'       // Light backgrounds
};

// Business info for this demo
const travelAgency = {
  name: 'Horizon Explorers',
  tagline: 'Where Dreams Meet Destinations',
  subtitle: 'Curated Luxury Travel Experiences Beyond Imagination',
  phone: '(555) 123-WANDER',
  email: 'journey@horizonexplorers.com',
  address: '888 Adventure Avenue, Wanderlust City, WC 12345',
  hours: 'Mon-Fri: 9AM-8PM, Sat-Sun: 10AM-6PM',
  description: 'Luxury travel experiences with personalized service and exclusive access to the world\'s most extraordinary destinations.',
};

// Interactive Destination Hotspots for Hero Section
const destinationHotspots = [
  {
    id: 'bali',
    title: 'Bali Paradise',
    description: 'Tropical beaches and spiritual retreats',
    position: { x: 20, y: 30 },
    icon: '🏝️',
    color: travelColors.azure,
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'santorini',
    title: 'Santorini Dreams',
    description: 'White-washed villages and sunset views',
    position: { x: 75, y: 25 },
    icon: '🏛️',
    color: travelColors.coral,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'safari',
    title: 'African Safari',
    description: 'Wildlife adventures and luxury lodges',
    position: { x: 60, y: 70 },
    icon: '🦁',
    color: travelColors.palm,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop'
  },
  {
    id: 'alps',
    title: 'Swiss Alps',
    description: 'Mountain retreats and alpine luxury',
    position: { x: 15, y: 80 },
    icon: '🏔️',
    color: travelColors.pink,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'tokyo',
    title: 'Tokyo Nights',
    description: 'Urban exploration and cultural immersion',
    position: { x: 85, y: 15 },
    icon: '🏮',
    color: travelColors.gold,
    image: 'https://images.unsplash.com/photo-1540959733332-8b43b76537d3?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'custom',
    title: 'Custom Journey',
    description: 'Design your perfect adventure',
    position: { x: 85, y: 85 },
    icon: '✨',
    color: travelColors.azure,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop'
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

const slideUpVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

// Floating Compass Navigation Element
const FloatingCompass = ({ onClick, position }: {
  onClick: () => void;
  position: { x: number; y: number };
}) => (
  <motion.button
    className="fixed z-40 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300"
    style={{ left: `${position.x}%`, top: `${position.y}%` }}
    whileHover={{ scale: 1.05, rotate: 15 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1, duration: 0.3 }}
  >
    <span className="text-2xl">🧭</span>
  </motion.button>
);

// Destination Hotspot Component
const DestinationHotspot = ({ hotspot, onClick, isVisible }: {
  hotspot: typeof destinationHotspots[0];
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
      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/50"
      style={{ backgroundColor: hotspot.color }}
    >
      <span className="text-2xl">{hotspot.icon}</span>
    </div>
    <motion.div
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none backdrop-blur-sm"
      initial={{ opacity: 0, y: -10 }}
      whileHover={{ opacity: 1, y: 0 }}
    >
      {hotspot.title}
    </motion.div>
  </motion.button>
);

// Destination Overlay Component
const DestinationOverlay = ({ hotspot, onClose }: {
  hotspot: typeof destinationHotspots[0];
  onClose: () => void;
}) => (
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
          {hotspot.title}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden">
          <Image
            src={hotspot.image}
            alt={hotspot.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-700 text-lg leading-relaxed">
            {hotspot.description}
          </p>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">What's Included:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Luxury accommodations with premium amenities
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Private guided tours and experiences
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Gourmet dining and local cuisine
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                24/7 concierge service
              </li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
              Book This Journey
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 px-6 py-3">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Custom Journey Overlay
const CustomJourneyOverlay = ({ onClose }: { onClose: () => void }) => (
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
          Design Your Journey
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        <p className="text-gray-700 text-lg">
          Tell us about your dream adventure and we'll create a completely personalized experience just for you.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Travel Style</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Luxury & Relaxation</option>
              <option>Adventure & Exploration</option>
              <option>Cultural Immersion</option>
              <option>Romantic Getaway</option>
              <option>Family Vacation</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination Type</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Beach & Islands</option>
              <option>Mountains & Nature</option>
              <option>Cities & Culture</option>
              <option>Wildlife & Safari</option>
              <option>Multiple Destinations</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Travel Dates</label>
            <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>3-5 days</option>
              <option>1 week</option>
              <option>2 weeks</option>
              <option>3+ weeks</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
          <textarea 
            rows={4}
            placeholder="Tell us about any specific interests, dietary requirements, or special occasions..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-4">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3">
            Submit Request
          </Button>
          <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 py-3">
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Experience Cards Component
const ExperienceCard = ({ experience, index }: {
  experience: { title: string; description: string; image: string; duration: string };
  index: number;
}) => (
  <motion.div
    variants={slideUpVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="group cursor-pointer"
  >
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-500 overflow-hidden h-full">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-blue-600/90 text-white">
            {experience.duration}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
          {experience.title}
        </h3>
        <p className="text-white/80 leading-relaxed">
          {experience.description}
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

// Main component
export default function TravelAgencyLandingPage() {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [hotspotsVisible, setHotspotsVisible] = useState(false);
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

  const selectedHotspot = destinationHotspots.find(hotspot => hotspot.id === activeOverlay);

  // Sample luxury experiences
  const luxuryExperiences = [
    {
      title: 'Private Island Retreat',
      description: 'Exclusive access to secluded islands with private villas and personalized service.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
      duration: '7-14 days'
    },
    {
      title: 'Mountain Sanctuary',
      description: 'Luxury alpine lodges with breathtaking views and outdoor adventures.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop',
      duration: '5-10 days'
    },
    {
      title: 'Cultural Immersion',
      description: 'Deep dive into local traditions with expert guides and authentic experiences.',
      image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2069&auto=format&fit=crop',
      duration: '10-21 days'
    }
  ];

  // JSON-LD Schema for SEO
  const generateTravelSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Horizon Explorers",
      "description": "Luxury travel experiences with personalized service and exclusive access to the world's most extraordinary destinations.",
      "telephone": "(555) 123-WANDER",
      "email": "journey@horizonexplorers.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "888 Adventure Avenue",
        "addressLocality": "Wanderlust City",
        "addressRegion": "WC",
        "postalCode": "12345"
      },
      "openingHours": "Mo-Fr 09:00-20:00, Sa-Su 10:00-18:00",
      "serviceOffered": [
        "Luxury Travel Planning",
        "Custom Itineraries",
        "Destination Management",
        "VIP Travel Services",
        "Adventure Tourism",
        "Cultural Experiences"
      ]
    };
  };

  const schema = generateTravelSchema();

  return (
    <div className={`${playfair.variable} ${montserrat.variable}`} style={{
      '--travel-azure': travelColors.azure,
      '--travel-coral': travelColors.coral,
      '--travel-palm': travelColors.palm,
      '--travel-gold': travelColors.gold,
      '--travel-pink': travelColors.pink,
      '--travel-neutral': travelColors.neutral,
      '--travel-light': travelColors.light
    } as React.CSSProperties}>
     {/* SEO Schema */}
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
     />

     {/* Fullscreen Hero Section */}
     <section
       ref={heroRef}
       className="relative min-h-screen flex items-center justify-center overflow-hidden"
     >
       {/* Background Video/Image */}
       <div className="absolute inset-0 z-0">
         <Image
           src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
           alt="Luxury travel destinations around the world"
           fill
           className="object-cover"
           priority
         />
         <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/20 to-coral-900/20" />
       </div>

        {/* Interactive Destination Hotspots */}
        {destinationHotspots.map((hotspot) => (
          <DestinationHotspot
            key={hotspot.id}
            hotspot={hotspot}
            onClick={() => handleHotspotClick(hotspot.id)}
            isVisible={hotspotsVisible}
          />
        ))}

        {/* Floating Compass Navigation */}
        <FloatingCompass
          onClick={() => handleHotspotClick('custom')}
          position={{ x: 50, y: 50 }}
        />

        {/* Main Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-6xl mx-auto">
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
              Horizon
              <span className="block text-blue-300">Explorers</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl lg:text-3xl mb-8 font-light opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Where Dreams Meet Destinations
            </motion.p>

            <motion.p
              className="text-lg md:text-xl mb-12 opacity-80 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Curated Luxury Travel Experiences Beyond Imagination - Discover the world through our eyes and create memories that last forever.
            </motion.p>

            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-400/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => handleHotspotClick('custom')}
            >
              Begin Your Journey
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
            <span className="text-sm">Explore Destinations</span>
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

      {/* Luxury Experiences Section */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-blue-600/20 text-blue-300 border-blue-400/30">
                ✨ Exclusive Experiences
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-playfair)]">
                Curated Luxury Journeys
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Discover our signature travel experiences, meticulously crafted for the discerning traveler seeking extraordinary adventures.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {luxuryExperiences.map((experience, index) => (
                <ExperienceCard
                  key={experience.title}
                  experience={experience}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Concierge Experience Section */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.3
                }
              }
            }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-coral-500 to-pink-500 text-white">
                🏆 Premium Service
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)]">
                Your Personal Travel Concierge
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                From tailored itineraries to last-minute reservations, our AI-powered concierge ensures your trip is seamless, stress-free, and unforgettable.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={slideUpVariants}
                className="space-y-8"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-azure-500 to-coral-500 rounded-full flex items-center justify-center text-white text-xl">
                      🤖
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 ml-4">AI-Powered Planning</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Our advanced AI analyzes your preferences, budget, and travel style to create personalized recommendations that match your unique vision.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-palm-500 to-gold-500 rounded-full flex items-center justify-center text-white text-xl">
                      👥
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 ml-4">Expert Human Touch</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Every itinerary is reviewed and refined by our team of seasoned travel experts who add local insights and exclusive connections.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-coral-500 rounded-full flex items-center justify-center text-white text-xl">
                      ⚡
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 ml-4">24/7 Support</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    From booking changes to on-ground assistance, our concierge team is available around the clock to handle any situation.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={slideUpVariants}
                className="relative"
              >
                <div className="bg-gradient-to-br from-azure-500/10 to-coral-500/10 rounded-3xl p-8 backdrop-blur-sm border border-white/50">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Experience the Difference</h3>
                    <p className="text-gray-700">See how our concierge service transforms ordinary trips into extraordinary journeys</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/60 rounded-lg">
                      <span className="text-gray-700">Standard Booking</span>
                      <span className="text-gray-500 line-through">Basic hotels & flights</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-azure-500 to-coral-500 rounded-lg text-white">
                      <span className="font-semibold">Concierge Experience</span>
                      <span className="font-bold">✨ VIP treatment & exclusive access</span>
                    </div>
                  </div>

                  <button className="w-full mt-8 bg-gradient-to-r from-azure-500 to-coral-500 hover:from-azure-600 hover:to-coral-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    Speak to Your Concierge
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curated Destinations Section */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-white via-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="max-w-7xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-palm-500 to-azure-500 text-white">
                🌟 Handpicked Experiences
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)]">
                Carefully Manicured Destinations
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Every destination in our collection has been personally vetted by our expert curators. Only the most exceptional experiences make it to your journey.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Santorini, Greece',
                  type: 'Luxe Retreat',
                  description: 'White-washed villages perched on dramatic cliffs, where azure waters meet golden sunsets in perfect harmony.',
                  image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2070&auto=format&fit=crop',
                  color: 'azure'
                },
                {
                  title: 'Tulum, Mexico',
                  type: 'Wellness',
                  description: 'Ancient Mayan ruins meet pristine beaches, where yoga sessions and cenote swims create perfect harmony.',
                  image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=2070&auto=format&fit=crop',
                  color: 'palm'
                },
                {
                  title: 'Kyoto, Japan',
                  type: 'Culture',
                  description: 'Timeless temples and traditional tea houses, where cherry blossoms frame ancient traditions in living color.',
                  image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
                  color: 'pink'
                },
                {
                  title: 'Bali, Indonesia',
                  type: 'Adventure',
                  description: 'Lush rice terraces cascade down volcanic mountains, where spiritual retreats meet thrilling surf adventures.',
                  image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop',
                  color: 'coral'
                },
                {
                  title: 'Amalfi Coast, Italy',
                  type: 'Romance',
                  description: 'Colorful villages cling to dramatic cliffs, where lemon groves scent the Mediterranean breeze.',
                  image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73fb6?q=80&w=2070&auto=format&fit=crop',
                  color: 'gold'
                },
                {
                  title: 'Fiji Islands',
                  type: 'Luxury',
                  description: 'Overwater bungalows float on crystal-clear lagoons, where private beaches meet world-class service.',
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
                  color: 'azure'
                }
              ].map((destination, index) => (
                <motion.div
                  key={destination.title}
                  variants={slideUpVariants}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={destination.image}
                      alt={destination.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className={`bg-${destination.color}-500/90 text-white`}>
                        {destination.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`w-12 h-12 bg-${destination.color}-500 rounded-full flex items-center justify-center text-white`}>
                        <span className="text-lg">✨</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-azure-600 transition-colors">
                      {destination.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {destination.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-gray-600">
                        Concierge Pick
                      </Badge>
                      <button className={`bg-${destination.color}-500 hover:bg-${destination.color}-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`}>
                        Explore
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="max-w-7xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-coral-500 to-pink-500 text-white">
                🔥 Trending Now
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-playfair)]">
                Summer 2025's Most In-Demand Locations
              </h2>
              <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                These destinations are capturing everyone's imagination this season. From seasonal events to new luxury openings, discover why the world can't stop talking about them.
              </p>
            </motion.div>

            <div className="overflow-hidden">
              <div className="flex gap-8 animate-scroll">
                {[
                  {
                    title: 'Santorini, Greece',
                    trend: 'New luxury cave hotels opening',
                    highlight: 'Wine festival season begins',
                    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2070&auto=format&fit=crop',
                    color: 'azure'
                  },
                  {
                    title: 'Tulum, Mexico',
                    trend: 'Eco-conscious luxury resorts',
                    highlight: 'Bioluminescent lagoon tours',
                    image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=2070&auto=format&fit=crop',
                    color: 'palm'
                  },
                  {
                    title: 'Kyoto, Japan',
                    trend: 'Cherry blossom season extended',
                    highlight: 'Traditional tea ceremony renaissance',
                    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
                    color: 'pink'
                  },
                  {
                    title: 'Bali, Indonesia',
                    trend: 'Spiritual wellness retreats boom',
                    highlight: 'New direct flights from major cities',
                    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop',
                    color: 'coral'
                  },
                  {
                    title: 'Amalfi Coast, Italy',
                    trend: 'Private yacht experiences surge',
                    highlight: 'Limoncello tasting tours trending',
                    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73fb6?q=80&w=2070&auto=format&fit=crop',
                    color: 'gold'
                  },
                  {
                    title: 'Fiji Islands',
                    trend: 'Overwater villa renovations',
                    highlight: 'Private island buyouts available',
                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
                    color: 'azure'
                  }
                ].map((trend, index) => (
                  <motion.div
                    key={trend.title}
                    variants={slideUpVariants}
                    className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-500 group cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={trend.image}
                        alt={trend.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className={`bg-${trend.color}-500/90 text-white`}>
                          🔥 Hot
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-azure-300 transition-colors">
                        {trend.title}
                      </h3>
                      <div className="space-y-2 mb-4">
                        <p className="text-coral-400 text-sm font-medium">
                          Trending: {trend.trend}
                        </p>
                        <p className="text-white/80 text-sm">
                          {trend.highlight}
                        </p>
                      </div>
                      <button className="w-full bg-gradient-to-r from-azure-500 to-coral-500 hover:from-azure-600 hover:to-coral-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
                        <span>Ask Concierge</span>
                        <span className="text-sm">✨</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              variants={slideUpVariants}
              className="text-center mt-12"
            >
              <p className="text-white/60 mb-6">Scroll horizontally to see more trending destinations</p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-azure-500 rounded-full"></div>
                <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                <div className="w-2 h-2 bg-white/30 rounded-full"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Classic Ever-Popular Escapes Section */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.3
                }
              }
            }}
            className="max-w-7xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-gold-500 to-coral-500 text-white">
                ⭐ Timeless Classics
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)]">
                Classic Ever-Popular Escapes
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                These legendary destinations have captivated travelers for generations. Discover the stories, secrets, and signature experiences that make them eternally irresistible.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Paris, France',
                  era: 'The Eternal City of Love',
                  story: 'Where romance was invented and art comes alive',
                  signature: 'Seine River dinner cruises at golden hour',
                  image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=2070&auto=format&fit=crop',
                  color: 'pink'
                },
                {
                  title: 'Rome, Italy',
                  era: 'Ancient Empire\'s Heart',
                  story: 'Walk in the footsteps of emperors and artists',
                  signature: 'Colosseum twilight tours with local historians',
                  image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73fb6?q=80&w=2070&auto=format&fit=crop',
                  color: 'coral'
                },
                {
                  title: 'Maldives',
                  era: 'Ocean Paradise',
                  story: 'Where turquoise waters meet luxury redefined',
                  signature: 'Private overwater villa with personal chef',
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
                  color: 'azure'
                },
                {
                  title: 'New York City',
                  era: 'The City That Never Sleeps',
                  story: 'Where dreams are made and ambitions realized',
                  signature: 'Helicopter tours at sunset over Manhattan',
                  image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop',
                  color: 'gold'
                },
                {
                  title: 'Swiss Alps',
                  era: 'Mountain Majesty',
                  story: 'Where nature\'s grandeur meets human luxury',
                  signature: 'Private chalet with panoramic alpine views',
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
                  color: 'palm'
                }
              ].map((classic, index) => (
                <motion.div
                  key={classic.title}
                  variants={slideUpVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group cursor-pointer relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={classic.image}
                      alt={classic.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className={`bg-${classic.color}-500/90 text-white`}>
                        Classic
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-azure-200 transition-colors">
                        {classic.title}
                      </h3>
                      <p className="text-white/90 text-sm mb-2">
                        <em>{classic.era}</em>
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm italic mb-2">
                        "{classic.story}"
                      </p>
                      <p className="text-gray-700">
                        <strong>Signature Experience:</strong> {classic.signature}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <button className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2">
                        <span>Discover Stories</span>
                        <span className="text-xs">📖</span>
                      </button>
                      <Badge variant="outline" className="text-gray-600">
                        Eternal Favorite
                      </Badge>
                    </div>
                  </div>

                  {/* Hover overlay with quick facts */}
                  <div className="absolute inset-0 bg-gradient-to-t from-azure-500/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white">
                      <p className="text-sm mb-2">✨ Why it's legendary:</p>
                      <p className="text-xs leading-relaxed">
                        These destinations have inspired poets, artists, and dreamers for centuries. Each offers a unique blend of history, culture, and unforgettable experiences.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tailored For You - Dynamic Itinerary Builder */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.3
                }
              }
            }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-azure-500 to-pink-500 text-white">
                🎯 Perfectly Personalized
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)]">
                Tailored For You
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Answer 3 questions, get your dream trip! Our intelligent system creates personalized itineraries that match your unique preferences and travel style.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={slideUpVariants}
                className="space-y-6"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Build Your Perfect Journey</h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        1. What's your travel style?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Luxury & Relaxation', 'Adventure & Exploration', 'Cultural Immersion', 'Romantic Getaway'].map((style) => (
                          <button
                            key={style}
                            className="p-3 bg-gradient-to-r from-azure-50 to-coral-50 hover:from-azure-100 hover:to-coral-100 border-2 border-azure-200 hover:border-azure-400 rounded-lg text-gray-700 hover:text-gray-900 transition-all duration-300"
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        2. Preferred climate?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Tropical Paradise', 'Cool Mountains', 'Mediterranean Mild', 'Urban Adventure'].map((climate) => (
                          <button
                            key={climate}
                            className="p-3 bg-gradient-to-r from-palm-50 to-gold-50 hover:from-palm-100 hover:to-gold-100 border-2 border-palm-200 hover:border-palm-400 rounded-lg text-gray-700 hover:text-gray-900 transition-all duration-300"
                          >
                            {climate}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        3. Budget range?
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {['Premium Luxury ($5000+)', 'Mid-Range Luxury ($2000-5000)', 'Comfortable ($1000-2000)'].map((budget) => (
                          <button
                            key={budget}
                            className="p-3 bg-gradient-to-r from-pink-50 to-coral-50 hover:from-pink-100 hover:to-coral-100 border-2 border-pink-200 hover:border-pink-400 rounded-lg text-gray-700 hover:text-gray-900 transition-all duration-300 text-left"
                          >
                            {budget}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-8 bg-gradient-to-r from-azure-500 to-coral-500 hover:from-azure-600 hover:to-coral-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                    <span>Get My Custom Itinerary</span>
                    <span className="text-xl">⚡</span>
                  </button>
                </div>
              </motion.div>

              <motion.div
                variants={slideUpVariants}
                className="space-y-6"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">✨ Sample Itinerary Preview</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-azure-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                      <div>
                        <p className="font-semibold text-gray-900">Private Villa in Santorini</p>
                        <p className="text-sm text-gray-600">3 nights with sunset views</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                      <div>
                        <p className="font-semibold text-gray-900">Wine Tasting Tour</p>
                        <p className="text-sm text-gray-600">Local vineyards & traditional dinner</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-palm-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                      <div>
                        <p className="font-semibold text-gray-900">Boat Cruise to Volcano</p>
                        <p className="text-sm text-gray-600">Private yacht with champagne</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-azure-50 to-coral-50 rounded-lg">
                    <p className="text-center text-gray-700">
                      <strong>Total: $3,200</strong> • <em>7 days of pure magic</em>
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-azure-500/10 to-coral-500/10 rounded-2xl p-6 border border-white/50">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">🎯 Why It's Perfect For You</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-azure-500 rounded-full"></span>
                      Matches your luxury travel style preference
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-coral-500 rounded-full"></span>
                      Perfect Mediterranean climate for your dates
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                      Includes romantic elements you love
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Holiday In Every Season */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.3
                }
              }
            }}
            className="max-w-7xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-gold-500 to-coral-500 text-white">
                🌍 Holiday In Every Season
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-playfair)]">
                Travel For Every Mood & Moment
              </h2>
              <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                Whether you crave winter wonderlands or summer adventures, we have the perfect destination for every season and every dream.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  season: 'Winter Wonder',
                  title: 'Alpine Magic',
                  description: 'Snow-capped mountains and cozy luxury',
                  color: 'azure',
                  accent: '❄️',
                  destinations: ['Swiss Alps', 'Austrian Tyrol', 'Canadian Rockies']
                },
                {
                  season: 'Spring Awakening',
                  title: 'Bloom & Blossom',
                  description: 'Cherry blossoms and cultural festivals',
                  color: 'pink',
                  accent: '🌸',
                  destinations: ['Kyoto, Japan', 'Amsterdam', 'Washington DC']
                },
                {
                  season: 'Summer Paradise',
                  title: 'Sun & Sea',
                  description: 'Beach bliss and island adventures',
                  color: 'coral',
                  accent: '☀️',
                  destinations: ['Santorini', 'Maldives', 'French Riviera']
                },
                {
                  season: 'Autumn Romance',
                  title: 'Golden Hours',
                  description: 'Harvest festivals and cozy retreats',
                  color: 'gold',
                  accent: '🍂',
                  destinations: ['Tuscany', 'New England', 'Scottish Highlands']
                }
              ].map((seasonal, index) => (
                <motion.div
                  key={seasonal.season}
                  variants={slideUpVariants}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className={`group cursor-pointer bg-gradient-to-br from-${seasonal.color}-500/20 to-${seasonal.color}-600/10 backdrop-blur-sm rounded-2xl p-6 border border-${seasonal.color}-400/30 hover:border-${seasonal.color}-400/60 transition-all duration-500`}
                >
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 bg-${seasonal.color}-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      {seasonal.accent}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{seasonal.season}</h3>
                    <p className="text-white/80 text-sm">{seasonal.title}</p>
                  </div>

                  <p className="text-white/70 text-sm text-center mb-4">
                    {seasonal.description}
                  </p>

                  <div className="space-y-2">
                    {seasonal.destinations.map((dest) => (
                      <div key={dest} className="flex items-center justify-between text-xs">
                        <span className="text-white/80">{dest}</span>
                        <div className={`w-2 h-2 bg-${seasonal.color}-400 rounded-full`}></div>
                      </div>
                    ))}
                  </div>

                  <button className={`w-full mt-6 bg-${seasonal.color}-500 hover:bg-${seasonal.color}-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300`}>
                    Explore {seasonal.season}
                  </button>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={slideUpVariants}
              className="text-center mt-16"
            >
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <span className="text-white/80">Scroll through seasons:</span>
                <div className="flex gap-2">
                  <button className="w-3 h-3 bg-azure-500 rounded-full"></button>
                  <button className="w-3 h-3 bg-pink-400 rounded-full"></button>
                  <button className="w-3 h-3 bg-coral-500 rounded-full"></button>
                  <button className="w-3 h-3 bg-gold-500 rounded-full"></button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Seamless Booking & Support */}
      <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.3
                }
              }
            }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={slideUpVariants}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-palm-500 to-azure-500 text-white">
                🚀 Effortless Experience
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-playfair)]">
                Seamless Booking & Support
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                From the moment you dream until the day you return, our concierge team handles every detail with precision and care.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={slideUpVariants}
                className="space-y-8"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="text-3xl">⚡</span>
                    Instant Booking Confirmation
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-azure-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <div>
                        <p className="font-semibold text-gray-900">Choose Your Journey</p>
                        <p className="text-sm text-gray-600">Select from curated experiences or build custom</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <div>
                        <p className="font-semibold text-gray-900">Personalize Details</p>
                        <p className="text-sm text-gray-600">Add special requests and preferences</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-palm-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                      <div>
                        <p className="font-semibold text-gray-900">Instant Confirmation</p>
                        <p className="text-sm text-gray-600">Receive immediate booking confirmation</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-azure-500/10 to-coral-500/10 rounded-2xl p-8 border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="text-3xl">🛡️</span>
                    Travel Protection & Support
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'Trip Cancellation Protection',
                      '24/7 Concierge Support',
                      'On-Ground Assistance',
                      'Flexible Rebooking',
                      'Travel Insurance Options',
                      'Emergency Support Line'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-azure-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={slideUpVariants}
                className="relative"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Book Your Journey?</h3>
                    <p className="text-gray-700">Get instant confirmation and speak with your dedicated concierge</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 bg-azure-50 rounded-lg">
                      <div className="w-8 h-8 bg-azure-500 rounded-full flex items-center justify-center text-white text-sm">
                        ✓
                      </div>
                      <span className="text-gray-700 text-sm">Premium accommodations confirmed</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-coral-50 rounded-lg">
                      <div className="w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center text-white text-sm">
                        ✓
                      </div>
                      <span className="text-gray-700 text-sm">Flights and transfers arranged</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-palm-50 rounded-lg">
                      <div className="w-8 h-8 bg-palm-500 rounded-full flex items-center justify-center text-white text-sm">
                        ✓
                      </div>
                      <span className="text-gray-700 text-sm">Concierge team assigned</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-azure-500 to-coral-500 hover:from-azure-600 hover:to-coral-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                    <span>Book Now with Confidence</span>
                    <span className="text-xl">🚀</span>
                  </button>

                  <div className="flex justify-center gap-4 mt-6">
                    {[
                      { name: 'Verified Reviews', icon: '⭐' },
                      { name: 'Secure Booking', icon: '🔒' },
                      { name: 'Best Price Guarantee', icon: '💎' }
                    ].map((badge) => (
                      <div key={badge.name} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                        <span className="text-sm">{badge.icon}</span>
                        <span className="text-xs text-gray-600">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overlay Modals */}
      <AnimatePresence>
        {selectedHotspot && selectedHotspot.id !== 'custom' && (
          <DestinationOverlay hotspot={selectedHotspot} onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'custom' && (
          <CustomJourneyOverlay onClose={handleOverlayClose} />
        )}
      </AnimatePresence>

      {/* Robofy CTA Components */}
      <FloatingCTAButton
        onClick={() => setShowRobofyCTA(true)}
        primaryColor={travelColors.azure}
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Travel Agency"
        primaryColor={travelColors.azure}
        secondaryColor={travelColors.coral}
      />
    </div>
  );
}