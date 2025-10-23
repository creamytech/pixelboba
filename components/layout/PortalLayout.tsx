'use client';

import { ReactNode } from 'react';
import PortalSidebar from './PortalSidebar';
import { motion } from 'framer-motion';

interface PortalLayoutProps {
  children: ReactNode;
  user: {
    name: string;
    email: string;
    image?: string;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
  badges: {
    messages?: number;
    invoices?: number;
    contracts?: number;
  };
  onLogout?: () => void;
}

export default function PortalLayout({
  children,
  user,
  activeTab,
  onTabChange,
  badges,
  onLogout,
}: PortalLayoutProps) {
  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Animated Background Elements - Simplified for Pomegranate */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative shapes */}
        <motion.div
          className="absolute w-96 h-96 bg-taro/5 rounded-full"
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
          className="absolute w-80 h-80 bg-matcha/5 rounded-full"
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
            className="absolute w-2 h-2 bg-ink/10 rounded-full"
            animate={{
              y: ['100vh', '-10vh'],
              x: [Math.random() * 100 + 'vw', Math.random() * 100 + 'vw'],
              opacity: [0, 0.4, 0],
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
      <PortalSidebar
        user={user}
        activeTab={activeTab}
        onTabChange={onTabChange}
        badges={badges}
        onLogout={onLogout}
      />

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
