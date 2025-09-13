'use client';

import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

interface FloatingDemoButtonProps {
  /** Button label text */
  label?: string;
  /** Whether to show an icon */
  showIcon?: boolean;
  /** Icon to display (calendar or arrow) */
  iconType?: 'calendar' | 'arrow';
  /** Click handler function */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

const FloatingDemoButton = React.memo(
  ({
    label = 'Book a Demo',
    showIcon = true,
    iconType = 'calendar',
    onClick,
    className = '',
  }: FloatingDemoButtonProps) => {
    const handleClick = () => {
      onClick?.();
      // Default behavior: log to console, can be replaced with modal or navigation
      console.log('Book a Demo button clicked');
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    };

    const IconComponent = iconType === 'calendar' ? Calendar : ArrowRight;

    return (
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          fixed bottom-6 right-6 z-50
          flex items-center justify-center gap-3
          bg-white
          text-black font-bold
          rounded-full px-6 py-4
          shadow-2xl hover:shadow-3xl
          transition-all duration-200
          transform hover:scale-110
          focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2
          min-w-[160px] h-14
          animate-bounce
          ${className}
        `}
        aria-label={label}
        role="button"
        tabIndex={0}
      >
        {showIcon && <IconComponent size={18} className="flex-shrink-0" />}
        <span className="whitespace-nowrap text-sm sm:text-base">{label}</span>
      </button>
    );
  }
);

FloatingDemoButton.displayName = 'FloatingDemoButton';

export default FloatingDemoButton;