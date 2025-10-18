'use client';

import { motion } from 'framer-motion';
import { Search, Bell, Sparkles, Calendar, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DashboardHeaderProps {
  userName: string;
  notificationCount?: number;
}

export default function DashboardHeader({ userName, notificationCount = 0 }: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState('');
  const [emoji, setEmoji] = useState('👋');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
      setEmoji('☀️');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
      setEmoji('🌤️');
    } else {
      setGreeting('Good Evening');
      setEmoji('🌙');
    }
  }, []);

  const quickActions = [
    { label: 'New Project', icon: <Sparkles className="w-4 h-4" />, color: 'from-taro to-taro/80' },
    {
      label: 'Quick Task',
      icon: <Zap className="w-4 h-4" />,
      color: 'from-brown-sugar to-brown-sugar/80',
    },
    {
      label: 'Schedule',
      icon: <Calendar className="w-4 h-4" />,
      color: 'from-milk-tea to-brown-sugar/60',
    },
  ];

  return (
    <div className="mb-8">
      {/* Greeting Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-2"
          >
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, 14, -8, 14, 0] }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              {emoji}
            </motion.span>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-ink">
              {greeting},{' '}
              <span className="bg-gradient-to-r from-taro via-brown-sugar to-taro bg-clip-text text-transparent">
                {userName}
              </span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-ink/60 font-body text-sm md:text-base"
          >
            Ready to make some magic happen today? ✨
          </motion.p>
        </div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <button className="p-3 bg-white/70 backdrop-blur-sm border-2 border-brown-sugar/10 rounded-2xl hover:bg-white/90 transition-all shadow-sm hover:shadow-md">
            <Bell className="w-5 h-5 text-taro" />
            {notificationCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </motion.div>
            )}
          </button>
        </motion.div>
      </div>

      {/* Search & Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col md:flex-row gap-4"
      >
        {/* Search Bar */}
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40 group-focus-within:text-taro transition-colors" />
          <input
            type="text"
            placeholder="Search projects, tasks, or team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/70 backdrop-blur-sm border-2 border-brown-sugar/10 rounded-2xl font-body text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-taro/30 focus:bg-white transition-all shadow-sm hover:shadow-md"
          />
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
            >
              ✕
            </motion.button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-4 py-3.5 bg-gradient-to-r ${action.color} text-white rounded-2xl
                font-display font-medium text-sm shadow-md hover:shadow-lg
                flex items-center gap-2 transition-all
                whitespace-nowrap
              `}
            >
              {action.icon}
              <span className="hidden md:inline">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
