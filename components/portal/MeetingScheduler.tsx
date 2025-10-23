'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  Calendar,
  Plus,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  User,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  type: 'UX_REVIEW' | 'STRATEGY_CALL' | 'ONBOARDING' | 'PROJECT_REVIEW' | 'GENERAL';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  scheduledAt: string;
  duration: number;
  completedAt: string | null;
  cancelledAt: string | null;
  meetingUrl: string | null;
  notes: string | null;
  host: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface Manager {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface Features {
  hasUxReview: boolean;
  hasStrategyCalls: boolean;
}

interface MeetingSchedulerProps {
  onUpgrade?: () => void;
}

export default function MeetingScheduler({ onUpgrade }: MeetingSchedulerProps = {}) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [manager, setManager] = useState<Manager | null>(null);
  const [features, setFeatures] = useState<Features>({
    hasUxReview: false,
    hasStrategyCalls: false,
  });
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Meeting['type']>('GENERAL');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portal/meetings');
      if (response.ok) {
        const data = await response.json();
        setMeetings(data.meetings);
        setFeatures(data.features);
        setManager(data.manager);
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/portal/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, type, scheduledAt, duration }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule meeting');
      }

      setSuccess("Meeting request submitted! We'll send you a confirmation with the meeting link.");
      setTitle('');
      setDescription('');
      setType('GENERAL');
      setScheduledAt('');
      setDuration(30);
      setShowScheduleModal(false);
      fetchMeetings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule meeting');
    } finally {
      setActionLoading(false);
    }
  };

  const getMeetingTypeConfig = (meetingType: Meeting['type']) => {
    const configs = {
      UX_REVIEW: {
        label: 'UX Review',
        icon: 'ph:layout-duotone',
        color: 'bg-taro/20 text-taro border-taro',
        description: 'Monthly mini-UX review session',
      },
      STRATEGY_CALL: {
        label: 'Strategy Call',
        icon: 'ph:lightbulb-duotone',
        color: 'bg-thai-tea/20 text-thai-tea border-thai-tea',
        description: 'Monthly strategy & performance call',
      },
      ONBOARDING: {
        label: 'Onboarding',
        icon: 'ph:rocket-duotone',
        color: 'bg-matcha/20 text-matcha border-matcha',
        description: 'Get started session',
      },
      PROJECT_REVIEW: {
        label: 'Project Review',
        icon: 'ph:folder-duotone',
        color: 'bg-milk-tea/50 text-ink border-brown-sugar',
        description: 'Project progress review',
      },
      GENERAL: {
        label: 'General',
        icon: 'ph:chat-dots-duotone',
        color: 'bg-cream text-ink border-ink',
        description: 'General discussion',
      },
    };
    return configs[meetingType];
  };

  const getStatusConfig = (status: Meeting['status']) => {
    const configs = {
      SCHEDULED: { label: 'Scheduled', color: 'bg-taro/20 text-taro border-taro', icon: Calendar },
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
      RESCHEDULED: {
        label: 'Rescheduled',
        color: 'bg-thai-tea/20 text-thai-tea border-thai-tea',
        icon: Clock,
      },
    };
    return configs[status];
  };

  const upcomingMeetings = meetings
    .filter((m) => m.status === 'SCHEDULED' && new Date(m.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const pastMeetings = meetings
    .filter(
      (m) =>
        m.status === 'COMPLETED' ||
        (m.status === 'SCHEDULED' && new Date(m.scheduledAt) <= new Date())
    )
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-taro animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-2xl text-ink uppercase mb-2">Meetings</h2>
          <p className="text-ink/70 font-bold">Schedule calls and strategy sessions</p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          disabled={actionLoading}
          className="px-6 py-3 bg-taro text-white font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase flex items-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          Request Meeting
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-strawberry/20 border-3 border-strawberry rounded-lg p-4 flex items-start gap-3">
          <X className="w-5 h-5 text-strawberry flex-shrink-0 mt-0.5" />
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

      {/* Dedicated Manager Card */}
      {manager && (
        <div className="bg-gradient-to-br from-deep-taro to-taro rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white rounded-full border-3 border-ink flex items-center justify-center flex-shrink-0">
              {manager.image ? (
                <img
                  src={manager.image}
                  alt={manager.name || manager.email}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-taro" />
              )}
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-black text-xs uppercase">Your Dedicated Manager</span>
              </div>
              <h3 className="font-black text-xl mb-1">{manager.name || 'Your Manager'}</h3>
              <p className="text-white/90 font-bold mb-3">{manager.email}</p>
              <p className="text-white/80 font-bold text-sm">
                Schedule strategy calls and UX reviews directly with your dedicated creative
                manager.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feature Availability Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* UX Review */}
        <div
          className={`rounded-xl border-4 p-6 ${features.hasUxReview ? 'bg-white border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]' : 'bg-ink/5 border-ink/20'}`}
        >
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`w-12 h-12 rounded-full border-3 flex items-center justify-center ${features.hasUxReview ? 'bg-taro/20 border-taro' : 'bg-ink/10 border-ink/30'}`}
            >
              <Icon
                icon="ph:layout-duotone"
                className={`w-6 h-6 ${features.hasUxReview ? 'text-taro' : 'text-ink/30'}`}
              />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-lg text-ink uppercase mb-1">Monthly UX Review</h4>
              <p
                className={`font-bold text-sm ${features.hasUxReview ? 'text-ink/70' : 'text-ink/50'}`}
              >
                Get expert feedback on your designs and user experience
              </p>
            </div>
          </div>
          {!features.hasUxReview && (
            <div className="flex items-center gap-2 text-sm">
              <Icon icon="ph:lock-duotone" className="w-4 h-4 text-ink/50" />
              <span className="font-bold text-ink/50">Requires Signature Blend or Taro Cloud</span>
            </div>
          )}
        </div>

        {/* Strategy Calls */}
        <div
          className={`rounded-xl border-4 p-6 ${features.hasStrategyCalls ? 'bg-white border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]' : 'bg-ink/5 border-ink/20'}`}
        >
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`w-12 h-12 rounded-full border-3 flex items-center justify-center ${features.hasStrategyCalls ? 'bg-thai-tea/20 border-thai-tea' : 'bg-ink/10 border-ink/30'}`}
            >
              <Icon
                icon="ph:lightbulb-duotone"
                className={`w-6 h-6 ${features.hasStrategyCalls ? 'text-thai-tea' : 'text-ink/30'}`}
              />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-lg text-ink uppercase mb-1">Strategy Calls</h4>
              <p
                className={`font-bold text-sm ${features.hasStrategyCalls ? 'text-ink/70' : 'text-ink/50'}`}
              >
                Monthly strategy and performance review sessions
              </p>
            </div>
          </div>
          {!features.hasStrategyCalls && (
            <div className="flex items-center gap-2 text-sm">
              <Icon icon="ph:lock-duotone" className="w-4 h-4 text-ink/50" />
              <span className="font-bold text-ink/50">Requires Taro Cloud</span>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-black text-lg text-ink uppercase flex items-center gap-2">
            <Calendar className="w-5 h-5 text-taro" strokeWidth={2.5} />
            Upcoming Meetings
          </h3>

          {upcomingMeetings.map((meeting) => {
            const typeConfig = getMeetingTypeConfig(meeting.type);
            const statusConfig = getStatusConfig(meeting.status);
            const StatusIcon = statusConfig.icon;
            const meetingDate = new Date(meeting.scheduledAt);

            return (
              <div
                key={meeting.id}
                className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-taro/20 rounded-xl border-3 border-taro flex flex-col items-center justify-center flex-shrink-0">
                    <span className="font-black text-xs text-taro uppercase">
                      {meetingDate.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="font-black text-2xl text-taro">{meetingDate.getDate()}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-black text-xl text-ink mb-1">{meeting.title}</h4>
                        {meeting.description && (
                          <p className="text-ink/70 font-bold text-sm mb-2">
                            {meeting.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 font-black text-xs uppercase ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-4 h-4" strokeWidth={2.5} />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 font-bold ${typeConfig.color}`}
                      >
                        <Icon icon={typeConfig.icon} className="w-4 h-4" />
                        {typeConfig.label}
                      </span>

                      <div className="flex items-center gap-2 text-ink/70 font-bold">
                        <Clock className="w-4 h-4" />
                        {meetingDate.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>

                      <div className="flex items-center gap-2 text-ink/70 font-bold">
                        <Icon icon="ph:timer-duotone" className="w-4 h-4" />
                        {meeting.duration} min
                      </div>

                      {meeting.host && (
                        <div className="flex items-center gap-2 text-ink/70 font-bold">
                          <User className="w-4 h-4" />
                          {meeting.host.name || meeting.host.email}
                        </div>
                      )}
                    </div>

                    {meeting.meetingUrl && (
                      <a
                        href={meeting.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-taro text-white font-black rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase text-sm"
                      >
                        <Video className="w-4 h-4" />
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past Meetings */}
      {pastMeetings.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-black text-lg text-ink uppercase flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-matcha" strokeWidth={2.5} />
            Past Meetings
          </h3>

          <div className="space-y-3">
            {pastMeetings.slice(0, 5).map((meeting) => {
              const typeConfig = getMeetingTypeConfig(meeting.type);
              const meetingDate = new Date(meeting.scheduledAt);

              return (
                <div
                  key={meeting.id}
                  className="bg-white rounded-xl border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] p-4"
                >
                  <div className="flex items-center gap-3">
                    <Icon icon={typeConfig.icon} className="w-5 h-5 text-ink/70 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-black text-ink">{meeting.title}</h4>
                      <p className="text-ink/70 font-bold text-sm">
                        {meetingDate.toLocaleDateString()} at{' '}
                        {meetingDate.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className="text-matcha font-bold text-sm">Completed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {meetings.length === 0 && (
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-12 text-center">
          <Calendar className="w-16 h-16 text-taro mx-auto mb-4" strokeWidth={2.5} />
          <h3 className="font-black text-xl text-ink uppercase mb-2">No Meetings Scheduled</h3>
          <p className="text-ink/70 font-bold mb-6">
            Request a meeting to discuss your project, strategy, or get a UX review
          </p>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-6 py-3 bg-taro text-white font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
          >
            Schedule First Meeting
          </button>
        </div>
      )}

      {/* Upgrade Prompt */}
      {!features.hasUxReview && !features.hasStrategyCalls && (
        <div className="bg-taro/10 border-3 border-taro rounded-xl p-6 text-center">
          <TrendingUp className="w-12 h-12 text-taro mx-auto mb-4" strokeWidth={2.5} />
          <h3 className="font-black text-xl text-ink uppercase mb-2">Unlock Strategy Sessions</h3>
          <p className="text-ink/70 font-bold mb-4">
            Upgrade to Signature Blend or Taro Cloud to get monthly UX reviews and strategy calls
            with your dedicated team.
          </p>
          <a
            href="/billing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-taro text-white font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
          >
            Upgrade Plan
            <Icon icon="ph:arrow-right-duotone" className="w-5 h-5" />
          </a>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b-4 border-ink p-6 flex items-center justify-between z-10">
              <h3 className="font-black text-2xl text-ink uppercase">Request Meeting</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-10 h-10 rounded-full border-3 border-ink hover:bg-cream transition-colors"
              >
                <X className="w-5 h-5 mx-auto" />
              </button>
            </div>

            <form onSubmit={handleScheduleMeeting} className="p-6 space-y-4">
              <div>
                <label className="block font-black text-sm text-ink uppercase mb-2">
                  Meeting Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Meeting['type'])}
                  className="w-full px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
                >
                  <option value="GENERAL">General Discussion</option>
                  <option value="PROJECT_REVIEW">Project Review</option>
                  {features.hasUxReview && <option value="UX_REVIEW">UX Review</option>}
                  {features.hasStrategyCalls && (
                    <option value="STRATEGY_CALL">Strategy Call</option>
                  )}
                  <option value="ONBOARDING">Onboarding</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-sm text-ink uppercase mb-2">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Q1 Strategy Discussion, Homepage UX Review"
                  className="w-full px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
                />
              </div>

              <div>
                <label className="block font-black text-sm text-ink uppercase mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Add any topics or questions you'd like to discuss..."
                  className="w-full px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-sm text-ink uppercase mb-2">
                    Preferred Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
                  />
                </div>

                <div>
                  <label className="block font-black text-sm text-ink uppercase mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>

              <div className="bg-cream border-3 border-ink rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon icon="ph:info-duotone" className="w-5 h-5 text-taro flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-sm text-ink uppercase mb-1">Meeting Request</p>
                    <p className="text-ink/70 font-bold text-sm">
                      Your meeting request will be reviewed and you&apos;ll receive a confirmation
                      email with the meeting link.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
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
                      <Calendar className="w-5 h-5" />
                      Request Meeting
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
