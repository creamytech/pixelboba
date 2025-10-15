'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';

const features = [
  'unlimited design requests',
  'one active task at a time',
  '24-48 hour delivery',
  'unlimited brands & projects',
  'up to 2 users',
  'pause or cancel anytime',
];

export default function BobaClubPricing() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-taro/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-matcha/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Big centered pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-block mb-8"
          >
            <div className="bg-matcha text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
              membership
            </div>
          </motion.div>

          {/* Huge price */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="font-display text-7xl md:text-9xl font-black text-ink mb-2">
              $3,000<span className="text-5xl md:text-7xl text-ink/40">/m</span>
            </div>
            <p className="text-2xl md:text-3xl text-ink/60 font-medium">pause or cancel anytime</p>
          </motion.div>

          {/* Features in two columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-left bg-milk-tea/50 rounded-2xl px-6 py-4 border-2 border-transparent hover:border-taro/20 transition-colors duration-200"
              >
                <div className="w-6 h-6 bg-taro rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <span className="text-ink font-medium text-lg">{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* Big CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <Button
              asChild
              size="lg"
              className="group bg-ink hover:bg-ink/90 text-white px-14 py-8 text-xl font-bold rounded-full shadow-[8px_8px_0px_0px_rgba(167,139,250,1)] hover:shadow-[4px_4px_0px_0px_rgba(167,139,250,1)] transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
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
              className="border-4 border-ink text-ink hover:bg-ink hover:text-white px-14 py-8 text-xl font-bold rounded-full transition-all duration-200"
            >
              <Link href="/contact">book a call</Link>
            </Button>
          </motion.div>

          {/* Risk-free note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="inline-flex items-center gap-3 bg-matcha/10 border-2 border-matcha/30 rounded-full px-8 py-4"
          >
            <div className="w-3 h-3 bg-matcha rounded-full animate-pulse" />
            <p className="text-ink/70 font-medium">
              <span className="font-bold text-matcha">75% refund</span> within first week if not
              satisfied
            </p>
          </motion.div>
        </motion.div>

        {/* What is included section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-32 max-w-4xl mx-auto"
        >
          <h3 className="font-display text-3xl md:text-4xl font-bold text-ink mb-8 text-center">
            what is included
          </h3>

          <div className="grid md:grid-cols-2 gap-4 text-ink/70">
            <div className="text-left">
              <p className="font-medium mb-2">✓ branding & logos</p>
              <p className="font-medium mb-2">✓ web & app UI</p>
              <p className="font-medium mb-2">✓ social graphics</p>
              <p className="font-medium mb-2">✓ illustrations & icons</p>
              <p className="font-medium mb-2">✓ landing pages</p>
            </div>
            <div className="text-left">
              <p className="font-medium mb-2">✓ email templates</p>
              <p className="font-medium mb-2">✓ pitch decks</p>
              <p className="font-medium mb-2">✓ webflow support</p>
              <p className="font-medium mb-2">✓ unlimited revisions</p>
              <p className="font-medium mb-2">✓ full file ownership</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
