'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function BobaClubFinalCTA() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      className="py-32 bg-gradient-to-br from-taro via-deep-taro to-taro relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Swirling pearls */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), ${
                i % 2 === 0 ? '#84CC16' : '#F5E9DA'
              })`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={
              isInView
                ? {
                    y: [0, -100, -200],
                    opacity: [0, 1, 0],
                  }
                : {}
            }
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-matcha/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Mascot character */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
            className="mb-12"
          >
            <div className="relative inline-block">
              {/* Boba cup with cat */}
              <div className="w-32 h-40 bg-white/20 backdrop-blur-sm rounded-3xl rounded-t-full mx-auto relative">
                {/* Cup shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl rounded-t-full" />

                {/* Straw */}
                <div className="absolute top-0 right-8 w-2 h-20 bg-white/60 rounded-full -translate-y-10" />

                {/* Cat face */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl">🐱</div>

                {/* Boba pearls at bottom */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 rounded-full bg-brown-sugar"
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Waving hand */}
              <motion.div
                className="absolute -right-8 top-8 text-3xl"
                animate={{
                  rotate: [0, 20, 0, 20, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                👋
              </motion.div>

              {/* Join the Club sign */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg whitespace-nowrap"
              >
                <p className="text-sm font-bold text-taro">Join the Club!</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Ready to Join the Club?
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed"
          >
            Start your creative subscription today. Join Boba Club and get unlimited design for one
            flat monthly rate.
            <br />
            <span className="text-matcha font-semibold">
              No contracts, no hidden fees, just pure creative flow.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button
              asChild
              size="lg"
              className="group bg-white text-taro hover:bg-milk-tea px-10 py-7 text-lg font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 relative overflow-hidden"
            >
              <Link href="/start" className="inline-flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Join Boba Club</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-matcha/20 to-taro/20 opacity-0 group-hover:opacity-100"
                  whileHover={{ scale: 1.5 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 px-10 py-7 text-lg font-bold transition-all duration-300"
            >
              <Link href="/contact">Book a Call</Link>
            </Button>
          </motion.div>

          {/* Small text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-white/70 text-sm"
          >
            Spots are limited to ensure quality turnaround.
          </motion.p>

          {/* Confetti pop on hover */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ['#84CC16', '#F5E9DA', '#A78BFA'][i % 3],
                }}
                animate={{
                  x: Math.cos((i * Math.PI * 2) / 8) * 100,
                  y: Math.sin((i * Math.PI * 2) / 8) * 100,
                  opacity: [1, 0],
                  scale: [0, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
