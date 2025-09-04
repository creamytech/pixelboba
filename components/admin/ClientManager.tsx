'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Mail, Phone, Building } from 'lucide-react';
import { User } from '@/types/portal';

export default function ClientManager() {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ClientCard({ client }: { client: User }) {
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
          <button className="p-1 text-ink/60 hover:text-ink">
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
