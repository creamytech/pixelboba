'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import CheckoutButton from './CheckoutButton';

export default function BobaClubStickyButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  // Show button after scrolling down 300px
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 100 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
        y: isVisible ? 0 : 100,
      }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
      className="hidden md:block fixed bottom-8 right-8 z-50"
    >
      <div className="relative">
        <CheckoutButton
          size="lg"
          className="group bg-gradient-to-r from-taro to-deep-taro hover:from-deep-taro hover:to-taro text-white px-6 py-6 rounded-full shadow-2xl hover:shadow-taro/50 transition-all duration-300 relative overflow-hidden inline-flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-bold">Join Boba Club</span>
        </CheckoutButton>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-taro pointer-events-none"
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none rounded-full"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Floating boba pearl */}
      <motion.div
        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-matcha shadow-lg"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-white/40 to-transparent rounded-full" />
      </motion.div>
    </motion.div>
  );
}
