'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  {
    title: 'fresh design',
    icon: '🎨',
    description:
      'modern, mobile-first designs that make your brand stand out and convert visitors into customers',
  },
  {
    title: 'fast performance',
    icon: '⚡',
    description:
      'lightning-fast websites built with cutting-edge tech for better SEO and user experience',
  },
  {
    title: 'live previews',
    icon: '👀',
    description: 'see your site come to life from day one—no waiting weeks for the big reveal',
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
                className="relative bg-white rounded-xl p-8 shadow-sm border border-ink/10 hover:shadow-lg transition-all duration-300 hover:border-taro/30"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="font-display text-2xl font-bold text-ink mb-4 lowercase">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 lowercase leading-relaxed">{service.description}</p>
                </div>

                {/* Pearl accent */}
                <div className="absolute top-4 right-6 w-3 h-3 bg-taro/20 rounded-full"></div>
                <div className="absolute bottom-4 left-6 w-2 h-2 bg-matcha/30 rounded-full"></div>
              </motion.div>
            ))}
          </div>

          {/* Pricing highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-taro/10 to-matcha/10 rounded-2xl p-8 mb-12 text-center border border-taro/20"
          >
            <h3 className="font-display text-2xl font-bold text-ink mb-4 lowercase">
              transparent pricing, no surprises
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-taro lowercase">redesigns from $1,500</div>
                <div className="text-gray-600 lowercase">refresh your existing site</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-taro lowercase">
                  custom builds from $3,500
                </div>
                <div className="text-gray-600 lowercase">brand new websites</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-taro lowercase">advanced from $8,000</div>
                <div className="text-gray-600 lowercase">complex functionality</div>
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
              className="inline-block bg-taro text-white px-8 py-4 rounded-xl font-semibold hover:bg-taro/90 transition-colors duration-200 lowercase shadow-lg hover:shadow-xl"
            >
              view all services + pricing
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
