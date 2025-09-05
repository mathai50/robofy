import type { Metadata } from 'next';
import ContactForm from '@/components/ui/ContactForm';
import CalendarWidget from '@/components/ui/CalendarWidget';
import ContactDetails from '@/components/ui/ContactDetails';

export const metadata: Metadata = {
  title: 'Contact Us - Robofy',
  description: 'Get in touch with Robofy to discuss AI-powered digital marketing solutions. Schedule a demo, send us a message, or reach out directly. We\'re here to help transform your business.',
  keywords: 'contact Robofy, AI marketing, digital marketing, schedule demo, business inquiry',
  openGraph: {
    title: 'Contact Us - Robofy',
    description: 'Get in touch with Robofy to discuss AI-powered digital marketing solutions.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Robofy',
    description: 'Get in touch with Robofy to discuss AI-powered digital marketing solutions.',
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="min-h-[50vh] w-full relative bg-gradient-to-br from-blue-900 via-black to-purple-900 flex items-center justify-center overflow-hidden py-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-purple-500/10"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent font-source-code-pro">
            Contact Us
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 font-source-code-pro">
            Ready to transform your business with AI-powered digital marketing? Let's start the conversation.
          </p>
        </div>
      </section>

      <div className="min-h-screen bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content Grid - Contact Form, Calendar, and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Contact Form - Left Column */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Right Column - Calendar and Contact Details */}
            <div className="space-y-8">
              <CalendarWidget 
                calendlyUsername="robofy" 
                eventType="meeting"
              />
              <ContactDetails />
            </div>
          </div>

          {/* Stats Section */}
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-12 text-white font-source-code-pro">
              Why Businesses Choose Robofy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-gray-300 font-source-code-pro">Successful Projects</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">99%</div>
                <div className="text-gray-300 font-source-code-pro">Client Satisfaction</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-300 font-source-code-pro">AI Support</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-yellow-400 mb-2">3x</div>
                <div className="text-gray-300 font-source-code-pro">Average ROI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}