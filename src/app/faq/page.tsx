"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
  Clock,
  Shield,
  DollarSign,
  Zap,
  Users,
  Settings,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Sparkles,
  X,
  Menu,
  BookOpen,
  Target,
  Award
} from 'lucide-react';

// Floating Navigation Component
const FloatingNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const siteNavItems = [
    { label: 'Home', href: '/', icon: Sparkles },
    { label: 'Pricing', href: '/pricing', icon: DollarSign },
    { label: 'Templates', href: '/templates', icon: BookOpen },
    { label: 'Success Stories', href: '/success-stories', icon: Award },
    { label: 'Compliance', href: '/compliance', icon: Shield },
    { label: 'Demo', href: '/demo', icon: Target },
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
              <motion.div className="space-y-3">
                {siteNavItems.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.a
                      key={item.label}
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

// FAQ Item Component
const FAQItem = ({ faq, index }: { faq: any, index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      className="group"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
        <CardContent className="p-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${faq.color} flex items-center justify-center flex-shrink-0 mt-1`}>
                <faq.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-left">
                  {faq.question}
                </h3>
                {faq.category && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {faq.category}
                  </Badge>
                )}
              </div>
            </div>
            <div className={`w-6 h-6 flex items-center justify-center transition-transform flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200"
              >
                <div className="p-6 pt-4">
                  <div className="prose prose-sm max-w-none">
                    {typeof faq.answer === 'string' ? (
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    ) : (
                      <div className="space-y-4">
                        {faq.answer.map((paragraph: string, paraIndex: number) => (
                          <p key={paraIndex} className="text-gray-600 leading-relaxed">{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  {faq.helpful && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Pro Tip</p>
                          <p className="text-sm text-blue-700">{faq.helpful}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {faq.related && faq.related.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Related Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {faq.related.map((related: string, relIndex: number) => (
                          <Badge key={relIndex} variant="outline" className="text-xs">
                            {related}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// FAQ Page Component
export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Getting Started', 'Pricing', 'Security', 'Technical', 'Support'];

  const faqs = [
    {
      id: 1,
      question: "How quickly can I see results from AI automation?",
      category: "Getting Started",
      icon: TrendingUp,
      color: "bg-green-500",
      answer: [
        "Most businesses see initial results within 2-3 days of deployment. The AI chatbot starts capturing and qualifying leads immediately, while automated workflows begin reducing manual tasks from day one.",
        "Full ROI is typically achieved within 30-90 days, depending on your industry and current processes. Our dental practice clients often see 60% more bookings within the first month.",
        "Unlike traditional software that requires months of setup and training, our AI solutions are designed for rapid deployment and immediate impact."
      ],
      helpful: "Track your ROI from day one with our built-in analytics dashboard that shows leads captured, appointments booked, and time saved in real-time.",
      related: ["ROI Calculator", "Success Stories", "Implementation Timeline"]
    },
    {
      id: 2,
      question: "Is my data safe and GDPR compliant?",
      category: "Security",
      icon: Shield,
      color: "bg-blue-500",
      answer: [
        "Absolutely. We maintain full GDPR compliance with UK Data Protection Act 2018 standards. All data is encrypted in transit and at rest using bank-level security (TLS 1.3+ and AES-256 encryption).",
        "We are ICO registered and maintain comprehensive audit trails for all data processing activities. Your data remains under your control at all times - we never sell or share personal information.",
        "For healthcare clients, we achieve DSP Toolkit Level 3 compliance. For legal clients, we meet SRA requirements. All processing has a clear lawful basis and we conduct regular security audits."
      ],
      helpful: "View our comprehensive compliance documentation including GDPR statements, DPIAs, and security certifications on our Compliance page.",
      related: ["GDPR Compliance", "Data Security", "Compliance Documentation"]
    },
    {
      id: 3,
      question: "What if the AI doesn't work for my specific industry?",
      category: "Technical",
      icon: Settings,
      color: "bg-purple-500",
      answer: [
        "Our AI is trained on thousands of business scenarios across multiple industries. We have proven templates for healthcare, legal, accounting, fitness, retail, and many other sectors.",
        "If your industry has unique requirements, we can customize the AI during our setup process. Our team has experience with everything from dental practices to law firms to fitness studios.",
        "We offer a 30-day setup guarantee - if we can't get the AI working effectively for your specific needs within the first month, we'll refund your setup fee."
      ],
      helpful: "Check out our industry-specific templates and success stories to see how we've solved similar challenges for businesses like yours.",
      related: ["Industry Templates", "Success Stories", "Setup Guarantee"]
    },
    {
      id: 4,
      question: "How much does it really cost? Are there hidden fees?",
      category: "Pricing",
      icon: DollarSign,
      color: "bg-green-500",
      answer: [
        "No hidden fees, ever. Our pricing is completely transparent: setup fee + monthly subscription. The setup fee covers customization for your business, and the monthly fee covers hosting, maintenance, and support.",
        "Basic package: $500 setup + $99/month",
        "Growth package: $3,000 setup + $500/month (most popular)",
        "Advanced package: $10,000+ setup + $1,000+/month",
        "Performance-based pricing is also available at $25-$150 per qualified lead/appointment if you prefer to pay based on results."
      ],
      helpful: "Use our ROI calculator to see exactly how much you can expect to earn back from your investment - most clients see 3-5x ROI within the first year.",
      related: ["Pricing Calculator", "ROI Calculator", "Performance Pricing"]
    },
    {
      id: 5,
      question: "What if I need to cancel or change my plan?",
      category: "Support",
      icon: Users,
      color: "bg-orange-500",
      answer: [
        "No long-term contracts or cancellation penalties. You can cancel anytime with 30 days notice.",
        "Many clients start with the Basic package and upgrade as they see results. We make plan changes simple and can usually process upgrades immediately.",
        "If you're not satisfied within the first 30 days, we'll refund your setup fee and part your monthly subscription."
      ],
      helpful: "We believe in earning your business every month, not locking you into long-term commitments. Most clients stay because they see great results, not because of contracts.",
      related: ["Flexible Plans", "Satisfaction Guarantee", "No Contracts"]
    },
    {
      id: 6,
      question: "How long does implementation take?",
      category: "Getting Started",
      icon: Clock,
      color: "bg-indigo-500",
      answer: [
        "Most implementations are complete within 2-4 weeks. Basic packages can be live in as little as 3-5 days.",
        "Our streamlined process includes: 1) Initial consultation and planning (1-2 days), 2) Customization and configuration (1 week), 3) Testing and training (3-5 days), 4) Go-live and optimization (ongoing).",
        "Unlike traditional software projects that take months or years, our AI-first approach allows for rapid deployment while maintaining quality and customization."
      ],
      helpful: "We provide a dedicated project manager for every implementation to ensure smooth, fast deployment with minimal disruption to your business.",
      related: ["Implementation Process", "Timeline", "Project Management"]
    },
    {
      id: 7,
      question: "What kind of support do I get?",
      category: "Support",
      icon: Users,
      color: "bg-teal-500",
      answer: [
        "All packages include email support with fast response times. Growth and Advanced packages include phone support and monthly strategy calls.",
        "Basic: Email support with 24-hour response time",
        "Growth: Email + phone support + monthly strategy calls",
        "Advanced: Dedicated success manager + 24/7 priority support",
        "We also provide comprehensive documentation, video tutorials, and a knowledge base for self-service support."
      ],
      helpful: "Our support team consists of AI automation experts who understand your business, not just generic tech support staff.",
      related: ["Support Levels", "Response Times", "Success Management"]
    },
    {
      id: 8,
      question: "Can the AI handle complex business processes?",
      category: "Technical",
      icon: Zap,
      color: "bg-yellow-500",
      answer: [
        "Yes! Our advanced AI can handle complex workflows including multi-step processes, conditional logic, integrations with existing systems, and exception handling.",
        "For example, our legal clients use the AI for: case assessment → attorney matching → consultation scheduling → document preparation → follow-up sequences.",
        "The AI learns from your specific requirements and can be trained on your unique processes during setup."
      ],
      helpful: "Start with our proven templates and customize from there. We can handle everything from simple lead capture to complex multi-department workflows.",
      related: ["Advanced Features", "Customization", "Integration Capabilities"]
    },
    {
      id: 9,
      question: "What makes your AI different from other solutions?",
      category: "Getting Started",
      icon: Lightbulb,
      color: "bg-pink-500",
      answer: [
        "We're not just another chatbot company. We provide complete AI business transformation including websites, lead generation, appointment booking, calendar management, and analytics.",
        "Our AI-first approach means everything is designed around automation from the ground up, not bolted on as an afterthought.",
        "We focus on real business outcomes (more appointments, fewer no-shows, better lead quality) rather than just vanity metrics."
      ],
      helpful: "Think of us as your AI business partner, not just a software vendor. We succeed when your business grows and automates successfully.",
      related: ["AI-First Approach", "Complete Solution", "Business Outcomes"]
    },
    {
      id: 10,
      question: "Do you work with businesses of my size?",
      category: "Getting Started",
      icon: Users,
      color: "bg-cyan-500",
      answer: [
        "Absolutely! We work with businesses from solo practitioners to enterprise organizations. Our packages are designed to scale with your needs.",
        "Solo practitioners and small businesses: Start with our Basic package and grow from there.",
        "Growing businesses: Our Growth package provides advanced automation for scaling operations.",
        "Enterprise: Custom solutions with advanced security, compliance, and integration requirements.",
        "We have clients ranging from single-dentist practices to multi-location fitness chains."
      ],
      helpful: "Size doesn't matter as much as having processes that can benefit from automation. Even solo businesses save 10-15 hours per week with our AI.",
      related: ["Business Size", "Scalability", "Package Options"]
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toString().toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20">
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
              <Badge className="mb-4 px-4 py-2 text-sm bg-indigo-100 text-indigo-800 border-indigo-200">
                <HelpCircle className="w-4 h-4 mr-2" />
                Frequently Asked Questions
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-indigo-600 to-gray-900 bg-clip-text text-transparent leading-tight"
            >
              Everything You Need to Know
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Get clear answers to common questions about AI automation, pricing, implementation, and how we can transform your business.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
              {/* Search */}
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-96 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="mb-2"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <p className="text-gray-600">
                {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              {filteredFAQs.map((faq, index) => (
                <FAQItem key={faq.id} faq={faq} index={index} />
              ))}
            </div>

            {/* No Results */}
            {filteredFAQs.length === 0 && (
              <motion.div
                variants={fadeInUp}
                className="text-center py-16"
              >
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No questions found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or browse all categories
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Still Need Help CTA */}
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
                <MessageCircle className="w-4 h-4 mr-2" />
                Still Need Help?
              </Badge>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white dark:text-gray-100 mb-6"
            >
              Get Personalised Support
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Can't find what you're looking for? Our AI automation experts are ready to answer your specific questions and help you get started.
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
                  className="px-8 py-4 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Ask Our AI Expert
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
                  <Clock className="w-5 h-5 mr-2" />
                  Schedule Consultation
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}