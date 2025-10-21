'use client';

import { motion } from 'framer-motion';
import { Check, X, Star } from 'lucide-react';

type FeatureValue = string | boolean;

interface ServiceFeatures {
  [key: string]: FeatureValue;
}

interface Service {
  name: string;
  price: string;
  timeframe: string;
  popular: boolean;
  features: ServiceFeatures;
}

const services: Service[] = [
  {
    name: 'website redesign',
    price: '$750',
    timeframe: '1-2 weeks',
    popular: false,
    features: {
      'pages included': '3-5 pages',
      'design system': 'basic refresh',
      'mobile optimization': true,
      'seo optimization': 'basic',
      'cms setup': false,
      'custom animations': false,
      'third-party integrations': false,
      'performance optimization': true,
      'accessibility compliance': 'basic',
      'launch support': true,
      'post-launch tweaks': '30 days',
      'training included': false,
    },
  },
  {
    name: 'custom website build',
    price: '$1,500',
    timeframe: '3-4 weeks',
    popular: true,
    features: {
      'pages included': '4-6 pages',
      'design system': 'custom system',
      'mobile optimization': true,
      'seo optimization': 'comprehensive',
      'cms setup': true,
      'custom animations': 'basic',
      'third-party integrations': 'simple',
      'performance optimization': true,
      'accessibility compliance': 'full',
      'launch support': true,
      'post-launch tweaks': '30 days',
      'training included': 'cms training',
    },
  },
  {
    name: 'advanced website build',
    price: '$4,000',
    timeframe: '4-6 weeks',
    popular: false,
    features: {
      'pages included': '6-12 pages',
      'design system': 'full brand guide',
      'mobile optimization': true,
      'seo optimization': 'comprehensive',
      'cms setup': true,
      'custom animations': 'complex',
      'third-party integrations': 'advanced',
      'performance optimization': true,
      'accessibility compliance': 'full',
      'launch support': true,
      'post-launch tweaks': '60 days',
      'training included': 'full training',
    },
  },
];

export default function ServiceComparison() {
  return (
    <section className="py-20 bg-gradient-to-b from-cream to-milk-tea/10">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6 lowercase">
            what&apos;s included?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto lowercase">
            compare our services to find the perfect fit for your project
          </p>
        </motion.div>

        {/* Mobile-friendly comparison */}
        <div className="lg:hidden space-y-6 px-4">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              className={`bg-white rounded-2xl p-6 shadow-lg border ${
                service.popular ? 'border-taro ring-2 ring-taro/20' : 'border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {service.popular && (
                <div className="flex items-center justify-center mb-4">
                  <span className="bg-taro text-white px-4 py-1 rounded-full text-sm font-semibold lowercase flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>most popular</span>
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-display text-2xl font-bold text-ink mb-2 lowercase">
                  {service.name}
                </h3>
                <p className="text-3xl font-bold text-taro mb-1">starting at {service.price}</p>
                <p className="text-gray-600 lowercase">{service.timeframe} delivery</p>
              </div>

              <div className="space-y-3">
                {Object.entries(service.features).map(([feature, value]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-gray-600 lowercase text-sm">{feature}</span>
                    <div className="flex items-center space-x-2">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <Check className="w-4 h-4 text-taro" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )
                      ) : (
                        <span className="text-ink text-sm font-medium">{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block">
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Header */}
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-6 font-semibold text-gray-600 lowercase">
                      features
                    </th>
                    {services.map((service) => (
                      <th key={service.name} className="relative p-6 text-center">
                        {service.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-taro text-white px-3 py-1 rounded-full text-xs font-semibold lowercase flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span>most popular</span>
                            </span>
                          </div>
                        )}
                        <div className="font-display text-xl font-bold text-ink mb-2 lowercase">
                          {service.name}
                        </div>
                        <div className="text-2xl font-bold text-taro mb-1">
                          starting at {service.price}
                        </div>
                        <div className="text-sm text-gray-600 lowercase">
                          {service.timeframe} delivery
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {Object.keys(services[0].features).map((feature, index) => (
                    <tr key={feature} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-4 font-medium text-gray-700 lowercase">{feature}</td>
                      {services.map((service) => (
                        <td key={`${service.name}-${feature}`} className="p-4 text-center">
                          {typeof service.features[feature] === 'boolean' ? (
                            service.features[feature] ? (
                              <Check className="w-5 h-5 text-taro mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-ink font-medium text-sm lowercase">
                              {service.features[feature]}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#start-project"
            className="inline-block bg-taro text-white px-8 py-4 rounded-xl font-semibold hover:bg-taro/90 transition-colors duration-200 lowercase shadow-lg hover:shadow-xl"
          >
            choose your package →
          </a>
          <p className="text-gray-500 mt-4 lowercase">
            not sure which package?{' '}
            <a href="/process" className="text-taro hover:text-deep-taro transition-colors">
              see our process
            </a>{' '}
            or we&apos;ll help you choose the right fit.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
