'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Shield, Check, X, Save, Loader2 } from 'lucide-react';

interface UserPermissions {
  id: string;
  userId: string;
  // Tab access
  canAccessDashboard: boolean;
  canAccessProjects: boolean;
  canAccessTasks: boolean;
  canAccessMessages: boolean;
  canAccessFiles: boolean;
  canAccessInvoices: boolean;
  canAccessContracts: boolean;
  canAccessMeetings: boolean;
  canAccessTeam: boolean;
  canAccessRequests: boolean;
  canAccessBilling: boolean;
  // Feature permissions
  canUploadFiles: boolean;
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canSendMessages: boolean;
  canInviteTeam: boolean;
  canViewAnalytics: boolean;
  canManageProjects: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

interface UserPermissionsManagerProps {
  userId: string;
  onClose?: () => void;
}

export default function UserPermissionsManager({ userId, onClose }: UserPermissionsManagerProps) {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPermissions();
  }, [userId]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}/permissions`);
      if (!response.ok) throw new Error('Failed to fetch permissions');
      const data = await response.json();
      setPermissions(data.permissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (field: keyof Omit<UserPermissions, 'id' | 'userId' | 'user'>) => {
    if (!permissions) return;
    setPermissions({
      ...permissions,
      [field]: !permissions[field],
    });
  };

  const handleSave = async () => {
    if (!permissions) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/admin/users/${userId}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permissions),
      });

      if (!response.ok) throw new Error('Failed to update permissions');

      await fetchPermissions();
      if (onClose) onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-taro" />
      </div>
    );
  }

  if (!permissions) {
    return (
      <div className="text-center p-8">
        <p className="text-ink/70 font-bold">Failed to load permissions</p>
      </div>
    );
  }

  const tabPermissions = [
    { key: 'canAccessDashboard' as const, label: 'Dashboard', icon: 'ph:house-duotone' },
    { key: 'canAccessProjects' as const, label: 'Projects', icon: 'ph:folder-duotone' },
    { key: 'canAccessTasks' as const, label: 'Tasks', icon: 'ph:check-square-duotone' },
    { key: 'canAccessMessages' as const, label: 'Messages', icon: 'ph:chat-circle-duotone' },
    { key: 'canAccessFiles' as const, label: 'Files', icon: 'ph:folder-open-duotone' },
    { key: 'canAccessInvoices' as const, label: 'Invoices', icon: 'ph:receipt-duotone' },
    { key: 'canAccessContracts' as const, label: 'Contracts', icon: 'ph:file-text-duotone' },
    { key: 'canAccessMeetings' as const, label: 'Meetings', icon: 'ph:calendar-duotone' },
    { key: 'canAccessTeam' as const, label: 'Team', icon: 'ph:users-duotone' },
    { key: 'canAccessRequests' as const, label: 'Requests', icon: 'ph:lightning-duotone' },
    { key: 'canAccessBilling' as const, label: 'Billing', icon: 'ph:credit-card-duotone' },
  ];

  const featurePermissions = [
    { key: 'canUploadFiles' as const, label: 'Upload Files', icon: 'ph:upload-duotone' },
    { key: 'canCreateTasks' as const, label: 'Create Tasks', icon: 'ph:plus-circle-duotone' },
    { key: 'canEditTasks' as const, label: 'Edit Tasks', icon: 'ph:pencil-duotone' },
    { key: 'canDeleteTasks' as const, label: 'Delete Tasks', icon: 'ph:trash-duotone' },
    { key: 'canSendMessages' as const, label: 'Send Messages', icon: 'ph:paper-plane-duotone' },
    { key: 'canInviteTeam' as const, label: 'Invite Team Members', icon: 'ph:user-plus-duotone' },
    { key: 'canViewAnalytics' as const, label: 'View Analytics', icon: 'ph:chart-line-duotone' },
    { key: 'canManageProjects' as const, label: 'Manage Projects', icon: 'ph:gear-duotone' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-taro to-deep-taro text-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full border-3 border-ink flex items-center justify-center">
            <Shield className="w-6 h-6 text-taro" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h2 className="font-black text-xl uppercase mb-1">Manage Permissions</h2>
            <p className="text-white/90 font-bold">
              {permissions.user.name || permissions.user.email} ({permissions.user.role})
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-strawberry/10 border-3 border-strawberry rounded-xl p-4 flex items-center gap-3">
          <X className="w-5 h-5 text-strawberry flex-shrink-0" />
          <p className="text-strawberry font-bold">{error}</p>
        </div>
      )}

      {/* Tab Access Permissions */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <h3 className="font-black text-lg uppercase text-ink mb-4 flex items-center gap-2">
          <Icon icon="ph:sidebar-duotone" className="w-5 h-5" />
          Tab Access
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tabPermissions.map((perm) => (
            <button
              key={perm.key}
              onClick={() => handleToggle(perm.key)}
              className={`flex items-center justify-between p-4 rounded-lg border-3 border-ink transition-all ${
                permissions[perm.key]
                  ? 'bg-matcha/20 hover:bg-matcha/30'
                  : 'bg-ink/5 hover:bg-ink/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon icon={perm.icon} className="w-5 h-5 text-ink" />
                <span className="font-black text-sm uppercase text-ink">{perm.label}</span>
              </div>
              <div
                className={`w-6 h-6 rounded border-2 border-ink flex items-center justify-center ${
                  permissions[perm.key] ? 'bg-matcha' : 'bg-white'
                }`}
              >
                {permissions[perm.key] && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Permissions */}
      <div className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] p-6">
        <h3 className="font-black text-lg uppercase text-ink mb-4 flex items-center gap-2">
          <Icon icon="ph:magic-wand-duotone" className="w-5 h-5" />
          Feature Permissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {featurePermissions.map((perm) => (
            <button
              key={perm.key}
              onClick={() => handleToggle(perm.key)}
              className={`flex items-center justify-between p-4 rounded-lg border-3 border-ink transition-all ${
                permissions[perm.key] ? 'bg-taro/20 hover:bg-taro/30' : 'bg-ink/5 hover:bg-ink/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon icon={perm.icon} className="w-5 h-5 text-ink" />
                <span className="font-black text-sm uppercase text-ink">{perm.label}</span>
              </div>
              <div
                className={`w-6 h-6 rounded border-2 border-ink flex items-center justify-center ${
                  permissions[perm.key] ? 'bg-taro' : 'bg-white'
                }`}
              >
                {permissions[perm.key] && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-matcha text-white font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" strokeWidth={2.5} />
              Save Permissions
            </>
          )}
        </button>
      </div>
    </div>
  );
}
