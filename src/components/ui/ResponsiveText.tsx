'use client';

import React from 'react';

interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  className = '',
  as = 'p',
  size = 'base',
  weight = 'normal',
  align = 'left',
  color = 'default',
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-2xl sm:text-3xl md:text-4xl',
    '4xl': 'text-3xl sm:text-4xl md:text-5xl',
    '5xl': 'text-4xl sm:text-5xl md:text-6xl',
    '6xl': 'text-5xl sm:text-6xl md:text-7xl',
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const colorClasses = {
    default: 'text-gray-900',
    muted: 'text-gray-600',
    primary: 'text-blue-600',
    secondary: 'text-gray-500',
    accent: 'text-amber-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  };

  const combinedClasses = `${sizeClasses[size]} ${weightClasses[weight]} ${alignClasses[align]} ${colorClasses[color]} ${className}`;

  const Tag = as;

  return <Tag className={combinedClasses}>{children}</Tag>;
};

export default ResponsiveText;