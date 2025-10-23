'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Filter,
  Search,
  TrendingUp,
  Pause,
  X,
  Eye,
  RotateCcw,
  XCircle,
  Calendar,
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
  organization: {
    id: string;
    name: string;
    owner: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  } | null;
}

interface Stats {
  total: number;
  submitted: number;
  inProgress: number;
  inReview: number;
  completed: number;
  overdue: number;
}

export default function RequestManager() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    submitted: 0,
    inProgress: 0,
    inReview: 0,
    completed: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [statusFilter, priorityFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);

      const response = await fetch(`/api/admin/requests?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchRequests();
        setShowDetailModal(false);
        setSelectedRequest(null);
      }
    } catch (err) {
      console.error('Error updating request:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <AlertCircle className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <TrendingUp className="w-4 h-4" />;
      case 'IN_REVIEW':
        return <Eye className="w-4 h-4" />;
      case 'REVISION_REQUESTED':
        return <RotateCcw className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-thai-tea/20 text-thai-tea border-thai-tea';
      case 'IN_PROGRESS':
        return 'bg-matcha/20 text-ink border-matcha';
      case 'IN_REVIEW':
        return 'bg-taro/20 text-deep-taro border-taro';
      case 'REVISION_REQUESTED':
        return 'bg-milk-tea/20 text-brown-sugar border-brown-sugar';
      case 'COMPLETED':
        return 'bg-matcha/30 text-ink border-matcha';
      case 'CANCELLED':
        return 'bg-strawberry/20 text-strawberry border-strawberry';
      default:
        return 'bg-cream text-ink border-ink/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-strawberry text-white border-ink';
      case 'HIGH':
        return 'bg-thai-tea text-white border-ink';
      case 'MEDIUM':
        return 'bg-taro text-white border-ink';
      case 'LOW':
        return 'bg-cream text-ink border-ink';
      default:
        return 'bg-cream text-ink border-ink';
    }
  };

  const isOverdue = (request: Request) => {
    return (
      request.dueDate &&
      new Date(request.dueDate) < new Date() &&
      request.status !== 'COMPLETED' &&
      request.status !== 'CANCELLED'
    );
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.organization?.owner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.organization?.owner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-taro animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-3xl text-ink uppercase mb-2">Request Manager</h2>
          <p className="text-ink/70 font-bold">Manage all client design & development requests</p>
        </div>
        <div className="flex items-center gap-3">
          {stats.overdue > 0 && (
            <div className="px-4 py-2 bg-strawberry/20 border-3 border-strawberry rounded-lg">
              <p className="text-strawberry font-black text-sm uppercase">
                {stats.overdue} Overdue
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border-4 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <p className="text-ink/70 font-bold text-xs uppercase mb-1">Total</p>
          <p className="font-black text-3xl text-ink">{stats.total}</p>
        </div>
        <div className="bg-thai-tea/10 rounded-xl border-4 border-thai-tea shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <p className="text-thai-tea font-bold text-xs uppercase mb-1">Submitted</p>
          <p className="font-black text-3xl text-thai-tea">{stats.submitted}</p>
        </div>
        <div className="bg-matcha/10 rounded-xl border-4 border-matcha shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <p className="text-ink font-bold text-xs uppercase mb-1">In Progress</p>
          <p className="font-black text-3xl text-ink">{stats.inProgress}</p>
        </div>
        <div className="bg-taro/10 rounded-xl border-4 border-taro shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <p className="text-deep-taro font-bold text-xs uppercase mb-1">In Review</p>
          <p className="font-black text-3xl text-deep-taro">{stats.inReview}</p>
        </div>
        <div className="bg-matcha/20 rounded-xl border-4 border-matcha shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <p className="text-ink font-bold text-xs uppercase mb-1">Completed</p>
          <p className="font-black text-3xl text-ink">{stats.completed}</p>
        </div>
        <div className="bg-strawberry/10 rounded-xl border-4 border-strawberry shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <p className="text-strawberry font-bold text-xs uppercase mb-1">Overdue</p>
          <p className="font-black text-3xl text-strawberry">{stats.overdue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests, clients..."
              className="w-full pl-12 pr-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="REVISION_REQUESTED">Revision Requested</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <Icon icon="ph:inbox-duotone" className="w-16 h-16 text-ink/30 mx-auto mb-4" />
            <h3 className="font-black text-xl text-ink uppercase mb-2">No Requests Found</h3>
            <p className="text-ink/70 font-bold">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'No client requests match the selected filters'}
            </p>
          </div>
        ) : (
          <div className="divide-y-4 divide-ink">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-cream/50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Client Avatar */}
                  <div className="w-12 h-12 bg-taro/20 rounded-full border-3 border-ink flex items-center justify-center flex-shrink-0">
                    {request.organization?.owner.image ? (
                      <img
                        src={request.organization.owner.image}
                        alt={request.organization.owner.name || request.organization.owner.email}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Icon icon="ph:user-duotone" className="w-6 h-6 text-taro" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title & Client */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg text-ink mb-1 truncate">
                          {request.title}
                        </h3>
                        <p className="text-ink/70 font-bold text-sm">
                          {request.organization?.owner.name || request.organization?.owner.email}
                        </p>
                      </div>

                      {/* Priority Badge */}
                      <div
                        className={`px-3 py-1.5 rounded-full border-2 font-black text-xs uppercase ${getPriorityColor(request.priority)}`}
                      >
                        {request.priority}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-ink/70 font-bold text-sm mb-3 line-clamp-2">
                      {request.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {/* Status */}
                      <div
                        className={`px-3 py-1.5 rounded-lg border-2 font-black text-xs uppercase flex items-center gap-1.5 ${getStatusColor(request.status)}`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status.replace(/_/g, ' ')}
                      </div>

                      {/* Project */}
                      {request.project && (
                        <div className="flex items-center gap-1.5 text-ink/70 font-bold text-xs">
                          <Icon icon="ph:folder-duotone" className="w-4 h-4" />
                          {request.project.name}
                        </div>
                      )}

                      {/* Due Date */}
                      {request.dueDate && (
                        <div
                          className={`flex items-center gap-1.5 font-bold text-xs ${
                            isOverdue(request) ? 'text-strawberry' : 'text-ink/70'
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                          Due {new Date(request.dueDate).toLocaleDateString()}
                          {isOverdue(request) && ' (Overdue)'}
                        </div>
                      )}

                      {/* SLA */}
                      {request.slaHours && (
                        <div className="flex items-center gap-1.5 text-ink/70 font-bold text-xs">
                          <Clock className="w-4 h-4" />
                          {request.slaHours}h SLA
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailModal(true);
                        }}
                        className="px-4 py-2 bg-taro text-white font-black rounded-lg border-2 border-ink hover:bg-deep-taro transition-colors uppercase text-xs flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>

                      {request.status === 'SUBMITTED' && (
                        <button
                          onClick={() => handleUpdateStatus(request.id, 'IN_PROGRESS')}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-matcha text-ink font-black rounded-lg border-2 border-ink hover:bg-matcha/80 transition-colors uppercase text-xs flex items-center gap-2 disabled:opacity-50"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Start Work
                        </button>
                      )}

                      {request.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleUpdateStatus(request.id, 'IN_REVIEW')}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-taro text-white font-black rounded-lg border-2 border-ink hover:bg-deep-taro transition-colors uppercase text-xs flex items-center gap-2 disabled:opacity-50"
                        >
                          <Eye className="w-4 h-4" />
                          Send for Review
                        </button>
                      )}

                      {request.status === 'IN_REVIEW' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(request.id, 'COMPLETED')}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-matcha text-ink font-black rounded-lg border-2 border-ink hover:bg-matcha/80 transition-colors uppercase text-xs flex items-center gap-2 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(request.id, 'REVISION_REQUESTED')}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-milk-tea text-ink font-black rounded-lg border-2 border-ink hover:bg-brown-sugar/20 transition-colors uppercase text-xs flex items-center gap-2 disabled:opacity-50"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Request Revision
                          </button>
                        </>
                      )}

                      {request.status === 'REVISION_REQUESTED' && (
                        <button
                          onClick={() => handleUpdateStatus(request.id, 'IN_PROGRESS')}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-matcha text-ink font-black rounded-lg border-2 border-ink hover:bg-matcha/80 transition-colors uppercase text-xs flex items-center gap-2 disabled:opacity-50"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Resume Work
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b-4 border-ink p-6 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-black text-2xl text-ink uppercase">Request Details</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedRequest(null);
                }}
                className="w-10 h-10 rounded-full border-3 border-ink hover:bg-cream transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <h4 className="font-black text-xl text-ink mb-2">{selectedRequest.title}</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className={`px-3 py-1.5 rounded-lg border-2 font-black text-xs uppercase flex items-center gap-1.5 ${getStatusColor(selectedRequest.status)}`}
                  >
                    {getStatusIcon(selectedRequest.status)}
                    {selectedRequest.status.replace(/_/g, ' ')}
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-full border-2 font-black text-xs uppercase ${getPriorityColor(selectedRequest.priority)}`}
                  >
                    {selectedRequest.priority}
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-cream/50 rounded-lg p-4 border-2 border-ink">
                <p className="text-ink/70 font-bold text-xs uppercase mb-2">Client</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-taro/20 rounded-full border-2 border-ink flex items-center justify-center">
                    {selectedRequest.organization?.owner.image ? (
                      <img
                        src={selectedRequest.organization.owner.image}
                        alt={
                          selectedRequest.organization.owner.name ||
                          selectedRequest.organization.owner.email
                        }
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Icon icon="ph:user-duotone" className="w-5 h-5 text-taro" />
                    )}
                  </div>
                  <div>
                    <p className="font-black text-ink">
                      {selectedRequest.organization?.owner.name ||
                        selectedRequest.organization?.owner.email}
                    </p>
                    <p className="text-ink/70 font-bold text-sm">
                      {selectedRequest.organization?.owner.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-ink/70 font-bold text-xs uppercase mb-2">Description</p>
                <p className="text-ink font-bold whitespace-pre-wrap">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Meta Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {selectedRequest.project && (
                  <div className="bg-cream/50 rounded-lg p-4 border-2 border-ink">
                    <p className="text-ink/70 font-bold text-xs uppercase mb-1">Project</p>
                    <p className="font-black text-ink">{selectedRequest.project.name}</p>
                  </div>
                )}

                {selectedRequest.submittedAt && (
                  <div className="bg-cream/50 rounded-lg p-4 border-2 border-ink">
                    <p className="text-ink/70 font-bold text-xs uppercase mb-1">Submitted</p>
                    <p className="font-black text-ink">
                      {new Date(selectedRequest.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {selectedRequest.dueDate && (
                  <div className="bg-cream/50 rounded-lg p-4 border-2 border-ink">
                    <p className="text-ink/70 font-bold text-xs uppercase mb-1">Due Date</p>
                    <p
                      className={`font-black ${isOverdue(selectedRequest) ? 'text-strawberry' : 'text-ink'}`}
                    >
                      {new Date(selectedRequest.dueDate).toLocaleDateString()}
                      {isOverdue(selectedRequest) && ' (Overdue)'}
                    </p>
                  </div>
                )}

                {selectedRequest.slaHours && (
                  <div className="bg-cream/50 rounded-lg p-4 border-2 border-ink">
                    <p className="text-ink/70 font-bold text-xs uppercase mb-1">SLA</p>
                    <p className="font-black text-ink">{selectedRequest.slaHours} hours</p>
                  </div>
                )}
              </div>

              {/* Status Actions */}
              <div className="border-t-2 border-ink pt-6">
                <p className="text-ink/70 font-bold text-xs uppercase mb-4">Update Status</p>
                <div className="grid grid-cols-2 gap-3">
                  {selectedRequest.status !== 'IN_PROGRESS' &&
                    selectedRequest.status !== 'COMPLETED' &&
                    selectedRequest.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedRequest.id, 'IN_PROGRESS')}
                        disabled={actionLoading}
                        className="px-4 py-3 bg-matcha text-ink font-black rounded-lg border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase text-sm disabled:opacity-50"
                      >
                        Start Work
                      </button>
                    )}

                  {selectedRequest.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'IN_REVIEW')}
                      disabled={actionLoading}
                      className="px-4 py-3 bg-taro text-white font-black rounded-lg border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase text-sm disabled:opacity-50"
                    >
                      Send for Review
                    </button>
                  )}

                  {(selectedRequest.status === 'IN_REVIEW' ||
                    selectedRequest.status === 'REVISION_REQUESTED') && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(selectedRequest.id, 'COMPLETED')}
                        disabled={actionLoading}
                        className="px-4 py-3 bg-matcha text-ink font-black rounded-lg border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase text-sm disabled:opacity-50"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedRequest.id, 'REVISION_REQUESTED')}
                        disabled={actionLoading}
                        className="px-4 py-3 bg-milk-tea text-ink font-black rounded-lg border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase text-sm disabled:opacity-50"
                      >
                        Request Revision
                      </button>
                    </>
                  )}

                  {selectedRequest.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'CANCELLED')}
                      disabled={actionLoading}
                      className="px-4 py-3 bg-strawberry/10 text-strawberry font-black rounded-lg border-3 border-strawberry hover:bg-strawberry hover:text-white transition-colors uppercase text-sm disabled:opacity-50"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
