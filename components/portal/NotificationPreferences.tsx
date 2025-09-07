'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Check, X } from 'lucide-react';
import { EmailPreferences } from '@/types/portal';

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<EmailPreferences>) => {
    if (!preferences) return;

    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    setSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key: keyof EmailPreferences) => {
    if (!preferences || typeof preferences[key] !== 'boolean') return;
    updatePreferences({ [key]: !preferences[key] });
  };

  const setFrequency = (frequency: EmailPreferences['frequency']) => {
    updatePreferences({ frequency });
  };

  if (loading) {
    return (
      <motion.div
        className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-brown-sugar/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!preferences) {
    return (
      <motion.div
        className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-brown-sugar/20 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-red-500 mb-4">
          <X size={48} className="mx-auto" />
        </div>
        <h3 className="font-display text-lg font-semibold text-ink mb-2">
          failed to load preferences
        </h3>
        <p className="text-ink/60 mb-4">
          we couldn&apos;t load your notification preferences. please try again.
        </p>
        <button
          onClick={fetchPreferences}
          className="bg-taro hover:bg-taro/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          retry
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-taro/10 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-taro" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink lowercase">
              notification preferences
            </h2>
            <p className="text-sm text-ink/60 lowercase">
              control what emails you receive and when
            </p>
          </div>
        </div>

        {/* Save Status */}
        <div className="flex items-center gap-2">
          {saving && (
            <div className="flex items-center gap-2 text-sm text-ink/60">
              <motion.div
                className="w-4 h-4 border-2 border-taro/30 border-t-taro rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              saving...
            </div>
          )}
          {saveStatus === 'success' && (
            <motion.div
              className="flex items-center gap-2 text-sm text-green-600"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Check size={16} />
              saved
            </motion.div>
          )}
          {saveStatus === 'error' && (
            <motion.div
              className="flex items-center gap-2 text-sm text-red-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <X size={16} />
              error
            </motion.div>
          )}
        </div>
      </div>

      {/* Email Frequency */}
      <motion.div
        className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-brown-sugar/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-5 h-5 text-taro" />
          <h3 className="font-display text-lg font-semibold text-ink lowercase">email frequency</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['instant', 'daily', 'weekly'] as const).map((freq) => (
            <motion.button
              key={freq}
              onClick={() => setFrequency(freq)}
              className={`p-4 rounded-lg border-2 transition-all ${
                preferences.frequency === freq
                  ? 'border-taro bg-taro/10 text-taro'
                  : 'border-brown-sugar/20 bg-white/50 hover:border-taro/40 text-ink/70'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-lg mb-1">
                  {freq === 'instant' && '⚡'}
                  {freq === 'daily' && '📅'}
                  {freq === 'weekly' && '📊'}
                </div>
                <div className="font-display font-semibold capitalize text-sm">{freq}</div>
                <div className="text-xs text-ink/60 mt-1">
                  {freq === 'instant' && 'get notified immediately'}
                  {freq === 'daily' && 'digest every morning'}
                  {freq === 'weekly' && 'summary every monday'}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Email Types */}
      <motion.div
        className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-brown-sugar/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-taro" />
          <h3 className="font-display text-lg font-semibold text-ink lowercase">email types</h3>
        </div>

        <div className="space-y-4">
          {[
            {
              key: 'newMessages',
              label: 'new messages',
              icon: '💬',
              desc: 'when team members send you messages',
            },
            {
              key: 'projectUpdates',
              label: 'project updates',
              icon: '📊',
              desc: 'progress updates and status changes',
            },
            {
              key: 'milestoneCompletions',
              label: 'milestone completions',
              icon: '✅',
              desc: 'when project milestones are finished',
            },
            {
              key: 'invoiceNotifications',
              label: 'invoice notifications',
              icon: '💰',
              desc: 'new invoices and payment reminders',
            },
            {
              key: 'contractReminders',
              label: 'contract reminders',
              icon: '📄',
              desc: 'contracts pending your signature',
            },
            {
              key: 'fileUploads',
              label: 'file uploads',
              icon: '📁',
              desc: 'when new files are shared with you',
            },
            {
              key: 'weeklyDigest',
              label: 'weekly digest',
              icon: '📈',
              desc: 'weekly summary of all activity',
            },
          ].map((item, index) => (
            <motion.div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-white/50 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <div className="flex items-center gap-4">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <div className="font-display font-medium text-ink lowercase">{item.label}</div>
                  <div className="text-sm text-ink/60 lowercase">{item.desc}</div>
                </div>
              </div>

              <motion.button
                onClick={() => togglePreference(item.key as keyof EmailPreferences)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  preferences[item.key as keyof EmailPreferences] ? 'bg-taro' : 'bg-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                  animate={{
                    x: preferences[item.key as keyof EmailPreferences] ? 24 : 2,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Info Footer */}
      <motion.div
        className="bg-milk-tea/30 rounded-lg p-4 border border-brown-sugar/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-ink/70 text-center">
          💡 <strong>tip:</strong> you can unsubscribe from any email type at any time using the
          links in our emails
        </p>
      </motion.div>
    </motion.div>
  );
}
