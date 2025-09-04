'use client';

import { motion } from 'framer-motion';
import { Zap, Palette, Target, Heart } from 'lucide-react';

const valueProps = [
  {
    icon: Zap,
    title: 'performance',
    description:
      'lightning-fast loading times and smooth interactions that keep users engaged and search engines happy.',
    stats: '99+ lighthouse score',
  },
  {
    icon: Palette,
    title: 'craft',
    description:
      'pixel-perfect designs with attention to every detail, from typography to micro-interactions.',
    stats: 'design-first approach',
  },
  {
    icon: Target,
    title: 'strategy',
    description:
      'every design decision is backed by research and aligned with your business goals and user needs.',
    stats: 'data-driven decisions',
  },
  {
    icon: Heart,
    title: 'ongoing care',
    description:
      "we don't just launch and disappear. ongoing support ensures your site stays fresh and functional.",
    stats: '24/7 monitoring',
  },
];

export default function ValuePropsSection() {
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
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6">
            why choose pixel boba?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            we combine beautiful design with exceptional performance to create websites that
            don&apos;t just look good—they work brilliantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <motion.div
                key={prop.title}
                className="group text-center p-6 rounded-lg hover:bg-milk-tea/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-taro/10 rounded-lg flex items-center justify-center mx-auto group-hover:bg-taro/20 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-taro" />
                  </div>

                  {/* Floating pearl on hover */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-taro rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>

                <h3 className="font-display text-xl font-bold text-ink mb-3">{prop.title}</h3>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{prop.description}</p>

                <div className="inline-block bg-matcha/20 text-matcha px-3 py-1 rounded-full text-xs font-medium">
                  {prop.stats}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
