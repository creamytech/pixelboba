'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MembershipCard from './MembershipCard';

const features = [
  'one request at a time',
  'avg. 48 hour delivery',
  'unlimited brands',
  'webflow development',
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

        {/* Overlapping layout like Designjoy */}
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-12 gap-0 items-start">
            {/* Left: Membership Card (overlaps pricing card) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative z-20"
            >
              {/* Card */}
              <div className="mb-8">
                <MembershipCard />
              </div>

              {/* Join Button */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-ink">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-ink hover:bg-ink/90 text-white py-6 text-xl font-bold rounded-full shadow-[8px_8px_0px_0px_rgba(245,233,218,1)] hover:shadow-[4px_4px_0px_0px_rgba(245,233,218,1)] transition-all duration-200 hover:translate-x-1 hover:translate-y-1 mb-4"
                >
                  <Link href="/start">
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 bg-matcha rounded-full animate-pulse" />
                      <span>start today</span>
                    </span>
                  </Link>
                </Button>

                <div className="text-center">
                  <p className="font-display text-3xl font-black text-ink">
                    join
                    <br />
                    boba club
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: Dark Pricing Card (slightly behind) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-7 lg:-ml-16 relative z-10"
            >
              <div className="bg-ink rounded-3xl p-10 lg:pl-24 shadow-2xl border-4 border-ink relative overflow-hidden min-h-[600px] flex flex-col">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-bold text-white text-xl">monthly club</h3>
                  <div className="text-white/60 text-xs font-medium uppercase tracking-wider">
                    pause or cancel anytime
                  </div>
                </div>

                {/* Dotted line */}
                <div className="border-t border-dotted border-white/20 mb-8" />

                {/* Price */}
                <div className="mb-10">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-display text-6xl md:text-7xl font-black text-white">
                      $3,000
                    </span>
                    <span className="text-3xl text-white/60 font-medium">/month</span>
                  </div>
                </div>

                {/* Included section */}
                <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10 flex-grow">
                  <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">
                    included
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Left column */}
                    <div className="space-y-3">
                      {features.map((feature, index) => (
                        <p key={index} className="text-white font-medium text-sm">
                          {feature}
                        </p>
                      ))}
                    </div>

                    {/* Right column */}
                    <div className="space-y-3">
                      {perks.map((perk, index) => (
                        <p key={index} className="text-white font-medium text-sm">
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
                  className="w-full bg-matcha hover:bg-matcha/90 text-ink py-6 text-lg font-bold rounded-full transition-all duration-200"
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
          className="max-w-5xl mx-auto mt-20 grid md:grid-cols-2 gap-8"
        >
          {/* Pause anytime */}
          <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-milk-tea rounded-full flex items-center justify-center flex-shrink-0 text-2xl border-2 border-ink">
                ⏸️
              </div>
              <div>
                <h4 className="font-display text-2xl font-black text-ink mb-2">pause anytime</h4>
                <p className="text-ink/60 font-medium">
                  temporarily pause your subscription anytime, no sweat.
                </p>
              </div>
            </div>
          </div>

          {/* Try it for a week */}
          <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-milk-tea rounded-full flex items-center justify-center flex-shrink-0 text-2xl border-2 border-ink">
                ✓
              </div>
              <div>
                <h4 className="font-display text-2xl font-black text-ink mb-2">
                  try it for a week
                </h4>
                <p className="text-ink/60 font-medium">
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
