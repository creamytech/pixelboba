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
    small: { cupHeight: 120, cupWidth: 80, text: 'text-xs', details: 'text-xs' },
    medium: { cupHeight: 150, cupWidth: 100, text: 'text-sm', details: 'text-xs' },
    large: { cupHeight: 180, cupWidth: 120, text: 'text-base', details: 'text-sm' },
  };

  const { cupHeight, cupWidth, text, details } = sizeConfig[size];

  // Calculate liquid height based on progress
  const liquidHeight = (progress / 100) * (cupHeight * 0.7);

  // Create boba pearls based on progress
  const maxPearls = 12;
  const pearlCount = Math.floor((progress / 100) * maxPearls);
  const pearls = Array.from({ length: pearlCount }, (_, i) => ({
    id: i,
    x: 20 + Math.random() * (cupWidth - 40),
    y: cupHeight - 30 - i * (liquidHeight / pearlCount),
    size: 8 + Math.random() * 4,
    delay: i * 0.1,
    color: i % 3 === 0 ? '#8B5E3C' : i % 3 === 1 ? '#A78BFA' : '#7C3AED',
  }));

  // Bubble effects for the liquid
  const bubbles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: 25 + Math.random() * (cupWidth - 50),
    y: cupHeight - liquidHeight + 10 + Math.random() * (liquidHeight - 20),
    size: 3 + Math.random() * 3,
    delay: i * 0.3,
  }));

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Boba Cup Container */}
      <motion.div
        className="relative"
        style={{ width: cupWidth + 20, height: cupHeight + 40 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'backOut' }}
      >
        {/* Cup Shadow */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-brown-sugar/20 rounded-full blur-sm"
          style={{ width: cupWidth * 0.8, height: 12 }}
        />

        {/* Main Cup */}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 rounded-b-3xl rounded-t-lg overflow-hidden border-2 border-brown-sugar/30"
          style={{
            width: cupWidth,
            height: cupHeight,
            background:
              'linear-gradient(180deg, rgba(245, 233, 218, 0.9), rgba(245, 233, 218, 0.7))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 2px 8px rgba(255,255,255,0.2)',
          }}
          initial={{ height: 0 }}
          animate={{ height: cupHeight }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Liquid */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-b-3xl"
            style={{
              background: `linear-gradient(180deg, ${config.color}60, ${config.color}80, ${config.color})`,
              boxShadow: `inset 0 4px 8px ${config.color}40`,
            }}
            initial={{ height: 0 }}
            animate={{ height: liquidHeight }}
            transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
          >
            {/* Liquid Surface Shimmer */}
            <motion.div
              className="absolute top-0 left-2 right-2 h-1 rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
              }}
              animate={{ x: [-20, cupWidth + 20] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Liquid Bubbles */}
            {bubbles.map((bubble) => (
              <motion.div
                key={bubble.id}
                className="absolute rounded-full"
                style={{
                  left: bubble.x,
                  bottom: bubble.y,
                  width: bubble.size,
                  height: bubble.size,
                  background: 'rgba(255,255,255,0.3)',
                  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5)',
                }}
                animate={{
                  y: [-5, -15, -5],
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + bubble.id * 0.5,
                  repeat: Infinity,
                  delay: bubble.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

          {/* Boba Pearls */}
          {pearls.map((pearl) => (
            <motion.div
              key={pearl.id}
              className="absolute rounded-full"
              style={{
                left: pearl.x,
                bottom: Math.max(5, pearl.y),
                width: pearl.size,
                height: pearl.size,
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), ${pearl.color})`,
                boxShadow: `0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
                y: [0, -2, 0],
              }}
              transition={{
                scale: { duration: 0.8, delay: pearl.delay },
                opacity: { duration: 2 + pearl.id * 0.2, repeat: Infinity, delay: pearl.delay },
                y: { duration: 4, repeat: Infinity, delay: pearl.delay, ease: 'easeInOut' },
              }}
            />
          ))}

          {/* Cup Highlight */}
          <div
            className="absolute top-4 left-2 w-3 h-8 rounded-full bg-white/20"
            style={{ filter: 'blur(1px)' }}
          />
        </motion.div>

        {/* Straw */}
        <motion.div
          className="absolute top-0 right-4 w-2 bg-gradient-to-b from-taro to-deep-taro rounded-full shadow-sm"
          style={{ height: cupHeight + 20 }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: cupHeight + 20, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {/* Straw bend */}
          <div className="absolute -top-1 -right-3 w-6 h-4 border-2 border-taro rounded-full border-b-transparent border-l-transparent transform rotate-45" />
          {/* Straw highlight */}
          <div className="absolute top-0 left-0.5 w-0.5 h-full bg-white/30 rounded-full" />
        </motion.div>

        {/* Progress Percentage */}
        <motion.div
          className={`absolute top-2 left-1/2 transform -translate-x-1/2 ${text} font-bold text-ink bg-milk-tea/80 px-3 py-1 rounded-full border border-brown-sugar/20 shadow-sm`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          {progress}%
        </motion.div>
      </motion.div>

      {/* Progress Details */}
      {showDetails && (
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
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

          {/* Flavor Description */}
          <div className={`${details} text-ink/60 font-medium lowercase max-w-48 mx-auto`}>
            {config.label}
          </div>
        </motion.div>
      )}
    </div>
  );
}
