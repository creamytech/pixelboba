'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
  Target,
  CheckCircle,
  Shield,
  Save,
} from 'lucide-react';
import { Icon } from '@iconify/react';
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

    fetchClientProfile();
  }, [clientId]);

  const sendMilestoneNotification = async (projectId: string, title: string, message: string) => {
    try {
      // Get project details to find the client
      const project = data?.projects.find((p) => p.id === projectId);
      if (!project || !data?.client?.id) return false;

      const response = await fetch('/api/portal/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          type: 'PROJECT_UPDATE',
          recipientId: data.client.id,
        }),
      });

      if (response.ok) {
        // Optionally refresh data or show success message
        return true;
      }
    } catch (error) {
      console.error('Error sending milestone notification:', error);
    }
    return false;
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
    { id: 'access', name: 'access & subscription', icon: Shield },
    { id: 'milestones', name: 'milestones', icon: Target },
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
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-ink font-black rounded-full border-3 border-ink uppercase hover:shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <button
              onClick={() => setShowUpdateForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase"
            >
              <Edit size={16} />
              <span>Edit Client</span>
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
              {data.client.image ? (
                <Image
                  src={data.client.image}
                  alt={data.client.name || 'Client'}
                  width={80}
                  height={80}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="font-display font-black text-2xl text-white">
                  {data.client.name?.charAt(0) || data.client.email.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="font-display text-3xl font-black text-ink mb-2">
                {data.client.name || 'Unnamed Client'}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm font-bold text-ink/70">
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
              <div className="bg-cream rounded-lg border-3 border-ink p-3 shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]">
                <div className="font-display text-2xl font-black text-taro">
                  {data.stats.activeProjects}
                </div>
                <div className="text-xs font-bold text-ink/60 uppercase">Active Projects</div>
              </div>
              <div className="bg-cream rounded-lg border-3 border-ink p-3 shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]">
                <div className="font-display text-2xl font-black text-brown-sugar">
                  ${data.stats.totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs font-bold text-ink/60 uppercase">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-cream rounded-xl border-4 border-ink p-2">
        <nav className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-full font-display font-black transition-all uppercase ${
                  isActive
                    ? 'bg-matcha text-ink border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]'
                    : 'text-ink/70 hover:text-ink hover:bg-white border-3 border-transparent'
                }`}
              >
                <Icon size={18} />
                <span>{tab.name}</span>
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
        {activeTab === 'overview' && (
          <OverviewTab data={data} onSendMilestone={sendMilestoneNotification} />
        )}
        {activeTab === 'access' && <AccessSubscriptionTab clientId={clientId} />}
        {activeTab === 'milestones' && (
          <MilestonesTab projects={data.projects} onSendMilestone={sendMilestoneNotification} />
        )}
        {activeTab === 'projects' && (
          <ProjectsTab projects={data.projects} onSendMilestone={sendMilestoneNotification} />
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
  onSendMilestone,
}: {
  data: ClientProfileData;
  onSendMilestone: (projectId: string, title: string, message: string) => Promise<boolean>;
}) {
  const activeProjects = data.projects.filter(
    (p) => !['COMPLETED', 'CANCELLED'].includes(p.status)
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Active Projects */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <h3 className="font-display text-xl font-black text-ink mb-4 uppercase">active projects</h3>
        <div className="space-y-4">
          {activeProjects.length > 0 ? (
            activeProjects.map((project) => (
              <div key={project.id} className="bg-cream rounded-lg border-3 border-ink p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display font-black text-ink">{project.name}</h4>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-black border-2 border-ink uppercase ${
                      project.status === 'DEVELOPMENT'
                        ? 'bg-matcha text-ink'
                        : project.status === 'DESIGN'
                          ? 'bg-taro text-white'
                          : 'bg-cream text-ink'
                    }`}
                  >
                    {project.status.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex-1 bg-cream rounded-full h-3 border-2 border-ink">
                    <div
                      className="bg-gradient-to-r from-taro to-brown-sugar h-full rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-black text-ink">{project.progress}%</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-ink/60">
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
              <p className="font-bold">No active projects</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <h3 className="font-display text-xl font-black text-ink mb-4 uppercase">recent activity</h3>
        <div className="space-y-3">
          {data.messages.slice(0, 5).map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-taro to-deep-taro rounded-full border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
                <MessageCircle size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-ink font-black">{message.projectName}</p>
                <p className="text-xs text-ink/60 font-bold line-clamp-2">{message.content}</p>
                <p className="text-xs text-ink/40 font-bold mt-1">
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
  onSendMilestone,
}: {
  projects: ClientProfileData['projects'];
  onSendMilestone: (projectId: string, title: string, message: string) => Promise<boolean>;
}) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [updateContent, setUpdateContent] = useState('');

  const sendUpdate = async () => {
    if (selectedProject && updateContent.trim()) {
      const projectName = projects.find((p) => p.id === selectedProject)?.name || 'Project';
      const success = await onSendMilestone(
        selectedProject,
        `Project Update: ${projectName}`,
        updateContent
      );
      if (success) {
        setUpdateContent('');
        setSelectedProject(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-black text-ink uppercase">project updates</h3>
          <button
            onClick={() => setSelectedProject(projects[0]?.id || '')}
            className="flex items-center space-x-2 px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase text-sm"
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
            className="mb-6 bg-cream rounded-lg border-3 border-ink p-4"
          >
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full mb-3 px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20"
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
              className="w-full h-24 px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20 resize-none"
            />
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-white text-ink font-black rounded-full border-3 border-ink uppercase"
              >
                Cancel
              </button>
              <button
                onClick={sendUpdate}
                disabled={!updateContent.trim()}
                className="px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase disabled:opacity-50"
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
            className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-display text-lg font-black text-ink">{project.name}</h4>
                <p className="text-ink/60 text-sm font-bold">{project.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-taro">{project.progress}%</div>
                <div className="text-xs font-bold text-ink/60 uppercase">
                  {project.status.toLowerCase().replace('_', ' ')}
                </div>
              </div>
            </div>

            <div className="w-full bg-cream rounded-full h-4 border-2 border-ink mb-4">
              <div
                className="bg-gradient-to-r from-taro to-brown-sugar h-full rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-ink/60 font-bold uppercase text-xs">Started:</span>
                <div className="font-black text-ink">
                  {new Date(project.startDate).toLocaleDateString()}
                </div>
              </div>
              {project.deadline && (
                <div>
                  <span className="text-ink/60 font-bold uppercase text-xs">Deadline:</span>
                  <div className="font-black text-ink">
                    {new Date(project.deadline).toLocaleDateString()}
                  </div>
                </div>
              )}
              {project.totalValue && (
                <div>
                  <span className="text-ink/60 font-bold uppercase text-xs">Value:</span>
                  <div className="font-black text-ink">${project.totalValue.toLocaleString()}</div>
                </div>
              )}
              <div>
                <span className="text-ink/60 font-bold uppercase text-xs">Status:</span>
                <div className="font-black capitalize text-ink">
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
    <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
      <h3 className="font-display text-xl font-black text-ink mb-6 uppercase">message history</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="bg-cream rounded-lg border-3 border-ink p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-ink">{message.projectName}</span>
              <span className="text-xs font-bold text-ink/50">
                {new Date(message.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm font-bold text-ink/70">{message.content}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-8 text-ink/50">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-bold">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilesTab({ files }: { files: ClientProfileData['files'] }) {
  return (
    <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
      <h3 className="font-display text-xl font-black text-ink mb-6 uppercase">uploaded files</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-white rounded-lg border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-4"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-taro to-deep-taro rounded-lg border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
                <FileText size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-ink truncate">{file.originalName}</p>
                <p className="text-xs font-bold text-ink/60">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="text-xs font-bold text-ink/50 mb-2">
              <div>Project: {file.projectName}</div>
              <div>Uploaded: {new Date(file.createdAt).toLocaleDateString()}</div>
            </div>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-sm font-black text-taro hover:text-taro/80"
            >
              <span>Download</span>
              <ExternalLink size={14} />
            </a>
          </div>
        ))}
        {files.length === 0 && (
          <div className="col-span-full text-center py-8 text-ink/50">
            <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-bold">No files uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InvoicesTab({ invoices }: { invoices: ClientProfileData['invoices'] }) {
  return (
    <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
      <h3 className="font-display text-xl font-black text-ink mb-6 uppercase">invoices</h3>
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="bg-cream rounded-lg border-3 border-ink p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-black text-ink">{invoice.projectName}</div>
              <div className="text-sm font-bold text-ink/60">
                Due: {new Date(invoice.dueDate).toLocaleDateString()}
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-lg text-ink">${invoice.amount.toLocaleString()}</div>
              <div
                className={`text-xs px-3 py-1.5 rounded-full font-black border-2 border-ink uppercase ${
                  invoice.status === 'PAID'
                    ? 'bg-matcha text-ink'
                    : invoice.status === 'PENDING'
                      ? 'bg-thai-tea text-ink'
                      : 'bg-strawberry text-white'
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
            <p className="font-bold">No invoices yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MilestonesTab({
  projects,
  onSendMilestone,
}: {
  projects: ClientProfileData['projects'];
  onSendMilestone: (projectId: string, title: string, message: string) => Promise<boolean>;
}) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [milestoneContent, setMilestoneContent] = useState('');
  const [milestoneType, setMilestoneType] = useState<'MILESTONE' | 'UPDATE'>('MILESTONE');

  const sendMilestone = async () => {
    if (selectedProject && milestoneContent.trim()) {
      const projectName = projects.find((p) => p.id === selectedProject)?.name || 'Project';
      const title =
        milestoneType === 'MILESTONE'
          ? `Milestone Achieved: ${projectName}`
          : `Progress Update: ${projectName}`;

      const success = await onSendMilestone(selectedProject, title, milestoneContent);
      if (success) {
        setMilestoneContent('');
        setSelectedProject(null);
      }
    }
  };

  const getProjectProgress = (progress: number) => {
    if (progress >= 100)
      return { status: 'Completed', color: 'bg-green-500', textColor: 'text-green-700' };
    if (progress >= 75)
      return { status: 'Near Completion', color: 'bg-blue-500', textColor: 'text-blue-700' };
    if (progress >= 50)
      return { status: 'In Progress', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    if (progress >= 25)
      return { status: 'Getting Started', color: 'bg-orange-500', textColor: 'text-orange-700' };
    return { status: 'Just Started', color: 'bg-gray-500', textColor: 'text-gray-700' };
  };

  return (
    <div className="space-y-6">
      {/* Milestone Creation */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-black text-ink uppercase">
            send milestone update
          </h3>
          <button
            onClick={() => setSelectedProject(projects[0]?.id || '')}
            className="flex items-center space-x-2 px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase text-sm"
          >
            <Target size={16} />
            <span>Create Milestone</span>
          </button>
        </div>

        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-cream rounded-lg border-3 border-ink p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-black text-ink/70 mb-2 uppercase">
                  Project
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20"
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-black text-ink/70 mb-2 uppercase">Type</label>
                <select
                  value={milestoneType}
                  onChange={(e) => setMilestoneType(e.target.value as 'MILESTONE' | 'UPDATE')}
                  className="w-full px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20"
                >
                  <option value="MILESTONE">Milestone Achieved</option>
                  <option value="UPDATE">Progress Update</option>
                </select>
              </div>
            </div>

            <textarea
              value={milestoneContent}
              onChange={(e) => setMilestoneContent(e.target.value)}
              placeholder={
                milestoneType === 'MILESTONE'
                  ? "Describe the milestone achieved (e.g., 'Design phase completed', 'First prototype delivered')"
                  : 'Write a progress update for the client...'
              }
              className="w-full h-24 px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20 resize-none"
            />

            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-white text-ink font-black rounded-full border-3 border-ink uppercase"
              >
                Cancel
              </button>
              <button
                onClick={sendMilestone}
                disabled={!milestoneContent.trim()}
                className="px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase disabled:opacity-50"
              >
                Send {milestoneType === 'MILESTONE' ? 'Milestone' : 'Update'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Project Milestones Overview */}
      <div className="grid gap-6">
        {projects.map((project) => {
          const progressInfo = getProjectProgress(project.progress);
          return (
            <div
              key={project.id}
              className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-4 h-4 ${progressInfo.color} rounded-full border-2 border-ink`}
                  ></div>
                  <div>
                    <h4 className="font-display text-lg font-black text-ink">{project.name}</h4>
                    <p className="text-sm font-bold text-ink/60">{project.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-taro">{project.progress}%</div>
                  <div className={`text-xs ${progressInfo.textColor} font-black uppercase`}>
                    {progressInfo.status}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-cream rounded-full h-5 mb-4 relative overflow-hidden border-2 border-ink">
                <motion.div
                  className="bg-gradient-to-r from-taro to-brown-sugar h-full rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-white drop-shadow-sm">
                    {project.progress}% Complete
                  </span>
                </div>
              </div>

              {/* Milestone Actions */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex space-x-4 font-bold">
                  <span className="text-ink/60">
                    Started: {new Date(project.startDate).toLocaleDateString()}
                  </span>
                  {project.deadline && (
                    <span className="text-ink/60">
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(project.id);
                    setMilestoneType('MILESTONE');
                  }}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-taro text-white font-black rounded-full border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] uppercase text-xs"
                >
                  <Target size={14} />
                  <span>Add Milestone</span>
                </button>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6 text-center">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-50 text-ink/50" />
            <p className="text-ink/50 font-bold">No projects to track milestones for</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AccessSubscriptionTab({ clientId }: { clientId: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [granting, setGranting] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [permissions, setPermissions] = useState<any>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<string>('');
  const [stripeProducts, setStripeProducts] = useState<any[]>([]);

  // Define tier permissions
  const tierPermissions = {
    MATCHA: {
      canAccessDashboard: true,
      canAccessProjects: true,
      canAccessTasks: true,
      canAccessMessages: true,
      canAccessFiles: true,
      canAccessInvoices: true,
      canAccessContracts: true,
      canUploadFiles: true,
      canSendMessages: true,
      canViewAnalytics: false,
      canAccessMeetings: false,
      canAccessTeam: false,
      canAccessRequests: false,
      canAccessBilling: false,
      canCreateTasks: false,
      canEditTasks: false,
      canDeleteTasks: false,
      canInviteTeam: false,
      canManageProjects: false,
    },
    TARO: {
      canAccessDashboard: true,
      canAccessProjects: true,
      canAccessTasks: true,
      canAccessMessages: true,
      canAccessFiles: true,
      canAccessInvoices: true,
      canAccessContracts: true,
      canAccessMeetings: true,
      canAccessTeam: true,
      canAccessRequests: true,
      canAccessBilling: true,
      canUploadFiles: true,
      canSendMessages: true,
      canCreateTasks: true,
      canEditTasks: true,
      canViewAnalytics: true,
      canDeleteTasks: false,
      canInviteTeam: false,
      canManageProjects: false,
    },
    THAI_TEA: {
      canAccessDashboard: true,
      canAccessProjects: true,
      canAccessTasks: true,
      canAccessMessages: true,
      canAccessFiles: true,
      canAccessInvoices: true,
      canAccessContracts: true,
      canAccessMeetings: true,
      canAccessTeam: true,
      canAccessRequests: true,
      canAccessBilling: true,
      canUploadFiles: true,
      canSendMessages: true,
      canCreateTasks: true,
      canEditTasks: true,
      canDeleteTasks: true,
      canInviteTeam: true,
      canViewAnalytics: true,
      canManageProjects: true,
    },
  };

  useEffect(() => {
    fetchAccessData();
    fetchStripeProducts();
  }, [clientId]);

  const fetchStripeProducts = async () => {
    try {
      const response = await fetch('/api/admin/stripe/products');
      if (response.ok) {
        const data = await response.json();
        setStripeProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching Stripe products:', error);
    }
  };

  const fetchAccessData = async () => {
    try {
      const [subRes, permRes] = await Promise.all([
        fetch(`/api/admin/clients/${clientId}/subscription`),
        fetch(`/api/admin/users/${clientId}/permissions`),
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData);
      }

      if (permRes.ok) {
        const permData = await permRes.json();
        setPermissions(permData.permissions || permData);
      }
    } catch (error) {
      console.error('Error fetching access data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (field: string) => {
    setPermissions((prev: any) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleGrantSubscription = async (priceId: string) => {
    setGranting(true);
    setSelectedPriceId(priceId);
    try {
      const response = await fetch(`/api/admin/clients/${clientId}/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (response.ok) {
        alert('Subscription granted successfully!');
        await fetchAccessData(); // Refresh subscription and permissions
      } else {
        const errorData = await response.json();
        alert(`Failed to grant subscription: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error granting subscription:', error);
      alert('Error granting subscription');
    } finally {
      setGranting(false);
      setSelectedPriceId('');
    }
  };

  const handleSavePermissions = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${clientId}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permissions),
      });

      if (response.ok) {
        alert('Permissions updated successfully!');
        await fetchAccessData(); // Refresh data after save
      } else {
        const errorData = await response.json();
        console.error('Failed to update permissions:', errorData);
        alert('Failed to update permissions');
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Error saving permissions');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <div className="text-center py-12 text-ink/50">
          <div className="animate-spin w-8 h-8 border-4 border-taro border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="font-bold">Loading access settings...</p>
        </div>
      </div>
    );
  }

  const tabAccessPermissions = [
    { key: 'canAccessDashboard', label: 'Dashboard' },
    { key: 'canAccessProjects', label: 'Projects' },
    { key: 'canAccessTasks', label: 'Tasks' },
    { key: 'canAccessMessages', label: 'Messages' },
    { key: 'canAccessFiles', label: 'Files' },
    { key: 'canAccessInvoices', label: 'Invoices' },
    { key: 'canAccessContracts', label: 'Contracts' },
    { key: 'canAccessMeetings', label: 'Meetings' },
    { key: 'canAccessTeam', label: 'Team' },
    { key: 'canAccessRequests', label: 'Requests' },
    { key: 'canAccessBilling', label: 'Billing' },
  ];

  const featurePermissions = [
    { key: 'canUploadFiles', label: 'Upload Files' },
    { key: 'canCreateTasks', label: 'Create Tasks' },
    { key: 'canEditTasks', label: 'Edit Tasks' },
    { key: 'canDeleteTasks', label: 'Delete Tasks' },
    { key: 'canSendMessages', label: 'Send Messages' },
    { key: 'canInviteTeam', label: 'Invite Team Members' },
    { key: 'canViewAnalytics', label: 'View Analytics' },
    { key: 'canManageProjects', label: 'Manage Projects' },
  ];

  return (
    <div className="space-y-6">
      {/* Boba Club Tier Selector */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <h3 className="font-display text-xl font-black text-ink mb-6 uppercase flex items-center gap-2">
          <Icon icon="game-icons:boba" className="w-6 h-6 text-taro" />
          Assign Boba Club Tier
        </h3>
        <p className="text-sm text-ink/60 font-bold mb-4">
          Select a tier to grant the client a Boba Club subscription with automatic permissions
        </p>
        {stripeProducts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {stripeProducts.map((product) => {
              const price = product.prices?.[0];
              const priceId = price?.id;
              const amount = price?.unitAmount ? (price.unitAmount / 100).toLocaleString() : '0';
              const isGranting = granting && selectedPriceId === priceId;
              const tierColor = product.name?.toLowerCase().includes('matcha')
                ? 'matcha'
                : product.name?.toLowerCase().includes('taro')
                  ? 'taro'
                  : 'thai-tea';

              return (
                <button
                  key={product.id}
                  onClick={() => priceId && handleGrantSubscription(priceId)}
                  disabled={granting}
                  className={`p-6 rounded-xl border-4 border-ink transition-all disabled:opacity-50 ${
                    isGranting
                      ? `bg-${tierColor} text-${tierColor === 'taro' || tierColor === 'thai-tea' ? 'white' : 'ink'} shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] scale-105`
                      : `bg-white hover:bg-${tierColor}/10 hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]`
                  }`}
                >
                  <Icon icon="game-icons:boba" className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-display font-black uppercase text-lg mb-1">
                    {product.name}
                  </div>
                  <div className="text-xs opacity-80">${amount}/month</div>
                  {isGranting && <div className="text-xs mt-2">Granting...</div>}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-ink/50">
            <Icon icon="game-icons:boba" className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-bold">Loading Stripe products...</p>
          </div>
        )}
      </div>

      {/* Subscription Info */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <h3 className="font-display text-xl font-black text-ink mb-6 uppercase flex items-center gap-2">
          <Icon icon="game-icons:boba" className="w-6 h-6 text-taro" />
          Current Subscription
        </h3>

        {subscription ? (
          <div className="space-y-4">
            <div className="bg-cream rounded-lg border-3 border-ink p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ink/60 uppercase text-sm">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black border-2 border-ink uppercase ${
                    subscription.status === 'ACTIVE'
                      ? 'bg-matcha text-ink'
                      : subscription.status === 'TRIALING'
                        ? 'bg-taro text-white'
                        : subscription.status === 'PAUSED'
                          ? 'bg-brown-sugar text-white'
                          : 'bg-strawberry/20 text-strawberry'
                  }`}
                >
                  {subscription.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink/60 uppercase text-sm">Plan ID</span>
                <span className="font-black text-ink">{subscription.stripePriceId}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cream rounded-lg border-3 border-ink p-4">
                <div className="text-xs font-bold text-ink/60 uppercase mb-1">Period Start</div>
                <div className="font-black text-ink">
                  {new Date(subscription.currentPeriodStart).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-cream rounded-lg border-3 border-ink p-4">
                <div className="text-xs font-bold text-ink/60 uppercase mb-1">Period End</div>
                <div className="font-black text-ink">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </div>
              </div>
            </div>

            {subscription.trialEnd && (
              <div className="bg-taro/10 rounded-lg border-3 border-taro p-4">
                <div className="text-xs font-bold text-taro uppercase mb-1">Trial Ends</div>
                <div className="font-black text-taro">
                  {new Date(subscription.trialEnd).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-ink/50">
            <Icon icon="game-icons:boba" className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-bold">No active subscription</p>
            <p className="text-sm mt-2">Client hasn&apos;t subscribed to Boba Club yet</p>
          </div>
        )}
      </div>

      {/* Tab Access Permissions */}
      {permissions && (
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
          <h3 className="font-display text-xl font-black text-ink mb-6 uppercase flex items-center gap-2">
            <Shield className="w-6 h-6 text-taro" />
            Tab Access Permissions
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {tabAccessPermissions.map((perm) => (
              <label
                key={perm.key}
                className="flex items-center gap-3 p-4 bg-cream rounded-lg border-3 border-ink cursor-pointer hover:bg-matcha/20 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={permissions[perm.key] || false}
                  onChange={() => handlePermissionToggle(perm.key)}
                  className="w-5 h-5 border-3 border-ink rounded accent-taro"
                />
                <span className="font-black text-ink uppercase text-sm">{perm.label}</span>
              </label>
            ))}
          </div>

          <h4 className="font-display text-lg font-black text-ink mb-4 uppercase mt-8">
            Feature Permissions
          </h4>

          <div className="grid md:grid-cols-2 gap-4">
            {featurePermissions.map((perm) => (
              <label
                key={perm.key}
                className="flex items-center gap-3 p-4 bg-cream rounded-lg border-3 border-ink cursor-pointer hover:bg-matcha/20 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={permissions[perm.key] || false}
                  onChange={() => handlePermissionToggle(perm.key)}
                  className="w-5 h-5 border-3 border-ink rounded accent-taro"
                />
                <span className="font-black text-ink uppercase text-sm">{perm.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSavePermissions}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-taro text-white font-black rounded-lg border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Permissions'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityTab({ clientId }: { clientId: string }) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchActivities();
  }, [clientId, filter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const url = `/api/admin/clients/${clientId}/activity${filter !== 'all' ? `?action=${filter}` : ''}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
      case 'signin':
        return <User className="w-4 h-4" />;
      case 'upload':
      case 'file_upload':
        return <Upload className="w-4 h-4" />;
      case 'message':
      case 'send_message':
        return <MessageCircle className="w-4 h-4" />;
      case 'create':
        return <Plus className="w-4 h-4" />;
      case 'update':
      case 'edit':
        return <Edit className="w-4 h-4" />;
      case 'delete':
        return <FileText className="w-4 h-4" />;
      case 'payment':
      case 'invoice_paid':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
      case 'signin':
        return 'from-matcha to-green-600';
      case 'upload':
      case 'file_upload':
        return 'from-taro to-deep-taro';
      case 'message':
      case 'send_message':
        return 'from-thai-tea to-strawberry';
      case 'create':
        return 'from-blue-500 to-blue-600';
      case 'update':
      case 'edit':
        return 'from-yellow-500 to-orange-500';
      case 'delete':
        return 'from-strawberry to-red-600';
      case 'payment':
      case 'invoice_paid':
        return 'from-matcha to-green-600';
      default:
        return 'from-ink/70 to-ink';
    }
  };

  const formatTimestamp = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return activityDate.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-black text-ink uppercase">activity log</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border-3 border-ink rounded-lg font-black text-sm uppercase focus:outline-none focus:ring-2 focus:ring-taro"
        >
          <option value="all">All Activity</option>
          {Object.keys(stats).map((action) => (
            <option key={action} value={action}>
              {action} ({stats[action]})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-taro border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-bold text-ink/50">Loading activity...</p>
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4 p-4 bg-cream/30 rounded-lg border-2 border-ink/10 hover:border-taro/30 transition-all"
            >
              <div
                className={`w-10 h-10 rounded-full border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center bg-gradient-to-br ${getActionColor(activity.action)} flex-shrink-0`}
              >
                <div className="text-white">{getActionIcon(activity.action)}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-black text-ink text-sm uppercase truncate">
                    {activity.action}
                  </h4>
                  <span className="text-xs font-bold text-ink/50 whitespace-nowrap">
                    {formatTimestamp(activity.createdAt)}
                  </span>
                </div>
                <div className="text-xs font-bold text-ink/70 space-y-1">
                  <p>
                    <span className="text-ink/50">Entity:</span> {activity.entityType} (
                    {activity.entityId.substring(0, 8)}...)
                  </p>
                  {activity.ipAddress && (
                    <p>
                      <span className="text-ink/50">IP:</span> {activity.ipAddress}
                    </p>
                  )}
                  {activity.changes && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-taro hover:text-deep-taro font-black uppercase text-xs">
                        View Changes
                      </summary>
                      <pre className="mt-2 p-2 bg-ink/5 rounded border border-ink/10 text-xs overflow-x-auto">
                        {JSON.stringify(activity.changes, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-ink/50">
          <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="font-bold">No activity recorded yet</p>
          <p className="text-sm mt-2">Activity will appear here as the client uses the portal</p>
        </div>
      )}
    </div>
  );
}
