'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, Eye, Rocket } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'discovery',
    description: 'we turn your project form into a clear brief',
    time: '1-3 days',
    icon: Eye,
  },
  {
    number: '2',
    title: 'build',
    description: 'see your site come to life with live previews',
    time: '2-5 weeks',
    icon: Clock,
  },
  {
    number: '3',
    title: 'launch',
    description: 'go live with full support and training',
    time: '1-2 days',
    icon: Rocket,
  },
];

export default function ProcessPreview() {
  return (
    <section className="py-20 bg-white">
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

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative mb-6">
                    {/* Connection line */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-taro/50 to-transparent transform -translate-y-1/2 z-0" />
                    )}

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
                  <p className="text-gray-600 mb-4 lowercase leading-relaxed">{step.description}</p>
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
