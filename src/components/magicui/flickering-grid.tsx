'use client';

import React, { useEffect, useRef } from 'react';

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(0, 0, 0)',
  width = 800,
  height = 800,
  className = '',
  maxOpacity = 0.2,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Function to draw the grid
    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);

      const columns = Math.floor(width / (squareSize + gridGap));
      const rows = Math.floor(height / (squareSize + gridGap));

      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          if (Math.random() < flickerChance) {
            const opacity = Math.random() * maxOpacity;
            ctx.fillStyle = `rgba(${color.replace('rgb(', '').replace(')', '')}, ${opacity})`;
            ctx.fillRect(
              x * (squareSize + gridGap),
              y * (squareSize + gridGap),
              squareSize,
              squareSize
            );
          }
        }
      }
    };

    // Initial draw
    drawGrid();

    // Animation loop
    const interval = setInterval(drawGrid, 100);
    return () => clearInterval(interval);
  }, [squareSize, gridGap, flickerChance, color, width, height, maxOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
