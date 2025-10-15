'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How fast will I get designs?',
    answer:
      'Most requests are completed in 24-48 business hours. Simple tasks like social graphics may be faster, while complex projects like full landing pages may take the full 48 hours or slightly longer depending on scope.',
  },
  {
    question: 'Can I submit unlimited requests?',
    answer:
      'Yes. Add as many as you like. We complete one at a time from your queue. This ensures each project gets our full attention and maintains our high quality standards.',
  },
  {
    question: 'What happens if I pause?',
    answer:
      'Your unused time carries over so you never lose days. You can pause your subscription at any time and resume whenever you need design work again. Perfect for seasonal businesses or project-based needs.',
  },
  {
    question: 'Do I own the work?',
    answer:
      'Absolutely. Every design is fully yours forever. You receive all source files, and we transfer complete ownership and rights to you. Use them however you want, commercially or personally.',
  },
  {
    question: 'What tools do you use?',
    answer:
      'Figma, Illustrator, Photoshop, and Webflow. We use industry-standard tools to ensure compatibility and professional results. All final files are delivered in formats you can easily use.',
  },
  {
    question: 'Can I use it for one month only?',
    answer:
      'Yes. Many brands join for a single month to launch or rebrand. There are no long-term contracts or commitments. Cancel anytime, even after your first month.',
  },
  {
    question: 'What is excluded?',
    answer:
      '3D rendering, long-form video, and large print publications are not covered. We focus on 2D design work including branding, UI/UX, web design, and marketing materials.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'You can request a 75% refund within your first week if you are not satisfied. We want to make sure Boba Club is the right fit for you with minimal risk.',
  },
];

export default function BobaClubFAQ() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background pearls */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-taro/5"
            style={{
              width: 60 + i * 20,
              height: 60 + i * 20,
              left: `${5 + i * 12}%`,
              top: `${10 + i * 10}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + i * 0.5,
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
            Everything You Want to Know
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Common questions about Boba Club answered.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl border-2 border-taro/10 hover:border-taro/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg">
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 transition-colors duration-200 hover:bg-taro/5"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Pearl drop indicator */}
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <AnimatePresence mode="wait">
                        {openIndex === index ? (
                          <motion.div
                            key="open"
                            initial={{ y: -20, opacity: 0, scale: 0 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-taro to-deep-taro flex items-center justify-center"
                          >
                            <div className="w-4 h-4 rounded-full bg-white/30" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="closed"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="w-8 h-8 rounded-full border-2 border-taro/30 flex items-center justify-center group-hover:border-taro/50 transition-colors duration-200"
                          >
                            <div className="w-3 h-3 rounded-full bg-taro/20 group-hover:bg-taro/40 transition-colors duration-200" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Pearl drop animation on open */}
                      <AnimatePresence>
                        {openIndex === index && (
                          <>
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-taro/60"
                                initial={{ y: 0, opacity: 1 }}
                                animate={{ y: 40, opacity: 0 }}
                                transition={{
                                  duration: 0.6,
                                  delay: i * 0.1,
                                  ease: 'easeIn',
                                }}
                              />
                            ))}
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    <h3 className="font-semibold text-lg text-ink pr-4">{faq.question}</h3>
                  </div>

                  {/* Chevron */}
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-6 h-6 text-taro" />
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.3, ease: 'easeInOut' },
                        opacity: { duration: 0.2 },
                      }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        exit={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 pt-2 pl-20"
                      >
                        {/* Splash effect */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4, type: 'spring' }}
                          className="relative"
                        >
                          {/* Ripple effect */}
                          <motion.div
                            className="absolute -top-4 -left-4 w-12 h-12 border-2 border-taro/20 rounded-full"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.6 }}
                          />

                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
