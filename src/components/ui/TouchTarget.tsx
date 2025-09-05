'use client';

import React from 'react';

interface TouchTargetProps {
  children: React.ReactNode;
  className?: string;
  as?: 'button' | 'div' | 'span' | 'a';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  minSize?: 'sm' | 'md' | 'lg' | 'xl';
}

const TouchTarget: React.FC<TouchTargetProps> = ({
  children,
  className = '',
  as = 'button',
  href,
  onClick,
  type = 'button',
  disabled = false,
  minSize = 'md',
}) => {
  const sizeClasses = {
    sm: 'min-h-[36px] min-w-[36px]',
    md: 'min-h-[44px] min-w-[44px]',
    lg: 'min-h-[52px] min-w-[52px]',
    xl: 'min-h-[60px] min-w-[60px]',
  };

  const baseClasses = `inline-flex items-center justify-center ${sizeClasses[minSize]} px-4 py-3 ${className}`;

  const commonProps = {
    className: baseClasses,
    onClick,
    disabled,
  };

  switch (as) {
    case 'a':
      return (
        <a href={href} {...commonProps}>
          {children}
        </a>
      );
    case 'div':
      return (
        <div {...commonProps}>
          {children}
        </div>
      );
    case 'span':
      return (
        <span {...commonProps}>
          {children}
        </span>
      );
    case 'button':
    default:
      return (
        <button type={type} {...commonProps}>
          {children}
        </button>
      );
  }
};

export default TouchTarget;