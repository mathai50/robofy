'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
}: OrbitingCirclesProps) {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div className={cn("relative flex size-full transform-gpu items-center justify-center", className)}>

      {path && (
        <div
          className="absolute rounded-full border border-dashed border-gray-300"
          style={{
            width: radius * 2 + 'px',
            height: radius * 2 + 'px',
          }}
        />
      )}

      {childrenArray.map((child, index) => {
        const angle = (360 / childrenArray.length) * index;
        const delayTime = (delay / childrenArray.length) * index;
        
        return (
          <div
            key={index}
            className={cn(
              "absolute flex transform-gpu items-center justify-center z-10",
              reverse ? "animate-orbit-reverse" : "animate-orbit"
            )}
            style={{
              '--angle': angle,
              '--radius': radius,
              '--duration': duration / speed,
              '--delay': -delayTime,
              transform: `rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))`,
            } as React.CSSProperties}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: iconSize + 'px',
                height: iconSize + 'px',
              }}
            >
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );
}