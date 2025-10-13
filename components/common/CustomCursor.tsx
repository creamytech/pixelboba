'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    // Detect hover state for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => setIsHovering(true));
      el.addEventListener('mouseleave', () => setIsHovering(false));
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', () => setIsHovering(true));
        el.removeEventListener('mouseleave', () => setIsHovering(false));
      });
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <>
      {/* Main cursor - pixel/boba pearl */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.6 : 0.8,
          }}
          transition={{ duration: 0.2 }}
          className="relative -translate-x-1/2 -translate-y-1/2"
        >
          {/* Pixel cursor - small pearl */}
          <div className="w-3 h-3 bg-taro rounded-full" />

          {/* Outer ring on hover */}
          {isHovering && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              className="absolute inset-0 -m-2 w-7 h-7 border-2 border-taro rounded-full"
            />
          )}
        </motion.div>
      </motion.div>

      {/* Trail effect - smaller pearls */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 0.8 : 1,
            opacity: isHovering ? 0.3 : 0.4,
          }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="w-2 h-2 bg-matcha rounded-full -translate-x-1/2 -translate-y-1/2"
        />
      </motion.div>
    </>
  );
}
