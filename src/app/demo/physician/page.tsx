'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inter, Playfair_Display } from 'next/font/google';
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
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter'
});

// Physician Color Palette - Medical inspired with teal accent
const physicianColors = {
  primaryTeal: '#008080',      // Professional medical teal
  lightTeal: '#4FB3B3',       // Softer teal for accents
  warmWhite: '#FEFEFE',       // Clean white
  softGray: '#F8F9FA',        // Subtle background
  charcoal: '#2C3E50',        // Professional dark
  sageGreen: '#7A9E7A'        // Calming accent
};

// Physician business info
const physician = {
  name: 'Dr. Ethan Caldwell',
  credentials: 'MD, Family Medicine',
  tagline: 'Compassionate Care for Every Patient',
  subtitle: 'Comprehensive Healthcare for Families & Individuals',
  phone: '(555) 123-HEALTH',
  email: 'info@caldwellmedicine.com',
  address: '1234 Wellness Boulevard, Suite 200, Health City, HC 12345',
  hours: 'Mon-Thu: 8AM-5PM, Fri: 8AM-3PM, Sat: 9AM-1PM',
  philosophy: 'Every patient deserves personalized, comprehensive care that addresses both their immediate needs and long-term wellness goals.'
};

// Floating navigation orbs for hero section
const heroOrbs = [
  {
    id: 'services',
    title: 'Our Services',
    description: 'Comprehensive medical care',
    position: { x: 15, y: 25 },
    icon: '🏥',
    color: physicianColors.primaryTeal,
    size: 'large'
  },
  {
    id: 'about',
    title: 'About Dr. Caldwell',
    description: 'Meet your physician',
    position: { x: 85, y: 30 },
    icon: '👨‍⚕️',
    color: physicianColors.lightTeal,
    size: 'medium'
  },
  {
    id: 'appointment',
    title: 'Book Appointment',
    description: 'Schedule your visit',
    position: { x: 50, y: 75 },
    icon: '📅',
    color: physicianColors.sageGreen,
    size: 'large'
  },
  {
    id: 'conditions',
    title: 'Conditions We Treat',
    description: 'Common health concerns',
    position: { x: 25, y: 60 },
    icon: '💊',
    color: physicianColors.primaryTeal,
    size: 'small'
  },
  {
    id: 'contact',
    title: 'Contact & Location',
    description: 'Get in touch',
    position: { x: 75, y: 60 },
    icon: '📍',
    color: physicianColors.lightTeal,
    size: 'small'
  }
];

// Animation variants for micro-animations
const orbVariants = {
  hidden: { scale: 0, opacity: 0, rotate: -180 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.6 }
  },
  hover: {
    scale: 1.1,
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.95 }
};

const overlayVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.3 }
  }
};

