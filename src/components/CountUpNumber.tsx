'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CountUpNumberProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function CountUpNumber({ 
  value, 
  suffix = '', 
  duration = 2000, 
  className = '' 
}: CountUpNumberProps) {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = value / (duration / 16); // 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  const formatNumber = (num: number) => {
    if (num % 1 !== 0) {
      return num.toFixed(1);
    }
    return num.toString();
  };

  return (
    <span ref={ref} className={className}>
      {formatNumber(count)}{suffix}
    </span>
  );
}