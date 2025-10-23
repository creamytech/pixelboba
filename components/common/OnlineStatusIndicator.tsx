'use client';

import { motion } from 'framer-motion';

interface OnlineStatusIndicatorProps {
  isOnline?: boolean;
  lastActiveAt?: Date | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function OnlineStatusIndicator({
  isOnline = false,
  lastActiveAt,
  size = 'md',
  showLabel = false,
  className = '',
}: OnlineStatusIndicatorProps) {
  const getTimeAgo = (date: Date | null | undefined) => {
    if (!date) return 'Never';

    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  // Determine status based on online state and last active time
  const getStatus = () => {
    if (isOnline) return 'online';
    if (!lastActiveAt) return 'offline';

    const now = new Date();
    const diff = now.getTime() - new Date(lastActiveAt).getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    // Away if last active within 30 minutes
    if (minutes < 30) return 'away';
    return 'offline';
  };

  const status = getStatus();
  const statusColor =
    status === 'online' ? 'bg-matcha' : status === 'away' ? 'bg-thai-tea' : 'bg-cream';
  const lastActive = getTimeAgo(lastActiveAt);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative flex items-center">
        <motion.div
          className={`${sizeClasses[size]} rounded-full ${statusColor} border-2 border-ink shadow-[1px_1px_0px_0px_rgba(58,0,29,1)]`}
          animate={status === 'online' ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          title={
            status === 'online'
              ? 'Online'
              : status === 'away'
                ? `Away - Last active: ${lastActive}`
                : `Offline - Last active: ${lastActive}`
          }
        />
        {status === 'online' && (
          <motion.div
            className={`absolute ${sizeClasses[size]} rounded-full bg-matcha opacity-75`}
            animate={{ scale: [1, 2, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      {showLabel && (
        <span
          className={`text-xs font-bold uppercase ${status === 'online' ? 'text-matcha' : status === 'away' ? 'text-thai-tea' : 'text-ink'}`}
        >
          {status === 'online' ? 'Online' : status === 'away' ? 'Away' : `Offline ${lastActive}`}
        </span>
      )}
    </div>
  );
}
