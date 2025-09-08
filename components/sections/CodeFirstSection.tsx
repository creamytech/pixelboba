'use client';

import { motion } from 'framer-motion';
import { Code, Zap, Eye } from 'lucide-react';

const benefits = [
  {
    icon: Code,
    title: 'working previews from day one',
    description:
      "see exactly what you're getting with live code previews. no endless mockups or guesswork.",
  },
  {
    icon: Zap,
    title: 'performance and accessibility built in',
    description:
      'every build meets high performance standards. fast loading, keyboard navigation, screen reader friendly.',
  },
  {
    icon: Eye,
    title: 'no endless revisions',
    description:
      "clear previews mean fewer surprises. you know what you're getting before we call it done.",
  },
];

export default function CodeFirstSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl md:text-5xl font-bold text-ink mb-4 lowercase"
            >
              why code first works better
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-taro to-matcha mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="text-center group"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-taro/10 to-matcha/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-10 h-10 text-taro" />
                    </div>

                    {/* Pearl accents */}
                    <div className="absolute -top-1 -right-2 w-4 h-4 bg-matcha rounded-full opacity-60"></div>
                    <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-taro/60 rounded-full opacity-40"></div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-ink mb-4 lowercase leading-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 lowercase leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
