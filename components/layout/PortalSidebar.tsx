'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  CreditCard,
  FileCheck,
  FolderOpen,
  Bell,
  Settings,
  ChevronLeft,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

interface PortalSidebarProps {
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

export default function PortalSidebar({
  user,
  activeTab,
  onTabChange,
  badges,
  onLogout,
}: PortalSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [activeTab]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: badges.messages,
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: CreditCard,
      badge: badges.invoices,
    },
    {
      id: 'contracts',
      label: 'Contracts',
      icon: FileCheck,
      badge: badges.contracts,
    },
    {
      id: 'files',
      label: 'Files',
      icon: FolderOpen,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: Settings,
    },
  ];

  const isActive = (id: string) => activeTab === id;

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-12 h-12 bg-white/90 backdrop-blur-sm border-2 border-brown-sugar/20 rounded-2xl flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-taro" />
        ) : (
          <Menu className="w-6 h-6 text-taro" />
        )}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-ink/20 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed left-0 top-0 h-screen bg-gradient-to-b from-milk-tea/20 via-white to-taro/10 border-r-2 border-brown-sugar/10 backdrop-blur-xl z-50
          ${isMobileOpen ? 'shadow-2xl' : ''}
        `}
        animate={{ width: isCollapsed ? '80px' : '280px' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          transform:
            !isMobileOpen && typeof window !== 'undefined' && window.innerWidth < 1024
              ? 'translateX(-100%)'
              : undefined,
        }}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Floating Bubble Decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute w-32 h-32 bg-taro/5 rounded-full blur-2xl"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ top: '10%', left: '10%' }}
            />
            <motion.div
              className="absolute w-24 h-24 bg-brown-sugar/5 rounded-full blur-2xl"
              animate={{
                y: [0, 20, 0],
                x: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              style={{ bottom: '20%', right: '10%' }}
            />
          </div>

          {/* Logo Area */}
          <div className="relative p-6 border-b border-brown-sugar/10">
            <Link href="/portal" className="block">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative w-10 h-10">
                  <Image
                    src="/Pixel_Boba_Icon_PNG.png"
                    alt="Pixel Boba"
                    width={40}
                    height={40}
                    className="rounded-2xl"
                  />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h1 className="font-display font-bold text-lg text-ink">Client Portal</h1>
                      <p className="text-xs text-ink/60">Pixel Boba</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: isCollapsed ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => onTabChange(item.id)}
                      className={`
                      relative flex items-center gap-3 px-4 py-3 rounded-2xl w-full
                      transition-all duration-300 group
                      ${
                        isActive(item.id)
                          ? 'bg-gradient-to-r from-taro to-taro/80 text-white shadow-lg shadow-taro/30'
                          : 'text-ink/60 hover:bg-milk-tea/30 hover:text-ink'
                      }
                    `}
                    >
                      {/* Active Bubble Indicator */}
                      {isActive(item.id) && (
                        <motion.div
                          className="absolute -left-1 w-1.5 h-8 bg-brown-sugar rounded-full"
                          layoutId="activeIndicator"
                          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        />
                      )}

                      {/* Icon */}
                      <div className={isActive(item.id) ? 'text-white' : 'text-taro'}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Label */}
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            className="font-display font-medium text-sm flex-1 text-left"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Badge */}
                      {!isCollapsed && item.badge && item.badge > 0 && (
                        <motion.div
                          className="bg-brown-sugar text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 15 }}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </motion.div>
                      )}

                      {/* Badge indicator when collapsed */}
                      {isCollapsed && item.badge && item.badge > 0 && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-4 h-4 bg-brown-sugar rounded-full border-2 border-white"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </nav>

          {/* User Profile Card */}
          <div className="relative p-4 border-t border-brown-sugar/10">
            <motion.div
              className={`
              bg-gradient-to-br from-milk-tea/40 to-white/40 backdrop-blur-lg
              rounded-2xl p-3 border border-brown-sugar/10
              ${isCollapsed ? 'flex items-center justify-center' : ''}
            `}
              whileHover={{ scale: 1.02 }}
            >
              {isCollapsed ? (
                <div className="relative">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-taro/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-taro to-brown-sugar flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-taro/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-taro to-brown-sugar flex items-center justify-center text-white font-bold text-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm text-ink truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-ink/50 truncate">Client</p>
                  </div>
                  {onLogout && (
                    <motion.button
                      onClick={onLogout}
                      className="p-2 hover:bg-red-50 rounded-xl text-red-400 hover:text-red-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Sign out"
                    >
                      <LogOut className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Collapse Toggle - Desktop Only */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border-2 border-brown-sugar/20 rounded-full items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronLeft className="w-3 h-3 text-taro" />
            </motion.div>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
