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
    <div className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-ink mb-4 sm:mb-6 leading-tight px-4">
            Our Process
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-ink/70 font-bold leading-tight max-w-3xl mx-auto px-4">
            A simple workflow that keeps things moving. No endless meetings, just clear steps.
          </p>
        </motion.div>

        {/* Process cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-16">
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
                className={`relative bg-gradient-to-br ${step.color} rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-3 sm:border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] md:hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px] transition-all overflow-hidden`}
              >
                {/* Large number background */}
                <div className="absolute top-0 right-0 text-[80px] sm:text-[100px] md:text-[120px] font-black text-white/10 leading-none">
                  {step.number}
                </div>

                <div className="relative">
                  {/* Icon and timing badge */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Icon icon={step.icon} className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    <span className="bg-white/90 text-ink px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-black text-xs sm:text-sm border-2 border-ink">
                      {step.timing}
                    </span>
                  </div>

                  {/* Title and description */}
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 sm:mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-white/90 leading-snug">
                    {step.description}
                  </p>
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
          <div className="text-center bg-white border-3 sm:border-4 border-ink rounded-2xl sm:rounded-3xl shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] sm:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] md:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] p-8 sm:p-10 md:p-12">
            <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-ink mb-3 sm:mb-4">
              2-6 Weeks
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-black text-ink/70 px-4">
              Total turnaround time for most projects
            </p>
            <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 bg-matcha px-4 sm:px-6 py-2 sm:py-3 rounded-full border-[3px] border-ink">
              <Icon icon="ph:lightning-fill" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="font-black text-sm sm:text-base text-white">Fast, No Fluff</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
