'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Check, X } from 'lucide-react';
import { EmailPreferences } from '@/types/portal';
import { Icon } from '@iconify/react';

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
        className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-cream rounded w-48"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-cream rounded w-32"></div>
                <div className="h-6 bg-cream rounded w-12"></div>
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
        className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-strawberry mb-4">
          <X size={48} className="mx-auto" />
        </div>
        <h3 className="font-display text-lg font-black text-ink mb-2 uppercase">
          failed to load preferences
        </h3>
        <p className="text-ink/60 mb-4 font-bold">
          we couldn&apos;t load your notification preferences. please try again.
        </p>
        <button
          onClick={fetchPreferences}
          className="px-6 py-3 bg-taro text-white font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all"
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
          <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl font-black text-ink uppercase">
              notification preferences
            </h2>
            <p className="text-sm text-ink/60 font-bold">
              control what emails you receive and when
            </p>
          </div>
        </div>

        {/* Save Status */}
        <div className="flex items-center gap-2">
          {saving && (
            <div className="flex items-center gap-2 text-sm text-ink/60 font-bold uppercase">
              <motion.div
                className="w-4 h-4 border-3 border-taro/30 border-t-taro rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              saving...
            </div>
          )}
          {saveStatus === 'success' && (
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 font-black text-xs text-ink bg-matcha rounded-full border-2 border-ink uppercase"
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
              className="flex items-center gap-2 px-3 py-1.5 font-black text-xs text-white bg-strawberry rounded-full border-2 border-ink uppercase"
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
        className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-5 h-5 text-ink" />
          <h3 className="font-display text-lg font-black text-ink uppercase">email frequency</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(
            [
              { value: 'instant', icon: 'ph:lightning-duotone', desc: 'get notified immediately' },
              { value: 'daily', icon: 'ph:calendar-duotone', desc: 'digest every morning' },
              { value: 'weekly', icon: 'ph:chart-bar-duotone', desc: 'summary every monday' },
            ] as const
          ).map((freq) => (
            <motion.button
              key={freq.value}
              onClick={() => setFrequency(freq.value)}
              className={`p-4 rounded-lg border-3 transition-all ${
                preferences.frequency === freq.value
                  ? 'border-ink bg-taro text-white shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]'
                  : 'border-ink bg-white hover:bg-cream text-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <Icon icon={freq.icon} className="w-8 h-8 mx-auto mb-1" />
                <div className="font-display font-black uppercase text-sm">{freq.value}</div>
                <div className="text-xs font-bold mt-1">{freq.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Email Types */}
      <motion.div
        className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-ink" />
          <h3 className="font-display text-lg font-black text-ink uppercase">email types</h3>
        </div>

        <div className="space-y-4">
          {[
            {
              key: 'newMessages',
              label: 'new messages',
              icon: 'ph:chat-circle-dots-duotone',
              desc: 'when team members send you messages',
            },
            {
              key: 'projectUpdates',
              label: 'project updates',
              icon: 'ph:chart-bar-duotone',
              desc: 'progress updates and status changes',
            },
            {
              key: 'milestoneCompletions',
              label: 'milestone completions',
              icon: 'ph:check-circle-duotone',
              desc: 'when project milestones are finished',
            },
            {
              key: 'invoiceNotifications',
              label: 'invoice notifications',
              icon: 'ph:currency-dollar-duotone',
              desc: 'new invoices and payment reminders',
            },
            {
              key: 'contractReminders',
              label: 'contract reminders',
              icon: 'ph:file-text-duotone',
              desc: 'contracts pending your signature',
            },
            {
              key: 'fileUploads',
              label: 'file uploads',
              icon: 'ph:folder-duotone',
              desc: 'when new files are shared with you',
            },
            {
              key: 'weeklyDigest',
              label: 'weekly digest',
              icon: 'ph:chart-line-duotone',
              desc: 'weekly summary of all activity',
            },
          ].map((item, index) => (
            <motion.div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-cream/50 transition-colors border-2 border-transparent hover:border-ink/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <div className="flex items-center gap-4">
                <Icon icon={item.icon} className="w-8 h-8 text-ink" />
                <div>
                  <div className="font-display font-black text-ink uppercase text-sm">
                    {item.label}
                  </div>
                  <div className="text-sm text-ink/60 font-bold">{item.desc}</div>
                </div>
              </div>

              <motion.button
                onClick={() => togglePreference(item.key as keyof EmailPreferences)}
                className={`relative w-14 h-7 rounded-full transition-colors border-3 border-ink ${
                  preferences[item.key as keyof EmailPreferences] ? 'bg-matcha' : 'bg-cream'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
                  animate={{
                    x: preferences[item.key as keyof EmailPreferences] ? 28 : 2,
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
        className="bg-milk-tea rounded-lg p-4 border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-ink font-bold text-center flex items-center justify-center gap-2">
          <Icon icon="ph:lightbulb-duotone" className="w-5 h-5 text-ink" />
          <strong className="uppercase">tip:</strong> you can unsubscribe from any email type at any
          time using the links in our emails
        </p>
      </motion.div>
    </motion.div>
  );
}
