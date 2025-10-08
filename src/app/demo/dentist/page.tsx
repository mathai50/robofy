"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import Select from '@/components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Calendar,
  MessageCircle,
  Mic,
  Play,
  Pause,
  Volume2,
  ChevronDown,
  Sparkles,
  Heart,
  Shield,
  Users,
  Award,
  Stethoscope,
  Baby,
  Camera,
  Scissors,
  AlertTriangle,
  Ruler,
  X
} from 'lucide-react';
import { dentalBusiness, dentalServices, dentalTestimonials, generateBusinessSchema } from '@/config/demo-businesses';

// Floating Navigation Orbs
const FloatingNavOrb = ({ icon: Icon, label, position, delay = 0, onClick }: {
  icon: any;
  label: string;
  position: string;
  delay?: number;
  onClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    className={`fixed ${position} z-50`}
  >
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300" />
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-4 cursor-pointer hover:bg-white/20 transition-all duration-300">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {label}
      </div>
    </motion.div>
  </motion.div>
);

// Interactive Hotspot
const InteractiveHotspot = ({ children, onClick, className = "" }: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`cursor-pointer ${className}`}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

// Micro Animation Variants
const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
};

export default function DentistPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVoiceBookingActive, setIsVoiceBookingActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % dentalTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll handler for navigation
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Voice booking simulation
  const toggleVoiceBooking = () => {
    setIsVoiceBookingActive(!isVoiceBookingActive);
    if (!isVoiceBookingActive) {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video/Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=1722&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Modern Dental Office"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-teal-900/20" />
      </div>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBusinessSchema(dentalBusiness, dentalServices, dentalTestimonials))
        }}
      />

      {/* Floating Navigation Orbs */}
      <FloatingNavOrb
        icon={Users}
        label="About Dr. Sterling"
        position="top-1/4 left-8"
        delay={0.5}
        onClick={() => scrollToSection('about')}
      />
      <FloatingNavOrb
        icon={Sparkles}
        label="Our Services"
        position="top-1/3 right-8"
        delay={0.7}
        onClick={() => scrollToSection('services')}
      />
      <FloatingNavOrb
        icon={Heart}
        label="Patient Stories"
        position="top-1/2 left-8"
        delay={0.9}
        onClick={() => scrollToSection('testimonials')}
      />
      <FloatingNavOrb
        icon={Calendar}
        label="Book Appointment"
        position="top-2/3 right-8"
        delay={1.1}
        onClick={() => scrollToSection('booking')}
      />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center">
        <div className="relative px-8 max-w-4xl mx-auto">
          {/* Glassy overlay background */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl -z-10" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center text-white relative z-10 py-12"
          >
          <motion.div
            variants={scaleIn}
            className="mb-8"
          >
            <Badge className="mb-4 bg-teal-500/20 text-teal-100 border-teal-400/30 px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              Top-Rated Dental Practice 2025
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent"
          >
            Radiant Roots
            <span className="block text-teal-400">Dental</span>
          </motion.h1>

          <motion.div
            variants={fadeInUp}
            className="relative mb-8"
          >
            {/* Ground glass style overlay background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl -z-10" />
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto leading-relaxed drop-shadow-lg p-8 relative z-10">
              Advanced dental care where modern technology meets compassionate care.
              Dr. Maya Sterling and our expert team create healthy, beautiful smiles that last a lifetime.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <InteractiveHotspot onClick={() => scrollToSection('booking')}>
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Calendar className="w-5 h-5 mr-2" />
                Book Consultation
              </Button>
            </InteractiveHotspot>

            <InteractiveHotspot onClick={() => scrollToSection('services')}>
              <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/20 hover:border-white px-8 py-4 text-lg rounded-full backdrop-blur-sm">
                Explore Services
              </Button>
            </InteractiveHotspot>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-12 flex justify-center space-x-8 text-sm text-white/90"
          >
            <div className="flex items-center hover:text-teal-300 transition-colors duration-300 cursor-default">
              <Shield className="w-4 h-4 mr-2 text-teal-400" />
              HIPAA Compliant
            </div>
            <div className="flex items-center hover:text-teal-300 transition-colors duration-300 cursor-default">
              <Award className="w-4 h-4 mr-2 text-teal-400" />
              24/7 Emergency Care
            </div>
            <div className="flex items-center hover:text-teal-300 transition-colors duration-300 cursor-default">
              <Heart className="w-4 h-4 mr-2 text-teal-400" />
              Insurance Accepted
            </div>
          </motion.div>
        </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-white/60" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="relative min-h-screen flex items-center py-20">
        <div className="container mx-auto px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-teal-300 mb-8">
                Meet Dr. Maya Sterling
              </h2>
              <motion.div
                variants={fadeInUp}
                className="relative"
              >
                {/* Ground glass style overlay background */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl -z-10" />
                <div className="space-y-6 text-white text-lg leading-relaxed p-8 relative z-10">
                  <p>
                    With over 15 years of experience in advanced dentistry, Dr. Sterling combines
                    cutting-edge technology with a gentle, personalized approach to create exceptional
                    patient experiences.
                  </p>
                  <p>
                    A graduate of the prestigious University Dental School, Dr. Sterling continues
                    to advance her expertise through ongoing education in the latest dental techniques
                    and technologies.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Badge className="bg-teal-500/20 text-teal-100 border-teal-400/30">
                      DMD, University Dental School
                    </Badge>
                    <Badge className="bg-teal-500/20 text-teal-100 border-teal-400/30">
                      Advanced Cosmetic Dentistry Certified
                    </Badge>
                    <Badge className="bg-teal-500/20 text-teal-100 border-teal-400/30">
                      Invisalign Premier Provider
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={scaleIn} className="relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl blur opacity-20" />
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Dr. Maya Sterling"
                  width={600}
                  height={600}
                  className="relative rounded-3xl shadow-2xl"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative min-h-screen flex items-center py-20">
        <div className="container mx-auto px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Comprehensive Dental Care
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-white/90 mb-16 text-center max-w-3xl mx-auto">
              From routine cleanings to advanced cosmetic procedures, we offer complete dental solutions for every smile
            </motion.p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dentalServices.map((service, index) => (
                <motion.div key={service.title} variants={scaleIn}>
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                    <CardContent className="p-8 text-center">
                      <div className="text-4xl mb-4">{service.icon}</div>
                      <h3 className="text-xl font-semibold text-white mb-4">{service.title}</h3>
                      <p className="text-white/90 leading-relaxed">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative min-h-screen flex items-center py-20">
        <div className="container mx-auto px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-16">
              What Our Patients Say
            </motion.h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12"
              >
                <div className="flex justify-center mb-6">
                  {[...Array(dentalTestimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl text-white/95 mb-8 leading-relaxed italic">
                  "{dentalTestimonials[currentTestimonial].review}"
                </blockquote>
                <div className="text-teal-300 font-semibold text-lg">
                  {dentalTestimonials[currentTestimonial].name}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {dentalTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-teal-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Chatbot Section */}
      <section className="relative min-h-screen flex items-center py-20">
        <div className="container mx-auto px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
              24/7 AI Dental Assistant
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-white/90 mb-16 text-center">
              Get instant answers to your dental questions anytime, day or night
            </motion.p>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeInUp}>
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <MessageCircle className="w-8 h-8 text-teal-400 mr-3" />
                      <h3 className="text-2xl font-semibold text-white">Smart Dental Chat</h3>
                    </div>
                    <div className="space-y-4 mb-6">
                      <div className="bg-teal-500/20 border-l-4 border-teal-400 p-4 rounded-r-lg">
                        <p className="text-white">Hi! I'm your AI dental assistant. How can I help you today?</p>
                      </div>
                      <div className="bg-white/10 p-4 rounded-lg ml-8">
                        <p className="text-gray-300">I have a toothache. What should I do?</p>
                      </div>
                      <div className="bg-teal-500/20 border-l-4 border-teal-400 p-4 rounded-r-lg">
                        <p className="text-white">I'm sorry to hear that. While I can provide general guidance, please schedule an appointment for proper diagnosis.</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsChatOpen(true)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <Mic className="w-8 h-8 text-teal-400 mr-3" />
                      <h3 className="text-2xl font-semibold text-white">Voice Appointment Booking</h3>
                    </div>
                    <p className="text-white/90 mb-8 leading-relaxed">
                      HIPAA-compliant voice booking system available 24/7. Simply speak naturally to schedule,
                      reschedule, or cancel appointments with our AI assistant.
                    </p>
                    <Button
                      onClick={toggleVoiceBooking}
                      className={`w-full ${isVoiceBookingActive ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'} text-white`}
                    >
                      {isVoiceBookingActive ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Stop Voice Booking
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5 mr-2" />
                          Start Voice Booking
                        </>
                      )}
                    </Button>
                    {isVoiceBookingActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-4 bg-teal-500/20 rounded-lg border border-teal-400/30"
                      >
                        <div className="flex items-center text-teal-100">
                          <Volume2 className="w-5 h-5 mr-2" />
                          Listening... Say "Book appointment" to begin
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="relative min-h-screen flex items-center py-20">
        <div className="container mx-auto px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
              Schedule Your Visit
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div variants={fadeInUp}>
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold text-white mb-6">Appointment Request</h3>
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input placeholder="First Name" className="bg-white/20 border-white/40 text-white placeholder:text-gray-200 focus:bg-white/30 focus:border-white/60" />
                        <Input placeholder="Last Name" className="bg-white/20 border-white/40 text-white placeholder:text-gray-200 focus:bg-white/30 focus:border-white/60" />
                      </div>
                      <Input type="email" placeholder="Email" className="bg-white/20 border-white/40 text-white placeholder:text-gray-200 focus:bg-white/30 focus:border-white/60" />
                      <Input type="tel" placeholder="Phone" className="bg-white/20 border-white/40 text-white placeholder:text-gray-200 focus:bg-white/30 focus:border-white/60" />
                      <Select
                        label="Preferred Service"
                        options={dentalServices.map(service => ({ value: service.title, label: service.title }))}
                        className="bg-white/20 border-white/40 text-white"
                      />
                      <Textarea placeholder="Tell us about your dental needs..." className="bg-white/20 border-white/40 text-white placeholder:text-gray-200 focus:bg-white/30 focus:border-white/60" />
                      <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                        Request Appointment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-8">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                      <MapPin className="w-6 h-6 mr-3 text-teal-400" />
                      Visit Us
                    </h3>
                    <div className="space-y-4 text-white/90">
                      <p className="flex items-start">
                        <MapPin className="w-5 h-5 mr-3 text-teal-400 mt-1 flex-shrink-0" />
                        {dentalBusiness.address}
                      </p>
                      <p className="flex items-center">
                        <Phone className="w-5 h-5 mr-3 text-teal-400" />
                        {dentalBusiness.phone}
                      </p>
                      <p className="flex items-center">
                        <Mail className="w-5 h-5 mr-3 text-teal-400" />
                        {dentalBusiness.email}
                      </p>
                      <p className="flex items-start">
                        <Clock className="w-5 h-5 mr-3 text-teal-400 mt-1 flex-shrink-0" />
                        {dentalBusiness.hours}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Emergency Care</h3>
                    <p className="text-white/90 mb-4">
                      Dental emergencies don't wait for business hours. We're here when you need us most.
                    </p>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Emergency: (555) 911-DENTAL
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">AI Dental Assistant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-teal-500/20 border-l-4 border-teal-400 p-4 rounded-r-lg">
              <p className="text-white">Hi! I'm your AI dental assistant. How can I help you today?</p>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Type your question..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="bg-white/20 border-white/40 text-white placeholder:text-gray-200 focus:bg-white/30 focus:border-white/60"
              />
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}