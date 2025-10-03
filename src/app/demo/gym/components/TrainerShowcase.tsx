'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGestureNavigation } from '../hooks/useGestureNavigation';

interface Trainer {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  certifications: string[];
  image: string;
  bio: string;
  achievements: string[];
  social: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

const trainers: Trainer[] = [
  {
    id: 'sarah',
    name: 'Sarah Martinez',
    specialty: 'HIIT & Strength Training',
    experience: '8 years',
    certifications: ['NASM-CPT', 'ACSM-EP', 'FMS Level 2'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0',
    bio: 'Sarah is a passionate fitness enthusiast who discovered her love for HIIT training during her own weight loss journey. She specializes in creating high-energy workouts that deliver maximum results in minimum time.',
    achievements: [
      'Helped 500+ clients lose over 10,000 lbs combined',
      'Featured in Fitness Magazine Top 50 Trainers',
      'Certified Olympic Weightlifting Coach',
      'Nutrition Specialist Certification'
    ],
    social: {
      instagram: '@sarahfitcoach',
      twitter: '@sarahmartinez',
      linkedin: 'sarah-martinez-fitness'
    }
  },
  {
    id: 'mike',
    name: 'Mike Chen',
    specialty: 'Powerlifting & Bodybuilding',
    experience: '12 years',
    certifications: ['NSCA-CSCS', 'USA Powerlifting Coach', 'Precision Nutrition'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0',
    bio: 'Mike brings over a decade of experience in strength training and competitive powerlifting. His methodical approach to building muscle and strength has transformed hundreds of athletes and fitness enthusiasts.',
    achievements: [
      'Former competitive powerlifter with 1500+ lb total',
      'Trained 3 national champion athletes',
      'Published author on strength training methodology',
      'Biomechanics specialist'
    ],
    social: {
      instagram: '@mikechenpower',
      twitter: '@mikestrength',
      linkedin: 'mike-chen-strength'
    }
  },
  {
    id: 'emma',
    name: 'Emma Thompson',
    specialty: 'Yoga & Mobility',
    experience: '10 years',
    certifications: ['RYT-500', 'Yoga Medicine Therapist', 'Mobility Specialist'],
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0',
    bio: 'Emma discovered yoga during her recovery from a sports injury and fell in love with its transformative power. She now helps others improve their flexibility, reduce pain, and find inner peace through mindful movement.',
    achievements: [
      'Registered Yoga Teacher with 500-hour certification',
      'Yoga Medicine certified therapeutic specialist',
      'Helped athletes improve performance by 40%',
      'Corporate wellness program director'
    ],
    social: {
      instagram: '@emmayoutransform',
      twitter: '@emmayogini',
      linkedin: 'emma-thompson-yoga'
    }
  }
];

export const TrainerShowcase = () => {
  const [expandedTrainer, setExpandedTrainer] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { ref } = useGestureNavigation({
    onSwipeLeft: () => {
      setCurrentIndex((prev) => (prev + 1) % trainers.length);
      setExpandedTrainer(null);
    },
    onSwipeRight: () => {
      setCurrentIndex((prev) => (prev - 1 + trainers.length) % trainers.length);
      setExpandedTrainer(null);
    },
    onTap: (position) => {
      // Toggle expanded state on tap
      setExpandedTrainer(expandedTrainer === trainers[currentIndex].id ? null : trainers[currentIndex].id);
    }
  });

  const currentTrainer = trainers[currentIndex];

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center overflow-hidden"
    >

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]"
          >
            {/* Left Column - Image & Basic Info */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src={currentTrainer.image}
                  alt={currentTrainer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />

                {/* Floating Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-sm rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">
                        {currentTrainer.name}
                      </h3>
                      <p className="text-orange-400 font-medium">{currentTrainer.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/70">Experience</p>
                      <p className="text-lg font-bold text-green-400">{currentTrainer.experience}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentTrainer.certifications.slice(0, 2).map((cert) => (
                      <span
                        key={cert}
                        className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30"
                      >
                        {cert}
                      </span>
                    ))}
                    {currentTrainer.certifications.length > 2 && (
                      <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                        +{currentTrainer.certifications.length - 2} more
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Expandable Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <motion.button
                onClick={() => setExpandedTrainer(expandedTrainer === currentTrainer.id ? null : currentTrainer.id)}
                className="w-full text-left group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ height: expandedTrainer === currentTrainer.id ? 'auto' : '120px' }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold mb-2">About {currentTrainer.name.split(' ')[0]}</h4>
                      <div className="flex items-center space-x-4 text-sm text-white/70">
                        <span>👋 Tap to {expandedTrainer === currentTrainer.id ? 'collapse' : 'expand'}</span>
                        <span>•</span>
                        <span>Swipe to change trainer</span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedTrainer === currentTrainer.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl"
                    >
                      ⌄
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {expandedTrainer === currentTrainer.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 pt-4 border-t border-white/10"
                      >
                        <p className="text-white/80 leading-relaxed">
                          {currentTrainer.bio}
                        </p>

                        <div>
                          <h5 className="font-semibold mb-3 text-green-400">Key Achievements</h5>
                          <div className="space-y-2">
                            {currentTrainer.achievements.map((achievement, index) => (
                              <motion.div
                                key={achievement}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-center space-x-3"
                              >
                                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                                <span className="text-sm text-white/80">{achievement}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold mb-3 text-blue-400">Connect</h5>
                          <div className="flex space-x-4">
                            {currentTrainer.social.instagram && (
                              <motion.a
                                href={`https://instagram.com/${currentTrainer.social.instagram}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-pink-500/20 text-pink-300 p-2 rounded-full hover:bg-pink-500/30 transition-colors"
                              >
                                📷
                              </motion.a>
                            )}
                            {currentTrainer.social.twitter && (
                              <motion.a
                                href={`https://twitter.com/${currentTrainer.social.twitter}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-blue-500/20 text-blue-300 p-2 rounded-full hover:bg-blue-500/30 transition-colors"
                              >
                                🐦
                              </motion.a>
                            )}
                            {currentTrainer.social.linkedin && (
                              <motion.a
                                href={`https://linkedin.com/in/${currentTrainer.social.linkedin}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-blue-600/20 text-blue-400 p-2 rounded-full hover:bg-blue-600/30 transition-colors"
                              >
                                💼
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>

              {/* Quick Book Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition-colors mb-[30px]"
              >
                Book Session with {currentTrainer.name.split(' ')[0]}
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Trainer Navigation Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3"
        >
          {trainers.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setExpandedTrainer(null);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-orange-400' : 'bg-white/30'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </motion.div>

        {/* Gesture Hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/50 text-sm"
        >
          <div className="flex items-center space-x-6">
            <span>Swipe to change trainer</span>
            <div className="flex space-x-2">
              <div className="w-8 h-6 border border-white/30 rounded flex justify-center items-center">
                <span className="text-xs">←</span>
              </div>
              <div className="w-8 h-6 border border-white/30 rounded flex justify-center items-center">
                <span className="text-xs">→</span>
              </div>
            </div>
            <span>•</span>
            <span>Tap to expand</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};