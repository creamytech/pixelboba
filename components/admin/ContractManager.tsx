'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Send, FileCheck, Eye } from 'lucide-react';
import { Contract, ContractStatus } from '@/types/portal';

export default function ContractManager() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch('/api/admin/contracts');
      if (response.ok) {
        const data = await response.json();
        setContracts(data.contracts);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.client.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions: (ContractStatus | 'ALL')[] = [
    'ALL',
    'DRAFT',
    'SENT',
    'SIGNED',
    'EXPIRED',
    'CANCELLED',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">contract management</h2>
            <p className="text-ink/60 mt-1">create, send, and track client contracts</p>
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors">
            <Plus size={18} />
            <span>new contract</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
            <input
              type="text"
              placeholder="search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-taro/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContractStatus | 'ALL')}
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

      {/* Contracts List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-ink/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-milk-tea/20">
            <tr>
              <th className="text-left p-4 font-medium text-ink">contract</th>
              <th className="text-left p-4 font-medium text-ink">client</th>
              <th className="text-left p-4 font-medium text-ink">status</th>
              <th className="text-left p-4 font-medium text-ink">created</th>
              <th className="text-left p-4 font-medium text-ink">actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredContracts.map((contract) => (
                <ContractRow key={contract.id} contract={contract} />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContractRow({ contract }: { contract: Contract }) {
  const getStatusColor = (status: ContractStatus) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-700',
      SENT: 'bg-blue-100 text-blue-700',
      SIGNED: 'bg-green-100 text-green-700',
      EXPIRED: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-gray-100 text-gray-700',
    };
    return colors[status];
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-b border-ink/5 hover:bg-milk-tea/10 transition-colors"
    >
      <td className="p-4">
        <div className="font-medium text-ink">{contract.title}</div>
      </td>
      <td className="p-4">
        <div className="text-ink">{contract.client.name}</div>
      </td>
      <td className="p-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(contract.status)}`}
        >
          {contract.status.toLowerCase()}
        </span>
      </td>
      <td className="p-4">
        <div className="text-ink">{new Date(contract.createdAt).toLocaleDateString()}</div>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <button className="p-1 text-ink/60 hover:text-ink">
            <Eye size={16} />
          </button>
          <button className="p-1 text-ink/60 hover:text-ink">
            <Edit size={16} />
          </button>
          {contract.status === 'DRAFT' && (
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
