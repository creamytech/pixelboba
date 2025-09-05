'use client';

import { useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface DashboardPearlData {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  delay: number;
}

export default function DashboardPearlField({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 300 };
  const mouseSpringX = useSpring(mouseX, springConfig);
  const mouseSpringY = useSpring(mouseY, springConfig);

  // More subtle pearls for dashboard backgrounds
  const pearls: DashboardPearlData[] = [
    { id: 1, x: 10, y: 20, size: 40, color: '#A78BFA', opacity: 0.15, delay: 0 },
    { id: 2, x: 85, y: 15, size: 30, color: '#8B5E3C', opacity: 0.12, delay: 0.3 },
    { id: 3, x: 25, y: 70, size: 45, color: '#F5E9DA', opacity: 0.18, delay: 0.6 },
    { id: 4, x: 70, y: 60, size: 35, color: '#84CC16', opacity: 0.1, delay: 0.9 },
    { id: 5, x: 5, y: 85, size: 25, color: '#A78BFA', opacity: 0.08, delay: 1.2 },
    { id: 6, x: 90, y: 80, size: 38, color: '#8B5E3C', opacity: 0.14, delay: 1.5 },
    { id: 7, x: 45, y: 25, size: 28, color: '#F5E9DA', opacity: 0.11, delay: 1.8 },
    { id: 8, x: 60, y: 85, size: 32, color: '#84CC16', opacity: 0.13, delay: 2.1 },
    { id: 9, x: 15, y: 50, size: 22, color: '#A78BFA', opacity: 0.09, delay: 2.4 },
    { id: 10, x: 80, y: 35, size: 26, color: '#8B5E3C', opacity: 0.16, delay: 2.7 },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      // Much more subtle movement for dashboard
      mouseX.set(x * 10);
      mouseY.set(y * 10);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className || ''}`}
    >
      {pearls.map((pearl) => (
        <motion.div
          key={pearl.id}
          className="absolute rounded-full blur-sm"
          style={{
            left: `${pearl.x}%`,
            top: `${pearl.y}%`,
            width: pearl.size,
            height: pearl.size,
            backgroundColor: pearl.color,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${pearl.opacity * 2}), ${pearl.color})`,
            boxShadow: `0 2px 10px rgba(0,0,0,0.05)`,
            opacity: pearl.opacity,
            x: mouseSpringX,
            y: mouseSpringY,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: pearl.opacity,
            y: [0, -5, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            scale: { delay: pearl.delay, duration: 1.2, ease: 'backOut' },
            opacity: { delay: pearl.delay, duration: 1.2 },
            y: {
              repeat: Infinity,
              duration: 8 + pearl.id * 0.5,
              ease: 'easeInOut',
              delay: pearl.delay,
            },
            rotate: {
              repeat: Infinity,
              duration: 12 + pearl.id * 0.3,
              ease: 'easeInOut',
              delay: pearl.delay + 1,
            },
          }}
        />
      ))}

      {/* Very subtle ambient glow overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-taro/5 via-transparent to-transparent opacity-30" />

      {/* Additional floating gradient orbs for depth */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.08), transparent)',
          x: mouseSpringX,
          y: mouseSpringY,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(139, 94, 60, 0.08), transparent)',
          x: mouseSpringX,
          y: mouseSpringY,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  );
}
