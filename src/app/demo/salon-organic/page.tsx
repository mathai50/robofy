'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display, Montserrat } from 'next/font/google';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RobofyCTA, FloatingCTAButton } from '@/components/ui/RobofyCTA';
import { Phone, Mail, MapPin, Clock, Star, Scissors, Palette, Sparkles, Heart, Users } from 'lucide-react';

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

// Modern 70s Color System with proper contrast
const modernColors = {
  background: '#ffffff',
  textPrimary: '#1a1a1a',
  textSecondary: '#4a5568',
  accentPrimary: '#D96C3A',    // Burnt Orange
  accentSecondary: '#89A36F',  // Avocado Green
  accentTertiary: '#E2B857',   // Mustard Yellow
  neutral: '#6E4B2A',          // Cocoa Brown
  lightBg: '#f8fafc'
};

// Business info
const business = {
  name: 'Vintage Vibe Salon',
  tagline: 'Experience Your Best Look with Our Expert Stylists',
  subtitle: 'Cutting-edge Haircuts, Vibrant Colors & Personalized Beauty Services',
  phone: '(555) 987-6543',
  email: 'hello@vintagevibesalon.com',
  address: '456 Retro Avenue, City, State 12345',
  hours: 'Tue-Sat: 9AM-7PM, Sun: 10AM-4PM',
};

// Salon Services Data
const salonServices = [
  {
    title: 'Haircuts',
    description: 'Expert cuts for women, men, and kids with personalized styling advice.',
    duration: '45-60 min',
    icon: Scissors
  },
  {
    title: 'Hair Coloring',
    description: 'Balayage, highlights, and vibrant color transformations with keratin treatments.',
    duration: '2-3 hours',
    icon: Palette
  },
  {
    title: 'Styling',
    description: 'Wedding hair, blowouts, updos, and special occasion styling.',
    duration: '60-90 min',
    icon: Sparkles
  },
  {
    title: 'Facials & Skincare',
    description: 'Customized facials using organic ingredients for radiant, rejuvenated skin.',
    duration: '45-75 min',
    icon: Heart
  },
  {
    title: 'Manicure & Pedicure',
    description: 'Professional nail care with premium products and relaxing treatments.',
    duration: '60-90 min',
    icon: Users
  },
  {
    title: 'Waxing Services',
    description: 'Precise and comfortable hair removal with soothing aftercare.',
    duration: '15-45 min',
    icon: Sparkles
  },
];

// Why Choose Us Features
const whyChooseUs = [
  {
    title: 'Experienced Stylists',
    description: 'Our team of certified professionals brings decades of combined experience and personalized care.',
    icon: Users
  },
  {
    title: 'Personalized Consultations',
    description: 'One-on-one consultations to understand your unique style and beauty goals.',
    icon: Heart
  },
  {
    title: 'Eco-Friendly Products',
    description: 'We use only cruelty-free, organic products that are gentle on you and the environment.',
    icon: Sparkles
  },
  {
    title: 'Relaxing Atmosphere',
    description: 'Our vintage-inspired space is designed to transport you to a peaceful, bygone era.',
    icon: MapPin
  }
];

// Testimonials
const testimonials = [
  {
    name: 'Jessica Taylor',
    role: 'Regular Client',
    content: 'Best color service I\'ve ever had! The balayage turned out perfectly and lasted months.',
    rating: 5,
    service: 'Hair Coloring'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'New Client',
    content: 'The stylists really listen to what you want. Got the perfect cut that suits my face shape.',
    rating: 5,
    service: 'Haircut'
  },
  {
    name: 'Sophia Chen',
    role: 'Bride',
    content: 'Love the retro vibe and amazing service. My wedding hair was absolutely stunning!',
    rating: 5,
    service: 'Wedding Styling'
  }
];

