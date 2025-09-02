'use client';

import React, { useState } from 'react';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const Tabs = ({ defaultValue, children, className = '' }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab } as any);
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, className = '', activeTab, setActiveTab }: TabsListProps & { activeTab: string; setActiveTab: (value: string) => void }) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab } as any);
        }
        return child;
      })}
    </div>
  );
};

const TabsTrigger = ({ value, children, className = '', activeTab, setActiveTab }: TabsTriggerProps & { activeTab: string; setActiveTab: (value: string) => void }) => {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      } ${className}`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, className = '', activeTab }: TabsContentProps & { activeTab: string }) => {
  if (activeTab !== value) return null;

  return <div className={`mt-4 ${className}`}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };