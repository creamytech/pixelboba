'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-taro to-deep-taro text-white overflow-hidden relative">
      {/* Floating pearls background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ready to make it{' '}
            <span className="relative inline-block">
              <span className="relative z-10">pop?</span>
              <span className="absolute inset-0 bg-white/30 blur-xl scale-110"></span>
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            let&apos;s create a digital experience that captures your brand&apos;s essence and
            delivers real results for your business.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              asChild
              size="lg"
              className="group bg-white text-taro hover:bg-milk-tea px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-white/20"
            >
              <Link href="/start">
                start your project
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-taro px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/work">
                view our work
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1 opacity-70 group-hover:opacity-100">
                  →
                </span>
              </Link>
            </Button>
          </motion.div>

          {/* Contact info */}
          <motion.div
            className="mt-16 text-white/90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="text-lg">
              or drop us a line at{' '}
              <a
                href="mailto:hello@pixelboba.com"
                className="text-white font-semibold hover:text-milk-tea transition-colors duration-200 underline decoration-2 underline-offset-4"
              >
                hello@pixelboba.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
