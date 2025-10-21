'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animated boba cup */}
        <div className="relative w-32 h-40 mx-auto mb-8">
          {/* Cup */}
          <motion.div
            className="absolute inset-0 bg-white rounded-3xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)]"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Filling animation */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#7C3AED] to-[#A78BFA] rounded-b-[20px]"
              initial={{ height: '0%' }}
              animate={{ height: ['0%', '80%', '0%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Boba pearls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-ink rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Straw */}
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-16 bg-matcha border-2 border-ink rounded-full"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
        </div>

        {/* Loading text */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-black text-ink mb-2 lowercase">brewing your portal...</h2>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#7C3AED] rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
