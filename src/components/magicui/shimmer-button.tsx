import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.05em',
      borderRadius = '100px',
      shimmerDuration = '3s',
      background = 'rgba(0, 0, 0, 1)',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className="shimmer-button-container" style={{ '--radius': borderRadius } as React.CSSProperties}>
        <div className="animate-border-shimmer" style={{ '--speed': shimmerDuration, '--shimmer-color': shimmerColor } as React.CSSProperties} />
        <button
          className={cn(
            'shimmer-button-inner relative inline-flex h-12 items-center justify-center rounded-md px-6 font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50',
            className
          )}
          style={
            {
              '--bg': background,
            } as React.CSSProperties
          }
          ref={ref}
          {...props}
        >
          {children}
        </button>
      </div>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';

export { ShimmerButton };