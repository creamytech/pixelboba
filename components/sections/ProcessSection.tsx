'use client';

import { motion } from 'framer-motion';
import { Search, Palette, Rocket } from 'lucide-react';

const processSteps = [
  {
    icon: Search,
    title: 'discovery & planning',
    description:
      'turn your project form into a clear brief with sitemap, wireframes, and tech plan.',
    whatYouGet: 'project brief, clickable prototype, and timeline',
    timing: '3–5 days',
  },
  {
    icon: Palette,
    title: 'design & build',
    description: 'create your visual design and develop the site with live previews throughout.',
    whatYouGet: 'figma designs, staging site, and progress updates',
    timing: '2–5 weeks',
  },
  {
    icon: Rocket,
    title: 'launch & support',
    description: 'deploy your site, set up analytics, and provide ongoing care.',
    whatYouGet: 'live site, analytics setup, and monthly updates',
    timing: '1–2 days to launch',
  },
];

export default function ProcessSection() {
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
            our process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto lowercase">
            a simple workflow that keeps things moving. no meetings, no calls, just clear steps,
            clean builds, and quick turnarounds.
          </p>
        </motion.div>

        {/* 3-Step Process Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl p-8 shadow-md border border-ink/10 relative overflow-hidden hover:shadow-2xl hover:shadow-taro/10 transition-all duration-300 hover:border-taro/30"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-taro/5 via-transparent to-matcha/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Pearl accents - animated */}
                <motion.div
                  className="absolute top-4 right-6 w-3 h-3 bg-taro/30 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                ></motion.div>
                <motion.div
                  className="absolute bottom-6 right-4 w-2 h-2 bg-matcha/40 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 + 1.5 }}
                ></motion.div>

                {/* Step header */}
                <div className="relative z-10">
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-taro to-taro/80 rounded-2xl flex items-center justify-center mr-4 relative shadow-lg">
                      <Icon className="w-7 h-7 text-white" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-matcha rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="font-display text-2xl font-bold text-ink lowercase">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-6">
                  <div>
                    <p className="text-gray-600 lowercase text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="bg-milk-tea/10 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-taro mb-2 lowercase tracking-wide flex items-center">
                      <div className="w-2 h-2 bg-taro rounded-full mr-2"></div>
                      what you get
                    </h4>
                    <p className="text-gray-700 lowercase font-medium">{step.whatYouGet}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-matcha rounded-full mr-2"></div>
                      <span className="text-sm font-semibold text-matcha lowercase tracking-wide">
                        timeline
                      </span>
                    </div>
                    <div className="bg-matcha/10 text-matcha px-3 py-1 rounded-full text-sm font-bold lowercase">
                      {step.timing}
                    </div>
                  </div>
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
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-600 text-lg mb-6 lowercase">
            ready to start your project journey?
          </p>
          <a
            href="/process"
            className="group inline-flex items-center border-2 border-taro text-taro px-8 py-4 rounded-xl font-semibold hover:bg-taro hover:text-white transition-all duration-300 lowercase hover:shadow-lg hover:scale-105"
          >
            learn more about our process
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
