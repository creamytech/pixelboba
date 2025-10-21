'use client';

import { motion } from 'framer-motion';
import { Check, Star, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const packages = [
  {
    name: 'starter',
    price: '$5,000',
    duration: '2-3 weeks',
    description:
      'perfect for small businesses and personal brands looking to establish their online presence.',
    icon: Sparkles,
    features: [
      'custom responsive design',
      'up to 5 pages',
      'seo optimization',
      'performance optimization',
      'contact form integration',
      'mobile-first design',
      '30 days post-launch support',
      'content management training',
    ],
    popular: false,
    color: 'from-matcha to-matcha/80',
  },
  {
    name: 'professional',
    price: '$10,000',
    duration: '4-6 weeks',
    description:
      'ideal for growing businesses that need advanced functionality and premium design.',
    icon: Zap,
    features: [
      'everything in starter',
      'up to 10 pages',
      'advanced animations',
      'cms integration',
      'blog setup',
      'analytics integration',
      'email marketing setup',
      '60 days post-launch support',
      'performance monitoring',
    ],
    popular: true,
    color: 'from-taro to-deep-taro',
  },
  {
    name: 'enterprise',
    price: '$25,000+',
    duration: '8-12 weeks',
    description:
      'comprehensive solution for complex projects requiring custom functionality and integrations.',
    icon: Star,
    features: [
      'everything in professional',
      'unlimited pages',
      'custom functionality',
      'third-party integrations',
      'e-commerce capabilities',
      'advanced seo strategy',
      'multi-language support',
      '90 days post-launch support',
      'dedicated project manager',
      'priority support',
    ],
    popular: false,
    color: 'from-brown-sugar to-brown-sugar/80',
  },
];

const addOns = [
  { name: 'logo design', price: '$1,500' },
  { name: 'content writing', price: '$150/page' },
  { name: 'professional photography', price: '$2,000' },
  { name: 'monthly maintenance', price: '$500/month' },
  { name: 'hosting setup & management', price: '$100/month' },
  { name: 'additional revisions', price: '$150/hour' },
];

export default function PricingSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6">
            transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            choose the package that best fits your needs. all packages include our signature
            attention to detail and performance optimization.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.name}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                  pkg.popular ? 'ring-2 ring-taro transform scale-105' : ''
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-taro text-white text-center py-2 font-semibold text-sm">
                    Most Popular
                  </div>
                )}

                <div
                  className={`bg-gradient-to-br ${pkg.color} p-8 text-white ${pkg.popular ? 'pt-12' : ''}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{pkg.price}</div>
                      <div className="text-sm opacity-90">{pkg.duration}</div>
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="opacity-90 leading-relaxed">{pkg.description}</p>
                </div>

                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-matcha mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={`w-full ${
                      pkg.popular
                        ? 'bg-taro hover:bg-deep-taro text-white'
                        : 'border border-taro text-taro hover:bg-taro hover:text-white'
                    }`}
                    variant={pkg.popular ? 'default' : 'outline'}
                  >
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </div>

                {/* Floating pearls */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-matcha/60 rounded-full" />
                <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-milk-tea/80 rounded-full" />
              </motion.div>
            );
          })}
        </div>

        {/* Add-ons */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="font-display text-2xl font-bold text-ink mb-6 text-center">
            Optional Add-ons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
              >
                <span className="font-medium text-gray-700">{addon.name}</span>
                <span className="font-bold text-taro">{addon.price}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-600 mb-6">
            need something custom? let&apos;s discuss your specific requirements.
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-taro text-taro hover:bg-taro hover:text-white"
          >
            <Link href="/contact">request custom quote</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
