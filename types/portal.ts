export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'ADMIN' | 'OWNER';
  phone?: string;
  company?: string;
  image?: string;
  emailPreferences?: EmailPreferences;
  createdAt: Date;
}

export interface EmailPreferences {
  newMessages: boolean;
  projectUpdates: boolean;
  milestoneCompletions: boolean;
  invoiceNotifications: boolean;
  contractReminders: boolean;
  fileUploads: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  progress: number; // 0-100
  startDate: Date;
  deadline?: Date;
  completedAt?: Date;
  websiteUrl?: string; // URL for real-time progress viewing
  client: User;
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completedAt?: Date;
  projectId: string;
  order?: number;
  createdAt?: Date;
  targetDate?: Date;
}

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  isRead: boolean;
  sender: User;
  project?: Project;
  file?: File;
  createdAt: Date;
}

export interface Contract {
  id: string;
  title: string;
  content: string;
  status: ContractStatus;
  sentAt?: Date;
  signedAt?: Date;
  expiresAt?: Date;
  client: User;
  project?: Project;
  signatures: Signature[];
  files: File[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Signature {
  id: string;
  imageData: string; // Base64 encoded
  signer: User;
  signedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface Invoice {
  id: string;
  number: string;
  title: string;
  description?: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  paidAt?: Date;
  client: User;
  project?: Project;
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface File {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploader: User;
  project?: Project;
  contract?: Contract;
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  sender?: User;
  recipient: User;
  createdAt: Date;
}

export interface Activity {
  id: string;
  action: string;
  description: string;
  user: User;
  project?: Project;
  metadata?: any;
  createdAt: Date;
}

export type ProjectStatus =
  | 'DISCOVERY'
  | 'WIREFRAMING'
  | 'DESIGN'
  | 'DEVELOPMENT'
  | 'TESTING'
  | 'LAUNCH'
  | 'MAINTENANCE'
  | 'COMPLETED'
  | 'PAUSED'
  | 'CANCELLED';

export type ContractStatus = 'DRAFT' | 'SENT' | 'SIGNED' | 'EXPIRED' | 'CANCELLED';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export type MessageType = 'TEXT' | 'FILE' | 'SYSTEM' | 'PROJECT_UPDATE';

export type NotificationType =
  | 'MESSAGE'
  | 'INVOICE'
  | 'CONTRACT'
  | 'PROJECT_UPDATE'
  | 'PAYMENT_RECEIVED'
  | 'SYSTEM';

export interface BobaProgressProps {
  progress: number; // 0-100
  status: ProjectStatus;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}
