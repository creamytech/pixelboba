'use client';

import { motion } from 'framer-motion';
import { Check, Smartphone, Eye, Zap, Mail, BarChart3 } from 'lucide-react';

const checklistItems = [
  {
    icon: Smartphone,
    text: 'responsive across modern devices',
  },
  {
    icon: Eye,
    text: 'accessibility targets (wcag-aware)',
  },
  {
    icon: Zap,
    text: 'optimized performance and seo standards',
  },
  {
    icon: Mail,
    text: 'forms tested end-to-end (email delivery confirmed)',
  },
  {
    icon: BarChart3,
    text: 'analytics + basic event tracking installed',
  },
];

export default function QualityChecklist() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-ink mb-4 lowercase">
              quality checklist (every project)
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-matcha to-taro mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 lowercase">
              our non-negotiable standards for every build
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-ink/10 relative overflow-hidden">
            {/* Background pearls */}
            <div className="absolute top-6 right-8 w-4 h-4 bg-matcha/20 rounded-full"></div>
            <div className="absolute bottom-8 right-12 w-3 h-3 bg-taro/20 rounded-full"></div>
            <div className="absolute top-1/2 left-6 w-2 h-2 bg-taro/30 rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {checklistItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-taro/5 transition-colors duration-200"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-taro/10 to-matcha/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-taro" />
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 + 0.1 * index }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-matcha rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    </div>
                    <p className="text-gray-600 lowercase leading-relaxed pt-1">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom guarantee badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-center mt-8 pt-6 border-t border-gray-100"
            >
              <div className="inline-flex items-center bg-gradient-to-r from-taro/10 to-matcha/10 px-6 py-3 rounded-full">
                <div className="w-3 h-3 bg-matcha rounded-full mr-3"></div>
                <span className="text-sm font-semibold text-gray-700 lowercase">
                  ✓ tested, polished, and ready to perform
                </span>
                <div className="w-3 h-3 bg-taro rounded-full ml-3"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
