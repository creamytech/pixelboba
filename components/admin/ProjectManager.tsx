'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import { Project, ProjectStatus } from '@/types/portal';
import BobaProgressIndicator from '@/components/portal/BobaProgressIndicator';

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(projects.filter((p) => p.id !== projectId));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions: (ProjectStatus | 'ALL')[] = [
    'ALL',
    'DISCOVERY',
    'WIREFRAMING',
    'DESIGN',
    'DEVELOPMENT',
    'TESTING',
    'LAUNCH',
    'MAINTENANCE',
    'COMPLETED',
    'PAUSED',
    'CANCELLED',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">project management</h2>
            <p className="text-ink/60 mt-1">manage all client projects and track progress</p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors"
          >
            <Plus size={18} />
            <span>new project</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink/40" />
            <input
              type="text"
              placeholder="search projects or clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-taro/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'ALL')}
            className="px-4 py-2 border border-ink/20 rounded-lg bg-white/70 text-ink focus:outline-none focus:ring-2 focus:ring-taro/20"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'all statuses' : status.toLowerCase().replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-ink/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink/50">loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-ink/50">no projects found</div>
        ) : (
          <div className="grid gap-6 p-6">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={() => deleteProject(project.id)}
                  onUpdate={fetchProjects}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <CreateProjectModal
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              fetchProjects();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({
  project,
  onDelete,
  onUpdate,
}: {
  project: Project;
  onDelete: () => void;
  onUpdate: () => void;
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/50 rounded-lg p-6 border border-ink/10 hover:shadow-lg transition-all"
      >
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Project Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-ink mb-1">{project.name}</h3>
                <p className="text-ink/70 text-sm line-clamp-2">{project.description}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-ink/40" />
                <span className="text-ink/60">client:</span>
                <span className="text-ink font-medium">{project.client.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-ink/40" />
                <span className="text-ink/60">deadline:</span>
                <span className="text-ink">
                  {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'TBD'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(project.status)}`}
              >
                {project.status.toLowerCase().replace('_', ' ')}
              </span>
              <span className="text-xs text-ink/50">
                started {new Date(project.startDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="lg:w-48 flex flex-col items-center">
            <BobaProgressIndicator
              progress={project.progress}
              status={project.status}
              size="small"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-ink/60 hover:text-ink hover:bg-white/70 rounded-lg transition-colors">
              <Eye size={16} />
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 text-ink/60 hover:text-ink hover:bg-white/70 rounded-lg transition-colors"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-ink/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <EditProjectModal
            project={project}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {
              setShowEditModal(false);
              onUpdate();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function getStatusColor(status: ProjectStatus) {
  const colors = {
    DISCOVERY: 'bg-orange-100 text-orange-700',
    WIREFRAMING: 'bg-blue-100 text-blue-700',
    DESIGN: 'bg-purple-100 text-purple-700',
    DEVELOPMENT: 'bg-cyan-100 text-cyan-700',
    TESTING: 'bg-yellow-100 text-yellow-700',
    LAUNCH: 'bg-green-100 text-green-700',
    MAINTENANCE: 'bg-gray-100 text-gray-700',
    COMPLETED: 'bg-emerald-100 text-emerald-700',
    PAUSED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

function EditProjectModal({
  project,
  onClose,
  onSuccess,
}: {
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    status: project.status,
    progress: project.progress,
    deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
  });
  const [loading, setLoading] = useState(false);

  const statusOptions: ProjectStatus[] = [
    'DISCOVERY',
    'WIREFRAMING',
    'DESIGN',
    'DEVELOPMENT',
    'TESTING',
    'LAUNCH',
    'MAINTENANCE',
    'COMPLETED',
    'PAUSED',
    'CANCELLED',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          deadline: formData.deadline || null,
          progress: parseInt(formData.progress.toString()),
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[95vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="font-display text-2xl font-bold text-ink mb-6">update project</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">project name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as ProjectStatus })
                }
                className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.toLowerCase().replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                progress ({formData.progress}%)
              </label>
              <div className="space-y-3">
                <div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) =>
                      setFormData({ ...formData, progress: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-ink/60 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-16">
                    <BobaProgressIndicator
                      progress={formData.progress}
                      status={formData.status as ProjectStatus}
                      size="small"
                      showDetails={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">deadline (optional)</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-ink/70 hover:text-ink transition-colors"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors disabled:opacity-50"
            >
              {loading ? 'updating...' : 'update project'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function CreateProjectModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          deadline: formData.deadline || null,
        }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[95vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="font-display text-2xl font-bold text-ink mb-6">create new project</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">project name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">client</label>
              <select
                required
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
              >
                <option value="">select client...</option>
                {clients.map((client: any) => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">start date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  deadline (optional)
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro/20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-ink/70 hover:text-ink transition-colors"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-taro text-white rounded-lg hover:bg-taro/80 transition-colors disabled:opacity-50"
            >
              {loading ? 'creating...' : 'create project'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
