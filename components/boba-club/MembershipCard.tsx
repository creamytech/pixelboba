'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

export default function MembershipCard() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="relative max-w-2xl mx-auto mb-16"
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative group cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card container with 3D tilt effect */}
        <motion.div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          animate={{
            rotateY: isHovered ? (mousePosition.x - 50) * 0.1 : 0,
            rotateX: isHovered ? -(mousePosition.y - 50) * 0.1 : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Main card image */}
          <Image
            src="/boba-club-card.png"
            alt="Boba Club Membership Card"
            width={1600}
            height={900}
            className="w-full h-auto"
            priority
          />

          {/* Metallic shine overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%,
                rgba(255,255,255,0.4) 0%,
                rgba(255,255,255,0.2) 30%,
                transparent 60%)`,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Animated gradient sweep on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{
              x: isHovered ? '100%' : '-100%',
              opacity: isHovered ? 1 : 0,
            }}
            transition={{
              duration: 1.5,
              ease: 'easeInOut',
            }}
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 50%, transparent)',
            }}
          />

          {/* Holographic rainbow effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
                rgba(255,0,255,0.2) 0%,
                rgba(0,255,255,0.2) 25%,
                rgba(255,255,0,0.2) 50%,
                rgba(0,255,0,0.2) 75%,
                transparent 100%)`,
              opacity: isHovered ? 0.6 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Specular highlight */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute w-32 h-32 rounded-full blur-3xl"
              style={{
                left: `${mousePosition.x}%`,
                top: `${mousePosition.y}%`,
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent 70%)',
              }}
            />
          </motion.div>

          {/* Edge glow effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            animate={{
              boxShadow: isHovered
                ? '0 0 40px rgba(167, 139, 250, 0.6), 0 0 80px rgba(132, 204, 22, 0.4)'
                : '0 0 0 rgba(167, 139, 250, 0)',
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Floating particles on hover */}
        {isHovered && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white/60"
                initial={{
                  x: mousePosition.x + '%',
                  y: mousePosition.y + '%',
                  scale: 0,
                }}
                animate={{
                  x: [
                    mousePosition.x + '%',
                    mousePosition.x + Math.cos((i * Math.PI) / 4) * 20 + '%',
                  ],
                  y: [
                    mousePosition.y + '%',
                    mousePosition.y + Math.sin((i * Math.PI) / 4) * 20 + '%',
                  ],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                style={{
                  pointerEvents: 'none',
                }}
              />
            ))}
          </>
        )}

        {/* Reflection effect at bottom */}
        <motion.div
          className="absolute -bottom-2 left-0 right-0 h-32 opacity-30 blur-xl"
          animate={{
            opacity: isHovered ? 0.5 : 0.3,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(to bottom, rgba(167, 139, 250, 0.4), transparent)',
          }}
        />
      </div>

      {/* Text below card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center mt-8"
      >
        <p className="text-ink/60 font-medium">
          <span className="font-bold text-taro">hover</span> to see the magic ✨
        </p>
      </motion.div>
    </motion.div>
  );
}
