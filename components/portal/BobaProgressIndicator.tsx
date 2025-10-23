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
    small: { cupWidth: 60, cupHeight: 80, text: 'text-xs', details: 'text-xs' },
    medium: { cupWidth: 80, cupHeight: 100, text: 'text-sm', details: 'text-xs' },
    large: { cupWidth: 96, cupHeight: 128, text: 'text-base', details: 'text-sm' },
  };

  const { cupWidth, cupHeight, text, details } = sizeConfig[size];

  // Calculate liquid height based on progress (20% minimum, 80% maximum)
  const liquidHeight = Math.max(20, Math.min(80, 20 + (progress / 100) * 60));

  // Create boba pearls based on progress
  const maxPearls = 5;
  const pearlCount = Math.max(1, Math.floor((progress / 100) * maxPearls));
  const pearls = Array.from({ length: pearlCount }, (_, i) => ({
    id: i,
    color: i % 2 === 0 ? config.color : '#8B5E3C',
    size: 12 + Math.random() * 6,
    delay: i * 0.3,
  }));

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Boba Cup Container - Similar to BobaLoader */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Cup */}
        <div className="relative" style={{ width: cupWidth, height: cupHeight }}>
          <div
            className="absolute bottom-0 bg-white border-3 border-ink rounded-b-3xl rounded-t-lg shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]"
            style={{ width: cupWidth, height: cupHeight - 16 }}
          >
            {/* Liquid */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-b-3xl"
              style={{
                background: `linear-gradient(180deg, ${config.color}40, ${config.color}60, ${config.color}80)`,
                height: `${liquidHeight}%`,
              }}
              initial={{ height: '20%' }}
              animate={{ height: `${liquidHeight}%` }}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
              }}
            />

            {/* Floating pearls inside cup */}
            {pearls.map((pearl, index) => (
              <motion.div
                key={pearl.id}
                className="absolute rounded-full"
                style={{
                  backgroundColor: pearl.color,
                  width: pearl.size,
                  height: pearl.size,
                  left: `${15 + index * 15}%`,
                  bottom: '10%',
                }}
                animate={{
                  y: [-3, -15, -3],
                  x: [-1, 1, -1],
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2 + pearl.delay,
                  repeat: Infinity,
                  delay: pearl.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Straw */}
          <div
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 bg-taro/40 rounded-full"
            style={{ height: cupHeight / 2 }}
          />
          <div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 bg-taro/60 rounded-full"
            style={{ height: cupHeight / 4 }}
          />
        </div>

        {/* Progress Percentage */}
        <motion.div
          className={`mt-3 ${text} font-black text-ink bg-matcha px-4 py-2 rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] uppercase`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {progress}%
        </motion.div>
      </motion.div>

      {/* Progress Details */}
      {showDetails && (
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          {/* Status Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
            style={{
              backgroundColor: config.color,
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-2 h-2 rounded-full mr-2 bg-ink" />
            <span className="font-black text-sm uppercase text-ink">{config.phase}</span>
          </motion.div>

          {/* Flavor Description */}
          <div className={`${details} text-ink/60 font-bold uppercase max-w-48 mx-auto`}>
            {config.label}
          </div>
        </motion.div>
      )}

      {/* Ambient floating pearls - similar to BobaLoader */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: config.color,
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
              opacity: 0.3,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
