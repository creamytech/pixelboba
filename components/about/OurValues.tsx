'use client';

import { motion } from 'framer-motion';
import { Gauge, Eye, Lightbulb, Waves } from 'lucide-react';

const values = [
  {
    icon: Gauge,
    title: 'Performance',
    description:
      'Every site we build is optimized for speed. Fast load times mean better SEO, happier users, and higher conversions.',
    color: 'from-taro to-deep-taro',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description:
      'You see what we build, when we build it. No smoke and mirrors, no surprises. Real previews, honest timelines.',
    color: 'from-matcha to-matcha/80',
  },
  {
    icon: Lightbulb,
    title: 'Creativity',
    description:
      'Your brand is unique, your site should be too. We bring fresh ideas and custom solutions to every project.',
    color: 'from-milk-tea to-milk-tea/70',
  },
  {
    icon: Waves,
    title: 'Flow',
    description:
      'Work should feel smooth, not stressful. Our async process keeps things moving without constant meetings or interruptions.',
    color: 'from-taro/80 to-matcha',
  },
];

export default function OurValues() {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4 lowercase">
              our values
            </h2>
            <p className="text-xl text-gray-600 lowercase max-w-2xl mx-auto">
              the principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 border-2 border-ink/10 hover:border-taro/30 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Background gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>

                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-taro/5 to-matcha/5 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-matcha/5 to-milk-tea/5 rounded-full blur-2xl"></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="font-display text-3xl font-bold text-ink mb-4 lowercase">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg lowercase">
                      {value.description}
                    </p>
                  </div>

                  {/* Animated pearl accents */}
                  <motion.div
                    className="absolute top-8 right-8 w-3 h-3 bg-taro/30 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  ></motion.div>
                  <motion.div
                    className="absolute bottom-8 right-12 w-2 h-2 bg-matcha/40 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 + 1 }}
                  ></motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Fun stat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="inline-block bg-gradient-to-r from-taro/10 to-matcha/10 rounded-2xl px-8 py-6 border border-taro/20">
              <div className="flex items-center gap-4">
                <div className="text-5xl">🧋</div>
                <div>
                  <div className="font-display text-4xl font-bold text-taro">247+</div>
                  <div className="text-gray-600 lowercase font-medium">
                    cups of boba consumed while building sites
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
