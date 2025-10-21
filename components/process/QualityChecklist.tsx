'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const checklistItems = [
  {
    icon: 'ph:devices-duotone',
    text: 'responsive across modern devices',
  },
  {
    icon: 'ph:eye-duotone',
    text: 'accessibility targets (wcag-aware)',
  },
  {
    icon: 'ph:lightning-duotone',
    text: 'optimized performance and seo standards',
  },
  {
    icon: 'ph:envelope-duotone',
    text: 'forms tested end-to-end (email delivery confirmed)',
  },
  {
    icon: 'ph:chart-line-up-duotone',
    text: 'analytics + basic event tracking installed',
  },
];

export default function QualityChecklist() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-ink mb-6">
              quality checklist <span className="italic text-taro">(every project)</span>
            </h2>
            <p className="text-xl text-ink/70 font-bold">
              our non-negotiable standards for every build
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {checklistItems.map((item, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-start gap-4 p-6 rounded-2xl bg-cream border-3 border-ink"
                  >
                    <div className="flex-shrink-0">
                      <Icon icon={item.icon} className="w-12 h-12 text-deep-taro" />
                    </div>
                    <div className="flex-1">
                      <p className="text-ink font-bold leading-relaxed">{item.text}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Icon icon="ph:check-circle-duotone" className="w-7 h-7 text-matcha" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom guarantee badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center mt-10 pt-8 border-t-4 border-ink/10"
            >
              <div className="inline-flex items-center bg-[#FDB97A] px-8 py-4 rounded-full border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
                <Icon icon="ph:check-circle-duotone" className="w-6 h-6 text-matcha mr-3" />
                <span className="text-base font-black text-ink">
                  tested, polished, and ready to perform
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
