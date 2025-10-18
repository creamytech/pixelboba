'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  gradient: string;
  delay?: number;
  suffix?: string;
  subtitle?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  gradient,
  delay = 0,
  suffix = '',
  subtitle,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative group"
    >
      {/* Card */}
      <div
        className={`
        relative overflow-hidden
        bg-white/70 backdrop-blur-sm
        border-2 border-brown-sugar/10
        rounded-3xl p-6
        shadow-sm hover:shadow-xl
        transition-all duration-300
      `}
      >
        {/* Background Gradient Decoration */}
        <div
          className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}
        />

        {/* Icon Circle */}
        <motion.div
          className={`
            w-14 h-14 rounded-2xl
            bg-gradient-to-br ${gradient}
            flex items-center justify-center
            shadow-lg mb-4
            relative z-10
          `}
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <p className="text-ink/60 font-body text-sm mb-2">{title}</p>

          <div className="flex items-end gap-2 mb-1">
            <motion.h3
              className="font-display font-bold text-4xl text-ink"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2, type: 'spring', damping: 10 }}
            >
              {value}
              {suffix && <span className="text-2xl text-ink/60 ml-1">{suffix}</span>}
            </motion.h3>
          </div>

          {/* Change Indicator or Subtitle */}
          {change ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.4 }}
              className={`
                inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                ${
                  change.type === 'increase'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }
              `}
            >
              <span>{change.type === 'increase' ? '↗' : '↘'}</span>
              <span>{Math.abs(change.value)}%</span>
            </motion.div>
          ) : subtitle ? (
            <p className="text-ink/50 text-xs font-body">{subtitle}</p>
          ) : null}
        </div>

        {/* Decorative Bubbles */}
        <motion.div
          className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-taro/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-8 right-8 w-2 h-2 rounded-full bg-brown-sugar/20"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
      </div>
    </motion.div>
  );
}
