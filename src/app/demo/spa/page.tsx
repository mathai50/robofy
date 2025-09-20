'use client';

import React from 'react';
import Head from 'next/head';
import { spaBusiness, spaServices, spaTestimonials, generateBusinessSchema } from '@/config/demo-businesses';
import { Phone, Mail, MapPin, Clock, Award, Leaf, Users, Smile } from 'lucide-react';

export default function RetroSpaPage() {
  const phoneNumber = spaBusiness.phone;
  const spaName = spaBusiness.name;

  // This function would trigger the Robofy voice agent for appointment booking
  const handleBookingClick = () => {
    console.log("Initiating spa appointment booking with Robofy AI Agent...");
    // In a real app, this would call the ElevenLabs/Twilio integration
    alert("Our AI assistant will call you shortly to book your spa appointment!");
  };

  // Generate comprehensive JSON-LD structured data for SEO
  const jsonLd = generateBusinessSchema(spaBusiness, spaServices, spaTestimonials);

  return (
    <>
      <Head>
        <title>Vintage Vibes Spa - Retro 70s Inspired Wellness Experience</title>
        <meta name="description" content="Reawaken your senses with our vintage-inspired spa experience. Relax, rejuvenate, and revitalize with our signature therapeutic massages, facials, and wellness treatments." />
        <meta name="keywords" content="spa near me, massage spa, facial spa, couples massage, hot stone massage, ayurvedic spa, wellness spa, body wrap spa, luxury spa packages" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="min-h-screen bg-[#111111] retro-spa-theme font-sans text-gray-200">
        {/* CSS Variables for Retro 70s Palette */}
        <style jsx>{`
          .retro-spa-theme {
            --mustard-yellow: #D4AF37; /* Accent color for buttons and highlights */
            --avocado-green: #708238; /* Secondary color for icons and accents */
            --deep-maroon: #5C0011; /* Text color on light backgrounds */
          }
        `}</style>

        {/* Header */}
        <header className="bg-transparent absolute top-0 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white font-serif">{spaName}</h1>
              <nav className="hidden md:flex space-x-8">
                <a href="#about" className="text-white hover:text-[var(--mustard-yellow)] transition-colors">About</a>
                <a href="#services" className="text-white hover:text-[var(--mustard-yellow)] transition-colors">Services</a>
                <a href="#testimonials" className="text-white hover:text-[var(--mustard-yellow)] transition-colors">Testimonials</a>
                <a href="#booking" className="text-white hover:text-[var(--mustard-yellow)] transition-colors">Booking</a>
              </nav>
              <button
                onClick={handleBookingClick}
                className="bg-[var(--mustard-yellow)] text-[var(--deep-maroon)] px-6 py-2 rounded-lg font-semibold hover:bg-[var(--avocado-green)] hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Book Now
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section
          className="relative bg-black min-h-screen flex items-center overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url(/assets/images/retro-pattern.svg)'}}></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-20">
            <div className="text-white text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 font-serif leading-tight">
                {spaBusiness.heroSlogan}
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={handleBookingClick}
                  className="bg-[var(--mustard-yellow)] text-[var(--deep-maroon)] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white transition-colors mx-auto md:mx-0"
                >
                  Book Your Escape
                </button>
              </div>
            </div>
            <div className="relative h-[60vh] md:h-auto md:aspect-[4/5]">
              <img
                src={spaBusiness.heroImage}
                alt="Woman relaxing at a spa"
                className="w-full h-full object-cover rounded-lg shadow-2xl shadow-black/30"
                style={{clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)'}}
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-white">A Sanctuary of Serenity</h3>
            <p className="text-lg text-gray-400">
              At {spaName}, we blend timeless wellness traditions with a touch of 70s nostalgia. Our philosophy is simple: provide a tranquil escape where you can reconnect with yourself, rejuvenate your body, and soothe your soul. We use only the finest natural and organic products in a setting designed for ultimate relaxation.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-white">Our Signature Treatments</h3>
              <p className="text-lg text-gray-400">Discover our curated menu of wellness experiences.</p>
            </div>
            <div className="space-y-16">
              {spaServices.map((service, index) => {
                const isReversed = index % 2 !== 0;
                return (
                  <div key={index} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${isReversed ? 'md:grid-flow-col-dense' : ''}`}>
                    <div className={`relative h-96 rounded-lg overflow-hidden shadow-lg shadow-black/50 ${isReversed ? 'md:col-start-2' : ''}`}>
                      <img
                        src={spaBusiness.imageUrls?.services[index % spaBusiness.imageUrls?.services.length] || spaBusiness.heroImage}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <span className="text-5xl text-[var(--mustard-yellow)]">{service.icon}</span>
                      <h4 className="text-2xl font-bold font-serif mt-4 mb-2 text-white">{service.title}</h4>
                      <p className="text-gray-400 mb-4">{service.description}</p>
                      <button onClick={handleBookingClick} className="text-gray-200 font-semibold hover:text-[var(--mustard-yellow)] transition-colors">
                        Book This Treatment &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why-us" className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-white">The Vintage Vibe Difference</h3>
              <p className="text-lg text-gray-400">Experience wellness where nostalgia meets modern care.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { title: 'Expert Therapists', description: 'Certified professionals with a passion for holistic healing.', icon: <Award /> },
                { title: 'Organic Products', description: 'Using only the purest, nature-derived ingredients.', icon: <Leaf /> },
                { title: 'Personalized Journeys', description: 'Every treatment is tailored to your unique needs.', icon: <Users /> },
                { title: 'Total Tranquility', description: 'An ambiance designed to calm your mind and spirit.', icon: <Smile /> }
              ].map((feature, index) => (
                <div key={index}>
                  <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-[var(--avocado-green)]/20 text-[var(--avocado-green)] mb-4">
                    {React.cloneElement(feature.icon, { size: 32 })}
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-white">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-white">Guest Experiences</h3>
              <p className="text-lg text-gray-400">Hear what our clients love about us.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {spaTestimonials.map((testimonial, index) => (
                <div key={index} className="bg-[#1C1C1C] p-8 rounded-lg shadow-lg border border-gray-800">
                  <div className="text-[var(--mustard-yellow)] text-2xl mb-2">{testimonial.ratingIcon}</div>
                  <p className="mb-4 italic text-gray-400">"{testimonial.review}"</p>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking & Packages Section */}
        <section id="booking" className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-white">Book Your Retro Escape</h3>
              <p className="text-lg text-gray-400">Reserve your spot in our vintage oasis of relaxation.</p>
            </div>
            <div className="bg-[#1C1C1C] p-8 md:p-12 rounded-lg shadow-xl border border-gray-800">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="text-center lg:text-left">
                  <h4 className="text-2xl font-bold font-serif mb-4 text-white">Ready to Unwind?</h4>
                  <p className="text-gray-400 mb-6">
                    Use the form to request a booking, or simply click the button to have our AI assistant call you to schedule your appointment. It's that easy.
                  </p>
                  <img src="https://images.unsplash.com/photo-1544161515-cfd895db8456?q=80&w=1287&auto=format&fit=crop" alt="Spa products" className="rounded-lg shadow-md w-full h-64 object-cover opacity-80"/>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBookingClick();
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[var(--mustard-yellow)] transition-colors placeholder:text-gray-500"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[var(--mustard-yellow)] transition-colors placeholder:text-gray-500"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[var(--mustard-yellow)] transition-colors placeholder:text-gray-500"
                    required
                  />
                  <select
                    name="service"
                    className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[var(--mustard-yellow)] transition-colors"
                    required
                  >
                    <option value="">Select Service</option>
                    {spaServices.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                  </select>
                  <input
                    type="date"
                    name="date"
                    className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-[var(--mustard-yellow)] transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-[var(--mustard-yellow)] text-[var(--deep-maroon)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--avocado-green)] hover:text-white transition-colors"
                  >
                    Request Booking
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h4 className="text-xl font-bold font-serif mb-4">{spaName}</h4>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-6 text-gray-400">
              <a href={`tel:${phoneNumber}`} className="hover:text-[var(--mustard-yellow)] transition-colors flex items-center gap-2"><Phone size={16}/> {phoneNumber}</a>
              <a href={`mailto:${spaBusiness.email}`} className="hover:text-[var(--mustard-yellow)] transition-colors flex items-center gap-2"><Mail size={16}/> {spaBusiness.email}</a>
              <p className="flex items-center gap-2"><MapPin size={16}/> {spaBusiness.address}</p>
            </div>
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {spaName}. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}