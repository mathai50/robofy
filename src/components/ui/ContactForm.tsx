'use client';

import React, { useState, useEffect } from 'react';
import { createLead, ApiResponse } from '@/lib/api';

// Extend Window interface for analytics tracking
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  businessSize: string;
  budget: string;
  timeline: string;
  leadSource: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  gdprConsent: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
  businessSize?: string;
  budget?: string;
  timeline?: string;
  gdprConsent?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    businessSize: '',
    budget: '',
    timeline: '',
    leadSource: 'website',
    utmSource: undefined,
    utmMedium: undefined,
    utmCampaign: undefined,
    gdprConsent: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Track UTM parameters for lead source attribution
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');

      if (utmSource || utmMedium || utmCampaign) {
        setFormData(prev => ({
          ...prev,
          utmSource: utmSource || undefined,
          utmMedium: utmMedium || undefined,
          utmCampaign: utmCampaign || undefined,
          leadSource: utmSource ? `utm_${utmSource}` : 'website'
        }));
      }
    }
  }, []);

  // Track form interactions for analytics
  const trackFormInteraction = (action: string, field?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: 'Contact Form',
        event_label: field || action,
        value: formData.subject || 'general'
      });
    }

    // Meta Pixel tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', `Form${action}`, {
        form_field: field || action,
        form_subject: formData.subject || 'general'
      });
    }
  };

  // Helper function to parse budget value for analytics
  const parseBudgetValue = (budget: string): number => {
    const budgetMap: { [key: string]: number } = {
      'under-1k': 500,
      '1k-5k': 3000,
      '5k-10k': 7500,
      '10k-25k': 17500,
      '25k-50k': 37500,
      'over-50k': 75000
    };
    return budgetMap[budget] || 0;
  };

  // Handle CRM integration and success callbacks
  const handleCRMSuccess = async (response: ApiResponse): Promise<void> => {
    try {
      // Example CRM integrations - uncomment and configure as needed

      // HubSpot CRM integration
      // if (process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID) {
      //   await fetch('/api/crm/hubspot', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       leadData: formData,
      //       leadId: response.data?.leadId
      //     })
      //   });
      // }

      // Salesforce integration
      // if (process.env.NEXT_PUBLIC_SALESFORCE_INSTANCE_URL) {
      //   await fetch('/api/crm/salesforce', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       leadData: formData,
      //       leadId: response.data?.leadId
      //     })
      //   });
      // }

      // Slack notification for high-value leads
      if (formData.budget === 'over-50k' || formData.businessSize === 'enterprise') {
        await notifyTeamHighValueLead(formData);
      }

      // Custom webhook for external integrations
      await fetch('https://ai.robofy.uk/webhook-test/db241042-fc25-490b-9159-3c264fb5fcb5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'lead_generated',
          leadData: formData,
          timestamp: new Date().toISOString()
        })
      });

      console.log('CRM callbacks completed successfully');
    } catch (error) {
      console.error('CRM callback error:', error);
      // Don't fail the form submission if CRM callbacks fail
    }
  };

  // Notify team about high-value leads
  const notifyTeamHighValueLead = async (leadData: FormData): Promise<void> => {
    try {
      // This would typically send a Slack notification or email
      console.log('High-value lead notification:', {
        company: leadData.company,
        budget: leadData.budget,
        businessSize: leadData.businessSize,
        subject: leadData.subject
      });
    } catch (error) {
      console.error('Failed to notify team:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    // Company validation
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    } else if (formData.company.trim().length < 2) {
      newErrors.company = 'Company name must be at least 2 characters';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    // GDPR consent validation
    if (!formData.gdprConsent) {
      newErrors.gdprConsent = 'You must agree to the privacy policy to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      trackFormInteraction('form_validation_error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    // Retry mechanism for failed submissions
    const submitWithRetry = async (attempt: number = 1, maxRetries: number = 3): Promise<void> => {
      try {
        const response: ApiResponse = await createLead({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company,
          industry: formData.subject,
          message: formData.message,
          businessSize: formData.businessSize || undefined,
          budget: formData.budget || undefined,
          timeline: formData.timeline || undefined,
          leadSource: formData.leadSource,
          utmSource: formData.utmSource,
          utmMedium: formData.utmMedium,
          utmCampaign: formData.utmCampaign,
          gdprConsent: formData.gdprConsent
        });

        if (response.error) {
          throw new Error(response.error);
        }

        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
        setRetryCount(0);

        // Track successful form submission
        trackFormInteraction('form_submission_success', formData.subject);
        trackFormInteraction('Lead', 'generated');

        // Track conversion for Meta Pixel
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Lead', {
            value: formData.budget ? parseBudgetValue(formData.budget) : 0,
            currency: 'USD',
            content_name: formData.subject || 'general',
            content_category: 'contact_form'
          });
        }

        // CRM Integration callbacks
        await handleCRMSuccess(response);

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          businessSize: '',
          budget: '',
          timeline: '',
          leadSource: 'website',
          utmSource: undefined,
          utmMedium: undefined,
          utmCampaign: undefined,
          gdprConsent: false
        });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';

        // Retry logic for network errors
        if (attempt < maxRetries && (
          errorMessage.includes('network') ||
          errorMessage.includes('fetch') ||
          errorMessage.includes('timeout')
        )) {
          setRetryCount(attempt);
          setSubmitMessage(`Retrying... (Attempt ${attempt + 1}/${maxRetries})`);

          setTimeout(() => {
            submitWithRetry(attempt + 1, maxRetries);
          }, 1000 * attempt); // Exponential backoff

          return;
        }

        setSubmitStatus('error');
        setRetryCount(0);

        // Provide specific error messages
        let userMessage = 'Sorry, there was an error sending your message. Please try again or contact us directly.';

        if (errorMessage.includes('GDPR')) {
          userMessage = 'Please accept the privacy policy to continue.';
        } else if (errorMessage.includes('email')) {
          userMessage = 'Please enter a valid email address.';
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          userMessage = 'Network error. Please check your connection and try again.';
        }

        setSubmitMessage(userMessage);

        // Track failed submission
        trackFormInteraction('form_submission_error', errorMessage);

        console.error('Form submission error:', err);
      } finally {
        setIsSubmitting(false);
      }
    };

    await submitWithRetry();
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white font-inter">
        Send Us a Message
      </h2>
      
      {submitStatus === 'success' && (
        <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-md mb-6">
          {submitMessage}
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-md mb-6">
          {submitMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400 font-inter">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400 font-inter">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter ${
                errors.phone ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400 font-inter">{errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Subject *
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter ${
                errors.subject ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Select your primary interest</option>
              <option value="ai-automation">AI Marketing Automation</option>
              <option value="lead-generation">Lead Generation & CRM</option>
              <option value="content-marketing">AI Content Marketing</option>
              <option value="social-media">Social Media Automation</option>
              <option value="email-marketing">Email Marketing Solutions</option>
              <option value="analytics">Marketing Analytics & ROI</option>
              <option value="custom-integration">Custom Integration</option>
              <option value="enterprise-solution">Enterprise Solution</option>
              <option value="demo-request">Schedule a Demo</option>
              <option value="partnership">Partnership Opportunity</option>
              <option value="support">Technical Support</option>
              <option value="other">Other</option>
            </select>
            {errors.subject && (
              <p className="mt-1 text-sm text-red-400 font-inter">{errors.subject}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter ${
                errors.company ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Your company name"
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-400 font-inter">{errors.company}</p>
            )}
          </div>

          <div>
            <label htmlFor="businessSize" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Business Size
            </label>
            <select
              id="businessSize"
              name="businessSize"
              value={formData.businessSize}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter ${
                errors.businessSize ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Select business size</option>
              <option value="startup">Startup (1-10 employees)</option>
              <option value="small">Small Business (11-50 employees)</option>
              <option value="medium">Medium Business (51-200 employees)</option>
              <option value="large">Large Business (201-1000 employees)</option>
              <option value="enterprise">Enterprise (1000+ employees)</option>
            </select>
            {errors.businessSize && (
              <p className="mt-1 text-sm text-red-400 font-inter">{errors.businessSize}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Monthly Marketing Budget
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter ${
                errors.budget ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Select budget range</option>
              <option value="under-1k">Under $1,000</option>
              <option value="1k-5k">$1,000 - $5,000</option>
              <option value="5k-10k">$5,000 - $10,000</option>
              <option value="10k-25k">$10,000 - $25,000</option>
              <option value="25k-50k">$25,000 - $50,000</option>
              <option value="over-50k">Over $50,000</option>
            </select>
            {errors.budget && (
              <p className="mt-1 text-sm text-red-400 font-inter">{errors.budget}</p>
            )}
          </div>

          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
              Implementation Timeline
            </label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter ${
                errors.timeline ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Select timeline</option>
              <option value="asap">ASAP (within 2 weeks)</option>
              <option value="1-month">Within 1 month</option>
              <option value="2-3-months">2-3 months</option>
              <option value="3-6-months">3-6 months</option>
              <option value="planning">Still in planning phase</option>
            </select>
            {errors.timeline && (
              <p className="mt-1 text-sm text-red-400 font-inter">{errors.timeline}</p>
            )}
          </div>
        </div>

        {/* Conditional fields based on business size */}
        {formData.businessSize === 'enterprise' && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-blue-300 mb-2 font-inter">Enterprise Features</h4>
            <p className="text-xs text-blue-200 font-inter">
              For enterprise clients, we offer custom integrations, dedicated support, and advanced AI solutions.
              Our team will contact you within 4 hours.
            </p>
          </div>
        )}

        {/* Conditional fields based on subject */}
        {(formData.subject === 'custom-integration' || formData.subject === 'enterprise-solution') && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6">
            <label htmlFor="technicalRequirements" className="block text-sm font-medium text-purple-300 mb-2 font-inter">
              Technical Requirements
            </label>
            <textarea
              id="technicalRequirements"
              name="technicalRequirements"
              rows={3}
              value={formData.message.includes('Technical requirements:') ? formData.message.split('Technical requirements:')[1]?.trim() : ''}
              onChange={(e) => {
                const baseMessage = formData.message.split('Technical requirements:')[0]?.trim() || '';
                const technicalReqs = e.target.value ? `Technical requirements: ${e.target.value}` : '';
                setFormData(prev => ({
                  ...prev,
                  message: [baseMessage, technicalReqs].filter(Boolean).join('\n\n')
                }));
              }}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-inter"
              placeholder="Describe your technical requirements, current systems, or integration needs..."
            />
          </div>
        )}

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter ${
              errors.message ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Tell us about your project or how we can help you..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-400 font-inter">{errors.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="gdprConsent"
              name="gdprConsent"
              checked={formData.gdprConsent}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, gdprConsent: e.target.checked }));
                if (errors.gdprConsent) {
                  setErrors(prev => ({ ...prev, gdprConsent: undefined }));
                }
              }}
              disabled={isSubmitting}
              className={`mt-1 h-4 w-4 text-blue-600 bg-white/5 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 ${
                errors.gdprConsent ? 'border-red-500' : ''
              }`}
            />
            <label htmlFor="gdprConsent" className="text-sm text-gray-300 font-inter">
              I agree to allow Robofy to store and process my personal data as described in the{' '}
              <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                Privacy Policy
              </a>
              . I understand I can unsubscribe at any time.*
            </label>
          </div>
          {errors.gdprConsent && (
            <p className="text-sm text-red-400 font-inter">{errors.gdprConsent}</p>
          )}

          <div className="text-xs text-gray-400 font-inter">
            <p>
              By submitting this form, you consent to receiving marketing communications from Robofy.
              We respect your privacy and will never share your information with third parties.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-inter"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Message...
            </span>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}