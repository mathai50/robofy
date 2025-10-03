'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display, Montserrat } from 'next/font/google';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RobofyCTA, FloatingCTAButton } from '@/components/ui/RobofyCTA';
import {
  Building2,
  Home,
  Trees,
  Users,
  Award,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  ChevronRight,
  Quote
} from 'lucide-react';

// SEO Schema for Property Developer
const generateBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Luxury Living Developers",
    "description": "Award-winning property developer creating exceptional residential and commercial spaces that redefine luxury living through innovative design and sustainable practices.",
    "url": "https://luxurylivingdevelopers.com",
    "telephone": "(555) 123-4567",
    "email": "info@luxurylivingdevelopers.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Prestige Avenue",
      "addressLocality": "Luxury District",
      "addressRegion": "LD",
      "postalCode": "12345"
    },
    "areaServed": "Luxury District and surrounding areas",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Property Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Residential Developments"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Commercial Projects"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Urban Renewal"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sustainable Solutions"
          }
        }
      ]
    },
    "award": [
      "Best Luxury Developer 2024",
      "Sustainable Design Award 2023",
      "Architectural Excellence Award 2024"
    ],
    "founder": {
      "@type": "Person",
      "name": "Alexander Sterling"
    },
    "foundingDate": "2010"
  };
};

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

// Luxury property developer color palette
const propertyTheme = {
  emerald: '#056D4F',
  burgundy: '#800020',
  gold: '#D4AF37',
  cream: '#F5F1E9',
  charcoal: '#2E2E2E',
  white: '#FFFFFF'
};

// Business info for this demo
const business = {
  name: 'Luxury Living Developers',
  tagline: 'Crafting Exceptional Spaces, Defining Luxury Living',
  subtitle: 'Innovative Architecture | Strategic Locations | Timeless Design',
  phone: '(555) 123-4567',
  email: 'info@luxurylivingdevelopers.com',
  address: '123 Prestige Avenue, Luxury District, LD 12345',
  description: 'Award-winning property developer creating exceptional residential and commercial spaces that redefine luxury living through innovative design and sustainable practices.',
};

// Featured Projects
interface Project {
  title: string;
  location: string;
  type: string;
  status: string;
  description: string;
  image: string;
  features: string[];
}

const featuredProjects: Project[] = [
  {
    title: 'The Emerald Residences',
    location: 'Downtown Luxury District',
    type: 'Luxury Condominiums',
    status: 'Under Construction',
    description: '45-story luxury condominium with panoramic city views, premium amenities, and sustainable design.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1740&auto=format&fit=crop',
    features: ['Rooftop Infinity Pool', 'Private Spa', '24/7 Concierge', 'Smart Home Integration']
  },
  {
    title: 'Burgundy Heights',
    location: 'Uptown Hills',
    type: 'Gated Community',
    status: 'Planning Phase',
    description: 'Exclusive gated community featuring custom-built homes with expansive lots and premium finishes.',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1740&auto=format&fit=crop',
    features: ['Custom Home Designs', 'Community Clubhouse', 'Private Park', 'Security Gates']
  },
  {
    title: 'Golden View Towers',
    location: 'Waterfront District',
    type: 'Mixed-Use Development',
    status: 'Completed',
    description: 'Mixed-use development combining luxury residences with premium retail and dining experiences.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1740&auto=format&fit=crop',
    features: ['Waterfront Views', 'Retail Plaza', 'Fitness Center', 'Underground Parking']
  }
];

// Services
interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    title: 'Residential Developments',
    description: 'Luxury condominiums, custom homes, and gated communities designed for modern living.',
    icon: <Home className="h-8 w-8" />
  },
  {
    title: 'Commercial Projects',
    description: 'Office buildings, retail centers, and mixed-use developments in prime locations.',
    icon: <Building2 className="h-8 w-8" />
  },
  {
    title: 'Urban Renewal',
    description: 'Transforming underutilized urban spaces into vibrant, sustainable communities.',
    icon: <Trees className="h-8 w-8" />
  },
  {
    title: 'Sustainable Solutions',
    description: 'Eco-friendly building practices and green technologies for a better future.',
    icon: <Award className="h-8 w-8" />
  }
];

