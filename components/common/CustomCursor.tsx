'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [clicked, setClicked] = useState(false);

  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 200);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        if (
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button')
        ) {
          setIsHovering(true);
        } else {
          setIsHovering(false);
        }
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Main cursor - Thick arrow pointer */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
        }}
      >
        <motion.div
          animate={{
            scale: clicked ? 0.85 : isHovering ? 1.15 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          {/* Thick arrow cursor SVG */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* Main arrow body - Tan fill */}
            <path
              d="M4 4 L4 24 L11 17 L15 26 L18 25 L14 16 L22 16 L4 4 Z"
              fill="#F5E6D3"
              stroke="rgba(58,0,29,1)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Inner highlight for depth */}
            <path
              d="M6 6 L6 20 L10.5 15.5 L13.5 22.5 L15.5 21.8 L12.5 15 L19 15 L6 6 Z"
              fill="rgba(255,255,255,0.3)"
            />
          </svg>
        </motion.div>
      </div>

      {/* Trailing cursor - Smaller version */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        style={{
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 0.5 : 0.7,
            opacity: isHovering ? 0.2 : 0.4,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4 L4 24 L11 17 L15 26 L18 25 L14 16 L22 16 L4 4 Z"
              fill="rgba(58,0,29,0.6)"
            />
          </svg>
        </motion.div>
      </div>

      {/* Click ripple effect */}
      {clicked && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9997] hidden md:block"
          style={{
            transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
          }}
        >
          <motion.div
            className="absolute border-3 border-ink rounded-full"
            initial={{ width: '20px', height: '20px', opacity: 1 }}
            animate={{ width: '60px', height: '60px', opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* Hover glow effect */}
      {isHovering && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9997] hidden md:block"
          style={{
            transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
          }}
        >
          <motion.div
            className="absolute bg-taro rounded-full blur-xl"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: '40px',
              height: '40px',
              opacity: 0.3,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      <style jsx global>{`
        @media (min-width: 768px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
