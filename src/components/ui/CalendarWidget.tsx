'use client';

import React, { useEffect, useRef } from 'react';

interface CalendarWidgetProps {
  calendlyUsername?: string;
  eventType?: string;
  className?: string;
}

export default function CalendarWidget({ 
  calendlyUsername = 'robofy', 
  eventType = 'meeting',
  className = '' 
}: CalendarWidgetProps) {
  const calendlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCalendlyWidget = () => {
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url: `https://calendly.com/${calendlyUsername}/${eventType}`,
          parentElement: calendlyRef.current,
          prefill: {},
          utm: {}
        });
      }
    };

    // Load Calendly script if not already loaded
    if (!document.querySelector('script[src*="calendly.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = loadCalendlyWidget;
      document.head.appendChild(script);
    } else if (window.Calendly) {
      loadCalendlyWidget();
    }

    // Cleanup function to remove any Calendly iframes when component unmounts
    return () => {
      if (calendlyRef.current) {
        calendlyRef.current.innerHTML = '';
      }
    };
  }, [calendlyUsername, eventType]);

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-gray-700 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white font-inter mb-2">
          Schedule a Demo
        </h2>
        <p className="text-gray-300 font-inter">
          Book a time that works for you. No pressure, just answers.
        </p>
      </div>
      
      <div 
        ref={calendlyRef}
        className="calendly-inline-widget min-h-[600px] w-full rounded-lg"
        style={{ minWidth: '320px', height: '600px' }}
      />
      
      {/* Fallback content in case Calendly doesn't load */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-400 font-inter">
          Having trouble with the calendar?{' '}
          <a 
            href={`https://calendly.com/${calendlyUsername}/${eventType}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Open in new window
          </a>
        </p>
      </div>
    </div>
  );
}

// Extend the Window interface to include Calendly
declare global {
  interface Window {
    Calendly: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement | null;
        prefill: Record<string, any>;
        utm: Record<string, any>;
      }) => void;
    };
  }
}