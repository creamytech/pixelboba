'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface BobaLoaderProps {
  isVisible: boolean;
}

export default function BobaLoader({ isVisible }: BobaLoaderProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-cream z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center">
        {/* Animated bouncing cat with bold Pomegranate styling */}
        <motion.div
          className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1, 0.95, 1],
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
        >
          {/* Background blob with hard shadow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-taro to-deep-taro rounded-full border-4 sm:border-[5px] border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] sm:shadow-[12px_12px_0px_0px_rgba(58,0,29,1)]"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Cat image */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Image
              src="/01.svg"
              alt="Loading..."
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Loading text with dots */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-2xl sm:text-3xl font-black text-ink mb-3">
            Brewing Something Special
          </h2>

          {/* Animated dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 sm:w-4 sm:h-4 bg-matcha rounded-full border-2 border-ink"
                animate={{
                  scale: [1, 1.3, 1],
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Decorative boba pearls floating around */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 sm:w-6 sm:h-6 bg-ink rounded-full border-2 border-cream opacity-20"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
