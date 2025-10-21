'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const feedbackSteps = [
  {
    icon: 'ph:link-duotone',
    number: '1',
    text: 'we share links: wireframes → designs → staging',
  },
  {
    icon: 'ph:chat-circle-dots-duotone',
    number: '2',
    text: 'you comment in place; we reply with options and ship',
  },
  {
    icon: 'ph:file-text-duotone',
    number: '3',
    text: 'no meetings required, everything in writing for clarity',
  },
];

export default function FeedbackSection() {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-ink mb-6">
              how feedback works <span className="italic text-taro">(async & fast)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feedbackSteps.map((step, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-[#FDB97A] px-4 py-2 rounded-full font-black text-ink text-lg border-3 border-ink flex-shrink-0">
                      {step.number}
                    </div>
                  </div>

                  <div className="mb-6">
                    <Icon icon={step.icon} className="w-16 h-16 text-deep-taro" />
                  </div>

                  <p className="text-ink/70 font-bold leading-relaxed text-base">{step.text}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom accent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center bg-white px-8 py-4 rounded-full border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
              <Icon icon="ph:chat-circle-dots-duotone" className="w-6 h-6 text-matcha mr-3" />
              <span className="text-base text-ink font-black">
                clear communication, zero confusion
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
