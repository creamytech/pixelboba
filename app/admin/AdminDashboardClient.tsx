'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import {
  Users,
  FolderOpen,
  FileText,
  CreditCard,
  Settings,
  Plus,
  TrendingUp,
  DollarSign,
  Calendar,
  LogOut,
  MessageCircle,
} from 'lucide-react';
import ProjectManager from '@/components/admin/ProjectManager';
import ClientManager from '@/components/admin/ClientManager';
import ContractManager from '@/components/admin/ContractManager';
import InvoiceManager from '@/components/admin/InvoiceManager';
import AdminSettings from '@/components/admin/AdminSettings';
import InviteManager from '@/components/admin/InviteManager';
import AdminMessageCenter from '@/components/admin/AdminMessageCenter';
import DashboardPearlField from '@/components/animations/DashboardPearlField';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Session } from 'next-auth';

interface AdminStats {
  totalClients: number;
  activeProjects: number;
  completedProjects: number;
  monthlyRevenue: number;
  totalRevenue: number;
  pendingInvoices: number;
  paidInvoices: number;
  pendingContracts: number;
  signedContracts: number;
  averageProjectDuration: number;
  recentActivity: Array<{
    id: string;
    action: string;
    description: string;
    user: { name: string | null; email: string };
    project: { name: string } | null;
    createdAt: Date;
  }>;
}

