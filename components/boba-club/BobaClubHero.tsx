'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';

export default function BobaClubHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Floating cat decorations */}
      <motion.div
        className="absolute top-20 right-[8%] w-32 h-32 opacity-20 hidden md:block"
        animate={{
          y: [0, -20, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Image src="/01.svg" alt="" width={128} height={128} className="w-full h-full" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-[8%] w-32 h-32 opacity-20 hidden md:block"
        animate={{
          y: [0, 20, 0],
          rotate: [5, -5, 5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Image src="/03.svg" alt="" width={128} height={128} className="w-full h-full" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
        {/* Purple badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="inline-block mb-8"
        >
          <div className="bg-[#7C3AED]/10 text-[#7C3AED] px-6 py-3 rounded-full border-2 border-[#7C3AED]/20">
            <p className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <Icon icon="ph:coffee-duotone" className="w-4 h-4" />
              Unlimited Web Development + Design
            </p>
          </div>
        </motion.div>

        {/* Massive headline */}
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-black text-ink mb-8 leading-[0.9]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          Build On
          <br />
          <span className="italic text-[#7C3AED]">Tap.</span>
        </motion.h1>

        {/* Explainer tagline */}
        <motion.p
          className="text-2xl md:text-3xl text-ink/70 font-bold mb-6 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
          Unlimited web development and design requests for one flat monthly rate.
        </motion.p>

        {/* Pricing badge */}
        <motion.div
          className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
        >
          <span className="text-3xl md:text-4xl font-black text-ink">Starting at $1,995</span>
          <span className="text-lg text-ink/60 font-bold">/month</span>
        </motion.div>

        {/* Punchy subheadline */}
        <motion.p
          className="text-xl md:text-2xl text-ink/70 font-bold mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        >
          Subscribe and request as many dev + design projects as you need. Delivered fast. Revised
          until perfect. Pause anytime.
        </motion.p>

        {/* Big CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
        >
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center px-12 py-6 bg-[#FDB97A] text-ink text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Join Boba Club →
          </a>

          <a
            href="mailto:hello@pixelboba.com"
            className="inline-flex items-center px-12 py-6 bg-white text-ink text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Contact Us
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-8"
        >
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-ink/10">
            <Icon icon="ph:lightning-duotone" className="w-6 h-6 text-matcha" />
            <span className="font-bold text-ink">24-48 Hour Delivery</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-ink/10">
            <Icon icon="ph:arrows-clockwise-duotone" className="w-6 h-6 text-deep-taro" />
            <span className="font-bold text-ink">Unlimited Revisions</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-ink/10">
            <Icon icon="ph:pause-circle-duotone" className="w-6 h-6 text-matcha" />
            <span className="font-bold text-ink">Pause Anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
