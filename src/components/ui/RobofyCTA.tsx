'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RobofyCTAProps {
  isVisible?: boolean;
  onClose?: () => void;
  businessType?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

// Floating AI particles component
const AIFloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    rotation: number;
  }>>([]);

  useEffect(() => {
    const initParticles = [];
    for (let i = 0; i < 15; i++) {
      initParticles.push({
        id: i,
        x: Math.random() * 400 - 200,
        y: Math.random() * 300 - 150,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.2,
        rotation: Math.random() * Math.PI * 2,
      });
    }
    setParticles(initParticles);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          rotation: particle.rotation + 0.01,
          vx: particle.x > 200 || particle.x < -200 ? -particle.vx : particle.vx,
          vy: particle.y > 150 || particle.y < -150 ? -particle.vy : particle.vy,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            rotate: particle.rotation,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 0.1 },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div
            className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
            style={{
              opacity: particle.opacity,
              boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Animated AI brain icon
const AIBrainIcon = () => (
  <motion.div
    className="relative w-16 h-16 mx-auto mb-6"
    animate={{
      scale: [1, 1.1, 1],
      rotate: [0, 2, -2, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
      <motion.span
        className="text-2xl"
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🤖
      </motion.span>
    </div>
    {/* Neural network lines */}
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.3) 2px, transparent 2px)',
          'radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.3) 2px, transparent 2px)',
          'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.3) 2px, transparent 2px)',
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </motion.div>
);

// Pulsing glow effect
const PulsingGlow = ({ color = '#3B82F6' }: { color?: string }) => (
  <motion.div
    className="absolute inset-0 rounded-2xl"
    style={{
      background: `radial-gradient(circle, ${color}20, transparent 70%)`,
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.1, 0.3],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export const RobofyCTA: React.FC<RobofyCTAProps> = ({
  isVisible = true,
  onClose,
  businessType = "Business",
  primaryColor = "#3B82F6",
  secondaryColor = "#8B5CF6"
}) => {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessType: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setFormStep(3); // Success step
  };

  const resetForm = () => {
    setFormStep(1);
    setFormData({ name: '', email: '', businessType: '', phone: '', message: '' });
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors shadow-lg"
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>

          {/* AI Particles Background */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <AIFloatingParticles />
          </div>

          <div className="relative p-8">
            {/* Header Section */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AIBrainIcon />

              <motion.h2
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Ready to Elevate Your {businessType} with AI?
              </motion.h2>

              <motion.p
                className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Connect with Robofy to get a custom website packed with the latest AI features—fast, intuitive, and perfectly tailored for your needs.
              </motion.p>
            </motion.div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step <= formStep ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                    animate={{ scale: step === formStep ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step < formStep ? '✓' : step}
                  </motion.div>
                  {step < 3 && (
                    <motion.div
                      className={`flex-1 h-1 mx-2 rounded ${
                        step < formStep ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: step < formStep ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Form Steps */}
            <AnimatePresence mode="wait">
              {formStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Your Business</h3>
                    <p className="text-gray-600">Help us understand your needs so we can create the perfect AI solution</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                      <motion.input
                        type="text"
                        placeholder="Your Full Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <div className="relative">
                      <motion.input
                        type="email"
                        placeholder="Business Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                      <motion.select
                        value={formData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors appearance-none"
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <option value="">Business Type</option>
                        <option value="gym">Gym & Fitness</option>
                        <option value="cleaning">Cleaning Service</option>
                        <option value="salon">Beauty Salon</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="retail">Retail Store</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="other">Other</option>
                      </motion.select>
                    </div>
                    <div className="relative">
                      <motion.input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setFormStep(2)}
                    disabled={!formData.name || !formData.email || !formData.businessType}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{
                      scale: (!formData.name || !formData.email || !formData.businessType) ? 1 : 1.02,
                      boxShadow: (!formData.name || !formData.email || !formData.businessType) ? 'none' : '0 20px 40px rgba(59, 130, 246, 0.4)'
                    }}
                    whileTap={{
                      scale: (!formData.name || !formData.email || !formData.businessType) ? 1 : 0.98
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <PulsingGlow color={primaryColor} />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Continue to Next Step
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                  </motion.button>
                </motion.div>
              )}

              {formStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Tell Us More</h3>
                    <p className="text-gray-600">What specific challenges are you facing with your current setup?</p>
                  </div>

                  <motion.textarea
                    placeholder="Describe your current challenges, goals, and what you'd like to achieve with AI-powered solutions..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors resize-none"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />

                  <div className="flex gap-4">
                    <motion.button
                      onClick={() => setFormStep(1)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ← Back
                    </motion.button>
                    <motion.button
                      onClick={handleSubmit}
                      disabled={!formData.message.trim() || isSubmitting}
                      className="flex-1 relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{
                        scale: (!formData.message.trim() || isSubmitting) ? 1 : 1.02,
                        boxShadow: (!formData.message.trim() || isSubmitting) ? 'none' : '0 20px 40px rgba(59, 130, 246, 0.4)'
                      }}
                      whileTap={{
                        scale: (!formData.message.trim() || isSubmitting) ? 1 : 0.98
                      }}
                    >
                      <PulsingGlow color={primaryColor} />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <motion.div
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Processing...
                          </>
                        ) : (
                          <>
                            Get My AI Solution
                            <motion.span
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5 }}
                            >
                              ✨
                            </motion.span>
                          </>
                        )}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {formStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-8"
                >
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-4xl mx-auto"
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut"
                    }}
                  >
                    ✅
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-600 mb-4">
                      We've received your information and our AI specialists will contact you within 24 hours.
                    </p>
                    <p className="text-sm text-gray-500">
                      In the meantime, feel free to explore more AI demos or contact us directly.
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <motion.button
                      onClick={resetForm}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Send Another Request
                    </motion.button>
                    <motion.button
                      onClick={onClose}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explore More Demos
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <motion.div
              className="mt-8 pt-6 border-t border-gray-200 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-gray-500 mb-2">
                ✅ No setup costs • ✅ Cancel anytime • ✅ 30-day money-back guarantee
              </p>
              <p className="text-xs text-gray-400">
                By submitting this form, you agree to receive communications from Robofy about AI solutions for your business.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Floating CTA Button Component (for triggering the modal)
export const FloatingCTAButton: React.FC<{
  onClick: () => void;
  className?: string;
  primaryColor?: string;
}> = ({
  onClick,
  className = "",
  primaryColor = "#3B82F6"
}) => (
  <motion.button
    onClick={onClick}
    className={`fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl font-semibold ${className}`}
    whileHover={{
      scale: 1.05,
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)'
    }}
    whileTap={{ scale: 0.95 }}
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      scale: { duration: 0.2 }
    }}
  >
    <span className="flex items-center gap-2">
      <motion.span
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🤖
      </motion.span>
      Get AI Solution
    </span>
  </motion.button>
);

export default RobofyCTA;