'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Mail, Phone, Building, Eye } from 'lucide-react';
import { User } from '@/types/portal';
import ClientProfileView from './ClientProfileView';
import Pagination from '@/components/common/Pagination';
import { usePagination } from '@/hooks/usePagination';

export default function ClientManager() {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<User | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (clientId: string, updateData: Partial<User>) => {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        setClients((prev) =>
          prev.map((client) => (client.id === clientId ? updatedClient : client))
        );
        setEditingClient(null);
        return true;
      }
    } catch (error) {
      console.error('Error updating client:', error);
    }
    return false;
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Use pagination hook
  const {
    paginatedData: paginatedClients,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    setItemsPerPage,
    totalItems,
  } = usePagination({ data: filteredClients, initialItemsPerPage: 12 });

  // Show client profile view if a client is selected
  if (selectedClientId) {
    return (
      <ClientProfileView clientId={selectedClientId} onBack={() => setSelectedClientId(null)} />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">client management</h2>
            <p className="text-ink/60 mt-1">manage all client accounts and information</p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors"
          >
            <Plus size={18} />
            <span>add client</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
          <input
            type="text"
            placeholder="search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-taro/20"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {paginatedClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onViewProfile={(id) => setSelectedClientId(id)}
              onEditClient={(client) => setEditingClient(client)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {filteredClients.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-ink/10">
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

      {/* Edit Client Modal */}
      {editingClient && (
        <EditClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onUpdate={updateClient}
        />
      )}
    </div>
  );
}

function ClientCard({
  client,
  onViewProfile,
  onEditClient,
}: {
  client: User;
  onViewProfile: (id: string) => void;
  onEditClient: (client: User) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10 hover:shadow-lg transition-all"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-taro/20 rounded-full flex items-center justify-center">
          <span className="font-semibold text-taro">
            {client.name?.charAt(0) || client.email.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-ink">{client.name || 'No name'}</h3>
          <p className="text-sm text-ink/60">{client.role}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-ink/40" />
          <span className="text-ink/70">{client.email}</span>
        </div>
        {client.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-ink/40" />
            <span className="text-ink/70">{client.phone}</span>
          </div>
        )}
        {client.company && (
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-ink/40" />
            <span className="text-ink/70">{client.company}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-ink/50">
          joined {new Date(client.createdAt).toLocaleDateString()}
        </span>
        <div className="flex space-x-1">
          <button
            onClick={() => onViewProfile(client.id)}
            className="p-2 text-ink/60 hover:text-taro hover:bg-taro/10 rounded-lg transition-colors"
            title="View Profile"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEditClient(client)}
            className="p-2 text-ink/60 hover:text-ink hover:bg-ink/5 rounded-lg transition-colors"
            title="Edit Client"
          >
            <Edit size={14} />
          </button>
          <button className="p-1 text-ink/60 hover:text-red-500">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function EditClientModal({
  client,
  onClose,
  onUpdate,
}: {
  client: User;
  onClose: () => void;
  onUpdate: (clientId: string, data: Partial<User>) => Promise<boolean>;
}) {
  const [formData, setFormData] = useState({
    name: client.name || '',
    email: client.email,
    phone: client.phone || '',
    company: client.company || '',
    role: client.role,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await onUpdate(client.id, formData);
    setLoading(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Edit Client</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taro/20 focus:border-taro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taro/20 focus:border-taro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taro/20 focus:border-taro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taro/20 focus:border-taro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as 'CLIENT' | 'ADMIN' | 'OWNER' })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taro/20 focus:border-taro"
            >
              <option value="CLIENT">Client</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-taro to-brown-sugar text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Client'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
