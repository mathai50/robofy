'use client';

import React, { useEffect, useState } from 'react';

interface LinearProgressBarProps {
  /**
   * Current progress value (0-100)
   */
  value: number;
  /**
   * Color variant for the progress bar
   */
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  /**
   * Size variant for the progress bar
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional label to display above the progress bar
   */
  label?: string;
  /**
   * Descriptive text shown below the progress bar
   */
  description?: string;
  /**
   * Detailed tooltip content shown on hover
   */
  tooltip?: string;
  /**
   * Whether to show the percentage value
   */
  showValue?: boolean;
  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
  /**
   * Trend indicator (improved, declined, steady)
   */
  trend?: 'up' | 'down' | 'steady';
  /**
   * Loading state for skeleton
   */
  isLoading?: boolean;
  /**
   * Callback function when animation completes
   */
  onAnimationComplete?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const LinearProgressBar = React.forwardRef<HTMLDivElement, LinearProgressBarProps>(
  (
    {
      value,
      color = 'primary',
      size = 'md',
      label,
      description,
      tooltip,
      showValue = true,
      animationDuration = 800,
      trend,
      isLoading = false,
      onAnimationComplete,
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
        }, 50); // Small delay to ensure the component is mounted

        return () => clearTimeout(timer);
      }
    }, [value, isLoading]);

    useEffect(() => {
      if (animatedValue === value && onAnimationComplete) {
        const timer = setTimeout(() => {
          onAnimationComplete();
        }, 100); // Small delay to ensure the animation is fully complete

        return () => clearTimeout(timer);
      }
    }, [animatedValue, value, onAnimationComplete]);

    const colorClasses = {
      primary: 'bg-primary-accent-1',
      success: 'bg-primary-status-success',
      warning: 'bg-primary-status-warning',
      error: 'bg-primary-status-error',
      neutral: 'bg-primary-neutral',
    };

    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    };

    const trackSizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    };

    const valuePositionClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
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

    if (isLoading) {
      return (
        <div className={`w-full ${className}`} ref={ref}>
          <div className="flex justify-between items-center mb-2">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
          </div>
          <div className={`w-full ${trackSizeClasses[size]} bg-gray-200 rounded-full overflow-hidden animate-pulse`}></div>
          {description && (
            <div className="mt-1 h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
          )}
        </div>
      );
    }

    return (
      <div className={`w-full ${className}`} ref={ref}>
        {(label || showValue || tooltip) && (
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              {label && (
                <span className="text-sm font-medium text-gray-700">{label}</span>
              )}
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
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
            
            {showValue && (
              <div className="flex items-center gap-1">
                <span className={`font-medium text-gray-600 ${valuePositionClasses[size]}`}>
                  {Math.round(clampedValue)}%
                </span>
                {trend && (
                  <span className={`${trendColors[trend]} ${valuePositionClasses[size]}`}>
                    {trendIcons[trend]}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        
        <div
          className={`w-full ${trackSizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || 'Progress'}
          aria-describedby={description ? `${label}-desc` : undefined}
        >
          <div
            className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
            style={{
              width: `${clampedValue}%`,
              transitionDuration: `${animationDuration}ms`,
            }}
          />
        </div>
        
        {description && (
          <p
            id={`${label}-desc`}
            className="mt-1 text-xs text-gray-600"
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

LinearProgressBar.displayName = 'LinearProgressBar';

export default LinearProgressBar;