'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Send, Users, Bell, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

interface Client {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export default function NotificationSender() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<string>('SYSTEM');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [broadcastToAll, setBroadcastToAll] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          type,
          recipientIds: broadcastToAll ? undefined : selectedClients,
          broadcastToAll,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send notification');
      }

      setSuccess(`Notification sent successfully to ${data.count} recipient(s)`);

      // Reset form
      setTitle('');
      setMessage('');
      setType('SYSTEM');
      setSelectedClients([]);
      setBroadcastToAll(false);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
    );
  };

  const selectAllClients = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map((c) => c.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-taro animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-black text-3xl text-ink uppercase mb-2">Notification Center</h2>
        <p className="text-ink/70 font-bold">Send notifications and announcements to clients</p>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-strawberry/20 border-3 border-strawberry rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-strawberry flex-shrink-0 mt-0.5" />
          <p className="text-strawberry font-bold flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-strawberry">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-matcha/20 border-3 border-matcha rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" />
          <p className="text-ink font-bold flex-1">{success}</p>
          <button onClick={() => setSuccess(null)} className="text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Form */}
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-xl text-ink uppercase">Compose Notification</h3>
              <p className="text-ink/70 font-bold text-sm">Send updates to your clients</p>
            </div>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block font-black text-sm text-ink uppercase mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Notification title..."
                className="w-full px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block font-black text-sm text-ink uppercase mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Type your message..."
                rows={5}
                className="w-full px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro resize-none"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block font-black text-sm text-ink uppercase mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
              >
                <option value="SYSTEM">System Announcement</option>
                <option value="PROJECT_UPDATE">Project Update</option>
                <option value="MESSAGE">Message</option>
                <option value="INVOICE">Invoice Notification</option>
                <option value="CONTRACT">Contract Notification</option>
                <option value="PAYMENT_RECEIVED">Payment Received</option>
              </select>
            </div>

            {/* Broadcast Toggle */}
            <div className="bg-cream/50 rounded-lg p-4 border-2 border-ink">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={broadcastToAll}
                  onChange={(e) => {
                    setBroadcastToAll(e.target.checked);
                    if (e.target.checked) {
                      setSelectedClients([]);
                    }
                  }}
                  className="w-5 h-5 border-3 border-ink rounded focus:ring-3 focus:ring-taro"
                />
                <div className="flex-1">
                  <p className="font-black text-ink uppercase text-sm">Broadcast to All Clients</p>
                  <p className="text-ink/70 font-bold text-xs">
                    Send this notification to every client
                  </p>
                </div>
                <Users className="w-5 h-5 text-taro" />
              </label>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={sending || (!broadcastToAll && selectedClients.length === 0)}
              className="w-full px-6 py-4 bg-gradient-to-r from-taro to-deep-taro text-white font-black rounded-xl border-4 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[1px_1px_0px_0px_rgba(58,0,29,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Notification
                </>
              )}
            </button>
          </form>
        </div>

        {/* Client Selection */}
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
          <div className="border-b-4 border-ink p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-xl text-ink uppercase">Select Recipients</h3>
                <p className="text-ink/70 font-bold text-sm">
                  {selectedClients.length} of {clients.length} selected
                </p>
              </div>
              {!broadcastToAll && (
                <button
                  onClick={selectAllClients}
                  className="px-4 py-2 bg-taro/10 text-taro font-black rounded-lg border-2 border-taro hover:bg-taro hover:text-white transition-colors uppercase text-xs"
                >
                  {selectedClients.length === clients.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
          </div>

          <div className="p-4 max-h-[600px] overflow-y-auto">
            {broadcastToAll ? (
              <div className="py-12 text-center">
                <Icon icon="ph:broadcast-duotone" className="w-16 h-16 text-taro/50 mx-auto mb-4" />
                <p className="font-black text-ink uppercase">Broadcasting to All Clients</p>
                <p className="text-ink/70 font-bold text-sm">
                  This notification will be sent to all {clients.length} client(s)
                </p>
              </div>
            ) : clients.length === 0 ? (
              <div className="py-12 text-center">
                <Icon icon="ph:users-duotone" className="w-16 h-16 text-ink/30 mx-auto mb-4" />
                <p className="font-black text-ink uppercase">No Clients Found</p>
                <p className="text-ink/70 font-bold text-sm">Add clients to send notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {clients.map((client) => (
                  <label
                    key={client.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border-3 cursor-pointer transition-all ${
                      selectedClients.includes(client.id)
                        ? 'bg-taro/10 border-taro'
                        : 'bg-white border-ink/20 hover:border-taro/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={() => toggleClientSelection(client.id)}
                      className="w-5 h-5 border-3 border-ink rounded focus:ring-3 focus:ring-taro"
                    />
                    <div className="w-10 h-10 bg-taro/20 rounded-full border-2 border-ink flex items-center justify-center flex-shrink-0">
                      {client.image ? (
                        <img
                          src={client.image}
                          alt={client.name || client.email}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Icon icon="ph:user-duotone" className="w-5 h-5 text-taro" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-ink truncate">{client.name || client.email}</p>
                      <p className="text-ink/70 font-bold text-sm truncate">{client.email}</p>
                    </div>
                    {selectedClients.includes(client.id) && (
                      <CheckCircle2 className="w-5 h-5 text-taro flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
