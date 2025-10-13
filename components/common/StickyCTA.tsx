'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface StickyCTAProps {
  text?: string;
  href?: string;
  targetId?: string;
}

export default function StickyCTA({
  text = 'start your project',
  href = '/start',
  targetId = 'start',
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after user scrolls past 50% of viewport height
      const scrolled = window.scrollY;
      const threshold = window.innerHeight * 0.5;

      setIsVisible(scrolled > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Try to find target element on current page first
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fall back to navigation
      window.location.href = href;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
            scale: { duration: 0.2 },
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-taro to-deep-taro text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-shadow duration-300 lowercase relative overflow-hidden"
          >
            {/* Background shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 3,
              }}
            />

            {/* Pearl accents */}
            <div className="absolute top-1 right-2 w-2 h-2 bg-matcha rounded-full opacity-80"></div>
            <div className="absolute bottom-1 left-3 w-1.5 h-1.5 bg-white/60 rounded-full"></div>

            <span className="relative z-10 flex items-center">
              {text}
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="ml-2"
              >
                →
              </motion.span>
            </span>
          </motion.button>

          {/* Floating bubbles */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-2 -left-2 w-3 h-3 bg-matcha/40 rounded-full"
          />
          <motion.div
            animate={{
              y: [0, -12, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute -bottom-1 -right-3 w-2 h-2 bg-taro/30 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
