export interface BusinessKnowledge {
  company: {
    name: string;
    description: string;
    services: string[];
    industries: string[];
    valueProposition: string;
  };
  industries: Record<string, IndustryKnowledge>;
  services: Record<string, ServiceKnowledge>;
  faqs: FAQItem[];
  conversationTemplates: ConversationTemplate[];
}

export interface IndustryKnowledge {
  description: string;
  challenges: string[];
  solutions: string[];
  caseStudies: string[];
  keywords: string[];
}

export interface ServiceKnowledge {
  description: string;
  features: string[];
  benefits: string[];
  pricing?: string;
  timeline?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

export interface ConversationTemplate {
  trigger: string[];
  response: string;
  followUp?: string[];
  leadIntent?: boolean;
  voiceOptimized?: boolean;
  voiceTone?: 'professional' | 'conversational' | 'enthusiastic' | 'patient' | 'clear';
  voicePauses?: string[]; // Array of pause points for better voice delivery
}

export const businessKnowledge: BusinessKnowledge = {
  company: {
    name: "Robofy",
    description: "All-in-one AI transformation platform that creates NextJS websites with automated lead generation, voice appointment booking, and 24/7 calendar & mail assistant for small & medium businesses.",
    services: [
      "AI-Powered NextJS Websites",
      "Automated Lead Generation",
      "Voice Appointment Booking",
      "Smart Calendar Management",
      "24/7 AI Mail Assistant",
      "Real-Time Analytics & Automation",
      "CRM Integration & Automation"
    ],
    industries: [
      "Fitness & Gyms",
      "Yoga & Wellness Studios",
      "Healthcare & Dental Practices",
      "Beauty Salons & Spas",
      "Professional Services",
      "Retail & E-commerce",
      "Event Management",
      "Pet Care Services",
      "Child Care Centers",
      "Travel Agencies",
      "Accounting Firms",
      "Property Development"
    ],
    valueProposition: "Transform your business with AI that works while you sleep - turn visitors into confirmed appointments in 60 seconds."
  },

  industries: {
    beauty: {
      description: "Beauty industry including salons, spas, cosmetic clinics, and wellness centers",
      challenges: [
        "High competition in local markets",
        "Seasonal fluctuations in demand",
        "Customer retention and loyalty",
        "Online booking and scheduling",
        "Social media presence and engagement"
      ],
      solutions: [
        "Automated booking systems with AI scheduling",
        "Social media content automation",
        "Customer loyalty programs",
        "ROI-driven marketing campaigns",
        "Professional website design"
      ],
      caseStudies: [
        "70s Retro Salon - Vintage design meets modern automation",
        "Spa booking system with AI recommendations"
      ],
      keywords: ["salon", "spa", "beauty", "wellness", "booking", "appointment"]
    },
    dental: {
      description: "Dental practices, orthodontics, oral surgery, and dental specialists",
      challenges: [
        "Patient acquisition and retention",
        "Appointment scheduling and reminders",
        "Insurance processing",
        "Patient education and communication",
        "Online reputation management"
      ],
      solutions: [
        "Automated appointment reminders",
        "Patient education content",
        "Insurance claim processing",
        "Review management systems",
        "Dental SEO optimization"
      ],
      caseStudies: [
        "Modern dental practice websites",
        "Automated patient communication systems"
      ],
      keywords: ["dentist", "dental", "orthodontist", "appointment", "patient"]
    },
    healthcare: {
      description: "Medical practices, clinics, hospitals, and healthcare providers",
      challenges: [
        "Patient engagement and communication",
        "Appointment management",
        "Medical content creation",
        "HIPAA compliance",
        "Online reputation and reviews"
      ],
      solutions: [
        "Patient portal systems",
        "Automated appointment management",
        "Educational content creation",
        "Secure communication platforms",
        "Healthcare SEO optimization"
      ],
      caseStudies: [
        "Physician practice websites",
        "Healthcare content marketing"
      ],
      keywords: ["healthcare", "medical", "physician", "clinic", "patient"]
    },
    fitness: {
      description: "Gyms, fitness studios, personal trainers, and sports facilities",
      challenges: [
        "Member acquisition and retention",
        "Class scheduling and booking",
        "Community engagement",
        "Personal training programs",
        "Equipment and facility management"
      ],
      solutions: [
        "Member management systems",
        "Class booking automation",
        "Community platforms",
        "Personal training scheduling",
        "Fitness content marketing"
      ],
      caseStudies: [
        "Modern gym websites with booking",
        "Fitness studio automation"
      ],
      keywords: ["gym", "fitness", "trainer", "workout", "membership"]
    },
    retail: {
      description: "Retail stores, e-commerce, boutiques, and product-based businesses",
      challenges: [
        "Online presence and sales",
        "Inventory management",
        "Customer relationship management",
        "Product recommendations",
        "Omnichannel marketing"
      ],
      solutions: [
        "E-commerce website development",
        "Inventory automation",
        "Customer retention systems",
        "AI product recommendations",
        "Multi-channel marketing"
      ],
      caseStudies: [
        "Retail website transformations",
        "E-commerce automation"
      ],
      keywords: ["retail", "store", "shop", "product", "inventory"]
    },
    solar: {
      description: "Solar energy companies, installation services, and green energy providers",
      challenges: [
        "Lead generation and qualification",
        "Complex product explanations",
        "ROI calculations and presentations",
        "Customer education",
        "Competitive market positioning"
      ],
      solutions: [
        "Solar lead generation systems",
        "ROI calculators and tools",
        "Educational content platforms",
        "Customer financing options",
        "Solar industry SEO"
      ],
      caseStudies: [
        "Solar company websites",
        "Green energy marketing"
      ],
      keywords: ["solar", "energy", "renewable", "installation", "quote"]
    }
  },

  services: {
    "ai-website-builder": {
      description: "Custom websites built with AI optimization for maximum conversions",
      features: [
        "AI-powered design suggestions",
        "Mobile-responsive layouts",
        "SEO optimization",
        "Fast loading speeds",
        "Conversion-focused elements"
      ],
      benefits: [
        "Professional appearance",
        "Better search rankings",
        "More leads and sales",
        "Mobile-friendly experience",
        "Ongoing optimization"
      ]
    },
    "seo-optimization": {
      description: "Complete SEO strategy and implementation for better search visibility",
      features: [
        "Keyword research and analysis",
        "On-page optimization",
        "Technical SEO fixes",
        "Content creation",
        "Performance monitoring"
      ],
      benefits: [
        "Higher search rankings",
        "More organic traffic",
        "Better lead quality",
        "Competitive advantage",
        "Measurable results"
      ]
    },
    "content-marketing": {
      description: "Strategic content creation and distribution for audience engagement",
      features: [
        "Blog content creation",
        "Social media content",
        "Email marketing campaigns",
        "Industry-specific articles",
        "Content performance tracking"
      ],
      benefits: [
        "Thought leadership positioning",
        "Increased brand awareness",
        "Better customer engagement",
        "More website traffic",
        "Higher conversion rates"
      ]
    },
    "lead-generation": {
      description: "Automated systems to capture and nurture potential customers",
      features: [
        "Contact form optimization",
        "Lead magnet creation",
        "CRM integration",
        "Lead scoring and routing",
        "Follow-up automation"
      ],
      benefits: [
        "More qualified leads",
        "Better conversion rates",
        "Automated nurturing",
        "Sales team efficiency",
        "Revenue growth"
      ]
    }
  },

  faqs: [
    {
      question: "How much does a website cost?",
      answer: "Website costs vary based on complexity and features. Basic sites start at $2,000, while comprehensive business websites with advanced features range from $5,000-$15,000. We offer flexible payment plans and ROI-driven pricing.",
      category: "pricing",
      keywords: ["cost", "price", "pricing", "budget", "investment"]
    },
    {
      question: "How long does it take to build a website?",
      answer: "Most websites are completed within 2-4 weeks, depending on complexity and content requirements. We use AI-powered tools to accelerate development while maintaining quality and customization.",
      category: "timeline",
      keywords: ["timeline", "duration", "deadline", "when", "complete"]
    },
    {
      question: "Do you work with small businesses?",
      answer: "Absolutely! We specialize in helping small and medium-sized businesses establish a professional online presence. Our AI-powered platform makes enterprise-level websites accessible to businesses of all sizes.",
      category: "services",
      keywords: ["small business", "startup", "local", "company size"]
    },
    {
      question: "What industries do you specialize in?",
      answer: "We have deep expertise across beauty, dental, healthcare, fitness, retail, and solar industries. Our industry-specific knowledge ensures your website speaks directly to your target customers.",
      category: "industries",
      keywords: ["industry", "specialization", "expertise", "focus"]
    },
    {
      question: "Can you help with SEO and online marketing?",
      answer: "Yes! SEO and digital marketing are core parts of our service. We build websites with SEO best practices and offer ongoing marketing automation to help you attract and convert more customers.",
      category: "services",
      keywords: ["seo", "marketing", "optimization", "traffic", "leads"]
    }
  ],

  conversationTemplates: [
    {
      trigger: ["hello", "hi", "hey", "good morning", "good afternoon"],
      response: "Hello! I'm here to help you learn about Robofy's AI-powered website building and marketing automation services. What specific industry are you in, or what questions do you have about getting a professional website?",
      followUp: [
        "What type of business do you have?",
        "Are you looking to generate more leads?",
        "Do you need help with SEO and online visibility?"
      ],
      voiceOptimized: true,
      voiceTone: 'conversational',
      voicePauses: ["200ms", "400ms"]
    },
    {
      trigger: ["cost", "price", "pricing", "budget", "expensive"],
      response: "Great question! Our pricing depends on your specific needs and business goals. We offer packages starting from $2,000 for basic websites, up to $15,000 for comprehensive marketing automation systems. Most importantly, we focus on ROI - our websites typically pay for themselves within 3-6 months through increased leads and sales.",
      followUp: [
        "What's your budget range?",
        "What features are most important to you?",
        "Are you looking for ongoing marketing support?"
      ],
      leadIntent: true,
      voiceOptimized: true,
      voiceTone: 'professional',
      voicePauses: ["300ms", "200ms", "400ms"]
    },
    {
      trigger: ["time", "timeline", "deadline", "when", "quick"],
      response: "Most websites are completed within 2-4 weeks! We use AI-powered tools that accelerate development while maintaining high quality. The exact timeline depends on project complexity and how quickly we can gather your content and requirements.",
      followUp: [
        "What's your ideal launch timeline?",
        "Do you have content ready, or do you need help creating it?",
        "Are there any specific deadlines I should know about?"
      ],
      voiceOptimized: true,
      voiceTone: 'enthusiastic',
      voicePauses: ["200ms", "300ms", "200ms"]
    },
    {
      trigger: ["leads", "customers", "sales", "marketing", "grow"],
      response: "Lead generation is one of our specialties! Our websites are built with conversion optimization in mind, and we can integrate marketing automation, CRM systems, and lead nurturing workflows. Many clients see 2-3x more qualified leads within the first month.",
      followUp: [
        "What type of leads are you looking to generate?",
        "Do you have a CRM system you'd like to integrate?",
        "What's your current lead generation process like?"
      ],
      leadIntent: true
    },
    {
      trigger: ["seo", "google", "ranking", "traffic", "visibility"],
      response: "SEO is built into everything we do! We optimize for local search, industry-specific keywords, and user experience. Our websites typically rank on the first page of Google within 3-6 months, and we provide ongoing optimization to maintain and improve rankings.",
      followUp: [
        "What are your main target keywords?",
        "Do you serve local customers or a wider area?",
        "Are you currently tracking your search rankings?"
      ],
      leadIntent: true
    },
    // Voice-optimized templates
    {
      trigger: ["voice", "speak", "talk", "audio", "sound"],
      response: "I can speak to you using natural voice synthesis! This makes our conversation more personal and accessible. I can adjust my speaking speed, tone, and style to better suit your preferences. Would you like me to continue speaking, or would you prefer to type?",
      followUp: [
        "Would you like me to speak slower or faster?",
        "Do you prefer a different voice style?",
        "What specific questions do you have about our services?"
      ],
      voiceOptimized: true,
      voiceTone: 'conversational',
      voicePauses: ["300ms", "500ms", "200ms"]
    },
    {
      trigger: ["repeat", "again", "say that again", "pardon", "excuse me"],
      response: "Of course, I'd be happy to repeat that for you. Let me say that again more clearly.",
      followUp: [
        "Was that clearer?",
        "Would you like me to speak slower?",
        "Is there anything specific you'd like me to explain further?"
      ],
      voiceOptimized: true,
      voiceTone: 'patient',
      voicePauses: ["400ms", "300ms"]
    },
    {
      trigger: ["speak louder", "speak softer", "volume", "too loud", "too quiet"],
      response: "I can help you adjust the voice settings for better clarity. For now, I'll continue with clear, comfortable volume levels. You can also adjust the volume in your voice settings panel.",
      followUp: [
        "Would you like me to speak slower or faster instead?",
        "Is the volume better now?",
        "Would you like to adjust other voice settings?"
      ],
      voiceOptimized: true,
      voiceTone: 'conversational',
      voicePauses: ["200ms", "400ms"]
    },
    {
      trigger: ["faster", "slower", "speed", "too fast", "too slow"],
      response: "I can adjust my speaking speed to better suit your listening preferences. The current speed seems to work well for most people, but I can make it faster or slower if you'd like.",
      followUp: [
        "Would you like me to speak faster or slower?",
        "Is this speed more comfortable for you?",
        "Would you like to adjust the speed in your voice settings?"
      ],
      voiceOptimized: true,
      voiceTone: 'patient',
      voicePauses: ["300ms", "200ms"]
    },
    {
      trigger: ["change voice", "different voice", "another voice", "voice options"],
      response: "I have several voice options available, each with different characteristics. Rachel is professional and clear, Domi is warm and engaging, and Bella is articulate and precise. You can choose your preferred voice in the settings panel.",
      followUp: [
        "Which voice style appeals to you most?",
        "Would you like me to demonstrate the different voices?",
        "Do you have a preference for speaking style?"
      ],
      voiceOptimized: true,
      voiceTone: 'conversational',
      voicePauses: ["400ms", "200ms", "300ms"]
    }
  ]
};

export default businessKnowledge;