'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import FloatingPearls from '@/components/common/FloatingPearls';
import ValueBadges from '@/components/sections/ValueBadges';
import Link from 'next/link';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!mounted) {
    return <div className="h-screen" />;
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-milk-tea via-background to-taro/5">
      {/* Floating Pearls with Parallax */}
      <FloatingPearls />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-ink mb-6 leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Modern Websites That Look{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Sharp</span>
                <span className="absolute inset-0 bg-gradient-to-r from-taro/20 to-matcha/20 blur-xl scale-110"></span>
              </span>
              <span className="text-taro">,</span> Load Fast, and Convert Better
              <span className="text-taro">.</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-700 font-medium mb-8 px-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              No calls. No confusion. Just clean code, real previews, and results that pop.
            </motion.p>

            {/* Value Badges */}
            <ValueBadges />

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 w-full max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Button
                asChild
                size="lg"
                className="group w-full sm:w-auto bg-taro hover:bg-deep-taro text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-taro/30 lowercase min-h-[3.5rem]"
              >
                <Link href="/start">
                  start now
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className="group w-full sm:w-auto border-2 border-taro/30 text-taro hover:bg-taro/5 hover:border-taro px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 lowercase min-h-[3.5rem]"
              >
                <Link href="/process">
                  see our process
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1 opacity-70">
                    →
                  </span>
                </Link>
              </Button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div
                className="w-6 h-10 border-2 border-taro rounded-full flex justify-center"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [0, 5, 0],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <motion.div
                  className="w-2 h-3 bg-taro rounded-full mt-2"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          y: [0, 10, 0],
                          opacity: [1, 0.3, 1],
                        }
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent pointer-events-none" />
    </section>
  );
}
