'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  Plus,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  X,
  Calendar,
  Zap,
  Pause,
} from 'lucide-react';

interface Request {
  id: string;
  title: string;
  description: string;
  status:
    | 'DRAFT'
    | 'SUBMITTED'
    | 'IN_PROGRESS'
    | 'IN_REVIEW'
    | 'REVISION_REQUESTED'
    | 'COMPLETED'
    | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  submittedAt: string | null;
  startedAt: string | null;
  dueDate: string | null;
  completedAt: string | null;
  slaHours: number | null;
  createdAt: string;
  project: {
    id: string;
    name: string;
  } | null;
}

interface Limits {
  maxActive: number;
  currentActive: number;
  slaHours: number;
}

interface RequestTrackingProps {
  onUpgrade?: () => void;
}

export default function RequestTracking({ onUpgrade }: RequestTrackingProps = {}) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [limits, setLimits] = useState<Limits>({ maxActive: 1, currentActive: 0, slaHours: 84 });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portal/requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
        setLimits(data.limits);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/portal/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create request');
      }

      setSuccess('Request submitted successfully!');
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setShowCreateModal(false);
      fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create request');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (status: Request['status']) => {
    const configs = {
      DRAFT: { label: 'Draft', color: 'bg-cream text-ink border-ink/30', icon: Pause },
      SUBMITTED: {
        label: 'Submitted',
        color: 'bg-thai-tea/20 text-thai-tea border-thai-tea',
        icon: Clock,
      },
      IN_PROGRESS: { label: 'In Progress', color: 'bg-taro/20 text-taro border-taro', icon: Zap },
      IN_REVIEW: {
        label: 'In Review',
        color: 'bg-milk-tea/50 text-ink border-brown-sugar',
        icon: AlertCircle,
      },
      REVISION_REQUESTED: {
        label: 'Revision',
        color: 'bg-strawberry/20 text-strawberry border-strawberry',
        icon: TrendingUp,
      },
      COMPLETED: {
        label: 'Completed',
        color: 'bg-matcha/20 text-matcha border-matcha',
        icon: CheckCircle2,
      },
      CANCELLED: {
        label: 'Cancelled',
        color: 'bg-ink/10 text-ink/50 border-ink/30',
        icon: XCircle,
      },
    };
    return configs[status];
  };

  const getPriorityConfig = (priority: Request['priority']) => {
    const configs = {
      LOW: { label: 'Low', color: 'text-ink/50' },
      MEDIUM: { label: 'Medium', color: 'text-ink/70' },
      HIGH: { label: 'High', color: 'text-thai-tea' },
      URGENT: { label: 'Urgent', color: 'text-strawberry' },
    };
    return configs[priority];
  };

  const calculateTimeRemaining = (dueDate: string | null) => {
    if (!dueDate) return null;

    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    const diff = due - now;

    if (diff <= 0) return { label: 'Overdue', isOverdue: true, percentage: 100 };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let label = '';
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      label = `${days}d ${hours % 24}h remaining`;
    } else if (hours > 0) {
      label = `${hours}h ${minutes}m remaining`;
    } else {
      label = `${minutes}m remaining`;
    }

    return { label, isOverdue: false, hours, percentage: 0 };
  };

  const canCreateRequest = limits.currentActive < limits.maxActive;

  const activeRequests = requests.filter(
    (r) => r.status === 'SUBMITTED' || r.status === 'IN_PROGRESS' || r.status === 'IN_REVIEW'
  );
  const completedRequests = requests.filter((r) => r.status === 'COMPLETED');
  const otherRequests = requests.filter(
    (r) =>
      r.status !== 'SUBMITTED' &&
      r.status !== 'IN_PROGRESS' &&
      r.status !== 'IN_REVIEW' &&
      r.status !== 'COMPLETED'
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-taro animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Active Requests Counter */}
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-taro/20 rounded-full border-2 border-taro flex items-center justify-center">
              <Zap className="w-5 h-5 text-taro" strokeWidth={2.5} />
            </div>
            <span className="font-black text-xs text-ink/70 uppercase">Active Requests</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-black text-4xl text-ink">{limits.currentActive}</span>
            <span className="font-bold text-lg text-ink/50 mb-1">/ {limits.maxActive}</span>
          </div>
          {!canCreateRequest && (
            <p className="text-strawberry font-bold text-xs mt-2">Limit reached</p>
          )}
        </div>

        {/* SLA Time */}
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-thai-tea/20 rounded-full border-2 border-thai-tea flex items-center justify-center">
              <Clock className="w-5 h-5 text-thai-tea" strokeWidth={2.5} />
            </div>
            <span className="font-black text-xs text-ink/70 uppercase">Turnaround SLA</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-black text-4xl text-ink">{limits.slaHours}</span>
            <span className="font-bold text-lg text-ink/50 mb-1">hours</span>
          </div>
          <p className="text-ink/70 font-bold text-xs mt-2">
            {limits.slaHours <= 24
              ? '24-hour express'
              : limits.slaHours <= 48
                ? '2-day priority'
                : '3-4 day standard'}
          </p>
        </div>

        {/* Completed Count */}
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-matcha/20 rounded-full border-2 border-matcha flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-matcha" strokeWidth={2.5} />
            </div>
            <span className="font-black text-xs text-ink/70 uppercase">Completed</span>
          </div>
          <span className="font-black text-4xl text-ink">{completedRequests.length}</span>
        </div>
      </div>

      {/* Create Request Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-2xl text-ink uppercase mb-2">Your Requests</h2>
          <p className="text-ink/70 font-bold">Track active design and development requests</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!canCreateRequest || actionLoading}
          className="px-6 py-3 bg-taro text-white font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          New Request
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-strawberry/20 border-3 border-strawberry rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-strawberry flex-shrink-0 mt-0.5" />
          <p className="text-strawberry font-bold flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-strawberry">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-matcha/20 border-3 border-matcha rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-matcha flex-shrink-0 mt-0.5" />
          <p className="text-ink font-bold flex-1">{success}</p>
          <button onClick={() => setSuccess(null)} className="text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Active Requests */}
      {activeRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-black text-lg text-ink uppercase flex items-center gap-2">
            <Zap className="w-5 h-5 text-taro" strokeWidth={2.5} />
            Active Requests
          </h3>

          {activeRequests.map((request) => {
            const statusConfig = getStatusConfig(request.status);
            const priorityConfig = getPriorityConfig(request.priority);
            const timeRemaining = calculateTimeRemaining(request.dueDate);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={request.id}
                className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-black text-xl text-ink mb-2">{request.title}</h4>
                        <p className="text-ink/70 font-bold">{request.description}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 font-black text-xs uppercase ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-4 h-4" strokeWidth={2.5} />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="ph:flag-duotone"
                          className={`w-4 h-4 ${priorityConfig.color}`}
                        />
                        <span className={`font-bold ${priorityConfig.color}`}>
                          {priorityConfig.label}
                        </span>
                      </div>

                      {request.project && (
                        <>
                          <span className="text-ink/30">•</span>
                          <div className="flex items-center gap-2 text-ink/70 font-bold">
                            <Icon icon="ph:folder-duotone" className="w-4 h-4" />
                            {request.project.name}
                          </div>
                        </>
                      )}

                      {request.submittedAt && (
                        <>
                          <span className="text-ink/30">•</span>
                          <div className="flex items-center gap-2 text-ink/70 font-bold">
                            <Calendar className="w-4 h-4" />
                            Submitted {new Date(request.submittedAt).toLocaleDateString()}
                          </div>
                        </>
                      )}
                    </div>

                    {/* SLA Countdown */}
                    {timeRemaining && request.dueDate && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-ink/70 uppercase">
                            {timeRemaining.isOverdue ? 'Overdue' : 'Time Remaining'}
                          </span>
                          <span
                            className={`font-black text-sm ${timeRemaining.isOverdue ? 'text-strawberry' : 'text-taro'}`}
                          >
                            {timeRemaining.label}
                          </span>
                        </div>
                        {/* Progress bar */}
                        {!timeRemaining.isOverdue && request.submittedAt && (
                          <div className="w-full h-2 bg-cream rounded-full border-2 border-ink overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-matcha to-taro transition-all duration-1000"
                              style={{
                                width: `${Math.min(100, ((new Date().getTime() - new Date(request.submittedAt).getTime()) / (new Date(request.dueDate).getTime() - new Date(request.submittedAt).getTime())) * 100)}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Requests */}
      {completedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-black text-lg text-ink uppercase flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-matcha" strokeWidth={2.5} />
            Completed Requests
          </h3>

          <div className="space-y-3">
            {completedRequests.slice(0, 5).map((request) => {
              const statusConfig = getStatusConfig(request.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={request.id}
                  className="bg-white rounded-xl border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] p-4"
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className="w-5 h-5 text-matcha flex-shrink-0" strokeWidth={2.5} />
                    <div className="flex-1">
                      <h4 className="font-black text-ink">{request.title}</h4>
                      <p className="text-ink/70 font-bold text-sm">
                        Completed{' '}
                        {request.completedAt && new Date(request.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {requests.length === 0 && (
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-12 text-center">
          <Icon icon="ph:empty-duotone" className="w-16 h-16 text-taro mx-auto mb-4" />
          <h3 className="font-black text-xl text-ink uppercase mb-2">No Requests Yet</h3>
          <p className="text-ink/70 font-bold mb-6">
            Submit your first design or development request to get started
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-taro text-white font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
          >
            Create First Request
          </button>
        </div>
      )}

      {/* Upgrade Prompt if at limit */}
      {!canCreateRequest && (
        <div className="bg-taro/10 border-3 border-taro rounded-xl p-6 text-center">
          <TrendingUp className="w-12 h-12 text-taro mx-auto mb-4" strokeWidth={2.5} />
          <h3 className="font-black text-xl text-ink uppercase mb-2">Request Limit Reached</h3>
          <p className="text-ink/70 font-bold mb-4">
            You&apos;ve reached your {limits.maxActive} active request limit. Upgrade to handle more
            requests simultaneously.
          </p>
          <button
            onClick={onUpgrade}
            className="inline-flex items-center gap-2 px-6 py-3 bg-taro text-white font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
          >
            Upgrade Plan
            <Icon icon="ph:arrow-right-duotone" className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b-4 border-ink p-6 flex items-center justify-between z-10">
              <h3 className="font-black text-2xl text-ink uppercase">New Request</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-10 h-10 rounded-full border-3 border-ink hover:bg-cream transition-colors"
              >
                <X className="w-5 h-5 mx-auto" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
              <div>
                <label className="block font-black text-sm text-ink uppercase mb-2">
                  Request Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Homepage redesign, Logo variations, Landing page"
                  className="w-full px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
                />
              </div>

              <div>
                <label className="block font-black text-sm text-ink uppercase mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  placeholder="Describe what you need in detail. Include any references, requirements, or specifications..."
                  className="w-full px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro resize-none"
                />
              </div>

              <div>
                <label className="block font-black text-sm text-ink uppercase mb-2">Priority</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-4 py-2 font-black rounded-lg border-3 transition-all uppercase text-sm ${
                        priority === p
                          ? 'bg-taro text-white border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]'
                          : 'bg-white text-ink border-ink/30 hover:border-ink'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-cream border-3 border-ink rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-taro flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <p className="font-black text-sm text-ink uppercase mb-1">
                      Expected Turnaround
                    </p>
                    <p className="text-ink/70 font-bold text-sm">
                      Your request will be completed within{' '}
                      <span className="text-taro font-black">{limits.slaHours} hours</span> based on
                      your current plan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-white text-ink font-black rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-taro text-white font-black rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
