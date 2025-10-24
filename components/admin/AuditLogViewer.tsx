'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  User,
  Upload,
  MessageCircle,
  CreditCard,
  FileText,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  Calendar,
  Search,
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  };
}

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<any>({});
  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
    userId: '',
    startDate: '',
    endDate: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const limit = 50;

  useEffect(() => {
    fetchLogs();
  }, [filters, page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (page * limit).toString(),
        ...(filters.action && { action: filters.action }),
        ...(filters.entityType && { entityType: filters.entityType }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
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
        return <Trash2 className="w-4 h-4" />;
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
    const logDate = new Date(date);
    const diffMs = now.getTime() - logDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return logDate.toLocaleString();
  };

  const exportToCSV = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'IP Address'],
      ...logs.map((log) => [
        new Date(log.createdAt).toLocaleString(),
        log.user.email,
        log.action,
        log.entityType,
        log.entityId,
        log.ipAddress || 'N/A',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase text-ink flex items-center gap-3">
            <Activity className="w-8 h-8" />
            Audit Log Viewer
          </h2>
          <p className="text-ink/60 font-bold mt-1">{total.toLocaleString()} total log entries</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white border-3 border-ink rounded-lg font-black text-sm uppercase hover:bg-cream transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-matcha text-white border-3 border-ink rounded-lg font-black text-sm uppercase hover:bg-green-600 transition-colors flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(58,0,29,1)]"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats.actions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-taro/20 to-deep-taro/20 rounded-xl border-3 border-ink p-4">
            <h3 className="font-black text-sm uppercase text-ink mb-2">Top Actions</h3>
            <div className="space-y-1">
              {stats.actions.slice(0, 3).map((stat: any) => (
                <div key={stat.action} className="flex justify-between text-sm">
                  <span className="font-bold text-ink">{stat.action}</span>
                  <span className="font-black text-taro">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-thai-tea/20 to-strawberry/20 rounded-xl border-3 border-ink p-4">
            <h3 className="font-black text-sm uppercase text-ink mb-2">Entity Types</h3>
            <div className="space-y-1">
              {stats.entities.slice(0, 3).map((stat: any) => (
                <div key={stat.entityType} className="flex justify-between text-sm">
                  <span className="font-bold text-ink">{stat.entityType}</span>
                  <span className="font-black text-thai-tea">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-matcha/20 to-green-600/20 rounded-xl border-3 border-ink p-4">
            <h3 className="font-black text-sm uppercase text-ink mb-2">Total Logs</h3>
            <div className="text-3xl font-black text-matcha">{total.toLocaleString()}</div>
            <p className="text-xs font-bold text-ink/60 mt-1">
              Page {page + 1} of {Math.ceil(total / limit)}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl border-3 border-ink p-6"
        >
          <h3 className="font-black text-sm uppercase text-ink mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-ink/70 mb-2">
                Action Type
              </label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="w-full px-3 py-2 border-2 border-ink rounded-lg font-bold"
              >
                <option value="">All Actions</option>
                {stats.actions?.map((stat: any) => (
                  <option key={stat.action} value={stat.action}>
                    {stat.action} ({stat.count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-ink/70 mb-2">
                Entity Type
              </label>
              <select
                value={filters.entityType}
                onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
                className="w-full px-3 py-2 border-2 border-ink rounded-lg font-bold"
              >
                <option value="">All Entities</option>
                {stats.entities?.map((stat: any) => (
                  <option key={stat.entityType} value={stat.entityType}>
                    {stat.entityType} ({stat.count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-ink/70 mb-2">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="flex-1 px-3 py-2 border-2 border-ink rounded-lg font-bold text-sm"
                />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="flex-1 px-3 py-2 border-2 border-ink rounded-lg font-bold text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                setFilters({ action: '', entityType: '', userId: '', startDate: '', endDate: '' });
                setPage(0);
              }}
              className="px-4 py-2 bg-cream border-2 border-ink rounded-lg font-black text-sm uppercase hover:bg-brown-sugar/20 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-3 border-ink rounded-lg font-bold focus:outline-none focus:ring-4 focus:ring-taro/20"
        />
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-taro border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-bold text-ink/50">Loading audit logs...</p>
        </div>
      ) : filteredLogs.length > 0 ? (
        <div className="bg-white rounded-xl border-3 border-ink overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-cream sticky top-0 z-10">
                <tr className="border-b-3 border-ink">
                  <th className="px-4 py-3 text-left font-black text-xs uppercase text-ink">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left font-black text-xs uppercase text-ink">
                    User
                  </th>
                  <th className="px-4 py-3 text-left font-black text-xs uppercase text-ink">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left font-black text-xs uppercase text-ink">
                    Entity
                  </th>
                  <th className="px-4 py-3 text-left font-black text-xs uppercase text-ink">
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-left font-black text-xs uppercase text-ink">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={`border-b border-ink/10 hover:bg-cream/30 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-cream/10'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-bold text-ink/70 whitespace-nowrap">
                      {formatTimestamp(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {log.user.image ? (
                          <img
                            src={log.user.image}
                            alt={log.user.name || ''}
                            className="w-6 h-6 rounded-full border-2 border-ink"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gradient-to-br from-taro to-deep-taro rounded-full border-2 border-ink flex items-center justify-center">
                            <span className="text-white text-xs font-black">
                              {log.user.email[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-black text-ink truncate">
                            {log.user.name || log.user.email}
                          </p>
                          <p className="text-xs font-bold text-ink/50 uppercase">{log.user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center bg-gradient-to-br ${getActionColor(log.action)}`}
                        >
                          <div className="text-white">{getActionIcon(log.action)}</div>
                        </div>
                        <span className="text-sm font-black text-ink uppercase">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-ink">{log.entityType}</p>
                        <p className="text-xs font-bold text-ink/40 font-mono">
                          {log.entityId.substring(0, 8)}...
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-ink/70">
                      {log.ipAddress || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {log.changes && (
                        <details className="group">
                          <summary className="cursor-pointer text-taro hover:text-deep-taro font-black uppercase text-xs">
                            View
                          </summary>
                          <div className="mt-2 p-2 bg-ink/5 rounded border border-ink/10 max-w-xs">
                            <pre className="text-xs overflow-auto">
                              {JSON.stringify(log.changes, null, 2)}
                            </pre>
                          </div>
                        </details>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t-3 border-ink bg-cream px-6 py-4 flex items-center justify-between">
            <div className="text-sm font-bold text-ink/60">
              Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-white border-2 border-ink rounded-lg font-black text-sm uppercase hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={(page + 1) * limit >= total}
                className="px-4 py-2 bg-white border-2 border-ink rounded-lg font-black text-sm uppercase hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-3 border-ink p-12 text-center">
          <Activity className="w-16 h-16 mx-auto mb-4 text-ink/20" />
          <p className="font-bold text-ink/50">No audit logs found</p>
          <p className="text-sm text-ink/40 mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
