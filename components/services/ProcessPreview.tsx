'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, Eye, Rocket } from 'lucide-react';
import { Icon as IconifyIcon } from '@iconify/react';

const steps = [
  {
    number: '1',
    title: 'discovery',
    description:
      'we turn your project form into a clear brief with wireframes and design direction',
    details: [
      'project requirements analysis',
      'competitor research & insights',
      'wireframe & sitemap creation',
      'design style guide development',
    ],
    time: '1-3 days',
    icon: Eye,
  },
  {
    number: '2',
    title: 'build',
    description: 'see your site come to life with live previews and real-time collaboration',
    details: [
      'custom design implementation',
      'responsive mobile optimization',
      'content management setup',
      'live preview sharing for feedback',
    ],
    time: '2-5 weeks',
    icon: Clock,
  },
  {
    number: '3',
    title: 'launch',
    description: 'go live with full support, training, and ongoing maintenance options',
    details: [
      'domain & hosting configuration',
      'seo optimization & analytics setup',
      'client training & documentation',
      'post-launch support & monitoring',
    ],
    time: '1-2 days',
    icon: Rocket,
  },
];

export default function ProcessPreview() {
  return (
    <section className="py-32 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-ink mb-6">
            how we <span className="italic text-[#7C3AED]">work</span>
          </h2>
          <p className="text-xl md:text-2xl text-ink/70 font-bold max-w-3xl mx-auto">
            simple workflow, no meetings, live previews from day one
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="text-center bg-white rounded-3xl p-10 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:shadow-[10px_10px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative mb-8">
                    {/* Step icon */}
                    <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-taro to-deep-taro rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Step number */}
                    <div className="absolute top-0 right-1/4 w-10 h-10 bg-matcha text-white rounded-full flex items-center justify-center text-lg font-black border-4 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="font-display text-3xl font-black text-ink mb-4">{step.title}</h3>
                  <p className="text-ink/70 mb-8 font-bold text-lg leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step Details */}
                  <div className="mb-8 space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start text-base text-ink/70">
                        <IconifyIcon
                          icon="ph:check-circle-duotone"
                          className="w-5 h-5 text-matcha mr-3 flex-shrink-0 mt-0.5"
                        />
                        <span className="font-bold text-left">{detail}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#FDB97A] rounded-full px-6 py-3 inline-block border-4 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]">
                    <span className="text-base text-ink font-black">{step.time}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/process"
              className="inline-flex items-center space-x-2 text-taro hover:text-deep-taro transition-colors duration-200 font-semibold lowercase text-lg group"
            >
              <span>see the full process</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-gray-500 mt-3 lowercase">
              detailed breakdown of every step, timeline, and deliverable
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
