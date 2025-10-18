'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MembershipCard from './MembershipCard';
import { TooltipInfo } from '@/components/ui/tooltip-info';
import CheckoutButton from './CheckoutButton';

const features = [
  {
    text: 'one request at a time',
    tooltip:
      'We focus on one active design task at a time to ensure quality. You can add unlimited requests to your queue.',
  },
  { text: 'avg. 48 hour delivery', tooltip: null },
  { text: 'unlimited brands', tooltip: null },
  { text: 'webflow development', tooltip: null },
];

const perks = ['unlimited stock photos', 'up to 2 users', 'pause or cancel anytime'];

export default function BobaClubPricing() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="py-32 bg-milk-tea relative overflow-hidden scroll-mt-20"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-5xl md:text-7xl font-black text-ink mb-6">
            one subscription,
            <br />
            <span className="italic text-taro">endless possibilities</span>
          </h2>
        </motion.div>

        {/* Two-column layout with larger card */}
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-[480px,1fr] gap-8 items-center">
            {/* Left Column: Larger membership card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <MembershipCard />
            </motion.div>

            {/* Right Column: Main pricing card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative z-10"
            >
              <div className="bg-gradient-to-br from-deep-taro to-taro rounded-3xl p-10 shadow-2xl relative overflow-hidden flex flex-col group border-4 border-ink">
                {/* Animated spotlight effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(167,139,250,0.15) 0%, transparent 70%)',
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Pulsing glow effect */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-br from-taro/40 to-matcha/30 rounded-3xl blur-2xl -z-10"
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [0.95, 1.05, 0.95],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Header */}
                <div className="mb-6 flex items-center justify-between relative z-10">
                  <h3 className="font-bold text-white text-lg">monthly club</h3>
                  <div className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    pause or cancel anytime
                  </div>
                </div>

                {/* Dotted line */}
                <div className="border-t border-dotted border-white/20 mb-8" />

                {/* Price */}
                <div className="mb-10">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-6xl md:text-7xl font-black text-white">
                      $3,000
                    </span>
                    <span className="text-2xl text-white/60 font-medium">/month</span>
                  </div>
                </div>

                {/* Included section */}
                <div className="bg-white/5 rounded-2xl p-8 mb-8 border border-white/10 flex-grow">
                  <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-6">
                    included
                  </p>

                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    {/* Left column */}
                    <div className="space-y-4">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <p className="text-white font-medium">{feature.text}</p>
                          {feature.tooltip && <TooltipInfo text={feature.tooltip} />}
                        </div>
                      ))}
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                      {perks.map((perk, index) => (
                        <p key={index} className="text-white font-medium">
                          {perk}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Join button inside dark card with shimmer */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <CheckoutButton
                    size="lg"
                    className="w-full bg-matcha hover:bg-matcha/90 text-ink py-7 text-lg font-bold rounded-full transition-all duration-200 relative overflow-hidden group/btn"
                  >
                    join today
                  </CheckoutButton>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Value Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="max-w-4xl mx-auto mt-16 mb-16 text-center"
        >
          <div className="bg-gradient-to-r from-taro/10 via-matcha/10 to-taro/10 border-4 border-ink rounded-3xl p-8 relative overflow-hidden">
            {/* Decorative corner element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-taro/20 rounded-bl-full" />

            <h3 className="font-display text-2xl md:text-3xl font-black text-ink mb-4">
              The Smart Choice for Growing Brands
            </h3>
            <p className="text-lg md:text-xl text-ink/70 font-medium max-w-2xl mx-auto">
              Hiring a senior designer costs{' '}
              <span className="font-bold text-ink">$90K+ per year</span> plus benefits. Boba Club is
              just <span className="font-bold text-taro">$36K per year</span> — and you can pause
              anytime.
            </p>
          </div>
        </motion.div>

        {/* Bottom perks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6"
        >
          {/* Pause anytime */}
          <div className="bg-white rounded-3xl p-10 border-4 border-ink">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-milk-tea rounded-full flex items-center justify-center flex-shrink-0 text-2xl border-4 border-ink">
                ⏸️
              </div>
              <div>
                <h4 className="font-display text-2xl font-black text-ink mb-2">pause anytime</h4>
                <p className="text-ink/60 font-medium text-base">
                  temporarily pause your subscription anytime, no sweat.
                </p>
              </div>
            </div>
          </div>

          {/* Try it for a week */}
          <div className="bg-white rounded-3xl p-10 border-4 border-ink">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-milk-tea rounded-full flex items-center justify-center flex-shrink-0 text-2xl border-4 border-ink">
                ✓
              </div>
              <div>
                <h4 className="font-display text-2xl font-black text-ink mb-2">
                  try it for a week
                </h4>
                <p className="text-ink/60 font-medium text-base">
                  not loving it after a week? get 75% back, no questions asked.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
