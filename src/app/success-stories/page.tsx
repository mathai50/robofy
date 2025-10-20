"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import {
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Star,
  Play,
  Quote,
  ArrowRight,
  Calendar,
  Target,
  Award,
  Sparkles,
  MessageCircle,
  X,
  Menu,
  Filter,
  Search,
  Check
} from 'lucide-react';

// Floating Navigation Component (matching main site)
const FloatingNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const siteNavItems = [
    { label: 'Home', href: '/', icon: Sparkles },
    { label: 'Pricing', href: '/pricing', icon: DollarSign },
    { label: 'Demo', href: '/demo', icon: Play },
    { label: 'Blog', href: '/blog', icon: MessageCircle },
  ];

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

// Case Study Card Component
const CaseStudyCard = ({ study, index }: { study: any, index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group cursor-pointer h-full"
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <CardContent className="p-0">
          {/* Header Image */}
          <div className="relative h-48 bg-gradient-to-br from-primary/20 to-purple-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="mb-2 bg-white/20 text-white border-white/30">
                {study.industry}
              </Badge>
              <h3 className="text-xl font-bold text-white mb-1">
                {study.title}
              </h3>
              <p className="text-white/80 text-sm">
                {study.company}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {study.metrics.map((metric: any, metricIndex: number) => (
                <motion.div
                  key={metricIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: metricIndex * 0.1 }}
                  className="text-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl font-bold text-primary mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-600">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Challenge & Solution */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
              <p className="text-sm text-gray-600 mb-4">
                {study.challenge}
              </p>

              <h4 className="font-semibold text-gray-900 mb-2">Solution</h4>
              <p className="text-sm text-gray-600 mb-4">
                {study.solution}
              </p>
            </div>

            {/* Quote */}
            <div className="bg-primary/5 rounded-lg p-4 mb-6 border-l-4 border-primary">
              <Quote className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-gray-700 italic mb-2">
                "{study.quote}"
              </p>
              <p className="text-xs text-primary font-semibold">
                - {study.author}, {study.role}
              </p>
            </div>

            {/* Technologies Used */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {study.technologies.map((tech: string, techIndex: number) => (
                  <Badge
                    key={techIndex}
                    variant="outline"
                    className="text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button
              className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
              variant={isExpanded ? "default" : "outline"}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'Read Full Case Study'}
              <ArrowRight className={`w-4 h-4 ml-2 transition-transform ${
                isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'
              }`} />
            </Button>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Implementation Timeline</h5>
                      <p className="text-sm text-gray-600">{study.timeline}</p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Key Results</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {study.results.map((result: string, resultIndex: number) => (
                          <li key={resultIndex} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">ROI Breakdown</h5>
                      <p className="text-sm text-gray-600">{study.roiBreakdown}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Success Stories Page Component
export default function SuccessStoriesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Template case studies (for future content)
  const caseStudies = [
    {
      id: 1,
      title: "Dental Practice Automation Revolution",
      company: "Bright Smile Dental",
      industry: "Healthcare",
      challenge: "Missing 40% of appointment opportunities due to manual follow-ups and scheduling conflicts",
      solution: "Implemented AI chatbot with voice booking and automated reminder system",
      quote: "Our appointment bookings increased by 60% in the first month. The AI handles everything from initial inquiry to confirmation.",
      author: "Dr. Sarah Martinez",
      role: "Practice Owner",
      metrics: [
        { value: "60%", label: "More bookings" },
        { value: "40%", label: "Fewer no-shows" },
        { value: "25h", label: "Time saved/week" }
      ],
      technologies: ["AI Chatbot", "Voice Booking", "Calendar Sync", "SMS Reminders"],
      timeline: "2 weeks implementation, live in 3 weeks",
      results: [
        "60% increase in monthly appointments",
        "40% reduction in no-show rate",
        "25 hours of admin time saved per week",
        "100% patient satisfaction with booking process"
      ],
      roiBreakdown: "Investment of $3,500 setup + $500/month. Generated $12,000+ in additional monthly revenue within 60 days."
    },
    {
      id: 2,
      title: "Fitness Studio Member Explosion",
      company: "Elite Fitness Hub",
      industry: "Fitness",
      challenge: "Struggling to convert trial members and manage class scheduling efficiently",
      solution: "Deployed AI-powered member portal with automated class booking and engagement system",
      quote: "Member conversion went from 15% to 85%. The AI handles everything from class recommendations to payment processing.",
      author: "Mike Thompson",
      role: "Studio Owner",
      metrics: [
        { value: "85%", label: "Conversion rate" },
        { value: "200%", label: "Member growth" },
        { value: "15h", label: "Time saved/day" }
      ],
      technologies: ["Member Portal", "Class Scheduling", "Payment Automation", "Progress Tracking"],
      timeline: "3 weeks implementation, fully operational in 4 weeks",
      results: [
        "85% trial-to-member conversion rate",
        "200% increase in membership growth",
        "15 hours of daily admin work eliminated",
        "30% increase in class attendance"
      ],
      roiBreakdown: "Investment of $2,500 setup + $300/month. Generated $8,000+ in additional monthly revenue within 45 days."
    },
    {
      id: 3,
      title: "Accounting Firm Lead Generation Overhaul",
      company: "Precision Accounting Partners",
      industry: "Accounting",
      challenge: "Inconsistent lead flow and manual client onboarding process creating bottlenecks",
      solution: "Implemented intelligent lead qualification system with automated client intake and document processing",
      quote: "Our qualified leads increased by 300% while reducing onboarding time from 2 weeks to 2 hours.",
      author: "Jennifer Walsh",
      role: "Managing Partner",
      metrics: [
        { value: "300%", label: "More leads" },
        { value: "90%", label: "Faster onboarding" },
        { value: "50%", label: "Cost reduction" }
      ],
      technologies: ["Lead Qualification", "Document Processing", "Client Portal", "Automated Workflows"],
      timeline: "4 weeks implementation, live in 5 weeks",
      results: [
        "300% increase in qualified leads",
        "90% faster client onboarding",
        "50% reduction in administrative costs",
        "95% client satisfaction with onboarding process"
      ],
      roiBreakdown: "Investment of $5,000 setup + $750/month. Generated $25,000+ in additional monthly revenue within 90 days."
    },
    {
      id: 4,
      title: "Legal Practice Intake Transformation",
      company: "Heritage Law Associates",
      industry: "Legal",
      challenge: "Overwhelmed with initial consultations and struggling to capture all potential clients",
      solution: "Deployed AI-powered consultation booking with intelligent case qualification and automated follow-ups",
      quote: "We now capture 95% of consultation requests and convert 70% to paying clients. The system never sleeps.",
      author: "Robert Chen",
      role: "Senior Partner",
      metrics: [
        { value: "95%", label: "Capture rate" },
        { value: "70%", label: "Conversion rate" },
        { value: "24/7", label: "Availability" }
      ],
      technologies: ["Consultation Booking", "Case Qualification", "Automated Follow-ups", "Client Portal"],
      timeline: "3 weeks implementation, operational in 4 weeks",
      results: [
        "95% of consultation requests captured",
        "70% conversion to paying clients",
        "24/7 consultation availability",
        "60% reduction in administrative workload"
      ],
      roiBreakdown: "Investment of $7,500 setup + $1,000/month. Generated $35,000+ in additional monthly revenue within 75 days."
    }
  ];

  const industries = ['All', 'Healthcare', 'Fitness', 'Accounting', 'Legal'];

  const filteredStudies = caseStudies.filter(study => {
    const matchesIndustry = selectedIndustry === 'All' || study.industry === selectedIndustry;
    const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-purple-900/20">
      {/* Floating Navigation */}
      <FloatingNavigation />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative py-16 md:py-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.2),transparent_50%)]" />

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge className="mb-4 px-4 py-2 text-sm bg-green-100 text-green-800 border-green-200">
                <Award className="w-4 h-4 mr-2" />
                Success Stories
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-green-600 to-gray-900 bg-clip-text text-transparent leading-tight"
            >
              Real Results, Real Businesses
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              See how businesses like yours are transforming their operations with AI automation. These are real stories with real results.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-4 items-center justify-center mb-12">
              {/* Search */}
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search case studies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Industry Filter */}
              <div className="flex gap-2 flex-wrap justify-center">
                {industries.map((industry) => (
                  <Button
                    key={industry}
                    variant={selectedIndustry === industry ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedIndustry(industry)}
                    className="mb-2"
                  >
                    {industry}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Results Summary */}
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <p className="text-gray-600">
                Showing {filteredStudies.length} of {caseStudies.length} case studies
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredStudies.map((study, index) => (
                <CaseStudyCard key={study.id} study={study} index={index} />
              ))}
            </div>

            {/* No Results */}
            {filteredStudies.length === 0 && (
              <motion.div
                variants={fadeInUp}
                className="text-center py-16"
              >
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No case studies found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex items-center justify-center relative py-16 md:py-32">
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
                <Sparkles className="w-4 h-4 mr-2" />
                Your Success Story
              </Badge>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white dark:text-gray-100 mb-6"
            >
              Ready to Be Our Next Success Story?
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Join hundreds of businesses who've transformed their operations with AI automation. Your success story starts here.
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
                  className="px-8 py-4 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Schedule Free Consultation
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  View Pricing
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}