'use client';

import { motion } from 'framer-motion';
import { Zap, Gauge, Eye, Shield } from 'lucide-react';

const badges = [
  {
    icon: Gauge,
    score: 100,
    label: 'Performance',
    color: 'from-green-500 to-green-600',
    position: { top: '15%', right: '5%' },
    delay: 0.8,
  },
  {
    icon: Eye,
    score: 100,
    label: 'Accessibility',
    color: 'from-blue-500 to-blue-600',
    position: { top: '40%', right: '3%' },
    delay: 1,
  },
  {
    icon: Shield,
    score: 100,
    label: 'Best Practices',
    color: 'from-purple-500 to-purple-600',
    position: { top: '65%', right: '5%' },
    delay: 1.2,
  },
  {
    icon: Zap,
    score: 100,
    label: 'SEO',
    color: 'from-orange-500 to-orange-600',
    position: { bottom: '15%', left: '5%' },
    delay: 1.4,
  },
];

export default function LighthouseBadges() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={badge.label}
            className="absolute"
            style={badge.position}
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: badge.delay,
              type: 'spring',
              stiffness: 200,
            }}
          >
            <motion.div
              className={`bg-gradient-to-br ${badge.color} rounded-2xl p-4 shadow-2xl backdrop-blur-sm border-2 border-white/20`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.5,
                },
              }}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-white" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-white leading-none">{badge.score}</div>
                  <div className="text-xs text-white/90 font-medium">{badge.label}</div>
                </div>
              </div>

              {/* Glowing effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${badge.color} blur-xl opacity-50 -z-10`}
              ></div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
