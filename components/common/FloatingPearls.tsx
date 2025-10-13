'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Pearl {
  id: number;
  size: number;
  color: string;
  startX: number;
  startY: number;
  floatSpeed: number;
  parallaxSpeed: number;
}

export default function FloatingPearls() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate unique pearls
  const pearls: Pearl[] = [
    {
      id: 1,
      size: 80,
      color: 'bg-taro/10',
      startX: 10,
      startY: 20,
      floatSpeed: 8,
      parallaxSpeed: 0.3,
    },
    {
      id: 2,
      size: 120,
      color: 'bg-matcha/8',
      startX: 85,
      startY: 40,
      floatSpeed: 12,
      parallaxSpeed: 0.5,
    },
    {
      id: 3,
      size: 60,
      color: 'bg-milk-tea/20',
      startX: 70,
      startY: 15,
      floatSpeed: 10,
      parallaxSpeed: 0.4,
    },
    {
      id: 4,
      size: 100,
      color: 'bg-taro/6',
      startX: 25,
      startY: 60,
      floatSpeed: 15,
      parallaxSpeed: 0.6,
    },
    {
      id: 5,
      size: 40,
      color: 'bg-matcha/15',
      startX: 50,
      startY: 80,
      floatSpeed: 7,
      parallaxSpeed: 0.2,
    },
  ];

  // Create all transforms at the top level to comply with React Hooks rules
  const y1 = useTransform(scrollY, [0, 1000], [0, pearls[0].parallaxSpeed * 1000]);
  const y2 = useTransform(scrollY, [0, 1000], [0, pearls[1].parallaxSpeed * 1000]);
  const y3 = useTransform(scrollY, [0, 1000], [0, pearls[2].parallaxSpeed * 1000]);
  const y4 = useTransform(scrollY, [0, 1000], [0, pearls[3].parallaxSpeed * 1000]);
  const y5 = useTransform(scrollY, [0, 1000], [0, pearls[4].parallaxSpeed * 1000]);

  const yTransforms = [y1, y2, y3, y4, y5];

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pearls.map((pearl, index) => {
        return (
          <motion.div
            key={pearl.id}
            className={`absolute rounded-full ${pearl.color} blur-2xl`}
            style={{
              width: pearl.size,
              height: pearl.size,
              left: `${pearl.startX}%`,
              top: `${pearl.startY}%`,
              y: yTransforms[index],
            }}
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: pearl.floatSpeed,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}
