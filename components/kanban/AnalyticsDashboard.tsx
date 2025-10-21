'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface AnalyticsDashboardProps {
  tasks: any[];
  projectName: string;
}

export default function AnalyticsDashboard({ tasks, projectName }: AnalyticsDashboardProps) {
  // Calculate metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = subDays(now, 7);
    const thirtyDaysAgo = subDays(now, 30);

    // Completion rate
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');
    const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

    // Tasks completed this week
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const completedThisWeek = completedTasks.filter((t) => {
      if (!t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      return completedDate >= weekStart && completedDate <= weekEnd;
    }).length;

    // Average completion time (in days)
    const completedWithDates = completedTasks.filter((t) => t.completedAt && t.createdAt);
    const avgCompletionTime =
      completedWithDates.length > 0
        ? completedWithDates.reduce((acc, t) => {
            const created = new Date(t.createdAt);
            const completed = new Date(t.completedAt);
            return acc + (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          }, 0) / completedWithDates.length
        : 0;

    // Velocity (tasks completed per week)
    const recentCompletions = completedTasks.filter((t) => {
      if (!t.completedAt) return false;
      return new Date(t.completedAt) >= thirtyDaysAgo;
    });
    const velocity = (recentCompletions.length / 30) * 7; // per week

    // Overdue tasks
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'COMPLETED'
    );

    // Blocked tasks
    const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED');

    // Priority distribution
    const priorityDist = {
      urgent: tasks.filter((t) => t.priority === 'URGENT').length,
      high: tasks.filter((t) => t.priority === 'HIGH').length,
      medium: tasks.filter((t) => t.priority === 'MEDIUM').length,
      low: tasks.filter((t) => t.priority === 'LOW').length,
    };

    // Status distribution
    const statusDist = {
      backlog: tasks.filter((t) => t.status === 'BACKLOG').length,
      todo: tasks.filter((t) => t.status === 'TODO').length,
      inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      inReview: tasks.filter((t) => t.status === 'IN_REVIEW').length,
      completed: completedTasks.length,
      blocked: blockedTasks.length,
    };

    // Completion trend (last 7 days)
    const completionTrend = eachDayOfInterval({ start: sevenDaysAgo, end: now }).map((day) => {
      const dayTasks = completedTasks.filter((t) => {
        if (!t.completedAt) return false;
        const completedDate = new Date(t.completedAt);
        return (
          completedDate.getDate() === day.getDate() &&
          completedDate.getMonth() === day.getMonth() &&
          completedDate.getFullYear() === day.getFullYear()
        );
      });

      return {
        date: format(day, 'MMM d'),
        count: dayTasks.length,
      };
    });

    return {
      completionRate,
      completedThisWeek,
      avgCompletionTime,
      velocity,
      overdueTasks: overdueTasks.length,
      blockedTasks: blockedTasks.length,
      priorityDist,
      statusDist,
      completionTrend,
    };
  }, [tasks]);

  const maxTrendValue = Math.max(...metrics.completionTrend.map((d) => d.count), 1);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-taro/10 to-brown-sugar/10 rounded-xl p-6 border border-brown-sugar/20">
        <h2 className="font-display text-2xl font-bold text-ink lowercase mb-2">
          {projectName} analytics
        </h2>
        <p className="text-ink/60 font-display">insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="completion rate"
          value={`${metrics.completionRate.toFixed(1)}%`}
          icon={Target}
          color="bg-green-500"
          trend={metrics.completionRate > 50 ? 'up' : 'down'}
        />
        <MetricCard
          title="completed this week"
          value={metrics.completedThisWeek}
          icon={CheckCircle2}
          color="bg-blue-500"
        />
        <MetricCard
          title="avg completion time"
          value={`${metrics.avgCompletionTime.toFixed(1)}d`}
          icon={Clock}
          color="bg-violet-500"
        />
        <MetricCard
          title="velocity"
          value={`${metrics.velocity.toFixed(1)}/wk`}
          icon={Zap}
          color="bg-orange-500"
          trend="up"
        />
      </div>

      {/* Alerts */}
      {(metrics.overdueTasks > 0 || metrics.blockedTasks > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.overdueTasks > 0 && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-xl p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-display font-semibold text-red-800">
                    {metrics.overdueTasks} overdue tasks
                  </p>
                  <p className="text-sm text-red-600">requires immediate attention</p>
                </div>
              </div>
            </motion.div>
          )}

          {metrics.blockedTasks > 0 && (
            <motion.div
              className="bg-orange-50 border border-orange-200 rounded-xl p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-display font-semibold text-orange-800">
                    {metrics.blockedTasks} blocked tasks
                  </p>
                  <p className="text-sm text-orange-600">needs resolution</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trend */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20">
          <h3 className="font-display font-semibold text-ink mb-4 lowercase">
            completion trend (7 days)
          </h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {metrics.completionTrend.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full bg-gradient-to-t from-taro to-brown-sugar rounded-t-lg relative group cursor-pointer"
                  style={{ height: `${(day.count / maxTrendValue) * 100}%`, minHeight: '8px' }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.count} tasks
                  </div>
                </motion.div>
                <span className="text-xs text-ink/60 font-display">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20">
          <h3 className="font-display font-semibold text-ink mb-4 lowercase">
            priority distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(metrics.priorityDist).map(([priority, count], index) => {
              const total = tasks.length;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              const colors = {
                urgent: { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' },
                high: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-100' },
                medium: { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-100' },
                low: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-100' },
              };
              const color = colors[priority as keyof typeof colors];

              return (
                <motion.div
                  key={priority}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display text-sm text-ink/70 capitalize">{priority}</span>
                    <span className="font-display text-sm font-medium text-ink">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${color.bg}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20 lg:col-span-2">
          <h3 className="font-display font-semibold text-ink mb-4 lowercase">status breakdown</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Object.entries(metrics.statusDist).map(([status, count], index) => {
              const colors = {
                backlog: 'bg-gray-100 text-gray-700',
                todo: 'bg-blue-100 text-blue-700',
                inProgress: 'bg-violet-100 text-violet-700',
                inReview: 'bg-yellow-100 text-yellow-700',
                completed: 'bg-green-100 text-green-700',
                blocked: 'bg-red-100 text-red-700',
              };
              const color = colors[status as keyof typeof colors];

              return (
                <motion.div
                  key={status}
                  className={`${color} rounded-xl p-4 text-center`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-3xl font-bold mb-1">{count}</p>
                  <p className="text-xs font-display font-medium capitalize">
                    {status.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-taro/5 to-brown-sugar/5 rounded-xl p-6 border border-brown-sugar/20">
        <h3 className="font-display font-semibold text-ink mb-4 lowercase">insights</h3>
        <div className="space-y-2">
          {metrics.completionRate > 70 && (
            <p className="text-sm text-green-700 font-display flex items-center gap-2">
              <Icon icon="ph:check-circle-duotone" className="w-5 h-5" />
              Excellent completion rate! Keep up the great work.
            </p>
          )}
          {metrics.velocity < 2 && (
            <p className="text-sm text-orange-700 font-display flex items-center gap-2">
              <Icon icon="ph:warning-duotone" className="w-5 h-5" />
              Velocity is low. Consider breaking down large tasks.
            </p>
          )}
          {metrics.overdueTasks > 5 && (
            <p className="text-sm text-red-700 font-display flex items-center gap-2">
              <Icon icon="ph:warning-octagon-duotone" className="w-5 h-5" />
              High number of overdue tasks. Prioritize catching up.
            </p>
          )}
          {metrics.blockedTasks > 3 && (
            <p className="text-sm text-orange-700 font-display flex items-center gap-2">
              <Icon icon="ph:warning-duotone" className="w-5 h-5" />
              Several tasks are blocked. Review and unblock where possible.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: 'up' | 'down';
}) {
  return (
    <motion.div
      className="bg-white/60 backdrop-blur-lg rounded-xl p-4 border border-brown-sugar/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 ${color} bg-opacity-10 rounded-lg`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <div className={`${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-ink mb-1">{value}</p>
      <p className="text-xs font-display text-ink/60 uppercase tracking-wide">{title}</p>
    </motion.div>
  );
}
