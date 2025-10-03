'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Nunito } from 'next/font/google';
import Image from 'next/image';
import { RobofyCTA, FloatingCTAButton } from '@/components/ui/RobofyCTA';

// Load fonts locally for this page
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair'
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-nunito'
});

// Pet Care Color Palette
const petColors = {
  warmOrange: '#FFA726',    // energy and friendliness
  softTeal: '#4DB6AC',      // calm and healing
  creamyBeige: '#FFF3E0',   // warmth and comfort
  earthyBrown: '#6D4C41',   // reliability
  softGray: '#B0BEC5'       // balance and modern touch
};

// Business info for this demo
const petCare = {
  name: 'Pawfect Care',
  tagline: 'Compassionate Care for Your Furry Family',
  subtitle: 'Professional Pet Services Under One Roof',
  phone: '(555) 123-PAWS',
  email: 'hello@pawfectcare.com',
  address: '456 Pet Paradise Lane, City, State 12345',
  hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM, Sun: Closed',
  description: 'Complete Pet Care Services - Grooming, Veterinary Care, Pet Sitting & Training'
};

// Hotspot data for hero section
const heroHotspots = [
  {
    id: 'grooming',
    title: 'Pet Grooming',
    description: 'Professional bathing, haircuts, and nail care',
    position: { x: 20, y: 30 },
    icon: '✂️',
    color: petColors.warmOrange
  },
  {
    id: 'vetcare',
    title: 'Veterinary Care',
    description: 'Complete health checkups and emergency care',
    position: { x: 80, y: 25 },
    icon: '🏥',
    color: petColors.softTeal
  },
  {
    id: 'petsitting',
    title: 'Pet Sitting',
    description: 'Loving care when you\'re away from home',
    position: { x: 65, y: 75 },
    icon: '🏠',
    color: petColors.creamyBeige
  },
  {
    id: 'training',
    title: 'Training',
    description: 'Obedience and behavioral training programs',
    position: { x: 15, y: 70 },
    icon: '🎓',
    color: petColors.earthyBrown
  },
  {
    id: 'location',
    title: 'Find Us',
    description: 'Visit our pet-friendly facility',
    position: { x: 85, y: 15 },
    icon: '📍',
    color: petColors.softTeal
  },
  {
    id: 'contact',
    title: 'Contact Us',
    description: 'Get in touch with our caring team',
    position: { x: 85, y: 85 },
    icon: '📞',
    color: petColors.warmOrange
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

// Services overlay content
const ServicesOverlay = ({ onClose }: { onClose: () => void }) => (
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
          Our Pet Services
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <div className="w-16 h-16 bg-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">✂️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pet Grooming</h3>
          <p className="text-gray-700 mb-4">Professional bathing, haircuts, nail trimming, and ear cleaning</p>
          <ul className="text-gray-700 text-sm space-y-1 mb-4">
            <li>• Breed-specific styling</li>
            <li>• Medicated baths available</li>
            <li>• Nail grinding & paw care</li>
          </ul>
          <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Book Grooming
          </button>
        </div>

        <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
          <div className="w-16 h-16 bg-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🏥</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Veterinary Care</h3>
          <p className="text-gray-700 mb-4">Complete health checkups, vaccinations, and emergency care</p>
          <ul className="text-gray-700 text-sm space-y-1 mb-4">
            <li>• Annual wellness exams</li>
            <li>• Vaccination programs</li>
            <li>• Emergency services</li>
          </ul>
          <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            Schedule Vet Visit
          </button>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="w-16 h-16 bg-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🏠</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pet Sitting</h3>
          <p className="text-gray-700 mb-4">Loving care for your pets when you're away from home</p>
          <ul className="text-gray-700 text-sm space-y-1 mb-4">
            <li>• In-home pet sitting</li>
            <li>• Daily dog walking</li>
            <li>• Overnight stays</li>
          </ul>
          <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
            Book Pet Sitting
          </button>
        </div>

        <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
          <div className="w-16 h-16 bg-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🎓</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Training Programs</h3>
          <p className="text-gray-700 mb-4">Professional obedience and behavioral training</p>
          <ul className="text-gray-700 text-sm space-y-1 mb-4">
            <li>• Puppy socialization</li>
            <li>• Basic obedience</li>
            <li>• Behavior modification</li>
          </ul>
          <button className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
            Start Training
          </button>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🥫</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nutrition Consulting</h3>
          <p className="text-gray-700 mb-4">Personalized diet plans for optimal pet health</p>
          <ul className="text-gray-700 text-sm space-y-1 mb-4">
            <li>• Weight management</li>
            <li>• Special diet needs</li>
            <li>• Food recommendations</li>
          </ul>
          <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Get Nutrition Plan
          </button>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🏠</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pet Adoption</h3>
          <p className="text-gray-700 mb-4">Help connect loving pets with forever homes</p>
          <ul className="text-gray-700 text-sm space-y-1 mb-4">
            <li>• Meet adoptable pets</li>
            <li>• Adoption counseling</li>
            <li>• Post-adoption support</li>
          </ul>
          <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            View Adoptable Pets
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Testimonials overlay content
const TestimonialsOverlay = ({ onClose }: { onClose: () => void }) => (
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
          Happy Pet Parents
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-lg">🐕</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Sarah Johnson</h3>
              <p className="text-gray-600 text-sm">Golden Retriever Owner</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">"Pawfect Care has been amazing for Max! The grooming is always perfect and the staff is so caring. I wouldn't trust anyone else with my furry baby!"</p>
          <div className="flex text-orange-400">
            {'⭐'.repeat(5)}
          </div>
        </div>

        <div className="bg-teal-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-lg">🐱</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Mike Chen</h3>
              <p className="text-gray-600 text-sm">Cat Parent</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">"The veterinary care here is exceptional. Dr. Smith is so gentle with Whiskers and always takes time to explain everything clearly."</p>
          <div className="flex text-teal-400">
            {'⭐'.repeat(5)}
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-lg">🐇</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Emma Wilson</h3>
              <p className="text-gray-600 text-sm">Rabbit & Guinea Pig Mom</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">"When I travel for work, I know my little ones are in the best hands. The pet sitting service is reliable and they send daily updates with photos!"</p>
          <div className="flex text-green-400">
            {'⭐'.repeat(5)}
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-lg">🦮</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">David Brown</h3>
              <p className="text-gray-600 text-sm">Labrador Owner</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">"Buddy's training classes were a game-changer! The positive reinforcement methods work wonders and the trainer is incredibly patient."</p>
          <div className="flex text-purple-400">
            {'⭐'.repeat(5)}
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Booking overlay content
const BookingOverlay = ({ onClose }: { onClose: () => void }) => (
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
          Book Appointment
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              placeholder="Your pet's name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent">
              <option>Pet Grooming</option>
              <option>Veterinary Care</option>
              <option>Pet Sitting</option>
              <option>Training</option>
              <option>Nutrition Consulting</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent">
              <option>Dog</option>
              <option>Cat</option>
              <option>Rabbit</option>
              <option>Bird</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent">
              <option>Morning (8AM-12PM)</option>
              <option>Afternoon (12PM-4PM)</option>
              <option>Evening (4PM-6PM)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
          <textarea
            rows={3}
            placeholder="Any special requirements or concerns about your pet..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-orange-700 transition-colors"
        >
          Book Appointment
        </button>
      </form>
    </motion.div>
  </motion.div>
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
          Visit Pawfect Care
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
            <h3 className="text-xl font-bold text-gray-900">📍 Location</h3>
            <p className="text-gray-700">{petCare.address}</p>
            <p className="text-gray-700">Phone: {petCare.phone}</p>
            <p className="text-gray-700">Email: {petCare.email}</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">🕒 Hours</h3>
            <p className="text-gray-700">{petCare.hours}</p>
            <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
              Get Directions
            </button>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-2">What to Expect</h3>
          <ul className="text-gray-700 text-sm space-y-1">
            <li>• Welcoming, pet-friendly environment</li>
            <li>• Separate waiting areas for cats and dogs</li>
            <li>• Climate-controlled facility</li>
            <li>• Ample parking available</li>
          </ul>
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
            <h3 className="text-xl font-bold text-gray-900">📞 Get in Touch</h3>
            <p className="text-gray-700">Phone: {petCare.phone}</p>
            <p className="text-gray-700">Email: {petCare.email}</p>
            <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Call Now
            </button>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">ℹ️ Quick Info</h3>
            <p className="text-gray-700">{petCare.hours}</p>
            <p className="text-gray-700">{petCare.address}</p>
            <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
              Send Message
            </button>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Emergency Contact</h3>
          <p className="text-gray-700">For after-hours emergencies, call our 24/7 hotline:</p>
          <p className="text-xl font-bold text-orange-600">(555) 911-PAWS</p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Main component
export default function PetCareLandingPage() {
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

  // JSON-LD Schema for SEO
  const generatePetCareSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "VeterinaryBusiness",
      "name": "Pawfect Care",
      "description": "Compassionate Care for Your Furry Family Members - Complete Pet Care Services",
      "telephone": "(555) 123-PAWS",
      "email": "hello@pawfectcare.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "456 Pet Paradise Lane",
        "addressLocality": "City",
        "addressRegion": "State",
        "postalCode": "12345"
      },
      "openingHours": "Mo-Fr 08:00-18:00, Sa 09:00-16:00",
      "serviceOffered": [
        "Pet Grooming",
        "Veterinary Care",
        "Pet Sitting",
        "Obedience Training",
        "Nutrition Consulting",
        "Pet Adoption Support"
      ],
      "amenityFeature": [
        "Certified Staff",
        "Pet-Safe Environment",
        "Personalized Care Plans",
        "Flexible Scheduling"
      ]
    };
  };

  const schema = generatePetCareSchema();

  return (
    <div className={`${playfair.variable} ${nunito.variable}`} style={{
      '--pet-warm-orange': petColors.warmOrange,
      '--pet-soft-teal': petColors.softTeal,
      '--pet-creamy-beige': petColors.creamyBeige,
      '--pet-earthy-brown': petColors.earthyBrown,
      '--pet-soft-gray': petColors.softGray
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
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Happy pets and caring staff in a modern pet care facility"
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
              Pawfect Care
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl lg:text-3xl mb-8 font-light opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Compassionate Care for Your Furry Family
            </motion.p>

            <motion.p
              className="text-lg md:text-xl mb-12 opacity-80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Professional grooming, veterinary care, pet sitting & training - all under one roof with love and expertise.
            </motion.p>

            <motion.button
              className="bg-[var(--pet-warm-orange)] hover:bg-[var(--pet-warm-orange)]/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => handleHotspotClick('grooming')}
            >
              Book Your Pet's Spa Day
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
            <span className="text-sm">Discover Our Services</span>
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

      {/* Services Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Complete Pet Care Services
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              From grooming to veterinary care, we provide everything your pet needs for a happy, healthy life
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '✂️',
                title: 'Professional Grooming',
                description: 'Expert styling and care for all breeds',
                color: 'orange'
              },
              {
                icon: '🏥',
                title: 'Veterinary Care',
                description: 'Comprehensive health services and emergency care',
                color: 'teal'
              },
              {
                icon: '🏠',
                title: 'Pet Sitting',
                description: 'Loving care when you\'re away from home',
                color: 'yellow'
              },
              {
                icon: '🎓',
                title: 'Training Programs',
                description: 'Positive reinforcement training methods',
                color: 'amber'
              },
              {
                icon: '🥫',
                title: 'Nutrition Consulting',
                description: 'Personalized diet plans for optimal health',
                color: 'green'
              },
              {
                icon: '🏠',
                title: 'Pet Adoption',
                description: 'Helping pets find their forever homes',
                color: 'purple'
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-${service.color}-400`}
              >
                <div className={`w-16 h-16 bg-${service.color}-600 rounded-full mx-auto mb-6 flex items-center justify-center`}>
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative min-h-screen bg-white flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Why Choose Pawfect Care?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We're committed to providing exceptional care with love, expertise, and attention to detail
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '👨‍⚕️',
                title: 'Certified Experts',
                description: 'Our staff are certified professionals with years of experience',
                color: 'blue'
              },
              {
                icon: '🏥',
                title: 'Modern Facility',
                description: 'State-of-the-art equipment in a pet-safe environment',
                color: 'green'
              },
              {
                icon: '💝',
                title: 'Personalized Care',
                description: 'Customized care plans tailored to each pet\'s needs',
                color: 'pink'
              },
              {
                icon: '⏰',
                title: 'Convenient Scheduling',
                description: 'Flexible appointment times to fit your busy schedule',
                color: 'purple'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`w-20 h-20 bg-${feature.color}-600 rounded-full mx-auto mb-6 flex items-center justify-center`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-orange-100 to-teal-100 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Happy Pet Parents
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              See what pet owners are saying about our compassionate care
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                pet: 'Golden Retriever - Max',
                rating: 5,
                text: 'Pawfect Care has been amazing for Max! The grooming is always perfect and the staff is so caring. I wouldn\'t trust anyone else with my furry baby!',
                color: 'orange'
              },
              {
                name: 'Mike Chen',
                pet: 'Cat - Whiskers',
                rating: 5,
                text: 'The veterinary care here is exceptional. Dr. Smith is so gentle with Whiskers and always takes time to explain everything clearly.',
                color: 'teal'
              },
              {
                name: 'Emma Wilson',
                pet: 'Rabbit - Fluffy',
                rating: 5,
                text: 'When I travel for work, I know my little one is in the best hands. The pet sitting service is reliable and they send daily updates with photos!',
                color: 'green'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-${testimonial.color}-600 rounded-full flex items-center justify-center mr-4`}>
                    <span className="text-white text-lg">
                      {testimonial.pet.includes('Dog') ? '🐕' :
                       testimonial.pet.includes('Cat') ? '🐱' : '🐇'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.pet}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div className="flex text-yellow-400">
                  {'⭐'.repeat(testimonial.rating)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pet Care Tips Section */}
      <section className="relative min-h-screen bg-white flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Pet Care Tips & Blog
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Expert advice on nutrition, training, and keeping your pets healthy and happy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Seasonal Pet Care Guide',
                excerpt: 'Essential tips for keeping your pets comfortable and healthy throughout the year...',
                category: 'Health',
                readTime: '5 min read',
                color: 'orange'
              },
              {
                title: 'Nutrition for Different Life Stages',
                excerpt: 'How to choose the right food for puppies, adult dogs, and senior pets...',
                category: 'Nutrition',
                readTime: '7 min read',
                color: 'green'
              },
              {
                title: 'Training Tips for New Pet Parents',
                excerpt: 'Positive reinforcement techniques that really work for obedience training...',
                category: 'Training',
                readTime: '6 min read',
                color: 'blue'
              }
            ].map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className={`w-full h-48 bg-${article.color}-200 rounded-lg mb-4 flex items-center justify-center`}>
                  <span className="text-4xl">
                    {article.category === 'Health' ? '🏥' :
                     article.category === 'Nutrition' ? '🥗' : '🎓'}
                  </span>
                </div>
                <div className={`inline-block bg-${article.color}-100 text-${article.color}-800 px-3 py-1 rounded-full text-sm mb-3`}>
                  {article.category}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-700 mb-4">{article.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{article.readTime}</span>
                  <span className="text-orange-600 hover:text-orange-700">Read More →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-teal-900 to-orange-900 text-white flex items-center">
        <div className="max-w-4xl mx-auto px-4 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold mb-6">
              Ready to Give Your Pet the Best Care?
            </h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto mb-12">
              Book an appointment today and join hundreds of happy pet parents who trust Pawfect Care
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-4">📞</div>
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="opacity-80">{petCare.phone}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-4">📍</div>
                <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                <p className="opacity-80">{petCare.address}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-4">⏰</div>
                <h3 className="text-xl font-bold mb-2">Hours</h3>
                <p className="opacity-80">{petCare.hours}</p>
              </div>
            </div>

            <motion.button
              className="bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full hover:bg-orange-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleHotspotClick('contact')}
            >
              Book Your Pet's Appointment
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Overlay Modals */}
      <AnimatePresence>
        {activeOverlay === 'grooming' && (
          <ServicesOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'vetcare' && (
          <ServicesOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'petsitting' && (
          <ServicesOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'training' && (
          <ServicesOverlay onClose={handleOverlayClose} />
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
        primaryColor={petColors.warmOrange}
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Pet Care"
        primaryColor={petColors.warmOrange}
        secondaryColor={petColors.softTeal}
      />
    </div>
  );
}