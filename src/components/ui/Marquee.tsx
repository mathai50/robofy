'use client'

import React, { ReactNode, useRef, useEffect, useState } from 'react'

interface MarqueeProps {
  children: ReactNode
  speed?: number // pixels per second
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
  gap?: number // gap between items in pixels
}

/**
 * Marquee component for horizontal scrolling content
 * 
 * @example
 * <Marquee speed={50} pauseOnHover>
 *   <span>Item 1</span>
 *   <span>Item 2</span>
 *   <span>Item 3</span>
 * </Marquee>
 */
export function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = false,
  className = '',
  gap = 20,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Measure content and container widths
  useEffect(() => {
    const measure = () => {
      if (contentRef.current && containerRef.current) {
        setContentWidth(contentRef.current.scrollWidth)
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [children, gap])

  // Animation effect
  useEffect(() => {
    if (!containerRef.current || !contentRef.current || contentWidth <= 0) return

    const container = containerRef.current
    const content = contentRef.current
    let animationFrame: number
    let startTime: number | null = null
    let position = 0

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      if (isPaused) {
        startTime = timestamp - (position / speed) * 1000
        animationFrame = requestAnimationFrame(animate)
        return
      }

      const elapsed = timestamp - startTime
      position = (elapsed / 1000) * speed * (direction === 'left' ? -1 : 1)

      // Reset position when content scrolls completely
      if (Math.abs(position) > contentWidth + gap) {
        position = 0
        startTime = timestamp
      }

      content.style.transform = `translateX(${position}px)`
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [speed, direction, contentWidth, gap, isPaused])

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={contentRef}
        className="flex whitespace-nowrap"
        style={{ gap: `${gap}px` }}
      >
        {children}
      </div>
    </div>
  )
}