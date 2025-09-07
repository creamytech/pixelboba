'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Check, X, TestTube } from 'lucide-react';

interface NotificationType {
  id: string;
  name: string;
  description: string;
}

const notificationTypes: NotificationType[] = [
  { id: 'message', name: 'New Message', description: 'Test new message notification' },
  {
    id: 'milestone',
    name: 'Milestone Completed',
    description: 'Test milestone completion notification',
  },
  { id: 'update', name: 'Project Update', description: 'Test project update notification' },
];

export default function NotificationTestPanel() {
  const [selectedType, setSelectedType] = useState<string>('message');
  const [email, setEmail] = useState<string>('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const sendTestNotification = async () => {
    if (!selectedType) return;

    setSending(true);
    setResult(null);

    try {
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          email: email || undefined, // Use session email if not provided
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ success: false, message: data.error || 'Failed to send notification' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Network error occurred' });
    } finally {
      setSending(false);
      // Clear result after 5 seconds
      setTimeout(() => setResult(null), 5000);
    }
  };

  return (
    <motion.div
      className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-brown-sugar/20 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-taro/10 rounded-lg flex items-center justify-center">
          <TestTube className="w-5 h-5 text-taro" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-ink lowercase">
            test notifications
          </h3>
          <p className="text-sm text-ink/60 lowercase">
            send test emails to verify notification system
          </p>
        </div>
      </div>

      {/* Notification Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-ink mb-3 lowercase">
          notification type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {notificationTypes.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedType === type.id
                  ? 'border-taro bg-taro/10 text-taro'
                  : 'border-brown-sugar/20 bg-white/50 hover:border-taro/40 text-ink/70'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-display font-semibold text-sm mb-1 lowercase">{type.name}</div>
              <div className="text-xs text-ink/60 lowercase">{type.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Email Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-ink mb-2 lowercase">
          recipient email (optional)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Leave blank to use your session email"
          className="w-full px-4 py-3 bg-white/70 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro/40 transition-all"
        />
        <p className="text-xs text-ink/50 mt-1 lowercase">
          if left blank, the notification will be sent to your logged-in email
        </p>
      </div>

      {/* Send Button */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={sendTestNotification}
          disabled={sending || !selectedType}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            sending || !selectedType
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-taro hover:bg-taro/90 text-white shadow-lg hover:shadow-xl'
          }`}
          whileHover={!sending && selectedType ? { scale: 1.02 } : {}}
          whileTap={!sending && selectedType ? { scale: 0.98 } : {}}
        >
          {sending ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              sending...
            </>
          ) : (
            <>
              <Send size={16} />
              send test notification
            </>
          )}
        </motion.button>

        {/* Result Status */}
        {result && (
          <motion.div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              result.success
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {result.success ? <Check size={16} /> : <X size={16} />}
            <span className="text-sm font-medium">{result.message}</span>
          </motion.div>
        )}
      </div>

      {/* Info Section */}
      <motion.div
        className="mt-6 bg-milk-tea/30 rounded-lg p-4 border border-brown-sugar/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-taro mt-0.5" />
          <div>
            <h4 className="font-display font-semibold text-ink mb-2 lowercase">
              about test notifications
            </h4>
            <ul className="text-sm text-ink/70 space-y-1 lowercase">
              <li>• test emails use mock data and realistic content</li>
              <li>• emails are sent through resend with pixel boba branding</li>
              <li>• check your spam folder if you don&apos;t receive the email</li>
              <li>• notifications respect user preferences when sent to real users</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
