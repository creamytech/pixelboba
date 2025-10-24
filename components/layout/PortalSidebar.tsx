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
  subscription?: {
    tier: string | null;
    isActive: boolean;
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
  subscription,
  activeTab,
  onTabChange,
  badges,
  onLogout,
}: PortalSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDesktopHidden, setIsDesktopHidden] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    workspace: true,
    communication: true,
    financial: true,
    settings: true,
  });

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

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const navSections = [
    {
      id: 'workspace',
      label: 'Workspace',
      items: [
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
      ],
    },
    {
      id: 'communication',
      label: 'Communication',
      items: [
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
      ],
    },
    {
      id: 'financial',
      label: 'Financial',
      items: [
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
          id: 'billing',
          label: 'Billing',
          icon: CreditCard,
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      items: [
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
      ],
    },
  ];

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

  // Get tier display info
  const getTierInfo = () => {
    if (!subscription?.tier) {
      return { name: 'Free', color: 'from-gray-400 to-gray-500', icon: 'game-icons:boba' };
    }

    const tierLower = subscription.tier.toLowerCase();
    if (tierLower.includes('lite') || tierLower.includes('brew')) {
      return { name: 'Lite Brew', color: 'from-milk-tea to-brown-sugar', icon: 'game-icons:boba' };
    }
    if (tierLower.includes('signature') || tierLower.includes('blend')) {
      return {
        name: 'Signature Blend',
        color: 'from-thai-tea to-orange-600',
        icon: 'ph:drop-duotone',
      };
    }
    if (tierLower.includes('taro') || tierLower.includes('cloud')) {
      return { name: 'Taro Cloud', color: 'from-deep-taro to-taro', icon: 'ph:cloud-duotone' };
    }
    return { name: subscription.tier, color: 'from-taro to-deep-taro', icon: 'game-icons:boba' };
  };

  const tierInfo = getTierInfo();

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
        className={`fixed left-0 top-0 h-screen bg-cream z-50 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-out ${
          isCollapsed ? 'w-[80px]' : 'w-[280px]'
        }`}
        style={{
          transform:
            typeof window !== 'undefined' && window.innerWidth >= 1024
              ? // Desktop
                isDesktopHidden
                ? 'translateX(-100%) translateZ(0)'
                : 'translateX(0) translateZ(0)'
              : // Mobile
                isMobileOpen
                ? 'translateX(0) translateZ(0)'
                : 'translateX(-100%) translateZ(0)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 border-b-4 border-ink bg-gradient-to-br from-cream to-white">
            <Link href="/portal" className="block active:scale-98 transition-transform">
              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-14 h-14 bg-gradient-to-br from-taro via-deep-taro to-taro rounded-2xl border-4 border-ink flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 animate-pulse" />
                  <Icon icon="game-icons:boba" className="w-8 h-8 text-white relative z-10" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1">
                    <h1 className="font-display font-black text-xl uppercase text-ink leading-tight tracking-tight">
                      Portal
                    </h1>
                    <p className="text-xs font-bold text-taro uppercase tracking-wide">
                      Pixel Boba
                    </p>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.id} className="space-y-1">
                {/* Section Header */}
                {!isCollapsed && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-2 py-2 text-xs font-black uppercase text-ink/60 hover:text-ink transition-colors"
                  >
                    <span>{section.label}</span>
                    <motion.div
                      animate={{ rotate: expandedSections[section.id] ? 0 : -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon icon="material-symbols:chevron-down" className="w-5 h-5" />
                    </motion.div>
                  </button>
                )}

                {/* Section Items */}
                <AnimatePresence>
                  {(isCollapsed || expandedSections[section.id]) && (
                    <motion.div
                      initial={!isCollapsed ? { opacity: 0, height: 0 } : false}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1"
                    >
                      {section.items.map((item) => {
                        const active = isActive(item.id);
                        const ItemIcon = item.icon;
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
                              <ItemIcon className="w-5 h-5" strokeWidth={2.5} />
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
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
          <div className="p-5 border-t-4 border-ink bg-gradient-to-br from-white to-cream">
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-14 h-14 rounded-full border-4 border-ink object-cover shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-matcha to-taro rounded-full border-4 border-ink flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]">
                      <span className="text-white font-black text-xl">
                        {user.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="w-10 h-10 flex items-center justify-center bg-white hover:bg-ink/10 text-ink/60 hover:text-ink rounded-full border-3 border-ink transition-all active:scale-95 shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Subscription Tier Badge */}
                {subscription?.isActive && (
                  <div
                    className={`mb-4 p-3 rounded-xl border-3 border-ink bg-gradient-to-r ${tierInfo.color} shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon={tierInfo.icon} className="w-5 h-5 text-white" />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-white/80 uppercase tracking-wide">
                          Boba Club
                        </p>
                        <p className="text-sm font-black text-white uppercase leading-none">
                          {tierInfo.name}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    </div>
                  </div>
                )}

                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-14 h-14 rounded-full border-4 border-ink object-cover shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-matcha to-taro rounded-full border-4 border-ink flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]">
                        <span className="text-white font-black text-xl">
                          {user.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-base text-ink truncate">{user.name}</p>
                    <p className="text-xs text-ink/60 font-bold truncate">{user.email}</p>
                  </div>
                </div>

                {/* Logout Button */}
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-ink/5 text-ink/70 hover:text-ink rounded-xl border-3 border-ink font-bold text-sm transition-all active:scale-98 shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]]"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2.5} />
                    <span className="uppercase">Sign Out</span>
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
