'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthService } from '@/lib/auth';

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface NavBarProps {
  logo?: React.ReactNode;
  navigationItems?: NavigationItem[];
  ctaText?: string;
  ctaHref?: string;
  ctaOnClick?: () => void;
  className?: string;
  showAuth?: boolean;
  theme?: 'dark' | 'light';
}

export default function NavBar({
  logo = (
    <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
      Robofy
    </h1>
  ),
  navigationItems = [
    { label: 'Services', href: '/services' },
    {
      label: 'Sectors',
      href: '/sectors',
      children: [
        { label: 'All Sectors', href: '/sectors' },
        { label: 'Dental Demo', href: '/demo/dental' },
        { label: 'Salon Demo', href: '/demo/salon' },
        { label: 'Spa Demo', href: '/demo/spa' },
        { label: 'Pet Care Demo', href: '/demo/pet-care' },
        { label: 'Real Estate Demo', href: '/demo/real-estate' }
      ]
    },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog', href: '/blog' },
    { label: 'AI Tools', href: '/ai-tools' },
    { label: 'Contact', href: '/contact' }
  ],
  ctaText = 'Get Started',
  ctaHref = '/contact',
  ctaOnClick,
  className = '',
  showAuth = true,
  theme = 'dark'
}: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (showAuth) {
      setIsAuthenticated(AuthService.isAuthenticated());
    } else {
      setIsAuthenticated(false);
    }
  }, [showAuth]);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <>
      <header
        className={`absolute top-0 left-0 right-0 py-3.5 z-50 ${className} ${
          theme === 'light'
            ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200'
            : 'bg-black/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a
                href="/"
                className={`block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md ${
                  theme === 'light'
                    ? 'text-gray-900 focus:ring-gray-900'
                    : 'text-white focus:ring-white'
                }`}
                aria-label="Homepage"
              >
                {logo}
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-4">
              {navigationItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => {
                    if (item.children) {
                      if (dropdownTimeout) {
                        clearTimeout(dropdownTimeout);
                        setDropdownTimeout(null);
                      }
                      setActiveDropdown(item.label);
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.children) {
                      const timeout = setTimeout(() => {
                        setActiveDropdown(null);
                      }, 200); // 200ms delay before closing
                      setDropdownTimeout(timeout);
                    }
                  }}
                >
                  <Link
                    href={item.href}
                    className={`font-semibold text-lg transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-4 py-2 ${
                      theme === 'light'
                        ? 'text-gray-700 after:bg-gray-700 hover:bg-gray-100/50 focus:ring-gray-700 hover:text-gray-900'
                        : 'text-white after:bg-white hover:bg-white/10 focus:ring-white hover:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.children && (
                    <div
                     className={`absolute top-full left-0 mt-2 w-48 backdrop-blur-sm rounded-lg shadow-xl transition-all duration-300 transform origin-top ${
                       theme === 'light'
                         ? 'bg-white/95 border border-gray-200'
                         : 'bg-black/90 border border-gray-700'
                     } ${
                       activeDropdown === item.label ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                     }`}
                     onMouseEnter={() => {
                       if (item.children) {
                         if (dropdownTimeout) {
                           clearTimeout(dropdownTimeout);
                           setDropdownTimeout(null);
                         }
                         setActiveDropdown(item.label);
                       }
                     }}
                     onMouseLeave={() => {
                       if (item.children) {
                         const timeout = setTimeout(() => {
                           setActiveDropdown(null);
                         }, 200); // 200ms delay before closing
                         setDropdownTimeout(timeout);
                       }
                     }}
                   >
                      <div className="py-2">
                        {item.children.map((child, childIndex) => (
                          child.href.startsWith('/demo') ? (
                            <a
                              key={childIndex}
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block px-4 py-2 transition-colors duration-200 ${
                                theme === 'light'
                                  ? 'text-gray-800 hover:bg-gray-100/50'
                                  : 'text-white hover:bg-white/10'
                              }`}
                              onClick={() => setActiveDropdown(null)}
                            >
                              {child.label}
                            </a>
                          ) : (
                            <Link
                              key={childIndex}
                              href={child.href}
                              className={`block px-4 py-2 transition-colors duration-200 ${
                                theme === 'light'
                                  ? 'text-gray-800 hover:bg-gray-100/50'
                                  : 'text-white hover:bg-white/10'
                              }`}
                              onClick={() => setActiveDropdown(null)}
                            >
                              {child.label}
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Authentication Links */}
              {showAuth && (
                <>
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className={`font-semibold text-lg transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-4 py-2 ${
                        theme === 'light'
                          ? 'text-gray-700 after:bg-gray-700 hover:bg-gray-100/50 focus:ring-gray-700 hover:text-gray-900'
                          : 'text-white after:bg-white hover:bg-white/10 focus:ring-white hover:text-gray-300'
                      }`}
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className={`font-semibold text-lg transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-4 py-2 ${
                          theme === 'light'
                            ? 'text-gray-700 after:bg-gray-700 hover:bg-gray-100/50 focus:ring-gray-700 hover:text-gray-900'
                            : 'text-white after:bg-white hover:bg-white/10 focus:ring-white hover:text-gray-300'
                        }`}
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/register"
                        className={`font-semibold text-lg transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-4 py-2 ${
                          theme === 'light'
                            ? 'text-gray-700 after:bg-gray-700 hover:bg-gray-100/50 focus:ring-gray-700 hover:text-gray-900'
                            : 'text-white after:bg-white hover:bg-white/10 focus:ring-white hover:text-gray-300'
                        }`}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>

            {/* CTA Button */}
            {ctaText && (
              <div className="flex items-center space-x-4">
                {ctaOnClick ? (
                  <button
                    onClick={ctaOnClick}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {ctaText}
                  </button>
                ) : (
                  <Link
                    href={ctaHref}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {ctaText}
                  </Link>
                )}
              </div>
            )}

          </div>
        </div>
      </header>

    </>
  );
}