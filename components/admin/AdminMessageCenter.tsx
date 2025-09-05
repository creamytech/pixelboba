'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, FileText, X, MessageCircle, Plus } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Project } from '@/types/portal';
import OnlineStatusIndicator from '@/components/common/OnlineStatusIndicator';

interface AdminMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: string;
    image?: string;
  };
  timestamp: Date;
  isOwn: boolean;
  file?: {
    originalName: string;
    url: string;
    mimetype: string;
  };
}

interface AdminMessageCenterProps {
  projects: Project[];
  onClose: () => void;
}

export default function AdminMessageCenter({ projects, onClose }: AdminMessageCenterProps) {
  const [selectedProject, setSelectedProject] = useState<string>(projects[0]?.id || '');
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [clients, setClients] = useState<
    Array<{
      id: string;
      name: string | null;
      email: string;
      isOnline: boolean;
      lastActiveAt: Date | null;
    }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedProject) {
      fetchMessages(selectedProject);
    }
    fetchClients();
  }, [selectedProject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (projectId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/messages?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(
          data.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.createdAt),
            isOwn: msg.sender.role === 'ADMIN' || msg.sender.role === 'OWNER',
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const sendMessage = async () => {
    if (!newMessage.trim() && uploadingFiles.length === 0) return;

    const messageData = {
      content: newMessage.trim(),
      projectId: selectedProject,
      files: uploadingFiles,
    };

    try {
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const newMsg = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            ...newMsg.message,
            timestamp: new Date(newMsg.message.createdAt),
            isOwn: true,
          },
        ]);
        setNewMessage('');
        setUploadingFiles([]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadingFiles((prev) => [...prev, ...acceptedFiles]);
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedProjectData = projects.find((p) => p.id === selectedProject);

  if (showNewConversation) {
    return (
      <NewConversationModal
        clients={clients}
        onClientSelect={async (clientId) => {
          // Find or create project with the client
          const clientData = clients.find((c) => c.id === clientId);
          if (clientData) {
            // For now, just close the modal - in a full implementation,
            // you'd create a new project or find an existing one
            setShowNewConversation(false);
            // Could add logic here to create a new project or select an existing one
            console.log('Starting conversation with client:', clientData.email);
          }
        }}
        onCancel={() => setShowNewConversation(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Only close if clicking the backdrop itself, not child elements
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{ touchAction: 'none' }} // Allow touch manipulation within children
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-6xl w-full min-h-[500px] h-[90vh] max-h-[900px] flex flex-col lg:flex-row touch-manipulation"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Project Sidebar */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-ink/10 flex flex-col max-h-64 lg:max-h-none lg:h-full">
          <div className="p-4 border-b border-ink/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-taro" />
                <h3 className="font-display text-lg font-semibold text-ink">admin messaging</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-ink/60 hover:text-ink transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <button
              onClick={() => setShowNewConversation(true)}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-taro hover:bg-taro/80 text-white rounded-lg transition-colors text-sm"
            >
              <Plus size={16} />
              <span>New Conversation</span>
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
          >
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className={`w-full p-4 text-left border-b border-ink/5 transition-colors ${
                  selectedProject === project.id
                    ? 'bg-taro/10 border-l-4 border-l-taro'
                    : 'hover:bg-milk-tea/20'
                }`}
              >
                <div className="font-medium text-ink">{project.name}</div>
                <div className="text-sm text-ink/60 capitalize mt-1">
                  {project.status.toLowerCase().replace('_', ' ')}
                </div>
                <div className="text-sm text-ink/60">{project.client.name}</div>
                <div className="text-xs text-ink/40 mt-1">{project.progress}% complete</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-ink/10 bg-white/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {selectedProjectData?.name}
                </h3>
                <p className="text-sm text-ink/60">
                  messaging with {selectedProjectData?.client.name}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain p-2 sm:p-4 space-y-4 touch-pan-y"
            style={{
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
              overscrollBehavior: 'contain',
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-ink/50">loading messages...</div>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}
                      >
                        <div
                          className={`rounded-2xl p-3 ${
                            message.isOwn
                              ? 'bg-taro text-white rounded-br-sm'
                              : 'bg-milk-tea/30 text-ink rounded-bl-sm'
                          }`}
                        >
                          {message.file && <FilePreview file={message.file} />}
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div
                          className={`text-xs text-ink/40 mt-1 flex items-center gap-1 ${
                            message.isOwn ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {!message.isOwn && (
                            <>
                              {(() => {
                                const clientStatus = clients.find(
                                  (c) => c.id === message.sender.id
                                );
                                return clientStatus ? (
                                  <OnlineStatusIndicator
                                    isOnline={clientStatus.isOnline}
                                    lastActiveAt={clientStatus.lastActiveAt}
                                    size="sm"
                                  />
                                ) : null;
                              })()}
                            </>
                          )}
                          <span>
                            {message.sender.name} • {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      {!message.isOwn && (
                        <div className="w-8 h-8 rounded-full bg-taro/20 flex items-center justify-center order-1 mr-3 mt-1">
                          {message.sender.image ? (
                            <img
                              src={message.sender.image}
                              alt={message.sender.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-medium text-taro">
                              {message.sender.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* File Upload Area */}
          {uploadingFiles.length > 0 && (
            <div className="p-4 border-t border-ink/10 bg-milk-tea/10">
              <div className="flex flex-wrap gap-2">
                {uploadingFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-white/70 rounded-lg p-2 text-sm"
                  >
                    <FileText size={16} className="text-ink/60" />
                    <span className="text-ink">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-ink/40 hover:text-ink"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-ink/10 bg-white/50">
            <div
              className={`flex items-center space-x-3 p-3 border rounded-xl transition-colors ${
                isDragActive ? 'border-taro bg-taro/5' : 'border-ink/20 bg-white/70 hover:bg-white'
              }`}
            >
              <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />
                <button type="button" className="text-ink/60 hover:text-taro transition-colors">
                  <Paperclip size={20} />
                </button>
              </div>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={
                  isDragActive
                    ? 'drop files here or type your message...'
                    : 'type your message to client...'
                }
                className="flex-1 bg-transparent outline-none text-ink placeholder-ink/50"
              />

              <button
                onClick={sendMessage}
                className="text-taro hover:text-taro/80 transition-colors disabled:opacity-50"
                disabled={!newMessage.trim() && uploadingFiles.length === 0}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FilePreview({ file }: { file: { originalName: string; url: string; mimetype: string } }) {
  const isImage = file.mimetype.startsWith('image/');

  return (
    <div className="mb-2">
      {isImage ? (
        <img src={file.url} alt={file.originalName} className="max-w-full h-auto rounded-lg" />
      ) : (
        <div className="flex items-center space-x-2 p-2 bg-white/20 rounded-lg">
          <FileText size={16} />
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline text-taro"
          >
            {file.originalName}
          </a>
        </div>
      )}
    </div>
  );
}

interface NewConversationModalProps {
  clients: Array<{
    id: string;
    name: string | null;
    email: string;
    isOnline: boolean;
    lastActiveAt: Date | null;
  }>;
  onClientSelect: (clientId: string) => void;
  onCancel: () => void;
}

function NewConversationModal({ clients, onClientSelect, onCancel }: NewConversationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-ink/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-ink">Start New Conversation</h3>
            <button onClick={onCancel} className="p-2 text-ink/60 hover:text-ink transition-colors">
              <X size={20} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/50"
          />
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredClients.length === 0 ? (
            <div className="p-4 text-center text-ink/60">No clients found</div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => onClientSelect(client.id)}
                  className="w-full p-3 text-left hover:bg-milk-tea/20 rounded-lg transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-ink">
                      {client.name || client.email.split('@')[0]}
                    </div>
                    <div className="text-sm text-ink/60">{client.email}</div>
                  </div>
                  <OnlineStatusIndicator
                    isOnline={client.isOnline}
                    lastActiveAt={client.lastActiveAt}
                    size="sm"
                    showLabel={false}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
