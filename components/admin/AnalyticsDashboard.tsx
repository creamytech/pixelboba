'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  FileText,
  Calendar,
  Download,
} from 'lucide-react';

interface AnalyticsData {
  revenueData: Array<{ month: string; revenue: number; invoices: number }>;
  projectStats: Array<{ status: string; count: number; value: number }>;
  clientGrowth: Array<{ month: string; clients: number }>;
  invoiceStats: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    totalRevenue: number;
    pendingAmount: number;
  };
  projectCompletion: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
}

const COLORS = {
  taro: '#8B5CF6',
  brownSugar: '#D97706',
  milkTea: '#F3E8D2',
  matcha: '#10B981',
  ink: '#2D3748',
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#10B981',
  orange: '#F59E0B',
};

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!analytics) return;

    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      invoiceStats: analytics.invoiceStats,
      projectCompletion: analytics.projectCompletion,
      revenueData: analytics.revenueData,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-ink/50">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-ink/50">Failed to load analytics</div>
      </div>
    );
  }

  const projectStatusData = [
    { name: 'Completed', value: analytics.projectCompletion.completed, color: COLORS.green },
    { name: 'In Progress', value: analytics.projectCompletion.inProgress, color: COLORS.taro },
    { name: 'Not Started', value: analytics.projectCompletion.notStarted, color: COLORS.orange },
  ];

  const invoiceStatusData = [
    { name: 'Paid', value: analytics.invoiceStats.paid, color: COLORS.green },
    { name: 'Pending', value: analytics.invoiceStats.pending, color: COLORS.orange },
    { name: 'Overdue', value: analytics.invoiceStats.overdue, color: COLORS.red },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">analytics dashboard</h2>
            <p className="text-ink/60 mt-1">business insights and performance metrics</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="px-4 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink focus:outline-none focus:ring-2 focus:ring-taro/20"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            {/* Export Button */}
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${analytics.invoiceStats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-8 h-8 text-green-500/60" />}
          trend="+12.5%"
          trendUp={true}
        />
        <MetricCard
          title="Pending Amount"
          value={`$${analytics.invoiceStats.pendingAmount.toLocaleString()}`}
          icon={<FileText className="w-8 h-8 text-orange-500/60" />}
          trend="-3.2%"
          trendUp={false}
        />
        <MetricCard
          title="Active Projects"
          value={analytics.projectCompletion.inProgress.toString()}
          icon={<Briefcase className="w-8 h-8 text-taro/60" />}
        />
        <MetricCard
          title="Total Invoices"
          value={analytics.invoiceStats.total.toString()}
          icon={<Calendar className="w-8 h-8 text-blue-500/60" />}
        />
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <h3 className="font-display text-lg font-semibold text-ink mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={COLORS.taro}
              strokeWidth={2}
              dot={{ fill: COLORS.taro }}
              name="Revenue ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Project & Invoice Status */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project Status */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">Project Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {projectStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-ink/70">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-ink">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Status */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">Invoice Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={invoiceStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" name="Count">
                {invoiceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Performance Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <h3 className="font-display text-lg font-semibold text-ink mb-4">
          Project Performance by Status
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-milk-tea/20">
              <tr>
                <th className="text-left p-4 font-medium text-ink">Status</th>
                <th className="text-left p-4 font-medium text-ink">Count</th>
                <th className="text-left p-4 font-medium text-ink">Total Value</th>
                <th className="text-left p-4 font-medium text-ink">Avg Value</th>
              </tr>
            </thead>
            <tbody>
              {analytics.projectStats.map((stat) => (
                <tr key={stat.status} className="border-b border-ink/5">
                  <td className="p-4">
                    <span className="capitalize text-ink">{stat.status.toLowerCase()}</span>
                  </td>
                  <td className="p-4 text-ink">{stat.count}</td>
                  <td className="p-4 text-ink font-medium">${stat.value.toLocaleString()}</td>
                  <td className="p-4 text-ink">
                    ${stat.count > 0 ? (stat.value / stat.count).toLocaleString() : '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-ink/60">{title}</h3>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-ink">{value}</p>
        {trend && (
          <div
            className={`flex items-center space-x-1 text-sm ${
              trendUp ? 'text-green-500' : 'text-red-500'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${!trendUp && 'rotate-180'}`} />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
