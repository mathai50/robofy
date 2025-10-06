'use client';

import { useState, useEffect, useRef } from 'react';
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

// Child Care Color Palette - Warm and nurturing
const childCareColors = {
  'sky-blue': '#87CEEB',     // Soft sky blue for trust and calm
  'lemon': '#FFFACD',        // Warm lemon yellow for happiness
  'peach': '#FFE4B5',        // Soft peach for warmth and comfort
  'white': '#FFFFFF',        // Clean white for purity
  'warm-gray': '#D3D3D3'     // Warm gray for balance
};

// Business info for this demo
const childCare = {
  name: 'Little Explorers Child Care',
  tagline: 'Nurturing Young Minds, Building Bright Futures',
  subtitle: 'Where Learning and Love Come Together',
  phone: '(555) 123-KIDS',
  email: 'hello@littleexplorers.com',
  address: '789 Sunshine Lane, Happy Valley, State 12345',
  hours: 'Mon-Fri: 6:30AM-6:30PM, Sat-Sun: Closed',
  description: 'Premium child care services for infants through school-age children'
};

// Age-based hotspot data for hero section - Optimized layout avoiding UI conflicts
const heroHotspots = [
  {
    id: 'infants',
    title: 'Infant Care',
    description: 'Loving care for babies 6 weeks to 12 months',
    position: { x: 15, y: 30 },
    icon: '🍼',
    color: childCareColors['sky-blue'],
    ageGroup: '0-12 months'
  },
  {
    id: 'toddlers',
    title: 'Toddler Programs',
    description: 'Active learning for curious 1-2 year olds',
    position: { x: 85, y: 25 },
    icon: '👶',
    color: childCareColors['lemon'],
    ageGroup: '1-2 years'
  },
  {
    id: 'preschool',
    title: 'Preschool',
    description: 'Early education for 3-4 year olds',
    position: { x: 20, y: 70 },
    icon: '🧸',
    color: childCareColors['peach'],
    ageGroup: '3-4 years'
  },
  {
    id: 'prek',
    title: 'Pre-K',
    description: 'Kindergarten readiness for 4-5 year olds',
    position: { x: 80, y: 70 },
    icon: '🎨',
    color: childCareColors['warm-gray'],
    ageGroup: '4-5 years'
  },
  {
    id: 'schoolage',
    title: 'School-Age Care',
    description: 'Before and after school programs',
    position: { x: 50, y: 15 },
    icon: '📚',
    color: childCareColors['sky-blue'],
    ageGroup: '5-12 years'
  },
  {
    id: 'family',
    title: 'Family Resources',
    description: 'Support and resources for families',
    position: { x: 50, y: 85 },
    icon: '👨‍👩‍👧‍👦',
    color: childCareColors['lemon'],
    ageGroup: 'All Families'
  }
];

// Animation variants for micro-animations (under 400ms)
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

// Hotspot component with age-based styling
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

