'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface AnimatedListProps {
  children: ReactNode[];
  delay?: number;
  className?: string;
}

export function AnimatedList({ children, delay = 1000, className = '' }: AnimatedListProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let currentIndex = 0;
    
    const showNextItem = () => {
      if (currentIndex < children.length) {
        setVisibleItems(prev => [...prev, currentIndex]);
        currentIndex++;
        timerRef.current = setTimeout(showNextItem, delay);
      }
    };

    // Start the animation
    timerRef.current = setTimeout(showNextItem, delay);

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [children.length, delay]);

  // Reset when children change
  useEffect(() => {
    setVisibleItems([]);
  }, [children]);

  return (
    <div className={`space-y-4 ${className}`}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`transition-all duration-500 ease-out transform ${
            visibleItems.includes(index)
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
}