// Team Members
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  specialties: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: 'Alexander Sterling',
    role: 'Founder & CEO',
    bio: 'Visionary leader with 20+ years in luxury property development and urban planning.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1374&auto=format&fit=crop',
    specialties: ['Strategic Planning', 'Investment Analysis', 'Market Development']
  },
  {
    name: 'Isabella Chen',
    role: 'Head Architect',
    bio: 'Award-winning architect specializing in sustainable luxury residential design.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop',
    specialties: ['Architectural Design', 'Sustainability', 'Luxury Interiors']
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Project Director',
    bio: 'Expert in large-scale development projects and construction management.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1374&auto=format&fit=crop',
    specialties: ['Project Management', 'Construction Oversight', 'Budget Control']
  }
];

// Testimonials
interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  project: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'James Wilson',
    role: 'Residential Client',
    content: 'The attention to detail and quality of construction exceeded our expectations. Our home is everything we dreamed of and more.',
    rating: 5,
    project: 'Golden View Towers'
  },
  {
    name: 'Sarah Thompson',
    role: 'Commercial Investor',
    content: 'Professional, transparent, and delivered ahead of schedule. The ROI on our investment has been outstanding.',
    rating: 5,
    project: 'Emerald Residences'
  },
  {
    name: 'Michael Park',
    role: 'Development Partner',
    content: 'Their innovative approach to urban renewal transformed a challenging site into a premium development.',
    rating: 5,
    project: 'Urban Renewal Project'
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const slideInLeft = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7 },
  },
};

const slideInRight = {
  hidden: { x: 60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7 },
  },
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

// News & Insights Data
const newsArticles = [
  {
    title: 'The Future of Sustainable Luxury Developments',
    excerpt: 'Exploring how eco-friendly practices are becoming the new standard in luxury property development.',
    date: '2025-01-15',
    category: 'Sustainability',
    readTime: '5 min read'
  },
  {
    title: 'Urban Renewal: Transforming Cities Through Design',
    excerpt: 'How strategic urban planning and innovative architecture are revitalizing city centers.',
    date: '2025-01-08',
    category: 'Urban Planning',
    readTime: '4 min read'
  },
  {
    title: 'Investment Trends in Luxury Real Estate 2025',
    excerpt: 'Analysis of emerging markets and investment opportunities in high-end property development.',
    date: '2025-01-01',
    category: 'Market Insights',
    readTime: '6 min read'
  }
];

