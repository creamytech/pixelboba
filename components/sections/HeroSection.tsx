'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function HeroSection() {
  return (
    <div className="relative py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 md:px-8 overflow-hidden">
      {/* Main content - centered */}
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Intro badge */}
        <motion.div
          className="flex justify-center mb-8 sm:mb-10 md:mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-[#7C3AED] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full border-[3px] sm:border-[4px] border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]">
            <Icon icon="ph:fire-duotone" className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="font-black text-sm sm:text-base tracking-wide">
              Fort Lauderdale&apos;s Favorite Web Studio
            </span>
          </div>
        </motion.div>

        {/* Massive headline */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-ink mb-6 sm:mb-8 md:mb-10 leading-[0.95] sm:leading-[0.9] px-2"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Websites That Get You
          <br />
          <span className="italic text-[#7C3AED]">More Customers</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-ink/70 mb-8 sm:mb-10 md:mb-14 font-bold leading-snug sm:leading-tight max-w-4xl mx-auto px-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Your new website in 2-4 weeks. No meetings. Just results.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center mb-8 sm:mb-10 md:mb-12 px-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Link
            href="/start"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 md:px-12 py-5 sm:py-6 bg-gradient-to-br from-taro to-deep-taro text-white text-base sm:text-lg md:text-xl font-black rounded-full border-[3px] sm:border-[4px] border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] active:shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] md:hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px] transition-all min-h-[60px] sm:min-h-auto"
          >
            <span className="text-center">Get My Website Quote (2 Min)</span>
            <Icon icon="ph:arrow-right-bold" className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>

          <a
            href="tel:+17542434766"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 md:px-12 py-5 sm:py-6 bg-white text-ink text-base sm:text-lg md:text-xl font-black rounded-full border-[3px] sm:border-[4px] border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] active:shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] md:hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px] transition-all min-h-[60px] sm:min-h-auto"
          >
            <Icon icon="ph:phone-duotone" className="w-5 h-5 sm:w-6 sm:h-6" />
            (754) 243-4766
          </a>
        </motion.div>

        {/* Animated stats strip */}
        <motion.div
          className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 bg-white px-6 sm:px-8 md:px-10 py-6 sm:py-6 rounded-3xl sm:rounded-full border-[3px] sm:border-[4px] border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] mx-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-[#7C3AED] flex items-center justify-center gap-2">
              <Icon icon="ph:confetti-duotone" className="w-8 h-8 sm:w-9 sm:h-9" />
              30+
            </div>
            <div className="text-xs sm:text-sm font-bold text-ink/60">Happy Clients</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-ink/20"></div>
          <div className="w-full sm:w-px h-px sm:h-12 bg-ink/20 sm:hidden"></div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-[#7C3AED] flex items-center justify-center gap-2">
              <Icon icon="ph:lightning-duotone" className="w-8 h-8 sm:w-9 sm:h-9" />
              2-4
            </div>
            <div className="text-xs sm:text-sm font-bold text-ink/60">Weeks Average</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-ink/20"></div>
          <div className="w-full sm:w-px h-px sm:h-12 bg-ink/20 sm:hidden"></div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-[#7C3AED] flex items-center justify-center gap-2">
              <Icon icon="ph:palm-tree-duotone" className="w-8 h-8 sm:w-9 sm:h-9" />
              100%
            </div>
            <div className="text-xs sm:text-sm font-bold text-ink/60">South Florida</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
