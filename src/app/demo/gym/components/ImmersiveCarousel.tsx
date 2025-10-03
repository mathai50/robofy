'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGestureNavigation, useSectionNavigation } from '../hooks/useGestureNavigation';
import { microAnimations } from '../animations/microAnimations';

interface Program {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  intensity: 'Low' | 'Medium' | 'High';
  image: string;
  benefits: string[];
  features: string[];
}

const programs: Program[] = [
  {
    id: 'hiit',
    title: 'HIIT Revolution',
    subtitle: 'High-Intensity Interval Training',
    description: 'Maximize fat burn and boost metabolism with our signature high-intensity workouts designed for rapid results.',
    duration: '45 min',
    intensity: 'High',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0',
    benefits: ['Rapid fat loss', 'Increased metabolism', 'Improved cardiovascular health', 'Enhanced endurance'],
    features: ['Personal trainer guidance', 'Progress tracking', 'Nutrition consultation', 'Flexible scheduling']
  },
  {
    id: 'strength',
    title: 'Strength Training',
    subtitle: 'Build Power & Muscle',
    description: 'Progressive strength training programs to build muscle, increase power, and transform your physique.',
    duration: '60 min',
    intensity: 'Medium',
    image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0',
    benefits: ['Muscle growth', 'Increased strength', 'Better bone density', 'Improved posture'],
    features: ['Customized workout plans', 'Form correction', 'Equipment orientation', 'Goal setting']
  },
  {
    id: 'yoga',
    title: 'Yoga & Flexibility',
    subtitle: 'Mind-Body Connection',
    description: 'Improve flexibility, balance, and mental clarity with our comprehensive yoga and mobility programs.',
    duration: '75 min',
    intensity: 'Low',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0',
    benefits: ['Enhanced flexibility', 'Stress reduction', 'Better balance', 'Improved focus'],
    features: ['Various yoga styles', 'Meditation sessions', 'Breathing techniques', 'Progression paths']
  },
  {
    id: 'personal',
    title: 'Personal Training',
    subtitle: 'One-on-One Coaching',
    description: 'Achieve your goals faster with personalized training programs tailored to your specific needs and objectives.',
    duration: '60 min',
    intensity: 'Medium',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0',
    benefits: ['Personalized attention', 'Faster results', 'Accountability', 'Expert guidance'],
    features: ['Individual assessment', 'Custom program design', 'Regular progress reviews', 'Lifestyle coaching']
  }
];

const intensityColors = {
  Low: 'bg-green-500',
  Medium: 'bg-yellow-500',
  High: 'bg-red-500'
};

export const ImmersiveCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { goToNext, goToPrevious } = useSectionNavigation(programs.length);

  const { ref } = useGestureNavigation({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    onTap: () => {
      // Handle tap to pause/play or other interactions
    }
  });

  const currentProgram = programs[currentIndex];

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % programs.length;
    setCurrentIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + programs.length) % programs.length;
    setCurrentIndex(prevIndex);
  };

  const goToProgram = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={currentProgram.image}
            alt={currentProgram.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Navigation Arrows */}
      <motion.button
        className="absolute left-6 top-2/3 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={handlePrevious}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <motion.button
        className="absolute right-6 top-2/3 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300"
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={handleNext}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Intensity Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="inline-flex items-center space-x-3 mb-8"
            >
              <span className={`px-4 py-2 rounded-full text-sm font-medium text-white ${intensityColors[currentProgram.intensity]}`}>
                {currentProgram.intensity} Intensity
              </span>
              <span className="text-white/80">•</span>
              <span className="text-white/80 text-lg">{currentProgram.duration}</span>
            </motion.div>

            {/* Title */}
            <div className="space-y-6 mb-8">
              <motion.h2
                {...microAnimations.fadeInUp}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-playfair)] leading-tight"
              >
                {currentProgram.title}
              </motion.h2>

              <motion.h3
                {...microAnimations.fadeInUp}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl lg:text-3xl font-light opacity-90"
              >
                {currentProgram.subtitle}
              </motion.h3>
            </div>

            {/* Description */}
            <motion.p
              {...microAnimations.fadeInUp}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90 mb-10"
            >
              {currentProgram.description}
            </motion.p>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
            >
              {currentProgram.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  {...microAnimations.staggerItem}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors duration-300"
                >
                  <span className="text-sm font-medium leading-relaxed">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-[30px]"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 text-lg font-semibold rounded-full shadow-lg transition-colors"
              >
                Start Program
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="border-2 border-white/50 text-white hover:bg-white/10 px-10 py-5 text-lg font-semibold rounded-full backdrop-blur-sm transition-colors"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <motion.div
          className="h-1 bg-orange-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentIndex + 1) / programs.length }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: 'left' }}
        />
      </div>

      {/* Program Indicators and Gesture Hint */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 space-y-6">
        {/* Program Indicators */}
        <div className="flex space-x-4">
          {programs.map((_, index) => (
            <motion.button
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => goToProgram(index)}
            />
          ))}
        </div>

        {/* Gesture Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="text-white/60 text-sm"
        >
          <div className="flex items-center space-x-4">
            <span>Swipe or use arrows to navigate</span>
            <div className="flex space-x-3">
              <div className="w-10 h-8 border-2 border-white/50 rounded flex justify-center items-center">
                <span className="text-sm">←</span>
              </div>
              <div className="w-10 h-8 border-2 border-white/50 rounded flex justify-center items-center">
                <span className="text-sm">→</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};