'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PearlField from '@/components/animations/PearlField';
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
      {/* Pearl Background */}
      <div className="absolute inset-0">
        <PearlField className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className="font-display text-6xl md:text-8xl font-bold text-ink mb-6 lowercase"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              websites that <span className="relative inline-block">pop</span>
              <span className="text-taro">.</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto lowercase leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              get more leads, sell more products, build your brand. see working previews from day
              one, skip the endless meetings.
            </motion.p>

            {/* Social proof bullets */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 text-sm md:text-base px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-taro rounded-full"></div>
                <span className="lowercase">see your site building live</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-matcha rounded-full"></div>
                <span className="lowercase">clean, professional results</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-milk-tea rounded-full"></div>
                <span className="lowercase">launch in 2-6 weeks</span>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 w-full max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-taro hover:bg-deep-taro text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg lowercase min-h-[3.5rem]"
              >
                <Link href="/services#start">start your project</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-taro text-taro hover:bg-taro hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 lowercase min-h-[3.5rem]"
              >
                <Link href="/process">see our process</Link>
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
