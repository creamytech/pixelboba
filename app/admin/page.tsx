import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';
import { motion } from 'framer-motion';
import {
  Users,
  FolderOpen,
  FileText,
  CreditCard,
  Settings,
  Plus,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Calendar,
} from 'lucide-react';
import ProjectManager from '@/components/admin/ProjectManager';
import ClientManager from '@/components/admin/ClientManager';
import ContractManager from '@/components/admin/ContractManager';
import InvoiceManager from '@/components/admin/InvoiceManager';
import AdminSettings from '@/components/admin/AdminSettings';

interface AdminStats {
  totalClients: number;
  activeProjects: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  completedProjects: number;
  averageProjectDuration: number;
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  if (session.user?.role !== 'ADMIN' && session.user?.role !== 'OWNER') {
    redirect('/portal');
  }

  return <AdminDashboardClient session={session} />;
}
