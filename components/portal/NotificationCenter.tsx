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
import Pagination from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';

const notificationConfig: Record<NotificationType, { icon: any; color: string; bg: string }> = {
  MESSAGE: { icon: MessageSquare, color: 'text-ink', bg: 'bg-taro' },
  INVOICE: { icon: CreditCard, color: 'text-ink', bg: 'bg-matcha' },
  CONTRACT: { icon: FileCheck, color: 'text-ink', bg: 'bg-deep-taro' },
  PROJECT_UPDATE: { icon: Upload, color: 'text-ink', bg: 'bg-taro' },
  PAYMENT_RECEIVED: { icon: CheckCircle2, color: 'text-ink', bg: 'bg-matcha' },
  SYSTEM: { icon: Bell, color: 'text-ink', bg: 'bg-cream' },
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

  // Use pagination hook
  const {
    paginatedData: paginatedNotifications,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    setItemsPerPage,
    totalItems,
  } = usePagination({ data: filteredNotifications, initialItemsPerPage: 15 });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-8">
        <div className="flex items-center justify-center">
          <div className="text-ink/50 font-bold uppercase">loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-strawberry text-ink text-xs font-black rounded-full border-2 border-ink flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <h2 className="font-display text-2xl font-black text-ink uppercase">notifications</h2>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
              className="px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20 uppercase"
            >
              <option value="all">all notifications</option>
              <option value="unread">unread only</option>
            </select>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all"
              >
                mark all read
              </button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-taro rounded-full border-2 border-ink"></div>
            <span className="text-ink/70 font-bold uppercase">total: {notifications.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-strawberry rounded-full border-2 border-ink"></div>
            <span className="text-ink/70 font-bold uppercase">unread: {unreadCount}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-matcha rounded-full border-2 border-ink"></div>
            <span className="text-ink/70 font-bold uppercase">
              read: {notifications.length - unreadCount}
            </span>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <p className="text-ink/50 text-lg font-bold uppercase">
              {filter === 'unread' ? 'no unread notifications' : 'no notifications yet'}
            </p>
          </div>
        ) : (
          <div>
            <div className="divide-y-2 divide-ink/10">
              <AnimatePresence>
                {paginatedNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => markAsRead(notification.id)}
                    onDelete={() => deleteNotification(notification.id)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {filteredNotifications.length > 0 && (
              <div className="border-t-4 border-ink p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            )}
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
      className={`group relative p-6 hover:bg-cream/30 transition-colors ${
        !notification.isRead ? 'bg-taro/10 border-l-4 border-l-ink' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div
          className={`p-3 rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] ${config.bg} flex-shrink-0`}
        >
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-black text-ink mb-1 uppercase">{notification.title}</h4>
              <p className="text-ink/70 text-sm leading-relaxed font-bold">
                {notification.message}
              </p>

              <div className="flex items-center space-x-4 mt-3 text-xs text-ink/50 font-bold">
                <span>{timeAgo(new Date(notification.createdAt))}</span>
                {notification.sender && (
                  <span className="uppercase">from {notification.sender.name}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.isRead && (
                <button
                  onClick={onMarkAsRead}
                  className="p-1 text-ink/40 hover:text-matcha transition-colors"
                  title="Mark as read"
                >
                  <CheckCircle2 size={16} />
                </button>
              )}
              <button
                onClick={onDelete}
                className="p-1 text-ink/40 hover:text-strawberry transition-colors"
                title="Delete"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Unread Indicator */}
        {!notification.isRead && (
          <div className="w-3 h-3 bg-strawberry rounded-full border-2 border-ink flex-shrink-0 mt-2"></div>
        )}
      </div>
    </motion.div>
  );
}
