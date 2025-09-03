'use client';

import { useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface PearlData {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

export default function PearlField({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const mouseSpringX = useSpring(mouseX, springConfig);
  const mouseSpringY = useSpring(mouseY, springConfig);

  const pearls: PearlData[] = [
    { id: 1, x: 15, y: 30, size: 60, color: '#A78BFA', delay: 0 },
    { id: 2, x: 75, y: 20, size: 45, color: '#8B5E3C', delay: 0.2 },
    { id: 3, x: 45, y: 65, size: 70, color: '#84CC16', delay: 0.4 },
    { id: 4, x: 25, y: 75, size: 35, color: '#F5E9DA', delay: 0.6 },
    { id: 5, x: 85, y: 55, size: 50, color: '#A78BFA', delay: 0.8 },
    { id: 6, x: 10, y: 85, size: 40, color: '#8B5E3C', delay: 1.0 },
    { id: 7, x: 65, y: 80, size: 55, color: '#84CC16', delay: 1.2 },
    { id: 8, x: 90, y: 25, size: 30, color: '#F5E9DA', delay: 1.4 },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      mouseX.set(x * 30);
      mouseY.set(y * 30);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className || ''}`}>
      {pearls.map((pearl) => (
        <motion.div
          key={pearl.id}
          className="absolute rounded-full"
          style={{
            left: `${pearl.x}%`,
            top: `${pearl.y}%`,
            width: pearl.size,
            height: pearl.size,
            backgroundColor: pearl.color,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${pearl.color})`,
            boxShadow: `0 4px 20px rgba(0,0,0,0.1), inset 0 2px 10px rgba(255,255,255,0.3)`,
            x: mouseSpringX,
            y: mouseSpringY,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: [0, -10, 0],
          }}
          transition={{
            scale: { delay: pearl.delay, duration: 0.6, ease: 'backOut' },
            opacity: { delay: pearl.delay, duration: 0.6 },
            y: {
              repeat: Infinity,
              duration: 3 + pearl.id * 0.2,
              ease: 'easeInOut',
              delay: pearl.delay,
            },
          }}
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.2 },
          }}
        />
      ))}

      {/* Ambient glow overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-taro/20 via-transparent to-transparent" />
    </div>
  );
}
