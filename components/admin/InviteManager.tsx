'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Copy, Check, Clock, User, Mail, Calendar, X } from 'lucide-react';

interface Invite {
  id: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
  usedBy?: {
    name: string;
    email: string;
  };
}

export default function InviteManager() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState<string | null>(null);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const response = await fetch('/api/admin/invites');
      if (response.ok) {
        const data = await response.json();
        setInvites(data.invites);
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteUrl = async (token: string) => {
    const inviteUrl = `${window.location.origin}/signup?invite=${token}`;
    await navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(token);
    setTimeout(() => setCopiedInvite(null), 2000);
  };

  const filteredInvites = invites.filter(
    (invite) =>
      invite.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invite.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusInfo = (invite: Invite) => {
    if (invite.usedAt) {
      return { status: 'used', color: 'text-green-600', bg: 'bg-green-100', label: 'used' };
    }
    if (new Date(invite.expiresAt) < new Date()) {
      return { status: 'expired', color: 'text-red-600', bg: 'bg-red-100', label: 'expired' };
    }
    return { status: 'pending', color: 'text-blue-600', bg: 'bg-blue-100', label: 'pending' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-milk-tea/70 backdrop-blur-sm rounded-xl p-6 border border-brown-sugar/20">
          <div className="animate-pulse">
            <div className="h-8 bg-brown-sugar/20 rounded mb-4"></div>
            <div className="h-4 bg-brown-sugar/20 rounded mb-2"></div>
            <div className="h-4 bg-brown-sugar/20 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-milk-tea/70 backdrop-blur-sm rounded-xl p-6 border border-brown-sugar/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">invite management</h2>
            <p className="text-ink/60 mt-1">create and manage user invitations</p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors"
          >
            <Plus size={18} />
            <span>create invite</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-milk-tea/70 backdrop-blur-sm rounded-xl p-6 border border-brown-sugar/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
          <input
            type="text"
            placeholder="search invites by email or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-milk-tea/70 border border-brown-sugar/20 rounded-lg text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-taro/20"
          />
        </div>
      </div>

      {/* Invites List */}
      <div className="bg-milk-tea/70 backdrop-blur-sm rounded-xl p-6 border border-brown-sugar/20">
        {filteredInvites.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-ink/40 mx-auto mb-4" />
            <h3 className="font-medium text-ink mb-2">no invites found</h3>
            <p className="text-ink/60 text-sm">
              {searchQuery
                ? 'no invites match your search'
                : 'create your first invite to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvites.map((invite) => {
              const statusInfo = getStatusInfo(invite);
              return (
                <motion.div
                  key={invite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/60 rounded-lg p-4 border border-brown-sugar/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-ink/60" />
                          <span className="font-medium text-ink">{invite.email}</span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-taro/10 text-taro">
                          {invite.role}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-ink/60">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Created by {invite.createdBy.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Expires {new Date(invite.expiresAt).toLocaleDateString()}</span>
                        </div>
                        {invite.usedBy && (
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4" />
                            <span>Used by {invite.usedBy.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {!invite.usedAt && new Date(invite.expiresAt) > new Date() && (
                      <button
                        onClick={() => copyInviteUrl(invite.token)}
                        className="flex items-center space-x-2 px-3 py-1 text-sm bg-taro/10 text-taro rounded-lg hover:bg-taro/20 transition-colors"
                      >
                        {copiedInvite === invite.token ? (
                          <>
                            <Check size={14} />
                            <span>copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>copy link</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Invite Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <CreateInviteModal
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              fetchInvites();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateInviteModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'CLIENT',
    expiresInDays: 7,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setInviteUrl(data.inviteUrl);
        // Copy to clipboard automatically
        await navigator.clipboard.writeText(data.inviteUrl);
        setTimeout(() => onSuccess(), 3000); // Auto close after showing URL
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to create invite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-ink">create invite</h2>
            <button onClick={onClose} className="text-ink/40 hover:text-ink transition-colors">
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {inviteUrl ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-medium text-ink">invite created successfully!</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-ink/60 mb-2">Invite URL (copied to clipboard):</p>
                <code className="text-xs bg-white p-2 rounded border block break-all">
                  {inviteUrl}
                </code>
              </div>
              <p className="text-sm text-ink/60">
                Share this link with {formData.email}. It expires in {formData.expiresInDays} days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">email address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-milk-tea/50 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-milk-tea/50 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                >
                  <option value="CLIENT">Client</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">expires in (days)</label>
                <select
                  value={formData.expiresInDays}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresInDays: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-milk-tea/50 border border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20 focus:bg-milk-tea/70 text-ink"
                >
                  <option value={1}>1 day</option>
                  <option value={3}>3 days</option>
                  <option value={7}>1 week</option>
                  <option value={14}>2 weeks</option>
                  <option value={30}>1 month</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-ink/70 hover:text-ink transition-colors"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>create invite</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
