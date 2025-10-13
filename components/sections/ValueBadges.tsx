'use client';

import { motion } from 'framer-motion';
import { Code2, Eye, MessageSquare } from 'lucide-react';

const badges = [
  {
    icon: Code2,
    label: 'Code-First Builds',
    color: 'from-taro/20 to-taro/5',
  },
  {
    icon: Eye,
    label: 'Pixel-Perfect Previews',
    color: 'from-matcha/20 to-matcha/5',
  },
  {
    icon: MessageSquare,
    label: 'Async, Transparent Workflow',
    color: 'from-milk-tea to-milk-tea/50',
  },
];

export default function ValueBadges() {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-4 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={badge.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} border border-ink/10`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <Icon className="w-4 h-4 text-ink" />
            <span className="text-sm font-medium text-ink">{badge.label}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
