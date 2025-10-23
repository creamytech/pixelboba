'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Image, FileText, X, FolderOpen, Plus } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import NextImage from 'next/image';
import { Project, Message, File as PortalFile } from '@/types/portal';
import OnlineStatusIndicator from '@/components/common/OnlineStatusIndicator';
import { usePusher } from '@/hooks/usePusher';
import { CHANNELS, PUSHER_EVENTS } from '@/lib/pusher';

interface MessageCenterProps {
  projects: Project[];
}

interface ChatMessage {
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

export default function MessageCenter({ projects }: MessageCenterProps) {
  const [selectedProject, setSelectedProject] = useState<string>('direct');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<PortalFile[]>([]);
  const [showFileLibrary, setShowFileLibrary] = useState(false);
  const [userFiles, setUserFiles] = useState<PortalFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [adminUsers, setAdminUsers] = useState<
    Array<{
      id: string;
      name: string | null;
      email: string;
      role: string;
      isOnline: boolean;
      lastActiveAt: Date | null;
    }>
  >([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time messaging with Pusher
  const { subscribe, isConnected } = usePusher({
    channelName: selectedProject ? CHANNELS.project(selectedProject) : '',
    enabled: !!selectedProject,
  });

  useEffect(() => {
    if (selectedProject) {
      fetchMessages(selectedProject);
    }
    fetchUserStatus();
  }, [selectedProject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Refresh user status every 30 seconds
    const interval = setInterval(fetchUserStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to real-time message events
  useEffect(() => {
    if (!selectedProject || !subscribe) return;

    // Handle new messages
    const handleNewMessage = (data: any) => {
      if (data.message && data.message.id) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
      }
    };

    // Handle typing indicators
    const handleTypingStart = (data: any) => {
      if (data.userId) {
        setTypingUsers((prev) => new Set(prev).add(data.userId));
      }
    };

    const handleTypingStop = (data: any) => {
      if (data.userId) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      }
    };

    subscribe(PUSHER_EVENTS.MESSAGE_NEW, handleNewMessage);
    subscribe(PUSHER_EVENTS.MESSAGE_TYPING_START, handleTypingStart);
    subscribe(PUSHER_EVENTS.MESSAGE_TYPING_STOP, handleTypingStop);
  }, [selectedProject, subscribe]);

  const fetchMessages = async (projectId: string) => {
    setLoading(true);
    try {
      const url =
        projectId === 'direct'
          ? '/api/portal/messages'
          : `/api/portal/messages?projectId=${projectId}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const response = await fetch('/api/user/status');
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  };

  const fetchUserFiles = async () => {
    setLoadingFiles(true);
    try {
      const url =
        selectedProject === 'all'
          ? '/api/portal/files'
          : `/api/portal/files?projectId=${selectedProject}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setUserFiles(data.files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileLibraryOpen = () => {
    setShowFileLibrary(true);
    fetchUserFiles();
  };

  const handleFileSelect = (file: PortalFile) => {
    setSelectedFiles((prev) => {
      const isSelected = prev.some((f) => f.id === file.id);
      if (isSelected) {
        return prev.filter((f) => f.id !== file.id);
      } else {
        return [...prev, file];
      }
    });
  };

  const handleFileLibraryConfirm = () => {
    setShowFileLibrary(false);
    // selectedFiles will be used in sendMessage
  };

  const removeSelectedFile = (fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && uploadingFiles.length === 0 && selectedFiles.length === 0) return;

    try {
      // For direct messages, use simple JSON API (no file support for now)
      if (selectedProject === 'direct') {
        if (!newMessage.trim()) return;

        // Find first admin/owner to send to
        const adminUser = adminUsers.find((u) => u.role === 'ADMIN' || u.role === 'OWNER');
        if (!adminUser) {
          console.error('No admin user found to send message to');
          return;
        }

        const response = await fetch('/api/portal/messages/direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: newMessage.trim(),
            recipientId: adminUser.id,
          }),
        });

        if (response.ok) {
          setNewMessage('');
          fetchMessages('direct');
        } else {
          const errorData = await response.json();
          console.error('API Error:', response.status, errorData);
        }
        return;
      }

      // For project messages, use FormData for file support
      const formData = new FormData();
      formData.append('content', newMessage.trim());
      formData.append('projectId', selectedProject);

      // Add new file uploads to FormData
      uploadingFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      formData.append('fileCount', uploadingFiles.length.toString());

      // Add selected existing file IDs
      selectedFiles.forEach((file, index) => {
        formData.append(`existingFileId_${index}`, file.id);
      });
      formData.append('existingFileCount', selectedFiles.length.toString());

      console.log('Sending message with:', {
        content: newMessage.trim(),
        newFileCount: uploadingFiles.length,
        existingFileCount: selectedFiles.length,
        newFiles: uploadingFiles.map((f) => f.name),
        existingFiles: selectedFiles.map((f) => f.originalName),
      });

      const response = await fetch('/api/portal/messages', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setNewMessage('');
        setUploadingFiles([]);
        setSelectedFiles([]);
        // Refetch messages to get all new messages
        fetchMessages(selectedProject);
      } else {
        const errorData = await response.json();
        console.error('API Error:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log('Files dropped:', acceptedFiles);
      setUploadingFiles((prev) => [...prev, ...acceptedFiles]);
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      'image/*': [],
      'application/pdf': [],
      'text/*': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    },
  });

  const removeFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedProjectData = projects.find((p) => p.id === selectedProject);

  // Show empty state if no projects
  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden h-[600px] flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-display text-xl font-black text-ink mb-2 uppercase">
            no projects yet
          </h3>
          <p className="text-ink/60 mb-6 max-w-md font-bold">
            Once you have active projects, you&apos;ll be able to communicate with your project
            manager here.
          </p>
          <div className="bg-cream rounded-xl border-3 border-ink p-4 max-w-md">
            <h4 className="font-display font-black text-ink mb-2 uppercase">what happens next?</h4>
            <ul className="text-sm text-ink/70 space-y-1 text-left font-bold">
              <li>• Your project manager will create your first project</li>
              <li>• You&apos;ll receive a notification when it&apos;s ready</li>
              <li>• Then you can start messaging about your project</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] min-h-[500px] h-[80vh] max-h-[800px] flex flex-col lg:flex-row touch-manipulation">
      {/* Project Sidebar */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r-4 border-ink flex flex-col max-h-48 lg:max-h-none lg:h-full">
        <div className="p-4 border-b-4 border-ink">
          <h3 className="font-display text-lg font-black text-ink uppercase">conversations</h3>
        </div>

        <div
          className="flex-1 overflow-y-auto touch-pan-y"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        >
          {/* Direct Messages Option */}
          <button
            onClick={() => setSelectedProject('direct')}
            className={`w-full p-4 text-left border-b-2 border-ink/10 transition-colors ${
              selectedProject === 'direct'
                ? 'bg-taro/20 border-l-4 border-l-ink'
                : 'hover:bg-cream/30'
            }`}
          >
            <div className="font-black text-ink uppercase">Direct Messages</div>
            <div className="text-sm text-ink/60 mt-1 font-bold">Chat with your project manager</div>
          </button>

          {/* Project Messages */}
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className={`w-full p-4 text-left border-b-2 border-ink/10 transition-colors ${
                selectedProject === project.id
                  ? 'bg-taro/20 border-l-4 border-l-ink'
                  : 'hover:bg-cream/30'
              }`}
            >
              <div className="font-black text-ink">{project.name}</div>
              <div className="text-sm text-ink/60 uppercase mt-1 font-bold">
                {project.status.toLowerCase().replace('_', ' ')}
              </div>
              <div className="text-xs text-ink/40 mt-1 font-bold">{project.progress}% complete</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b-4 border-ink bg-cream">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-black text-ink uppercase">
                {selectedProject === 'direct' ? 'Direct Messages' : selectedProjectData?.name}
              </h3>
              <p className="text-sm text-ink/60 font-bold">
                {selectedProject === 'direct'
                  ? 'Private conversation with your project manager'
                  : selectedProjectData?.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-ink/60 mb-1 font-bold uppercase">Team Status</div>
              <div className="space-y-1">
                {adminUsers.slice(0, 2).map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <OnlineStatusIndicator
                      isOnline={user.isOnline}
                      lastActiveAt={user.lastActiveAt}
                      size="sm"
                    />
                    <span className="text-xs text-ink/60">
                      {user.name || user.email.split('@')[0]}
                    </span>
                  </div>
                ))}
                {adminUsers.length > 2 && (
                  <div className="text-xs text-ink/40">+{adminUsers.length - 2} more</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 relative touch-pan-y"
          style={{
            touchAction: 'pan-y',
            overscrollBehavior: 'none',
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="absolute inset-0 overflow-y-auto p-2 sm:p-4 space-y-4"
            style={{
              WebkitOverflowScrolling: 'touch',
              transform: 'translateZ(0)',
              willChange: 'transform',
              height: 'calc(100% - 0px)',
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-ink/50 font-bold uppercase">loading messages...</div>
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
                                const senderStatus = adminUsers.find(
                                  (u) => u.id === message.sender.id
                                );
                                return senderStatus ? (
                                  <OnlineStatusIndicator
                                    isOnline={senderStatus.isOnline}
                                    lastActiveAt={senderStatus.lastActiveAt}
                                    size="sm"
                                  />
                                ) : null;
                              })()}
                            </>
                          )}
                          <span>
                            {message.sender.name} •{' '}
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      {!message.isOwn && (
                        <div className="w-8 h-8 rounded-full bg-taro/20 flex items-center justify-center order-1 mr-3 mt-1">
                          {message.sender.image ? (
                            <NextImage
                              src={message.sender.image}
                              alt={message.sender.name}
                              width={32}
                              height={32}
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
        </div>

        {/* File Upload Area */}
        {(uploadingFiles.length > 0 || selectedFiles.length > 0) && (
          <div className="p-4 border-t-4 border-ink bg-cream">
            <div className="flex flex-wrap gap-2">
              {/* New uploaded files */}
              {uploadingFiles.map((file, index) => (
                <div
                  key={`upload-${index}`}
                  className="flex items-center space-x-2 bg-white rounded-lg border-2 border-ink p-2 text-sm"
                >
                  <FileText size={16} className="text-ink/60" />
                  <span className="text-ink font-bold">{file.name}</span>
                  <span className="text-xs text-ink bg-matcha px-2 py-1 rounded-full border-2 border-ink font-black uppercase">
                    new
                  </span>
                  <button onClick={() => removeFile(index)} className="text-ink/40 hover:text-ink">
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Selected existing files */}
              {selectedFiles.map((file) => (
                <div
                  key={`selected-${file.id}`}
                  className="flex items-center space-x-2 bg-white rounded-lg border-2 border-ink p-2 text-sm"
                >
                  <FileText size={16} className="text-ink/60" />
                  <span className="text-ink font-bold">{file.originalName}</span>
                  <span className="text-xs text-ink bg-taro px-2 py-1 rounded-full border-2 border-ink font-black uppercase">
                    library
                  </span>
                  <button
                    onClick={() => removeSelectedFile(file.id)}
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
        <div className="p-4 border-t-4 border-ink bg-cream">
          <div
            className={`flex items-center space-x-3 p-3 border-3 rounded-xl transition-colors ${
              isDragActive ? 'border-taro bg-taro/5' : 'border-ink bg-white hover:bg-white'
            }`}
          >
            {selectedProject !== 'direct' && (
              <div className="flex items-center space-x-2">
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <div
                    className="text-ink/60 hover:text-taro transition-colors p-1 rounded hover:bg-taro/10"
                    title="Upload new files"
                  >
                    <Plus size={20} />
                  </div>
                </div>

                <button
                  onClick={handleFileLibraryOpen}
                  className="text-ink/60 hover:text-taro transition-colors p-1 rounded hover:bg-taro/10"
                  title="Select from file library"
                >
                  <FolderOpen size={20} />
                </button>
              </div>
            )}

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={
                isDragActive ? 'drop files here or type your message...' : 'type your message...'
              }
              className="flex-1 bg-transparent outline-none text-ink placeholder-ink/50 font-bold"
            />

            <button
              onClick={sendMessage}
              className="w-10 h-10 bg-matcha rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all disabled:opacity-50 flex items-center justify-center"
              disabled={
                !newMessage.trim() && uploadingFiles.length === 0 && selectedFiles.length === 0
              }
            >
              <Send size={18} className="text-ink" />
            </button>
          </div>
        </div>
      </div>

      {/* File Library Modal */}
      <AnimatePresence>
        {showFileLibrary && (
          <FileLibraryModal
            files={userFiles}
            selectedFiles={selectedFiles}
            loadingFiles={loadingFiles}
            onFileSelect={handleFileSelect}
            onConfirm={handleFileLibraryConfirm}
            onCancel={() => setShowFileLibrary(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FilePreview({ file }: { file: { originalName: string; url: string; mimetype: string } }) {
  const isImage = file.mimetype.startsWith('image/');

  return (
    <div className="mb-2">
      {isImage ? (
        <NextImage
          src={file.url}
          alt={file.originalName}
          width={400}
          height={300}
          className="max-w-full h-auto rounded-lg"
        />
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

interface FileLibraryModalProps {
  files: PortalFile[];
  selectedFiles: PortalFile[];
  loadingFiles: boolean;
  onFileSelect: (file: PortalFile) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function FileLibraryModal({
  files,
  selectedFiles,
  loadingFiles,
  onFileSelect,
  onConfirm,
  onCancel,
}: FileLibraryModalProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return Image;
    return FileText;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] max-w-4xl w-full max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b-4 border-ink">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-black text-ink uppercase">
              Select Files from Library
            </h3>
            <button onClick={onCancel} className="text-ink/40 hover:text-ink transition-colors">
              <X size={24} />
            </button>
          </div>
          <p className="text-ink/60 mt-1 font-bold">Choose files to attach to your message</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loadingFiles ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-ink/50 font-bold uppercase">Loading files...</div>
            </div>
          ) : files.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-ink/50 font-bold uppercase">No files found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.mimetype);
                const isSelected = selectedFiles.some((f) => f.id === file.id);
                const isImage = file.mimetype.startsWith('image/');

                return (
                  <div
                    key={file.id}
                    onClick={() => onFileSelect(file)}
                    className={`cursor-pointer rounded-lg border-2 transition-all p-4 ${
                      isSelected
                        ? 'border-taro bg-taro/5'
                        : 'border-ink/10 hover:border-ink/20 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {isImage ? (
                        <NextImage
                          src={file.url}
                          alt={file.originalName}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-ink/5 rounded">
                          <FileIcon size={24} className="text-ink/60" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium text-ink text-sm truncate"
                          title={file.originalName}
                        >
                          {file.originalName}
                        </p>
                        <p className="text-xs text-ink/60">{formatFileSize(file.size)}</p>
                        {file.project && <p className="text-xs text-taro">{file.project.name}</p>}
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 bg-taro rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-4 border-ink flex items-center justify-between">
          <p className="text-sm text-ink/60 font-bold uppercase">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
          </p>

          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="bg-white text-ink font-black rounded-full border-3 border-ink uppercase px-4 py-2 hover:bg-cream transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={selectedFiles.length === 0}
              className="px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
