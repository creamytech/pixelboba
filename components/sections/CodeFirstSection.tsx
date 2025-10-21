'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const benefits = [
  {
    icon: 'ph:monitor-duotone',
    title: 'See Your Site From Day One',
    description:
      'Watch your website come to life in real-time. No waiting weeks for the big reveal.',
  },
  {
    icon: 'ph:lightning-duotone',
    title: 'Works Perfect on All Devices',
    description:
      'Looks amazing and loads fast on phones, tablets, and computers. Your visitors will love it.',
  },
  {
    icon: 'ph:eye-duotone',
    title: 'No Endless Back-and-Forth',
    description: "See exactly what you're getting as we build it. Fewer revisions, faster launch.",
  },
];

export default function CodeFirstSection() {
  return (
    <section className="relative py-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-white px-8 py-4 rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] mb-8">
            <span className="font-black text-lg text-ink flex items-center gap-2">
              <Icon icon="ph:rocket-launch-duotone" className="w-6 h-6 text-deep-taro" />
              How We Work Different
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-tight max-w-4xl mx-auto">
            Skip the
            <span className="italic text-[#7C3AED]"> Waiting</span>,
            <br />
            See Your Site Live
          </h2>
        </motion.div>

        {/* Benefit cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <div className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] h-full hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                <Icon icon={benefit.icon} className="w-16 h-16 text-deep-taro mb-6" />
                <h3 className="text-2xl font-black text-ink mb-4 leading-tight">{benefit.title}</h3>
                <p className="text-lg font-bold text-ink/70 leading-snug">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
