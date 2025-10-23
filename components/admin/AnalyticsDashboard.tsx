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
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="font-display text-2xl font-black text-ink uppercase">
              analytics dashboard
            </h2>
            <p className="text-ink/60 mt-1 font-bold">business insights and performance metrics</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            {/* Export Button */}
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all"
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
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <h3 className="font-display text-lg font-black text-ink mb-4 uppercase">Revenue Trend</h3>
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
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
          <h3 className="font-display text-lg font-black text-ink mb-4 uppercase">
            Project Status
          </h3>
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
                  <div
                    className="w-3 h-3 rounded-full border-2 border-ink"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-ink/70 font-bold">{item.name}</span>
                </div>
                <span className="text-sm font-black text-ink">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Status */}
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
          <h3 className="font-display text-lg font-black text-ink mb-4 uppercase">
            Invoice Status
          </h3>
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
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <h3 className="font-display text-lg font-black text-ink mb-4 uppercase">
          Project Performance by Status
        </h3>
        <div className="rounded-xl border-4 border-ink overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-milk-tea to-cream border-b-4 border-ink">
              <tr>
                <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                  Status
                </th>
                <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">Count</th>
                <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                  Total Value
                </th>
                <th className="px-4 py-4 text-left font-black text-ink uppercase text-sm">
                  Avg Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {analytics.projectStats.map((stat) => (
                <tr key={stat.status} className="border-b-2 border-ink/10 hover:bg-cream/30">
                  <td className="px-4 py-4 font-bold text-ink">
                    <span className="capitalize">{stat.status.toLowerCase()}</span>
                  </td>
                  <td className="px-4 py-4 font-bold text-ink">{stat.count}</td>
                  <td className="px-4 py-4 font-bold text-ink">${stat.value.toLocaleString()}</td>
                  <td className="px-4 py-4 font-bold text-ink">
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
      className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] p-6 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-ink/60 uppercase">{title}</h3>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-black text-ink">{value}</p>
        {trend && (
          <div
            className={`flex items-center space-x-1 text-sm font-black ${
              trendUp ? 'text-matcha' : 'text-strawberry'
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
