'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Send, DollarSign } from 'lucide-react';
import { Invoice, InvoiceStatus } from '@/types/portal';

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingAmount = invoices
    .filter((inv) => ['SENT', 'OVERDUE'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const statusOptions: (InvoiceStatus | 'ALL')[] = [
    'ALL',
    'DRAFT',
    'SENT',
    'PAID',
    'OVERDUE',
    'CANCELLED',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">invoice management</h2>
            <p className="text-ink/60 mt-1">create and track client invoices</p>
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors">
            <Plus size={18} />
            <span>new invoice</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-medium">total revenue</p>
              <p className="text-2xl font-bold text-ink">${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500/60" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-medium">pending amount</p>
              <p className="text-2xl font-bold text-ink">${pendingAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-500/60" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink/60 text-sm font-medium">total invoices</p>
              <p className="text-2xl font-bold text-ink">{invoices.length}</p>
            </div>
            <DollarSign className="w-8 h-8 text-taro/60" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
            <input
              type="text"
              placeholder="search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-taro/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | 'ALL')}
            className="px-4 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink focus:outline-none focus:ring-2 focus:ring-taro/20"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'all statuses' : status.toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-ink/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-milk-tea/20">
            <tr>
              <th className="text-left p-4 font-medium text-ink">invoice #</th>
              <th className="text-left p-4 font-medium text-ink">client</th>
              <th className="text-left p-4 font-medium text-ink">amount</th>
              <th className="text-left p-4 font-medium text-ink">due date</th>
              <th className="text-left p-4 font-medium text-ink">status</th>
              <th className="text-left p-4 font-medium text-ink">actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredInvoices.map((invoice) => (
                <InvoiceRow key={invoice.id} invoice={invoice} />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const getStatusColor = (status: InvoiceStatus) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-700',
      SENT: 'bg-blue-100 text-blue-700',
      PAID: 'bg-green-100 text-green-700',
      OVERDUE: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-gray-100 text-gray-700',
    };
    return colors[status];
  };

  const isOverdue = invoice.status === 'SENT' && new Date(invoice.dueDate) < new Date();
  const displayStatus = isOverdue ? 'OVERDUE' : invoice.status;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-b border-ink/5 hover:bg-milk-tea/10 transition-colors"
    >
      <td className="p-4">
        <div className="font-medium text-ink">{invoice.number}</div>
        <div className="text-sm text-ink/60">{invoice.title}</div>
      </td>
      <td className="p-4">
        <div className="text-ink">{invoice.client.name}</div>
      </td>
      <td className="p-4">
        <div className="font-medium text-ink">${invoice.totalAmount.toLocaleString()}</div>
      </td>
      <td className="p-4">
        <div className="text-ink">{new Date(invoice.dueDate).toLocaleDateString()}</div>
      </td>
      <td className="p-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(displayStatus as InvoiceStatus)}`}
        >
          {displayStatus.toLowerCase()}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <button className="p-1 text-ink/60 hover:text-ink">
            <Edit size={16} />
          </button>
          {invoice.status === 'DRAFT' && (
            <button className="p-1 text-ink/60 hover:text-blue-500">
              <Send size={16} />
            </button>
          )}
          <button className="p-1 text-ink/60 hover:text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
