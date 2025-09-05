'use client';

import React from 'react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  reverseOnMobile?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className = '',
  gap = 'md',
  alignItems = 'center',
  reverseOnMobile = false,
}) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-8',
    lg: 'gap-12',
    xl: 'gap-16',
  };

  const alignItemsClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const mobileOrder = reverseOnMobile ? 'flex-col-reverse' : 'flex-col';

  return (
    <div
      className={`flex ${mobileOrder} lg:flex-row ${gapClasses[gap]} ${alignItemsClasses[alignItems]} ${className}`}
    >
      {children}
    </div>
  );
};

interface ResponsiveColumnProps {
  children: React.ReactNode;
  className?: string;
  width?: 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';
  order?: number;
}

const ResponsiveColumn: React.FC<ResponsiveColumnProps> = ({
  children,
  className = '',
  width = 'full',
  order,
}) => {
  const widthClasses = {
    full: 'w-full',
    '1/2': 'w-full lg:w-1/2',
    '1/3': 'w-full lg:w-1/3',
    '2/3': 'w-full lg:w-2/3',
    '1/4': 'w-full lg:w-1/4',
    '3/4': 'w-full lg:w-3/4',
  };

  const orderClass = order ? `lg:order-${order}` : '';

  return (
    <div className={`${widthClasses[width]} ${orderClass} ${className}`}>
      {children}
    </div>
  );
};

export { ResponsiveLayout, ResponsiveColumn };