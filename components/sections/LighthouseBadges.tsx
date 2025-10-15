'use client';

import { motion } from 'framer-motion';
import { Coffee, Sparkles, Zap, Heart } from 'lucide-react';

const floatingElements = [
  {
    icon: Coffee,
    text: '247+ cups of boba',
    subtext: 'consumed while coding',
    position: { top: '15%', right: '8%' },
    delay: 0,
    rotation: -6,
    drift: { x: [-10, 10, -10], y: [-15, 5, -15] },
  },
  {
    icon: Heart,
    text: 'zero calls needed',
    subtext: 'async workflow',
    position: { top: '18%', left: '8%' },
    delay: 0.3,
    rotation: 5,
    drift: { x: [10, -10, 10], y: [-10, 8, -10] },
  },
  {
    icon: Zap,
    text: '<1s load times',
    subtext: 'lightning fast',
    position: { bottom: '25%', right: '10%' },
    delay: 0.6,
    rotation: 4,
    drift: { x: [-8, 12, -8], y: [-12, 6, -12] },
  },
  {
    icon: Sparkles,
    text: '100/100 scores',
    subtext: 'every single time',
    position: { bottom: '28%', left: '10%' },
    delay: 0.9,
    rotation: -7,
    drift: { x: [12, -8, 12], y: [-8, 10, -8] },
  },
];

export default function LighthouseBadges() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block">
      {floatingElements.map((element, index) => {
        const Icon = element.icon;
        return (
          <motion.div
            key={element.text}
            className="absolute"
            style={element.position}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: element.drift.x,
            }}
            transition={{
              opacity: { duration: 0.6, delay: element.delay },
              scale: { duration: 0.6, delay: element.delay },
              y: { duration: 0.6, delay: element.delay },
              x: {
                duration: 8 + index * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            <motion.div
              className="bg-gradient-to-br from-white/95 via-milk-tea/80 to-taro/10 backdrop-blur-md rounded-3xl px-6 py-4 shadow-xl border border-taro/30"
              style={{ rotate: element.rotation }}
              whileHover={{
                scale: 1.08,
                rotate: 0,
                boxShadow: '0 25px 50px -12px rgba(167, 139, 250, 0.3)',
              }}
              animate={{
                y: element.drift.y,
                rotate: [
                  element.rotation,
                  element.rotation + 3,
                  element.rotation - 2,
                  element.rotation,
                ],
              }}
              transition={{
                y: {
                  duration: 6 + index * 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                rotate: {
                  duration: 10 + index * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-taro to-deep-taro flex items-center justify-center shadow-lg">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-ink leading-tight lowercase">
                    {element.text}
                  </div>
                  <div className="text-xs text-gray-600 lowercase">{element.subtext}</div>
                </div>
              </div>

              {/* Subtle liquid shine */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-taro/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
