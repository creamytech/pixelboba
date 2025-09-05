'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  isFromVisitor: boolean;
  isFromBot: boolean;
  timestamp: Date;
  senderName?: string;
}

interface ChatWidget {
  sessionId: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [hasIntroduced, setHasIntroduced] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate session ID on mount
  useEffect(() => {
    const existingSessionId = sessionStorage.getItem('chatSessionId');
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      const newSessionId =
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setSessionId(newSessionId);
      sessionStorage.setItem('chatSessionId', newSessionId);
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeChat = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          source: window.location.pathname,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);

        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          content:
            "Hi! 🧋 I'm Boba Bot from Pixel Boba! I'm here to help you brew up something amazing. What kind of digital project are you dreaming about?",
          isFromVisitor: false,
          isFromBot: true,
          timestamp: new Date(),
          senderName: '🧋 Boba Bot',
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && !isConnected && sessionId) {
      initializeChat();
    }
  }, [isOpen, isConnected, sessionId, initializeChat]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !sessionId) return;

    const message = newMessage.trim();
    setNewMessage('');

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isFromVisitor: true,
      isFromBot: false,
      timestamp: new Date(),
      senderName: visitorName || 'You',
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send to API
    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          content: message,
          visitorName,
          visitorEmail,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Add bot/admin response
        if (data.response) {
          const responseMessage: ChatMessage = {
            id: data.messageId || Date.now().toString(),
            content: data.response,
            isFromVisitor: false,
            isFromBot: data.isFromBot,
            timestamp: new Date(),
            senderName: data.senderName || (data.isFromBot ? '🧋 Boba Bot' : '✨ Pixel Boba Team'),
          };
          setMessages((prev) => [...prev, responseMessage]);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-taro hover:bg-taro/80 text-white p-4 rounded-full shadow-lg transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 w-96 h-96 bg-white rounded-xl shadow-2xl border border-ink/10 z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-ink/10 bg-gradient-to-r from-taro to-taro/80 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold flex items-center gap-2">
                    🧋 Chat with Pixel Boba
                  </h3>
                  <p className="text-xs text-white/80">brewing fresh responses instantly</p>
                </div>
                <button
                  onClick={toggleChat}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading && (
                <div className="text-center text-ink/50">
                  <div className="animate-pulse flex items-center justify-center gap-2">
                    🧋 <span>brewing connection...</span>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isFromVisitor ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      message.isFromVisitor
                        ? 'bg-taro text-white'
                        : message.isFromBot
                          ? 'bg-milk-tea/30 text-ink'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70">{message.senderName}</span>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-ink/10">
              {!hasIntroduced && messages.length > 1 && (
                <div className="mb-3 space-y-2">
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
                  />
                  <input
                    type="email"
                    placeholder="Your email (optional)"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
                  />
                  <button
                    onClick={() => setHasIntroduced(true)}
                    className="text-xs text-taro hover:underline"
                  >
                    Continue without details →
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-sm border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="p-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
