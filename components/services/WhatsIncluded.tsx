'use client';

import { motion } from 'framer-motion';
import { Check, Smartphone, Eye, Zap, Lock, MessageSquare, BarChart } from 'lucide-react';

const universalFeatures = [
  {
    icon: Smartphone,
    title: 'Mobile-Optimized',
    description: 'Perfect on every device',
  },
  {
    icon: Eye,
    title: '1:1 Code Previews',
    description: 'See it live, not on slides',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: '90+ Lighthouse scores',
  },
  {
    icon: Lock,
    title: 'Secure & Reliable',
    description: 'Best practices built in',
  },
  {
    icon: MessageSquare,
    title: 'Async Communication',
    description: 'No endless meetings',
  },
  {
    icon: BarChart,
    title: 'Analytics Ready',
    description: 'Track what matters',
  },
];

export default function WhatsIncluded() {
  return (
    <section className="py-16 bg-gradient-to-br from-taro/5 via-white to-matcha/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4 lowercase">
              what&apos;s included in every brew
            </h2>
            <p className="text-xl text-gray-600 lowercase max-w-2xl mx-auto">
              no matter which tier you choose, you get these essentials
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative bg-white rounded-2xl p-6 shadow-md border border-ink/10 hover:shadow-xl hover:border-taro/30 transition-all duration-300"
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-taro/5 via-transparent to-matcha/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                  <div className="relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-taro/20 to-matcha/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-taro" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-lg font-bold text-ink mb-2 lowercase">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm lowercase leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-taro flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Animated pearl accent */}
                  <motion.div
                    className="absolute bottom-4 right-4 w-2 h-2 bg-taro/30 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  ></motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
