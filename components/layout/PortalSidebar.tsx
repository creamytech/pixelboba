'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  CreditCard,
  FileCheck,
  FolderOpen,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  Zap,
  Calendar,
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

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

export default function PortalSidebar({
  user,
  activeTab,
  onTabChange,
  badges,
  onLogout,
}: PortalSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [activeTab]);

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

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'requests',
      label: 'Requests',
      icon: Zap,
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
      id: 'meetings',
      label: 'Meetings',
      icon: Calendar,
    },
    {
      id: 'team',
      label: 'Team',
      icon: Users,
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
      id: 'billing',
      label: 'Billing',
      icon: CreditCard,
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: Settings,
    },
  ];

  const isActive = (id: string) => activeTab === id;

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-12 h-12 bg-white border-4 border-ink rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-ink" strokeWidth={2.5} />
        ) : (
          <Menu className="w-6 h-6 text-ink" strokeWidth={2.5} />
        )}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-ink/40 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x:
            isMobileOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 0 : -320,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-screen w-[280px] bg-cream border-r-4 border-ink z-50 overflow-y-auto overflow-x-hidden lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 border-b-4 border-ink bg-white">
            <Link href="/portal" className="block">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-xl border-3 border-ink flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]">
                  <Icon icon="game-icons:boba" className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="font-black text-lg uppercase text-ink leading-none">
                    Client Portal
                  </h1>
                  <p className="text-xs font-bold text-ink/60 uppercase mt-0.5">Pixel Boba</p>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.id);
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  data-tour={`sidebar-${item.id}`}
                  whileHover={{ x: active ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg border-3 border-ink font-black uppercase text-sm transition-all relative
                    ${
                      active
                        ? 'bg-taro text-white shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]'
                        : 'bg-white text-ink hover:bg-matcha/20'
                    }
                  `}
                >
                  <span className={active ? 'text-white' : 'text-taro'}>
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <motion.div
                      className="bg-strawberry text-white text-xs font-black px-2 py-0.5 rounded-full min-w-[20px] text-center border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t-4 border-ink bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-3 border-ink object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-matcha to-taro rounded-full border-3 border-ink flex items-center justify-center">
                    <span className="text-white font-black text-lg">
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-taro border-2 border-ink rounded-full">
                  <span className="text-[10px] font-black text-white uppercase">Client</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-ink truncate uppercase">{user.name}</p>
                <p className="text-xs text-ink/60 font-bold truncate">{user.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-strawberry/20 hover:bg-strawberry/30 text-strawberry rounded-lg border-3 border-ink font-black uppercase text-sm transition-all"
              >
                <LogOut className="w-4 h-4" strokeWidth={2.5} />
                <span>Logout</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
