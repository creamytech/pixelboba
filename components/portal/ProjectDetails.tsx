'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  Folder,
  Globe,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
  Activity,
  FileText,
  MessageSquare,
  TrendingUp,
  Loader2,
  Edit,
} from 'lucide-react';

interface ProjectMember {
  id: string;
  role: string;
  canEdit: boolean;
  canComment: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  };
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  assignedTo: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  comments: any[];
}

interface ProjectFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  completed: boolean;
  completedAt: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  websiteUrl: string | null;
  startDate: string;
  deadline: string | null;
  completedAt: string | null;
  client: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  members: ProjectMember[];
  tasks: Task[];
  files: ProjectFile[];
  activities: ActivityItem[];
  milestones: Milestone[];
  requests: any[];
}

interface ProjectDetailsProps {
  projectId: string;
  onBack?: () => void;
}

export default function ProjectDetails({ projectId, onBack }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'files' | 'activity'>(
    'overview'
  );
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/portal/projects/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      const data = await response.json();
      setProject(data.project);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-12 h-12 animate-spin text-taro" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center p-12">
        <Icon icon="ph:folder-open-duotone" className="w-24 h-24 text-ink/20 mx-auto mb-4" />
        <p className="text-xl font-black text-ink uppercase">Project Not Found</p>
      </div>
    );
  }

  const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
    DISCOVERY: { bg: 'bg-taro/20', text: 'text-taro', icon: 'ph:lightbulb-duotone' },
    WIREFRAMING: { bg: 'bg-thai-tea/20', text: 'text-brown-sugar', icon: 'ph:layout-duotone' },
    DESIGN: { bg: 'bg-strawberry/20', text: 'text-strawberry', icon: 'ph:palette-duotone' },
    DEVELOPMENT: { bg: 'bg-matcha/20', text: 'text-matcha', icon: 'ph:code-duotone' },
    TESTING: { bg: 'bg-milk-tea/30', text: 'text-brown-sugar', icon: 'ph:bug-duotone' },
    LAUNCH: { bg: 'bg-matcha/20', text: 'text-matcha', icon: 'ph:rocket-duotone' },
    COMPLETE: { bg: 'bg-matcha/20', text: 'text-matcha', icon: 'ph:check-circle-duotone' },
  };

  const statusConfig = statusColors[project.status] || statusColors.DISCOVERY;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-taro to-deep-taro text-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4 flex-1">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              </button>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Folder className="w-8 h-8" strokeWidth={2.5} />
                <h1 className="font-black text-2xl md:text-3xl uppercase">{project.name}</h1>
              </div>
              {project.description && (
                <p className="text-white/90 font-bold">{project.description}</p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`${statusConfig.bg} ${statusConfig.text} px-4 py-2 rounded-full border-2 border-white/20 flex items-center gap-2`}
          >
            <Icon icon={statusConfig.icon} className="w-5 h-5" />
            <span className="font-black text-sm uppercase">{project.status}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-bold">
            <span>Project Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden border-2 border-white/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-matcha"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-matcha/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-matcha" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-2xl font-black text-ink">
                {project.tasks.filter((t) => t.status === 'DONE').length}
              </p>
              <p className="text-xs font-bold text-ink/60 uppercase">Tasks Done</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-taro/20 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-taro" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-2xl font-black text-ink">{project.files.length}</p>
              <p className="text-xs font-bold text-ink/60 uppercase">Files</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-strawberry/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-strawberry" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-2xl font-black text-ink">{project.members.length + 1}</p>
              <p className="text-xs font-bold text-ink/60 uppercase">Team Members</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-thai-tea/20 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-brown-sugar" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-2xl font-black text-ink">{project.activities.length}</p>
              <p className="text-xs font-bold text-ink/60 uppercase">Activities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Section */}
      {project.websiteUrl && (
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
          <div className="bg-gradient-to-r from-matcha to-taro p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <Globe className="w-5 h-5" strokeWidth={2.5} />
              <h3 className="font-black uppercase">Live Preview</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-white text-ink font-black rounded-full border-2 border-white/20 hover:bg-white/90 transition-colors uppercase text-sm"
              >
                {showPreview ? 'Hide' : 'Show'}
              </button>
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-ink font-black rounded-full border-2 border-white/20 hover:bg-white/90 transition-colors uppercase text-sm flex items-center gap-2"
              >
                Open
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          {showPreview && (
            <div className="p-4 bg-cream">
              <div className="aspect-video bg-white border-3 border-ink rounded-lg overflow-hidden">
                <iframe
                  src={project.websiteUrl}
                  className="w-full h-full"
                  title="Website Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b-4 border-ink">
          {[
            { id: 'overview', label: 'Overview', icon: 'ph:info-duotone' },
            { id: 'tasks', label: 'Tasks', icon: 'ph:check-square-duotone' },
            { id: 'files', label: 'Files', icon: 'ph:folder-duotone' },
            { id: 'activity', label: 'Activity', icon: 'ph:clock-duotone' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 font-black uppercase text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-taro text-white'
                  : 'bg-cream text-ink/70 hover:bg-cream/70'
              }`}
            >
              <Icon icon={tab.icon} className="w-5 h-5 inline-block mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Project Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-black text-lg uppercase text-ink mb-4">Project Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-taro" />
                      <div>
                        <p className="text-xs font-bold text-ink/60 uppercase">Start Date</p>
                        <p className="font-black text-ink">
                          {new Date(project.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {project.deadline && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-strawberry" />
                        <div>
                          <p className="text-xs font-bold text-ink/60 uppercase">Deadline</p>
                          <p className="font-black text-ink">
                            {new Date(project.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <h4 className="font-black text-lg uppercase text-ink mb-4">Team</h4>
                  <div className="space-y-2">
                    {/* Client */}
                    <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                      {project.client.image ? (
                        <img
                          src={project.client.image}
                          alt={project.client.name || project.client.email}
                          className="w-10 h-10 rounded-full border-2 border-ink"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-taro rounded-full border-2 border-ink flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-black text-ink">
                          {project.client.name || project.client.email}
                        </p>
                        <p className="text-xs font-bold text-ink/60 uppercase">Client / Owner</p>
                      </div>
                    </div>

                    {/* Team Members */}
                    {project.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3 bg-cream rounded-lg"
                      >
                        {member.user.image ? (
                          <img
                            src={member.user.image}
                            alt={member.user.name || member.user.email}
                            className="w-10 h-10 rounded-full border-2 border-ink"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-matcha rounded-full border-2 border-ink flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-black text-ink">
                            {member.user.name || member.user.email}
                          </p>
                          <p className="text-xs font-bold text-ink/60 uppercase">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Milestones */}
              {project.milestones.length > 0 && (
                <div>
                  <h4 className="font-black text-lg uppercase text-ink mb-4">Milestones</h4>
                  <div className="space-y-3">
                    {project.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className={`p-4 rounded-lg border-3 border-ink ${
                          milestone.completed ? 'bg-matcha/20' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className={`w-6 h-6 rounded-full border-2 border-ink flex items-center justify-center ${
                                milestone.completed ? 'bg-matcha' : 'bg-white'
                              }`}
                            >
                              {milestone.completed && (
                                <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
                              )}
                            </div>
                            <div>
                              <p className="font-black text-ink">{milestone.title}</p>
                              {milestone.description && (
                                <p className="text-sm text-ink/70 font-bold mt-1">
                                  {milestone.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-bold text-ink/60">
                            {new Date(milestone.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {project.tasks.length === 0 ? (
                <div className="text-center py-12">
                  <Icon
                    icon="ph:check-square-duotone"
                    className="w-16 h-16 text-ink/20 mx-auto mb-4"
                  />
                  <p className="font-bold text-ink/60">No tasks yet</p>
                </div>
              ) : (
                project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-cream rounded-lg border-3 border-ink p-4 hover:shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-black text-ink mb-1">{task.title}</p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-black uppercase ${
                              task.status === 'DONE'
                                ? 'bg-matcha text-white'
                                : task.status === 'IN_PROGRESS'
                                  ? 'bg-taro text-white'
                                  : 'bg-ink/10 text-ink'
                            }`}
                          >
                            {task.status}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-black uppercase ${
                              task.priority === 'HIGH'
                                ? 'bg-strawberry text-white'
                                : task.priority === 'MEDIUM'
                                  ? 'bg-thai-tea text-white'
                                  : 'bg-ink/10 text-ink'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      {task.assignedTo && (
                        <div className="flex items-center gap-2">
                          {task.assignedTo.image ? (
                            <img
                              src={task.assignedTo.image}
                              alt={task.assignedTo.name || 'User'}
                              className="w-8 h-8 rounded-full border-2 border-ink"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-taro rounded-full border-2 border-ink" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              {project.files.length === 0 ? (
                <div className="text-center py-12">
                  <Icon
                    icon="ph:folder-open-duotone"
                    className="w-16 h-16 text-ink/20 mx-auto mb-4"
                  />
                  <p className="font-bold text-ink/60">No files yet</p>
                </div>
              ) : (
                project.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 bg-cream rounded-lg border-3 border-ink hover:shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] transition-shadow"
                  >
                    <Icon icon="ph:file-duotone" className="w-10 h-10 text-taro" />
                    <div className="flex-1">
                      <p className="font-black text-ink">{file.name}</p>
                      <p className="text-sm font-bold text-ink/60">
                        {(file.size / 1024).toFixed(2)} KB •{' '}
                        {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-taro text-white font-black rounded-full hover:bg-deep-taro transition-colors uppercase text-sm"
                    >
                      Download
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {project.activities.length === 0 ? (
                <div className="text-center py-12">
                  <Icon icon="ph:clock-duotone" className="w-16 h-16 text-ink/20 mx-auto mb-4" />
                  <p className="font-bold text-ink/60">No activity yet</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-ink/20" />
                  {project.activities.map((activity, index) => (
                    <div key={activity.id} className="relative pl-12 pb-8">
                      <div className="absolute left-0 w-10 h-10 bg-taro rounded-full border-3 border-ink flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="bg-white rounded-lg border-3 border-ink p-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-3">
                            {activity.user.image ? (
                              <img
                                src={activity.user.image}
                                alt={activity.user.name || 'User'}
                                className="w-8 h-8 rounded-full border-2 border-ink"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-matcha rounded-full border-2 border-ink" />
                            )}
                            <p className="font-black text-ink">{activity.user.name || 'User'}</p>
                          </div>
                          <p className="text-sm font-bold text-ink/60">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-ink/70 font-bold">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
