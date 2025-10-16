'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BobaClubHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-milk-tea pt-20">
      {/* Colorful blob decorations - static on mobile for performance */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-taro rounded-full blur-3xl opacity-40 md:hidden" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-matcha rounded-full blur-3xl opacity-30 md:hidden" />

      {/* Animated blobs on desktop only */}
      <motion.div
        className="absolute top-20 right-10 w-64 h-64 bg-taro rounded-full blur-3xl opacity-40 hidden md:block"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-80 h-80 bg-matcha rounded-full blur-3xl opacity-30 hidden md:block"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
        {/* Big, bold badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="inline-block mb-8"
        >
          <div className="bg-white border-4 border-ink rounded-full px-6 py-2 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <p className="font-bold text-ink">unlimited design for a flat monthly fee</p>
          </div>
        </motion.div>

        {/* Massive headline */}
        <motion.h1
          className="font-display text-6xl md:text-8xl lg:text-[10rem] font-black text-ink mb-6 leading-[0.85]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          design on
          <br />
          <span className="italic text-taro">tap.</span>
        </motion.h1>

        {/* Explainer tagline */}
        <motion.p
          className="text-xl md:text-2xl text-ink font-bold mb-4 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
          Unlimited design requests for creators and brands at a flat monthly rate
        </motion.p>

        {/* Pricing surface */}
        <motion.div
          className="inline-flex items-center gap-2 bg-gradient-to-r from-taro/10 to-matcha/10 border-2 border-ink/20 rounded-full px-5 py-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
        >
          <span className="font-display text-2xl md:text-3xl font-black text-ink">$3,000</span>
          <span className="text-sm text-ink/60 font-medium">/month</span>
        </motion.div>

        {/* Punchy subheadline */}
        <motion.p
          className="text-lg md:text-xl text-ink/70 mb-12 max-w-3xl mx-auto font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        >
          subscribe and request as many designs as you need. delivered fast. revised until perfect.
          pause anytime.
        </motion.p>

        {/* Big CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
        >
          <Button
            asChild
            size="lg"
            className="group bg-gradient-to-r from-taro to-deep-taro hover:from-deep-taro hover:to-taro text-white px-14 py-8 text-xl font-black rounded-full shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all duration-200 hover:translate-x-1 hover:translate-y-1 border-4 border-ink relative overflow-hidden"
          >
            <a
              href="#pricing"
              className="relative z-10 flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span>join boba club</span>
              <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-4 border-ink text-ink hover:bg-ink hover:text-white px-14 py-8 text-xl font-bold rounded-full transition-all duration-200"
          >
            <a href="mailto:hello@pixelboba.com">contact us</a>
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-ink/60"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-matcha rounded-full animate-pulse" />
            <span className="font-medium">24-48 hour delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-taro rounded-full animate-pulse" />
            <span className="font-medium">unlimited revisions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-brown-sugar rounded-full animate-pulse" />
            <span className="font-medium">pause or cancel anytime</span>
          </div>
        </motion.div>

        {/* Big emoji decoration */}
        <motion.div
          className="absolute -right-10 top-1/4 text-9xl hidden lg:block"
          animate={{
            rotate: [0, 10, -10, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🧋
        </motion.div>

        <motion.div
          className="absolute -left-10 bottom-1/4 text-8xl hidden lg:block"
          animate={{
            rotate: [0, -10, 10, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          ✨
        </motion.div>
      </div>
    </section>
  );
}
