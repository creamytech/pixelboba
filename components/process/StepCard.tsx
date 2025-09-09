'use client';

import { motion } from 'framer-motion';

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
  whatYouGet: string;
  timing: string;
  delay?: number;
}

export default function StepCard({
  stepNumber,
  title,
  description,
  whatYouGet,
  timing,
  delay = 0,
}: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl p-8 shadow-sm border border-ink/10 relative overflow-hidden"
    >
      {/* Pearl accents */}
      <div className="absolute top-4 right-6 w-3 h-3 bg-taro/20 rounded-full"></div>
      <div className="absolute bottom-6 right-4 w-2 h-2 bg-matcha/30 rounded-full"></div>

      {/* Step header */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-taro to-taro/80 rounded-full flex items-center justify-center mr-4 relative">
          <span className="text-xl font-bold text-white">{stepNumber}</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-matcha rounded-full"></div>
        </div>
        <h3 className="font-display text-2xl font-bold text-ink lowercase">{title}</h3>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div>
          <p className="text-gray-600 lowercase text-lg leading-relaxed">{description}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-taro mb-2 lowercase tracking-wide">
            what you get
          </h4>
          <p className="text-gray-600 lowercase">{whatYouGet}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-taro mb-2 lowercase tracking-wide">timeline</h4>
          <p className="text-gray-600 lowercase font-medium">{timing}</p>
        </div>
      </div>
    </motion.div>
  );
}