// Age-based Services overlay content
const ServicesOverlay = ({ ageGroup, onClose }: { ageGroup: string; onClose: () => void }) => {
  const services = {
    '0-12 months': {
      title: 'Infant Care Program',
      description: 'Gentle, nurturing care for our youngest explorers',
      features: [
        'Individualized feeding schedules',
        'Safe sleep environments',
        'Sensory stimulation activities',
        'Daily developmental reports'
      ],
      activities: ['Tummy time', 'Sensory play', 'Music & movement', 'Cuddling & bonding'],
      staffRatio: '1:3 caregiver ratio'
    },
    '1-2 years': {
      title: 'Toddler Adventure Program',
      description: 'Active exploration and discovery for curious toddlers',
      features: [
        'Motor skills development',
        'Language acquisition activities',
        'Social interaction opportunities',
        'Safe exploration spaces'
      ],
      activities: ['Creative play', 'Music & movement', 'Story time', 'Outdoor exploration'],
      staffRatio: '1:4 caregiver ratio'
    },
    '3-4 years': {
      title: 'Preschool Discovery Program',
      description: 'Early learning through play and structured activities',
      features: [
        'Pre-literacy skills',
        'Basic math concepts',
        'Arts & crafts projects',
        'Social-emotional learning'
      ],
      activities: ['Circle time', 'Art projects', 'Science experiments', 'Music & movement'],
      staffRatio: '1:6 caregiver ratio'
    },
    '4-5 years': {
      title: 'Pre-K Readiness Program',
      description: 'Preparing children for kindergarten success',
      features: [
        'Letter recognition & phonics',
        'Number concepts & counting',
        'Fine motor skill development',
        'Independence building'
      ],
      activities: ['Pre-reading activities', 'Math games', 'Writing practice', 'Group projects'],
      staffRatio: '1:8 caregiver ratio'
    },
    '5-12 years': {
      title: 'School-Age Adventure Program',
      description: 'Before and after school care with homework help',
      features: [
        'Homework assistance',
        'Enrichment activities',
        'Physical education',
        'Leadership opportunities'
      ],
      activities: ['STEM projects', 'Sports & games', 'Arts & crafts', 'Field trips'],
      staffRatio: '1:10 caregiver ratio'
    },
    'All Families': {
      title: 'Family Support Services',
      description: 'Resources and support for the whole family',
      features: [
        'Parent education workshops',
        'Family events & activities',
        'Referral services',
        'Community partnerships'
      ],
      activities: ['Parent nights', 'Family workshops', 'Community events', 'Support groups'],
      staffRatio: 'Family-centered support'
    }
  };

  const service = services[ageGroup as keyof typeof services] || services['0-12 months'];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        variants={overlayVariants}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
            {service.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-lg text-gray-700">{service.description}</p>

            <div className="bg-gradient-to-br from-blue-50 to-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Program Features</h3>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Activities</h3>
              <div className="grid grid-cols-2 gap-2">
                {service.activities.map((activity, index) => (
                  <span key={index} className="bg-white/50 px-3 py-2 rounded-full text-sm text-gray-700">
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Staff Ratio</h3>
              <p className="text-2xl font-bold text-purple-600 mb-2">{service.staffRatio}</p>
              <p className="text-gray-700">Ensuring personalized attention for every child</p>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold">
                Schedule a Tour
              </button>
              <button className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Download Program Details
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main component
export default function ChildCareLandingPage() {
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

  // Get age group from hotspot ID
  const getAgeGroupFromHotspot = (hotspotId: string) => {
    const hotspot = heroHotspots.find(h => h.id === hotspotId);
    return hotspot?.ageGroup || '0-12 months';
  };

  // JSON-LD Schema for SEO
  const generateChildCareSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "ChildCare",
      "name": "Little Explorers Child Care",
      "description": "Nurturing Young Minds, Building Bright Futures - Premium child care services",
      "telephone": "(555) 123-KIDS",
      "email": "hello@littleexplorers.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "789 Sunshine Lane",
        "addressLocality": "Happy Valley",
        "addressRegion": "State",
        "postalCode": "12345"
      },
      "openingHours": "Mo-Fr 06:30-18:30",
      "ageRange": "6 weeks - 12 years",
      "serviceOffered": [
        "Infant Care",
        "Toddler Programs",
        "Preschool",
        "Pre-K",
        "School-Age Care",
        "Family Support Services"
      ],
      "amenityFeature": [
        "Licensed Facility",
        "Certified Staff",
        "Age-Appropriate Curriculum",
        "Safe Learning Environment",
        "Parental Communication App",
        "Nutritious Meals"
      ]
    };
  };

  const schema = generateChildCareSchema();

  return (
    <div className={`${playfair.variable} ${nunito.variable}`} style={{
      '--childcare-sky-blue': childCareColors['sky-blue'],
      '--childcare-lemon': childCareColors['lemon'],
      '--childcare-peach': childCareColors['peach'],
      '--childcare-white': childCareColors['white'],
      '--childcare-warm-gray': childCareColors['warm-gray']
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
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Happy children playing and learning in a bright, colorful child care center"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-yellow-900/20" />
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
              Little Explorers
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl lg:text-3xl mb-8 font-light opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Nurturing Young Minds, Building Bright Futures
            </motion.p>

            <motion.p
              className="text-lg md:text-xl mb-12 opacity-80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Where learning and love come together in a safe, nurturing environment for children of all ages.
            </motion.p>

            <motion.button
              className="bg-[var(--childcare-sky-blue)] hover:bg-[var(--childcare-sky-blue)]/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => handleHotspotClick('infants')}
            >
              Explore Our Programs
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
            <span className="text-sm">Discover Our Center</span>
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

      {/* Services Section - Age-based programs */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Age-Appropriate Programs
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Each program is carefully designed to meet the developmental needs of children at every stage
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🍼',
                title: 'Infant Care',
                age: '6 weeks - 12 months',
                description: 'Gentle, nurturing care with individualized attention',
                color: 'sky-blue'
              },
              {
                icon: '👶',
                title: 'Toddler Program',
                age: '1 - 2 years',
                description: 'Active exploration and discovery in a safe environment',
                color: 'lemon'
              },
              {
                icon: '🧸',
                title: 'Preschool',
                age: '3 - 4 years',
                description: 'Early learning through play and structured activities',
                color: 'peach'
              },
              {
                icon: '🎨',
                title: 'Pre-K',
                age: '4 - 5 years',
                description: 'Kindergarten readiness and school preparation',
                color: 'warm-gray'
              },
              {
                icon: '📚',
                title: 'School-Age Care',
                age: '5 - 12 years',
                description: 'Before and after school programs with homework help',
                color: 'sky-blue'
              },
              {
                icon: '👨‍👩‍👧‍👦',
                title: 'Family Support',
                age: 'All Ages',
                description: 'Resources and support for families and caregivers',
                color: 'lemon'
              }
            ].map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[var(--childcare-${program.color})]`}
              >
                <div className={`w-16 h-16 bg-[var(--childcare-${program.color})] rounded-full mx-auto mb-6 flex items-center justify-center`}>
                  <span className="text-2xl">{program.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                <p className="text-[var(--childcare-${program.color})] font-semibold mb-4">{program.age}</p>
                <p className="text-gray-700">{program.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Credentials and safety */}
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
              Why Choose Little Explorers?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Safety, education, and love are at the heart of everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🏆',
                title: 'Licensed & Accredited',
                description: 'Fully licensed facility with national accreditation',
                color: 'blue'
              },
              {
                icon: '👨‍🎓',
                title: 'Certified Teachers',
                description: 'Experienced, certified early childhood educators',
                color: 'green'
              },
              {
                icon: '🔒',
                title: 'Safety First',
                description: 'Secure facility with comprehensive safety protocols',
                color: 'purple'
              },
              {
                icon: '📱',
                title: 'Parent Communication',
                description: 'Real-time updates through our parent app',
                color: 'orange'
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
      <section className="relative min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Happy Families
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              See what parents are saying about their experience with Little Explorers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Martinez',
                child: 'Emma (2 years)',
                rating: 5,
                text: 'Little Explorers has been a second home for Emma. The teachers are so loving and patient, and I love getting daily updates about her activities!',
                color: 'orange'
              },
              {
                name: 'Michael Chen',
                child: 'Alex (4 years)',
                rating: 5,
                text: 'The Pre-K program prepared Alex so well for kindergarten. He learned so much and made wonderful friends. Couldn\'t ask for a better environment!',
                color: 'blue'
              },
              {
                name: 'Jessica Williams',
                child: 'Maya (6 months)',
                rating: 5,
                text: 'As a first-time mom, I was nervous about daycare. Little Explorers put all my worries at ease with their caring staff and excellent infant program.',
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
                      {testimonial.child.includes('months') ? '👶' : '🧒'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.child}</p>
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

      {/* Daily Schedule - Interactive timeline */}
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
              A Day at Little Explorers
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Every day is filled with learning, play, and discovery
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-300 to-yellow-300 h-full"></div>

            <div className="space-y-12">
              {[
                { time: '6:30-8:00', activity: 'Arrival & Free Play', description: 'Gentle start to the day with quiet activities' },
                { time: '8:00-8:30', activity: 'Breakfast', description: 'Nutritious meals served family-style' },
                { time: '8:30-9:30', activity: 'Circle Time', description: 'Songs, stories, and group activities' },
                { time: '9:30-10:30', activity: 'Learning Centers', description: 'Age-appropriate educational activities' },
                { time: '10:30-11:00', activity: 'Outdoor Play', description: 'Fresh air and physical activity' },
                { time: '11:00-11:30', activity: 'Art & Music', description: 'Creative expression and movement' },
                { time: '11:30-12:00', activity: 'Lunch', description: 'Healthy, balanced meals' },
                { time: '12:00-2:00', activity: 'Nap/Rest Time', description: 'Quiet time for recharging' },
                { time: '2:00-3:00', activity: 'Afternoon Activities', description: 'Continued learning and play' },
                { time: '3:00-4:00', activity: 'Snack & Stories', description: 'Afternoon snack and story time' },
                { time: '4:00-6:00', activity: 'Free Play & Departure', description: 'Flexible activities as children are picked up' }
              ].map((item, index) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-full max-w-md ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                    <div className={`bg-gradient-to-r ${index % 2 === 0 ? 'from-blue-50 to-blue-100' : 'from-yellow-50 to-orange-100'} p-6 rounded-2xl`}>
                      <div className={`text-sm font-bold text-${index % 2 === 0 ? 'blue' : 'orange'}-600 mb-2`}>
                        {item.time}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.activity}</h3>
                      <p className="text-gray-700 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 ${index % 2 === 0 ? 'bg-blue-400' : 'bg-orange-400'} rounded-full border-4 border-white shadow-lg`}></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parental Dashboard Preview - Unique feature */}
      <section className="relative min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Parental Dashboard Preview
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Stay connected with real-time updates about your child's day
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">📱 Daily Updates</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">Emma finished her lunch</span>
                    <span className="text-xs text-green-600">2:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">Nap time completed</span>
                    <span className="text-xs text-blue-600">3:15 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-700">Art project completed</span>
                    <span className="text-xs text-purple-600">4:00 PM</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Weekly Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-sm text-gray-600">Attendance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">New Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">8</div>
                    <div className="text-sm text-gray-600">Art Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">25</div>
                    <div className="text-sm text-gray-600">Songs Learned</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">📸 Photo Gallery</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { time: 'Morning Play', activity: 'Building with blocks' },
                  { time: 'Art Time', activity: 'Finger painting' },
                  { time: 'Outdoor Fun', activity: 'Playing in the sandbox' },
                  { time: 'Story Time', activity: 'Listening to books' }
                ].map((photo, index) => (
                  <div key={index} className="bg-gradient-to-br from-pink-100 to-purple-100 p-4 rounded-lg">
                    <div className="w-full h-20 bg-white rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-2xl">📷</span>
                    </div>
                    <div className="text-xs font-bold text-gray-900">{photo.time}</div>
                    <div className="text-xs text-gray-600">{photo.activity}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enrollment Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center">
        <div className="max-w-4xl mx-auto px-4 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Ready to Join Our Family?
            </h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto mb-12">
              Limited spots available. Schedule a tour today to see why families choose Little Explorers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-4">📋</div>
                <h3 className="text-xl font-bold mb-2">Easy Enrollment</h3>
                <p className="opacity-80">Simple online application process</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-4">🏠</div>
                <h3 className="text-xl font-bold mb-2">Facility Tour</h3>
                <p className="opacity-80">See our center and meet our staff</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2">Custom Start Date</h3>
                <p className="opacity-80">Begin when it works for your family</p>
              </div>
            </div>

            <motion.button
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-full hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleHotspotClick('family')}
            >
              Schedule a Tour
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex items-center">
        <div className="max-w-4xl mx-auto px-4 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto mb-12">
              We're here to answer your questions and help you get started
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-4">📞</div>
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="opacity-80">{childCare.phone}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-4">📍</div>
                <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                <p className="opacity-80">{childCare.address}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-4">⏰</div>
                <h3 className="text-xl font-bold mb-2">Hours</h3>
                <p className="opacity-80">{childCare.hours}</p>
              </div>
            </div>

            <motion.button
              className="bg-white text-gray-900 px-8 py-4 text-lg font-semibold rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleHotspotClick('contact')}
            >
              Contact Us Today
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Overlay Modals */}
      <AnimatePresence>
        {activeOverlay && heroHotspots.find(h => h.id === activeOverlay) && (
          <ServicesOverlay
            ageGroup={getAgeGroupFromHotspot(activeOverlay)}
            onClose={handleOverlayClose}
          />
        )}
      </AnimatePresence>

      {/* Robofy CTA Components */}
      <FloatingCTAButton
        onClick={() => setShowRobofyCTA(true)}
        primaryColor={childCareColors['sky-blue']}
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Child Care"
        primaryColor={childCareColors['sky-blue']}
        secondaryColor={childCareColors['lemon']}
      />
    </div>
  );
}