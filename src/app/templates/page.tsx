"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import {
  Play,
  ArrowRight,
  Check,
  Clock,
  Users,
  Settings,
  Zap,
  Target,
  Filter,
  Search,
  Copy,
  Download,
  Eye,
  Sparkles,
  MessageCircle,
  X,
  Menu,
  Workflow,
  Bot,
  Calendar,
  Mail,
  Phone,
  Database
} from 'lucide-react';

// Floating Navigation Component
const FloatingNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const siteNavItems = [
    { label: 'Home', href: '/', icon: Sparkles },
    { label: 'Pricing', href: '/pricing', icon: Zap },
    { label: 'Success Stories', href: '/success-stories', icon: Target },
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

// Template Card Component
const TemplateCard = ({ template, index }: { template: any, index: number }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <motion.div
        variants={fadeInUp}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group cursor-pointer h-full"
      >
        <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="relative h-40 bg-gradient-to-br from-primary/20 to-purple-500/20 p-6">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {template.category}
                  </Badge>
                  <div className={`w-10 h-10 rounded-xl ${template.color} flex items-center justify-center`}>
                    <template.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-white/80 text-sm">
                  {template.description}
                </p>
              </div>
            </div>

            {/* Workflow Visualization */}
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Workflow className="w-4 h-4" />
                  Automation Flow
                </h4>
                <div className="space-y-2">
                  {template.workflow.map((step: any, stepIndex: number) => (
                    <motion.div
                      key={stepIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: stepIndex * 0.1 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className={`w-6 h-6 rounded-full ${step.color} flex items-center justify-center text-white text-xs font-bold`}>
                        {stepIndex + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <step.icon className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{step.title}</span>
                        </div>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                <div className="grid grid-cols-2 gap-2">
                  {template.features.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-xs">
                      <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {template.stats.map((stat: any, statIndex: number) => (
                  <div key={statIndex} className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{template.name}</h3>
                    <p className="text-gray-600">{template.description}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Detailed Workflow */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Complete Automation Flow</h4>
                    <div className="space-y-4">
                      {template.detailedWorkflow.map((step: any, stepIndex: number) => (
                        <div key={stepIndex} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full ${step.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                            {stepIndex + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <step.icon className="w-4 h-4 text-gray-600" />
                              <h5 className="font-semibold">{step.title}</h5>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                            <div className="text-xs text-gray-500">
                              Duration: {step.duration} • Tools: {step.tools.join(', ')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Deploy This Template
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download Config
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Templates Page Component
export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Healthcare', 'Accounting', 'Fitness', 'Legal', 'Retail'];

  const templates = [
    {
      id: 1,
      name: "Dental Appointment Automation",
      description: "Complete patient journey from inquiry to follow-up",
      category: "Healthcare",
      icon: Calendar,
      color: "bg-blue-500",
      workflow: [
        { title: "Patient Inquiry", description: "AI chatbot captures patient needs", icon: MessageCircle, color: "bg-blue-500" },
        { title: "Smart Scheduling", description: "Available slots based on preferences", icon: Calendar, color: "bg-green-500" },
        { title: "Confirmation", description: "Automated voice/text confirmation", icon: Phone, color: "bg-purple-500" },
        { title: "Reminders", description: "Smart reminders reduce no-shows", icon: Clock, color: "bg-orange-500" }
      ],
      features: [
        "Voice appointment booking",
        "Insurance verification",
        "Automated reminders",
        "No-show recovery",
        "Patient portal integration"
      ],
      stats: [
        { value: "60%", label: "More bookings" },
        { value: "40%", label: "Fewer no-shows" },
        { value: "24/7", label: "Availability" }
      ],
      detailedWorkflow: [
        {
          title: "Patient Inquiry & Qualification",
          description: "AI chatbot engages visitors, asks qualifying questions about treatment needs, insurance, and urgency",
          icon: Bot,
          color: "bg-blue-500",
          duration: "2-5 minutes",
          tools: ["AI Chatbot", "Lead Scoring", "CRM Integration"]
        },
        {
          title: "Intelligent Scheduling",
          description: "Matches patient needs with available appointments, considering dentist availability and treatment duration",
          icon: Calendar,
          color: "bg-green-500",
          duration: "1 minute",
          tools: ["Smart Calendar", "Provider Matching", "Duration Estimation"]
        },
        {
          title: "Multi-Channel Confirmation",
          description: "Sends confirmation via patient's preferred method (call, text, email) with appointment details",
          icon: Phone,
          color: "bg-purple-500",
          duration: "30 seconds",
          tools: ["Voice Confirmation", "SMS Integration", "Email Automation"]
        },
        {
          title: "Smart Reminder Sequence",
          description: "Sends personalized reminders at optimal times with easy rescheduling options",
          icon: Clock,
          color: "bg-orange-500",
          duration: "Ongoing",
          tools: ["Smart Timing", "Personalization", "Rescheduling Bot"]
        }
      ]
    },
    {
      id: 2,
      name: "Tax Season Lead Management",
      description: "Automated client acquisition and onboarding for accounting firms",
      category: "Accounting",
      icon: Database,
      color: "bg-green-500",
      workflow: [
        { title: "Lead Capture", description: "Website forms and chat qualification", icon: Users, color: "bg-blue-500" },
        { title: "Document Collection", description: "Secure document upload and processing", icon: Database, color: "bg-green-500" },
        { title: "Consultation Booking", description: "Schedule initial consultation calls", icon: Calendar, color: "bg-purple-500" },
        { title: "Follow-up", description: "Automated nurture sequences", icon: Mail, color: "bg-orange-500" }
      ],
      features: [
        "Lead qualification scoring",
        "Secure document portal",
        "Automated consultation booking",
        "Client onboarding automation",
        "Tax season campaign tools"
      ],
      stats: [
        { value: "300%", label: "More qualified leads" },
        { value: "90%", label: "Faster onboarding" },
        { value: "50%", label: "Cost reduction" }
      ],
      detailedWorkflow: [
        {
          title: "Intelligent Lead Qualification",
          description: "AI analyzes website inquiries and chat conversations to score and qualify potential clients",
          icon: Target,
          color: "bg-blue-500",
          duration: "Real-time",
          tools: ["Lead Scoring AI", "Chat Analysis", "CRM Auto-sync"]
        },
        {
          title: "Secure Document Processing",
          description: "Automated document collection, verification, and organization in secure client portal",
          icon: Database,
          color: "bg-green-500",
          duration: "5-10 minutes",
          tools: ["Document AI", "Secure Portal", "Auto-categorization"]
        },
        {
          title: "Consultation Scheduling",
          description: "Matches client needs with accountant expertise and schedules consultation calls",
          icon: Calendar,
          color: "bg-purple-500",
          duration: "2 minutes",
          tools: ["Smart Scheduling", "Expertise Matching", "Calendar Sync"]
        },
        {
          title: "Automated Nurture Campaigns",
          description: "Personalized email sequences based on client type and stage in decision process",
          icon: Mail,
          color: "bg-orange-500",
          duration: "Ongoing",
          tools: ["Email Automation", "Personalization", "Behavioral Triggers"]
        }
      ]
    },
    {
      id: 3,
      name: "Fitness Class Management Suite",
      description: "Complete class scheduling and member engagement automation",
      category: "Fitness",
      icon: Users,
      color: "bg-purple-500",
      workflow: [
        { title: "Member Signup", description: "Trial class booking and preferences", icon: Users, color: "bg-blue-500" },
        { title: "Class Scheduling", description: "AI-optimized class recommendations", icon: Calendar, color: "bg-green-500" },
        { title: "Progress Tracking", description: "Automated check-ins and milestones", icon: Target, color: "bg-purple-500" },
        { title: "Retention", description: "Personalized engagement campaigns", icon: Mail, color: "bg-orange-500" }
      ],
      features: [
        "Trial class automation",
        "Smart class recommendations",
        "Progress tracking dashboard",
        "Member retention campaigns",
        "Instructor scheduling tools"
      ],
      stats: [
        { value: "85%", label: "Trial conversion" },
        { value: "200%", label: "Member growth" },
        { value: "15h", label: "Time saved/day" }
      ],
      detailedWorkflow: [
        {
          title: "Trial Member Acquisition",
          description: "Captures trial class requests and matches with appropriate fitness level and goals",
          icon: Users,
          color: "bg-blue-500",
          duration: "3 minutes",
          tools: ["Trial Booking", "Goal Assessment", "Level Matching"]
        },
        {
          title: "Intelligent Class Scheduling",
          description: "Recommends optimal classes based on member goals, schedule, and instructor availability",
          icon: Calendar,
          color: "bg-green-500",
          duration: "1 minute",
          tools: ["AI Recommendations", "Schedule Optimization", "Instructor Matching"]
        },
        {
          title: "Progress Monitoring & Milestones",
          description: "Automated check-ins, progress photos, and milestone celebrations with member portal",
          icon: Target,
          color: "bg-purple-500",
          duration: "Ongoing",
          tools: ["Progress AI", "Milestone Detection", "Member Portal"]
        },
        {
          title: "Personalized Retention Campaigns",
          description: "AI-driven engagement based on member behavior, goals, and engagement patterns",
          icon: Mail,
          color: "bg-orange-500",
          duration: "Ongoing",
          tools: ["Behavioral AI", "Personalization", "Engagement Scoring"]
        }
      ]
    },
    {
      id: 4,
      name: "Legal Consultation Intake System",
      description: "Professional client intake and consultation scheduling automation",
      category: "Legal",
      icon: Settings,
      color: "bg-orange-500",
      workflow: [
        { title: "Case Assessment", description: "AI-powered case type identification", icon: Bot, color: "bg-blue-500" },
        { title: "Attorney Matching", description: "Match with appropriate legal expertise", icon: Users, color: "bg-green-500" },
        { title: "Consultation Booking", description: "Schedule with matched attorney", icon: Calendar, color: "bg-purple-500" },
        { title: "Document Prep", description: "Automated intake form completion", icon: Database, color: "bg-orange-500" }
      ],
      features: [
        "Case type identification",
        "Attorney expertise matching",
        "Conflict checking automation",
        "Intake form automation",
        "Consultation preparation"
      ],
      stats: [
        { value: "95%", label: "Intake completion" },
        { value: "70%", label: "Consult conversion" },
        { value: "80%", label: "Time reduction" }
      ],
      detailedWorkflow: [
        {
          title: "Intelligent Case Assessment",
          description: "AI analyzes client description to identify case type and urgency level for proper attorney matching",
          icon: Bot,
          color: "bg-blue-500",
          duration: "2-3 minutes",
          tools: ["Case Classification AI", "Urgency Detection", "Attorney Matching"]
        },
        {
          title: "Expertise-Based Attorney Matching",
          description: "Matches client needs with attorney specializations and availability for optimal consultation",
          icon: Users,
          color: "bg-green-500",
          duration: "1 minute",
          tools: ["Expertise Matching", "Availability Check", "Conflict Detection"]
        },
        {
          title: "Consultation Scheduling & Prep",
          description: "Schedules consultation and prepares both client and attorney with relevant case information",
          icon: Calendar,
          color: "bg-purple-500",
          duration: "2 minutes",
          tools: ["Smart Scheduling", "Pre-consultation Prep", "Document Assembly"]
        },
        {
          title: "Automated Intake Documentation",
          description: "Guides clients through comprehensive intake forms with smart question flows",
          icon: Database,
          color: "bg-orange-500",
          duration: "10-15 minutes",
          tools: ["Smart Forms", "Document AI", "Progress Saving"]
        }
      ]
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Floating Navigation */}
      <FloatingNavigation />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative py-16 md:py-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.2),transparent_50%)]" />

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge className="mb-4 px-4 py-2 text-sm bg-purple-100 text-purple-800 border-purple-200">
                <Workflow className="w-4 h-4 mr-2" />
                Industry Templates
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-600 to-gray-900 bg-clip-text text-transparent leading-tight"
            >
              Pre-Built Automation Templates
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Jumpstart your AI transformation with industry-specific automation templates. Deploy proven workflows in minutes, not months.
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
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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

            <motion.div variants={fadeInUp} className="text-center mb-8">
              <p className="text-gray-600">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Templates Grid */}
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
              {filteredTemplates.map((template, index) => (
                <TemplateCard key={template.id} template={template} index={index} />
              ))}
            </div>

            {/* No Results */}
            {filteredTemplates.length === 0 && (
              <motion.div
                variants={fadeInUp}
                className="text-center py-16"
              >
                <Workflow className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No templates found
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
                Ready to Deploy?
              </Badge>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white dark:text-gray-100 mb-6"
            >
              Deploy Any Template in Minutes
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Choose from our library of proven automation templates and customize them for your business needs.
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
                  className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Schedule Free Demo
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
                  <Zap className="w-5 h-5 mr-2" />
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