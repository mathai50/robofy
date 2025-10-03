'use client';

import { useState, useEffect, useRef } from 'react';

interface TouchPosition {
  x: number;
  y: number;
}

interface SwipeConfig {
  threshold?: number;
  velocityThreshold?: number;
  preventScroll?: boolean;
}

interface UseGestureNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: (position: TouchPosition) => void;
  onLongPress?: (position: TouchPosition) => void;
  swipeConfig?: SwipeConfig;
}

export const useGestureNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onLongPress,
  swipeConfig = {}
}: UseGestureNavigationOptions = {}) => {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    preventScroll = false
  } = swipeConfig;

  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPosition | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  const elementRef = useRef<HTMLElement>(null);

  // Calculate swipe distance and velocity
  const getSwipeDistance = (start: TouchPosition, end: TouchPosition) => {
    return {
      x: end.x - start.x,
      y: end.y - start.y,
      distance: Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
    };
  };

  const getSwipeDirection = (start: TouchPosition, end: TouchPosition) => {
    const { x, y } = getSwipeDistance(start, end);
    const absX = Math.abs(x);
    const absY = Math.abs(y);

    if (Math.max(absX, absY) < threshold) return null;

    if (absX > absY) {
      return x > 0 ? 'right' : 'left';
    } else {
      return y > 0 ? 'down' : 'up';
    }
  };

  // Touch event handlers
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    const startPos = { x: touch.clientX, y: touch.clientY };
    setTouchStart(startPos);
    setTouchEnd(null);
    setIsLongPress(false);

    // Start long press timer
    if (onLongPress) {
      const timer = setTimeout(() => {
        setIsLongPress(true);
        onLongPress(startPos);
      }, 500);
      setLongPressTimer(timer);
    }

    if (preventScroll) {
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    if (preventScroll) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    if (!touchStart || isLongPress) return;

    const touch = e.changedTouches[0];
    const endPos = { x: touch.clientX, y: touch.clientY };
    setTouchEnd(endPos);

    const direction = getSwipeDirection(touchStart, endPos);

    switch (direction) {
      case 'left':
        onSwipeLeft?.();
        break;
      case 'right':
        onSwipeRight?.();
        break;
      case 'up':
        onSwipeUp?.();
        break;
      case 'down':
        onSwipeDown?.();
        break;
    }

    // If no significant movement, treat as tap
    const distance = Math.sqrt(
      Math.pow(endPos.x - touchStart.x, 2) +
      Math.pow(endPos.y - touchStart.y, 2)
    );

    if (distance < 10 && onTap) {
      onTap(endPos);
    }
  };

  // Mouse event handlers for desktop
  const handleMouseDown = (e: MouseEvent) => {
    const startPos = { x: e.clientX, y: e.clientY };
    setTouchStart(startPos);

    if (onLongPress) {
      const timer = setTimeout(() => {
        setIsLongPress(true);
        onLongPress(startPos);
      }, 500);
      setLongPressTimer(timer);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    if (!touchStart || isLongPress) return;

    const endPos = { x: e.clientX, y: e.clientY };
    setTouchEnd(endPos);

    const direction = getSwipeDirection(touchStart, endPos);

    switch (direction) {
      case 'left':
        onSwipeLeft?.();
        break;
      case 'right':
        onSwipeRight?.();
        break;
      case 'up':
        onSwipeUp?.();
        break;
      case 'down':
        onSwipeDown?.();
        break;
    }

    // If no significant movement, treat as tap
    const distance = Math.sqrt(
      Math.pow(endPos.x - touchStart.x, 2) +
      Math.pow(endPos.y - touchStart.y, 2)
    );

    if (distance < 10 && onTap) {
      onTap(endPos);
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    // Prevent right-click context menu during gestures
    if (isLongPress) {
      e.preventDefault();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        onSwipeLeft?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        onSwipeRight?.();
        break;
      case 'ArrowUp':
        e.preventDefault();
        onSwipeUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        onSwipeDown?.();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (onTap && touchStart) {
          onTap(touchStart);
        }
        break;
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add touch and mouse event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('contextmenu', handleContextMenu);

    // Add keyboard navigation
    element.addEventListener('keydown', handleKeyDown);
    element.setAttribute('tabIndex', '0');

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);

      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('contextmenu', handleContextMenu);

      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [touchStart, isLongPress, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, onLongPress]);

  // Cleanup long press timer
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  return {
    ref: elementRef,
    isGestureActive: touchStart !== null,
    lastTouchPosition: touchEnd
  };
};

// Hook for section navigation
export const useSectionNavigation = (sectionCount: number) => {
  const [currentSection, setCurrentSection] = useState(0);

  const goToNext = () => {
    setCurrentSection((prev) => (prev + 1) % sectionCount);
  };

  const goToPrevious = () => {
    setCurrentSection((prev) => (prev - 1 + sectionCount) % sectionCount);
  };

  const goToSection = (index: number) => {
    if (index >= 0 && index < sectionCount) {
      setCurrentSection(index);
    }
  };

  return {
    currentSection,
    goToNext,
    goToPrevious,
    goToSection,
    isFirst: currentSection === 0,
    isLast: currentSection === sectionCount - 1
  };
};