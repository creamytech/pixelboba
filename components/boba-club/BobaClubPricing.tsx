'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MembershipCard from './MembershipCard';
import { TooltipInfo } from '@/components/ui/tooltip-info';

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
    <section ref={sectionRef} className="py-32 bg-milk-tea relative overflow-hidden">
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

        {/* Overlapping layout exactly like Designjoy */}
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 items-start">
            {/* Left: Card + Join Box Stack (overlaps pricing card) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-[440px] relative z-20 flex-shrink-0"
            >
              {/* Membership Card */}
              <div className="mb-6">
                <MembershipCard />
                <p className="text-center mt-4 text-ink/60 font-medium">
                  <span className="italic text-taro">hover</span> to see the magic ✨
                </p>
              </div>

              {/* Join Box Below Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-ink">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-ink hover:bg-ink/90 text-white py-6 text-xl font-bold rounded-full shadow-[8px_8px_0px_0px_rgba(245,233,218,1)] hover:shadow-[4px_4px_0px_0px_rgba(245,233,218,1)] transition-all duration-200 hover:translate-x-1 hover:translate-y-1 mb-6"
                >
                  <Link href="/start">
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 bg-matcha rounded-full animate-pulse" />
                      <span>start today</span>
                    </span>
                  </Link>
                </Button>

                <div className="text-center">
                  <p className="font-display text-3xl font-black text-ink leading-tight">
                    join
                    <br />
                    boba club
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: Dark Pricing Card (extends behind left cards) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full lg:flex-1 lg:-ml-24 relative z-10"
            >
              <div className="bg-ink rounded-3xl p-10 lg:pl-32 shadow-2xl relative overflow-hidden min-h-[640px] flex flex-col group">
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
                  className="absolute -inset-4 bg-taro/20 rounded-3xl blur-2xl -z-10"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
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

                {/* Join button inside dark card */}
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-matcha hover:bg-matcha/90 text-ink py-7 text-lg font-bold rounded-full transition-all duration-200"
                >
                  <Link href="/start">join today</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom perks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-7xl mx-auto mt-16 grid md:grid-cols-2 gap-6"
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
