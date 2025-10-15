'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BobaClubHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-milk-tea pt-20">
      {/* Colorful blob decorations */}
      <motion.div
        className="absolute top-20 right-10 w-64 h-64 bg-taro rounded-full blur-3xl opacity-40"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-80 h-80 bg-matcha rounded-full blur-3xl opacity-30"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating boba pearls */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-12 h-12 rounded-full"
          style={{
            background:
              i % 3 === 0
                ? 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)'
                : i % 3 === 1
                  ? 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)'
                  : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 25}%`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 -4px 8px rgba(0,0,0,0.2)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, i % 2 === 0 ? 15 : -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        >
          <div className="absolute inset-2 bg-white/30 rounded-full blur-sm" />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
        {/* Big, bold badge */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-block mb-8"
        >
          <div className="bg-white border-4 border-ink rounded-full px-6 py-2 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <p className="font-bold text-ink">unlimited design for a flat monthly fee</p>
          </div>
        </motion.div>

        {/* Massive headline */}
        <motion.h1
          className="font-display text-6xl md:text-8xl lg:text-[10rem] font-black text-ink mb-6 leading-[0.85]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          design on
          <br />
          <span className="italic text-taro">tap.</span>
        </motion.h1>

        {/* Explainer tagline */}
        <motion.p
          className="text-xl md:text-2xl text-ink font-bold mb-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Unlimited design requests for creators and brands at a flat monthly rate
        </motion.p>

        {/* Pricing surface */}
        <motion.div
          className="inline-flex items-center gap-2 bg-gradient-to-r from-taro/10 to-matcha/10 border-2 border-ink/20 rounded-full px-5 py-2 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <span className="font-display text-2xl md:text-3xl font-black text-ink">$3,000</span>
          <span className="text-sm text-ink/60 font-medium">/month</span>
        </motion.div>

        {/* Punchy subheadline */}
        <motion.p
          className="text-lg md:text-xl text-ink/70 mb-12 max-w-3xl mx-auto font-medium"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          subscribe and request as many designs as you need. delivered fast. revised until perfect.
          pause anytime.
        </motion.p>

        {/* Big CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            asChild
            size="lg"
            className="group bg-gradient-to-r from-taro to-deep-taro hover:from-deep-taro hover:to-taro text-white px-14 py-8 text-xl font-black rounded-full shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all duration-200 hover:translate-x-1 hover:translate-y-1 border-4 border-ink relative overflow-hidden"
          >
            <Link href="/start" className="relative z-10 flex items-center gap-2">
              <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span>join boba club</span>
              <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </Link>
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
          transition={{ duration: 0.6, delay: 0.8 }}
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
