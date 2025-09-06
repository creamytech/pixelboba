'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Link as LinkIcon, FileText } from 'lucide-react';

const feedbackSteps = [
  {
    icon: LinkIcon,
    text: 'we share links: wireframes → designs → staging',
  },
  {
    icon: MessageCircle,
    text: 'you comment in place; we reply with options and ship',
  },
  {
    icon: FileText,
    text: 'no meetings required, everything in writing for clarity',
  },
];

export default function FeedbackSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="py-20 bg-milk-tea/20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-ink mb-4 lowercase">
              how feedback works (async & fast)
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-taro to-matcha mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feedbackSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center relative"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-taro/20 relative">
                      <Icon className="w-7 h-7 text-taro" />

                      {/* Pearl accents */}
                      <div className="absolute -top-1 -right-2 w-3 h-3 bg-matcha rounded-full"></div>
                      <div className="absolute -bottom-2 -left-1 w-2 h-2 bg-taro/60 rounded-full"></div>
                    </div>

                    {/* Connector line */}
                    {index < feedbackSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-taro/30 to-transparent transform translate-x-8"></div>
                    )}
                  </div>

                  <p className="text-gray-600 lowercase leading-relaxed px-4">{step.text}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-sm border border-taro/20">
              <div className="w-2 h-2 bg-matcha rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm text-gray-600 lowercase font-medium">
                💬 clear communication, zero confusion
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
