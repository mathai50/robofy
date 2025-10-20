"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  ExternalLink,
  Lock,
  Eye,
  Database,
  Users,
  Calendar,
  Mail,
  Phone,
  Globe,
  Server,
  Sparkles,
  MessageCircle,
  X,
  Menu,
  BookOpen,
  Scale,
  Building
} from 'lucide-react';

// Floating Navigation Component
const FloatingNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const siteNavItems = [
    { label: 'Home', href: '/', icon: Sparkles },
    { label: 'Pricing', href: '/pricing', icon: Scale },
    { label: 'Templates', href: '/templates', icon: BookOpen },
    { label: 'Success Stories', href: '/success-stories', icon: Building },
    { label: 'Demo', href: '/demo', icon: Eye },
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

// Compliance Section Component
const ComplianceSection = ({ section, index }: { section: any, index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
        <CardContent className="p-0">
          <div
            className="p-6"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {section.subtitle}
                  </p>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full ${section.color} flex items-center justify-center transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              {section.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Compliant
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-blue-500" />
                Documentation Available
              </span>
              {section.lastUpdated && (
                <span>Last updated: {section.lastUpdated}</span>
              )}
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200"
              >
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Key Requirements */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Requirements</h4>
                      <div className="space-y-2">
                        {section.requirements.map((req: string, reqIndex: number) => (
                          <div key={reqIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Implementation Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">How We Comply</h4>
                      <div className="space-y-2">
                        {section.compliance.map((comp: string, compIndex: number) => (
                          <div key={compIndex} className="flex items-start gap-2 text-sm">
                            <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{comp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Documentation Links */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Documentation & Resources</h4>
                      <div className="space-y-2">
                        {section.resources.map((resource: any, resIndex: number) => (
                          <div key={resIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium">{resource.title}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                              {resource.url && (
                                <Button size="sm" variant="outline">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Compliance Page Component
export default function CompliancePage() {
  const complianceSections = [
    {
      title: "GDPR Compliance",
      subtitle: "General Data Protection Regulation (EU) 2016/679",
      description: "Comprehensive data protection framework ensuring lawful, fair, and transparent processing of personal data for UK and EU citizens.",
      icon: Shield,
      color: "bg-blue-500",
      lastUpdated: "October 2024",
      requirements: [
        "Lawful basis for processing personal data",
        "Data protection by design and default",
        "Data Protection Impact Assessments (DPIAs)",
        "Appointment of Data Protection Officer (where required)",
        "Data subject rights (access, rectification, erasure, portability)",
        "Breach notification within 72 hours",
        "Data processing agreements with third parties",
        "International data transfer safeguards"
      ],
      compliance: [
        "All data processing activities have identified lawful basis",
        "Privacy-by-design principles embedded in system architecture",
        "Automated DPIA generation for high-risk processing",
        "Data minimization techniques implemented",
        "Consent management system with granular controls",
        "Automated breach detection and notification workflows",
        "Comprehensive audit trails for all data operations",
        "Secure data deletion and retention policies"
      ],
      resources: [
        {
          title: "GDPR Compliance Statement",
          type: "PDF",
          url: "/compliance/gdpr-statement.pdf"
        },
        {
          title: "Data Protection Impact Assessment Template",
          type: "DOCX",
          url: "/compliance/dpia-template.docx"
        },
        {
          title: "Privacy Notice Template",
          type: "DOCX",
          url: "/compliance/privacy-notice-template.docx"
        },
        {
          title: "ICO Registration Guide",
          type: "LINK",
          url: "https://ico.org.uk/for-organisations/register/"
        }
      ]
    },
    {
      title: "Data Protection Act 2018",
      subtitle: "UK-specific data protection legislation",
      description: "UK implementation of GDPR with additional provisions for law enforcement, national security, and intelligence activities.",
      icon: Scale,
      color: "bg-green-500",
      lastUpdated: "October 2024",
      requirements: [
        "Compliance with UK GDPR standards",
        "Age-appropriate design for children services",
        "Processing of sensitive personal data",
        "Automated decision-making safeguards",
        "Data sharing with law enforcement",
        "National security exemptions (where applicable)",
        "Freedom of information considerations",
        "Data protection fees and registration"
      ],
      compliance: [
        "UK GDPR compliance as national standard",
        "Age verification for information society services",
        "Special category data processing safeguards",
        "Meaningful human involvement in automated decisions",
        "Secure data sharing protocols with authorities",
        "National security exemption procedures",
        "FOI request handling workflows",
        "Automated ICO registration and fee payment"
      ],
      resources: [
        {
          title: "DPA 2018 Compliance Checklist",
          type: "PDF",
          url: "/compliance/dpa2018-checklist.pdf"
        },
        {
          title: "Age Appropriate Design Code",
          type: "LINK",
          url: "https://ico.org.uk/for-organisations/guide-to-data-protection/key-data-protection-themes/age-appropriate-design-a-code-of-practice-for-online-services/"
        },
        {
          title: "Automated Decision Making Guidance",
          type: "LINK",
          url: "https://ico.org.uk/for-organisations/guide-to-data-protection/key-data-protection-themes/guidance-on-ai-and-data-protection/"
        }
      ]
    },
    {
      title: "Data Security Standards",
      subtitle: "Technical and organizational security measures",
      description: "Comprehensive security framework ensuring confidentiality, integrity, and availability of personal data.",
      icon: Lock,
      color: "bg-purple-500",
      lastUpdated: "October 2024",
      requirements: [
        "Encryption of personal data in transit and at rest",
        "Access controls and authentication mechanisms",
        "Regular security testing and vulnerability assessments",
        "Incident response and business continuity plans",
        "Secure data disposal and destruction procedures",
        "Third-party vendor security assessments",
        "Employee security training and awareness",
        "Multi-factor authentication for admin access"
      ],
      compliance: [
        "End-to-end encryption using TLS 1.3+ and AES-256",
        "Role-based access control with principle of least privilege",
        "Automated vulnerability scanning and penetration testing",
        "Comprehensive incident response plan with 24/7 SOC",
        "Secure data deletion with cryptographic erasure",
        "Third-party security assessments and due diligence",
        "Annual security awareness training for all staff",
        "MFA implemented across all administrative interfaces"
      ],
      resources: [
        {
          title: "Security Architecture Overview",
          type: "PDF",
          url: "/compliance/security-architecture.pdf"
        },
        {
          title: "Incident Response Plan",
          type: "PDF",
          url: "/compliance/incident-response-plan.pdf"
        },
        {
          title: "Penetration Testing Report",
          type: "PDF",
          url: "/compliance/penetration-testing-report.pdf"
        }
      ]
    },
    {
      title: "Industry-Specific Compliance",
      subtitle: "Sector-specific regulatory requirements",
      description: "Specialized compliance frameworks for healthcare, legal, financial services, and other regulated industries.",
      icon: Building,
      color: "bg-orange-500",
      lastUpdated: "October 2024",
      requirements: [
        "Healthcare: NHS Data Security & Protection Toolkit",
        "Legal: SRA compliance and client confidentiality",
        "Finance: FCA regulatory reporting requirements",
        "Education: DfE data processing standards",
        "Public Sector: Government security classifications",
        "Insurance: ICOBS and data protection rules",
        "Retail: PCI DSS compliance for payment data",
        "Professional Services: ICAEW data protection guidance"
      ],
      compliance: [
        "Healthcare: DSP Toolkit Level 3 compliance achieved",
        "Legal: SRA-compliant client data management systems",
        "Finance: FCA-approved data processing workflows",
        "Education: Age-appropriate design compliance verified",
        "Public Sector: OFFICIAL security classification met",
        "Insurance: ICOBS-compliant customer data handling",
        "Retail: PCI DSS Level 1 compliance for payment processing",
        "Professional Services: ICAEW data protection standards"
      ],
      resources: [
        {
          title: "Healthcare DSP Toolkit Evidence",
          type: "PDF",
          url: "/compliance/healthcare-dsp-toolkit.pdf"
        },
        {
          title: "Legal SRA Compliance Statement",
          type: "PDF",
          url: "/compliance/sra-compliance-statement.pdf"
        },
        {
          title: "Financial Services FCA Declaration",
          type: "PDF",
          url: "/compliance/fca-declaration.pdf"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-900/20 dark:to-blue-900/20">
      {/* Floating Navigation */}
      <FloatingNavigation />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative py-16 md:py-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.2),transparent_50%)]" />

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge className="mb-4 px-4 py-2 text-sm bg-slate-100 text-slate-800 border-slate-200">
                <Shield className="w-4 h-4 mr-2" />
                Legal Compliance
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-slate-600 to-gray-900 bg-clip-text text-transparent leading-tight"
            >
              UK Compliance & Data Protection
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Comprehensive compliance with UK data protection laws, industry regulations, and security standards. Your data protection and privacy compliance partner.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Compliance Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-6">
              Comprehensive Compliance Framework
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-600 mb-8">
              Our AI automation platform meets and exceeds all UK data protection requirements while maintaining the highest standards of security and privacy.
            </motion.p>

            {/* Compliance Badges */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "GDPR Compliant", icon: CheckCircle, color: "text-green-600" },
                { name: "DPA 2018 Ready", icon: CheckCircle, color: "text-blue-600" },
                { name: "ICO Registered", icon: CheckCircle, color: "text-purple-600" },
                { name: "Cyber Essentials", icon: Shield, color: "text-orange-600" }
              ].map((badge, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                  <badge.icon className={`w-8 h-8 ${badge.color} mb-2`} />
                  <span className="text-sm font-semibold text-gray-900">{badge.name}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Compliance Sections */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-8">
              {complianceSections.map((section, index) => (
                <ComplianceSection key={index} section={section} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
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
                Need Legal Advice?
              </Badge>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white dark:text-gray-100 mb-6"
            >
              Speak with Our Compliance Team
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Have specific compliance questions or need guidance on data protection requirements for your industry? Our compliance experts are here to help.
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
                  className="px-8 py-4 text-lg bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Schedule Compliance Consultation
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
                  <Download className="w-5 h-5 mr-2" />
                  Download Compliance Pack
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}