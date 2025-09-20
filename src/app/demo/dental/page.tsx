'use client';

import React from 'react';
import { Phone, MapPin, Clock, Activity, Sparkles, Stethoscope } from 'lucide-react';
import { dentalBusiness, dentalServices, dentalTestimonials, generateBusinessSchema } from '@/config/demo-businesses';

const DentistDemoPage = () => {
  // Generate JSON-LD schema
  const dentalSchema = generateBusinessSchema(dentalBusiness, dentalServices, dentalTestimonials);

  // This function would trigger the Robofy voice agent (Harper/Casey)
  const handleBookingClick = () => {
    console.log("Initiating appointment booking with Robofy AI Agent...");
    // In a real app, you would call the ElevenLabs/Twilio integration here.
    alert("Our AI assistant will call you shortly to book your appointment!");
  };

  return (
    <div className="bg-gray-900 text-gray-200 font-sans">
      {/* Header */}
      <header className="bg-black sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            <Activity className="inline-block mr-2" />
            {dentalBusiness.name}
          </div>
          <div className="flex items-center space-x-4">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <button
              onClick={handleBookingClick}
              className="bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Book Online
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center filter grayscale"
        style={{ backgroundImage: `url('${dentalBusiness.heroImage}')` }}
      >
        {/* This overlay improves text readability over the background image */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">{dentalBusiness.heroSlogan}</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {dentalBusiness.description}
          </p>
          <button
            onClick={handleBookingClick}
            className="bg-white text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
          >
            Schedule Your Visit
          </button>
        </div>
        {/* Photo by Sam Moghadam on Unsplash */}
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-2">Our Services</h2>
          <p className="text-gray-400 mb-12">Comprehensive care for a healthy, beautiful smile.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <Activity className="mx-auto mb-4 h-12 w-12 text-white" />
              <h3 className="text-2xl font-semibold mb-2">{dentalServices[0].title}</h3>
              <p className="text-gray-400">{dentalServices[0].description}</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-white" />
              <h3 className="text-2xl font-semibold mb-2">{dentalServices[1].title}</h3>
              <p className="text-gray-400">{dentalServices[1].description}</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <Stethoscope className="mx-auto mb-4 h-12 w-12 text-white" />
              <h3 className="text-2xl font-semibold mb-2">{dentalServices[2].title}</h3>
              <p className="text-gray-400">{dentalServices[2].description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2940&auto=format&fit=crop"
              alt="Dr. Evelyn Reed"
              className="rounded-lg shadow-2xl filter grayscale"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-4">Meet Dr. Evelyn Reed</h2>
            <p className="text-gray-400 mb-6">
              Dr. Reed combines years of experience with a passion for technology to provide the highest level of dental care. She is dedicated to creating a comfortable and stress-free environment for every patient.
            </p>
            <div className="border-l-4 border-gray-700 pl-4">
              <p className="text-lg italic">"Our goal is to blend artistry with science, ensuring every patient leaves with a healthy and confident smile. With our 24/7 AI-powered booking, scheduling your visit has never been easier."</p>
              <p className="mt-4 font-semibold">- Dr. Evelyn Reed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">The Pearly Whites Difference</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Advanced Technology</h3>
              <p className="text-gray-400">We use the latest in dental tech for more precise, comfortable, and efficient treatments.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Patient-Centered Care</h3>
              <p className="text-gray-400">Your comfort and health are our top priorities. We tailor every treatment to your unique needs.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">24/7 AI Booking</h3>
              <p className="text-gray-400">Our AI assistant, powered by Robofy, is available anytime to book your appointment over the phone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="contact" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready for a Brighter Smile?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Contact us today to schedule your first visit. Our AI assistant is ready to take your call, or you can book online in seconds.
          </p>
          <button
            onClick={handleBookingClick}
            className="bg-white text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
          >
            Book Your Appointment Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-10">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              <span>{dentalBusiness.phone}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{dentalBusiness.address}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{dentalBusiness.hours}</span>
            </div>
          </div>
          <p>&copy; {new Date().getFullYear()} {dentalBusiness.name}. All Rights Reserved.</p>
          <p className="text-sm text-gray-600 mt-2">
            Scheduling powered by <a href="/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Robofy AI</a>
          </p>
        </div>
      </footer>

      {/* SEO and LLM-Friendly Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dentalSchema) }}
      />
    </div>
  );
};

export default DentistDemoPage;