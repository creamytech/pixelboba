'use client';

import { motion } from 'framer-motion';

const pearls = [
  { id: 1, x: '10%', y: '20%', size: 60, color: '#A78BFA', duration: 8 },
  { id: 2, x: '85%', y: '15%', size: 45, color: '#8B5E3C', duration: 10 },
  { id: 3, x: '15%', y: '70%', size: 70, color: '#84CC16', duration: 12 },
  { id: 4, x: '90%', y: '65%', size: 35, color: '#F5E9DA', duration: 9 },
  { id: 5, x: '50%', y: '10%', size: 50, color: '#A78BFA', duration: 11 },
  { id: 6, x: '20%', y: '45%', size: 40, color: '#8B5E3C', duration: 13 },
  { id: 7, x: '80%', y: '85%', size: 55, color: '#84CC16', duration: 10 },
  { id: 8, x: '60%', y: '90%', size: 30, color: '#F5E9DA', duration: 14 },
];

export default function FloatingPearls() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pearls.map((pearl) => (
        <motion.div
          key={pearl.id}
          className="absolute rounded-full"
          style={{
            left: pearl.x,
            top: pearl.y,
            width: pearl.size,
            height: pearl.size,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${pearl.color})`,
            boxShadow: `0 4px 20px rgba(0,0,0,0.1), inset 0 2px 10px rgba(255,255,255,0.3)`,
          }}
          initial={{ y: 0, opacity: 0.6 }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: pearl.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
