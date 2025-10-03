'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthService } from '@/lib/auth';
import { useTheme } from 'next-themes';

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
}

export default function NavBar({
  logo = (
    <Image
      src="/images/robofy.png"
      alt="Robofy Logo"
      width={120}
      height={40}
      className="h-10 w-auto"
    />
  ),
  navigationItems = [
    {
      label: 'Demo',
      href: '/demo',
      children: [
        { label: 'Dental Demo', href: '/demo/dental' },
        { label: 'Real Estate Demo', href: '/demo/property-developer' },
        { label: 'Spa Demo', href: '/demo/spa' },
        { label: 'Salon Demo', href: '/demo/salon' },
        { label: 'Salon Organic Demo', href: '/demo/salon-organic' },
        { label: 'Pet Care Demo', href: '/demo/pet-care' },
        { label: 'Child Care Demo', href: '/demo/child-care' },
        { label: 'Garden Supplies Demo', href: '/demo/garden-supplies' },
        { label: 'Event Management Demo', href: '/demo/event-manager' },
        { label: 'Gym Demo', href: '/demo/gym' },
        { label: 'Yoga Studio Demo', href: '/demo/yoga-studio' },
        { label: 'Physician Demo', href: '/demo/physician' }
      ]
    },
    { label: 'Blog', href: '/blog' },
    { label: 'SEO Analyzer', href: '/seo-analysis' },
    { label: 'SEO Dashboard', href: '/seo-dashboard' }
  ],
  ctaText = 'Get Started',
  ctaHref = '/contact',
  ctaOnClick,
  className = '',
  showAuth = true,
}: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
    if (showAuth) {
      setIsAuthenticated(AuthService.isAuthenticated());
    } else {
      setIsAuthenticated(false);
    }
  }, [showAuth]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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
        className={`absolute top-0 left-0 right-0 py-3.5 z-50 ${className} bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a
                href="/"
                className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md text-foreground focus:ring-ring"
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
                   className="font-semibold text-lg transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-4 py-2 text-gray-900 dark:text-white after:bg-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500 hover:text-gray-700 dark:hover:text-gray-300"
                 >
                    {item.label}
                  </Link>
                  
                  {/* Dropdown Menu */}
                 {item.children && (
                   <div
                     className={`absolute top-full left-0 mt-2 w-56 backdrop-blur-sm rounded-lg shadow-xl transition-all duration-300 transform origin-top max-h-96 overflow-y-auto bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 ${
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
                             className="block px-4 py-1 transition-colors duration-200 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20"
                             onClick={() => setActiveDropdown(null)}
                           >
                              {child.label}
                            </a>
                          ) : (
                            <Link
                             key={childIndex}
                             href={child.href}
                             className="block px-4 py-1 transition-colors duration-200 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
              
            </nav>


            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
              aria-label="Toggle theme"
              suppressHydrationWarning
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

          </div>
        </div>
      </header>

    </>
  );
}