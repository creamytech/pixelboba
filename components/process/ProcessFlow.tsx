'use client';

import { motion } from 'framer-motion';
import { CheckSquare, Coffee, Layers, Zap, Rocket, RotateCcw } from 'lucide-react';

const processSteps = [
  {
    step: 1,
    title: 'shake',
    subtitle: 'discovery & strategy planning',
    icon: CheckSquare,
  },
  {
    step: 2,
    title: 'brew',
    subtitle: 'architecture & wireframing',
    icon: Coffee,
  },
  {
    step: 3,
    title: 'layer',
    subtitle: 'visual design & interactions',
    icon: Layers,
  },
  {
    step: 4,
    title: 'pop',
    subtitle: 'development & optimization',
    icon: Zap,
  },
  {
    step: 5,
    title: 'launch',
    subtitle: 'deployment & go-live',
    icon: Rocket,
  },
  {
    step: 6,
    title: 'iterate',
    subtitle: 'monitor & improve',
    icon: RotateCcw,
  },
];

export default function ProcessFlow() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-milk-tea/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6 lowercase">
            our process
          </h2>
          <p className="text-xl text-gray-600 mb-16 lowercase">
            like crafting the perfect boba tea, we follow a proven recipe for digital success.
          </p>

          {/* Process Flow */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 transform -translate-y-1/2 hidden lg:block" />

            {/* Steps Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Step Circle */}
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-white border-4 border-purple-300 rounded-full flex items-center justify-center shadow-lg relative z-10">
                        <IconComponent className="w-8 h-8 text-purple-600" />
                      </div>
                      {/* Step Number */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md z-20">
                        <span className="text-xs font-bold text-white">{step.step}</span>
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 lowercase">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 max-w-32 mx-auto lowercase leading-tight">
                        {step.subtitle}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-lg text-gray-600 mb-6 lowercase">
              ready to start your project journey?
            </p>
            <motion.a
              href="/process"
              className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 lowercase"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              learn more about our process
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
