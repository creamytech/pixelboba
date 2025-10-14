'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: 'Pixel Boba transformed our online presence. the results speak for themselves.',
    author: 'Care on Call',
    role: 'Healthcare Platform',
    rating: 5,
  },
  {
    quote: 'the no-meetings process was refreshing. we got a beautiful site in record time.',
    author: 'Real Client',
    role: 'E-commerce Business',
    rating: 5,
  },
  {
    quote:
      'best web design experience we have had. professional, fast, and exactly what we needed.',
    author: 'Real Client',
    role: 'SaaS Startup',
    rating: 5,
  },
  {
    quote: 'they delivered exactly what we needed without any of the usual back-and-forth.',
    author: 'Real Client',
    role: 'Local Service Business',
    rating: 5,
  },
];

export default function SocialProofSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-milk-tea/10 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-taro uppercase tracking-wider mb-4">
            trusted by south florida businesses
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink lowercase">
            what our clients say
          </h2>
        </motion.div>

        {/* Scrolling testimonials */}
        <div className="relative">
          <motion.div
            animate={{
              x: [0, -1000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 30,
                ease: 'linear',
              },
            }}
            className="flex gap-6"
          >
            {/* Duplicate testimonials for seamless loop */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 border border-ink/10 shadow-sm hover:shadow-lg transition-shadow duration-300"
                whileHover={{ scale: 1.02 }}
              >
                {/* Rating stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-taro text-taro" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 mb-4 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-taro/20 to-matcha/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-taro rounded-full" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-taro mb-2 lowercase">🧋</div>
            <p className="text-sm text-gray-600 lowercase font-medium">
              smooth process, zero stress
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-taro mb-2 lowercase">⚡</div>
            <p className="text-sm text-gray-600 lowercase font-medium">
              fast responses, faster delivery
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-taro mb-2 lowercase">💯</div>
            <p className="text-sm text-gray-600 lowercase font-medium">lighthouse perfect scores</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-taro mb-2 lowercase">👀</div>
            <p className="text-sm text-gray-600 lowercase font-medium">
              live previews from day one
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
