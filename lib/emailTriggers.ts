import {
  sendNewMessage,
  sendMilestoneCompleted,
  sendProjectUpdate,
  sendInvoiceReady,
  sendFilesUploaded,
} from '@/lib/resend';
import { User, Project, Message, Milestone, Invoice } from '@/types/portal';

// Helper to check if user wants this type of notification
const shouldSendNotification = (
  user: User,
  notificationType: keyof NonNullable<User['emailPreferences']>
): boolean => {
  const preferences = user.emailPreferences;
  if (!preferences) return true; // Default to sending if no preferences set

  return Boolean(preferences[notificationType]);
};

// Helper to check quiet hours
const isInQuietHours = (user: User): boolean => {
  const preferences = user.emailPreferences;
  if (!preferences?.quietHours) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const [startHour, startMinute] = preferences.quietHours.start.split(':').map(Number);
  const [endHour, endMinute] = preferences.quietHours.end.split(':').map(Number);

  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  if (startTime <= endTime) {
    // Same day quiet hours (e.g., 22:00 - 08:00 next day)
    return currentTime >= startTime && currentTime <= endTime;
  } else {
    // Overnight quiet hours (e.g., 22:00 - 08:00)
    return currentTime >= startTime || currentTime <= endTime;
  }
};

// Email trigger functions

export const triggerNewMessageEmail = async (
  recipient: User,
  message: Message,
  project: Project,
  sender: User
) => {
  if (!shouldSendNotification(recipient, 'newMessages')) {
    console.log('User has disabled new message notifications');
    return;
  }

  // Skip if in quiet hours for non-urgent messages
  if (isInQuietHours(recipient)) {
    console.log('User is in quiet hours, queuing for later');
    // TODO: Queue for after quiet hours
    return;
  }

  const emailData = {
    clientName: recipient.name,
    projectName: project.name,
    senderName: sender.name,
    messagePreview: message.content.substring(0, 150) + (message.content.length > 150 ? '...' : ''),
    messageId: message.id,
    projectId: project.id,
  };

  try {
    sendNewMessage(recipient.email, emailData);
    console.log(`New message email triggered for ${recipient.email}`);
  } catch (error) {
    console.error('Failed to trigger new message email:', error);
  }
};

export const triggerMilestoneCompletedEmail = async (
  recipient: User,
  milestone: Milestone,
  project: Project
) => {
  if (!shouldSendNotification(recipient, 'milestoneCompletions')) {
    console.log('User has disabled milestone completion notifications');
    return;
  }

  const emailData = {
    clientName: recipient.name,
    projectName: project.name,
    milestoneName: milestone.title,
    milestoneDescription: milestone.description || 'No description provided',
    completedAt: milestone.completedAt,
    nextSteps: getNextMilestoneText(project, milestone),
    projectId: project.id,
  };

  try {
    sendMilestoneCompleted(recipient.email, emailData);
    console.log(`Milestone completion email triggered for ${recipient.email}`);
  } catch (error) {
    console.error('Failed to trigger milestone completion email:', error);
  }
};

export const triggerProjectUpdateEmail = async (
  recipient: User,
  project: Project,
  updates: string[]
) => {
  if (!shouldSendNotification(recipient, 'projectUpdates')) {
    console.log('User has disabled project update notifications');
    return;
  }

  const emailData = {
    clientName: recipient.name,
    projectName: project.name,
    progress: project.progress,
    currentPhase: project.status,
    updates,
    projectId: project.id,
  };

  try {
    sendProjectUpdate(recipient.email, emailData);
    console.log(`Project update email triggered for ${recipient.email}`);
  } catch (error) {
    console.error('Failed to trigger project update email:', error);
  }
};

export const triggerInvoiceReadyEmail = async (
  recipient: User,
  invoice: Invoice,
  project?: Project
) => {
  if (!shouldSendNotification(recipient, 'invoiceNotifications')) {
    console.log('User has disabled invoice notifications');
    return;
  }

  const emailData = {
    clientName: recipient.name,
    projectName: project?.name || 'General Services',
    invoiceNumber: invoice.number,
    amount: invoice.totalAmount.toFixed(2),
    dueDate: invoice.dueDate,
    invoiceId: invoice.id,
  };

  try {
    sendInvoiceReady(recipient.email, emailData);
    console.log(`Invoice ready email triggered for ${recipient.email}`);
  } catch (error) {
    console.error('Failed to trigger invoice ready email:', error);
  }
};

