'use client';

import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from 'lucide-react';
import { MotionButton, MotionDiv } from '@/components/motion/MotionWrapper';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Animation variants for the icon switch
  const variants = {
    initial: { scale: 0.6, rotate: 0, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0.6, rotate: 90, opacity: 0 },
  };

  return (
    <MotionButton
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm text-primary-600 dark:text-primary-400
        hover:bg-gray-200/80 dark:hover:bg-gray-700/80
        focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
        shadow-sm hover:shadow transition-all duration-300"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative w-5 h-5">
        {theme === 'dark' ? (
          <MotionDiv
            key="sun"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <SunIcon className="h-5 w-5" aria-hidden="true" />
          </MotionDiv>
        ) : (
          <MotionDiv
            key="moon"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <MoonIcon className="h-5 w-5" aria-hidden="true" />
          </MotionDiv>
        )}
      </div>
    </MotionButton>
  );
}
