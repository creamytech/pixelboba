import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ClientPortalClient from './ClientPortalClient';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  FileText,
  CreditCard,
  FileCheck,
  Upload,
  Bell,
  User,
  LogOut,
} from 'lucide-react';
import BobaProgressIndicator from '@/components/portal/BobaProgressIndicator';
import MessageCenter from '@/components/portal/MessageCenter';
import InvoiceCenter from '@/components/portal/InvoiceCenter';
import ContractCenter from '@/components/portal/ContractCenter';
import FileCenter from '@/components/portal/FileCenter';
import NotificationCenter from '@/components/portal/NotificationCenter';
import { Project, User as UserType } from '@/types/portal';

interface PortalData {
  user: UserType;
  projects: Project[];
  unreadMessages: number;
  pendingInvoices: number;
  pendingContracts: number;
}

export default async function ClientPortal() {
  const session = await getServerSession(authOptions);

  console.log('Portal page - session check:', {
    exists: !!session,
    user: session?.user,
    timestamp: new Date().toISOString(),
  });

  if (!session) {
    console.log('Portal page - no session found, redirecting to signin');
    redirect('/auth/signin');
  }

  console.log('Portal page - session valid, rendering client portal');
  return <ClientPortalClient session={session} />;
}
