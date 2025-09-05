'use client';

import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

interface EnhancedCircularProgressBarProps {
  /**
   * Current progress value (0-100)
   */
  value: number;
  /**
   * Color variant for the progress bar
   */
  color?: 'blue' | 'green' | 'orange' | 'red' | 'neutral';
  /**
   * Size variant for the progress bar
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Main title for the KPI
   */
  title: string;
  /**
   * Descriptive text shown below the KPI
   */
  description?: string;
  /**
   * Detailed tooltip content shown on hover
   */
  tooltip?: string;
  /**
   * Whether to show the percentage value inside the circle
   */
  showValue?: boolean;
  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
  /**
   * Stroke width of the progress circle
   */
  strokeWidth?: number;
  /**
   * Trend indicator (improved, declined, steady)
   */
  trend?: 'up' | 'down' | 'steady';
  /**
   * Loading state for skeleton
   */
  isLoading?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const EnhancedCircularProgressBar = React.forwardRef<HTMLDivElement, EnhancedCircularProgressBarProps>(
  (
    {
      value,
      color = 'blue',
      size = 'md',
      title,
      description,
      tooltip,
      showValue = true,
      animationDuration = 1000,
      strokeWidth = 8,
      trend,
      isLoading = false,
      className = '',
    },
    ref
  ) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
      if (!isLoading) {
        const timer = setTimeout(() => {
          setAnimatedValue(value);
        }, 50);

        return () => clearTimeout(timer);
      }
    }, [value, isLoading]);

    const colorClasses = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      orange: 'text-orange-500',
      red: 'text-red-500',
      neutral: 'text-gray-500',
    };

    const sizeClasses = {
      sm: 'w-16 h-16',
      md: 'w-24 h-24',
      lg: 'w-32 h-32',
      xl: 'w-40 h-40',
    };

    const textSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    };

    const titleSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    };

    const trendIcons = {
      up: '↗',
      down: '↘',
      steady: '→',
    };

    const trendColors = {
      up: 'text-green-600',
      down: 'text-red-600',
      steady: 'text-gray-600',
    };

    const clampedValue = Math.max(0, Math.min(100, animatedValue));
    
    // Calculate SVG properties
    const radius = {
      sm: 28,
      md: 44,
      lg: 60,
      xl: 76,
    }[size];
    
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

    if (isLoading) {
      return (
        <div className={`flex flex-col items-center ${className}`} ref={ref}>
          <div className={`relative ${sizeClasses[size]} rounded-full bg-gray-200 animate-pulse`}></div>
          <div className="mt-3 h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          {description && (
            <div className="mt-1 h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
          )}
        </div>
      );
    }

    return (
      <div className={`flex flex-col items-center ${className}`} ref={ref}>
        <div className={`relative ${sizeClasses[size]}`}>
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox={`0 0 ${radius * 2 + strokeWidth} ${radius * 2 + strokeWidth}`}
            aria-hidden="true"
          >
            {/* Background circle */}
            <circle
              cx={radius + strokeWidth / 2}
              cy={radius + strokeWidth / 2}
              r={radius}
              strokeWidth={strokeWidth}
              stroke="currentColor"
              className="text-gray-200 opacity-40"
              fill="none"
            />
            
            {/* Progress circle */}
            <circle
              cx={radius + strokeWidth / 2}
              cy={radius + strokeWidth / 2}
              r={radius}
              strokeWidth={strokeWidth}
              stroke="currentColor"
              className={`${colorClasses[color]} transition-all duration-300 ease-out`}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transitionDuration: `${animationDuration}ms`,
              }}
            />
          </svg>
          
          {showValue && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <span className={`font-bold text-gray-800 ${textSizeClasses[size]}`}>
                  {Math.round(clampedValue)}%
                </span>
                {trend && (
                  <span className={`${trendColors[trend]} text-xs`}>
                    {trendIcons[trend]}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <h3 className={`font-semibold text-gray-800 ${titleSizeClasses[size]}`}>
              {title}
            </h3>
            {tooltip && (
              <div className="relative">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                  aria-label="More information"
                >
                  <Info size={14} />
                </button>
                {showTooltip && (
                  <div className="absolute z-10 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
                    {tooltip}
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {description && (
            <p className="mt-1 text-xs text-gray-600 max-w-[200px]">
              {description}
            </p>
          )}
        </div>
        
        {/* Accessibility: hidden progress bar for screen readers */}
        <div
          className="sr-only"
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title}: ${clampedValue}% complete`}
          aria-describedby={description ? `${title}-desc` : undefined}
        >
          {clampedValue}% complete
        </div>
        
        {description && (
          <div id={`${title}-desc`} className="sr-only">
            {description}
          </div>
        )}
      </div>
    );
  }
);

EnhancedCircularProgressBar.displayName = 'EnhancedCircularProgressBar';

export default EnhancedCircularProgressBar;