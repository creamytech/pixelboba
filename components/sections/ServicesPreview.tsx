'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const services = [
  {
    icon: 'ph:sparkle-duotone',
    title: 'Designs That Sell',
    description: 'Beautiful, modern websites that make people want to click "buy" or "contact us".',
  },
  {
    icon: 'ph:lightning-duotone',
    title: 'Lightning Fast',
    description:
      'Your site loads in under 2 seconds. Fast sites = more customers and better Google rankings.',
  },
  {
    icon: 'ph:eye-duotone',
    title: 'See It Live Daily',
    description:
      'Watch your site get built in real-time. Give feedback as we go. No surprises at the end.',
  },
];

const pricing = [
  {
    price: '$1,500+',
    title: 'Redesigns',
    description: 'Refresh your existing site',
    color: 'from-[#C4B5FD] to-[#A78BFA]',
  },
  {
    price: '$3,500+',
    title: 'Custom Builds',
    description: 'Brand new websites',
    color: 'from-[#A78BFA] to-[#7C3AED]',
    featured: true,
  },
  {
    price: '$8,000+',
    title: 'Advanced',
    description: 'Complex functionality',
    color: 'from-[#88C159] to-[#6BA541]',
  },
];

export default function ServicesPreview() {
  return (
    <div className="relative py-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-ink mb-6 leading-tight">
            Websites That Bring In
            <br />
            <span className="italic text-[#7C3AED]">Real Business</span>
          </h2>
          <p className="text-2xl md:text-3xl text-ink/70 font-bold leading-tight max-w-3xl mx-auto">
            Starting at $1,500. Done in 2-4 weeks. No meetings, just results.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] h-full hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                <Icon icon={service.icon} className="w-16 h-16 text-deep-taro mb-4" />
                <h3 className="text-2xl font-black text-ink mb-4 leading-tight">{service.title}</h3>
                <p className="text-lg font-bold text-ink/70 leading-snug">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pricing section - big bold header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-matcha px-8 py-4 rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] mb-8">
            <span className="font-black text-xl text-white flex items-center gap-2">
              <Icon icon="ph:currency-dollar-duotone" className="w-6 h-6" />
              Transparent Pricing, No Surprises
            </span>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {pricing.map((tier, index) => (
            <motion.div
              key={tier.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className={tier.featured ? 'md:-mt-4 md:mb-4' : ''}
            >
              <div
                className={`relative bg-gradient-to-br ${tier.color} rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all ${tier.featured ? 'ring-4 ring-matcha ring-offset-4 ring-offset-cream' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-matcha px-6 py-2 rounded-full border-4 border-ink">
                    <span className="font-black text-sm text-white">MOST POPULAR</span>
                  </div>
                )}
                <div className="text-center text-white">
                  <div className="text-6xl font-black mb-2">{tier.price}</div>
                  <div className="text-2xl font-black mb-3">{tier.title}</div>
                  <p className="text-lg font-bold opacity-90">{tier.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-12 py-6 bg-[#7C3AED] text-white text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            View All Services + Pricing →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
