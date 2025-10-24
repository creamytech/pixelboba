'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  Users,
  UserPlus,
  Mail,
  Crown,
  Shield,
  X,
  Loader2,
  Trash2,
  Clock,
  Check,
  RotateCcw,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  lastActiveAt: string | null;
  isOnline: boolean;
  isOwner: boolean;
}

interface CurrentUserInfo {
  id: string;
  isOwner: boolean;
}

interface TeamInvite {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;
}

interface Manager {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
}

interface TeamManagementProps {
  onUpgrade?: () => void;
}

export default function TeamManagement({ onUpgrade }: TeamManagementProps = {}) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [manager, setManager] = useState<Manager | null>(null);
  const [maxSeats, setMaxSeats] = useState(1);
  const [currentSeats, setCurrentSeats] = useState(1);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('TEAM_MEMBER');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const [membersRes, invitesRes] = await Promise.all([
        fetch('/api/portal/team/members'),
        fetch('/api/portal/team/invite'),
      ]);

      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members);
        setMaxSeats(data.maxSeats);
        setCurrentSeats(data.currentSeats);
        setManager(data.manager);
        setIsOwner(data.isCurrentUserOwner ?? false);
      }

      if (invitesRes.ok) {
        const data = await invitesRes.json();
        setInvites(data.invites);
      }
    } catch (err) {
      console.error('Error fetching team data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/portal/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      setSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setShowInviteModal(false);
      fetchTeamData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/portal/team/members?memberId=${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove member');
      }

      setSuccess('Team member removed successfully');
      fetchTeamData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendInvite = async (inviteEmail: string, inviteRole: string) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/portal/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend invitation');
      }

      setSuccess(`Invitation resent to ${inviteEmail}`);
      fetchTeamData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend invitation');
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'OWNER') return <Crown className="w-4 h-4 text-taro" strokeWidth={2.5} />;
    if (role === 'TEAM_ADMIN')
      return <Shield className="w-4 h-4 text-thai-tea" strokeWidth={2.5} />;
    return <Users className="w-4 h-4 text-ink/70" strokeWidth={2.5} />;
  };

  const getRoleLabel = (role: string) => {
    if (role === 'OWNER') return 'Owner';
    if (role === 'TEAM_ADMIN') return 'Admin';
    return 'Member';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-taro animate-spin" />
      </div>
    );
  }

  const canInvite = isOwner && currentSeats < maxSeats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-2xl text-ink uppercase mb-2">Team Management</h2>
          <p className="text-ink/70 font-bold">
            {currentSeats} of {maxSeats} seat{maxSeats !== 1 ? 's' : ''} used
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          disabled={!canInvite || actionLoading}
          title={
            !isOwner
              ? 'Only the account owner can invite members'
              : currentSeats >= maxSeats
                ? 'Upgrade to add more team members'
                : 'Invite a new team member'
          }
          className="px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus className="w-5 h-5" strokeWidth={2.5} />
          Invite Member
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
          <Check className="w-5 h-5 text-matcha flex-shrink-0 mt-0.5" />
          <p className="text-ink font-bold flex-1">{success}</p>
          <button onClick={() => setSuccess(null)} className="text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Dedicated Manager Card (Taro Cloud only) */}
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
                <Icon icon="ph:user-circle-duotone" className="w-10 h-10 text-taro" />
              )}
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="ph:star-duotone" className="w-5 h-5" />
                <span className="font-black text-xs uppercase">Dedicated Manager</span>
              </div>
              <h3 className="font-black text-xl mb-1">{manager.name || 'Your Manager'}</h3>
              <p className="text-white/90 font-bold mb-2">{manager.email}</p>
              {manager.phone && <p className="text-white/90 font-bold text-sm">{manager.phone}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
        <div className="border-b-4 border-ink p-6">
          <h3 className="font-black text-xl text-ink uppercase flex items-center gap-2">
            <Users className="w-6 h-6" strokeWidth={2.5} />
            Team Members
          </h3>
        </div>

        <div className="divide-y-3 divide-ink">
          {members.map((member) => (
            <div key={member.id} className="p-6 flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-cream rounded-full border-3 border-ink flex items-center justify-center">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name || member.email}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Icon icon="ph:user-duotone" className="w-6 h-6 text-taro" />
                  )}
                </div>
                {member.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-matcha rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-ink">{member.name || member.email}</h4>
                  {getRoleIcon(member.isOwner ? 'OWNER' : member.role)}
                  <span className="font-bold text-xs text-ink/70 uppercase">
                    {getRoleLabel(member.isOwner ? 'OWNER' : member.role)}
                  </span>
                </div>
                <p className="text-ink/70 font-bold text-sm">{member.email}</p>
                {member.lastActiveAt && (
                  <p className="text-ink/50 font-bold text-xs mt-1">
                    Last active: {new Date(member.lastActiveAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {!member.isOwner && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-strawberry/10 text-strawberry font-black rounded-full border-2 border-strawberry hover:bg-strawberry hover:text-white transition-all uppercase text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invitations */}
      {invites.length > 0 && (
        <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
          <div className="border-b-4 border-ink p-6">
            <h3 className="font-black text-xl text-ink uppercase flex items-center gap-2">
              <Mail className="w-6 h-6" strokeWidth={2.5} />
              Pending Invitations
            </h3>
          </div>

          <div className="divide-y-3 divide-ink">
            {invites.map((invite) => (
              <div key={invite.id} className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-thai-tea/20 rounded-full border-3 border-thai-tea flex items-center justify-center">
                  <Mail className="w-6 h-6 text-thai-tea" strokeWidth={2.5} />
                </div>

                <div className="flex-1">
                  <h4 className="font-black text-ink mb-1">{invite.email}</h4>
                  <div className="flex items-center gap-3 text-sm mb-2">
                    <span className="font-bold text-ink/70">{getRoleLabel(invite.role)}</span>
                    <span className="text-ink/50">•</span>
                    <div className="flex items-center gap-1 text-ink/70 font-bold">
                      <Clock className="w-4 h-4" />
                      Expires {new Date(invite.expiresAt).toLocaleDateString()}
                    </div>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => handleResendInvite(invite.email, invite.role)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-taro/10 text-taro font-black rounded-lg border-2 border-taro hover:bg-taro hover:text-white transition-all uppercase text-xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Resend Email
                    </button>
                  )}
                </div>

                <span className="px-3 py-1.5 bg-thai-tea/10 text-thai-tea font-black text-xs rounded-full border-2 border-thai-tea uppercase">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Non-Owner Message */}
      {!isOwner && (
        <div className="bg-thai-tea/10 border-3 border-thai-tea rounded-xl p-6 text-center">
          <Icon icon="ph:shield-check-duotone" className="w-12 h-12 text-thai-tea mx-auto mb-4" />
          <h3 className="font-black text-xl text-ink uppercase mb-2">Team Member Access</h3>
          <p className="text-ink/70 font-bold">
            Only the account owner can invite new team members. Contact your organization owner if
            you need to add someone to the team.
          </p>
        </div>
      )}

      {/* Upgrade Prompt */}
      {isOwner && !canInvite && maxSeats < 5 && (
        <div className="bg-taro/10 border-3 border-taro rounded-xl p-6 text-center">
          <Icon icon="ph:arrow-up-duotone" className="w-12 h-12 text-taro mx-auto mb-4" />
          <h3 className="font-black text-xl text-ink uppercase mb-2">Need More Team Members?</h3>
          <p className="text-ink/70 font-bold mb-4">
            {maxSeats === 1
              ? 'Upgrade to Signature Blend (3 users) or Taro Cloud (5 users) to add team members.'
              : 'Upgrade to Taro Cloud to get up to 5 team members.'}
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

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] max-w-md w-full"
          >
            <div className="border-b-4 border-ink p-6 flex items-center justify-between">
              <h3 className="font-black text-2xl text-ink uppercase">Invite Team Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-10 h-10 rounded-full border-3 border-ink hover:bg-cream transition-colors"
              >
                <X className="w-5 h-5 mx-auto" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="block font-black text-sm text-ink uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  placeholder="teammate@example.com"
                  className="w-full px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
                />
              </div>

              <div>
                <label className="block font-black text-sm text-ink uppercase mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-3 focus:ring-taro"
                >
                  <option value="TEAM_MEMBER">Team Member</option>
                  <option value="TEAM_ADMIN">Team Admin</option>
                </select>
                <p className="text-ink/70 font-bold text-xs mt-2">
                  Team members will have access to view projects and communicate with the team
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-6 py-3 bg-white text-ink font-black rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Invite
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