// Floating orb component
const FloatingOrb = ({ orb, onClick, isVisible }: {
  orb: typeof heroOrbs[0];
  onClick: () => void;
  isVisible: boolean;
}) => (
  <motion.button
    className="absolute z-30 group"
    style={{
      left: `${orb.position.x}%`,
      top: `${orb.position.y}%`,
    }}
    variants={orbVariants}
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    whileHover="hover"
    whileTap="tap"
    onClick={onClick}
  >
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90 ${
        orb.size === 'large' ? 'w-20 h-20' :
        orb.size === 'medium' ? 'w-16 h-16' : 'w-12 h-12'
      }`}
      style={{ backgroundColor: orb.color }}
    >
      <span className={`${orb.size === 'large' ? 'text-3xl' : orb.size === 'medium' ? 'text-2xl' : 'text-xl'}`}>
        {orb.icon}
      </span>
    </div>
    <motion.div
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none backdrop-blur-sm"
      initial={{ opacity: 0, y: -10, scale: 0.8 }}
      whileHover={{ opacity: 1, y: 0, scale: 1 }}
    >
      <div className="font-medium">{orb.title}</div>
      <div className="text-xs opacity-80">{orb.description}</div>
    </motion.div>
  </motion.button>
);

// Services overlay
const ServicesOverlay = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
    variants={overlayVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-3xl p-8 max-w-5xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
      onClick={(e) => e.stopPropagation()}
      variants={overlayVariants}
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 font-[family-name:var(--font-playfair)] mb-2">
            Comprehensive Medical Services
          </h2>
          <p className="text-lg text-gray-600">Complete healthcare for patients of all ages</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-3xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: '👶',
            title: 'Pediatric Care',
            description: 'Comprehensive healthcare for children from infancy through adolescence',
            services: ['Well-child visits', 'Vaccinations', 'Growth monitoring', 'Developmental screenings']
          },
          {
            icon: '🏥',
            title: 'General Medicine',
            description: 'Primary care for acute and chronic conditions',
            services: ['Annual physicals', 'Sick visits', 'Chronic disease management', 'Health screenings']
          },
          {
            icon: '👩',
            title: 'Women\'s Health',
            description: 'Specialized care for women\'s unique health needs',
            services: ['Annual gynecological exams', 'Family planning', 'Menopause management', 'Osteoporosis screening']
          },
          {
            icon: '💊',
            title: 'Chronic Disease Management',
            description: 'Ongoing care for diabetes, hypertension, and other chronic conditions',
            services: ['Diabetes care', 'Blood pressure management', 'Medication management', 'Lifestyle counseling']
          },
          {
            icon: '🏃‍♂️',
            title: 'Preventive Care',
            description: 'Proactive health maintenance and disease prevention',
            services: ['Health risk assessments', 'Cancer screenings', 'Immunizations', 'Wellness counseling']
          },
          {
            icon: '📱',
            title: 'Telemedicine',
            description: 'Convenient virtual consultations for follow-ups and minor concerns',
            services: ['Video consultations', 'Remote monitoring', 'Prescription management', 'After-hours support']
          }
        ].map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-16 h-16 bg-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-2xl">{service.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">{service.description}</p>
            <ul className="text-gray-600 text-sm space-y-1">
              {service.services.map((item, i) => (
                <li key={i} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-2 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

// About physician overlay
const AboutOverlay = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
    variants={overlayVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
      onClick={(e) => e.stopPropagation()}
      variants={overlayVariants}
    >
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-4xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
          Meet Dr. Ethan Caldwell
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-3xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="w-full h-80 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl flex items-center justify-center shadow-inner">
            <span className="text-8xl">👨‍⚕️</span>
          </div>

          <div className="bg-teal-50 p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Credentials & Experience</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-teal-200">
                <span className="font-medium text-gray-700">Medical Degree</span>
                <span className="text-teal-600">Johns Hopkins University</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-teal-200">
                <span className="font-medium text-gray-700">Residency</span>
                <span className="text-teal-600">Family Medicine - Mayo Clinic</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-teal-200">
                <span className="font-medium text-gray-700">Years of Practice</span>
                <span className="text-teal-600">15+ Years</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-medium text-gray-700">Board Certified</span>
                <span className="text-teal-600">American Board of Family Medicine</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">About Dr. Caldwell</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              {physician.philosophy}
            </p>
            <p className="text-gray-700 leading-relaxed">
              Dr. Caldwell believes in building lasting relationships with patients and their families,
              taking time to understand each individual's unique health journey and goals. His approach
              combines evidence-based medicine with compassionate, personalized care.
            </p>
          </div>

          <div className="bg-sage-50 p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Areas of Expertise</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Preventive Medicine',
                'Chronic Disease Management',
                'Pediatric Care',
                'Women\'s Health',
                'Geriatric Medicine',
                'Sports Medicine',
                'Mental Health',
                'Nutritional Counseling'
              ].map((expertise, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-sage-400 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm">{expertise}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-teal-50 p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Patient Philosophy</h3>
            <blockquote className="text-gray-700 italic leading-relaxed">
              "Medicine is not just about treating illness—it's about partnering with patients to achieve
              optimal health and wellness. Every person deserves to be heard, understood, and actively
              involved in their healthcare decisions."
            </blockquote>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Appointment booking overlay
const AppointmentOverlay = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
    variants={overlayVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
      onClick={(e) => e.stopPropagation()}
      variants={overlayVariants}
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 font-[family-name:var(--font-playfair)] mb-2">
            Schedule Appointment
          </h2>
          <p className="text-lg text-gray-600">Book your visit with Dr. Caldwell</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-3xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
        >
          ×
        </button>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Patient Information</label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 opacity-0">Date of Birth</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Contact Details</label>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 opacity-0">Phone</label>
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Appointment Details</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200">
              <option>Annual Physical</option>
              <option>Sick Visit</option>
              <option>Follow-up Visit</option>
              <option>Chronic Disease Management</option>
              <option>Wellness Consultation</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 opacity-0">Type</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200">
              <option>In-Person Visit</option>
              <option>Telemedicine</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 opacity-0">Time</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200">
              <option>Morning (8:00 AM - 12:00 PM)</option>
              <option>Afternoon (1:00 PM - 5:00 PM)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Reason for Visit / Concerns</label>
          <textarea
            rows={4}
            placeholder="Please describe your symptoms or reason for the visit..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        <motion.button
          type="submit"
          className="w-full bg-teal-600 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Request Appointment
        </motion.button>
      </form>
    </motion.div>
  </motion.div>
);

// Conditions treated overlay
const ConditionsOverlay = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
    variants={overlayVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-3xl p-8 max-w-5xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
      onClick={(e) => e.stopPropagation()}
      variants={overlayVariants}
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 font-[family-name:var(--font-playfair)] mb-2">
            Conditions We Treat
          </h2>
          <p className="text-lg text-gray-600">Comprehensive care for common and complex health concerns</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-3xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            category: 'Acute Conditions',
            conditions: ['Cold & Flu', 'Bronchitis', 'Pneumonia', 'Urinary Tract Infections', 'Skin Infections', 'Minor Injuries'],
            icon: '🤒',
            color: 'red'
          },
          {
            category: 'Chronic Diseases',
            conditions: ['Diabetes', 'Hypertension', 'High Cholesterol', 'Asthma', 'COPD', 'Arthritis'],
            icon: '📊',
            color: 'blue'
          },
          {
            category: 'Mental Health',
            conditions: ['Depression', 'Anxiety', 'Stress Management', 'Insomnia', 'ADHD', 'PTSD Support'],
            icon: '🧠',
            color: 'purple'
          },
          {
            category: 'Women\'s Health',
            conditions: ['Menstrual Disorders', 'Menopause Symptoms', 'Osteoporosis', 'Thyroid Disorders', 'Anemia', 'Urinary Incontinence'],
            icon: '👩‍⚕️',
            color: 'pink'
          },
          {
            category: 'Pediatric Care',
            conditions: ['Childhood Illnesses', 'Growth Concerns', 'Developmental Issues', 'Vaccinations', 'School Physicals', 'Behavioral Health'],
            icon: '👶',
            color: 'green'
          },
          {
            category: 'Preventive Care',
            conditions: ['Annual Physicals', 'Cancer Screenings', 'Immunizations', 'Wellness Exams', 'Health Risk Assessments', 'Lifestyle Counseling'],
            icon: '🛡️',
            color: 'teal'
          }
        ].map((category, index) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`bg-gradient-to-br from-${category.color}-50 to-${category.color}-100 p-6 rounded-2xl border border-${category.color}-200`}
          >
            <div className={`w-16 h-16 bg-${category.color}-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg`}>
              <span className="text-2xl">{category.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h3>
            <ul className="space-y-2">
              {category.conditions.map((condition, i) => (
                <li key={i} className="flex items-start">
                  <span className={`w-2 h-2 bg-${category.color}-400 rounded-full mr-3 mt-2 flex-shrink-0`}></span>
                  <span className="text-gray-700 text-sm">{condition}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

// Contact overlay
const ContactOverlay = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
    variants={overlayVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
      onClick={(e) => e.stopPropagation()}
      variants={overlayVariants}
    >
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-4xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
          Contact Caldwell Medicine
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-3xl w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-teal-50 p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">📍 Visit Our Office</h3>
            <p className="text-gray-700 mb-2">{physician.address}</p>
            <p className="text-gray-700 mb-4">📞 {physician.phone}</p>
            <p className="text-gray-700 mb-4">✉️ {physician.email}</p>
            <button className="w-full bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition-all duration-200 shadow-lg">
              Get Directions
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🕒 Office Hours</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Monday - Thursday</span>
                <span className="font-semibold text-teal-600">8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Friday</span>
                <span className="font-semibold text-teal-600">8:00 AM - 3:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Saturday</span>
                <span className="font-semibold text-teal-600">9:00 AM - 1:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Sunday</span>
                <span className="font-semibold text-red-600">Closed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-sage-50 p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">📞 Quick Contact</h3>
            <div className="space-y-4">
              <button className="w-full bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition-all duration-200 shadow-lg flex items-center justify-center">
                <span className="mr-2">📞</span>
                Call Our Office
              </button>
              <button className="w-full bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg flex items-center justify-center">
                <span className="mr-2">💬</span>
                Send Secure Message
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🚨 After Hours Care</h3>
            <p className="text-gray-700 mb-4">
              For urgent medical concerns outside office hours, please contact:
            </p>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="font-semibold text-red-800">Emergency Services: 911</p>
              <p className="text-red-700 text-sm">For life-threatening emergencies</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-3">
              <p className="font-semibold text-yellow-800">After-Hours Nurse Line</p>
              <p className="text-yellow-700 text-sm">(555) 123-HEALTH (Option 2)</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Main component
export default function PhysicianLandingPage() {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [orbsVisible, setOrbsVisible] = useState(false);
  const [showRobofyCTA, setShowRobofyCTA] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate orbs entrance with staggered timing
    const timer = setTimeout(() => {
      setOrbsVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleOrbClick = (orbId: string) => {
    setActiveOverlay(orbId);
  };

  const handleOverlayClose = () => {
    setActiveOverlay(null);
  };

  // JSON-LD Schema for SEO
  const generatePhysicianSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Physician",
      "name": physician.name,
      "medicalSpecialty": "Family Medicine",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1234 Wellness Boulevard, Suite 200",
        "addressLocality": "Health City",
        "addressRegion": "HC",
        "postalCode": "12345"
      },
      "telephone": physician.phone,
      "email": physician.email,
      "openingHours": "Mo-Th 08:00-17:00, Fr 08:00-15:00, Sa 09:00-13:00",
      "availableService": [
        "General Medicine",
        "Chronic Disease Management",
        "Preventive Care",
        "Pediatric Care",
        "Women's Health",
        "Telemedicine"
      ],
      "credential": physician.credentials,
      "description": physician.philosophy
    };
  };

  const schema = generatePhysicianSchema();

  return (
    <div className={`${playfair.variable} ${inter.variable}`} style={{
      '--physician-teal': physicianColors.primaryTeal,
      '--light-teal': physicianColors.lightTeal,
      '--warm-white': physicianColors.warmWhite,
      '--soft-gray': physicianColors.softGray,
      '--charcoal': physicianColors.charcoal,
      '--sage-green': physicianColors.sageGreen
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
            src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Modern medical office with professional healthcare environment"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/40" />
        </div>

        {/* Floating Navigation Orbs */}
        {heroOrbs.map((orb, index) => (
          <FloatingOrb
            key={orb.id}
            orb={orb}
            onClick={() => handleOrbClick(orb.id)}
            isVisible={orbsVisible}
          />
        ))}

        {/* Main Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-6">
                <span className="text-teal-300 font-medium">✨ Now Accepting New Patients</span>
              </div>
            </motion.div>

            <motion.h1
              className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Dr. Ethan Caldwell
            </motion.h1>

            <motion.p
              className="text-2xl md:text-3xl lg:text-4xl mb-4 font-light opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {physician.credentials}
            </motion.p>

            <motion.p
              className="text-xl md:text-2xl mb-8 opacity-80 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {physician.tagline}
            </motion.p>

            <motion.p
              className="text-lg md:text-xl mb-12 opacity-70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {physician.subtitle}
            </motion.p>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center space-y-3">
            <span className="text-sm font-light">Explore Services</span>
            <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent"></div>
            <motion.div
              className="w-2 h-2 bg-white/60 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Services Section - Asymmetrical Layout */}
      <section className="relative min-h-screen bg-gradient-to-br from-soft-gray via-white to-teal-50 flex items-center py-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-16"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-bold text-charcoal mb-6 leading-tight">
              Comprehensive Healthcare
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              From preventive care to chronic disease management, we provide personalized medical services
              for patients of all ages with compassion and expertise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  icon: '👶',
                  title: 'Family Medicine',
                  description: 'Complete healthcare for patients of all ages, from newborns to seniors.',
                  features: ['Pediatric care', 'Adult medicine', 'Geriatric care', 'Preventive health']
                },
                {
                  icon: '💊',
                  title: 'Chronic Disease Management',
                  description: 'Expert management of diabetes, hypertension, asthma, and other chronic conditions.',
                  features: ['Personalized treatment plans', 'Regular monitoring', 'Lifestyle counseling', 'Medication management']
                }
              ].map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 10 }}
                  className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-20 h-20 bg-teal-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-charcoal mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-teal-400 rounded-full mr-3"></span>
                        <span className="text-gray-700 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl p-12 shadow-2xl">
                <div className="w-full h-80 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-2xl flex items-center justify-center mb-8">
                  <span className="text-9xl">🏥</span>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-charcoal mb-4">State-of-the-Art Facility</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Modern medical equipment and comfortable environment designed for optimal patient care and comfort.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Patient Testimonials - Asymmetrical Cards */}
      <section className="relative min-h-screen bg-white flex items-center py-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-bold text-charcoal mb-6">
              Patient Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from patients who trust Dr. Caldwell with their healthcare
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Martinez',
                condition: 'Diabetes Management',
                rating: 5,
                text: 'Dr. Caldwell has been instrumental in managing my diabetes. His personalized approach and genuine care have made all the difference in my health journey.',
                avatar: '👩‍💼',
                bgColor: 'teal'
              },
              {
                name: 'Robert Chen',
                condition: 'Family Medicine',
                rating: 5,
                text: 'As a father of three, I appreciate how Dr. Caldwell takes time to know each family member. He\'s knowledgeable, patient, and truly cares about our well-being.',
                avatar: '👨‍👩‍👧‍👦',
                bgColor: 'sage'
              },
              {
                name: 'Margaret Thompson',
                condition: 'Preventive Care',
                rating: 5,
                text: 'Dr. Caldwell caught a potential health issue early through routine screening. His proactive approach to preventive care is exceptional.',
                avatar: '👵',
                bgColor: 'blue'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, rotate: 1 }}
                className={`bg-gradient-to-br from-${testimonial.bgColor}-50 to-${testimonial.bgColor}-100 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-${testimonial.bgColor}-200 relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>

                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-${testimonial.bgColor}-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg`}>
                      <span className="text-2xl">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal text-lg">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">{testimonial.condition}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>

                  <div className="flex text-yellow-400 mb-4">
                    {'⭐'.repeat(testimonial.rating)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Tips Section - Magazine Style Layout */}
      <section className="relative min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center py-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-bold text-charcoal mb-6">
              Health & Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl">
              Expert advice and tips for maintaining optimal health and preventing illness
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {[
                {
                  title: 'Managing Diabetes: A Comprehensive Guide',
                  excerpt: 'Understanding blood sugar management, medication adherence, and lifestyle modifications for optimal diabetes control...',
                  category: 'Chronic Disease',
                  readTime: '8 min read',
                  icon: '💉',
                  color: 'teal'
                },
                {
                  title: 'The Importance of Annual Physical Exams',
                  excerpt: 'Why regular check-ups are crucial for early detection and prevention of health issues...',
                  category: 'Preventive Care',
                  readTime: '6 min read',
                  icon: '🏥',
                  color: 'sage'
                }
              ].map((article, index) => (
                <motion.div
                  key={article.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 10 }}
                  className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-6">
                    <div className={`w-20 h-20 bg-${article.color}-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <span className="text-3xl">{article.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className={`inline-block bg-${article.color}-100 text-${article.color}-800 px-4 py-2 rounded-full text-sm font-medium mb-4`}>
                        {article.category}
                      </div>
                      <h3 className="text-2xl font-bold text-charcoal mb-3 leading-tight">{article.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">{article.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">{article.readTime}</span>
                        <span className="text-teal-600 hover:text-teal-700 font-medium cursor-pointer">Read Article →</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <h3 className="text-xl font-bold text-charcoal mb-4">Quick Health Tips</h3>
                <div className="space-y-4">
                  {[
                    { tip: 'Stay hydrated with at least 8 glasses of water daily', icon: '💧' },
                    { tip: 'Aim for 30 minutes of moderate exercise most days', icon: '🏃‍♀️' },
                    { tip: 'Get 7-9 hours of quality sleep each night', icon: '😴' },
                    { tip: 'Schedule annual physical exams and screenings', icon: '📅' }
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                      <p className="text-gray-600 text-sm leading-relaxed">{tip.tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-teal-600 text-white p-6 rounded-3xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Emergency?</h3>
                <p className="mb-4 opacity-90">For life-threatening emergencies, call 911 immediately.</p>
                <button className="w-full bg-white text-teal-600 px-4 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-200">
                  After-Hours Nurse Line
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section - Minimalist Design */}
      <section className="relative min-h-screen bg-gradient-to-br from-charcoal via-gray-900 to-teal-900 text-white flex items-center">
        <div className="max-w-5xl mx-auto px-4 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-bold mb-8">
              Ready to Prioritize Your Health?
            </h2>
            <p className="text-xl opacity-80 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join thousands of patients who trust Dr. Caldwell with their healthcare needs.
              Schedule your appointment today and experience compassionate, comprehensive medical care.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/15 transition-all duration-300"
              >
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-bold mb-3">Call Us</h3>
                <p className="opacity-80">{physician.phone}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/15 transition-all duration-300"
              >
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-bold mb-3">Visit Us</h3>
                <p className="opacity-80">{physician.address}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/15 transition-all duration-300"
              >
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-bold mb-3">Hours</h3>
                <p className="opacity-80">{physician.hours}</p>
              </motion.div>
            </div>

            <motion.button
              className="bg-teal-600 text-white px-10 py-5 text-xl font-semibold rounded-3xl hover:bg-teal-500 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOrbClick('appointment')}
            >
              Schedule Your Appointment
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Overlay Modals */}
      <AnimatePresence>
        {activeOverlay === 'services' && (
          <ServicesOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'about' && (
          <AboutOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'appointment' && (
          <AppointmentOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'conditions' && (
          <ConditionsOverlay onClose={handleOverlayClose} />
        )}
        {activeOverlay === 'contact' && (
          <ContactOverlay onClose={handleOverlayClose} />
        )}
      </AnimatePresence>

      {/* Robofy CTA Components */}
      <FloatingCTAButton
        onClick={() => setShowRobofyCTA(true)}
        primaryColor={physicianColors.primaryTeal}
      />
      <RobofyCTA
        isVisible={showRobofyCTA}
        onClose={() => setShowRobofyCTA(false)}
        businessType="Healthcare"
        primaryColor={physicianColors.primaryTeal}
        secondaryColor={physicianColors.lightTeal}
      />
    </div>
  );
}