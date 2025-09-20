'use client';

import React from 'react';

export default function SalonDemoPage() {
  const phoneNumber = '555-987-6543';

  const services = [
    {
      title: 'Haircuts',
      description: 'Expert cuts for women, men, and kids with personalized styling advice.',
      icon: '✂️'
    },
    {
      title: 'Hair Coloring',
      description: 'Balayage, highlights, and vibrant color transformations with keratin treatments.',
      icon: '🎨'
    },
    {
      title: 'Styling',
      description: 'Wedding hair, blowouts, updos, and special occasion styling.',
      icon: '💇‍♀️'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDF5E6]"> {/* Warm Cream background */}
      {/* Header */}
      <header className="bg-[#2D2D2D] shadow-sm"> {/* Dark gray header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Vintage Vibe Salon</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-white hover:text-[#E97451]">Services</a>
              <a href="#about" className="text-white hover:text-[#E97451]">About</a>
              <a href="#testimonials" className="text-white hover:text-[#E97451]">Testimonials</a>
              <a href="#contact" className="text-white hover:text-[#E97451]">Contact</a>
            </nav>
            <a
              href={`tel:${phoneNumber}`}
              className="bg-[#E97451] text-white px-6 py-2 rounded-lg hover:bg-[#708238] hover:text-white"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)" }}
      >
        <div className="absolute inset-0 bg-[#1B4F72] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-[#FDF5E6] mb-6">
              Experience Your Best Look with Our Expert Stylists
            </h2>
            <p className="text-xl text-[#FDF5E6] mb-8 max-w-3xl mx-auto">
              Cutting-edge Haircuts, Vibrant Colors & Personalized Beauty Services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${phoneNumber}`}
                className="bg-[#D4AF37] text-[#1B4F72] px-8 py-3 rounded-lg text-lg hover:bg-[#708238] hover:text-[#FDF5E6]"
              >
                Book Your Appointment
              </a>
              <button className="border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded-lg text-lg hover:bg-[#D4AF37] hover:text-[#1B4F72]">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-[#F5F5F5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">Popular Salon Services</h3>
            <p className="text-[#666666]">Premium beauty services for the modern individual</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-[#2D2D2D] p-6 rounded-lg text-center text-white">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                <p className="text-white">{service.description}</p>
                <a href={`tel:${phoneNumber}`} className="mt-4 inline-block bg-[#E97451] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#708238] transition-colors">
                  Book Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#2D2D2D] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Vintage Vibe?</h3>
            <p className="text-[#E97451]">Experience the retro charm with modern expertise</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Expert Stylists',
                description: 'Certified professionals with years of experience in trendy and classic styles',
                icon: '👩‍🎨'
              },
              {
                title: 'Premium Products',
                description: 'High-quality, eco-friendly products for the best results',
                icon: '🧴'
              },
              {
                title: 'Relaxing Atmosphere',
                description: '70s inspired decor with a comfortable, welcoming environment',
                icon: '🛋️'
              },
              {
                title: 'Flexible Booking',
                description: 'Convenient scheduling with evening and weekend appointments',
                icon: '📅'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-[#E97451]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-[#F5F5F5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">Client Testimonials</h3>
            <p className="text-[#666666]">Hear what our clients love about us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Jessica Taylor',
                review: 'Best color service I\'ve ever had! The balayage turned out perfectly and lasted months.',
                rating: '★★★★★'
              },
              {
                name: 'Marcus Rodriguez',
                review: 'The stylists really listen to what you want. Got the perfect cut that suits my face shape.',
                rating: '★★★★★'
              },
              {
                name: 'Sophia Chen',
                review: 'Love the retro vibe and the amazing service. My wedding hair was absolutely stunning!',
                rating: '★★★★★'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-[#2D2D2D] p-6 rounded-lg text-white">
                <div className="text-[#E97451] text-xl mb-2">{testimonial.rating}</div>
                <p className="mb-4 italic">"{testimonial.review}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[#F5F5F5] text-[#333333] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h3>
            <p className="text-[#E97451]">Ready for your transformation? We can\'t wait to meet you!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-xl font-semibold mb-4">Salon Information</h4>
              <div className="space-y-4">
                <p>📞 (555) 987-6543</p>
                <p>✉️ hello@vintagevibesalon.com</p>
                <p>📍 456 Retro Avenue, City, State 12345</p>
                <p>🕒 Tue-Sat: 9AM-7PM, Sun: 10AM-4PM</p>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Send us a Message</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Message sent! We will get back to you shortly.');
                  (e.target as HTMLFormElement).reset();
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 rounded text-[#333333] bg-white border border-gray-300"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 rounded text-[#333333] bg-white border border-gray-300"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 rounded text-[#333333] bg-white border border-gray-300"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-2 rounded text-[#333333] bg-white border border-gray-300"
                ></textarea>
                <button type="submit" className="bg-[#E97451] text-white px-6 py-2 rounded hover:bg-[#708238] transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D2D2D] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Vintage Vibe Salon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}