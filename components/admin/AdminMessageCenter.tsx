'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, FileText, X, MessageCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Project } from '@/types/portal';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedProject) {
      fetchMessages(selectedProject);
    }
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
        className="bg-white rounded-xl shadow-xl max-w-6xl w-full h-[80vh] flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Project Sidebar */}
        <div className="w-80 border-r border-ink/10 flex flex-col">
          <div className="p-4 border-b border-ink/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-taro" />
              <h3 className="font-display text-lg font-semibold text-ink">admin messaging</h3>
            </div>
            <button onClick={onClose} className="p-2 text-ink/60 hover:text-ink transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                          className={`text-xs text-ink/40 mt-1 ${
                            message.isOwn ? 'text-right' : 'text-left'
                          }`}
                        >
                          {message.sender.name} • {message.timestamp.toLocaleTimeString()}
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
