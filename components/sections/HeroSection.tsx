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
      {/* Pearl Pattern Background */}
      <div className="absolute inset-0 text-taro/10 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hero-pearl-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.5" />
              <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.3" />
              <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#hero-pearl-pattern)" />
        </svg>
      </div>

      {/* Large Boba Cup Illustration - Right Side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full hidden lg:flex items-center justify-center opacity-20 pointer-events-none">
        <motion.svg
          className="w-full max-w-2xl text-taro"
          viewBox="0 0 300 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {/* Large boba cup */}
          <path
            d="M90 80L70 320C70 340 80 360 100 360H200C220 360 230 340 230 320L210 80H90Z"
            stroke="currentColor"
            strokeWidth="4"
            fill="currentColor"
            fillOpacity="0.05"
          />
          {/* Lid */}
          <path d="M60 80H240" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          {/* Straw */}
          <path d="M165 40L160 160" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          {/* Liquid fill */}
          <defs>
            <linearGradient id="liquid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#84CC16" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            d="M95 140L75 320C75 338 85 355 100 355H200C215 355 225 338 225 320L205 140Z"
            fill="url(#liquid)"
          />
          {/* Pearls */}
          <circle cx="120" cy="310" r="12" fill="currentColor" opacity="0.3" />
          <circle cx="150" cy="320" r="12" fill="currentColor" opacity="0.3" />
          <circle cx="180" cy="310" r="12" fill="currentColor" opacity="0.3" />
          <circle cx="135" cy="280" r="10" fill="currentColor" opacity="0.25" />
          <circle cx="165" cy="285" r="10" fill="currentColor" opacity="0.25" />
        </motion.svg>
      </div>

      {/* Floating Pearls with Parallax */}
      <FloatingPearls />

      {/* Lighthouse Badges */}
      <LighthouseBadges />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Left column - Text content */}
            <div className="text-center lg:text-left">
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
                  className="text-lg md:text-xl text-gray-700 mb-6 max-w-xl lg:max-w-none lowercase leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  clean code. live previews from day one. websites that actually convert. no calls,
                  no confusion.
                </motion.p>

                {/* Value Badges */}
                <div className="mb-6">
                  <ValueBadges />
                </div>

                {/* Trust Statement */}
                <motion.p
                  className="text-sm md:text-base text-gray-600 mb-8 lowercase"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  trusted by 30+ businesses for performance-driven websites.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center items-center w-full max-w-lg lg:max-w-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
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

            {/* Right column - Visual element on mobile */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative"
              >
                {/* Placeholder for visual balance - the main illustration is in the background */}
                <div className="w-full h-96"></div>
              </motion.div>
            </div>
          </div>
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
