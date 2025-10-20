"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import {
  Zap,
  Brain,
  Target,
  TrendingUp,
  Users,
  Settings,
  Play,
  Check,
  Star,
  Calculator,
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
  ChevronDown,
  Sparkles,
  Rocket,
  MessageCircle,
  X,
  Menu
} from 'lucide-react';

// Floating Navigation Component (matching main site)
const FloatingNavigation = () => {
  const [activeSection, setActiveSection] = useState('pricing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'calculator', label: 'ROI Calculator', icon: Calculator },
    { id: 'solutions', label: 'Solutions', icon: Settings },
    { id: 'enterprise', label: 'Enterprise', icon: Shield },
  ];

  const siteNavItems = [
    { label: 'Home', href: '/', icon: Sparkles },
    { label: 'Demo', href: '/demo', icon: Play },
    { label: 'Blog', href: '/blog', icon: MessageCircle },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <motion.div
        className="fixed top-4 right-4 z-50 flex flex-col md:flex-row gap-1 md:gap-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        {/* Site Navigation Links */}
        {siteNavItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2 + index * 0.1, type: "spring", stiffness: 200 }}
          >
            <Button
              asChild
              size="sm"
              className="px-3 py-2 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-lg hover:bg-white/20 dark:hover:bg-white/10 hover:scale-105 transition-all duration-300 text-white"
            >
              <a href={item.href} className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            </Button>
          </motion.div>
        ))}

        {/* Dark Mode Toggle */}
        <DarkModeToggle />

        {/* Main Menu Button */}
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          size="icon"
          className="w-12 h-12 rounded-full bg-primary/90 dark:bg-primary/80 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-lg hover:bg-primary dark:hover:bg-primary/70 hover:scale-110 transition-all duration-300"
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl z-50 border-l border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 pt-20">
              {/* Site Navigation Links */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700"
              >
                {siteNavItems.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.a
                      key={item.label}
                      variants={fadeInUp}
                      href={item.href}
                      className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <Icon className="w-5 h-5 text-primary dark:text-primary" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                    </motion.a>
                  );
                })}
              </motion.div>

              {/* Section Navigation */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      variants={fadeInUp}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-primary text-white shadow-lg'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive ? 'bg-white/20' : 'bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30'
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-primary dark:text-primary'}`} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-2 h-2 bg-white rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

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
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
};

