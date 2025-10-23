'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import {
  Users,
  FolderOpen,
  FileText,
  CreditCard,
  DollarSign,
  Calendar,
  CheckSquare,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import ProjectManager from '@/components/admin/ProjectManager';
import ClientManager from '@/components/admin/ClientManager';
import ContractManager from '@/components/admin/ContractManager';
import InvoiceManager from '@/components/admin/InvoiceManager';
import AdminSettings from '@/components/admin/AdminSettings';
import InviteManager from '@/components/admin/InviteManager';
import AdminMessageCenter from '@/components/admin/AdminMessageCenter';
import ProjectTaskBoard from '@/components/kanban/ProjectTaskBoard';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import RequestManager from '@/components/admin/RequestManager';
import MeetingManager from '@/components/admin/MeetingManager';
import NotificationSender from '@/components/admin/NotificationSender';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
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
  const [projects, setProjects] = useState([]);

  // Initialize online status tracking
  useOnlineStatus();

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
      <div className="min-h-screen bg-gradient-to-br from-milk-tea/20 via-white to-taro/10 relative overflow-hidden flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center bg-white rounded-xl p-8 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]"
        >
          <motion.div
            className="w-12 h-12 border-4 border-taro/30 border-t-taro rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.p
            className="font-display text-ink/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            brewing your admin panel...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} setActiveTab={setActiveTab} />;
      case 'tasks':
        return <AdminTasksView projects={projects} />;
      case 'projects':
        return <ProjectManager />;
      case 'clients':
        return <ClientManager />;
      case 'requests':
        return <RequestManager />;
      case 'meetings':
        return <MeetingManager />;
      case 'messages':
        return <AdminMessageCenter />;
      case 'notifications':
        return <NotificationSender />;
      case 'contracts':
        return <ContractManager />;
      case 'invoices':
        return <InvoiceManager />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'invites':
        return <InviteManager />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <OverviewTab stats={stats} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-milk-tea/20 via-white to-taro/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative bubbles */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-taro/10 to-transparent rounded-full blur-3xl"
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
          className="absolute w-80 h-80 bg-gradient-to-br from-brown-sugar/10 to-transparent rounded-full blur-3xl"
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
            className="absolute w-2 h-2 bg-taro/20 rounded-full"
            animate={{
              y: ['100vh', '-10vh'],
              x: [Math.random() * 100 + 'vw', Math.random() * 100 + 'vw'],
              opacity: [0, 0.6, 0],
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
      <Sidebar
        user={{
          name: session?.user?.name || 'Admin',
          email: session?.user?.email || '',
          image: session?.user?.image,
          role: 'Admin',
        }}
        onLogout={() => signOut({ callbackUrl: '/' })}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <motion.main
        className="lg:ml-[280px] min-h-screen p-4 sm:p-6 lg:p-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardHeader userName={session?.user?.name || 'Admin'} />

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveTab()}
        </motion.div>
      </motion.main>
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
        className="min-h-[400px] bg-milk-tea rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center"
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
            className="font-display text-ink/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Loading statistics...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  const metrics = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      subtitle: `+${Math.floor(stats.totalClients * 0.12)} this month`,
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: FolderOpen,
      gradient: 'from-taro to-deep-taro',
      subtitle: `${stats.completedProjects} completed`,
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-matcha to-matcha/80',
      change: {
        value: Math.floor(stats.monthlyRevenue * 0.15),
        type: 'increase' as const,
      },
    },
    {
      title: 'Pending Invoices',
      value: stats.pendingInvoices,
      icon: CreditCard,
      gradient: 'from-strawberry to-strawberry/80',
      subtitle: `${stats.paidInvoices} paid`,
    },
    {
      title: 'Pending Contracts',
      value: stats.pendingContracts,
      icon: FileText,
      gradient: 'from-thai-tea to-thai-tea/80',
      subtitle: `${stats.signedContracts} signed`,
    },
    {
      title: 'Avg Project Time',
      value: stats.averageProjectDuration > 0 ? stats.averageProjectDuration : 'N/A',
      icon: Calendar,
      gradient: 'from-brown-sugar to-brown-sugar/80',
      suffix: stats.averageProjectDuration > 0 ? 'd' : '',
      subtitle: `${stats.completedProjects} projects`,
    },
  ];

  // Quick action cards for the overview
  const quickActionCards = [
    {
      title: 'Add New Client',
      description: 'Invite a client to the portal',
      icon: Users,
      color: 'from-blue-500/10 to-blue-600/10',
      onClick: () => setActiveTab('clients'),
    },
    {
      title: 'Create Project',
      description: 'Start a new project',
      icon: FolderOpen,
      color: 'from-taro/10 to-deep-taro/10',
      onClick: () => setActiveTab('projects'),
    },
    {
      title: 'Send Contract',
      description: 'Create and send a contract',
      icon: FileText,
      color: 'from-green-500/10 to-green-600/10',
      onClick: () => setActiveTab('contracts'),
    },
    {
      title: 'New Invoice',
      description: 'Generate an invoice',
      icon: CreditCard,
      color: 'from-orange-500/10 to-orange-600/10',
      onClick: () => setActiveTab('invoices'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* Quick Action Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <h3 className="font-display text-2xl font-black uppercase text-ink mb-6 bg-gradient-to-r from-taro via-brown-sugar to-taro bg-clip-text text-transparent">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActionCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.title}
                onClick={card.onClick}
                className={`bg-gradient-to-r ${card.color} rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] transition-all text-left font-black uppercase`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-taro" />
                  </div>
                </div>
                <h4 className="font-display font-black text-ink mb-1">{card.title}</h4>
                <p className="font-display text-sm font-bold text-ink/60">{card.description}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="bg-white rounded-xl p-8 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.0 }}
      >
        <h3 className="font-display text-2xl font-black uppercase text-ink mb-6 bg-gradient-to-r from-taro via-brown-sugar to-taro bg-clip-text text-transparent">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.slice(0, 6).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.1 + index * 0.05 }}
                className="flex items-start gap-4 p-4 bg-milk-tea/30 rounded-2xl hover:bg-milk-tea/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-taro mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-ink">
                    {activity.action.replace('_', ' ')}
                  </p>
                  <p className="text-sm font-bold text-ink/60 truncate">
                    {activity.user.name || activity.user.email}
                    {activity.project && ` • ${activity.project.name}`} - {activity.description}
                  </p>
                </div>
                <span className="text-xs text-ink/40 whitespace-nowrap">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-ink/50">
              <p className="font-display">No recent activity</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Revenue Chart */}
      <motion.div
        className="bg-white rounded-xl p-8 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.2 }}
      >
        <h3 className="font-display text-2xl font-black uppercase text-ink mb-6 bg-gradient-to-r from-taro via-brown-sugar to-taro bg-clip-text text-transparent">
          Revenue Overview
        </h3>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-display text-sm font-bold uppercase text-ink/60">This Month</p>
            <p className="font-display text-3xl font-black text-ink">
              ${stats.monthlyRevenue.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-sm font-bold text-matcha flex items-center gap-1 justify-end">
              <span className="text-2xl">↗</span> +{Math.floor(stats.monthlyRevenue * 0.15)}%
            </p>
            <p className="font-display text-xs font-bold uppercase text-ink/50">vs last month</p>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="relative h-48 flex items-end justify-between gap-2">
          {[65, 45, 80, 55, 90, 70, 85, 95, 75, 60, 88, stats.monthlyRevenue / 100].map(
            (height, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-t from-taro/60 to-taro/40 rounded-t-xl flex-1 min-h-[8px] relative group cursor-pointer"
                style={{ height: `${Math.max(height * 0.8, 8)}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height * 0.8, 8)}%` }}
                transition={{ delay: 1.4 + index * 0.05, duration: 0.5, ease: 'easeOut' }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: 'rgba(167, 139, 250, 0.8)',
                  transition: { duration: 0.2 },
                }}
              >
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-ink/90 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                  ${(height * 50).toLocaleString()}
                </div>
              </motion.div>
            )
          )}
        </div>

        <div className="flex justify-between mt-4 text-xs text-ink/40 font-display">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
            (month) => (
              <span key={month}>{month}</span>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}

