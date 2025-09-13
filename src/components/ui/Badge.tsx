'use client';

import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ variant = 'default', children, className = '' }: BadgeProps) => {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border border-gray-600',
    secondary: 'bg-gray-700 text-gray-300 border border-gray-600',
    destructive: 'bg-gray-800 text-gray-300 border border-gray-600',
    outline: 'border border-gray-600 bg-transparent text-gray-300'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;