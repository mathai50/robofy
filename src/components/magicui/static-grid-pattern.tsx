"use client";

import { cn } from "@/lib/utils";

interface StaticGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  className?: string;
  strokeDasharray?: string | number;
  numSquares?: number;
  maxOpacity?: number;
}

export function StaticGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  className,
  strokeDasharray = "0",
  numSquares = 100,
  maxOpacity = 0.5,
  ...props
}: StaticGridPatternProps) {
  return (
    <svg
      width={width * numSquares}
      height={height * numSquares}
      className={cn(
        "absolute inset-0 h-full w-full fill-none stroke-gray-400/30",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id="pattern-static"
          x={x}
          y={y}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#pattern-static)"
        opacity={maxOpacity}
      />
    </svg>
  );
}