function AdminTasksView({ projects }: { projects: any[] }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<'single' | 'overview'>('single');
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch all tasks for overview statistics
  useEffect(() => {
    if (viewMode === 'overview') {
      fetchAllTasks();
    }
  }, [viewMode]);

  const fetchAllTasks = async () => {
    setIsLoadingStats(true);
    try {
      const taskPromises = projects.map((project) =>
        fetch(`/api/tasks?projectId=${project.id}`)
          .then((res) => (res.ok ? res.json() : []))
          .catch(() => [])
      );
      const tasksArrays = await Promise.all(taskPromises);
      const combined = tasksArrays.flat();
      setAllTasks(combined);
    } catch (error) {
      console.error('Failed to fetch all tasks:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Auto-select first active project
  useEffect(() => {
    if (projects.length > 0 && selectedProjectId === 'all' && viewMode === 'single') {
      const activeProjects = projects.filter((p) => !['COMPLETED', 'CANCELLED'].includes(p.status));
      const defaultProject = activeProjects.length > 0 ? activeProjects[0] : projects[0];
      if (defaultProject) {
        setSelectedProjectId(defaultProject.id);
      }
    }
  }, [projects, selectedProjectId, viewMode]);

  // Calculate task statistics
  const getTaskStats = () => {
    if (viewMode === 'single' || allTasks.length === 0) return null;

    const stats = {
      total: allTasks.length,
      backlog: allTasks.filter((t) => t.status === 'BACKLOG').length,
      todo: allTasks.filter((t) => t.status === 'TODO').length,
      inProgress: allTasks.filter((t) => t.status === 'IN_PROGRESS').length,
      inReview: allTasks.filter((t) => t.status === 'IN_REVIEW').length,
      completed: allTasks.filter((t) => t.status === 'COMPLETED').length,
      blocked: allTasks.filter((t) => t.status === 'BLOCKED').length,
      highPriority: allTasks.filter((t) => t.priority === 'HIGH' || t.priority === 'URGENT').length,
      overdue: allTasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED'
      ).length,
    };

    return stats;
  };

  const taskStats = getTaskStats();

  if (projects.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-xl p-12 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-taro/20 to-brown-sugar/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckSquare className="w-8 h-8 text-taro/60" />
        </div>
        <h3 className="font-display text-xl font-black uppercase text-ink mb-2">No projects yet</h3>
        <p className="font-bold text-ink/60">Create projects to start managing tasks</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Switcher & Filters */}
      <motion.div
        className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-bold uppercase text-ink/70">View:</span>
            <div className="flex bg-milk-tea/50 rounded-xl p-1 border-4 border-ink">
              <button
                onClick={() => setViewMode('single')}
                className={`px-4 py-2 rounded-lg font-display text-sm font-black uppercase transition-all ${
                  viewMode === 'single'
                    ? 'bg-gradient-to-r from-taro to-brown-sugar text-white shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]'
                    : 'text-ink/60 hover:bg-taro/10 hover:text-taro'
                }`}
              >
                Single Project
              </button>
              <button
                onClick={() => setViewMode('overview')}
                className={`px-4 py-2 rounded-lg font-display text-sm font-black uppercase transition-all ${
                  viewMode === 'overview'
                    ? 'bg-gradient-to-r from-taro to-brown-sugar text-white shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]'
                    : 'text-ink/60 hover:bg-taro/10 hover:text-taro'
                }`}
              >
                Overview
              </button>
            </div>
          </div>

          {/* Project Selector */}
          {viewMode === 'single' && (
            <div className="flex-1 max-w-md">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-4 py-3 bg-white border-4 border-ink rounded-xl focus:outline-none focus:ring-2 focus:ring-taro/30 focus:border-taro transition-all font-display font-bold text-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.status?.toLowerCase().replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </motion.div>

      {/* Task Overview Statistics */}
      {viewMode === 'overview' && taskStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Total Tasks', value: taskStats.total, icon: '📊', color: 'blue' },
              { title: 'In Progress', value: taskStats.inProgress, icon: '⚡', color: 'taro' },
              { title: 'Completed', value: taskStats.completed, icon: '✅', color: 'matcha' },
              {
                title: 'High Priority',
                value: taskStats.highPriority,
                icon: '🔥',
                color: 'strawberry',
              },
              { title: 'Overdue', value: taskStats.overdue, icon: '⚠️', color: 'thai-tea' },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                className={`bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{stat.icon}</span>
                  {stat.title === 'Overdue' && stat.value > 0 && (
                    <motion.div
                      className="w-3 h-3 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                <p className="font-display text-sm font-bold uppercase text-ink/60 mb-1">
                  {stat.title}
                </p>
                <p className="font-display text-3xl font-black text-ink">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Project-wise Breakdown */}
          <motion.div
            className="bg-white rounded-xl p-8 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <h3 className="font-display text-2xl font-black uppercase text-ink mb-6 bg-gradient-to-r from-taro via-brown-sugar to-taro bg-clip-text text-transparent">
              Tasks by Project
            </h3>
            <div className="space-y-4">
              {projects.map((project) => {
                const projectTasks = allTasks.filter((t) => t.projectId === project.id);
                const completedCount = projectTasks.filter((t) => t.status === 'COMPLETED').length;
                const progressPercent =
                  projectTasks.length > 0
                    ? Math.round((completedCount / projectTasks.length) * 100)
                    : 0;

                return (
                  <motion.button
                    key={project.id}
                    className="w-full bg-milk-tea/50 rounded-xl p-6 border-4 border-ink hover:border-taro transition-all text-left shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)]"
                    whileHover={{ scale: 1.01, y: -2 }}
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setViewMode('single');
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-display font-black text-ink text-lg">{project.name}</h4>
                      <span className="font-display text-sm font-bold uppercase text-ink/60 bg-white/60 px-3 py-1 rounded-full">
                        {projectTasks.length} tasks
                      </span>
                    </div>
                    <div className="w-full bg-white/60 rounded-full h-3 mb-2">
                      <motion.div
                        className="h-3 rounded-full bg-gradient-to-r from-taro to-brown-sugar"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-bold text-ink/60">
                        {completedCount} completed
                      </span>
                      <span className="font-display text-sm font-black text-taro">
                        {progressPercent}%
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Single Project Kanban Board */}
      {viewMode === 'single' && selectedProjectId && selectedProjectId !== 'all' && (
        <motion.div
          key={selectedProjectId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProjectTaskBoard
            projectId={selectedProjectId}
            projectName={projects.find((p) => p.id === selectedProjectId)?.name || 'Project'}
            currentUser={{
              id: 'admin',
              role: 'ADMIN',
              email: 'admin@pixelboba.com',
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
