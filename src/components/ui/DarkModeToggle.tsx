"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const DarkModeToggle = () => {
  const { theme, setTheme, themes } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Current theme:', theme);
  }, [theme]);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-full bg-gray-900/20 backdrop-blur-sm border border-gray-900/30 dark:bg-white/10 dark:border-white/20"
      >
        <div className="w-4 h-4" />
      </Button>
    );
  }

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme || 'system');
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    console.log('Switching theme from', theme, 'to', nextTheme);
    setTheme(nextTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getTooltip = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system theme';
      default:
        return 'Switch to light mode';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={cycleTheme}
        className="w-10 h-10 rounded-full bg-gray-900/20 backdrop-blur-sm border border-gray-900/30 hover:bg-gray-900/30 dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20 transition-all duration-300"
        title={getTooltip()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-900 dark:text-white"
          >
            {getIcon()}
          </motion.div>
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};