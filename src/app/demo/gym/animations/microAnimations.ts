// Micro-animations library for gym demo
// All animations are under 400ms with natural easing

export const microAnimations = {
  // Fade animations
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.25, ease: "easeOut" }
  },

  // Scale animations
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  scaleInBounce: {
    initial: { scale: 0.3, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.4, ease: "easeOut" }
  },

  // Slide animations
  slideInLeft: {
    initial: { x: -30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.35, ease: "easeOut" }
  },

  slideInRight: {
    initial: { x: 30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.35, ease: "easeOut" }
  },

  // Hover animations
  hoverLift: {
    whileHover: {
      y: -5,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  hoverScale: {
    whileHover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Button animations
  buttonTap: {
    whileTap: {
      scale: 0.95,
      transition: { duration: 0.1, ease: "easeOut" }
    }
  },

  // Stagger animations for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Utility function to create custom animation variants
export const createAnimation = (
  from: Record<string, any>,
  to: Record<string, any>,
  duration: number = 0.3
) => ({
  initial: from,
  animate: to,
  transition: {
    duration,
    ease: [0.25, 0.46, 0.45, 0.94]
  }
});

// Breathing animation for background elements
export const breathe = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [0.7, 0.9, 0.7],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Pulse animation for interactive elements
export const pulse = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};