"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import {
  MessageCircle,
  Clock,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const fadeInUp = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1 }
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

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 px-6 py-3 bg-primary/10 text-primary text-lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Get In Touch
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Ready to Transform Your Business with{' '}
              <span className="text-primary">AI?</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Let's discuss how our AI solutions can revolutionize your operations and drive unprecedented growth.
              Our team is ready to help you unlock the power of artificial intelligence.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form - Takes up 2/3 of the space */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white font-inter">
                  Send Us a Message
                </h2>

                {/* Contact Form Placeholder - Replace with your preferred form solution */}
                 <div className="min-h-[400px] flex items-center justify-center">
                   <div className="text-center text-gray-600 dark:text-gray-400">
                     <p className="text-lg mb-4">Contact form will be integrated here</p>
                     <p className="text-sm">Choose your preferred form solution (HubSpot, Typeform, etc.)</p>
                   </div>
                 </div>

              </div>
            </motion.div>

            {/* Contact Information - Takes up 1/3 of the space */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Contact Info Cards */}
              <motion.div
                variants={fadeInUp}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-primary" />
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <p className="text-gray-600 dark:text-gray-300">hello@robofy.uk</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Response Time</p>
                      <p className="text-gray-600 dark:text-gray-300">Within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Location</p>
                      <p className="text-gray-600 dark:text-gray-300">Remote-first company</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Why Choose Us */}
              <motion.div
                variants={fadeInUp}
                className="bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  Why Choose Robofy?
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">AI-First Approach</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Cutting-edge technology solutions</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Proven Results</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Track record of successful implementations</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">24/7 Support</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Dedicated support team</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Custom Solutions</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Tailored to your business needs</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                variants={fadeInUp}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Need Immediate Assistance?
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  For urgent inquiries or technical support, our team is available to help you right away.
                </p>

                <div className="space-y-3">
                  <button className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Schedule Emergency Call
                  </button>

                  <button className="w-full border border-primary text-primary py-3 px-6 rounded-lg font-medium hover:bg-primary/10 transition-colors">
                    Request Call Back
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}