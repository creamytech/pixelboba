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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDesktopHidden, setIsDesktopHidden] = useState(false);
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
      {/* Menu Button - Mobile */}
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

      {/* Menu Button - Desktop */}
      <button
        onClick={() => setIsDesktopHidden(!isDesktopHidden)}
        className="hidden lg:block fixed top-4 left-4 z-[60] w-12 h-12 bg-white border-4 border-ink rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        style={{
          left: !isDesktopHidden
            ? isCollapsed
              ? 'calc(80px + 1rem)'
              : 'calc(280px + 1rem)'
            : '1rem',
        }}
      >
        {isDesktopHidden ? (
          <Menu className="w-6 h-6 text-ink" strokeWidth={2.5} />
        ) : (
          <X className="w-6 h-6 text-ink" strokeWidth={2.5} />
        )}
      </button>

      {/* Mobile Collapse Toggle - Shows when sidebar is open */}
      {isMobileOpen && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="lg:hidden fixed top-4 left-[calc(80px+1rem)] z-[60] w-10 h-10 bg-white border-3 border-ink rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] active:scale-95 transition-all"
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
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} ${!isDesktopHidden ? 'lg:translate-x-0' : ''}`}
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 border-b-4 border-ink bg-white">
            <Link href="/admin" className="block active:scale-98 transition-transform">
              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-xl border-3 border-ink flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]">
                  <Icon icon="game-icons:boba" className="w-7 h-7 text-white" />
                </div>
                {!isCollapsed && (
                  <div>
                    <h1 className="font-black text-lg uppercase text-ink leading-none">
                      Admin Panel
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
              const active = isActive(item);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  title={isCollapsed ? item.label : undefined}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg border-3 border-ink font-black uppercase text-sm transition-colors active:scale-98
                    ${isCollapsed ? 'justify-center' : ''}
                    ${
                      active
                        ? 'bg-taro text-white shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]'
                        : 'bg-white text-ink hover:bg-matcha/20'
                    }
                  `}
                >
                  <span className={active ? 'text-white' : 'text-taro'}>{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
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
                        {user.name?.[0]?.toUpperCase() || '?'}
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
                          {user.name?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                    {user.role && (
                      <div className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-taro border-2 border-ink rounded-full">
                        <span className="text-[10px] font-black text-white uppercase">
                          {user.role}
                        </span>
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
