'use client';

import { motion } from 'framer-motion';
import { Coffee, Sparkles, Zap, Heart } from 'lucide-react';

const floatingElements = [
  {
    icon: Coffee,
    text: '247+ cups of boba',
    subtext: 'consumed while coding',
    position: { top: '15%', right: '5%' },
    delay: 0.8,
    rotation: -8,
  },
  {
    icon: Zap,
    text: '<1s load times',
    subtext: 'lightning fast',
    position: { top: '40%', right: '3%' },
    delay: 1,
    rotation: 5,
  },
  {
    icon: Sparkles,
    text: '100/100 scores',
    subtext: 'every single time',
    position: { top: '65%', right: '5%' },
    delay: 1.2,
    rotation: -5,
  },
  {
    icon: Heart,
    text: 'zero calls needed',
    subtext: 'async workflow',
    position: { bottom: '15%', left: '5%' },
    delay: 1.4,
    rotation: 8,
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
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: element.delay,
              type: 'spring',
              stiffness: 150,
              damping: 15,
            }}
          >
            <motion.div
              className="bg-gradient-to-br from-milk-tea/90 via-white/95 to-taro/20 backdrop-blur-xl rounded-3xl px-6 py-4 shadow-2xl border-2 border-taro/20"
              style={{ rotate: element.rotation }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              animate={{
                y: [0, -15, 0],
                rotate: [element.rotation, element.rotation + 2, element.rotation],
              }}
              transition={{
                y: {
                  duration: 4 + index * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                rotate: {
                  duration: 5 + index * 0.5,
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

              {/* Subtle glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-taro/5 to-matcha/5 blur-2xl -z-10"></div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
