'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
import MessageCenter from '@/components/portal/MessageCenter';
import InvoiceCenter from '@/components/portal/InvoiceCenter';
import ContractCenter from '@/components/portal/ContractCenter';
import FileCenter from '@/components/portal/FileCenter';
import NotificationCenter from '@/components/portal/NotificationCenter';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-taro/30 border-t-taro rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ink/70">brewing your portal...</p>
        </div>
      </div>
    );
  }

  if (!portalData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink mb-4">unable to load portal data</p>
          <button
            onClick={fetchPortalData}
            className="px-4 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors"
          >
            try again
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'dashboard', icon: User },
    { id: 'messages', name: 'messages', icon: MessageSquare, badge: portalData.unreadMessages },
    { id: 'invoices', name: 'invoices', icon: CreditCard, badge: portalData.pendingInvoices },
    { id: 'contracts', name: 'contracts', icon: FileCheck, badge: portalData.pendingContracts },
    { id: 'files', name: 'files', icon: Upload },
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
    <div className="min-h-screen bg-gradient-to-br from-milk-tea/5 via-background to-taro/5">
      {/* Header */}
      <div className="border-b border-ink/10 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-taro via-brown-sugar to-milk-tea rounded-xl shadow-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-md opacity-90"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-xl text-ink leading-none">
                    pixel boba
                  </span>
                  <span className="text-xs text-ink/50 font-medium">design & development</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-1 h-6 bg-gradient-to-b from-taro to-brown-sugar rounded-full"></div>
                <span className="text-ink/70 font-medium">client portal</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-ink">welcome back!</p>
                <p className="text-xs text-ink/60">{portalData.user.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                {portalData.user.image && (
                  <img
                    src={portalData.user.image}
                    alt={portalData.user.name || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-taro/20"
                  />
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-ink/60 hover:text-taro hover:bg-taro/10 rounded-lg transition-all duration-200 group"
                  title="Sign out"
                >
                  <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-2 bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-ink/5 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-taro to-brown-sugar text-white shadow-lg transform scale-105'
                      : 'text-ink/70 hover:text-ink hover:bg-white/80 hover:shadow-md hover:scale-102'
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                  />
                  <span className="capitalize">{tab.name}</span>
                  {tab.badge && tab.badge > 0 && (
                    <span
                      className={`absolute -top-1 -right-1 w-6 h-6 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg transition-all ${
                        isActive
                          ? 'bg-white/20 backdrop-blur-sm animate-pulse'
                          : 'bg-brown-sugar group-hover:scale-110'
                      }`}
                    >
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-taro/20 to-brown-sugar/20 animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

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
    </div>
  );
}

function DashboardView({ data }: { data: PortalData }) {
  const activeProject =
    data.projects.find((p) => p.status !== 'COMPLETED' && p.status !== 'CANCELLED') ||
    data.projects[0];

  return (
    <div className="space-y-8">
      {/* Active Project */}
      {activeProject ? (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10 hover:shadow-lg transition-shadow">
          <h2 className="font-display text-2xl font-bold text-ink mb-6">current project</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-xl font-semibold text-ink mb-2">
                {activeProject.name}
              </h3>
              <p className="text-ink/70 mb-4">
                {activeProject.description || 'No description available'}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-ink/60">status:</span>
                  <span className="font-medium text-ink capitalize bg-taro/10 text-taro px-3 py-1 rounded-full text-sm">
                    {activeProject.status.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">deadline:</span>
                  <span className="font-medium text-ink">
                    {activeProject.deadline
                      ? new Date(activeProject.deadline).toLocaleDateString()
                      : 'TBD'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">started:</span>
                  <span className="font-medium text-ink">
                    {new Date(activeProject.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <BobaProgressIndicator
                progress={activeProject.progress}
                status={activeProject.status}
                size="large"
              />
              <div className="mt-4 text-center">
                <p className="text-ink/60 text-sm">
                  {activeProject.milestones?.length || 0} milestones
                  {activeProject.milestones?.filter((m) => m.completedAt).length > 0 &&
                    ` • ${activeProject.milestones.filter((m) => m.completedAt).length} completed`}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border border-ink/10 text-center">
          <div className="w-16 h-16 bg-taro/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-taro" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink mb-2">Welcome to your portal!</h2>
          <p className="text-ink/70 mb-6">
            Your projects will appear here once we start working together. In the meantime, feel
            free to explore the different sections.
          </p>
          <div className="flex justify-center space-x-3">
            <div className="px-4 py-2 bg-taro/10 text-taro rounded-lg text-sm font-medium">
              🎨 Design & Development
            </div>
            <div className="px-4 py-2 bg-brown-sugar/10 text-brown-sugar rounded-lg text-sm font-medium">
              📱 Digital Solutions
            </div>
          </div>
        </div>
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
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10 hover:shadow-lg transition-shadow">
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
              <ActivityItem
                action="project milestone reached"
                description={`${activeProject.name} - progress updated to ${activeProject.progress}%`}
                time="2 hours ago"
                type="project"
              />
              <ActivityItem
                action="new message received"
                description="design feedback and next steps"
                time="1 day ago"
                type="message"
              />
              <ActivityItem
                action="contract status updated"
                description="development agreement signed"
                time="3 days ago"
                type="contract"
              />
              {data.pendingInvoices > 0 && (
                <ActivityItem
                  action="invoice pending"
                  description={`${data.pendingInvoices} invoice${data.pendingInvoices > 1 ? 's' : ''} awaiting payment`}
                  time="5 days ago"
                  type="payment"
                />
              )}
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
              <div className="flex justify-center space-x-2">
                <div className="px-3 py-1 bg-taro/10 text-taro rounded-full text-xs font-medium">
                  🎯 project updates
                </div>
                <div className="px-3 py-1 bg-brown-sugar/10 text-brown-sugar rounded-full text-xs font-medium">
                  💬 messages
                </div>
                <div className="px-3 py-1 bg-milk-tea/20 text-ink/70 rounded-full text-xs font-medium">
                  📋 contracts
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10 hover:shadow-lg transition-all duration-300 hover:scale-105">
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
