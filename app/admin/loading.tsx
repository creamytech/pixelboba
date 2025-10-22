'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animated boba cup with enhanced Pomegranate styling */}
        <div className="relative w-32 h-40 sm:w-36 sm:h-44 mx-auto mb-8">
          {/* Cup */}
          <motion.div
            className="absolute inset-0 bg-white rounded-3xl border-4 sm:border-[5px] border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] sm:shadow-[10px_10px_0px_0px_rgba(58,0,29,1)]"
            initial={{ scale: 0.9, rotate: -5 }}
            animate={{
              scale: [0.9, 1, 0.98, 1],
              rotate: [-5, 0, 2, 0],
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Filling animation */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep-taro to-taro rounded-b-[20px]"
              initial={{ height: '0%' }}
              animate={{ height: ['0%', '75%', '0%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Boba pearls with borders */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 sm:w-4 sm:h-4 bg-ink rounded-full border-2 border-cream"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Straw with enhanced styling */}
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 sm:w-3 h-16 sm:h-20 bg-matcha border-2 sm:border-3 border-ink rounded-full shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          />
        </div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-2xl sm:text-3xl font-black text-ink mb-3">
            Brewing Your Admin Panel
          </h2>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 sm:w-4 sm:h-4 bg-deep-taro rounded-full border-2 border-ink"
                animate={{
                  scale: [1, 1.3, 1],
                  y: [0, -6, 0],
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
      </div>
    </div>
  );
}
