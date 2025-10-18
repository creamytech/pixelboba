'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, MessageSquare, UserPlus, FileText, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'task_completed' | 'task_created' | 'comment' | 'member_added' | 'file_uploaded';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    image?: string;
  };
}

interface RecentActivityProps {
  activities: Activity[];
  maxItems?: number;
}

export default function RecentActivity({ activities, maxItems = 5 }: RecentActivityProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'task_created':
        return <Circle className="w-4 h-4 text-taro" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'member_added':
        return <UserPlus className="w-4 h-4 text-purple-500" />;
      case 'file_uploaded':
        return <FileText className="w-4 h-4 text-orange-500" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'task_completed':
        return 'from-green-500 to-emerald-500';
      case 'task_created':
        return 'from-taro to-purple-500';
      case 'comment':
        return 'from-blue-500 to-cyan-500';
      case 'member_added':
        return 'from-purple-500 to-pink-500';
      case 'file_uploaded':
        return 'from-orange-500 to-amber-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/70 backdrop-blur-sm border-2 border-brown-sugar/10 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-xl text-ink">Recent Activity</h2>
        <Clock className="w-5 h-5 text-ink/40" />
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.slice(0, maxItems).map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex gap-4 group"
          >
            {/* Icon */}
            <div className="relative flex-shrink-0">
              <div
                className={`
                w-10 h-10 rounded-xl bg-gradient-to-br ${getActivityColor(activity.type)}
                flex items-center justify-center shadow-sm
                group-hover:scale-110 transition-transform
              `}
              >
                {getActivityIcon(activity.type)}
              </div>
              {/* Connector Line (except last item) */}
              {index < Math.min(activities.length, maxItems) - 1 && (
                <div className="absolute left-1/2 -translate-x-1/2 top-10 w-0.5 h-4 bg-brown-sugar/10" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-display font-medium text-sm text-ink truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-ink/60 mt-0.5 line-clamp-2">{activity.description}</p>
                </div>
                {activity.user?.image && (
                  <img
                    src={activity.user.image}
                    alt={activity.user.name}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                  />
                )}
              </div>
              <p className="text-xs text-ink/40 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Link */}
      {activities.length > maxItems && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full mt-4 py-2 text-sm font-display font-medium text-taro hover:text-brown-sugar transition-colors"
        >
          View all activity →
        </motion.button>
      )}
    </motion.div>
  );
}
