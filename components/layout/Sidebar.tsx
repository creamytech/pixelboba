'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  TrendingUp,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  user: {
    name: string;
    email: string;
    image?: string;
    role?: string;
  };
  onLogout?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  subItems?: { label: string; href: string }[];
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Projects',
      href: '/admin/projects',
      icon: <FolderKanban className="w-5 h-5" />,
      badge: 3,
    },
    {
      label: 'Tasks',
      href: '/admin/tasks',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: 12,
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      label: 'Team',
      href: '/admin/team',
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Templates',
      href: '/admin/templates',
      icon: <FileText className="w-5 h-5" />,
      subItems: [
        { label: 'Task Templates', href: '/admin/templates/tasks' },
        { label: 'Board Templates', href: '/admin/templates/boards' },
      ],
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const toggleExpand = (label: string) => {
    if (isCollapsed) return;
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen bg-gradient-to-b from-taro/10 via-white to-milk-tea/20 border-r-2 border-brown-sugar/10 backdrop-blur-xl z-50"
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
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
          <Link href="/admin" className="block">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-taro to-taro/60 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="font-display font-bold text-lg text-ink bg-gradient-to-r from-taro to-brown-sugar bg-clip-text text-transparent">
                      Pixel Boba
                    </h1>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            {navItems.map((item) => (
              <div key={item.label}>
                <motion.div whileHover={{ x: isCollapsed ? 0 : 4 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (item.subItems) {
                        e.preventDefault();
                        toggleExpand(item.label);
                      }
                    }}
                    className={`
                      relative flex items-center gap-3 px-4 py-3 rounded-2xl
                      transition-all duration-300 group
                      ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-taro to-taro/80 text-white shadow-lg shadow-taro/30'
                          : 'text-ink/60 hover:bg-milk-tea/30 hover:text-ink'
                      }
                    `}
                  >
                    {/* Active Bubble Indicator */}
                    {isActive(item.href) && (
                      <motion.div
                        className="absolute -left-1 w-1.5 h-8 bg-brown-sugar rounded-full"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      />
                    )}

                    {/* Icon */}
                    <div className={isActive(item.href) ? 'text-white' : 'text-taro'}>
                      {item.icon}
                    </div>

                    {/* Label */}
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          className="font-display font-medium text-sm flex-1"
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
                    {!isCollapsed && item.badge && (
                      <motion.div
                        className="bg-brown-sugar text-white text-xs font-bold px-2 py-0.5 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                      >
                        {item.badge}
                      </motion.div>
                    )}

                    {/* Expand Arrow */}
                    {!isCollapsed && item.subItems && (
                      <motion.div
                        animate={{ rotate: expandedItem === item.label ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </Link>
                </motion.div>

                {/* Sub-items */}
                <AnimatePresence>
                  {!isCollapsed && item.subItems && expandedItem === item.label && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden ml-4 mt-2 space-y-1"
                    >
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl text-sm
                            transition-all duration-200
                            ${
                              pathname === subItem.href
                                ? 'bg-taro/10 text-taro font-medium'
                                : 'text-ink/50 hover:bg-milk-tea/20 hover:text-ink/70'
                            }
                          `}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                          {subItem.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
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
                  <p className="text-xs text-ink/50 truncate">{user.role || 'Admin'}</p>
                </div>
                {onLogout && (
                  <motion.button
                    onClick={onLogout}
                    className="p-2 hover:bg-red-50 rounded-xl text-red-400 hover:text-red-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <LogOut className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Collapse Toggle */}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border-2 border-brown-sugar/20 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronLeft className="w-3 h-3 text-taro" />
          </motion.div>
        </motion.button>
      </div>
    </motion.aside>
  );
}
