'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DockIconProps {
  size?: number;
  magnification?: number;
  distance?: number;
  mouseX?: number | null;
  className?: string;
  children: React.ReactNode;
  props?: React.PropsWithChildren<unknown>;
}

export function DockIcon({
  size = 40,
  magnification = 60,
  distance = 140,
  mouseX = null,
  className = '',
  children,
  ...props
}: DockIconProps) {
  const calculateScale = (distance: number, mouseX: number | null, index: number) => {
    if (mouseX === null) return 1;

    const distanceFromMouse = Math.abs(mouseX - (index * size + size / 2));
    const scale = 1 + (magnification / 100) * (1 - distanceFromMouse / distance);
    return Math.max(1, scale);
  };

  return (
    <motion.div
      className={`flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 ${className}`}
      style={{
        width: size,
        height: size,
      }}
      whileHover={{
        scale: 1.15,
        y: -8,
        rotate: 5,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: [0, -4, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      {...props}
    >
      <div className="flex items-center justify-center w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}