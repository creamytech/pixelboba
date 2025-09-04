'use client';

import { motion } from 'framer-motion';

interface BobaLoaderProps {
  isVisible: boolean;
}

export default function BobaLoader({ isVisible }: BobaLoaderProps) {
  const pearls = [
    { id: 1, color: '#A78BFA', size: 20, delay: 0 },
    { id: 2, color: '#84CC16', size: 16, delay: 0.2 },
    { id: 3, color: '#D97706', size: 18, delay: 0.4 },
    { id: 4, color: '#F5E9DA', size: 14, delay: 0.6 },
    { id: 5, color: '#A78BFA', size: 22, delay: 0.8 },
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Main loading container */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Boba cup outline */}
          <div className="relative w-24 h-32 mb-4">
            {/* Cup */}
            <div className="absolute bottom-0 w-24 h-28 bg-white/20 backdrop-blur-sm border-2 border-taro/30 rounded-b-3xl rounded-t-lg">
              {/* Liquid */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brown-sugar/40 to-milk-tea/40 rounded-b-3xl"
                initial={{ height: '20%' }}
                animate={{ height: '70%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              />

              {/* Floating pearls inside cup */}
              {pearls.map((pearl) => (
                <motion.div
                  key={pearl.id}
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: pearl.color,
                    width: pearl.size,
                    height: pearl.size,
                    left: `${20 + pearl.id * 10}%`,
                    bottom: '10%',
                  }}
                  animate={{
                    y: [-5, -25, -5],
                    x: [-2, 2, -2],
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
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-taro/40 rounded-full" />
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-taro/60 rounded-full" />
          </div>

          {/* Loading text */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="font-display text-lg font-semibold text-ink mb-2">
              brewing something sweet...
            </h3>

            {/* Animated dots */}
            <div className="flex justify-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-taro rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Ambient floating pearls */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: pearls[i % pearls.length]?.color || '#A78BFA',
                left: `${Math.random() * 300}px`,
                top: `${Math.random() * 200}px`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.6, 0.2],
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
    </motion.div>
  );
}
