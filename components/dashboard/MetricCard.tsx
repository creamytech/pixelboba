'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cardStyles } from '@/lib/pomegranate-design';

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
      transition={{ duration: 0.4, delay }}
      className="relative group"
    >
      {/* Card with Pomegranate styling */}
      <div
        className={`
        relative overflow-hidden
        bg-white rounded-xl
        border-4 border-ink
        shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]
        hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]
        hover:translate-x-[-2px] hover:translate-y-[-2px]
        transition-all duration-300
        p-6
      `}
      >
        {/* Icon Circle with bold border */}
        <motion.div
          className={`
            w-16 h-16 rounded-full
            bg-gradient-to-br ${gradient}
            border-3 border-ink
            flex items-center justify-center
            shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]
            mb-4
          `}
          whileHover={{ rotate: 5, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
        </motion.div>

        {/* Content */}
        <div>
          <p className="text-ink/60 font-bold text-sm mb-2 uppercase tracking-wide">{title}</p>

          <div className="flex items-end gap-2 mb-2">
            <motion.h3
              className="font-display font-black text-4xl text-ink"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: delay + 0.2, type: 'spring', stiffness: 200 }}
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
              transition={{ duration: 0.3, delay: delay + 0.3 }}
              className={`
                inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                font-black text-xs uppercase border-2 border-ink
                ${change.type === 'increase' ? 'bg-matcha text-ink' : 'bg-strawberry text-white'}
              `}
            >
              <span>{change.type === 'increase' ? '↗' : '↘'}</span>
              <span>{Math.abs(change.value)}%</span>
            </motion.div>
          ) : subtitle ? (
            <p className="text-ink/60 text-sm font-bold">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
