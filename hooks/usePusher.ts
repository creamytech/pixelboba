import { useEffect, useRef, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
import type { Channel } from 'pusher-js';

interface UsePusherOptions {
  channelName: string;
  enabled?: boolean;
}

interface UsePusherReturn {
  channel: Channel | null;
  isConnected: boolean;
  subscribe: (event: string, callback: (data: any) => void) => void;
  unsubscribe: (event: string, callback?: (data: any) => void) => void;
  trigger: (event: string, data: any) => void;
}

export function usePusher({ channelName, enabled = true }: UsePusherOptions): UsePusherReturn {
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<Channel | null>(null);
  const callbacksRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  useEffect(() => {
    if (!enabled) return;

    // Subscribe to channel
    const channel = pusherClient.subscribe(channelName);
    channelRef.current = channel;

    // Handle connection state
    channel.bind('pusher:subscription_succeeded', () => {
      setIsConnected(true);
    });

    channel.bind('pusher:subscription_error', (error: any) => {
      console.error('Pusher subscription error:', error);
      setIsConnected(false);
    });

    return () => {
      // Unbind all event listeners
      callbacksRef.current.forEach((callbacks, event) => {
        callbacks.forEach((callback) => {
          channel.unbind(event, callback);
        });
      });
      callbacksRef.current.clear();

      // Unsubscribe from channel
      pusherClient.unsubscribe(channelName);
      channelRef.current = null;
      setIsConnected(false);
    };
  }, [channelName, enabled]);

  const subscribe = (event: string, callback: (data: any) => void) => {
    if (!channelRef.current) return;

    // Store callback reference
    if (!callbacksRef.current.has(event)) {
      callbacksRef.current.set(event, new Set());
    }
    callbacksRef.current.get(event)!.add(callback);

    // Bind event
    channelRef.current.bind(event, callback);
  };

  const unsubscribe = (event: string, callback?: (data: any) => void) => {
    if (!channelRef.current) return;

    if (callback) {
      // Unbind specific callback
      channelRef.current.unbind(event, callback);
      callbacksRef.current.get(event)?.delete(callback);
    } else {
      // Unbind all callbacks for this event
      const callbacks = callbacksRef.current.get(event);
      if (callbacks) {
        callbacks.forEach((cb) => {
          channelRef.current!.unbind(event, cb);
        });
        callbacksRef.current.delete(event);
      }
    }
  };

  const trigger = (event: string, data: any) => {
    if (!channelRef.current) return;

    // Only available for presence/private channels with client events enabled
    if (channelName.startsWith('private-') || channelName.startsWith('presence-')) {
      channelRef.current.trigger(`client-${event}`, data);
    }
  };

  return {
    channel: channelRef.current,
    isConnected,
    subscribe,
    unsubscribe,
    trigger,
  };
}

// Hook for presence channels (shows who's online)
export function usePresence(channelName: string) {
  const [members, setMembers] = useState<Map<string, any>>(new Map());
  const { channel, isConnected } = usePusher({ channelName });

  useEffect(() => {
    if (!channel || !channelName.startsWith('presence-')) return;

    // Handle member added
    const handleMemberAdded = (member: any) => {
      setMembers((prev) => new Map(prev).set(member.id, member.info));
    };

    // Handle member removed
    const handleMemberRemoved = (member: any) => {
      setMembers((prev) => {
        const next = new Map(prev);
        next.delete(member.id);
        return next;
      });
    };

    // Handle subscription success (get all current members)
    const handleSubscriptionSucceeded = (members: any) => {
      const membersMap = new Map();
      members.each((member: any) => {
        membersMap.set(member.id, member.info);
      });
      setMembers(membersMap);
    };

    channel.bind('pusher:subscription_succeeded', handleSubscriptionSucceeded);
    channel.bind('pusher:member_added', handleMemberAdded);
    channel.bind('pusher:member_removed', handleMemberRemoved);

    return () => {
      channel.unbind('pusher:subscription_succeeded', handleSubscriptionSucceeded);
      channel.unbind('pusher:member_added', handleMemberAdded);
      channel.unbind('pusher:member_removed', handleMemberRemoved);
    };
  }, [channel, channelName]);

  return {
    members: Array.from(members.entries()).map(([id, info]) => ({ id, ...info })),
    memberCount: members.size,
    isConnected,
  };
}
