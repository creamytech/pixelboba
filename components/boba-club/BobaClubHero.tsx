'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRef } from 'react';
import BobaMorphAnimation from './BobaMorphAnimation';
import FloatingPearls from './FloatingPearls';

export default function BobaClubHero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-milk-tea via-taro/5 to-white pt-20"
    >
      {/* Floating Pearls Background */}
      <FloatingPearls />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            {/* Headline */}
            <motion.h1
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-ink mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {['Boba', 'Club:', 'Unlimited', 'Design', 'for', '$3,000', 'a', 'Month'].map(
                (word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                    className="inline-block mr-3"
                  >
                    {word}
                  </motion.span>
                )
              )}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Your personal design team for everything visual. Branding, illustrations, UI, web, and
              social content — all under one flat monthly rate.
              <br />
              <span className="text-taro font-medium">Pause or cancel anytime.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-taro to-deep-taro hover:from-deep-taro hover:to-taro text-white px-8 py-6 text-lg transition-all duration-300 hover:shadow-xl hover:shadow-taro/30 relative overflow-hidden"
              >
                <Link href="/start">
                  <span className="relative z-10">Join Boba Club</span>
                  <motion.span
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-taro text-taro hover:bg-taro/10 px-8 py-6 text-lg transition-all duration-300"
              >
                <Link href="/contact">Book a Call</Link>
              </Button>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-gray-500 text-sm md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Average turnaround in 24–48 hours.
            </motion.p>
          </motion.div>

          {/* Right: 3D Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            <BobaMorphAnimation />
          </motion.div>
        </div>
      </div>

      {/* Ambient glow overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-taro/10 via-transparent to-transparent pointer-events-none" />
    </section>
  );
}
