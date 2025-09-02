'use client';

import React from 'react';

interface AlertProps {
  variant?: 'default' | 'destructive' | 'success';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Alert = ({ variant = 'default', title, children, className = '' }: AlertProps) => {
  const variants = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  return (
    <div className={`border rounded-md p-4 ${variants[variant]} ${className}`}>
      {title && (
        <h4 className="font-medium mb-2">{title}</h4>
      )}
      <div className="text-sm">
        {children}
      </div>
    </div>
  );
};

export default Alert;