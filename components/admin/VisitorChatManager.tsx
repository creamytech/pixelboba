'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, User, Clock, Send, X, CheckCircle } from 'lucide-react';

interface VisitorChat {
  id: string;
  sessionId: string;
  visitorName: string | null;
  visitorEmail: string | null;
  status: 'BOT' | 'LIVE' | 'ENDED';
  source: string | null;
  createdAt: string;
  assignedAdmin?: {
    id: string;
    name: string;
  } | null;
  messages: VisitorChatMessage[];
}

interface VisitorChatMessage {
  id: string;
  content: string;
  isFromVisitor: boolean;
  isFromBot: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
  } | null;
}

export default function VisitorChatManager() {
  const [chats, setChats] = useState<VisitorChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<VisitorChat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
    // Set up polling for new messages
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [fetchChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/visitor-chats');
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);

        // Update selected chat if it exists
        if (selectedChat) {
          const updatedChat = data.chats.find((c: VisitorChat) => c.id === selectedChat.id);
          if (updatedChat) {
            setSelectedChat(updatedChat);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedChat]);

  const takeOverChat = async (chatId: string) => {
    try {
      const response = await fetch('/api/admin/visitor-chats/takeover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId }),
      });

      if (response.ok) {
        fetchChats();
      }
    } catch (error) {
      console.error('Failed to take over chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sending) return;

    setSending(true);
    try {
      const response = await fetch('/api/admin/visitor-chats/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selectedChat.id,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchChats();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const endChat = async (chatId: string) => {
    try {
      const response = await fetch('/api/admin/visitor-chats/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId }),
      });

      if (response.ok) {
        if (selectedChat?.id === chatId) {
          setSelectedChat(null);
        }
        fetchChats();
      }
    } catch (error) {
      console.error('Failed to end chat:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BOT':
        return 'bg-gray-100 text-gray-800';
      case 'LIVE':
        return 'bg-green-100 text-green-800';
      case 'ENDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="text-center">Loading visitor chats...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-semibold text-ink">visitor chats</h3>
          <div className="text-sm text-ink/60">
            {chats.filter((c) => c.status !== 'ENDED').length} active
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Chat List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="text-center text-ink/50 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-ink/30" />
                <p>No visitor chats yet</p>
              </div>
            ) : (
              chats.map((chat) => (
                <motion.button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedChat?.id === chat.id
                      ? 'bg-taro/10 border-taro'
                      : 'bg-white/50 border-ink/10 hover:bg-milk-tea/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <User size={16} className="text-ink/60" />
                        <span className="font-medium text-ink">
                          {chat.visitorName || 'Anonymous Visitor'}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(chat.status)}`}
                        >
                          {chat.status.toLowerCase()}
                        </span>
                      </div>
                      <div className="text-sm text-ink/60 mb-2">
                        {chat.visitorEmail || 'No email provided'}
                      </div>
                      <div className="text-xs text-ink/40 flex items-center space-x-4">
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatTime(chat.createdAt)}
                        </span>
                        {chat.source && <span>From: {chat.source}</span>}
                      </div>
                    </div>
                    {chat.status === 'BOT' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          takeOverChat(chat.id);
                        }}
                        className="px-3 py-1 text-xs bg-taro text-white rounded-full hover:bg-taro/80"
                      >
                        Take Over
                      </button>
                    )}
                    {chat.status === 'LIVE' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          endChat(chat.id);
                        }}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        End Chat
                      </button>
                    )}
                  </div>
                </motion.button>
              ))
            )}
          </div>

          {/* Chat Messages */}
          <div className="border border-ink/10 rounded-lg bg-white/50">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-ink/10 bg-taro/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-ink">
                        {selectedChat.visitorName || 'Anonymous Visitor'}
                      </h4>
                      <p className="text-sm text-ink/60">
                        {selectedChat.visitorEmail || 'No email provided'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedChat.status)}`}
                      >
                        {selectedChat.status.toLowerCase()}
                      </div>
                      <div className="text-xs text-ink/40 mt-1">
                        Started {formatTime(selectedChat.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  {selectedChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromVisitor ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg p-3 ${
                          message.isFromVisitor
                            ? 'bg-gray-100 text-gray-800'
                            : message.isFromBot
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-taro text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="text-xs mt-1 opacity-70">
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {selectedChat.status === 'LIVE' && (
                  <div className="p-4 border-t border-ink/10">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 text-sm border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
                        disabled={sending}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="p-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors disabled:opacity-50"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-ink/50">
                Select a chat to view messages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
