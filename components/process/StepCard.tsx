'use client';

import { motion } from 'framer-motion';
import BrewingCupIcon from '@/components/icons/BrewingCupIcon';

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
  whatYouGet: string;
  timing: string;
  delay?: number;
}

const getBrewingLevel = (stepNumber: string) => {
  const levels: { [key: string]: number } = {
    '1': 20, // shake: define the flavor
    '2': 50, // brew: design meets code
    '3': 75, // pop: review your build live
    '4': 95, // launch: go public
    '5': 100, // refill: keep it fresh
  };
  return levels[stepNumber] || 20;
};

export default function StepCard({
  stepNumber,
  title,
  description,
  whatYouGet,
  timing,
  delay = 0,
}: StepCardProps) {
  const brewingLevel = getBrewingLevel(stepNumber);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl p-8 shadow-sm border border-ink/10 relative overflow-hidden hover:shadow-xl hover:shadow-taro/10 transition-all duration-300"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-taro/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

      {/* Pearl accents */}
      <div className="absolute top-4 right-6 w-3 h-3 bg-taro/20 rounded-full"></div>
      <div className="absolute bottom-6 right-4 w-2 h-2 bg-matcha/30 rounded-full"></div>

      {/* Step header with Brewing Cup */}
      <div className="relative z-10">
        <div className="flex items-start mb-6">
          <motion.div
            className="mr-6"
            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <BrewingCupIcon fillLevel={brewingLevel} className="w-20 h-20 text-taro" />
            <div className="mt-1 text-center">
              <span className="text-xs font-bold text-taro">{brewingLevel}%</span>
            </div>
          </motion.div>
          <div className="flex-1 pt-2">
            <div className="inline-block bg-taro text-white text-xs font-bold px-2 py-1 rounded-full mb-2">
              step {stepNumber}
            </div>
            <h3 className="font-display text-2xl font-bold text-ink lowercase leading-tight">
              {title}
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-6">
        <div>
          <p className="text-gray-600 lowercase text-lg leading-relaxed">{description}</p>
        </div>

        <div className="bg-milk-tea/10 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-taro mb-2 lowercase tracking-wide flex items-center">
            <div className="w-2 h-2 bg-taro rounded-full mr-2"></div>
            what you get
          </h4>
          <p className="text-gray-700 lowercase font-medium">{whatYouGet}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-matcha rounded-full mr-2"></div>
            <span className="text-sm font-semibold text-matcha lowercase tracking-wide">
              timeline
            </span>
          </div>
          <div className="bg-matcha/10 text-matcha px-3 py-1 rounded-full text-sm font-bold lowercase">
            {timing}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
