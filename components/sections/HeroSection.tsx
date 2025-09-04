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
              className="font-display text-6xl md:text-8xl font-bold text-ink mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              websites that{' '}
              <span className="relative inline-block">
                pop
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-taro rounded-full"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: [1, 1.2, 1],
                          opacity: [0.8, 1, 0.8],
                        }
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </span>
              <span className="text-taro">.</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              design-first sites with delightful details and boba-smooth interactions.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-taro hover:bg-deep-taro text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Link href="/contact">start a project</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-taro text-taro hover:bg-taro hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
              >
                <Link href="/work">see our work</Link>
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