// Modern Animation Variants
const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
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
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// JSON-LD Schema for SEO
const generateBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "name": "Vintage Vibe Salon",
    "description": "Cutting-edge Haircuts, Vibrant Colors & Personalized Beauty Services",
    "telephone": "(555) 987-6543",
    "email": "hello@vintagevibesalon.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "456 Retro Avenue",
      "addressLocality": "City",
      "addressRegion": "State",
      "postalCode": "12345"
    },
    "openingHours": "Tu-Sa 09:00-19:00, Su 10:00-16:00",
    "service": [
      "Haircut",
      "Hair Coloring",
      "Styling",
      "Facials",
      "Manicure",
      "Pedicure",
      "Waxing"
    ]
  };
};

export default function ModernSalonLandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
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
    console.log('Booking request submitted:', formData);
    alert('Thank you for your booking request! We will contact you within 2 hours to confirm your appointment.');
    setFormData({ name: '', email: '', phone: '', service: '', date: '', message: '' });
  };

  const schema = generateBusinessSchema();

  return (
    <div className={`${playfair.variable} ${montserrat.variable} bg-white`}>
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Modern Header with Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#D96C3A] to-[#E2B857] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <span className="font-bold text-2xl text-gray-900 font-[family-name:var(--font-playfair)] block leading-none">
                  Vintage Vibe
                </span>
                <span className="text-xs text-gray-600 font-medium block">SALON</span>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="#services" className="text-gray-700 hover:text-[#D96C3A] transition-colors font-medium">
                Services
              </Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-[#D96C3A] transition-colors font-medium">
                Testimonials
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-[#D96C3A] transition-colors font-medium">
                About
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-[#D96C3A] transition-colors font-medium">
                Contact
              </Link>
            </nav>
          </div>
          <Button
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-[#D96C3A] to-[#E2B857] hover:from-[#c55a2e] hover:to-[#d4a545] text-white px-6 py-3 font-semibold shadow-lg transition-all duration-300"
          >
            Book Appointment
          </Button>
        </div>
      </header>

      <main className="min-h-screen">
        {/* Hero Section - Modern Design */}
        <section className="relative py-20 lg:py-32 px-4 bg-gradient-to-br from-white via-[#f8fafc] to-[#f1f5f9]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Badge className="bg-[#89A36F] text-white px-4 py-2 mb-6 text-sm font-medium rounded-full shadow-md">
                Modern Beauty Experience
              </Badge>
              
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl leading-tight font-bold text-gray-900 mb-8">
                Experience Your
                <br />
                <span className="bg-gradient-to-r from-[#D96C3A] to-[#E2B857] bg-clip-text text-transparent">
                  Best Look
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
                Cutting-edge Haircuts, Vibrant Colors & Personalized Beauty Services in our modern, vintage-inspired space.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#D96C3A] to-[#E2B857] hover:from-[#c55a2e] hover:to-[#d4a545] text-white px-8 py-4 text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Book Your Appointment
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#89A36F] px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  Explore Services
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section - Modern Grid */}
        <section id="services" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Premium Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover our comprehensive range of beauty services designed to bring out your natural radiance.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {salonServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    className="group"
                  >
                    <Card className="h-full border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                      <CardContent className="p-8 space-y-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#89A36F] to-[#E2B857] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-gray-900">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <span className="text-[#D96C3A] text-sm font-semibold bg-orange-50 px-3 py-1 rounded-full">
                            {service.duration}
                          </span>
                          <Button variant="ghost" className="text-[#89A36F] hover:text-[#6E4B2A] hover:bg-green-50 p-2 font-medium transition-colors">
                            Learn More →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="about" className="py-20 px-4 bg-gradient-to-br from-[#f8fafc] to-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Vintage Vibe
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We combine vintage charm with modern expertise to create unforgettable beauty experiences.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {whyChooseUs.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-[#D96C3A] to-[#E2B857] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Client Love
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                See what our clients are saying about their Vintage Vibe experience.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                >
                  <Card className="h-full border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex text-[#E2B857] mb-4 justify-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed text-lg italic text-center mb-6">
                        "{testimonial.content}"
                      </p>
                      <div className="text-center">
                        <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                        <p className="text-[#89A36F] text-sm font-medium mt-1">{testimonial.service}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking" className="py-20 px-4 bg-gradient-to-br from-[#89A36F] to-[#6E4B2A]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-2xl">
                <CardContent className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Ready for Your Transformation?
                    </h2>
                    <p className="text-lg text-gray-600">
                      Book your appointment and experience the perfect blend of vintage charm and modern beauty expertise.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          required
                          placeholder="Your full name"
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#89A36F] focus:ring-[#89A36F]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                          placeholder="your.email@example.com"
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#89A36F] focus:ring-[#89A36F]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          required
                          placeholder="(555) 987-6543"
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#89A36F] focus:ring-[#89A36F]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="service" className="text-gray-700 font-medium">Preferred Service</Label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#89A36F] focus:border-[#89A36F] bg-white text-gray-900"
                          required
                        >
                          <option value="">Select a service</option>
                          {salonServices.map((service, index) => (
                            <option key={index} value={service.title}>{service.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-gray-700 font-medium">Preferred Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleFormChange}
                        required
                        className="bg-white border-gray-300 text-gray-900 focus:border-[#89A36F] focus:ring-[#89A36F]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 font-medium">Special Requests</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder="Any specific styling preferences or special requests..."
                        rows={4}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#89A36F] focus:ring-[#89A36F]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#D96C3A] to-[#E2B857] hover:from-[#c55a2e] hover:to-[#d4a545] text-white py-4 font-semibold text-lg shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Book Your Experience
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Visit Our Studio
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Come experience our unique blend of vintage charm and modern luxury.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Contact Info */}
              <motion.div variants={fadeInUp} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#89A36F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">Location</h3>
                    <p className="text-gray-600">{business.address}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#D96C3A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Phone className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">Phone</h3>
                    <p className="text-gray-600">{business.phone}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#E2B857] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">Email</h3>
                    <p className="text-gray-600">{business.email}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#6E4B2A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">Hours</h3>
                    <p className="text-gray-600">{business.hours}</p>
                  </div>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div variants={scaleIn} className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.963650057757!2d-73.96870268459367!3d40.72815797933083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259eb003122d1%3A0xede86b3e0e11d77b!2sCentral%20Park!5e0!3m2!1sen!2sus!4v1630000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#D96C3A] to-[#E2B857] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <div>
                  <span className="font-bold text-2xl font-[family-name:var(--font-playfair)] block leading-none">
                    Vintage Vibe
                  </span>
                  <span className="text-xs text-gray-400 font-medium block">SALON</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Experience organic beauty in our vintage-inspired space. Where tradition meets modern elegance.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link href="#services" className="block text-gray-400 hover:text-white transition-colors">Services</Link>
                <Link href="#testimonials" className="block text-gray-400 hover:text-white transition-colors">Testimonials</Link>
                <Link href="#about" className="block text-gray-400 hover:text-white transition-colors">About</Link>
                <Link href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Services</h4>
              <div className="space-y-2 text-sm">
                <span className="block text-gray-400">Haircuts</span>
                <span className="block text-gray-400">Hair Coloring</span>
                <span className="block text-gray-400">Styling</span>
                <span className="block text-gray-400">Beauty Treatments</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">{business.phone}</p>
                <p className="text-gray-400">{business.email}</p>
                <p className="text-gray-400">{business.address}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-400">
              &copy; 2025 Vintage Vibe Salon. All rights reserved. |
              <Link href="/privacy" className="hover:text-white transition-colors mx-2">Privacy Policy</Link> |
              <Link href="/terms" className="hover:text-white transition-colors mx-2">Terms of Service</Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Robofy CTA Components */}
      <FloatingCTAButton
        onClick={() => setShowRobofyCTA(true)}
        className="bg-gradient-to-r from-[#D96C3A] to-[#E2B857] hover:from-[#c55a2e] hover:to-[#d4a545]"
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Beauty Salon"
        primaryColor={modernColors.accentPrimary}
        secondaryColor={modernColors.accentSecondary}
      />
    </div>
  );
}