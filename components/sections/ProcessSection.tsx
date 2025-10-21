'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const processSteps = [
  {
    number: '01',
    icon: 'ph:magnifying-glass-duotone',
    title: 'Discovery',
    description:
      'Turn your project form into a clear brief with sitemap, wireframes, and tech plan.',
    timing: '3–5 days',
    color: 'from-[#C4B5FD] to-[#A78BFA]',
  },
  {
    number: '02',
    icon: 'ph:palette-duotone',
    title: 'Design',
    description: 'Create your visual design in Figma with daily progress updates and feedback.',
    timing: '1 week',
    color: 'from-[#A78BFA] to-[#7C3AED]',
  },
  {
    number: '03',
    icon: 'ph:lightning-duotone',
    title: 'Development',
    description: 'Build the site with live previews. See your website come to life in real-time.',
    timing: '1–4 weeks',
    color: 'from-[#7C3AED] to-[#6D28D9]',
  },
  {
    number: '04',
    icon: 'ph:rocket-launch-duotone',
    title: 'Launch',
    description: 'Deploy your site, set up analytics, and provide ongoing support.',
    timing: '1–2 days',
    color: 'from-[#88C159] to-[#6BA541]',
  },
];

export default function ProcessSection() {
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
            Our Process
          </h2>
          <p className="text-2xl md:text-3xl text-ink/70 font-bold leading-tight max-w-3xl mx-auto">
            A simple workflow that keeps things moving. No endless meetings, just clear steps.
          </p>
        </motion.div>

        {/* Process cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div
                className={`relative bg-gradient-to-br ${step.color} rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all overflow-hidden`}
              >
                {/* Large number background */}
                <div className="absolute top-0 right-0 text-[120px] font-black text-white/10 leading-none">
                  {step.number}
                </div>

                <div className="relative">
                  {/* Icon and timing badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Icon icon={step.icon} className="w-12 h-12 text-white" />
                    <span className="bg-white/90 text-ink px-4 py-2 rounded-full font-black text-sm border-2 border-ink">
                      {step.timing}
                    </span>
                  </div>

                  {/* Title and description */}
                  <h3 className="text-3xl font-black text-white mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-lg font-bold text-white/90 leading-snug">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total time card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="text-center bg-white border-4 border-ink rounded-3xl shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] p-12">
            <div className="text-7xl md:text-8xl font-black text-ink mb-4">2-6 Weeks</div>
            <p className="text-2xl font-black text-ink/70">
              Total turnaround time for most projects
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-matcha px-6 py-3 rounded-full border-[3px] border-ink">
              <Icon icon="ph:lightning-fill" className="w-6 h-6 text-white" />
              <span className="font-black text-white">Fast, No Fluff</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
