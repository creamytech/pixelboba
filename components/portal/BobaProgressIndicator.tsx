'use client';

import { motion } from 'framer-motion';
import { BobaProgressProps, ProjectStatus } from '@/types/portal';

const statusConfig = {
  DISCOVERY: { color: '#A78BFA', label: 'discovering ideas', phase: 'discovery' },
  WIREFRAMING: { color: '#84CC16', label: 'wireframing structure', phase: 'wireframes' },
  DESIGN: { color: '#A78BFA', label: 'designing visuals', phase: 'design' },
  DEVELOPMENT: { color: '#7C3AED', label: 'brewing code', phase: 'development' },
  TESTING: { color: '#8B5E3C', label: 'taste testing', phase: 'testing' },
  LAUNCH: { color: '#84CC16', label: 'serving fresh', phase: 'launch' },
  MAINTENANCE: { color: '#A78BFA', label: 'keeping it fresh', phase: 'maintenance' },
  COMPLETED: { color: '#84CC16', label: 'perfectly brewed', phase: 'complete' },
  PAUSED: { color: '#8B5E3C', label: 'on ice', phase: 'paused' },
  CANCELLED: { color: '#8B5E3C', label: 'cancelled', phase: 'cancelled' },
};

export default function BobaProgressIndicator({
  progress,
  status,
  size = 'medium',
  showDetails = true,
}: BobaProgressProps) {
  const config = statusConfig[status];

  const sizeConfig = {
    small: { container: 'w-24 h-24', text: 'text-sm', details: 'text-xs' },
    medium: { container: 'w-32 h-32', text: 'text-base', details: 'text-sm' },
    large: { container: 'w-40 h-40', text: 'text-lg', details: 'text-base' },
  };

  const { container, text, details } = sizeConfig[size];

  // Create floating pearls based on progress
  const pearlCount = Math.floor((progress / 100) * 8) + 1;
  const pearls = Array.from({ length: pearlCount }, (_, i) => ({
    id: i,
    delay: i * 0.2,
    size: 4 + (i % 3),
    color:
      i % 4 === 0 ? '#F5E9DA' : i % 4 === 1 ? '#8B5E3C' : i % 4 === 2 ? config.color : '#A78BFA',
  }));

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Modern Circular Progress */}
      <motion.div
        className={`relative ${container} flex items-center justify-center`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'backOut' }}
      >
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-milk-tea/60 to-milk-tea/30 backdrop-blur-sm border border-brown-sugar/20 shadow-lg"></div>

        {/* Progress Ring */}
        <svg className="absolute inset-2 w-auto h-auto transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Ring */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(139, 94, 60, 0.15)"
            strokeWidth="6"
          />
          {/* Progress Ring */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={config.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - progress / 100) }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
          />
        </svg>

        {/* Center Content */}
        <div className="relative z-10 text-center">
          <motion.div
            className={`font-bold ${text} text-ink mb-1`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {progress}%
          </motion.div>
          <div className={`${details} text-ink/60 font-medium lowercase`}>{config.label}</div>
        </div>

        {/* Floating Pearls Around Circle */}
        {pearls.map((pearl, index) => {
          const angle = (index / pearls.length) * 2 * Math.PI + (progress / 100) * Math.PI * 0.5;
          const radius = size === 'small' ? 35 : size === 'medium' ? 45 : 55;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={pearl.id}
              className="absolute rounded-full shadow-sm"
              style={{
                backgroundColor: pearl.color,
                width: pearl.size,
                height: pearl.size,
                left: '50%',
                top: '50%',
                marginLeft: x,
                marginTop: y,
                boxShadow: `0 2px 8px rgba(0,0,0,0.15), inset 0 1px 3px rgba(255,255,255,0.3)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.9, 0.6],
                y: [-2, -6, -2],
              }}
              transition={{
                scale: { duration: 0.6, delay: pearl.delay },
                opacity: { duration: 4, repeat: Infinity, delay: pearl.delay },
                y: { duration: 3, repeat: Infinity, delay: pearl.delay, ease: 'easeInOut' },
              }}
            />
          );
        })}

        {/* Subtle Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle at center, ${config.color}20, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Enhanced Progress Details */}
      {showDetails && (
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Status Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full border border-brown-sugar/20 shadow-sm"
            style={{
              backgroundColor: `${config.color}15`,
              color: config.color,
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: config.color }} />
            <span className="font-medium text-sm lowercase">{config.phase}</span>
          </motion.div>

          {/* Modern Progress Bar */}
          <div className="w-48 bg-milk-tea/40 rounded-full h-2 overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full shadow-sm"
              style={{
                background: `linear-gradient(90deg, ${config.color}, ${config.color}80, ${config.color}60)`,
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: `${progress}%`, opacity: 1 }}
              transition={{ duration: 2, delay: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
