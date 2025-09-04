'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  MessageSquare,
  CreditCard,
  FileCheck,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';
import { Notification, NotificationType } from '@/types/portal';

const notificationConfig: Record<NotificationType, { icon: any; color: string; bg: string }> = {
  MESSAGE: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
  INVOICE: { icon: CreditCard, color: 'text-green-600', bg: 'bg-green-100' },
  CONTRACT: { icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
  PROJECT_UPDATE: { icon: Upload, color: 'text-taro', bg: 'bg-taro/10' },
  PAYMENT_RECEIVED: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  SYSTEM: { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-100' },
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/portal/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/portal/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setNotifications(
          notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/portal/notifications/read-all', {
        method: 'PATCH',
      });

      if (response.ok) {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/portal/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(notifications.filter((n) => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications =
    filter === 'all' ? notifications : notifications.filter((n) => !n.isRead);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-ink/10 p-8">
        <div className="flex items-center justify-center">
          <div className="text-ink/50">loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-taro" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brown-sugar text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <h2 className="font-display text-2xl font-bold text-ink">notifications</h2>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
              className="px-3 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink focus:outline-none focus:ring-2 focus:ring-taro/20"
            >
              <option value="all">all notifications</option>
              <option value="unread">unread only</option>
            </select>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors"
              >
                mark all read
              </button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-taro rounded-full"></div>
            <span className="text-ink/70">total: {notifications.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-brown-sugar rounded-full"></div>
            <span className="text-ink/70">unread: {unreadCount}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-ink/70">read: {notifications.length - unreadCount}</span>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-ink/10 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-ink/30 mx-auto mb-4" />
            <p className="text-ink/50 text-lg">
              {filter === 'unread' ? 'no unread notifications' : 'no notifications yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-ink/5">
            <AnimatePresence>
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onDelete={() => deleteNotification(notification.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
}) {
  const config = notificationConfig[notification.type];
  const Icon = config.icon;

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group relative p-6 hover:bg-milk-tea/10 transition-colors ${
        !notification.isRead ? 'bg-taro/5 border-l-4 border-l-taro' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-ink mb-1">{notification.title}</h4>
              <p className="text-ink/70 text-sm leading-relaxed">{notification.message}</p>

              <div className="flex items-center space-x-4 mt-3 text-xs text-ink/50">
                <span>{timeAgo(new Date(notification.createdAt))}</span>
                {notification.sender && <span>from {notification.sender.name}</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.isRead && (
                <button
                  onClick={onMarkAsRead}
                  className="p-1 text-ink/40 hover:text-taro transition-colors"
                  title="Mark as read"
                >
                  <CheckCircle2 size={16} />
                </button>
              )}
              <button
                onClick={onDelete}
                className="p-1 text-ink/40 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Unread Indicator */}
        {!notification.isRead && (
          <div className="w-2 h-2 bg-taro rounded-full flex-shrink-0 mt-2"></div>
        )}
      </div>
    </motion.div>
  );
}
