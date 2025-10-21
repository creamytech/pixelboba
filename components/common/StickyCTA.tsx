'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@iconify/react';

interface StickyCTAProps {
  text?: string;
  href?: string;
  targetId?: string;
}

export default function StickyCTA({
  text = 'GET YOUR QUOTE →',
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

  // Hide on mobile since we now have sticky bottom navigation
  return null;
}
