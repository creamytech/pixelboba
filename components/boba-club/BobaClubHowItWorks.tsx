'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { UserPlus, List, Zap, RefreshCw, Pause } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: 'Subscribe and Onboard',
    description:
      'Join the club and complete a short creative brief. We will set up your personal design board so you can start right away.',
  },
  {
    number: 2,
    icon: List,
    title: 'Submit Your Requests',
    description:
      'Add as many projects as you want to your queue. From brand visuals to landing pages, every request gets full attention.',
  },
  {
    number: 3,
    icon: Zap,
    title: 'Receive Designs Fast',
    description:
      'Get updates every 24-48 hours. Watch your board fill with beautiful designs crafted by your Pixel Boba designer.',
  },
  {
    number: 4,
    icon: RefreshCw,
    title: 'Refine Until It Is Perfect',
    description:
      'Need adjustments? Just comment on your board. We will revise until it is exactly what you imagined.',
  },
  {
    number: 5,
    icon: Pause,
    title: 'Pause or Cancel Anytime',
    description: 'Take a break when you are caught up. Your unused time rolls over.',
  },
];

export default function BobaClubHowItWorks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background pearls */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-taro/20"
            style={{
              width: 100 + i * 20,
              height: 100 + i * 20,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isInView
                ? {
                    scale: 1,
                    opacity: 0.3,
                    y: [0, -20, 0],
                  }
                : {}
            }
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            How Boba Club Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, streamlined, and designed to keep your creative pipeline flowing.
          </p>
        </motion.div>

        {/* Pipeline visualization */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection lines */}
          <svg
            className="absolute inset-0 w-full h-full hidden lg:block"
            style={{ zIndex: 0 }}
            viewBox="0 0 1000 800"
            preserveAspectRatio="none"
          >
            {steps.slice(0, -1).map((_, i) => (
              <motion.path
                key={i}
                d={`M ${200 + (i % 2) * 600} ${150 + Math.floor(i / 2) * 200} L ${
                  200 + ((i + 1) % 2) * 600
                } ${150 + Math.floor((i + 1) / 2) * 200}`}
                stroke="#A78BFA"
                strokeWidth="3"
                fill="none"
                strokeDasharray="10,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
                transition={{ duration: 1, delay: i * 0.3 }}
              />
            ))}
          </svg>

          {/* Steps */}
          <div className="relative z-10 space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex flex-col lg:flex-row items-center gap-6 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } ${index > 0 ? 'lg:mt-24' : ''}`}
              >
                {/* Icon with pearl animation */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-taro to-deep-taro flex items-center justify-center relative overflow-hidden"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3, type: 'spring' }}
                  >
                    {/* Pearl effect */}
                    <div className="absolute inset-0 bg-gradient-radial from-white/40 via-transparent to-transparent" />
                    <step.icon className="w-12 h-12 text-white relative z-10" />
                  </motion.div>

                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-matcha rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {step.number}
                  </div>

                  {/* Boba pearl animation */}
                  <motion.div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-brown-sugar rounded-full"
                    animate={{
                      y: [0, 60, 0],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />
                </motion.div>

                {/* Content */}
                <motion.div
                  className={`flex-1 bg-white rounded-2xl p-8 shadow-lg border border-taro/10 ${
                    index % 2 === 0 ? 'lg:text-left' : 'lg:text-right'
                  } text-center lg:max-w-md`}
                  whileHover={{
                    y: -5,
                    boxShadow: '0 20px 40px rgba(167, 139, 250, 0.15)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-display text-2xl font-bold text-ink mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </motion.div>

                {/* Spacer for alternating layout */}
                <div className="hidden lg:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
