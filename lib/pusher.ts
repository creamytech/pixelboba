import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side Pusher instance
export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  authEndpoint: '/api/pusher/auth',
  auth: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

// Event types
export const PUSHER_EVENTS = {
  // Task events
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_MOVED: 'task:moved',
  COMMENT_ADDED: 'comment:added',

  // User presence events
  USER_JOINED: 'user:joined',
  USER_LEFT: 'user:left',
  USER_TYPING: 'user:typing',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',

  // Message events
  MESSAGE_NEW: 'message:new',
  MESSAGE_READ: 'message:read',
  MESSAGE_TYPING_START: 'message:typing-start',
  MESSAGE_TYPING_STOP: 'message:typing-stop',

  // Notification events
  NOTIFICATION_NEW: 'notification:new',

  // Project events
  PROJECT_UPDATED: 'project:updated',
  MILESTONE_UPDATED: 'milestone:updated',

  // Invoice events
  INVOICE_CREATED: 'invoice:created',
  INVOICE_UPDATED: 'invoice:updated',
  INVOICE_PAID: 'invoice:paid',

  // Contract events
  CONTRACT_SENT: 'contract:sent',
  CONTRACT_SIGNED: 'contract:signed',

  // File events
  FILE_UPLOADED: 'file:uploaded',
} as const;

// Channel helpers
export const CHANNELS = {
  project: (projectId: string) => `private-project-${projectId}`,
  user: (userId: string) => `private-user-${userId}`,
  admin: () => 'private-admin',
  presence: (projectId: string) => `presence-project-${projectId}`,
} as const;

// Trigger a Pusher event
export async function triggerPusherEvent(channel: string, event: string, data: any) {
  try {
    await pusherServer.trigger(channel, event, data);
  } catch (error) {
    console.error('Failed to trigger Pusher event:', error);
  }
}
