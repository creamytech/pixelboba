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
    small: { cup: 'w-20 h-24', pearl: 3, text: 'text-sm', container: 'p-3' },
    medium: { cup: 'w-28 h-36', pearl: 4, text: 'text-base', container: 'p-4' },
    large: { cup: 'w-36 h-44', pearl: 5, text: 'text-lg', container: 'p-6' },
  };

  const { cup, pearl, text, container } = sizeConfig[size];
  const liquidHeight = Math.max(15, (progress / 100) * 75);

  // Cleaner pearl arrangement - fixed positions instead of random
  const pearlPositions = [
    { x: 25, y: 15 },
    { x: 50, y: 25 },
    { x: 75, y: 18 },
    { x: 35, y: 35 },
    { x: 65, y: 40 },
    { x: 40, y: 55 },
    { x: 60, y: 60 },
    { x: 45, y: 70 },
  ];

  const visiblePearlCount = Math.min(Math.floor((progress / 100) * 6) + 2, 8);
  const visiblePearls = pearlPositions.slice(0, visiblePearlCount);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Cleaner Boba Cup Design */}
      <motion.div
        className={`relative ${cup} ${container}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
      >
        {/* Cup Container with better styling */}
        <div className="relative w-full h-full bg-gradient-to-b from-milk-tea/40 to-milk-tea/60 backdrop-blur-sm border-2 border-brown-sugar/30 rounded-t-lg rounded-b-3xl overflow-hidden shadow-lg">
          {/* Liquid with smoother gradient */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-b-3xl"
            style={{
              background: `linear-gradient(to top, ${config.color}, ${config.color}80, ${config.color}40)`,
            }}
            initial={{ height: '10%' }}
            animate={{ height: `${liquidHeight}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Cleaner, positioned pearls */}
          {visiblePearls.map((pearlPos, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full shadow-sm"
              style={{
                backgroundColor:
                  index % 3 === 0 ? '#F5E9DA' : index % 3 === 1 ? '#8B5E3C' : config.color,
                width: pearl + (index % 2),
                height: pearl + (index % 2),
                left: `${pearlPos.x}%`,
                bottom: `${Math.min(pearlPos.y, liquidHeight - 8)}%`,
                border: '1px solid rgba(139, 94, 60, 0.2)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: [0.7, 0.9, 0.7],
                y: [-1, -3, -1],
              }}
              transition={{
                scale: { duration: 0.4, delay: index * 0.1 },
                opacity: { duration: 3, repeat: Infinity, delay: index * 0.2 },
                y: { duration: 2.5, repeat: Infinity, delay: index * 0.3, ease: 'easeInOut' },
              }}
            />
          ))}

          {/* Subtle foam/bubble effect at top */}
          <motion.div
            className="absolute top-2 left-2 right-2 h-3 bg-white/20 rounded-lg blur-sm"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Better straw design */}
        <motion.div
          className="absolute -top-3 left-1/2 transform -translate-x-1/2"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div
            className="rounded-full"
            style={{
              backgroundColor: '#8B5E3C',
              width: '3px',
              height: size === 'small' ? '16px' : size === 'medium' ? '20px' : '24px',
            }}
          />
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-brown-sugar/80" />
        </motion.div>
      </motion.div>

      {/* Cleaner Progress Details */}
      {showDetails && (
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="space-y-1">
            <motion.div
              className={`font-display font-bold ${text}`}
              style={{ color: config.color }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {progress}% complete
            </motion.div>
            <div
              className={`text-ink/70 font-display font-medium ${size === 'small' ? 'text-xs' : 'text-sm'} lowercase`}
            >
              {config.label}
            </div>
          </div>

          {/* Prettier Progress Bar */}
          <div className="w-32 h-2 bg-milk-tea/30 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full shadow-sm"
              style={{
                background: `linear-gradient(90deg, ${config.color}, ${config.color}80)`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
