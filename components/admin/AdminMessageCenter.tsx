'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Users, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import OnlineStatusIndicator from '@/components/common/OnlineStatusIndicator';

interface Client {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  isOnline?: boolean;
  lastActiveAt?: Date | null;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string | null;
  senderImage?: string | null;
  createdAt: string;
  isRead: boolean;
}

export default function AdminMessageCenter() {
  const { data: session } = useSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchClients();

    // Poll for online status every 10 seconds
    const interval = setInterval(fetchClients, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchMessages(selectedClient.id);

      // Poll for new messages every 3 seconds
      const interval = setInterval(() => fetchMessages(selectedClient.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedClient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchMessages = async (clientId: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${clientId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedClient || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/messages/${selectedClient.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(selectedClient.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-180px)] flex gap-6">
      {/* Client List Sidebar */}
      <div className="w-80 bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] flex flex-col">
        {/* Search */}
        <div className="p-4 border-b-4 border-ink">
          <h3 className="font-display font-black text-xl text-ink mb-3 uppercase">
            Client Messages
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-3 border-ink rounded-lg focus:outline-none focus:ring-4 focus:ring-taro/20 text-ink font-bold"
            />
          </div>
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto">
          {filteredClients.length === 0 ? (
            <div className="p-4 text-center text-ink/60 font-bold">No clients found</div>
          ) : (
            filteredClients.map((client) => {
              const isSelected = selectedClient?.id === client.id;

              return (
                <motion.button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`w-full p-4 flex items-center gap-3 border-b-2 border-ink/10 transition-colors ${
                    isSelected ? 'bg-taro/10 border-l-4 border-l-taro' : 'hover:bg-cream/30'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="relative flex-shrink-0">
                    {client.image ? (
                      <img
                        src={client.image}
                        alt={client.name || ''}
                        className="w-12 h-12 rounded-full object-cover border-3 border-ink"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-taro to-deep-taro border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center text-white font-black">
                        {client.name?.charAt(0).toUpperCase() ||
                          client.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {client.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-matcha rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-black text-ink truncate">
                      {client.name || client.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-ink/60 truncate font-bold">{client.email}</p>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Message Area */}
      {selectedClient ? (
        <div className="flex-1 bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b-4 border-ink flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {selectedClient.image ? (
                  <img
                    src={selectedClient.image}
                    alt={selectedClient.name || ''}
                    className="w-12 h-12 rounded-full object-cover border-3 border-ink"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-taro to-deep-taro border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center text-white font-black text-lg">
                    {selectedClient.name?.charAt(0).toUpperCase() ||
                      selectedClient.email.charAt(0).toUpperCase()}
                  </div>
                )}
                {selectedClient.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-matcha rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-ink uppercase">
                  {selectedClient.name || selectedClient.email.split('@')[0]}
                </h3>
                <div className="flex items-center gap-2">
                  <OnlineStatusIndicator
                    isOnline={selectedClient.isOnline || false}
                    lastActiveAt={selectedClient.lastActiveAt || null}
                    size="sm"
                  />
                  <span className="text-xs text-ink/60 font-bold">{selectedClient.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-ink/60 font-bold">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.senderId === session?.user?.id;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        isOwn
                          ? 'bg-taro text-white rounded-2xl rounded-br-sm border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]'
                          : 'bg-cream text-ink rounded-2xl rounded-bl-sm border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]'
                      } px-4 py-3`}
                    >
                      <p className="text-sm font-bold">{message.content}</p>
                      <div
                        className={`text-xs mt-1 font-bold ${isOwn ? 'text-white/70' : 'text-ink/40'}`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t-4 border-ink">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 px-4 py-3 bg-white border-3 border-ink rounded-lg focus:outline-none focus:ring-4 focus:ring-taro/20 text-ink font-bold"
              />
              <motion.button
                onClick={sendMessage}
                disabled={!newMessage.trim() || loading}
                className="px-6 py-3 bg-matcha text-ink rounded-full font-black border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-display font-black text-2xl text-ink mb-2 uppercase">
              Select a Client
            </h3>
            <p className="text-ink/60 font-bold">
              Choose a client from the list to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
