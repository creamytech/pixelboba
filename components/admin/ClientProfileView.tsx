'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  FolderOpen,
  FileText,
  Upload,
  MessageCircle,
  CreditCard,
  Edit,
  Plus,
  ExternalLink,
  User,
  Activity,
} from 'lucide-react';
import BobaProgressIndicator from '@/components/portal/BobaProgressIndicator';

interface ClientProfileData {
  client: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    company: string | null;
    role: string;
    image: string | null;
    createdAt: string;
  };
  projects: Array<{
    id: string;
    name: string;
    description: string | null;
    status: string;
    progress: number;
    startDate: string;
    deadline: string | null;
    totalValue: number | null;
  }>;
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    projectName: string;
  }>;
  files: Array<{
    id: string;
    originalName: string;
    size: number;
    mimetype: string;
    url: string;
    createdAt: string;
    projectName: string;
  }>;
  invoices: Array<{
    id: string;
    amount: number;
    status: string;
    dueDate: string;
    projectName: string;
  }>;
  stats: {
    totalProjects: number;
    activeProjects: number;
    totalRevenue: number;
    totalFiles: number;
    totalMessages: number;
  };
}

interface ClientProfileViewProps {
  clientId: string;
  onBack: () => void;
}

export default function ClientProfileView({ clientId, onBack }: ClientProfileViewProps) {
  const [data, setData] = useState<ClientProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    fetchClientProfile();
  }, [clientId]);

  const fetchClientProfile = async () => {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}/profile`);
      if (response.ok) {
        const profileData = await response.json();
        setData(profileData);
      }
    } catch (error) {
      console.error('Error fetching client profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendProjectUpdate = async (projectId: string, updateContent: string) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: updateContent,
          projectId,
          type: 'PROJECT_UPDATE',
        }),
      });

      if (response.ok) {
        // Refresh data to show new message
        fetchClientProfile();
      }
    } catch (error) {
      console.error('Error sending update:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ink/60">Loading client profile...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-ink/60 mb-4">Client profile not found</div>
        <button onClick={onBack} className="text-taro hover:text-taro/80">
          ← Back to clients
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'overview', icon: User },
    { id: 'projects', name: 'projects', icon: FolderOpen },
    { id: 'messages', name: 'messages', icon: MessageCircle },
    { id: 'files', name: 'files', icon: Upload },
    { id: 'invoices', name: 'invoices', icon: CreditCard },
    { id: 'activity', name: 'activity', icon: Activity },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-ink/70 hover:text-ink transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to clients</span>
          </button>
          <button
            onClick={() => setShowUpdateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-taro to-brown-sugar text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Edit size={16} />
            <span>Edit Client</span>
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-taro/20 to-brown-sugar/20 rounded-full flex items-center justify-center shadow-lg">
            {data.client.image ? (
              <img
                src={data.client.image}
                alt={data.client.name || 'Client'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="font-display font-bold text-2xl text-taro">
                {data.client.name?.charAt(0) || data.client.email.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-ink mb-2">
              {data.client.name || 'Unnamed Client'}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-ink/70">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>{data.client.email}</span>
              </div>
              {data.client.phone && (
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>{data.client.phone}</span>
                </div>
              )}
              {data.client.company && (
                <div className="flex items-center space-x-2">
                  <Building size={16} />
                  <span>{data.client.company}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>Joined {new Date(data.client.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/70 rounded-lg p-3">
              <div className="font-display text-2xl font-bold text-taro">
                {data.stats.activeProjects}
              </div>
              <div className="text-xs text-ink/60">Active Projects</div>
            </div>
            <div className="bg-white/70 rounded-lg p-3">
              <div className="font-display text-2xl font-bold text-brown-sugar">
                ${data.stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-ink/60">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-milk-tea/60 backdrop-blur-lg rounded-xl p-2 border border-brown-sugar/20">
        <nav className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-display font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-taro to-brown-sugar text-white shadow-lg'
                    : 'text-ink/70 hover:text-ink hover:bg-milk-tea/80'
                }`}
              >
                <Icon size={18} />
                <span className="lowercase">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && <OverviewTab data={data} onSendUpdate={sendProjectUpdate} />}
        {activeTab === 'projects' && (
          <ProjectsTab projects={data.projects} onSendUpdate={sendProjectUpdate} />
        )}
        {activeTab === 'messages' && <MessagesTab messages={data.messages} />}
        {activeTab === 'files' && <FilesTab files={data.files} />}
        {activeTab === 'invoices' && <InvoicesTab invoices={data.invoices} />}
        {activeTab === 'activity' && <ActivityTab clientId={clientId} />}
      </motion.div>
    </motion.div>
  );
}