// Pricing Tier Component
const PricingTier = ({ tier, index, isPopular = false }: { tier: any, index: number, isPopular?: boolean }) => {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative group cursor-pointer ${isPopular ? 'scale-105' : ''}`}
    >
      <Card className={`h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden min-h-[600px] ${
        isPopular ? 'ring-2 ring-primary shadow-primary/20' : ''
      }`}>
        <CardContent className="p-6 md:p-8">
          {isPopular && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-3 left-1/2 transform -translate-x-1/2"
            >
              <Badge className="bg-primary text-white px-4 py-1 text-sm font-semibold">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
            </motion.div>
          )}

          <motion.div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 flex-shrink-0 ${
              tier.color || 'bg-primary/10'
            }`}
            whileHover={{ rotate: 5 }}
          >
            <tier.icon className="w-8 h-8 text-primary" />
          </motion.div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {tier.name}
          </h3>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {tier.description}
          </p>

          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-primary">
                ${tier.setupPrice.toLocaleString()}
              </span>
              <span className="text-gray-500">setup</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900">
                ${tier.monthlyPrice}
              </span>
              <span className="text-gray-500">/month</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {tier.features.map((feature: string, featureIndex: number) => (
              <motion.div
                key={featureIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: featureIndex * 0.1 }}
                className="flex items-center gap-3 text-sm text-gray-600"
              >
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="leading-relaxed">{feature}</span>
              </motion.div>
            ))}
          </div>

          <Button className={`w-full group-hover:bg-primary group-hover:text-white transition-all duration-300 ${
            isPopular ? 'bg-primary text-white' : ''
          }`}>
            Get Started
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ROI Calculator Component
const ROICalculator = () => {
  const [industry, setIndustry] = useState('healthcare');
  const [monthlyLeads, setMonthlyLeads] = useState(50);
  const [avgDealValue, setAvgDealValue] = useState(200);
  const [showOffTime, setShowOffTime] = useState(20);

  const calculateROI = () => {
    const monthlyRevenue = monthlyLeads * avgDealValue;
    const robofyCost = industry === 'basic' ? 99 : industry === 'growth' ? 500 : 1000;
    const yearlyCost = robofyCost * 12;
    const projectedRevenue = monthlyRevenue * 12 * 0.3; // 30% increase
    const roi = ((projectedRevenue - yearlyCost) / yearlyCost) * 100;

    return {
      monthlyRevenue,
      yearlyCost,
      projectedRevenue,
      roi,
      savings: projectedRevenue - yearlyCost
    };
  };

  const results = calculateROI();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Calculate Your ROI
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="basic">Basic Package</option>
            <option value="growth">Growth Package</option>
            <option value="advanced">Advanced Package</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Leads
          </label>
          <input
            type="number"
            value={monthlyLeads}
            onChange={(e) => setMonthlyLeads(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avg Deal Value ($)
          </label>
          <input
            type="number"
            value={avgDealValue}
            onChange={(e) => setAvgDealValue(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Show-up Rate (%)
          </label>
          <input
            type="number"
            value={showOffTime}
            onChange={(e) => setShowOffTime(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-primary/10 rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-primary">
            ${results.monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Monthly Revenue</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-green-50 rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-green-600">
            ${results.yearlyCost.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Annual Cost</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-blue-50 rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-blue-600">
            ${results.projectedRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Projected Revenue</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-purple-50 rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-purple-600">
            {results.roi > 0 ? '+' : ''}{results.roi.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">ROI</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Main Pricing Page Component
export default function PricingPage() {
  const pricingTiers = [
    {
      name: "Basic",
      description: "Perfect for small businesses getting started with AI automation",
      setupPrice: 500,
      monthlyPrice: 99,
      icon: Zap,
      color: "bg-blue-500",
      features: [
        "AI chatbot implementation",
        "Basic FAQ automation",
        "Simple intake forms",
        "Email integration",
        "Basic analytics dashboard",
        "30-day setup guarantee",
        "Email support"
      ]
    },
    {
      name: "Growth",
      description: "Advanced automation for growing businesses ready to scale",
      setupPrice: 3000,
      monthlyPrice: 500,
      icon: Target,
      color: "bg-green-500",
      features: [
        "Everything in Basic",
        "CRM synchronization",
        "Advanced lead generation",
        "Voice appointment booking",
        "Multi-platform integration",
        "Custom workflow automation",
        "Priority phone & email support",
        "Monthly strategy calls"
      ]
    },
    {
      name: "Advanced",
      description: "Enterprise-grade AI solutions for maximum automation and growth",
      setupPrice: 10000,
      monthlyPrice: 1000,
      icon: Brain,
      color: "bg-purple-500",
      features: [
        "Everything in Growth",
        "Multi-agent RAG systems",
        "Advanced analytics dashboards",
        "Custom AI model training",
        "API integrations",
        "White-label solutions",
        "Dedicated success manager",
        "Custom development hours",
        "24/7 priority support"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Floating Navigation */}
      <FloatingNavigation />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative py-16 md:py-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.2),transparent_50%)]" />

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge className="mb-4 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                <DollarSign className="w-4 h-4 mr-2" />
                Transparent Pricing
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent leading-tight"
            >
              Choose Your AI Growth Journey
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              From getting started with basic automation to enterprise-grade AI transformation—find the perfect package for your business goals and budget.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section id="pricing" className="min-h-screen flex items-center justify-center relative py-16 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                No hidden fees, no long-term contracts. Choose the package that fits your needs and scale as you grow.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {pricingTiers.map((tier, index) => (
                <PricingTier
                  key={index}
                  tier={tier}
                  index={index}
                  isPopular={tier.name === "Growth"}
                />
              ))}
            </div>

            {/* Performance-based Pricing */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-8 border border-primary/20 text-center"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Performance-Based Pricing Available
              </h3>
              <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
                Prefer to pay per qualified lead or appointment? We offer flexible performance-based pricing starting at $25–$150 per conversion.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Discuss Performance Pricing
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="calculator" className="min-h-screen flex items-center justify-center relative py-16 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">
                <Calculator className="w-4 h-4 mr-2" />
                ROI Calculator
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Calculate Your Investment
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                See exactly how much you can expect to earn with AI automation
              </p>
            </motion.div>

            <ROICalculator />
          </motion.div>
        </div>
      </section>

      {/* Industry Solutions Section */}
      <section id="solutions" className="min-h-screen flex items-center justify-center relative py-16 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">
                <Settings className="w-4 h-4 mr-2" />
                Industry Solutions
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Specialized Pricing by Industry
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Different industries have different needs. Explore our industry-specific pricing and solutions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Healthcare",
                  icon: Users,
                  color: "bg-blue-500",
                  price: "$3,000–$9,000",
                  description: "HIPAA-compliant automation for medical practices"
                },
                {
                  name: "Accounting",
                  icon: Calculator,
                  color: "bg-green-500",
                  price: "$2,500–$7,500",
                  description: "Tax season automation and client management"
                },
                {
                  name: "Fitness",
                  icon: Target,
                  color: "bg-purple-500",
                  price: "$1,500–$5,000",
                  description: "Class scheduling and member engagement"
                },
                {
                  name: "Legal",
                  icon: Shield,
                  color: "bg-orange-500",
                  price: "$5,000–$15,000",
                  description: "Client intake and case management automation"
                },
                {
                  name: "Retail",
                  icon: TrendingUp,
                  color: "bg-pink-500",
                  price: "$2,000–$8,000",
                  description: "Inventory management and customer service"
                },
                {
                  name: "Real Estate",
                  icon: Rocket,
                  color: "bg-indigo-500",
                  price: "$3,500–$12,000",
                  description: "Lead nurturing and appointment setting"
                }
              ].map((industry, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group cursor-pointer"
                >
                  <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${industry.color} flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300`}
                        whileHover={{ rotate: 5 }}
                      >
                        <industry.icon className="w-8 h-8" />
                      </motion.div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {industry.name}
                      </h3>

                      <p className="text-2xl font-bold text-primary mb-2">
                        {industry.price}
                      </p>

                      <p className="text-sm text-gray-600 mb-4">
                        {industry.description}
                      </p>

                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="min-h-screen flex items-center justify-center relative py-16 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">
                <Shield className="w-4 h-4 mr-2" />
                Enterprise
              </Badge>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white dark:text-gray-100 mb-6"
            >
              Need Something Custom?
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Large organization or unique requirements? Let's build something tailored to your specific needs and scale.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Schedule Enterprise Consultation
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}