'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TooltipInfo } from '@/components/ui/tooltip-info';

const steps = [
  {
    number: '01',
    title: 'subscribe',
    description: 'choose your plan and join instantly',
    tooltip: null,
  },
  {
    number: '02',
    title: 'request',
    description: 'add unlimited designs to your queue',
    tooltip:
      'Add as many design requests as you need to your queue. We work through them one at a time to ensure quality.',
  },
  {
    number: '03',
    title: 'receive',
    description: 'get designs back in 24-48 hours',
    tooltip: null,
  },
  {
    number: '04',
    title: 'revise',
    description: 'request unlimited revisions',
    tooltip: null,
  },
  {
    number: '05',
    title: 'repeat',
    description: 'pause or cancel anytime',
    tooltip: null,
  },
];

export default function BobaClubHowItWorks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-32 bg-milk-tea">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-5xl md:text-7xl font-black text-ink mb-4">
            simple as
            <br />
            <span className="italic text-taro">boba.</span>
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Card */}
              <motion.div
                className="bg-white border-4 border-ink rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] h-full flex flex-col group cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '12px 12px 0px 0px rgba(15,23,42,1)',
                  y: -4,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Number badge */}
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-taro text-white rounded-full font-black text-2xl mb-6 shadow-lg"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  {step.number}
                </motion.div>

                {/* Title */}
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-display text-3xl font-black text-ink">{step.title}</h3>
                  {step.tooltip && <TooltipInfo text={step.tooltip} />}
                </div>

                {/* Description */}
                <p className="text-ink/60 font-medium text-lg">{step.description}</p>
              </motion.div>

              {/* Arrow connector with animated boba pearl for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    className="text-5xl text-taro relative"
                  >
                    →{/* Animated boba pearl flowing through */}
                    <motion.div
                      className="absolute top-1/2 left-0 w-4 h-4 rounded-full bg-taro shadow-lg"
                      animate={{
                        x: [0, 40, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.6,
                        ease: 'easeInOut',
                      }}
                    >
                      <div className="absolute inset-1 bg-white/40 rounded-full" />
                    </motion.div>
                  </motion.div>
                </div>
              )}

              {/* Arrow connector for mobile */}
              {index < steps.length - 1 && (
                <div className="lg:hidden flex justify-center my-4">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    className="text-5xl text-taro rotate-90"
                  >
                    →
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
