'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Users, Wifi, WifiOff } from 'lucide-react';

interface PresenceMember {
  id: string;
  info: {
    name: string;
    email: string;
    image?: string;
  };
}

interface PresenceIndicatorProps {
  users: PresenceMember[];
  isConnected: boolean;
  currentUserId?: string;
}

export default function PresenceIndicator({
  users,
  isConnected,
  currentUserId,
}: PresenceIndicatorProps) {
  const otherUsers = users.filter((u) => u.id !== currentUserId);

  return (
    <div className="flex items-center gap-3">
      {/* Connection Status */}
      <motion.div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-display ${
          isConnected
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isConnected ? (
          <>
            <Wifi className="w-3 h-3" />
            <span>live</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            <span>offline</span>
          </>
        )}
      </motion.div>

      {/* Online Users */}
      {otherUsers.length > 0 && (
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 bg-taro/10 border border-taro/20 rounded-lg"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Users className="w-3 h-3 text-taro" />
          <div className="flex -space-x-2">
            <AnimatePresence>
              {otherUsers.slice(0, 3).map((user) => (
                <motion.div
                  key={user.id}
                  className="relative group"
                  initial={{ scale: 0, x: -10 }}
                  animate={{ scale: 1, x: 0 }}
                  exit={{ scale: 0, x: 10 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  title={user.info.name}
                >
                  {user.info.image ? (
                    <img
                      src={user.info.image}
                      alt={user.info.name}
                      className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-taro/30"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-taro text-white flex items-center justify-center text-xs font-bold ring-1 ring-taro/30">
                      {user.info.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {otherUsers.length > 3 && (
            <span className="text-xs font-medium text-taro">+{otherUsers.length - 3}</span>
          )}
        </motion.div>
      )}
    </div>
  );
}
