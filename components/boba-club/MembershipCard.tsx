'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MembershipCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className="relative w-full"
      style={{ perspective: '1000px' }}
    >
      {/* Card container with automatic animations */}
      <motion.div
        className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-ink"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
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

        {/* Continuous metallic shine sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 1,
          }}
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 50%, transparent)',
            transform: 'skewX(-20deg)',
          }}
        />

        {/* Holographic rainbow effect - continuous movement */}
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            background:
              'linear-gradient(45deg, rgba(255,0,255,0.3), rgba(0,255,255,0.3), rgba(255,255,0,0.3), rgba(0,255,0,0.3), rgba(255,0,255,0.3))',
            backgroundSize: '200% 200%',
          }}
        />

        {/* Pulsing edge glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 20px rgba(167, 139, 250, 0.4), 0 0 40px rgba(132, 204, 22, 0.2)',
              '0 0 40px rgba(167, 139, 250, 0.6), 0 0 60px rgba(132, 204, 22, 0.4)',
              '0 0 20px rgba(167, 139, 250, 0.4), 0 0 40px rgba(132, 204, 22, 0.2)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Metallic shimmer overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 60%)',
          }}
        />

        {/* Reflection effect at bottom */}
        <motion.div
          className="absolute -bottom-2 left-0 right-0 h-32 opacity-40 blur-xl"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'linear-gradient(to bottom, rgba(167, 139, 250, 0.5), transparent)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
