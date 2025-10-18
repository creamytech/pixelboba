'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
  user: {
    name: string;
    email: string;
    image?: string;
    role?: string;
  };
  onLogout?: () => void;
}

export default function DashboardLayout({ children, user, onLogout }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-milk-tea/20 via-white to-taro/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative bubbles */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-taro/10 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ top: '10%', left: '20%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-br from-brown-sugar/10 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          style={{ bottom: '15%', right: '15%' }}
        />

        {/* Small floating bubbles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-taro/20 rounded-full"
            animate={{
              y: ['100vh', '-10vh'],
              x: [Math.random() * 100 + 'vw', Math.random() * 100 + 'vw'],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
            style={{
              left: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      {/* Sidebar */}
      <Sidebar user={user} onLogout={onLogout} />

      {/* Main Content */}
      <motion.main
        className="lg:ml-[280px] min-h-screen p-4 sm:p-6 lg:p-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
