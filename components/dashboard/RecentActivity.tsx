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
        return <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />;
      case 'task_created':
        return <Circle className="w-5 h-5 text-white" strokeWidth={2.5} />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-white" strokeWidth={2.5} />;
      case 'member_added':
        return <UserPlus className="w-5 h-5 text-white" strokeWidth={2.5} />;
      case 'file_uploaded':
        return <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'task_completed':
        return 'from-matcha to-matcha/80';
      case 'task_created':
        return 'from-taro to-deep-taro';
      case 'comment':
        return 'from-[#FDB97A] to-thai-tea';
      case 'member_added':
        return 'from-strawberry to-strawberry/80';
      case 'file_uploaded':
        return 'from-thai-tea to-thai-tea/80';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-black text-xl text-ink">Recent Activity</h2>
        <Clock className="w-6 h-6 text-ink/40" strokeWidth={2.5} />
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
                w-12 h-12 rounded-full bg-gradient-to-br ${getActivityColor(activity.type)}
                border-3 border-ink flex items-center justify-center
                shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]
                group-hover:scale-110 transition-transform
              `}
              >
                {getActivityIcon(activity.type)}
              </div>
              {/* Connector Line (except last item) */}
              {index < Math.min(activities.length, maxItems) - 1 && (
                <div className="absolute left-1/2 -translate-x-1/2 top-12 w-1 h-4 bg-ink/20" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-display font-black text-sm text-ink truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-ink/60 font-bold mt-1 line-clamp-2">
                    {activity.description}
                  </p>
                </div>
                {activity.user?.image && (
                  <img
                    src={activity.user.image}
                    alt={activity.user.name}
                    className="w-8 h-8 rounded-full border-3 border-white shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex-shrink-0"
                  />
                )}
              </div>
              <p className="text-xs text-ink/50 font-bold mt-2 flex items-center gap-1 uppercase">
                <Clock className="w-3 h-3" strokeWidth={2.5} />
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
          className="w-full mt-4 py-3 text-sm font-black text-ink bg-cream rounded-lg border-2 border-ink hover:bg-milk-tea transition-colors uppercase"
        >
          View All Activity →
        </motion.button>
      )}
    </motion.div>
  );
}