function OverviewTab({
  data,
  onSendUpdate,
}: {
  data: ClientProfileData;
  onSendUpdate: (projectId: string, content: string) => void;
}) {
  const activeProjects = data.projects.filter(
    (p) => !['COMPLETED', 'CANCELLED'].includes(p.status)
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Active Projects */}
      <div className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20">
        <h3 className="font-display text-xl font-bold text-ink mb-4 lowercase">active projects</h3>
        <div className="space-y-4">
          {activeProjects.length > 0 ? (
            activeProjects.map((project) => (
              <div key={project.id} className="bg-white/70 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display font-semibold text-ink">{project.name}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'DEVELOPMENT'
                        ? 'bg-taro/20 text-taro'
                        : project.status === 'DESIGN'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {project.status.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-taro to-brown-sugar h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-ink">{project.progress}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-ink/60">
                  <span>Started {new Date(project.startDate).toLocaleDateString()}</span>
                  {project.deadline && (
                    <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-ink/50">
              <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active projects</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20">
        <h3 className="font-display text-xl font-bold text-ink mb-4 lowercase">recent activity</h3>
        <div className="space-y-3">
          {data.messages.slice(0, 5).map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-taro/20 to-brown-sugar/20 rounded-full flex items-center justify-center">
                <MessageCircle size={14} className="text-taro" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-ink font-medium">{message.projectName}</p>
                <p className="text-xs text-ink/60 line-clamp-2">{message.content}</p>
                <p className="text-xs text-ink/40 mt-1">
                  {new Date(message.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsTab({
  projects,
  onSendUpdate,
}: {
  projects: ClientProfileData['projects'];
  onSendUpdate: (projectId: string, content: string) => void;
}) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [updateContent, setUpdateContent] = useState('');

  const sendUpdate = () => {
    if (selectedProject && updateContent.trim()) {
      onSendUpdate(selectedProject, updateContent);
      setUpdateContent('');
      setSelectedProject(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold text-ink lowercase">project updates</h3>
          <button
            onClick={() => setSelectedProject(projects[0]?.id || '')}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-taro to-brown-sugar text-white rounded-lg hover:shadow-lg transition-all text-sm"
          >
            <Plus size={16} />
            <span>Send Update</span>
          </button>
        </div>

        {/* Send Update Form */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 bg-white/70 rounded-lg p-4 border border-brown-sugar/20"
          >
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full mb-3 p-2 border border-brown-sugar/20 rounded-lg bg-white/70"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <textarea
              value={updateContent}
              onChange={(e) => setUpdateContent(e.target.value)}
              placeholder="Write a project update for the client..."
              className="w-full h-24 p-3 border border-brown-sugar/20 rounded-lg bg-white/70 resize-none"
            />
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 text-ink/60 hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={sendUpdate}
                disabled={!updateContent.trim()}
                className="px-4 py-2 bg-gradient-to-r from-taro to-brown-sugar text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                Send Update
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-display text-lg font-bold text-ink">{project.name}</h4>
                <p className="text-ink/60 text-sm">{project.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-taro">{project.progress}%</div>
                <div className="text-xs text-ink/60">
                  {project.status.toLowerCase().replace('_', ' ')}
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-taro to-brown-sugar h-3 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-ink/60">Started:</span>
                <div className="font-medium">
                  {new Date(project.startDate).toLocaleDateString()}
                </div>
              </div>
              {project.deadline && (
                <div>
                  <span className="text-ink/60">Deadline:</span>
                  <div className="font-medium">
                    {new Date(project.deadline).toLocaleDateString()}
                  </div>
                </div>
              )}
              {project.totalValue && (
                <div>
                  <span className="text-ink/60">Value:</span>
                  <div className="font-medium">${project.totalValue.toLocaleString()}</div>
                </div>
              )}
              <div>
                <span className="text-ink/60">Status:</span>
                <div className="font-medium capitalize">
                  {project.status.toLowerCase().replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesTab({ messages }: { messages: ClientProfileData['messages'] }) {
  return (
    <div className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20">
      <h3 className="font-display text-xl font-bold text-ink mb-6 lowercase">message history</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="bg-white/70 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-ink">{message.projectName}</span>
              <span className="text-xs text-ink/50">
                {new Date(message.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-ink/70">{message.content}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-8 text-ink/50">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilesTab({ files }: { files: ClientProfileData['files'] }) {
  return (
    <div className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20">
      <h3 className="font-display text-xl font-bold text-ink mb-6 lowercase">uploaded files</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-white/70 rounded-lg p-4 border border-brown-sugar/20 hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-taro/20 to-brown-sugar/20 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-taro" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink truncate">{file.originalName}</p>
                <p className="text-xs text-ink/60">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="text-xs text-ink/50 mb-2">
              <div>Project: {file.projectName}</div>
              <div>Uploaded: {new Date(file.createdAt).toLocaleDateString()}</div>
            </div>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-sm text-taro hover:text-taro/80"
            >
              <span>Download</span>
              <ExternalLink size={14} />
            </a>
          </div>
        ))}
        {files.length === 0 && (
          <div className="col-span-full text-center py-8 text-ink/50">
            <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No files uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InvoicesTab({ invoices }: { invoices: ClientProfileData['invoices'] }) {
  return (
    <div className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20">
      <h3 className="font-display text-xl font-bold text-ink mb-6 lowercase">invoices</h3>
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="bg-white/70 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-medium text-ink">{invoice.projectName}</div>
              <div className="text-sm text-ink/60">
                Due: {new Date(invoice.dueDate).toLocaleDateString()}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-ink">${invoice.amount.toLocaleString()}</div>
              <div
                className={`text-xs px-2 py-1 rounded-full ${
                  invoice.status === 'PAID'
                    ? 'bg-green-100 text-green-700'
                    : invoice.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                }`}
              >
                {invoice.status.toLowerCase()}
              </div>
            </div>
          </div>
        ))}
        {invoices.length === 0 && (
          <div className="text-center py-8 text-ink/50">
            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No invoices yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityTab({ clientId }: { clientId: string }) {
  // This would fetch activity logs for the client
  return (
    <div className="bg-milk-tea/70 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20">
      <h3 className="font-display text-xl font-bold text-ink mb-6 lowercase">activity log</h3>
      <div className="text-center py-8 text-ink/50">
        <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>Activity tracking coming soon</p>
      </div>
    </div>
  );
}
