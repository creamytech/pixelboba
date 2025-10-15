'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
            className="text-2xl md:text-3xl text-white/70 mb-16 font-medium max-w-2xl mx-auto"
          >
            join boba club and start getting unlimited design work today
          </motion.p>

          {/* Big CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <Button
              asChild
              size="lg"
              className="group bg-white hover:bg-milk-tea text-ink px-14 py-8 text-xl font-bold rounded-full shadow-[8px_8px_0px_0px_rgba(167,139,250,1)] hover:shadow-[4px_4px_0px_0px_rgba(167,139,250,1)] transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
            >
              <Link href="/start">
                get started
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-4 border-white text-white hover:bg-white hover:text-ink px-14 py-8 text-xl font-bold rounded-full transition-all duration-200"
            >
              <Link href="/contact">book a call</Link>
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
        className="absolute top-20 left-20 text-6xl"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ✨
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-20 text-6xl"
        animate={{
          y: [0, 30, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        🎨
      </motion.div>
    </section>
  );
}
