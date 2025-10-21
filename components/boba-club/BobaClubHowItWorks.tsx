'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TooltipInfo } from '@/components/ui/tooltip-info';

const steps = [
  {
    number: '01',
    title: 'subscribe',
    description: 'choose your tier and join instantly',
    tooltip: null,
  },
  {
    number: '02',
    title: 'request',
    description: 'add unlimited dev + design to your queue',
    tooltip:
      'Add as many web development and design requests as you need to your queue. We work through them one (or two for Enterprise) at a time to ensure quality.',
  },
  {
    number: '03',
    title: 'receive',
    description: 'get projects back in 24-72 hours',
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

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                className="bg-white border-4 border-ink rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col group cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '12px 12px 0px 0px rgba(15,23,42,1)',
                  y: -4,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Number badge */}
                <motion.div
                  className="inline-flex items-center justify-center w-14 h-14 bg-taro text-white rounded-full font-black text-xl mb-4 shadow-lg"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  {step.number}
                </motion.div>

                {/* Title */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-display text-2xl font-black text-ink lowercase">
                    {step.title}
                  </h3>
                  {step.tooltip && <TooltipInfo text={step.tooltip} />}
                </div>

                {/* Description */}
                <p className="text-ink/60 font-medium text-base leading-snug">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
