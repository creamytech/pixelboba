'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  const sizeConfig = {
    sm: { button: 'w-8 h-8', icon: 16 },
    md: { button: 'w-10 h-10', icon: 18 },
    lg: { button: 'w-12 h-12', icon: 20 },
  };

  const config = sizeConfig[size];

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative ${config.button} rounded-lg border border-brown-sugar/20 bg-milk-tea/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'backOut' }}
      >
        {isDark ? (
          <Moon
            size={config.icon}
            className="text-blue-400 group-hover:text-blue-300 transition-colors"
          />
        ) : (
          <Sun
            size={config.icon}
            className="text-amber-500 group-hover:text-amber-400 transition-colors"
          />
        )}
      </motion.div>

      {/* Background glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity ${
          isDark ? 'bg-blue-400' : 'bg-amber-400'
        }`}
        animate={{
          opacity: [0, 0.1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
}
