'use client';

import { motion } from 'framer-motion';

interface BrewStrengthProps {
  strength: number; // 1-5
  label?: string;
}

export default function BrewStrength({ strength, label }: BrewStrengthProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <motion.div
            key={level}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: level * 0.1 }}
            className="relative"
          >
            <svg
              width="20"
              height="24"
              viewBox="0 0 20 24"
              fill="none"
              className={`${level <= strength ? 'opacity-100' : 'opacity-20'}`}
            >
              {/* Boba cup icon */}
              <path
                d="M6 4L5 2H15L14 4M4 6H16C16.5523 6 17 6.44772 17 7V19C17 20.6569 15.6569 22 14 22H6C4.34315 22 3 20.6569 3 19V7C3 6.44772 3.44772 6 4 6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={level <= strength ? 'currentColor' : 'none'}
                className={level <= strength ? 'text-taro' : 'text-gray-300'}
              />
              {/* Boba pearls */}
              {level <= strength && (
                <>
                  <motion.circle
                    cx="7"
                    cy="16"
                    r="1.5"
                    fill="white"
                    animate={{ y: [0, -2, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: level * 0.2,
                    }}
                  />
                  <motion.circle
                    cx="10"
                    cy="18"
                    r="1.5"
                    fill="white"
                    animate={{ y: [0, -2, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: level * 0.2 + 0.3,
                    }}
                  />
                  <motion.circle
                    cx="13"
                    cy="16"
                    r="1.5"
                    fill="white"
                    animate={{ y: [0, -2, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: level * 0.2 + 0.6,
                    }}
                  />
                </>
              )}
            </svg>
          </motion.div>
        ))}
      </div>
      {label && <span className="text-sm font-semibold text-gray-600 lowercase">{label}</span>}
    </div>
  );
}
