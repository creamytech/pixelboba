'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { ChevronDown, ChevronRight, LogOut, Menu, X, Sparkles } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  badgeColor?: string;
}

interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
  defaultExpanded?: boolean;
}

interface ModernSidebarProps {
  user: {
    name: string;
    email: string;
    image?: string;
    role?: string;
  };
  subscription?: {
    tier: string | null;
    isActive: boolean;
  };
  sections: NavSection[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  brandName?: string;
  brandIcon?: React.ReactNode;
}

export default function ModernSidebar({
  user,
  subscription,
  sections,
  activeTab,
  onTabChange,
  onLogout,
  brandName = 'Pixel Boba',
  brandIcon,
}: ModernSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((section) => {
      initial[section.id] = section.defaultExpanded !== false;
    });
    return initial;
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

  const getTierInfo = () => {
    if (!subscription?.tier) return null;

    const tierColors: Record<string, string> = {
      'Lite Brew': 'from-milk-tea to-brown-sugar',
      'Signature Blend': 'from-thai-tea to-strawberry',
      'Taro Cloud': 'from-taro to-deep-taro',
    };

    return {
      name: subscription.tier,
      color: tierColors[subscription.tier] || 'from-taro to-deep-taro',
    };
  };

  const tierInfo = getTierInfo();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-ink to-ink/95">
      {/* Brand Header */}
      <div className="p-6 border-b-2 border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-taro to-deep-taro rounded-xl border-2 border-white/20 shadow-lg flex items-center justify-center">
            {brandIcon || <Icon icon="ph:drop-duotone" className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h1 className="font-display text-xl font-black text-white uppercase tracking-tight">
              {brandName}
            </h1>
            {tierInfo && (
              <div className="flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-white/60" />
                <span className="text-xs font-bold text-white/60 uppercase">{tierInfo.name}</span>
              </div>
            )}
          </div>
        </div>

        {tierInfo && (
          <div
            className={`px-3 py-2 bg-gradient-to-r ${tierInfo.color} rounded-lg border-2 border-white/20 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase">{tierInfo.name}</span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      {/* Main Label */}
      <div className="px-6 py-3">
        <span className="text-xs font-black text-white/40 uppercase tracking-wider">Main</span>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {sections.map((section) => (
          <div key={section.id} className="mb-4">
            {/* Section Header */}
            {section.label && (
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-3 py-2 flex items-center justify-between text-white/60 hover:text-white transition-colors group"
              >
                <span className="text-xs font-black uppercase tracking-wider">{section.label}</span>
                {expandedSections[section.id] ? (
                  <ChevronDown className="w-4 h-4 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform" />
                )}
              </button>
            )}

            {/* Section Items */}
            <AnimatePresence>
              {expandedSections[section.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  {section.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`
                          w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all group relative
                          ${
                            isActive
                              ? 'bg-gradient-to-r from-white/20 to-white/10 shadow-lg border-l-4 border-white'
                              : 'hover:bg-white/5 border-l-4 border-transparent hover:border-white/20'
                          }
                        `}
                      >
                        <div
                          className={`
                          transition-colors
                          ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}
                        `}
                        >
                          {item.icon}
                        </div>
                        <span
                          className={`
                          flex-1 text-left font-bold text-sm
                          ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}
                        `}
                        >
                          {item.label}
                        </span>
                        {item.badge && item.badge > 0 && (
                          <div
                            className={`
                            px-2 py-0.5 rounded-full text-xs font-black min-w-[20px] text-center
                            ${item.badgeColor || 'bg-strawberry text-white'}
                            border-2 border-white/20 shadow-lg
                          `}
                          >
                            {item.badge > 99 ? '99+' : item.badge}
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

      {/* User Profile */}
      <div className="p-4 border-t-2 border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border-2 border-white/10 hover:bg-white/10 transition-all group cursor-pointer">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-taro to-deep-taro rounded-full border-2 border-white/20 flex items-center justify-center">
              <span className="text-white font-black text-lg">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white text-sm truncate">{user.name || user.email}</div>
            <div className="text-xs text-white/60 truncate font-bold">
              {user.role || user.email}
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-strawberry/20 text-white/60 hover:text-strawberry transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-br from-taro to-deep-taro text-white rounded-xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-ink/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-40 shadow-2xl"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 border-r-4 border-ink shadow-[4px_0px_0px_0px_rgba(58,0,29,1)]">
        <SidebarContent />
      </aside>
    </>
  );
}
