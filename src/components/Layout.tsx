'use client';

import React from 'react';
import NavBar from '@/components/ui/NavBar';
import { usePathname } from 'next/navigation';
import { realEstateBusiness } from '@/config/demo-businesses';

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
  const pathname = usePathname();
  const isDemoPage = pathname?.startsWith('/demo');

  if (isDemoPage) {
    // Customize navbar for specific demo pages
    let customLogo = undefined;
    let customNavigationItems = undefined;
    let showAuth = true;
    let ctaText = 'Get Started';
    let theme: 'dark' | 'light' = 'dark';
    
    if (pathname === '/demo/real-estate') {
      customLogo = (
        <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 font-sans tracking-tight">
          {realEstateBusiness.name}
        </h1>
      );
      customNavigationItems = [
        { label: 'Home', href: '/demo/real-estate' },
        { label: 'Projects', href: '#projects' },
        { label: 'Services', href: '#services' },
        { label: 'Testimonials', href: '#testimonials' },
        { label: 'Contact', href: '#contact' }
      ];
      showAuth = false;
      ctaText = '';
      theme = 'light';
    }

    return (
      <div className="min-h-screen flex flex-col">
        {/* Navigation Bar for demo pages */}
        <NavBar
          logo={customLogo}
          navigationItems={customNavigationItems}
          showAuth={showAuth}
          ctaText={ctaText}
          theme={theme}
        />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main content area */}
      <main className="flex-grow">
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
                <li><a href="/case-studies" className="text-gray-300 hover:text-white">Case Studies</a></li>
                <li><a href="/blog" className="text-gray-300 hover:text-white">Blog</a></li>
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