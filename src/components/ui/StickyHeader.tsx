'use client';

import React, { useState, useEffect, useCallback } from 'react';

export interface NavigationItem {
  label: string;
  href: string;
}

export interface StickyHeaderProps {
  logo?: React.ReactNode;
  navigationItems?: NavigationItem[];
  ctaText?: string;
  ctaHref?: string;
  ctaOnClick?: () => void;
  className?: string;
}

export default function StickyHeader({
  logo = (
    <h1 className="text-2xl sm:text-3xl font-extrabold text-inherit font-sans tracking-tight">
      Robofy
    </h1>
  ),
  navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Sectors', href: '/sectors' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }
  ],
  ctaText = 'Get Started',
  ctaHref = '/contact',
  ctaOnClick,
  className = ''
}: StickyHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    setIsScrolled(scrollTop > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Focus trap for mobile menu
  useEffect(() => {
    if (isMenuOpen && isMounted) {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isMenuOpen, isMounted]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200/30 py-3'
            : 'py-6'
        } ${className}`}
        style={!isScrolled ? {
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none'
        } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a
                href="/"
                className={`block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-accent-1 focus:ring-offset-2 rounded-md ${
                  isScrolled ? 'text-primary-accent-1' : 'text-white'
                }`}
                aria-label="Homepage"
              >
                {logo}
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`font-semibold text-lg transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary-accent-1 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus:ring-2 focus:ring-primary-accent-1 focus:ring-offset-2 rounded-md px-4 py-2 hover:bg-primary-accent-1/5 ${
                    isScrolled
                      ? 'text-gray-900 hover:text-primary-accent-1'
                      : 'text-white hover:text-primary-accent-1'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* CTA Button and Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              {/* Desktop CTA Button */}
              <a
                href={ctaHref}
                onClick={ctaOnClick}
                className="hidden md:inline-block bg-white text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-gray-100 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {ctaText}
              </a>

              {/* Mobile Menu Toggle - Ensure it's hidden on desktop */}
              <button
               onClick={toggleMenu}
               className={`md:hidden hover:text-primary-accent-1 focus:outline-none focus:ring-2 focus:ring-primary-accent-1 focus:ring-offset-2 rounded-md p-2 ${
                 isScrolled ? 'text-gray-900' : 'text-white'
               }`}
               aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
               aria-expanded={isMenuOpen}
               style={{ display: isMounted ? 'block' : 'none' }}
             >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMounted && isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Mobile Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-sm shadow-xl transform transition-transform duration-300 ease-in-out border-l border-gray-200/30">
            <div className="flex flex-col h-full p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={closeMenu}
                  className="text-gray-900 hover:text-primary-accent-1 focus:outline-none focus:ring-2 focus:ring-primary-accent-1 focus:ring-offset-2 rounded-full p-3 bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                  aria-label="Close menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1">
                <ul className="space-y-4">
                  {navigationItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        onClick={closeMenu}
                        className="block text-gray-900 hover:text-primary-accent-1 font-semibold text-lg py-4 px-6 rounded-xl transition-all duration-300 hover:bg-primary-accent-1/10 focus:outline-none focus:ring-2 focus:ring-primary-accent-1 focus:ring-offset-2"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile CTA Button */}
              <div className="pt-8 border-t border-gray-200/50">
                <a
                  href={ctaHref}
                  onClick={() => {
                    if (ctaOnClick) ctaOnClick();
                    closeMenu();
                  }}
                  className="block w-full bg-white text-black font-bold py-4 px-6 rounded-full text-center transition-all duration-300 transform hover:scale-105 hover:bg-gray-100 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {ctaText}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className={`h-24 transition-all duration-300 ${isScrolled ? 'h-20' : 'h-24'}`} />
    </>
  );
}