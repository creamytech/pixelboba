'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import {
  MessageSquare,
  FileText,
  CreditCard,
  FileCheck,
  Upload,
  Bell,
  User,
  LogOut,
  FolderOpen,
  Settings,
} from 'lucide-react';
import BobaProgressIndicator from '@/components/portal/BobaProgressIndicator';
import MilestoneTracker from '@/components/portal/MilestoneTracker';
import MessageCenter from '@/components/portal/MessageCenter';
import InvoiceCenter from '@/components/portal/InvoiceCenter';
import ContractCenter from '@/components/portal/ContractCenter';
import FileCenter from '@/components/portal/FileCenter';
import NotificationCenter from '@/components/portal/NotificationCenter';
import NotificationPreferences from '@/components/portal/NotificationPreferences';
import DashboardPearlField from '@/components/animations/DashboardPearlField';
import OnlineStatusIndicator from '@/components/common/OnlineStatusIndicator';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Project, User as UserType } from '@/types/portal';
import { Session } from 'next-auth';

interface PortalData {
  user: UserType;
  projects: Project[];
  unreadMessages: number;
  pendingInvoices: number;
  pendingContracts: number;
}

export default function ClientPortalClient({ session }: { session: Session }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize online status tracking
  useOnlineStatus();

  useEffect(() => {
    fetchPortalData();
  }, []);

  const fetchPortalData = async () => {
    try {
      const response = await fetch('/api/portal/dashboard');
      if (response.ok) {
        const data = await response.json();
        setPortalData(data);
      }
    } catch (error) {
      console.error('Error fetching portal data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-milk-tea via-background to-taro/20 relative overflow-hidden">
        <DashboardPearlField />
        <motion.div
          className="relative z-10 flex items-center justify-center min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center bg-milk-tea/70 backdrop-blur-lg rounded-xl p-8 border border-brown-sugar/20 shadow-xl">
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
              brewing your portal...
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!portalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-milk-tea via-background to-taro/20 relative overflow-hidden">
        <DashboardPearlField />
        <motion.div
          className="relative z-10 flex items-center justify-center min-h-screen"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center bg-milk-tea/70 backdrop-blur-lg rounded-xl p-8 border border-brown-sugar/20 shadow-xl">
            <p className="font-display text-ink mb-4 lowercase">unable to load portal data</p>
            <motion.button
              onClick={fetchPortalData}
              className="px-6 py-3 bg-gradient-to-r from-taro to-brown-sugar text-white font-display rounded-lg shadow-lg border border-white/20 backdrop-blur-sm lowercase"
              whileHover={{
                scale: 1.05,
                backgroundColor: 'rgba(167, 139, 250, 0.9)',
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              try again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'dashboard', icon: User },
    { id: 'messages', name: 'messages', icon: MessageSquare, badge: portalData.unreadMessages },
    { id: 'invoices', name: 'invoices', icon: CreditCard, badge: portalData.pendingInvoices },
    { id: 'contracts', name: 'contracts', icon: FileCheck, badge: portalData.pendingContracts },
    { id: 'files', name: 'files', icon: FolderOpen },
    { id: 'notifications', name: 'notifications', icon: Bell },
    { id: 'preferences', name: 'preferences', icon: Settings },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView data={portalData} />;
      case 'messages':
        return <MessageCenter projects={portalData.projects} />;
      case 'invoices':
        return <InvoiceCenter />;
      case 'contracts':
        return <ContractCenter />;
      case 'files':
        return <FileCenter projects={portalData.projects} />;
      case 'notifications':
        return <NotificationCenter />;
      case 'preferences':
        return <NotificationPreferences />;
      default:
        return <DashboardView data={portalData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-milk-tea via-background to-taro/20 relative overflow-hidden">
      <DashboardPearlField />

      {/* Enhanced Header with Motion */}
      <motion.div
        className="border-b border-brown-sugar/20 bg-milk-tea/80 backdrop-blur-lg sticky top-0 z-50 shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <motion.div
                className="flex items-center space-x-3"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <motion.div
                  whileHover={{
                    rotate: 5,
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Image
                    src="/Pixel_Boba_Icon_PNG.png"
                    alt="pixel boba"
                    width={56}
                    height={56}
                    className="h-14 w-14"
                    priority
                  />
                </motion.div>
              </motion.div>
              <motion.div
                className="hidden sm:flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div className="w-1 h-6 bg-gradient-to-b from-taro to-brown-sugar rounded-full"></div>
                <span className="font-display text-ink/70 font-medium lowercase">
                  client portal
                </span>
              </motion.div>
            </div>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {/* Message notification badge in header */}
              {portalData.unreadMessages > 0 && (
                <motion.button
                  onClick={() => setActiveTab('messages')}
                  className="relative flex items-center gap-2 px-3 py-2 bg-taro/10 hover:bg-taro/20 rounded-lg transition-colors group"
                  title={`${portalData.unreadMessages} unread message${portalData.unreadMessages > 1 ? 's' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageSquare size={16} className="text-taro" />
                  <span className="font-display text-sm font-medium text-taro">
                    {portalData.unreadMessages} new
                  </span>
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.button>
              )}

              <div className="hidden sm:block text-right">
                <div className="flex items-center justify-end space-x-2">
                  <div>
                    <p className="font-display text-sm font-medium text-ink lowercase">
                      welcome back!
                    </p>
                    <p className="font-display text-xs text-ink/60 lowercase">
                      {portalData.user.name}
                    </p>
                  </div>
                  <OnlineStatusIndicator isOnline={true} size="sm" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {portalData.user.image && (
                  <motion.img
                    src={portalData.user.image}
                    alt={portalData.user.name || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-taro/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <motion.button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-ink/60 hover:text-taro hover:bg-taro/10 rounded-lg transition-all duration-200 group"
                  title="Sign out"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 relative z-10 overflow-hidden">
        {/* Enhanced Navigation Tabs with Motion */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <motion.nav
            className="flex flex-wrap justify-center gap-2 sm:space-x-2 sm:gap-0 bg-milk-tea/60 backdrop-blur-lg rounded-xl p-2 border border-brown-sugar/20 shadow-lg"
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
                  className={`relative flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 group overflow-visible ${
                    isActive
                      ? 'bg-gradient-to-r from-taro to-brown-sugar text-white shadow-lg'
                      : 'text-ink/70 hover:text-ink hover:bg-milk-tea/80 hover:shadow-md'
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
                  <span className="font-medium lowercase hidden sm:inline">{tab.name}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <motion.span
                      className={`absolute -top-3 -right-3 min-w-6 h-6 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg z-10 ${
                        isActive ? 'bg-white/20 backdrop-blur-sm' : 'bg-brown-sugar'
                      }`}
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </motion.span>
                  )}
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

        {/* Enhanced Content with Staggered Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'backOut' }}
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function DashboardView({ data }: { data: PortalData }) {
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const activeProject =
    data.projects.find((p) => p.status !== 'COMPLETED' && p.status !== 'CANCELLED') ||
    data.projects[0];

  // Calculate dashboard stats
  const stats = {
    activeProjects: data.projects.filter((p) => !['COMPLETED', 'CANCELLED'].includes(p.status))
      .length,
    daysToDeadline: activeProject?.deadline
      ? Math.ceil(
          (new Date(activeProject.deadline).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null,
    completedMilestones: data.projects.reduce(
      (acc, project) => acc + (project.milestones?.filter((m) => m.completedAt).length || 0),
      0
    ),
    totalProgress:
      data.projects.length > 0
        ? Math.round(data.projects.reduce((acc, p) => acc + p.progress, 0) / data.projects.length)
        : 0,
  };

  // Filter projects based on search and status
  const filteredProjects = data.projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Dashboard Overview Stats - Mobile Responsive */}
      <motion.div
        className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <DashboardStatCard
          title="active projects"
          value={stats.activeProjects}
          icon="🚧"
          color="taro"
          subtitle={`${data.projects.length} total`}
        />
        <DashboardStatCard
          title="next deadline"
          value={stats.daysToDeadline !== null ? `${stats.daysToDeadline}d` : 'tbd'}
          icon="⏰"
          color="matcha"
          subtitle={
            stats.daysToDeadline !== null
              ? stats.daysToDeadline > 7
                ? 'on track'
                : 'coming up'
              : 'no deadline set'
          }
        />
        <DashboardStatCard
          title="milestones done"
          value={stats.completedMilestones}
          icon="✅"
          color="milk-tea"
          subtitle={`${stats.totalProgress}% overall`}
        />
        <DashboardStatCard
          title="new messages"
          value={data.unreadMessages}
          icon="💬"
          color="brown-sugar"
          subtitle={data.unreadMessages > 0 ? 'needs attention' : 'all caught up'}
          isAlert={data.unreadMessages > 0}
        />
      </motion.div>

      {/* Search and Filter Controls - Mobile Enhanced */}
      {data.projects.length > 0 && (
        <motion.div
          className="bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-brown-sugar/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex flex-col gap-3">
            {/* Search and Status Filter Row */}
            <div className="flex flex-col xs:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-2 text-sm bg-white/70 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro/40 transition-all"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink/40 text-sm">
                  🔍
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ink/40 hover:text-ink/70 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-2.5 sm:py-2 text-sm bg-white/70 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro/40 transition-all min-w-32"
              >
                <option value="all">all statuses</option>
                <option value="ACTIVE">active</option>
                <option value="IN_PROGRESS">in progress</option>
                <option value="REVIEW">in review</option>
                <option value="COMPLETED">completed</option>
              </select>
            </div>

            {/* View Mode Toggle and Results Count */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-ink/60">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink/60 hidden xs:inline">view:</span>
                <div className="flex bg-white/50 rounded-lg p-0.5 border border-brown-sugar/10">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      viewMode === 'cards'
                        ? 'bg-taro text-white shadow-sm'
                        : 'text-ink/60 hover:bg-taro/10 hover:text-taro'
                    }`}
                  >
                    📋 cards
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      viewMode === 'timeline'
                        ? 'bg-taro text-white shadow-sm'
                        : 'text-ink/60 hover:bg-taro/10 hover:text-taro'
                    }`}
                  >
                    📅 timeline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Projects Display */}
      {filteredProjects.length > 0 ? (
        viewMode === 'cards' ? (
          <div className="space-y-6">
            {filteredProjects.map((project, index) => (
              <EnhancedProjectCard
                key={project.id}
                project={project}
                index={index}
                isActive={project.id === activeProject?.id}
              />
            ))}
          </div>
        ) : (
          <TimelineView projects={filteredProjects} />
        )
      ) : data.projects.length > 0 && (searchTerm || statusFilter !== 'all') ? (
        <EmptySearchState searchTerm={searchTerm} statusFilter={statusFilter} />
      ) : (
        <EmptyProjectsState />
      )}

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="active projects"
          value={data.projects.filter((p) => !['COMPLETED', 'CANCELLED'].includes(p.status)).length}
          icon="🚧"
        />
        <StatCard title="unread messages" value={data.unreadMessages} icon="💬" />
        <StatCard title="pending invoices" value={data.pendingInvoices} icon="💰" />
        <StatCard title="pending contracts" value={data.pendingContracts} icon="📋" />
      </div>

      {/* Recent Activity */}
      <div className="bg-milk-tea/70 backdrop-blur-sm rounded-xl p-6 border border-brown-sugar/20 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold text-ink">recent activity</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-taro rounded-full animate-pulse"></div>
            <span className="text-xs text-ink/50">live updates</span>
          </div>
        </div>
        <div className="space-y-3">
          {activeProject ? (
            <>
              {/* Show real activity if there are pending items */}
              {data.pendingInvoices > 0 && (
                <ActivityItem
                  action="invoice pending"
                  description={`${data.pendingInvoices} invoice${data.pendingInvoices > 1 ? 's' : ''} awaiting payment`}
                  time="pending"
                  type="payment"
                />
              )}
              {data.unreadMessages > 0 && (
                <ActivityItem
                  action="new messages"
                  description={`${data.unreadMessages} unread message${data.unreadMessages > 1 ? 's' : ''} from your project manager`}
                  time="2h ago"
                  type="message"
                />
              )}
              {data.pendingContracts > 0 && (
                <ActivityItem
                  action="contract review"
                  description={`${data.pendingContracts} contract${data.pendingContracts > 1 ? 's' : ''} pending your signature`}
                  time="1d ago"
                  type="contract"
                />
              )}

              {/* Sample activity events to show what clients can expect */}
              <ActivityItem
                action="milestone completed"
                description="discovery phase finished - design phase starting soon"
                time="3d ago"
                type="project"
              />
              <ActivityItem
                action="design review ready"
                description="initial mockups ready for your feedback"
                time="5d ago"
                type="project"
              />
              <ActivityItem
                action="project kickoff"
                description="welcome to your project! we're excited to work with you"
                time="1w ago"
                type="general"
              />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-taro/20 to-brown-sugar/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-taro/60" />
              </div>
              <h4 className="font-display text-lg font-semibold text-ink mb-2">stay in the loop</h4>
              <p className="text-ink/60 text-sm mb-4 max-w-sm mx-auto">
                project updates, messages, and notifications will appear here once we start working
                together
              </p>
              <div className="space-y-3 max-w-sm mx-auto">
                {/* Sample events to show what they can expect */}
                <div className="bg-white/50 rounded-lg p-3 text-left">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-taro">📋</span>
                    <span className="font-medium text-ink/80">project milestone completed</span>
                  </div>
                  <p className="text-xs text-ink/60 mt-1 ml-6">
                    get notified when phases are finished
                  </p>
                </div>
                <div className="bg-white/50 rounded-lg p-3 text-left">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-brown-sugar">💬</span>
                    <span className="font-medium text-ink/80">new message from team</span>
                  </div>
                  <p className="text-xs text-ink/60 mt-1 ml-6">
                    stay connected with your project manager
                  </p>
                </div>
                <div className="bg-white/50 rounded-lg p-3 text-left">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-taro">💰</span>
                    <span className="font-medium text-ink/80">invoice ready</span>
                  </div>
                  <p className="text-xs text-ink/60 mt-1 ml-6">
                    receive and pay invoices seamlessly
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-milk-tea/70 backdrop-blur-sm rounded-xl p-6 border border-brown-sugar/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-ink/60 text-sm font-medium uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-ink mt-2 mb-1">{value}</p>
          {value > 0 && (
            <div className="w-full bg-taro/10 rounded-full h-1.5 mt-2">
              <div
                className="bg-gradient-to-r from-taro to-brown-sugar h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (value / 10) * 100)}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="ml-4 p-3 bg-gradient-to-br from-taro/10 to-brown-sugar/10 rounded-xl">
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  action,
  description,
  time,
  type = 'general',
}: {
  action: string;
  description: string;
  time: string;
  type?: 'project' | 'message' | 'contract' | 'payment' | 'general';
}) {
  const getActivityIcon = () => {
    switch (type) {
      case 'project':
        return <FolderOpen className="w-4 h-4 text-taro" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-brown-sugar" />;
      case 'contract':
        return <FileCheck className="w-4 h-4 text-green-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-orange-600" />;
      default:
        return <div className="w-2 h-2 bg-taro rounded-full"></div>;
    }
  };

  const getActivityColor = () => {
    switch (type) {
      case 'project':
        return 'bg-taro/10 border-taro/20';
      case 'message':
        return 'bg-brown-sugar/10 border-brown-sugar/20';
      case 'contract':
        return 'bg-green-100 border-green-200';
      case 'payment':
        return 'bg-orange-100 border-orange-200';
      default:
        return 'bg-taro/10 border-taro/20';
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-milk-tea/10 transition-all duration-200 group border border-transparent hover:border-ink/5">
      <div
        className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ${getActivityColor()}`}
      >
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-ink font-semibold text-sm capitalize group-hover:text-taro transition-colors">
          {action}
        </p>
        <p className="text-ink/70 text-sm mt-1 line-clamp-2">{description}</p>
        <span className="text-ink/50 text-xs mt-2 inline-block">{time}</span>
      </div>
    </div>
  );
}

// Enhanced Components

function DashboardStatCard({
  title,
  value,
  icon,
  color,
  subtitle,
  isAlert = false,
}: {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  subtitle: string;
  isAlert?: boolean;
}) {
  return (
    <motion.div
      className={`relative bg-white/60 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 hover:shadow-lg hover:scale-105 ${
        isAlert ? 'border-orange-200 bg-orange-50/60' : 'border-brown-sugar/20'
      }`}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {isAlert && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-ink/60 text-xs font-medium uppercase tracking-wide mb-1">{title}</p>
          <p className="text-2xl font-bold text-ink mb-1">{value}</p>
          <p className="text-xs text-ink/50">{subtitle}</p>
        </div>
        <div className={`ml-3 p-2 bg-${color}/10 rounded-lg`}>
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </motion.div>
  );
}

function EnhancedProjectCard({
  project,
  index,
  isActive,
}: {
  project: Project;
  index: number;
  isActive: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'ACTIVE':
      case 'IN_PROGRESS':
        return 'bg-taro/10 text-taro border-taro/20';
      case 'REVIEW':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const progressPercentage = project.progress || 0;

  return (
    <motion.div
      className={`bg-white/70 backdrop-blur-lg rounded-xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 ${
        isActive ? 'border-taro/30 ring-2 ring-taro/10' : 'border-brown-sugar/20'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-display text-xl font-semibold text-ink mb-2 lowercase flex items-center gap-2">
            {project.name}
            {isActive && (
              <span className="text-xs bg-taro/20 text-taro px-2 py-1 rounded-full">active</span>
            )}
          </h3>
          <p className="font-display text-ink/70 lowercase">
            {project.description || 'no description available'}
          </p>
        </div>
        <div className="ml-4">
          <BobaProgressIndicator
            progress={progressPercentage}
            status={project.status}
            size="small"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-ink/60">project progress</span>
          <span className="text-sm font-bold text-ink">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-taro to-brown-sugar"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Project Details Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <span
            className={`inline-block font-display font-medium px-3 py-1 rounded-full text-sm border lowercase ${getStatusColor(project.status)}`}
          >
            {project.status.toLowerCase().replace('_', ' ')}
          </span>
        </div>
        <div className="text-center">
          <p className="font-display text-ink/60 text-sm lowercase">deadline</p>
          <p className="font-display font-medium text-ink">
            {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'tbd'}
          </p>
        </div>
        <div className="text-center">
          <p className="font-display text-ink/60 text-sm lowercase">started</p>
          <p className="font-display font-medium text-ink">
            {new Date(project.startDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Project Milestones */}
      <motion.div
        className="border-t border-ink/10 pt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <h4 className="font-display text-sm font-semibold text-ink mb-3 lowercase">
          project milestones
        </h4>
        <MilestoneTracker
          milestones={project.milestones}
          currentPhase={project.status.toLowerCase()}
          estimatedDeadline={project.deadline ? project.deadline.toString() : undefined}
        />
      </motion.div>

      {/* Real-Time Progress Link */}
      {project.websiteUrl && (
        <motion.div
          className="border-t border-ink/10 pt-4 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="bg-taro/5 border border-taro/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-taro">🌐</span>
              <h4 className="font-display text-sm font-semibold text-taro lowercase">
                live project progress
              </h4>
            </div>
            <p className="text-xs text-ink/60 mb-3">
              view your project&apos;s real-time progress and updates
            </p>
            <a
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-taro text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-taro/80 transition-colors"
            >
              <span>view live progress</span>
              <span className="text-taro-200">↗</span>
            </a>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4">
        <button className="flex-1 bg-taro/10 hover:bg-taro/20 text-taro px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          💬 message
        </button>
        <button className="flex-1 bg-brown-sugar/10 hover:bg-brown-sugar/20 text-brown-sugar px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          📁 files
        </button>
      </div>
    </motion.div>
  );
}

function TimelineView({ projects }: { projects: Project[] }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-taro via-brown-sugar to-milk-tea"></div>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="relative flex items-start gap-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Timeline Node */}
            <div className="relative z-10 w-16 h-16 bg-white border-4 border-taro rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg">{project.status === 'COMPLETED' ? '✅' : '🚧'}</span>
            </div>

            {/* Project Card */}
            <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-brown-sugar/20 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-lg font-semibold text-ink lowercase">
                  {project.name}
                </h3>
                <span className="text-sm text-ink/60">
                  {new Date(project.startDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-ink/70 mb-4 lowercase">
                {project.description || 'no description available'}
              </p>

              {/* Progress */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-taro to-brown-sugar transition-all duration-1000"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-ink">{project.progress}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function EmptySearchState({
  searchTerm,
  statusFilter,
}: {
  searchTerm: string;
  statusFilter: string;
}) {
  return (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-taro/20 to-brown-sugar/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🔍</span>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink mb-2 lowercase">
        no projects found
      </h3>
      <p className="text-ink/60 mb-4">
        {searchTerm && statusFilter !== 'all'
          ? `no projects match "${searchTerm}" with status "${statusFilter}"`
          : searchTerm
            ? `no projects match "${searchTerm}"`
            : `no projects with status "${statusFilter}"`}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="text-taro hover:text-brown-sugar transition-colors font-medium"
      >
        clear filters →
      </button>
    </motion.div>
  );
}

function EmptyProjectsState() {
  return (
    <motion.div
      className="bg-white/60 backdrop-blur-lg rounded-xl p-8 border border-brown-sugar/20 shadow-lg text-center"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Floating Illustrations */}
      <div className="relative mb-6">
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-taro/15 to-brown-sugar/15 rounded-full flex items-center justify-center mx-auto shadow-sm"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-4xl">🎨</span>
        </motion.div>

        {/* Floating pearls */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-taro/30 rounded-full"
              style={{
                left: `${30 + i * 20}%`,
                top: `${20 + i * 15}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      <motion.h2
        className="font-display text-3xl font-bold text-ink mb-4 lowercase"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        welcome to your portal!
      </motion.h2>

      <motion.p
        className="font-display text-ink/70 mb-8 text-lg lowercase max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        your projects will appear here once we start working together. in the meantime, feel free to
        explore the different sections and get familiar with your dashboard.
      </motion.p>

      {/* Feature Preview Cards */}
      <motion.div
        className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { emoji: '📊', title: 'project tracking', desc: 'real-time progress updates' },
          { emoji: '💬', title: 'team messaging', desc: 'direct communication channel' },
          { emoji: '📁', title: 'file sharing', desc: 'organized project assets' },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-white/50 rounded-xl p-4 border border-brown-sugar/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className="text-2xl mb-2">{feature.emoji}</div>
            <h3 className="font-display font-semibold text-ink mb-1 lowercase">{feature.title}</h3>
            <p className="text-sm text-ink/60 lowercase">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex justify-center space-x-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {[
          { emoji: '🎨', text: 'design & development', color: 'taro' },
          { emoji: '📱', text: 'digital solutions', color: 'brown-sugar' },
        ].map((tag, index) => (
          <motion.div
            key={tag.text}
            className={`px-6 py-3 bg-${tag.color}/15 text-${tag.color} rounded-lg font-display font-medium border border-${tag.color}/20 lowercase`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {tag.emoji} {tag.text}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// Loading and Skeleton Components

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/40 rounded-xl p-4 border border-brown-sugar/10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded mb-2 w-20"></div>
                <div className="h-6 bg-gray-300 rounded mb-1 w-12"></div>
                <div className="h-2 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Card Skeleton */}
      <div className="bg-white/40 rounded-xl p-6 border border-brown-sugar/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded mb-2 w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-72"></div>
          </div>
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        </div>

        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
          <div className="w-full bg-gray-200 rounded-full h-2"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-6 bg-gray-200 rounded-full w-20 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="h-4 bg-gray-200 rounded mb-4 w-36"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      className="bg-white/40 rounded-xl p-6 border border-brown-sugar/10 animate-pulse"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-300 rounded mb-2 w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-72"></div>
        </div>
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="h-3 bg-gray-200 rounded w-28"></div>
          <div className="h-3 bg-gray-300 rounded w-8"></div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-6 bg-gray-200 rounded-full w-20 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="h-4 bg-gray-200 rounded mb-3 w-32"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded mb-1 w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
      </div>
    </motion.div>
  );
}

function LoadingSpinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <motion.div
      className={`border-2 border-taro/30 border-t-taro rounded-full ${sizeClasses[size]}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function ProgressiveLoader({
  isLoading,
  skeletonComponent,
  children,
}: {
  isLoading: boolean;
  skeletonComponent: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {skeletonComponent}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
