'use client';

import React, { useState, useEffect } from 'react';
import NavBar from '@/components/ui/NavBar';
import { usePathname } from 'next/navigation';
import { propertyDeveloperBusiness } from '@/config/demo-businesses';
import Image from 'next/image';
import Link from 'next/link';

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
  const isHomePage = pathname === '/';

  if (isHomePage) {
    // For homepage, include navbar but keep footer minimal
    return (
      <div className="min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <NavBar />
        <main className="flex-grow">
          {children}
        </main>
        {/* Minimal footer for homepage */}
        <footer className="bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-muted-foreground">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/images/robofy.png"
                  alt="Robofy Logo"
                  width={100}
                  height={33}
                  className="h-8 w-auto mx-auto"
                />
              </Link>
              <p>&copy; 2025 Robofy. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (isDemoPage) {
    // Customize navbar for specific demo pages
    let customLogo = undefined;
    let customNavigationItems = undefined;
    let showAuth = true;
    let ctaText = 'Get Started';
    
    if (pathname === '/demo/real-estate') {
      customLogo = (
        <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 font-sans tracking-tight">
          {propertyDeveloperBusiness.name}
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
    } else if (pathname === '/demo/dental') {
      // For dental demo, don't render the NavBar at all since it has its own navbar
      return (
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            {children}
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col">
        {/* Navigation Bar for demo pages */}
        <NavBar
          logo={customLogo}
          navigationItems={customNavigationItems}
          showAuth={showAuth}
          ctaText={ctaText}
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
      <footer className="bg-card text-card-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Link href="/" className="block mb-4">
                <Image
                  src="/images/robofy.png"
                  alt="Robofy Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <p className="text-muted-foreground mt-2">AI-powered digital marketing solutions for businesses.</p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="/blog" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">LinkedIn</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">Facebook</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground">&copy; 2025 Robofy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}