export default function AdminDashboardClient({ session }: { session: Session }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMessageCenter, setShowMessageCenter] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchProjects();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-milk-tea via-background to-taro/20 flex items-center justify-center relative overflow-hidden">
        <DashboardPearlField />
        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'backOut' }}
        >
          <motion.div
            className="w-20 h-20 border-4 border-taro/30 border-t-taro rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.p
            className="font-display text-2xl text-ink/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            brewing your admin panel...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'overview', icon: TrendingUp },
    { id: 'projects', name: 'projects', icon: FolderOpen },
    { id: 'clients', name: 'clients', icon: Users },
    { id: 'contracts', name: 'contracts', icon: FileText },
    { id: 'invoices', name: 'invoices', icon: CreditCard },
    { id: 'invites', name: 'invites', icon: Plus },
    { id: 'settings', name: 'settings', icon: Settings },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} setActiveTab={setActiveTab} />;
      case 'projects':
        return <ProjectManager />;
      case 'clients':
        return <ClientManager />;
      case 'contracts':
        return <ContractManager />;
      case 'invoices':
        return <InvoiceManager />;
      case 'invites':
        return <InviteManager />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <OverviewTab stats={stats} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-milk-tea via-background to-taro/20 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 relative overflow-hidden">
      <DashboardPearlField />

      {/* Header */}
      <motion.div
        className="border-b border-brown-sugar/20 dark:border-gray-600/20 bg-milk-tea/80 dark:bg-gray-800/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  animate={{
                    boxShadow: [
                      '0 4px 6px rgba(0,0,0,0.1)',
                      '0 8px 15px rgba(167,139,250,0.3)',
                      '0 4px 6px rgba(0,0,0,0.1)',
                    ],
                  }}
                  transition={{
                    boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                  }}
                >
                  <Image
                    src="/brand/Pixel_Boba_Icon_01.svg"
                    alt="pixel boba"
                    width={56}
                    height={56}
                    className="h-14 w-14"
                    priority
                  />
                </motion.div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-gradient-to-b from-taro to-brown-sugar rounded-full"></div>
                <span className="text-ink/70 font-display font-medium">admin panel</span>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ThemeToggle size="md" />
              <motion.button
                onClick={() => setShowMessageCenter(true)}
                className="flex items-center space-x-2 px-4 py-2 text-taro hover:bg-taro/10 rounded-xl transition-all duration-300 group font-display"
                title="Open messaging center"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                </motion.div>
                <span className="text-sm">messages</span>
              </motion.button>
              <div className="hidden sm:block text-right">
                <p className="font-display text-sm font-medium text-ink lowercase">welcome back!</p>
                <p className="font-display text-xs text-ink/60 lowercase">{session?.user?.name}</p>
              </div>
              <motion.button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 text-ink/60 hover:text-taro hover:bg-taro/10 rounded-lg transition-all duration-200 group"
                title="Sign out"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Navigation Tabs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.nav
            className="flex space-x-2 bg-milk-tea/60 dark:bg-gray-700/60 backdrop-blur-lg rounded-xl p-2 border border-brown-sugar/20 dark:border-gray-600/20 shadow-lg"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5, ease: 'backOut' }}
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-4 py-3 rounded-lg font-display font-medium transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-taro to-brown-sugar text-white shadow-lg'
                      : 'text-ink/70 dark:text-gray-300/70 hover:text-ink dark:hover:text-gray-200 hover:bg-milk-tea/80 dark:hover:bg-gray-600/80 hover:shadow-md'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    animate={isActive ? { rotate: [0, 5, 0] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon
                      size={18}
                      className={`transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                    />
                  </motion.div>
                  <span className="font-medium lowercase">{tab.name}</span>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-taro/20 to-brown-sugar/20"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.nav>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveTab()}
        </motion.div>
      </div>

      {/* Admin Message Center Modal */}
      {showMessageCenter && (
        <AdminMessageCenter projects={projects} onClose={() => setShowMessageCenter(false)} />
      )}
    </div>
  );
}

function OverviewTab({
  stats,
  setActiveTab,
}: {
  stats: AdminStats | null;
  setActiveTab: (tab: string) => void;
}) {
  if (!stats) {
    return (
      <motion.div
        className="min-h-[400px] bg-milk-tea/70 backdrop-blur-lg rounded-xl border border-brown-sugar/20 shadow-lg flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center">
          <motion.div
            className="w-12 h-12 border-4 border-taro/30 border-t-taro rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.p
            className="font-display text-ink/70 lowercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            loading admin statistics...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  const statCards = [
    {
      title: 'total clients',
      value: stats.totalClients,
      icon: Users,
      color: 'blue',
      trend: `+${Math.floor(stats.totalClients * 0.12)} this month`,
      trendDirection: 'up' as 'up' | 'down' | 'neutral',
      accentBg: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'active projects',
      value: stats.activeProjects,
      icon: FolderOpen,
      color: 'taro',
      trend: `${stats.completedProjects} completed`,
      trendDirection: 'neutral' as 'up' | 'down' | 'neutral',
      accentBg: 'bg-violet-50 border-violet-100',
    },
    {
      title: 'monthly revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      trend: `+${Math.floor(stats.monthlyRevenue * 0.15)}% this month`,
      trendDirection: 'up' as 'up' | 'down' | 'neutral',
      accentBg: 'bg-green-50 border-green-100',
    },
    {
      title: 'pending invoices',
      value: stats.pendingInvoices,
      icon: CreditCard,
      color: 'red',
      trend: `${stats.paidInvoices} paid this month`,
      trendDirection: (stats.pendingInvoices > 3 ? 'up' : 'down') as 'up' | 'down' | 'neutral',
      accentBg: 'bg-red-50 border-red-100',
    },
    {
      title: 'pending contracts',
      value: stats.pendingContracts,
      icon: FileText,
      color: 'orange',
      trend: `${stats.signedContracts} signed`,
      trendDirection: 'neutral' as 'up' | 'down' | 'neutral',
      accentBg: 'bg-orange-50 border-orange-100',
    },
    {
      title: 'avg project time',
      value: stats.averageProjectDuration > 0 ? `${stats.averageProjectDuration} days` : 'N/A',
      icon: Calendar,
      color: 'indigo',
      trend: stats.completedProjects > 0 ? `${stats.completedProjects} completed` : 'No data',
      trendDirection: 'neutral' as 'up' | 'down' | 'neutral',
      accentBg: 'bg-indigo-50 border-indigo-100',
    },
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Enhanced Stats Grid with Staggered Animations */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.2 + index * 0.1,
              ease: 'backOut',
            }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions with Enhanced Animations */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        {/* Recent Activity */}
        <motion.div
          className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20 shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <motion.h3
            className="font-display text-lg font-semibold text-ink mb-4 lowercase"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            recent activity
          </motion.h3>
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            {stats.recentActivity.length > 0 ? (
              <AnimatePresence>
                {stats.recentActivity.slice(0, 6).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 1.4 + index * 0.05,
                      ease: 'backOut',
                    }}
                  >
                    <ActivityItem
                      action={activity.action}
                      description={`${activity.user.name || activity.user.email}${activity.project ? ` • ${activity.project.name}` : ''} - ${activity.description}`}
                      time={new Date(activity.createdAt).toLocaleDateString()}
                      type="user"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                className="text-center py-8 text-ink/50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                </motion.div>
                <p className="font-display text-sm lowercase">no recent activity</p>
                <p className="font-display text-xs lowercase">
                  activity will appear here as users interact with your platform
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20 shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <motion.h3
            className="font-display text-lg font-semibold text-ink mb-4 lowercase"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            quick actions
          </motion.h3>
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            {[
              {
                icon: Users,
                label: 'add client',
                tab: 'clients',
                color: 'from-blue-500/10 to-blue-600/10',
                hoverColor: 'from-blue-500/20 to-blue-600/20',
              },
              {
                icon: Plus,
                label: 'new project',
                tab: 'projects',
                color: 'from-taro/10 to-deep-taro/10',
                hoverColor: 'from-taro/20 to-deep-taro/20',
              },
              {
                icon: FileText,
                label: 'create contract',
                tab: 'contracts',
                color: 'from-green-500/10 to-green-600/10',
                hoverColor: 'from-green-500/20 to-green-600/20',
              },
              {
                icon: CreditCard,
                label: 'send invoice',
                tab: 'invoices',
                color: 'from-orange-500/10 to-orange-600/10',
                hoverColor: 'from-orange-500/20 to-orange-600/20',
              },
            ].map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 1.4 + index * 0.1,
                  ease: 'backOut',
                }}
              >
                <ActionButton
                  icon={action.icon}
                  label={action.label}
                  onClick={() => setActiveTab(action.tab)}
                  color={action.color}
                  hoverColor={action.hoverColor}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Revenue Chart Placeholder with Enhanced Design */}
      <motion.div
        className="bg-white/70 backdrop-blur-lg rounded-xl p-6 border border-white/30 shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.6 }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        <motion.h3
          className="font-display text-lg font-semibold text-ink mb-4 lowercase"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8 }}
        >
          revenue overview
        </motion.h3>
        <motion.div
          className="h-64 bg-gradient-to-br from-white/50 via-milk-tea/30 to-taro/5 rounded-lg p-4 border border-white/20 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.9 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-display text-sm text-ink/60 lowercase">this month</p>
              <p className="font-display text-2xl font-bold text-ink">
                ${stats.monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-sm text-green-600 flex items-center gap-1">
                ↗ +{Math.floor(stats.monthlyRevenue * 0.15)}%
              </p>
              <p className="font-display text-xs text-ink/50">vs last month</p>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="relative h-32 flex items-end justify-between gap-2">
            {[65, 45, 80, 55, 90, 70, 85, 95, 75, 60, 88, stats.monthlyRevenue / 100].map(
              (height, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-t from-taro/60 to-taro/40 rounded-t-sm flex-1 min-h-[8px] relative group"
                  style={{ height: `${Math.max(height * 0.8, 8)}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height * 0.8, 8)}%` }}
                  transition={{ delay: 2.0 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
                  whileHover={{
                    backgroundColor: 'rgba(167, 139, 250, 0.8)',
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-ink/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${(height * 50).toLocaleString()}
                  </div>
                </motion.div>
              )
            )}
          </div>

          <div className="flex justify-between mt-2 text-xs text-ink/40 font-display">
            <span>jan</span>
            <span>feb</span>
            <span>mar</span>
            <span>apr</span>
            <span>may</span>
            <span>jun</span>
            <span>jul</span>
            <span>aug</span>
            <span>sep</span>
            <span>oct</span>
            <span>nov</span>
            <span>dec</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendDirection,
  accentBg,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  accentBg?: string;
}) {
  const getColorClasses = (colorName: string) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-600',
      taro: 'bg-violet-500/10 text-violet-600',
      green: 'bg-green-500/10 text-green-600',
      red: 'bg-red-500/10 text-red-600',
      orange: 'bg-orange-500/10 text-orange-600',
      purple: 'bg-purple-500/10 text-purple-600',
      indigo: 'bg-indigo-500/10 text-indigo-600',
      emerald: 'bg-emerald-500/10 text-emerald-600',
    };
    return colors[colorName as keyof typeof colors] || 'bg-gray-500/10 text-gray-600';
  };

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      className={`${accentBg || 'bg-milk-tea/70'} backdrop-blur-sm rounded-xl p-6 border shadow-lg hover:shadow-xl transition-shadow`}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'backOut' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-display text-ink/60 text-sm font-medium lowercase tracking-wide">
            {title}
          </p>
          <motion.p
            className="font-display text-2xl font-bold text-ink mt-1 mb-2 lowercase"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {value}
          </motion.p>
          {trend && (
            <motion.div
              className="flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className={`font-display text-sm font-medium ${getTrendColor()}`}>
                {getTrendIcon()}
              </span>
              <p className="font-display text-ink/50 text-xs lowercase">{trend}</p>
            </motion.div>
          )}
        </div>
        <motion.div
          className={`p-3 rounded-lg flex-shrink-0 ${getColorClasses(color)}`}
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function ActivityItem({
  action,
  description,
  time,
  type,
}: {
  action: string;
  description: string;
  time: string;
  type: 'user' | 'project' | 'payment' | 'contract';
}) {
  const getIconAndColor = () => {
    switch (action.toLowerCase()) {
      case 'message_sent':
        return {
          icon: '💬',
          color: 'bg-blue-100 text-blue-600',
          bgColor: 'from-blue-50 to-blue-100',
        };
      case 'contract_signed':
      case 'contract_created':
        return {
          icon: '📄',
          color: 'bg-green-100 text-green-600',
          bgColor: 'from-green-50 to-green-100',
        };
      case 'invoice_sent':
      case 'payment_received':
        return {
          icon: '💰',
          color: 'bg-yellow-100 text-yellow-600',
          bgColor: 'from-yellow-50 to-yellow-100',
        };
      case 'project_created':
      case 'project_updated':
        return {
          icon: '📁',
          color: 'bg-purple-100 text-purple-600',
          bgColor: 'from-purple-50 to-purple-100',
        };
      case 'client_invited':
      case 'user_registered':
        return {
          icon: '👤',
          color: 'bg-indigo-100 text-indigo-600',
          bgColor: 'from-indigo-50 to-indigo-100',
        };
      default:
        return {
          icon: '📌',
          color: 'bg-gray-100 text-gray-600',
          bgColor: 'from-gray-50 to-gray-100',
        };
    }
  };

  const { icon, color, bgColor } = getIconAndColor();

  return (
    <motion.div
      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors border bg-gradient-to-r ${bgColor} hover:shadow-md`}
      whileHover={{
        scale: 1.02,
        y: -1,
        transition: { duration: 0.2 },
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'backOut' }}
    >
      <motion.div
        className={`w-10 h-10 ${color} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm text-lg`}
        whileHover={{ rotate: 5, scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
      <div className="flex-1">
        <p className="font-display text-ink font-medium lowercase">{action.replace('_', ' ')}</p>
        <p className="font-display text-ink/60 text-sm lowercase">{description}</p>
      </div>
      <span className="font-display text-ink/50 text-xs lowercase flex-shrink-0">{time}</span>
    </motion.div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  color,
  hoverColor,
}: {
  icon: any;
  label: string;
  onClick: () => void;
  color?: string;
  hoverColor?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center space-x-2 p-3 bg-gradient-to-r ${color || 'from-taro/15 to-brown-sugar/15'} rounded-lg transition-all duration-300 group border border-white/40 backdrop-blur-sm shadow-sm hover:shadow-lg`}
      whileHover={{
        scale: 1.05,
        y: -2,
        backgroundImage: `linear-gradient(to right, ${hoverColor?.split(' ')[0]?.replace('from-', '') || 'rgba(167, 139, 250, 0.25)'}, ${hoverColor?.split(' ')[2]?.replace('to-', '') || 'rgba(139, 92, 246, 0.25)'})`,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'backOut' }}
    >
      <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ duration: 0.2 }}>
        <Icon className="w-5 h-5 text-gray-700 group-hover:text-gray-800" />
      </motion.div>
      <span className="font-display text-sm font-medium text-ink lowercase group-hover:font-semibold transition-all duration-200">
        {label}
      </span>
    </motion.button>
  );
}
