'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Send, FileCheck, Eye, X, User } from 'lucide-react';
import { Contract, ContractStatus, User as UserType } from '@/types/portal';
import Pagination from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';

export default function ContractManager() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'ALL'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clients, setClients] = useState<UserType[]>([]);
  const [templates, setTemplates] = useState<
    Array<{ templateId: string; name: string; description?: string }>
  >([]);

  useEffect(() => {
    fetchContracts();
    fetchClients();
    fetchDocuSignTemplates();
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

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchDocuSignTemplates = async () => {
    try {
      const response = await fetch('/api/admin/docusign/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching DocuSign templates:', error);
      setTemplates([]);
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.client.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Use pagination hook
  const {
    paginatedData: paginatedContracts,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    setItemsPerPage,
    totalItems,
  } = usePagination({ data: filteredContracts, initialItemsPerPage: 20 });

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

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] font-black uppercase"
          >
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
              className="w-full pl-10 pr-4 py-2 border-4 border-ink rounded-lg bg-white/70 text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-taro/20 font-bold"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContractStatus | 'ALL')}
            className="px-4 py-2 border-3 border-ink rounded-lg bg-white/70 text-ink focus:outline-none focus:ring-2 focus:ring-taro/20 font-black uppercase"
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
      <div className="bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden border-4 border-ink">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-milk-tea to-cream border-b-4 border-ink">
            <tr>
              <th className="text-left p-4 font-black uppercase text-sm text-ink">contract</th>
              <th className="text-left p-4 font-black uppercase text-sm text-ink">client</th>
              <th className="text-left p-4 font-black uppercase text-sm text-ink">status</th>
              <th className="text-left p-4 font-black uppercase text-sm text-ink">created</th>
              <th className="text-left p-4 font-black uppercase text-sm text-ink">actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedContracts.map((contract) => (
                <ContractRow key={contract.id} contract={contract} />
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {/* Pagination */}
        {filteredContracts.length > 0 && (
          <div className="border-t border-ink/10 p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        )}
      </div>

      {/* Create Contract Modal */}
      {showCreateModal && (
        <CreateContractModal
          clients={clients}
          templates={templates}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchContracts();
          }}
        />
      )}
    </div>
  );
}

function ContractRow({ contract }: { contract: Contract }) {
  const getStatusColor = (status: ContractStatus) => {
    const colors = {
      DRAFT: 'bg-taro text-white',
      SENT: 'bg-thai-tea text-white',
      SIGNED: 'bg-matcha text-ink',
      EXPIRED: 'bg-strawberry text-white',
      CANCELLED: 'bg-strawberry text-white',
    };
    return colors[status];
  };

  const handleSendContract = async () => {
    try {
      const response = await fetch(`/api/admin/contracts/${contract.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SENT' }),
      });

      if (response.ok) {
        window.location.reload(); // Simple refresh - in production you'd update state
      } else {
        alert('Failed to send contract');
      }
    } catch (error) {
      console.error('Error sending contract:', error);
      alert('Failed to send contract');
    }
  };

  const handleDeleteContract = async () => {
    if (!confirm('Are you sure you want to delete this contract?')) return;

    try {
      const response = await fetch(`/api/admin/contracts/${contract.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload(); // Simple refresh - in production you'd update state
      } else {
        alert('Failed to delete contract');
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      alert('Failed to delete contract');
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-b-2 border-ink/10 hover:bg-cream/30 transition-colors"
    >
      <td className="p-4">
        <div className="font-bold text-ink">{contract.title}</div>
      </td>
      <td className="p-4">
        <div className="font-bold text-ink">{contract.client.name}</div>
      </td>
      <td className="p-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-black uppercase border-2 border-ink ${getStatusColor(contract.status)}`}
        >
          {contract.status.toLowerCase()}
        </span>
      </td>
      <td className="p-4">
        <div className="font-bold text-ink">
          {new Date(contract.createdAt).toLocaleDateString()}
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => alert(`View contract: ${contract.title}`)}
            className="p-1 text-ink/60 hover:text-ink"
            title="View contract"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => alert(`Edit contract: ${contract.title}`)}
            className="p-1 text-ink/60 hover:text-ink"
            title="Edit contract"
          >
            <Edit size={16} />
          </button>
          {contract.status === 'DRAFT' && (
            <button
              onClick={handleSendContract}
              className="p-1 text-ink/60 hover:text-blue-500"
              title="Send contract via DocuSign"
            >
              <Send size={16} />
            </button>
          )}
          {contract.status !== 'SIGNED' && (
            <button
              onClick={handleDeleteContract}
              className="p-1 text-ink/60 hover:text-red-500"
              title="Delete contract"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

interface CreateContractModalProps {
  clients: UserType[];
  templates: Array<{ templateId: string; name: string; description?: string }>;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateContractModal({ clients, templates, onClose, onSuccess }: CreateContractModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    clientId: '',
    projectId: '',
    expiresAt: '',
    templateId: '', // DocuSign template
    contractType: 'custom', // 'template' or 'custom'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
          projectId: formData.projectId || null,
          // Include template info if using template
          ...(formData.contractType === 'template' && {
            templateId: formData.templateId,
            content: 'Template-based contract', // Placeholder content
          }),
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        console.error('Error creating contract:', error);
        alert('Failed to create contract: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Failed to create contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)]"
      >
        <div className="p-6 border-b border-ink/10">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-black text-ink uppercase">
              create new contract
            </h3>
            <button onClick={onClose} className="p-1 text-ink/60 hover:text-ink">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase text-ink mb-2">
              contract title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border-3 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 font-bold"
              placeholder="enter contract title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">contract type *</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="template"
                  checked={formData.contractType === 'template'}
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                  className="mr-2"
                />
                use docusign template
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="custom"
                  checked={formData.contractType === 'custom'}
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                  className="mr-2"
                />
                custom content
              </label>
            </div>
          </div>

          {formData.contractType === 'template' && (
            <div>
              <label className="block text-sm font-medium text-ink mb-2">docusign template *</label>
              <select
                required
                value={formData.templateId}
                onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                className="w-full px-4 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
              >
                <option value="">select a docusign template...</option>
                {templates.map((template) => (
                  <option key={template.templateId} value={template.templateId}>
                    {template.name}
                    {template.description && ` - ${template.description}`}
                  </option>
                ))}
              </select>
              {templates.length === 0 && (
                <p className="text-sm text-amber-600 mt-1">
                  no docusign templates found. make sure you have templates in your docusign
                  account.
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold uppercase text-ink mb-2">client *</label>
            <select
              required
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-4 py-2 border-3 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 font-bold"
            >
              <option value="">select a client...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name || client.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase text-ink mb-2">
              project (optional)
            </label>
            <input
              type="text"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-4 py-2 border-3 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 font-bold"
              placeholder="project id (leave blank if none)..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase text-ink mb-2">
              expiration date (optional)
            </label>
            <input
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              className="w-full px-4 py-2 border-3 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 font-bold"
            />
          </div>

          {formData.contractType === 'custom' && (
            <div>
              <label className="block text-sm font-bold uppercase text-ink mb-2">
                contract content *
              </label>
              <textarea
                required
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border-3 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 resize-y font-bold"
                placeholder="enter contract terms and content..."
              />
            </div>
          )}

          {formData.contractType === 'template' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                using docusign template: when you send this contract, it will use the selected
                template with pre-positioned signature fields and form elements.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-ink/60 hover:text-ink transition-colors border-3 border-ink rounded-lg font-black uppercase shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors disabled:opacity-50 border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] font-black uppercase"
            >
              {loading ? 'creating...' : 'create contract'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
