'use client';

import { motion } from 'framer-motion';

const marqueeText = [
  'Pixel Boba',
  '•',
  'Websites that Pop',
  '•',
  'Pixel Boba',
  '•',
  'Websites that Pop',
  '•',
];

export default function MarqueeSection() {
  return (
    <section className="py-16 bg-ink text-white overflow-hidden">
      <div className="relative">
        {/* Main marquee */}
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: '-50%' }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...Array(3)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex items-center">
              {marqueeText.map((text, index) => (
                <div key={`${groupIndex}-${index}`} className="flex items-center">
                  {text === '•' ? (
                    <div className="mx-8 w-3 h-3 bg-taro rounded-full" />
                  ) : (
                    <div className="font-display text-6xl md:text-8xl font-bold mx-8">{text}</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </motion.div>

        {/* Pearl animations */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-taro/60 rounded-full"
              style={{
                left: `${10 + i * 15}%`,
                top: '50%',
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
