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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-12 h-12 bg-white border-4 border-ink rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] active:scale-95 transition-transform"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-ink" strokeWidth={2.5} />
        ) : (
          <Menu className="w-6 h-6 text-ink" strokeWidth={2.5} />
        )}
      </button>

      {/* Mobile Collapse Toggle - Shows when sidebar is open */}
      {isMobileOpen && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="lg:hidden fixed top-4 z-[60] w-10 h-10 bg-white border-3 border-ink rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] active:scale-95 transition-all"
          style={{ left: isCollapsed ? 'calc(80px + 1rem)' : 'calc(280px + 1rem)' }}
        >
          <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <Icon icon="material-symbols:chevron-left" className="w-5 h-5 text-ink" />
          </motion.div>
        </button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence mode="wait">
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden fixed inset-0 bg-ink/40 z-40"
            style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-cream border-r-4 border-ink z-50 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-out will-change-transform ${
          isCollapsed ? 'w-[80px]' : 'w-[280px]'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 border-b-4 border-ink bg-white">
            <Link href="/portal" className="block active:scale-98 transition-transform">
              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-xl border-3 border-ink flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]">
                  <Icon icon="game-icons:boba" className="w-7 h-7 text-white" />
                </div>
                {!isCollapsed && (
                  <div>
                    <h1 className="font-black text-lg uppercase text-ink leading-none">
                      Client Portal
                    </h1>
                    <p className="text-xs font-bold text-ink/60 uppercase mt-0.5">Pixel Boba</p>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.id);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  data-tour={`sidebar-${item.id}`}
                  title={isCollapsed ? item.label : undefined}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg border-3 border-ink font-black uppercase text-sm transition-colors relative active:scale-98
                    ${isCollapsed ? 'justify-center' : ''}
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
                  {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                  {!isCollapsed && item.badge && item.badge > 0 && (
                    <motion.div
                      className="bg-strawberry text-white text-xs font-black px-2 py-0.5 rounded-full min-w-[20px] text-center border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </motion.div>
                  )}
                  {isCollapsed && item.badge && item.badge > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-strawberry rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-[10px] font-black text-white">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Collapse Toggle - Desktop Only */}
          <div className="hidden lg:flex items-center justify-center p-2 border-t-4 border-b-4 border-ink bg-white">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-10 h-10 bg-white border-3 border-ink rounded-full flex items-center justify-center hover:bg-matcha/20 transition-colors active:scale-95"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Icon icon="material-symbols:chevron-left" className="w-6 h-6 text-ink" />
              </motion.div>
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t-4 border-ink bg-white">
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-2">
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
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="w-10 h-10 flex items-center justify-center bg-strawberry/20 hover:bg-strawberry/30 text-strawberry rounded-lg border-3 border-ink transition-colors active:scale-95"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                )}
              </div>
            ) : (
              <>
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
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-strawberry/20 hover:bg-strawberry/30 text-strawberry rounded-lg border-3 border-ink font-black uppercase text-sm transition-colors active:scale-98"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2.5} />
                    <span>Logout</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
