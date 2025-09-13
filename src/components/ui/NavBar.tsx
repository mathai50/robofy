'use client';

import React, { useState, useEffect } from 'react';

export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavBarProps {
  logo?: React.ReactNode;
  navigationItems?: NavigationItem[];
  ctaText?: string;
  ctaHref?: string;
  ctaOnClick?: () => void;
  className?: string;
}

export default function NavBar({
  logo = (
    <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
      Robofy
    </h1>
  ),
  navigationItems = [
    { label: 'Services', href: '/services' },
    { label: 'Sectors', href: '/sectors' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog', href: '/blog' },
    { label: 'AI Tools', href: '/ai-tools' },
    { label: 'Contact', href: '/contact' }
  ],
  ctaText = 'Get Started',
  ctaHref = '/contact',
  ctaOnClick,
  className = ''
}: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        className={`absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm py-3.5 z-50 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a
                href="/"
                className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded-md text-white"
                aria-label="Homepage"
              >
                {logo}
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="font-semibold text-lg transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-white after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded-md px-4 py-2 hover:bg-white/10 text-white hover:text-gray-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>

          </div>
        </div>
      </header>

    </>
  );
}