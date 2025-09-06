'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '1',
    title: 'fill out our project form (takes 2 minutes)',
    description: 'tell us about your project, budget, and timeline through our simple form',
  },
  {
    number: '2',
    title: 'tell us what you need + your budget range',
    description: 'share your specific requirements and let us know your budget expectations',
  },
  {
    number: '3',
    title: "we'll send a custom proposal + timeline by email",
    description: 'receive a detailed proposal with pricing and timeline within 24 hours',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-ink mb-4 lowercase">
              how it works
            </h2>
            <p className="text-lg text-gray-600 lowercase">
              simple, transparent, no phone calls required
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center relative"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-taro to-taro/80 rounded-full flex items-center justify-center mx-auto relative">
                    <span className="text-2xl font-bold text-white">{step.number}</span>

                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-matcha rounded-full"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-taro/60 rounded-full"></div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-taro/30 to-transparent transform translate-x-8"></div>
                  )}
                </div>

                <div className="px-4">
                  <h3 className="font-display text-xl font-semibold text-ink mb-3 lowercase">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 lowercase leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-gray-500 lowercase">
              💡 no phone calls, no meetings, no pressure, just clear communication via email
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
