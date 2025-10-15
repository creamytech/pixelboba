'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'subscribe',
    description: 'choose your plan and join instantly',
  },
  {
    number: '02',
    title: 'request',
    description: 'add unlimited designs to your queue',
  },
  {
    number: '03',
    title: 'receive',
    description: 'get designs back in 24-48 hours',
  },
  {
    number: '04',
    title: 'revise',
    description: 'request unlimited revisions',
  },
  {
    number: '05',
    title: 'repeat',
    description: 'pause or cancel anytime',
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
              <div className="bg-white border-4 border-ink rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 h-full flex flex-col">
                {/* Number badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-taro text-white rounded-full font-black text-2xl mb-6 shadow-lg">
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="font-display text-3xl font-black text-ink mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-ink/60 font-medium text-lg">{step.description}</p>
              </div>

              {/* Arrow connector for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    className="text-5xl text-taro"
                  >
                    →
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
