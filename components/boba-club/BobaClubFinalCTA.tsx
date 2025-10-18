'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CheckoutButton from './CheckoutButton';

export default function BobaClubFinalCTA() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section ref={sectionRef} className="py-40 bg-ink relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-taro/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-matcha/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Big emoji */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-9xl mb-12"
          >
            🧋
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.9]"
          >
            ready when
            <br />
            <span className="italic text-taro">you are.</span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl md:text-3xl text-white/70 mb-8 font-medium max-w-2xl mx-auto"
          >
            join boba club and start getting unlimited design work today
          </motion.p>

          {/* Urgency badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-taro/20 border-2 border-taro/40 rounded-full px-6 py-3 mb-16"
          >
            <motion.div
              className="w-2 h-2 bg-taro rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white font-bold text-sm">
              Limited spots available — we only take 5 new members per month
            </span>
          </motion.div>

          {/* Big CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <CheckoutButton
              size="lg"
              className="group bg-white hover:bg-milk-tea text-ink px-14 py-8 text-xl font-bold rounded-full shadow-[8px_8px_0px_0px_rgba(167,139,250,1)] hover:shadow-[4px_4px_0px_0px_rgba(167,139,250,1)] transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
            >
              get started
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </CheckoutButton>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white border-4 border-white text-ink hover:bg-milk-tea px-14 py-8 text-xl font-bold rounded-full transition-all duration-200"
            >
              <a href="mailto:hello@pixelboba.com">contact us</a>
            </Button>
          </motion.div>

          {/* Trust note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-white/50 text-sm"
          >
            no contracts • pause or cancel anytime • 75% refund in first week
          </motion.p>
        </div>
      </div>

      {/* Floating emojis */}
      <motion.div
        className="absolute top-20 left-20 text-6xl hidden md:block"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ✨
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-20 text-6xl hidden md:block"
        animate={{
          y: [0, 30, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        🎨
      </motion.div>

      {/* Floating boba pearls */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 md:w-12 md:h-12 rounded-full"
          style={{
            background:
              i % 3 === 0
                ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), #a78bfa)'
                : i % 3 === 1
                  ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), #86efac)'
                  : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), #fbbf24)',
            left: i < 3 ? `${10 + i * 15}%` : `${55 + (i - 3) * 15}%`,
            bottom: i < 3 ? `${20 + i * 10}%` : `${25 + (i - 3) * 10}%`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.3)',
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, i % 2 === 0 ? 20 : -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          <div className="absolute inset-2 bg-white/20 rounded-full blur-sm" />
        </motion.div>
      ))}
    </section>
  );
}
