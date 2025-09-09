'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, Eye, Rocket } from 'lucide-react';

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
    <section className="py-24 bg-gradient-to-b from-white via-milk-tea/5 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6 lowercase">
            how we work
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto lowercase">
            simple workflow, no meetings, live previews from day one
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative mb-6">
                    {/* Step icon */}
                    <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-taro to-deep-taro rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-matcha text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-ink mb-3 lowercase">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 lowercase leading-relaxed">{step.description}</p>

                  {/* Step Details */}
                  <div className="mb-6 space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-taro rounded-full mr-3 flex-shrink-0"></div>
                        <span className="lowercase">{detail}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-milk-tea/20 rounded-full px-4 py-2 inline-block">
                    <span className="text-sm text-gray-600 font-medium lowercase">{step.time}</span>
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
