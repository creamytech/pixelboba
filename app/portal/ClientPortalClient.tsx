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
} from 'lucide-react';
import BobaProgressIndicator from '@/components/portal/BobaProgressIndicator';
import MilestoneTracker from '@/components/portal/MilestoneTracker';
import MessageCenter from '@/components/portal/MessageCenter';
import InvoiceCenter from '@/components/portal/InvoiceCenter';
import ContractCenter from '@/components/portal/ContractCenter';
import FileCenter from '@/components/portal/FileCenter';
import NotificationCenter from '@/components/portal/NotificationCenter';
import DashboardPearlField from '@/components/animations/DashboardPearlField';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    src="/brand/Pixel_Boba_Icon_01.svg"
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
                <p className="font-display text-sm font-medium text-ink lowercase">welcome back!</p>
                <p className="font-display text-xs text-ink/60 lowercase">{portalData.user.name}</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Enhanced Navigation Tabs with Motion */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <motion.nav
            className="flex flex-wrap gap-2 sm:space-x-2 sm:gap-0 bg-milk-tea/60 backdrop-blur-lg rounded-xl p-2 border border-brown-sugar/20 shadow-lg"
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
  const activeProject =
    data.projects.find((p) => p.status !== 'COMPLETED' && p.status !== 'CANCELLED') ||
    data.projects[0];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Enhanced Active Project Section */}
      {activeProject ? (
        <motion.div
          className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20 shadow-lg hover:shadow-xl transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <motion.h2
            className="font-display text-2xl font-bold text-ink mb-6 lowercase"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            current project
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="font-display text-xl font-semibold text-ink mb-2 lowercase">
                {activeProject.name}
              </h3>
              <p className="font-display text-ink/70 mb-4 lowercase">
                {activeProject.description || 'no description available'}
              </p>

              <div className="space-y-3">
                {[
                  {
                    label: 'status',
                    value: (
                      <span className="font-display font-medium text-ink bg-gradient-to-r from-taro/15 to-brown-sugar/15 text-taro px-3 py-1 rounded-full text-sm border border-taro/20 lowercase">
                        {activeProject.status.toLowerCase().replace('_', ' ')}
                      </span>
                    ),
                  },
                  {
                    label: 'deadline',
                    value: activeProject.deadline
                      ? new Date(activeProject.deadline).toLocaleDateString()
                      : 'TBD',
                  },
                  {
                    label: 'started',
                    value: new Date(activeProject.startDate).toLocaleDateString(),
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <span className="font-display text-ink/60 lowercase">{item.label}:</span>
                    <span className="font-display font-medium text-ink lowercase">
                      {typeof item.value === 'string' ? item.value : item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-2 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <MilestoneTracker
                milestones={activeProject.milestones}
                currentPhase={activeProject.status.toLowerCase()}
                estimatedDeadline={
                  activeProject.deadline ? activeProject.deadline.toString() : undefined
                }
              />
            </motion.div>

            {/* Keep the boba indicator as a summary widget */}
            <motion.div
              className="flex justify-center md:justify-end"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <BobaProgressIndicator
                progress={activeProject.progress}
                status={activeProject.status}
                size="medium"
              />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-8 border border-brown-sugar/20 shadow-lg text-center"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-taro/15 to-brown-sugar/15 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FileText className="w-8 h-8 text-taro" />
          </motion.div>
          <motion.h2
            className="font-display text-2xl font-bold text-ink mb-2 lowercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            welcome to your portal!
          </motion.h2>
          <motion.p
            className="font-display text-ink/70 mb-6 lowercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            your projects will appear here once we start working together. in the meantime, feel
            free to explore the different sections.
          </motion.p>
          <motion.div
            className="flex justify-center space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { emoji: '🎨', text: 'design & development', color: 'taro' },
              { emoji: '📱', text: 'digital solutions', color: 'brown-sugar' },
            ].map((tag, index) => (
              <motion.div
                key={tag.text}
                className={`px-4 py-2 bg-${tag.color}/15 text-${tag.color} rounded-lg text-sm font-display font-medium border border-${tag.color}/20 lowercase`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {tag.emoji} {tag.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
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
