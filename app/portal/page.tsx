'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  FileText,
  CreditCard,
  FileCheck,
  Upload,
  Bell,
  User,
  LogOut,
} from 'lucide-react';
import BobaProgressIndicator from '@/components/portal/BobaProgressIndicator';
import MessageCenter from '@/components/portal/MessageCenter';
import InvoiceCenter from '@/components/portal/InvoiceCenter';
import ContractCenter from '@/components/portal/ContractCenter';
import FileCenter from '@/components/portal/FileCenter';
import NotificationCenter from '@/components/portal/NotificationCenter';
import { Project, User as UserType } from '@/types/portal';

interface PortalData {
  user: UserType;
  projects: Project[];
  unreadMessages: number;
  pendingInvoices: number;
  pendingContracts: number;
}

export const dynamic = 'force-dynamic';

export default function ClientPortal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchPortalData();
    }
  }, [status, router]);

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

  if (status === 'loading' || loading) {
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
      <div className="border-b border-ink/10 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-taro to-brown-sugar rounded-full"></div>
                <span className="font-display font-bold text-xl text-ink">pixel boba</span>
              </div>
              <span className="text-ink/50">client portal</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-ink/70">welcome, {portalData.user.name}</span>
              <button className="p-2 text-ink/60 hover:text-ink transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-taro text-white shadow-lg'
                      : 'text-ink/70 hover:text-ink hover:bg-white/70'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.name}</span>
                  {tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brown-sugar text-white text-xs rounded-full flex items-center justify-center">
                      {tab.badge}
                    </span>
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
      {activeProject && (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <h2 className="font-display text-2xl font-bold text-ink mb-6">current project</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-xl font-semibold text-ink mb-2">
                {activeProject.name}
              </h3>
              <p className="text-ink/70 mb-4">{activeProject.description}</p>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-ink/60">status:</span>
                  <span className="font-medium text-ink capitalize">
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
              </div>
            </div>

            <div>
              <BobaProgressIndicator
                progress={activeProject.progress}
                status={activeProject.status}
                size="large"
              />
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
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <h3 className="font-display text-lg font-semibold text-ink mb-4">recent activity</h3>
        <div className="space-y-3">
          <ActivityItem
            action="project updated"
            description="wireframes phase completed"
            time="2 hours ago"
          />
          <ActivityItem
            action="new message"
            description="feedback on homepage design"
            time="1 day ago"
          />
          <ActivityItem
            action="invoice sent"
            description="milestone payment #2"
            time="3 days ago"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ink/60 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-ink">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

function ActivityItem({
  action,
  description,
  time,
}: {
  action: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-milk-tea/10 transition-colors">
      <div className="w-2 h-2 bg-taro rounded-full"></div>
      <div className="flex-1">
        <p className="text-ink font-medium">{action}</p>
        <p className="text-ink/60 text-sm">{description}</p>
      </div>
      <span className="text-ink/50 text-xs">{time}</span>
    </div>
  );
}
