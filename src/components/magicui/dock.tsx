'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DockIcon } from './dock-icon';

interface DockProps {
  className?: string;
  children: React.ReactNode;
  iconSize?: number;
  iconMagnification?: number;
  iconDistance?: number;
  direction?: 'left' | 'middle' | 'right';
  disableMagnification?: boolean;
}

export function Dock({
  className = '',
  children,
  iconSize = 40,
  iconMagnification = 60,
  iconDistance = 140,
  direction = 'middle',
  disableMagnification = false,
}: DockProps) {
  const [mouseX, setMouseX] = useState(0);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dockRef.current) {
        const rect = dockRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        setMouseX(mouseX);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const justifyClass = {
    left: 'justify-start',
    middle: 'justify-center',
    right: 'justify-end',
  }[direction];

  return (
    <div
      ref={dockRef}
      className={`flex items-end ${justifyClass} ${className}`}
    >
      <div className="flex items-end space-x-2 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 p-2">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === DockIcon) {
            return React.cloneElement(child, {
              size: iconSize,
              magnification: iconMagnification,
              distance: iconDistance,
              mouseX: disableMagnification ? null : mouseX,
              ...child.props,
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}