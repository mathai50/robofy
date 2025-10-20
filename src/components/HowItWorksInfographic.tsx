"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  Users,
  MessageCircle,
  Calendar,
  CheckCircle,
  ArrowRight,
  Play,
  Bot,
  Clock,
  TrendingUp,
  Target,
  Phone,
  Mail,
  Database,
  Zap
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
};

// Step Component
const JourneyStep = ({ step, index, isActive, onHover, onLeave }: {
  step: any,
  index: number,
  isActive: boolean,
  onHover: () => void,
  onLeave: () => void
}) => {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.05, y: -4 }}
      className="relative flex flex-col items-center group cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Step Circle */}
      <motion.div
        animate={{
          scale: isActive ? 1.2 : 1,
          backgroundColor: isActive ? step.activeColor : step.color
        }}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300 ${
          isActive ? 'ring-4 ring-white/30' : ''
        }`}
      >
        <step.icon className="w-8 h-8" />
      </motion.div>

      {/* Step Number */}
      <motion.div
        animate={{
          scale: isActive ? 1.1 : 0.9,
          opacity: isActive ? 1 : 0.7
        }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold"
      >
        {index + 1}
      </motion.div>

      {/* Connection Line */}
      {index < 4 && (
        <motion.div
          animate={{
            height: isActive ? '80px' : '60px',
            opacity: isActive ? 1 : 0.5
          }}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary/50 to-primary/20"
        />
      )}

      {/* Step Content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute top-24 left-1/2 transform -translate-x-1/2 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-4 z-10"
          >
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{step.description}</p>

              {/* Mini Metrics */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <div className="text-lg font-bold text-primary">{step.duration}</div>
                  <div className="text-xs text-gray-600">Duration</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-green-600">{step.success}</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1 justify-center">
                {step.technologies.map((tech: string, techIndex: number) => (
                  <Badge key={techIndex} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Label */}
      <motion.div
        animate={{
          opacity: isActive ? 1 : 0.7,
          y: isActive ? 0 : 5
        }}
        className="mt-4 text-center"
      >
        <h4 className={`font-semibold transition-colors ${
          isActive ? 'text-primary' : 'text-gray-700'
        }`}>
          {step.title}
        </h4>
        <p className="text-sm text-gray-500 mt-1">
          {step.shortDescription}
        </p>
      </motion.div>
    </motion.div>
  );
};

// Main How It Works Component
export default function HowItWorksInfographic() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const journeySteps = [
    {
      title: "Visitor Discovery",
      shortDescription: "Potential customer finds your website",
      description: "A potential customer discovers your AI-powered website through search, social media, or referral and begins exploring your services.",
      duration: "0-30s",
      success: "100%",
      icon: Users,
      color: "bg-blue-500",
      activeColor: "bg-blue-600",
      technologies: ["SEO Optimization", "Social Integration", "Performance Analytics"]
    },
    {
      title: "AI Lead Capture",
      shortDescription: "Intelligent chatbot engages and qualifies",
      description: "Our AI chatbot instantly engages visitors with personalized conversations, asking qualifying questions to identify high-value prospects.",
      duration: "30-90s",
      success: "85%",
      icon: MessageCircle,
      color: "bg-green-500",
      activeColor: "bg-green-600",
      technologies: ["AI Chatbot", "Lead Scoring", "CRM Integration"]
    },
    {
      title: "Smart Scheduling",
      shortDescription: "Voice or chat appointment booking",
      description: "Customers can book appointments through natural voice conversations or chat, with AI matching their needs to your availability.",
      duration: "60-120s",
      success: "70%",
      icon: Calendar,
      color: "bg-purple-500",
      activeColor: "bg-purple-600",
      technologies: ["Voice Recognition", "Smart Calendar", "Conflict Resolution"]
    },
    {
      title: "Automated Confirmation",
      shortDescription: "Multi-channel confirmation system",
      description: "AI sends confirmations via the customer's preferred method (call, text, email) and manages the appointment lifecycle.",
      duration: "Instant",
      success: "95%",
      icon: CheckCircle,
      color: "bg-orange-500",
      activeColor: "bg-orange-600",
      technologies: ["Voice Confirmation", "SMS Integration", "Email Automation"]
    },
    {
      title: "Smart Follow-up",
      shortDescription: "Reminder and no-show recovery",
      description: "AI manages appointment reminders, handles rescheduling, and recovers missed appointments automatically.",
      duration: "Ongoing",
      success: "60%",
      icon: Clock,
      color: "bg-indigo-500",
      activeColor: "bg-indigo-600",
      technologies: ["Smart Reminders", "No-show Recovery", "Personalization"]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">
              <Zap className="w-4 h-4 mr-2" />
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              From Visitor to Customer in 60 Seconds
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how our AI transforms your customer journey with real-world scenarios and proven results
            </p>
          </motion.div>

          {/* Interactive Journey */}
          <motion.div variants={fadeInUp} className="mb-16">
            <div className="flex flex-col items-center justify-center min-h-[600px] relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary rounded-full blur-3xl" />
              </div>

              {/* Journey Steps */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 items-start">
                {journeySteps.map((step, index) => (
                  <JourneyStep
                    key={index}
                    step={step}
                    index={index}
                    isActive={activeStep === index}
                    onHover={() => setActiveStep(index)}
                    onLeave={() => setActiveStep(null)}
                  />
                ))}
              </div>

              {/* Progress Indicator */}
              <motion.div
                variants={fadeInUp}
                className="mt-16 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex gap-2">
                    {journeySteps.map((_, index) => (
                      <motion.div
                        key={index}
                        animate={{
                          scale: activeStep === index ? 1.2 : 1,
                          backgroundColor: activeStep === index ? '#3B82F6' : '#E5E7EB'
                        }}
                        className="w-3 h-3 rounded-full transition-colors duration-300"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-sm">
                  Hover over each step to see detailed information
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Results Summary */}
          <motion.div
            variants={fadeInUp}
            className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-8 border border-green-200 dark:border-green-800"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Proven Results Across Industries
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Real businesses achieving real growth with AI automation
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  metric: "60%",
                  label: "More appointments",
                  description: "Dental practices",
                  icon: TrendingUp,
                  color: "text-green-600"
                },
                {
                  metric: "85%",
                  label: "Trial conversion",
                  description: "Fitness studios",
                  icon: Target,
                  color: "text-blue-600"
                },
                {
                  metric: "300%",
                  label: "Lead increase",
                  description: "Accounting firms",
                  icon: Users,
                  color: "text-purple-600"
                },
                {
                  metric: "24/7",
                  label: "Availability",
                  description: "All businesses",
                  icon: Clock,
                  color: "text-orange-600"
                }
              ].map((result, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20"
                >
                  <result.icon className={`w-8 h-8 mx-auto mb-3 ${result.color}`} />
                  <div className={`text-3xl font-bold ${result.color} mb-2`}>
                    {result.metric}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {result.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {result.description}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Play className="w-5 h-5 mr-2" />
                See Live Demo
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}