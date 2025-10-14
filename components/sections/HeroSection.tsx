'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import FloatingPearls from '@/components/common/FloatingPearls';
import ValueBadges from '@/components/sections/ValueBadges';
import LighthouseBadges from '@/components/sections/LighthouseBadges';
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
      {/* Animated 3D Floating Pearls Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 60 + 40; // 40-100px
          const left = Math.random() * 100; // 0-100%
          const animationDuration = Math.random() * 10 + 15; // 15-25s
          const delay = Math.random() * -20; // stagger start times
          const opacity = Math.random() * 0.15 + 0.05; // 0.05-0.2
          const colorClasses = ['bg-taro', 'bg-matcha', 'bg-milk-tea'];
          const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];

          return (
            <motion.div
              key={i}
              className={`absolute bottom-0 rounded-full ${colorClass} blur-sm`}
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                opacity: opacity,
              }}
              animate={{
                y: [0, -window.innerHeight - 200],
                x: [0, Math.sin(i) * 100],
                scale: [1, 1.2, 0.8, 1],
              }}
              transition={{
                duration: animationDuration,
                repeat: Infinity,
                delay: delay,
                ease: 'linear',
              }}
            />
          );
        })}
      </div>

      {/* Lighthouse Badges */}
      <LighthouseBadges />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-4 leading-tight lowercase"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              websites as{' '}
              <motion.span
                className="relative inline-block"
                animate={{
                  rotate: [0, -1, 1, -1, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 0.3,
                  delay: 1.5,
                  times: [0, 0.25, 0.5, 0.75, 1],
                }}
              >
                <span className="relative z-10 text-taro">smooth</span>
                <span className="absolute inset-0 bg-gradient-to-r from-taro/20 to-matcha/20 blur-xl scale-110"></span>
              </motion.span>{' '}
              as your favorite boba
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto lowercase leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              clean code. live previews from day one. websites that actually convert. no calls, no
              confusion.
            </motion.p>

            {/* Trust Statement */}
            <motion.p
              className="text-sm md:text-base text-gray-600 mb-8 lowercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              trusted by 30+ businesses for performance-driven websites.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
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
          </motion.div>
        </div>
      </div>

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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent pointer-events-none" />
    </section>
  );
}