export default function PropertyDeveloperLandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
  });
  const [showRobofyCTA, setShowRobofyCTA] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Consultation request submitted:', formData);
    alert('Thank you for your interest! Our team will contact you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', inquiryType: '', message: '' });
  };

  const schema = generateBusinessSchema();

  return (
    <div className={`${playfair.variable} ${montserrat.variable}`}>
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Self-contained Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 font-[family-name:var(--font-playfair)]">
                Luxury Living
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#projects" className="text-gray-900 hover:text-emerald-600 transition-colors font-medium">
                Projects
              </Link>
              <Link href="#services" className="text-gray-900 hover:text-emerald-600 transition-colors font-medium">
                Services
              </Link>
              <Link href="#team" className="text-gray-900 hover:text-emerald-600 transition-colors font-medium">
                Team
              </Link>
              <Link href="#contact" className="text-gray-900 hover:text-emerald-600 transition-colors font-medium">
                Contact
              </Link>
            </nav>
          </div>
          <Button
            onClick={() => document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2"
          >
            Schedule Consultation
          </Button>
        </div>
      </header>

      <main className="min-h-screen bg-white text-gray-900">
        {/* Hero Section - Organic, Asymmetrical Layout */}
        <section className="relative min-h-screen flex items-center px-4 py-20 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1740&auto=format&fit=crop"
              alt="Luxury property development"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 to-charcoal/40" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Main Content */}
            <motion.div
              className="lg:col-span-7 text-white space-y-8"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Badge className="bg-amber-500 text-gray-900 px-4 py-2 text-sm font-medium mb-4">
                Award-Winning Developer
              </Badge>
              
              <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl leading-tight font-bold">
                {business.tagline}
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
                {business.subtitle}
              </p>
              
              <p className="text-lg text-white/80 leading-relaxed max-w-xl">
                Creating exceptional residential and commercial spaces that redefine luxury living through innovative architecture, strategic locations, and timeless design principles.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-luxury-emerald hover:bg-luxury-emerald/90 text-white px-8 py-4 text-lg font-semibold shadow-lg">
                  Explore Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold">
                  View Portfolio
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-8 text-sm text-white/80">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-gold" />
                  <span>15+ Industry Awards</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-gold" />
                  <span>50+ Projects Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gold" />
                  <span>1000+ Happy Clients</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Visual Element */}
            <motion.div
              className="lg:col-span-5 relative"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-luxury-emerald rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Premium Locations</p>
                      <p className="text-white/70 text-sm">Strategic urban and suburban sites</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-luxury-burgundy rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Award-Winning Design</p>
                      <p className="text-white/70 text-sm">Industry-recognized excellence</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                      <Trees className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Sustainable Practices</p>
                      <p className="text-white/70 text-sm">Eco-friendly development</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects Section - Organic Grid */}
        <section id="projects" className="py-20 px-4 bg-luxury-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Badge className="bg-luxury-emerald text-white px-4 py-2 mb-4">
                Portfolio
              </Badge>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-black mb-6">
                Featured Developments
              </h2>
              <p className="text-xl text-gray-900 max-w-2xl mx-auto">
                Discover our award-winning projects that redefine luxury living and commercial excellence.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`
                    ${index === 0 ? 'lg:col-span-8' : ''}
                    ${index === 1 ? 'lg:col-span-4' : ''}
                    ${index === 2 ? 'lg:col-span-6 lg:col-start-4' : ''}
                    relative group
                  `}
                >
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 bg-gray-900">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={`
                         ${project.status === 'Completed' ? 'bg-luxury-emerald' : ''}
                         ${project.status === 'Under Construction' ? 'bg-amber-500 text-gray-900' : ''}
                         ${project.status === 'Planning Phase' ? 'bg-luxury-burgundy' : ''}
                         text-white px-3 py-1
                       `}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white">
                          {project.title}
                        </h3>
                        <ChevronRight className="h-5 w-5 text-luxury-emerald group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="flex items-center text-white mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{project.location}</span>
                      </div>
                      <p className="text-white mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.features.slice(0, 2).map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="outline" className="text-xs text-white border-white/50">
                            {feature}
                          </Badge>
                        ))}
                        {project.features.length > 2 && (
                          <Badge variant="outline" className="text-xs text-white border-white/50">
                            +{project.features.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services Section - Organic, Asymmetrical */}
        <section id="services" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Left Column - Text Content */}
              <motion.div
                variants={slideInLeft}
                className="lg:col-span-5 space-y-6"
              >
                <Badge className="bg-luxury-burgundy text-white px-4 py-2 mb-4">
                  Expertise
                </Badge>
                <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-black">
                  Our Services & Specializations
                </h2>
                <p className="text-xl text-gray-800 leading-relaxed">
                  Comprehensive property development services from concept to completion, delivering exceptional value and sustainable outcomes.
                </p>
                <div className="pt-6">
                  <Button className="bg-black hover:bg-black/90 text-white px-8 py-4">
                    View All Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>

              {/* Right Column - Services Grid */}
              <motion.div
                variants={slideInRight}
                className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {services.map((service, index) => (
                  <Card key={index} className="p-6 border-0 bg-gray-900 hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-0 space-y-4">
                      <div className="w-12 h-12 bg-luxury-emerald/20 rounded-lg flex items-center justify-center group-hover:bg-luxury-emerald/30 transition-colors">
                        <div className="text-white">
                          {service.icon}
                        </div>
                      </div>
                      <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white">
                        {service.title}
                      </h3>
                      <p className="text-white leading-relaxed">
                        {service.description}
                      </p>
                      <Button variant="ghost" className="p-0 h-auto text-white hover:text-white/80 font-medium group">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us Section - Organic Layout */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Badge className="bg-luxury-emerald text-white px-4 py-2 mb-4">
                Excellence
              </Badge>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Why Choose Luxury Living Developers
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {[
                {
                  title: 'Award-Winning Track Record',
                  description: 'Consistent recognition for design excellence and innovation in property development.',
                  icon: <Award className="h-8 w-8" />
                },
                {
                  title: 'Architectural Innovation',
                  description: 'Pushing boundaries with cutting-edge design and sustainable building practices.',
                  icon: <Building2 className="h-8 w-8" />
                },
                {
                  title: 'Client-Centric Approach',
                  description: 'Personalized service and transparent communication throughout every project.',
                  icon: <Users className="h-8 w-8" />
                },
                {
                  title: 'Strategic Partnerships',
                  description: 'Collaborative model ensuring optimal outcomes for all stakeholders.',
                  icon: <Trees className="h-8 w-8" />
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gray-800 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-800 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-luxury-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Badge className="bg-luxury-emerald text-white px-4 py-2 mb-4">
                Testimonials
              </Badge>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-black mb-6">
                Client Success Stories
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`
                    ${index === 1 ? 'lg:mt-8' : ''}
                    ${index === 2 ? 'lg:mt-16' : ''}
                  `}
                >
                  <Card className="h-full p-8 border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-0 space-y-6">
                      <div className="flex text-gold">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-luxury-gold fill-current" />
                        ))}
                      </div>
                      <Quote className="h-8 w-8 text-luxury-emerald/30" />
                      <p className="text-gray-900 leading-relaxed text-lg italic">
                        "{testimonial.content}"
                      </p>
                      <div className="pt-4 border-t border-gray-200">
                        <p className="font-bold text-black">{testimonial.name}</p>
                        <p className="text-gray-700 text-sm">{testimonial.role}</p>
                        <p className="text-luxury-emerald text-sm font-medium mt-1">{testimonial.project}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section - Organic Layout */}
        <section id="team" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Badge className="bg-luxury-burgundy text-white px-4 py-2 mb-4">
                Leadership
              </Badge>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-black mb-6">
                Meet Our Expert Team
              </h2>
              <p className="text-xl text-gray-900 max-w-2xl mx-auto">
                Our leadership team brings decades of experience in luxury property development and architectural excellence.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`
                    ${index === 1 ? 'md:mt-8' : ''}
                    ${index === 2 ? 'lg:mt-16' : ''}
                    text-center group
                  `}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden bg-gray-900">
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-white font-semibold mb-3">{member.role}</p>
                      <p className="text-white mb-4 leading-relaxed">
                        {member.bio}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {member.specialties.map((specialty, specIndex) => (
                          <Badge key={specIndex} variant="outline" className="text-xs text-white border-white/50">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* News & Insights Section */}
        <section className="py-20 px-4 bg-luxury-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Badge className="bg-luxury-burgundy text-white px-4 py-2 mb-4">
                Insights
              </Badge>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-black mb-6">
                Latest News & Market Insights
              </h2>
              <p className="text-xl text-gray-800 max-w-2xl mx-auto">
                Stay informed with the latest trends, innovations, and insights in luxury property development.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {newsArticles.map((article, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`
                    ${index === 1 ? 'lg:mt-8' : ''}
                    ${index === 2 ? 'lg:mt-16' : ''}
                    group
                  `}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-center text-sm text-gray-700">
                        <Badge variant="outline" className="text-xs text-gray-800">
                          {article.category}
                        </Badge>
                        <span className="text-gray-800">{article.readTime}</span>
                      </div>
                      <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-black group-hover:text-luxury-emerald transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-800 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-700">{article.date}</span>
                        <Button variant="ghost" className="p-0 h-auto text-luxury-emerald hover:text-luxury-emerald/80 font-medium group">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-12"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Contact & Consultation Section */}
        <section id="consultation" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Left Column - Contact Info */}
              <motion.div
                variants={slideInLeft}
                className="lg:col-span-5 space-y-8"
              >
                <div>
                  <Badge className="bg-luxury-emerald text-white px-4 py-2 mb-4">
                    Get Started
                  </Badge>
                  <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                    Start Your Project Today
                  </h2>
                  <p className="text-xl text-gray-800 leading-relaxed">
                    Ready to bring your vision to life? Schedule a consultation with our expert team to discuss your property development needs.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-gray-800 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 font-medium text-lg">{business.phone}</p>
                      <p className="text-sm text-gray-800">Call us directly</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-gray-800 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 font-medium text-lg">{business.email}</p>
                      <p className="text-sm text-gray-800">Send us an email</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-gray-800 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 font-medium text-lg">{business.address}</p>
                      <p className="text-sm text-gray-800">Visit our office</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button size="lg" className="bg-luxury-emerald hover:bg-luxury-emerald/90 text-white px-8 py-4">
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now
                  </Button>
                </div>
              </motion.div>

              {/* Right Column - Consultation Form */}
              <motion.div
                variants={slideInRight}
                className="lg:col-span-7"
              >
                <Card className="p-8 bg-gray-50 border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Schedule a Consultation</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-800">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          required
                          placeholder="Your full name"
                          className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-luxury-emerald"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-800">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                          placeholder="your.email@example.com"
                          className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-luxury-emerald"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-800">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          required
                          placeholder="(555) 123-4567"
                          className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-luxury-emerald"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inquiryType" className="text-gray-800">Inquiry Type</Label>
                        <select
                          id="inquiryType"
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luxury-emerald focus:border-luxury-emerald bg-white text-gray-800"
                          required
                        >
                          <option value="">Select inquiry type</option>
                          <option value="residential">Residential Development</option>
                          <option value="commercial">Commercial Project</option>
                          <option value="investment">Investment Opportunity</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-800">Project Details</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder="Tell us about your project requirements, timeline, and budget..."
                        rows={4}
                        className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-luxury-emerald"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-luxury-emerald hover:bg-luxury-emerald/90 text-white py-3 font-semibold shadow-lg"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule Consultation
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-gray-800 py-12 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-luxury-emerald rounded-full flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-xl font-[family-name:var(--font-playfair)] text-gray-800">Luxury Living</span>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">
                Creating exceptional spaces that redefine luxury living through innovative design and sustainable practices.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link href="#projects" className="block text-gray-800 hover:text-luxury-emerald transition-colors">Projects</Link>
                <Link href="#services" className="block text-gray-800 hover:text-luxury-emerald transition-colors">Services</Link>
                <Link href="#team" className="block text-gray-800 hover:text-luxury-emerald transition-colors">Our Team</Link>
                <Link href="#contact" className="block text-gray-800 hover:text-luxury-emerald transition-colors">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Services</h4>
              <div className="space-y-2 text-sm">
                <span className="block text-gray-800">Residential Development</span>
                <span className="block text-gray-800">Commercial Projects</span>
                <span className="block text-gray-800">Urban Renewal</span>
                <span className="block text-gray-800">Sustainable Solutions</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Contact Info</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-800">{business.phone}</p>
                <p className="text-gray-800">{business.email}</p>
                <p className="text-gray-800">{business.address}</p>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-800">
              &copy; 2025 Luxury Living Developers. All rights reserved. |
              <Link href="/privacy" className="hover:text-luxury-emerald transition-colors mx-2">Privacy Policy</Link> |
              <Link href="/terms" className="hover:text-luxury-emerald transition-colors mx-2">Terms of Service</Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Robofy CTA Components */}
      <FloatingCTAButton
        onClick={() => setShowRobofyCTA(true)}
        className="bg-emerald-600 hover:bg-emerald-700"
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Property Development"
        primaryColor={propertyTheme.emerald}
        secondaryColor={propertyTheme.burgundy}
      />
    </div>
  );
}