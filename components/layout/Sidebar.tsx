'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  Users,
  FileText,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  BarChart3,
  MessageSquare,
} from 'lucide-react';

interface SidebarProps {
  user: {
    name: string;
    email: string;
    image?: string;
    role?: string;
  };
  onLogout?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface NavItem {
  label: string;
  href: string;
  id: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function Sidebar({ user, onLogout, activeTab, onTabChange }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

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
      label: 'Overview',
      href: '/admin',
      id: 'overview',
      icon: <LayoutDashboard className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Tasks',
      href: '/admin',
      id: 'tasks',
      icon: <CheckSquare className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Projects',
      href: '/admin',
      id: 'projects',
      icon: <FolderKanban className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Clients',
      href: '/admin',
      id: 'clients',
      icon: <Users className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Messages',
      href: '/admin',
      id: 'messages',
      icon: <MessageSquare className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Contracts',
      href: '/admin',
      id: 'contracts',
      icon: <FileText className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Invoices',
      href: '/admin',
      id: 'invoices',
      icon: <TrendingUp className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Analytics',
      href: '/admin',
      id: 'analytics',
      icon: <BarChart3 className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Invites',
      href: '/admin',
      id: 'invites',
      icon: <Sparkles className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Settings',
      href: '/admin',
      id: 'settings',
      icon: <Settings className="w-5 h-5" strokeWidth={2.5} />,
    },
  ];

  const isActive = (item: NavItem) => {
    if (onTabChange && activeTab) {
      return activeTab === item.id;
    }
    if (item.href === '/admin') {
      return pathname === item.href;
    }
    return pathname?.startsWith(item.href);
  };

  const handleNavClick = (item: NavItem) => {
    if (onTabChange) {
      onTabChange(item.id);
    }
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
            <Link href="/admin" className="block">
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
                    Admin Panel
                  </h1>
                  <p className="text-xs font-bold text-ink/60 uppercase mt-0.5">Pixel Boba</p>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  whileHover={{ x: active ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg border-3 border-ink font-black uppercase text-sm transition-all
                    ${
                      active
                        ? 'bg-taro text-white shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]'
                        : 'bg-white text-ink hover:bg-matcha/20'
                    }
                  `}
                >
                  <span className={active ? 'text-white' : 'text-taro'}>{item.icon}</span>
                  <span>{item.label}</span>
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
                      {user.name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                {user.role && (
                  <div className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-taro border-2 border-ink rounded-full">
                    <span className="text-[10px] font-black text-white uppercase">{user.role}</span>
                  </div>
                )}
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
