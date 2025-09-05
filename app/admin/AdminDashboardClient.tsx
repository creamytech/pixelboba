'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import ProjectManager from '@/components/admin/ProjectManager';
import ClientManager from '@/components/admin/ClientManager';
import ContractManager from '@/components/admin/ContractManager';
import InvoiceManager from '@/components/admin/InvoiceManager';
import AdminSettings from '@/components/admin/AdminSettings';
import { Session } from 'next-auth';

interface AdminStats {
  totalClients: number;
  activeProjects: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  completedProjects: number;
  averageProjectDuration: number;
}

export default function AdminDashboardClient({ session }: { session: Session }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-taro/30 border-t-taro rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ink/70">loading admin panel...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'overview', icon: TrendingUp },
    { id: 'projects', name: 'projects', icon: FolderOpen },
    { id: 'clients', name: 'clients', icon: Users },
    { id: 'contracts', name: 'contracts', icon: FileText },
    { id: 'invoices', name: 'invoices', icon: CreditCard },
    { id: 'settings', name: 'settings', icon: Settings },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} />;
      case 'projects':
        return <ProjectManager />;
      case 'clients':
        return <ClientManager />;
      case 'contracts':
        return <ContractManager />;
      case 'invoices':
        return <InvoiceManager />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <OverviewTab stats={stats} />;
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
              <span className="text-ink/50">admin panel</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-ink/70">welcome, {session?.user?.name}</span>
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-taro text-white shadow-lg'
                      : 'text-ink/70 hover:text-ink hover:bg-white/70'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.name}</span>
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

function OverviewTab({ stats }: { stats: AdminStats | null }) {
  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="total clients" value={stats.totalClients} icon={Users} color="blue" />
        <StatCard
          title="active projects"
          value={stats.activeProjects}
          icon={FolderOpen}
          color="taro"
        />
        <StatCard
          title="monthly revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="pending invoices"
          value={stats.pendingInvoices}
          icon={CreditCard}
          color="orange"
        />
        <StatCard
          title="completed projects"
          value={stats.completedProjects}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="avg project time"
          value={`${stats.averageProjectDuration} days`}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">recent activity</h3>
          <div className="space-y-4">
            <ActivityItem
              action="new client registered"
              description="sarah chen from ecoflow commerce"
              time="2 hours ago"
              type="user"
            />
            <ActivityItem
              action="project completed"
              description="modern bakery website launch"
              time="5 hours ago"
              type="project"
            />
            <ActivityItem
              action="invoice paid"
              description="$5,200 received from tech startup"
              time="1 day ago"
              type="payment"
            />
            <ActivityItem
              action="contract signed"
              description="website redesign agreement"
              time="2 days ago"
              type="contract"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">quick actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton icon={Plus} label="new project" onClick={() => {}} />
            <ActionButton icon={Users} label="add client" onClick={() => {}} />
            <ActionButton icon={FileText} label="create contract" onClick={() => {}} />
            <ActionButton icon={CreditCard} label="send invoice" onClick={() => {}} />
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <h3 className="font-display text-lg font-semibold text-ink mb-4">revenue overview</h3>
        <div className="h-64 bg-gradient-to-r from-taro/10 to-brown-sugar/10 rounded-lg flex items-center justify-center">
          <p className="text-ink/50">chart component would go here</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ink/60 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-ink">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/10`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
      </div>
    </div>
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
  const getIcon = () => {
    switch (type) {
      case 'user':
        return Users;
      case 'project':
        return FolderOpen;
      case 'payment':
        return DollarSign;
      case 'contract':
        return FileText;
      default:
        return Users;
    }
  };

  const Icon = getIcon();

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-milk-tea/10 transition-colors">
      <div className="w-8 h-8 bg-taro/10 rounded-full flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-taro" />
      </div>
      <div className="flex-1">
        <p className="text-ink font-medium capitalize">{action}</p>
        <p className="text-ink/60 text-sm">{description}</p>
      </div>
      <span className="text-ink/50 text-xs">{time}</span>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 p-3 bg-taro/10 hover:bg-taro/20 rounded-lg transition-colors group"
    >
      <Icon className="w-5 h-5 text-taro group-hover:text-taro/80" />
      <span className="text-sm font-medium text-ink">{label}</span>
    </button>
  );
}
