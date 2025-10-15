'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

const features = [
  'Unlimited design requests',
  'One active task at a time',
  '24-48 hour delivery',
  'Unlimited brands and projects',
  'Up to 2 users',
  'Pause or cancel anytime',
];

export default function BobaClubPricing() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-white via-milk-tea/30 to-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-taro/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-matcha/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            Simple, Transparent, All-In-One
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            One plan, endless creativity. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div
            className="relative bg-white rounded-3xl p-12 shadow-2xl border-2 border-taro/20 overflow-hidden group"
            onMouseMove={handleMouseMove}
          >
            {/* Gradient glow effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(167, 139, 250, 0.1), transparent 40%)`,
              }}
            />

            {/* Floating pearls decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-taro/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-radial from-matcha/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-taro to-deep-taro text-white px-4 py-2 rounded-full mb-6 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                <span>Most Popular</span>
              </motion.div>

              {/* Plan name */}
              <h3 className="font-display text-3xl font-bold text-ink mb-2">Boba Club</h3>

              {/* Price */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex items-baseline gap-2"
                >
                  <span className="text-6xl font-bold text-ink">$3,000</span>
                  <span className="text-2xl text-gray-500">/month</span>
                </motion.div>
              </div>

              {/* Features list */}
              <ul className="space-y-4 mb-10">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-matcha to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
                className="space-y-3"
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full group bg-gradient-to-r from-taro to-deep-taro hover:from-deep-taro hover:to-taro text-white text-lg py-6 transition-all duration-300 hover:shadow-xl hover:shadow-taro/30 relative overflow-hidden"
                >
                  <Link href="/start">
                    <span className="relative z-10">Join Boba Club</span>
                    <motion.div
                      className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                      whileHover={{ scale: 1.5 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-taro text-taro hover:bg-taro/10 text-lg py-6 transition-all duration-300"
                >
                  <Link href="/contact">Book a Call</Link>
                </Button>
              </motion.div>

              {/* Risk-free guarantee */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mt-8 p-4 bg-matcha/10 border border-matcha/30 rounded-xl text-center"
              >
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-matcha">Try it risk-free.</span>
                  <br />
                  If you are not satisfied within your first week, you will get 75% back.
                </p>
              </motion.div>
            </div>

            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(45deg, #A78BFA, #84CC16, #A78BFA, #84CC16)',
                backgroundSize: '400% 400%',
                opacity: 0.3,
                filter: 'blur(20px)',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center text-gray-500 mt-8 text-sm"
        >
          Spots are limited to ensure quality turnaround.
        </motion.p>
      </div>
    </section>
  );
}
