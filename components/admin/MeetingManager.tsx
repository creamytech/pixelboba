'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  Video,
  FileText,
  User,
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  type: 'UX_REVIEW' | 'STRATEGY_CALL' | 'ONBOARDING' | 'PROJECT_REVIEW' | 'GENERAL';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  scheduledAt: string;
  duration: number;
  meetingUrl: string | null;
  notes: string | null;
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
  host: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface Stats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  upcoming: number;
}

export default function MeetingManager() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchMeetings();
    const interval = setInterval(fetchMeetings, 30000);
    return () => clearInterval(interval);
  }, [statusFilter, typeFilter]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (typeFilter !== 'ALL') params.append('type', typeFilter);

      const response = await fetch(`/api/admin/meetings?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setMeetings(data.meetings);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (meetingId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchMeetings();
      }
    } catch (err) {
      console.error('Error updating meeting:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-taro/20 text-deep-taro border-taro';
      case 'COMPLETED':
        return 'bg-matcha/30 text-ink border-matcha';
      case 'CANCELLED':
        return 'bg-strawberry/20 text-strawberry border-strawberry';
      case 'RESCHEDULED':
        return 'bg-thai-tea/20 text-thai-tea border-thai-tea';
      default:
        return 'bg-cream text-ink border-ink/30';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ');
  };

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.organization?.owner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.organization?.owner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && meetings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-taro animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <h2 className="font-black text-3xl text-ink uppercase mb-2">Meeting Manager</h2>
        <p className="text-ink/70 font-bold">Manage all client meetings and calls</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border-4 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <p className="text-ink/70 font-bold text-xs uppercase mb-1">Total</p>
          <p className="font-black text-3xl text-ink">{stats.total}</p>
        </div>
        <div className="bg-taro/10 rounded-xl border-4 border-taro shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <p className="text-deep-taro font-bold text-xs uppercase mb-1">Upcoming</p>
          <p className="font-black text-3xl text-deep-taro">{stats.upcoming}</p>
        </div>
        <div className="bg-thai-tea/10 rounded-xl border-4 border-thai-tea shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <p className="text-thai-tea font-bold text-xs uppercase mb-1">Scheduled</p>
          <p className="font-black text-3xl text-thai-tea">{stats.scheduled}</p>
        </div>
        <div className="bg-matcha/20 rounded-xl border-4 border-matcha shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <p className="text-ink font-bold text-xs uppercase mb-1">Completed</p>
          <p className="font-black text-3xl text-ink">{stats.completed}</p>
        </div>
        <div className="bg-strawberry/10 rounded-xl border-4 border-strawberry shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
          <p className="text-strawberry font-bold text-xs uppercase mb-1">Cancelled</p>
          <p className="font-black text-3xl text-strawberry">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meetings, clients..."
              className="w-full pl-12 pr-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RESCHEDULED">Rescheduled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
          >
            <option value="ALL">All Types</option>
            <option value="UX_REVIEW">UX Review</option>
            <option value="STRATEGY_CALL">Strategy Call</option>
            <option value="ONBOARDING">Onboarding</option>
            <option value="PROJECT_REVIEW">Project Review</option>
            <option value="GENERAL">General</option>
          </select>
        </div>
      </div>

      {/* Meetings List */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
        {filteredMeetings.length === 0 ? (
          <div className="p-12 text-center">
            <Icon icon="ph:calendar-x-duotone" className="w-16 h-16 text-ink/30 mx-auto mb-4" />
            <h3 className="font-black text-xl text-ink uppercase mb-2">No Meetings Found</h3>
            <p className="text-ink/70 font-bold">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'No meetings match the selected filters'}
            </p>
          </div>
        ) : (
          <div className="divide-y-4 divide-ink">
            {filteredMeetings.map((meeting) => (
              <div key={meeting.id} className="p-6 hover:bg-cream/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-taro/20 rounded-full border-3 border-ink flex items-center justify-center flex-shrink-0">
                    {meeting.organization?.owner.image ? (
                      <img
                        src={meeting.organization.owner.image}
                        alt={meeting.organization.owner.name || meeting.organization.owner.email}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-taro" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-black text-lg text-ink mb-1">{meeting.title}</h3>
                        <p className="text-ink/70 font-bold text-sm">
                          {meeting.organization?.owner.name || meeting.organization?.owner.email}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-lg border-2 font-black text-xs uppercase ${getStatusColor(meeting.status)}`}
                      >
                        {meeting.status}
                      </div>
                    </div>

                    {meeting.description && (
                      <p className="text-ink/70 font-bold text-sm mb-3">{meeting.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5 text-ink/70 font-bold text-xs">
                        <Calendar className="w-4 h-4" />
                        {new Date(meeting.scheduledAt).toLocaleDateString()} at{' '}
                        {new Date(meeting.scheduledAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-ink/70 font-bold text-xs">
                        <Clock className="w-4 h-4" />
                        {meeting.duration} min
                      </div>
                      <div className="px-2 py-1 bg-cream rounded text-xs font-bold uppercase text-ink">
                        {getTypeLabel(meeting.type)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {meeting.meetingUrl && (
                        <a
                          href={meeting.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-taro text-white font-black rounded-lg border-2 border-ink hover:bg-deep-taro transition-colors uppercase text-xs flex items-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          Join Meeting
                        </a>
                      )}

                      {meeting.status === 'SCHEDULED' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(meeting.id, 'COMPLETED')}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-matcha text-ink font-black rounded-lg border-2 border-ink hover:bg-matcha/80 transition-colors uppercase text-xs flex items-center gap-2 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark Complete
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(meeting.id, 'CANCELLED')}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-strawberry/10 text-strawberry font-black rounded-lg border-2 border-strawberry hover:bg-strawberry hover:text-white transition-colors uppercase text-xs flex items-center gap-2 disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      )}

                      {meeting.notes && (
                        <div className="px-4 py-2 bg-cream/50 rounded-lg border-2 border-ink text-xs">
                          <div className="flex items-center gap-1.5 mb-1 font-black uppercase text-ink/70">
                            <FileText className="w-3 h-3" />
                            Notes
                          </div>
                          <p className="text-ink font-bold">{meeting.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
