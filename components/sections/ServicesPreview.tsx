'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  {
    title: 'fresh design',
    icon: '🎨',
    description:
      'Modern, mobile-first designs that make your brand stand out and turn visitors into buyers',
  },
  {
    title: 'fast performance',
    icon: '⚡',
    description:
      'Lightning-fast websites built with cutting-edge tech for better SEO and user experience',
  },
  {
    title: 'live previews',
    icon: '👀',
    description: 'See your site come to life from day one—no waiting weeks for the big reveal',
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-20 bg-milk-tea/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl md:text-5xl font-bold text-ink mb-4 lowercase"
            >
              websites that work
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 lowercase max-w-2xl mx-auto"
            >
              professional websites starting at $1,500. no endless meetings, just results.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-8 shadow-md border border-ink/10 hover:shadow-2xl hover:shadow-taro/10 transition-all duration-300 hover:border-taro/40 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-taro/5 via-transparent to-matcha/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="text-center relative z-10">
                  <motion.div
                    className="text-5xl mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold text-ink mb-4 lowercase">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 lowercase leading-relaxed text-base">
                    {service.description}
                  </p>
                </div>

                {/* Animated pearl accents */}
                <motion.div
                  className="absolute top-6 right-6 w-4 h-4 bg-taro/30 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                ></motion.div>
                <motion.div
                  className="absolute bottom-6 left-6 w-3 h-3 bg-matcha/40 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                ></motion.div>
              </motion.div>
            ))}
          </div>

          {/* Pricing highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative bg-gradient-to-r from-taro/10 via-taro/5 to-matcha/10 rounded-3xl p-10 mb-12 text-center border-2 border-taro/20 overflow-hidden shadow-lg"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-taro/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-matcha/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="font-display text-3xl md:text-4xl font-bold text-ink mb-8 lowercase">
                transparent pricing, no surprises
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
                <div className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold text-taro lowercase mb-2 group-hover:scale-110 transition-transform duration-300">
                    redesigns from $1,500
                  </div>
                  <div className="text-gray-600 lowercase font-medium">
                    refresh your existing site
                  </div>
                </div>
                <div className="hidden md:block w-px h-16 bg-taro/30"></div>
                <div className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold text-taro lowercase mb-2 group-hover:scale-110 transition-transform duration-300">
                    custom builds from $3,500
                  </div>
                  <div className="text-gray-600 lowercase font-medium">brand new websites</div>
                </div>
                <div className="hidden md:block w-px h-16 bg-taro/30"></div>
                <div className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold text-taro lowercase mb-2 group-hover:scale-110 transition-transform duration-300">
                    advanced from $8,000
                  </div>
                  <div className="text-gray-600 lowercase font-medium">complex functionality</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <Link
              href="/services"
              className="group inline-flex items-center bg-taro text-white px-8 py-4 rounded-xl font-semibold hover:bg-deep-taro transition-all duration-300 lowercase shadow-lg hover:shadow-2xl hover:shadow-taro/30 hover:scale-105"
            >
              view all services + pricing
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
