import { useEffect, useState, useCallback } from 'react';
import { pusherClient, PUSHER_EVENTS } from '@/lib/pusher';
import type { Channel, PresenceChannel } from 'pusher-js';

interface UseRealtimeOptions {
  projectId: string;
  onTaskCreated?: (task: any) => void;
  onTaskUpdated?: (task: any) => void;
  onTaskDeleted?: (taskId: string) => void;
  onTaskMoved?: (data: { taskId: string; status: string; order: number }) => void;
  onCommentAdded?: (comment: any) => void;
  enabled?: boolean;
}

interface PresenceMember {
  id: string;
  info: {
    name: string;
    email: string;
    image?: string;
  };
}

export function useRealtime({
  projectId,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
  onTaskMoved,
  onCommentAdded,
  enabled = true,
}: UseRealtimeOptions) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [presenceChannel, setPresenceChannel] = useState<PresenceChannel | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<PresenceMember[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !projectId) return;

    // Subscribe to project channel for task updates
    const projectChannel = pusherClient.subscribe(`private-project-${projectId}`);
    setChannel(projectChannel);

    // Subscribe to presence channel for online users
    const presChannel = pusherClient.subscribe(`presence-project-${projectId}`) as PresenceChannel;
    setPresenceChannel(presChannel);

    // Connection state
    pusherClient.connection.bind('connected', () => {
      setIsConnected(true);
    });

    pusherClient.connection.bind('disconnected', () => {
      setIsConnected(false);
    });

    // Task events
    if (onTaskCreated) {
      projectChannel.bind(PUSHER_EVENTS.TASK_CREATED, onTaskCreated);
    }

    if (onTaskUpdated) {
      projectChannel.bind(PUSHER_EVENTS.TASK_UPDATED, onTaskUpdated);
    }

    if (onTaskDeleted) {
      projectChannel.bind(PUSHER_EVENTS.TASK_DELETED, onTaskDeleted);
    }

    if (onTaskMoved) {
      projectChannel.bind(PUSHER_EVENTS.TASK_MOVED, onTaskMoved);
    }

    if (onCommentAdded) {
      projectChannel.bind(PUSHER_EVENTS.COMMENT_ADDED, onCommentAdded);
    }

    // Presence events
    presChannel.bind('pusher:subscription_succeeded', (members: any) => {
      const membersList: PresenceMember[] = [];
      members.each((member: any) => {
        membersList.push({
          id: member.id,
          info: member.info,
        });
      });
      setOnlineUsers(membersList);
    });

    presChannel.bind('pusher:member_added', (member: any) => {
      setOnlineUsers((prev) => [
        ...prev,
        {
          id: member.id,
          info: member.info,
        },
      ]);
    });

    presChannel.bind('pusher:member_removed', (member: any) => {
      setOnlineUsers((prev) => prev.filter((u) => u.id !== member.id));
    });

    return () => {
      projectChannel.unbind_all();
      projectChannel.unsubscribe();
      presChannel.unbind_all();
      presChannel.unsubscribe();
    };
  }, [
    projectId,
    enabled,
    onTaskCreated,
    onTaskUpdated,
    onTaskDeleted,
    onTaskMoved,
    onCommentAdded,
  ]);

  const triggerTyping = useCallback(
    (taskId: string) => {
      if (presenceChannel) {
        presenceChannel.trigger('client-user-typing', { taskId });
      }
    },
    [presenceChannel]
  );

  return {
    channel,
    presenceChannel,
    onlineUsers,
    isConnected,
    triggerTyping,
  };
}
