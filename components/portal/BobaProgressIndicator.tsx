'use client';

import { motion } from 'framer-motion';
import { BobaProgressProps, ProjectStatus } from '@/types/portal';

const statusConfig = {
  DISCOVERY: { color: '#D97706', label: 'discovering ideas', phase: 'discovery' },
  WIREFRAMING: { color: '#84CC16', label: 'wireframing structure', phase: 'wireframes' },
  DESIGN: { color: '#A78BFA', label: 'designing visuals', phase: 'design' },
  DEVELOPMENT: { color: '#06B6D4', label: 'brewing code', phase: 'development' },
  TESTING: { color: '#F59E0B', label: 'taste testing', phase: 'testing' },
  LAUNCH: { color: '#10B981', label: 'serving fresh', phase: 'launch' },
  MAINTENANCE: { color: '#6B7280', label: 'keeping it fresh', phase: 'maintenance' },
  COMPLETED: { color: '#10B981', label: 'perfectly brewed', phase: 'complete' },
  PAUSED: { color: '#6B7280', label: 'on ice', phase: 'paused' },
  CANCELLED: { color: '#EF4444', label: 'cancelled', phase: 'cancelled' },
};

export default function BobaProgressIndicator({
  progress,
  status,
  size = 'medium',
  showDetails = true,
}: BobaProgressProps) {
  const config = statusConfig[status];

  const sizeConfig = {
    small: { cup: 'w-16 h-20', pearl: 4, text: 'text-sm' },
    medium: { cup: 'w-24 h-32', pearl: 6, text: 'text-base' },
    large: { cup: 'w-32 h-40', pearl: 8, text: 'text-lg' },
  };

  const { cup, pearl, text } = sizeConfig[size];
  const liquidHeight = Math.max(20, (progress / 100) * 70); // Min 20% for visual appeal

  // Generate pearls based on progress
  const pearlCount = Math.floor((progress / 100) * 8) + 2;
  const pearls = Array.from({ length: pearlCount }, (_, i) => ({
    id: i,
    x: 20 + (i % 3) * 20 + Math.random() * 10,
    y: 80 - i * 8 - Math.random() * 10,
    size: pearl + Math.random() * 2,
    delay: i * 0.1,
  }));

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Boba Cup */}
      <div className={`relative ${cup}`}>
        {/* Cup Container */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm border-2 border-ink/20 rounded-b-3xl rounded-t-lg overflow-hidden">
          {/* Liquid */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-b-3xl"
            style={{
              background: `linear-gradient(to top, ${config.color}40, ${config.color}20)`,
            }}
            initial={{ height: '20%' }}
            animate={{ height: `${liquidHeight}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Floating Pearls */}
          {pearls.map((pearl, index) => (
            <motion.div
              key={pearl.id}
              className="absolute rounded-full"
              style={{
                backgroundColor: index % 2 === 0 ? config.color : `${config.color}80`,
                width: pearl.size,
                height: pearl.size,
                left: `${pearl.x}%`,
                bottom: `${Math.min(pearl.y, liquidHeight - 5)}%`,
              }}
              animate={{
                y: [-2, -8, -2],
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
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
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 rounded-full"
          style={{
            backgroundColor: `${config.color}60`,
            height: size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px',
          }}
        />
        <div
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 rounded-full"
          style={{
            backgroundColor: config.color,
            width: '2px',
            height: size === 'small' ? '8px' : size === 'medium' ? '10px' : '12px',
          }}
        />
      </div>

      {/* Progress Details */}
      {showDetails && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className={`font-display font-semibold ${text}`} style={{ color: config.color }}>
            {progress}% complete
          </div>
          <div className={`text-ink/70 ${size === 'small' ? 'text-xs' : 'text-sm'} mt-1`}>
            {config.label}
          </div>

          {/* Progress Bar */}
          <div className="w-24 h-2 bg-ink/10 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: config.color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
