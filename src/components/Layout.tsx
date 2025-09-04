'use client';

import React, { useState, useEffect } from 'react';

/**
 * Layout Component
 *
 * Provides a consistent structure for all pages with header, main content, and footer.
 * Includes navigation menu and error boundaries for robust error handling.
 *
 * @component
 * @param {React.ReactNode} children - The child components to be rendered within the layout
 * @returns {JSX.Element} The layout structure with header, main, and footer
 *
 * @example
 * <Layout>
 *   <YourPageContent />
 * </Layout>
 */

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      {/* Header with always-visible burger icon */}
      <header className="bg-transparent shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-black">Robofy</h1>
            </div>
            
            {/* Burger menu button - always visible on all screens */}
            <div>
              <button
                onClick={toggleMenu}
                className="text-black hover:text-black focus:outline-none focus:text-black"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <svg className="h-6 w-6" fill="none" stroke="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Drawer/Overlay */}
      {isMounted && isMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleMenu}
            aria-hidden="true"
          />
          
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col items-start p-6 space-y-6">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-black">Robofy</h1>
              </div>
              <nav className="flex flex-col space-y-4 w-full">
                <a
                  href="/"
                  className="text-black hover:text-black px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  onClick={toggleMenu}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </a>
                <a
                  href="/sectors"
                  className="text-black hover:text-black px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  onClick={toggleMenu}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V极5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0H5m2 0H3m2 0h2M9 7h6m-6 4h极6m-6 4h6" />
                  </svg>
                  Sectors
                </a>
                <a
                  href="/contact"
                  className="text-black hover:text-black px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  onClick={toggleMenu}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <main className="flex-grow mt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Robofy</h3>
              <p className="text-gray-300">AI-powered digital marketing solutions for businesses.</p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="/services" className="text-gray-300 hover:text-white">Services</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">LinkedIn</a>
                <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-300">&copy; 2025 Robofy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}