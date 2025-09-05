'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export function useOnlineStatus() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const isOnlineRef = useRef(false);

  const updateStatus = async (action: 'online' | 'offline' | 'heartbeat') => {
    if (!session?.user) return;

    try {
      await fetch('/api/user/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
    } catch (error) {
      console.error('Failed to update online status:', error);
    }
  };

  const setOnline = () => {
    if (!isOnlineRef.current) {
      isOnlineRef.current = true;
      updateStatus('online');

      // Start heartbeat every 30 seconds
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }

      heartbeatInterval.current = setInterval(() => {
        updateStatus('heartbeat');
      }, 30000);
    }
  };

  const setOffline = () => {
    if (isOnlineRef.current) {
      isOnlineRef.current = false;
      updateStatus('offline');

      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
    }
  };

  useEffect(() => {
    if (!session?.user) return;

    // Set online when component mounts
    setOnline();

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setOffline();
      } else {
        setOnline();
      }
    };

    // Handle browser/tab close
    const handleBeforeUnload = () => {
      setOffline();
    };

    // Handle focus/blur events
    const handleFocus = () => setOnline();
    const handleBlur = () => setOffline();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      setOffline();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);

      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, [session?.user]);

  return { setOnline, setOffline };
}
