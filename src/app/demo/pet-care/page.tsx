'use client';

import React from 'react';
import Head from 'next/head';
import { petCareBusiness, petCareServices, petCareTestimonials, generateBusinessSchema } from '@/config/demo-businesses';

export default function PetCareDemoPage() {
  const phoneNumber = petCareBusiness.phone;
  const businessName = petCareBusiness.name;
  const businessAddress = petCareBusiness.address;

  // This function would trigger the Robofy voice agent for appointment booking
  const handleBookingClick = () => {
    console.log("Initiating pet care appointment booking with Robofy AI Agent...");
    // In a real app, this would call the ElevenLabs/Twilio integration
    alert("Our AI assistant will call you shortly to book your pet care appointment!");
  };

  // JSON-LD structured data for SEO
  const jsonLd = generateBusinessSchema(petCareBusiness, petCareServices, petCareTestimonials);

  return (
    <>
      <Head>
        <title>{businessName} - Professional Pet Care Services</title>
        <meta name="description" content="Compassionate care for your furry family members. Professional grooming, veterinary services, pet sitting, and training all under one roof." />
        <meta name="keywords" content="pet care near me, dog grooming service, veterinary clinic, pet sitting services, puppy training classes, pet nutrition advice, emergency vet near me, pet adoption center" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="min-h-screen bg-[#FFF3E0] pet-care-theme">
        {/* CSS Variables for Pet Care Color Palette */}
        <style jsx>{`
          :root {
            --warm-orange: #FFA726;
            --soft-teal: #4DB6AC;
            --creamy-beige: #FFF3E0;
            --earthy-brown: #6D4C41;
            --soft-gray: #B0BEC5;
          }
          
          .pet-care-theme {
            --bg-primary: var(--creamy-beige);
            --bg-secondary: var(--soft-teal);
            --bg-accent: var(--warm-orange);
            --text-primary: var(--earthy-brown);
            --text-secondary: var(--soft-gray);
            --text-light: var(--creamy-beige);
          }
        `}</style>

        {/* Header */}
        <header className="bg-[#4DB6AC] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">{businessName}</h1>
              <nav className="hidden md:flex space-x-8">
                <a href="#services" className="text-white hover:text-[#FFA726] transition-colors">Services</a>
                <a href="#why-us" className="text-white hover:text-[#FFA726] transition-colors">Why Us</a>
                <a href="#testimonials" className="text-white hover:text-[#FFA726] transition-colors">Testimonials</a>
                <a href="#booking" className="text-white hover:text-[#FFA726] transition-colors">Booking</a>
                <a href="#contact" className="text-white hover:text-[#FFA726] transition-colors">Contact</a>
              </nav>
              <button
                onClick={handleBookingClick}
                className="bg-[#FFA726] text-[#6D4C41] px-6 py-2 rounded-lg font-semibold hover:bg-[#4DB6AC] hover:text-white transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center min-h-[80vh] flex items-center"
          style={{ 
            backgroundImage: `linear-gradient(rgba(77, 182, 172, 0.1), rgba(77, 182, 172, 0.1)), url('${petCareBusiness.heroImage}')`,
            backgroundPosition: 'center 30%'
          }}
        >
          <div className="absolute inset-0 bg-[#4DB6AC] opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {petCareBusiness.heroSlogan}
            </h2>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
              {petCareBusiness.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBookingClick}
                className="bg-[#FFA726] text-[#6D4C41] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#4DB6AC] hover:text-white transition-colors"
              >
                Book Your Appointment
              </button>
              <a
                href="#services"
                className="border-2 border-[#FFA726] text-[#FFA726] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#FFA726] hover:text-[#6D4C41] transition-colors"
              >
                Explore Services
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="bg-[#FFF3E0] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-[#6D4C41] mb-4">Our Pet Care Services</h3>
              <p className="text-[#4DB6AC]">Comprehensive care for your beloved pets</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {petCareServices.map((service, index) => (
                <div key={index} className="bg-[#4DB6AC] p-6 rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4 text-center">{service.icon}</div>
                  <h4 className="text-xl font-semibold mb-2 text-center">{service.title}</h4>
                  <p className="mb-4 text-center">{service.description}</p>
                  <button
                    onClick={handleBookingClick}
                    className="w-full bg-[#FFA726] text-[#6D4C41] text-center py-2 rounded font-semibold hover:bg-[#6D4C41] hover:text-white transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why-us" className="bg-[#6D4C41] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Why Choose {businessName}?</h3>
              <p className="text-[#FFA726]">Where compassion meets professional expertise</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Certified Professionals',
                  description: 'Experienced staff with certifications in pet care and veterinary medicine',
                  icon: '👩‍⚕️'
                },
                {
                  title: 'State-of-the-Art Facility',
                  description: 'Modern, clean, and safe environment designed for pet comfort',
                  icon: '🏢'
                },
                {
                  title: 'Personalized Care Plans',
                  description: 'Customized care tailored to each pet\'s unique needs and personality',
                  icon: '📋'
                },
                {
                  title: '24/7 Emergency Care',
                  description: 'Round-the-clock emergency services for urgent pet health needs',
                  icon: '⏰'
                }
              ].map((feature, index) => (
                <div key={index} className="text-center bg-[#4DB6AC] p-6 rounded-lg">
                  <div className="text-4xl mb-4 text-[#FFA726]">{feature.icon}</div>
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-[#FFA726]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-[#FFF3E0] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-[#6D4C41] mb-4">Happy Pet Owners</h3>
              <p className="text-[#4DB6AC]">Hear what our clients say about our care</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {petCareTestimonials.map((testimonial, index) => (
                <div key={index} className="bg-[#4DB6AC] p-6 rounded-lg text-white shadow-lg">
                  <div className="text-[#FFA726] text-xl mb-2">{testimonial.ratingIcon}</div>
                  <p className="mb-4 italic">"{testimonial.review}"</p>
                  <p className="font-semibold text-[#FFA726]">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking" className="bg-[#FFA726] text-[#6D4C41] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Schedule Your Visit</h3>
              <p className="text-[#6D4C41]">Book an appointment for your furry friend today</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h4 className="text-xl font-semibold mb-6">Service Packages</h4>
                <div className="space-y-6">
                  {[
                    {
                      name: 'Wellness Package',
                      price: '$129',
                      includes: ['Complete Health Checkup', 'Vaccinations', 'Dental Cleaning', 'Nutrition Consultation']
                    },
                    {
                      name: 'Grooming Deluxe',
                      price: '$89',
                      includes: ['Full Grooming Session', 'Nail Trimming', 'Ear Cleaning', 'Pawdicure']
                    },
                    {
                      name: 'Training Starter',
                      price: '$199',
                      includes: ['4 Training Sessions', 'Behavior Assessment', 'Training Materials', 'Follow-up Support']
                    }
                  ].map((packageItem, index) => (
                    <div key={index} className="bg-[#FFF3E0] p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-semibold text-[#6D4C41]">{packageItem.name}</h5>
                        <span className="text-lg font-bold">{packageItem.price}</span>
                      </div>
                      <ul className="text-sm space-y-1 text-[#6D4C41]">
                        {packageItem.includes.map((item, i) => (
                          <li key={i} className="flex items-center">
                            <span className="w-2 h-2 bg-[#4DB6AC] rounded-full mr-2"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-6">Make a Reservation</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBookingClick();
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    name="ownerName"
                    placeholder="Owner's Name"
                    className="w-full px-4 py-2 rounded text-[#6D4C41] bg-white"
                    required
                  />
                  <input
                    type="text"
                    name="petName"
                    placeholder="Pet's Name"
                    className="w-full px-4 py-2 rounded text-[#6D4C41] bg-white"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 rounded text-[#6D4C41] bg-white"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full px-4 py-2 rounded text-[#6D4C41] bg-white"
                    required
                  />
                  <select
                    name="service"
                    className="w-full px-4 py-2 rounded text-[#6D4C41] bg-white"
                    required
                  >
                    <option value="">Select Service</option>
                    <option value="grooming">Grooming</option>
                    <option value="vet">Veterinary Care</option>
                    <option value="boarding">Boarding</option>
                    <option value="training">Training</option>
                    <option value="nutrition">Nutrition Consultation</option>
                  </select>
                  <input
                    type="date"
                    name="date"
                    className="w-full px-4 py-2 rounded text-[#6D4C41] bg-white"
                    required
                  />
                  <input
                    type="time"
                    name="time"
                    className="w-full px-4 py-2 rounded text-[#6D4C41] bg-white"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#4DB6AC] text-white px-6 py-3 rounded font-semibold hover:bg-[#6D4C41] transition-colors"
                  >
                    Request Appointment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-[#4DB6AC] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h3>
              <p className="text-[#FFA726]">We're here to help your furry family members</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-xl font-semibold mb-6 text-[#FFA726]">Contact Information</h4>
                <div className="space-y-4">
                  <p className="flex items-center">
                    <span className="w-6 h-6 mr-3">📞</span>
                    <a href={`tel:${phoneNumber}`} className="hover:text-[#FFA726] transition-colors">
                      {phoneNumber}
                    </a>
                  </p>
                  <p className="flex items-center">
                    <span className="w-6 h-6 mr-3">✉️</span>
                    <a href={`mailto:${petCareBusiness.email}`} className="hover:text-[#FFA726] transition-colors">
                      {petCareBusiness.email}
                    </a>
                  </p>
                  <p className="flex items-center">
                    <span className="w-6 h-6 mr-3">📍</span>
                    {businessAddress}
                  </p>
                  <p className="flex items-center">
                    <span className="w-6 h-6 mr-3">🕒</span>
                    {petCareBusiness.hours}
                  </p>
                </div>
                <div className="mt-8">
                  <h5 className="text-lg font-semibold mb-4 text-[#FFA726]">Follow Us</h5>
                  <div className="flex space-x-4">
                    {['Instagram', 'Facebook', 'Twitter'].map((social, index) => (
                      <a
                        key={index}
                        href="#"
                        className="bg-[#6D4C41] text-[#FFA726] px-4 py-2 rounded hover:bg-[#FFA726] hover:text-[#6D4C41] transition-colors"
                      >
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-6 text-[#FFA726]">Visit Our Facility</h4>
                <div className="bg-[#6D4C41] p-4 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-center text-[#FFA726]">
                    📍 Interactive Map Would Appear Here<br />
                    <span className="text-sm">(Embedded Google Maps with pet-friendly styling)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#6D4C41] text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2025 {businessName}. All rights reserved. | Compassionate Care Since 2025</p>
            <p className="text-sm text-[#FFA726] mt-2">
              Where pets are family and care comes first
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}