export const triggerFilesUploadedEmail = async (
  recipient: User,
  project: Project,
  files: { name: string; type: string; size: number }[]
) => {
  if (!shouldSendNotification(recipient, 'fileUploads')) {
    console.log('User has disabled file upload notifications');
    return;
  }

  const emailData = {
    clientName: recipient.name,
    projectName: project.name,
    files: files.map((file) => ({
      name: file.name,
      type: file.type,
      size: formatFileSize(file.size),
    })),
    fileCount: files.length,
    projectId: project.id,
  };

  try {
    sendFilesUploaded(recipient.email, emailData);
    console.log(`Files uploaded email triggered for ${recipient.email}`);
  } catch (error) {
    console.error('Failed to trigger files uploaded email:', error);
  }
};

// Helper functions

const getNextMilestoneText = (project: Project, completedMilestone: Milestone): string => {
  const sortedMilestones = project.milestones.sort((a, b) => (a.order || 0) - (b.order || 0));
  const currentIndex = sortedMilestones.findIndex((m) => m.id === completedMilestone.id);
  const nextMilestone = sortedMilestones[currentIndex + 1];

  if (nextMilestone) {
    return `We're now moving on to ${nextMilestone.title}: ${nextMilestone.description || 'Details coming soon'}`;
  } else {
    return "This was the final milestone! We'll be in touch about project completion and next steps.";
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Batch operations for efficiency

export const triggerBatchProjectUpdates = async (
  recipients: User[],
  project: Project,
  updates: string[]
) => {
  const promises = recipients.map((recipient) =>
    triggerProjectUpdateEmail(recipient, project, updates)
  );

  await Promise.allSettled(promises);
};

export const triggerBatchMilestoneEmails = async (
  recipients: User[],
  milestone: Milestone,
  project: Project
) => {
  const promises = recipients.map((recipient) =>
    triggerMilestoneCompletedEmail(recipient, milestone, project)
  );

  await Promise.allSettled(promises);
};

// Weekly digest functionality
export const triggerWeeklyDigest = async (user: User) => {
  if (!shouldSendNotification(user, 'weeklyDigest')) {
    return;
  }

  // TODO: Implement weekly digest email
  // This would gather all activity from the past week and send a summary
  console.log(`Weekly digest would be sent to ${user.email}`);
};

// Test function for development
export const sendTestNotification = async (recipient: User, type: string) => {
  const mockProject: Project = {
    id: 'test-project',
    name: 'Test Project',
    description: 'A test project for email notifications',
    status: 'DEVELOPMENT',
    progress: 65,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    client: recipient,
    milestones: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMessage: Message = {
    id: 'test-message',
    content: 'This is a test message to verify email notifications are working correctly.',
    type: 'TEXT',
    isRead: false,
    sender: {
      id: 'admin',
      name: 'Pixel Boba Team',
      email: 'team@pixelboba.com',
      role: 'ADMIN',
      createdAt: new Date(),
    },
    project: mockProject,
    createdAt: new Date(),
  };

  switch (type) {
    case 'message':
      await triggerNewMessageEmail(recipient, mockMessage, mockProject, mockMessage.sender);
      break;
    case 'milestone':
      const mockMilestone: Milestone = {
        id: 'test-milestone',
        title: 'Design Phase',
        description: 'Complete visual design and user interface mockups',
        completedAt: new Date(),
        projectId: mockProject.id,
        order: 2,
        createdAt: new Date(),
      };
      await triggerMilestoneCompletedEmail(recipient, mockMilestone, mockProject);
      break;
    case 'update':
      await triggerProjectUpdateEmail(recipient, mockProject, [
        'Completed user interface designs',
        'Started development of core features',
        'Scheduled client review for next week',
      ]);
      break;
    default:
      console.error('Unknown test notification type:', type);
  }
};
