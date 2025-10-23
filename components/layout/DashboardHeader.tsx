'use client';

import { motion } from 'framer-motion';
import { Bell, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface DashboardHeaderProps {
  userName: string;
  notificationCount?: number;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
}

export default function DashboardHeader({
  userName,
  notificationCount = 0,
  onSearchClick,
  onNotificationClick,
}: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState('');
  const [icon, setIcon] = useState('ph:hand-waving-duotone');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
      setIcon('ph:sun-duotone');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
      setIcon('ph:cloud-sun-duotone');
    } else {
      setGreeting('Good Evening');
      setIcon('ph:moon-duotone');
    }
  }, []);

  return (
    <div className="mb-6 lg:mb-8 pt-16 lg:pt-0">
      {/* Greeting Section */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 lg:gap-3 mb-2"
          >
            <motion.div
              animate={{ rotate: [0, 14, -8, 14, 0] }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              <Icon icon={icon} className="w-10 h-10 lg:w-12 lg:h-12 text-taro flex-shrink-0" />
            </motion.div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-ink truncate">
              {greeting},{' '}
              <span className="bg-gradient-to-r from-taro via-deep-taro to-taro bg-clip-text text-transparent">
                {userName}
              </span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-ink/60 font-bold text-sm sm:text-base md:text-lg"
          >
            Ready to make some magic happen today? ✨
          </motion.p>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex items-center gap-2 lg:gap-3 flex-shrink-0"
        >
          {/* Search Button */}
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="p-3 lg:p-4 bg-white rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[1px_1px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all group"
              title="Search (⌘K)"
            >
              <Search
                className="w-6 h-6 text-matcha group-hover:text-taro transition-colors"
                strokeWidth={2.5}
              />
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={onNotificationClick}
              className="p-3 lg:p-4 bg-white rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[1px_1px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
              title="Notifications"
            >
              <Bell className="w-6 h-6 text-taro" strokeWidth={2.5} />
              {notificationCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 bg-strawberry rounded-full border-2 border-ink flex items-center justify-center text-white text-xs font-black shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </motion.div>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
