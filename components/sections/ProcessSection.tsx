'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Coffee, Layers, Zap, Rocket, RotateCcw } from 'lucide-react';

const processSteps = [
  { icon: ShoppingBag, title: 'Shake', description: 'Discovery & strategy planning' },
  { icon: Coffee, title: 'Brew', description: 'Architecture & wireframing' },
  { icon: Layers, title: 'Layer', description: 'Visual design & interactions' },
  { icon: Zap, title: 'Pop', description: 'Development & optimization' },
  { icon: Rocket, title: 'Launch', description: 'Deployment & go-live' },
  { icon: RotateCcw, title: 'Iterate', description: 'Monitor & improve' },
];

export default function ProcessSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6">Our Process</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Like crafting the perfect boba tea, we follow a proven recipe for digital success.
          </p>
        </motion.div>

        {/* Desktop Horizontal Steps */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-taro via-matcha to-brown-sugar transform -translate-y-1/2" />

            <div className="flex items-center justify-between">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    className="relative flex flex-col items-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Step Circle */}
                    <div className="w-20 h-20 bg-white border-4 border-taro rounded-full flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform duration-300 z-10">
                      <Icon className="w-8 h-8 text-taro" />
                    </div>

                    {/* Step Content */}
                    <div className="text-center max-w-32">
                      <h3 className="font-display text-lg font-bold text-ink mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>

                    {/* Step Number */}
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-matcha text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Vertical Steps */}
        <div className="lg:hidden space-y-8">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Step Circle */}
                <div className="relative">
                  <div className="w-16 h-16 bg-taro rounded-full flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-matcha text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Step Content */}
                <div>
                  <h3 className="font-display text-xl font-bold text-ink mb-1">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-600 mb-6">Ready to start your project journey?</p>
          <a
            href="/process"
            className="inline-block border-2 border-taro text-taro px-8 py-3 rounded-lg font-semibold hover:bg-taro hover:text-white transition-colors duration-300"
          >
            Learn More About Our Process
          </a>
        </motion.div>
      </div>
    </section>
  );
}
