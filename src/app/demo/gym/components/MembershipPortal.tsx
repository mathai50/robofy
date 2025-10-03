'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGestureNavigation } from '../hooks/useGestureNavigation';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  popular?: boolean;
  features: string[];
  limitations?: string[];
  color: string;
}

const membershipPlans: MembershipPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    duration: 'per month',
    features: [
      'Unlimited gym access',
      'Locker room access',
      'Basic group classes',
      'Fitness assessment'
    ],
    limitations: [
      'No personal training',
      'Limited class availability',
      'Peak hours restrictions'
    ],
    color: 'bg-blue-600'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    originalPrice: 99,
    duration: 'per month',
    popular: true,
    features: [
      'Unlimited gym access',
      'All group classes',
      '2 personal training sessions/month',
      'Nutrition consultation',
      'Priority booking',
      'Sauna & spa access',
      'Guest passes (2/month)'
    ],
    color: 'bg-orange-600'
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 129,
    duration: 'per month',
    features: [
      'Unlimited gym access',
      'All group classes',
      'Unlimited personal training',
      'Private nutrition coaching',
      'Priority booking',
      'Sauna & spa access',
      'Unlimited guest passes',
      'Exclusive elite classes',
      'Recovery treatments',
      'Custom workout plans'
    ],
    color: 'bg-purple-600'
  }
];

export const MembershipPortal = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showCalculator, setShowCalculator] = useState(false);

  const { ref } = useGestureNavigation({
    onSwipeLeft: () => {
      const currentIndex = membershipPlans.findIndex(plan => plan.id === selectedPlan);
      const nextIndex = (currentIndex + 1) % membershipPlans.length;
      setSelectedPlan(membershipPlans[nextIndex].id);
    },
    onSwipeRight: () => {
      const currentIndex = membershipPlans.findIndex(plan => plan.id === selectedPlan);
      const prevIndex = (currentIndex - 1 + membershipPlans.length) % membershipPlans.length;
      setSelectedPlan(membershipPlans[prevIndex].id);
    },
    onTap: () => {
      setShowCalculator(!showCalculator);
    }
  });

  const currentPlan = membershipPlans.find(plan => plan.id === selectedPlan)!;

  const getPrice = (plan: MembershipPlan) => {
    const price = billingCycle === 'annual' ? plan.price * 10 : plan.price; // 2 months free for annual
    return price;
  };

  const getSavings = (plan: MembershipPlan) => {
    if (billingCycle === 'annual') {
      return plan.price * 2; // 2 months free
    }
    return 0;
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center overflow-hidden"
    >

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold mb-6"
          >
            Membership Portal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto"
          >
            Choose the perfect membership plan for your fitness journey
          </motion.p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full transition-all duration-300 relative ${
                billingCycle === 'annual'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save
              </span>
            </button>
          </div>
        </motion.div>

        {/* Membership Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-5">
          {membershipPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-orange-400 bg-white/10 backdrop-blur-sm scale-105'
                  : 'bg-white/5 backdrop-blur-sm hover:bg-white/10'
              } ${plan.popular ? 'border-2 border-orange-400' : 'border border-white/10'}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 font-[family-name:var(--font-playfair)]">
                  {plan.name}
                </h3>

                <div className="mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    {plan.originalPrice && billingCycle === 'annual' && (
                      <span className="text-white/50 line-through text-lg">
                        ${plan.originalPrice * 12}
                      </span>
                    )}
                    <span className={`text-4xl font-bold text-white`}>
                      ${getPrice(plan)}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm">{plan.duration}</p>
                  {getSavings(plan) > 0 && (
                    <p className="text-green-400 text-sm font-semibold">
                      Save ${getSavings(plan)} annually
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + featureIndex * 0.05 }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`w-2 h-2 rounded-full ${plan.color}`} />
                    <span className="text-white/90 text-sm">{feature}</span>
                  </motion.div>
                ))}

                {plan.limitations?.map((limitation, limitationIndex) => (
                  <motion.div
                    key={limitation}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + limitationIndex * 0.05 }}
                    className="flex items-center space-x-3 opacity-50"
                  >
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <span className="text-white/60 text-sm">{limitation}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? `${plan.color} text-white shadow-lg hover:opacity-90`
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Interactive Calculator */}
        <AnimatePresence>
          {showCalculator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-12 max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <h3 className="text-2xl font-bold mb-6 text-center font-[family-name:var(--font-playfair)]">
                  Membership Calculator
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expected Visits/Week</label>
                    <select className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white">
                      <option>1-2 times</option>
                      <option>3-4 times</option>
                      <option>5-6 times</option>
                      <option>Daily</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Training Goals</label>
                    <select className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white">
                      <option>Weight Loss</option>
                      <option>Muscle Gain</option>
                      <option>General Fitness</option>
                      <option>Athletic Performance</option>
                    </select>
                  </div>
                </div>

                <div className="bg-orange-600 rounded-xl p-6 text-center">
                  <p className="text-white/90 mb-2">Recommended Plan</p>
                  <p className="text-2xl font-bold">{currentPlan.name}</p>
                  <p className="text-lg">${getPrice(currentPlan)} {currentPlan.duration}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
         <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 1 }}
           className="text-center mt-12 mb-[30px]"
         >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:bg-orange-700 transition-colors"
          >
            Join {currentPlan.name} - ${getPrice(currentPlan)} {currentPlan.duration}
          </motion.button>

          <p className="text-white/60 text-sm mt-4">
            30-day money-back guarantee • Cancel anytime • No hidden fees
          </p>
        </motion.div>

        {/* Gesture Hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 text-sm"
        >
          <div className="flex items-center space-x-4">
            <span>Swipe to compare plans</span>
            <div className="flex space-x-2">
              <div className="w-8 h-6 border border-white/30 rounded flex justify-center items-center">
                <span className="text-xs">←</span>
              </div>
              <div className="w-8 h-6 border border-white/30 rounded flex justify-center items-center">
                <span className="text-xs">→</span>
              </div>
            </div>
            <span>•</span>
            <span>Tap to calculate</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};