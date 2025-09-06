'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  {
    title: 'website redesign',
    price: 'starting at $750',
    description: 'fresh layout and visuals with mobile responsive design',
    popular: false,
  },
  {
    title: 'custom website build',
    price: 'starting at $1,500',
    description: '4-6 pages with tasteful animations and cms setup',
    popular: true,
  },
  {
    title: 'advanced website build',
    price: 'starting at $4,000',
    description: '6-12 pages with advanced interactions and integrations',
    popular: false,
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
              services that deliver
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 lowercase max-w-2xl mx-auto"
            >
              transparent pricing, working code previews from day one
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-xl p-8 shadow-sm border ${
                  service.popular ? 'border-taro ring-2 ring-taro/20' : 'border-ink/10'
                } hover:shadow-lg transition-all duration-300`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-taro text-white px-4 py-1 rounded-full text-sm font-semibold lowercase">
                      most popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="font-display text-2xl font-bold text-ink mb-2 lowercase">
                    {service.title}
                  </h3>
                  <p className="text-3xl font-bold text-taro mb-4 lowercase">{service.price}</p>
                  <p className="text-gray-600 lowercase leading-relaxed">{service.description}</p>
                </div>

                {/* Pearl accent */}
                <div className="absolute top-4 right-6 w-3 h-3 bg-taro/20 rounded-full"></div>
                <div className="absolute bottom-4 left-6 w-2 h-2 bg-matcha/30 rounded-full"></div>
              </motion.div>
            ))}
          </div>

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
