'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Calendar, User, Tag, AlertCircle } from 'lucide-react';

interface FilterState {
  status: string[];
  priority: string[];
  assignedTo: string[];
  tags: string[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
  overdue: boolean;
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableUsers?: Array<{ id: string; name: string }>;
  availableTags?: string[];
}

const statusOptions = [
  { value: 'BACKLOG', label: 'backlog', color: 'bg-gray-200 text-gray-700' },
  { value: 'TODO', label: 'todo', color: 'bg-blue-200 text-blue-700' },
  { value: 'IN_PROGRESS', label: 'in progress', color: 'bg-violet-200 text-violet-700' },
  { value: 'IN_REVIEW', label: 'in review', color: 'bg-yellow-200 text-yellow-700' },
  { value: 'COMPLETED', label: 'completed', color: 'bg-green-200 text-green-700' },
  { value: 'BLOCKED', label: 'blocked', color: 'bg-red-200 text-red-700' },
];

const priorityOptions = [
  { value: 'LOW', label: 'low', color: 'bg-green-100 text-green-700' },
  { value: 'MEDIUM', label: 'medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'HIGH', label: 'high', color: 'bg-orange-100 text-orange-700' },
  { value: 'URGENT', label: 'urgent', color: 'bg-red-100 text-red-700' },
];

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  availableUsers = [],
  availableTags = [],
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleStatus = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatus });
  };

  const togglePriority = (priority: string) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    onFiltersChange({ ...filters, priority: newPriority });
  };

  const toggleAssignee = (userId: string) => {
    const newAssignedTo = filters.assignedTo.includes(userId)
      ? filters.assignedTo.filter((a) => a !== userId)
      : [...filters.assignedTo, userId];
    onFiltersChange({ ...filters, assignedTo: newAssignedTo });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: [],
      priority: [],
      assignedTo: [],
      tags: [],
      dateRange: { start: null, end: null },
      overdue: false,
    });
  };

  const activeFilterCount =
    filters.status.length +
    filters.priority.length +
    filters.assignedTo.length +
    filters.tags.length +
    (filters.dateRange.start || filters.dateRange.end ? 1 : 0) +
    (filters.overdue ? 1 : 0);

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display text-sm transition-all ${
          activeFilterCount > 0
            ? 'bg-taro text-white shadow-md'
            : 'bg-white/70 text-ink hover:bg-white border border-brown-sugar/20'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Filter className="w-4 h-4" />
        <span className="lowercase">filters</span>
        {activeFilterCount > 0 && (
          <motion.span
            className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            {activeFilterCount}
          </motion.span>
        )}
      </motion.button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-96 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-brown-sugar/20 z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-brown-sugar/20">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-taro" />
                <h3 className="font-display font-semibold text-ink lowercase">advanced filters</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-ink/60" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {/* Status Filter */}
              <div>
                <label className="flex items-center gap-2 font-display text-sm font-medium text-ink/70 mb-2 lowercase">
                  <div className="w-1 h-4 bg-taro rounded-full" />
                  status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => toggleStatus(option.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-display font-medium transition-all border-2 ${
                        filters.status.includes(option.value)
                          ? option.color + ' border-current'
                          : 'bg-gray-50 text-gray-600 border-transparent hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="flex items-center gap-2 font-display text-sm font-medium text-ink/70 mb-2 lowercase">
                  <div className="w-1 h-4 bg-orange-500 rounded-full" />
                  priority
                </label>
                <div className="flex flex-wrap gap-2">
                  {priorityOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => togglePriority(option.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-display font-medium transition-all border-2 ${
                        filters.priority.includes(option.value)
                          ? option.color + ' border-current'
                          : 'bg-gray-50 text-gray-600 border-transparent hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Assignee Filter */}
              {availableUsers.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 font-display text-sm font-medium text-ink/70 mb-2 lowercase">
                    <User className="w-4 h-4 text-taro" />
                    assigned to
                  </label>
                  <div className="space-y-2">
                    {availableUsers.map((user) => (
                      <motion.button
                        key={user.id}
                        onClick={() => toggleAssignee(user.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-display transition-all border ${
                          filters.assignedTo.includes(user.id)
                            ? 'bg-taro/10 border-taro/40 text-taro font-medium'
                            : 'bg-gray-50 border-gray-200 text-ink/70 hover:border-taro/20'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {user.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags Filter */}
              {availableTags.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 font-display text-sm font-medium text-ink/70 mb-2 lowercase">
                    <Tag className="w-4 h-4 text-taro" />
                    tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <motion.button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-display font-medium transition-all border ${
                          filters.tags.includes(tag)
                            ? 'bg-brown-sugar/20 border-brown-sugar text-brown-sugar'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-brown-sugar/40'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        #{tag}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Range Filter */}
              <div>
                <label className="flex items-center gap-2 font-display text-sm font-medium text-ink/70 mb-2 lowercase">
                  <Calendar className="w-4 h-4 text-taro" />
                  due date range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={filters.dateRange.start || ''}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        dateRange: { ...filters.dateRange, start: e.target.value },
                      })
                    }
                    className="px-3 py-2 bg-white border border-brown-sugar/20 rounded-lg text-sm font-display focus:outline-none focus:ring-2 focus:ring-taro/20"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end || ''}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        dateRange: { ...filters.dateRange, end: e.target.value },
                      })
                    }
                    className="px-3 py-2 bg-white border border-brown-sugar/20 rounded-lg text-sm font-display focus:outline-none focus:ring-2 focus:ring-taro/20"
                    placeholder="End date"
                  />
                </div>
              </div>

              {/* Overdue Toggle */}
              <div>
                <motion.button
                  onClick={() => onFiltersChange({ ...filters, overdue: !filters.overdue })}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-display text-sm transition-all border ${
                    filters.overdue
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-ink/70 hover:border-red-200'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="lowercase">show overdue only</span>
                  </div>
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${
                      filters.overdue ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-sm mt-0.5"
                      animate={{ x: filters.overdue ? 18 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-brown-sugar/20 flex gap-2">
              <motion.button
                onClick={clearAllFilters}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-ink rounded-lg font-display text-sm transition-colors lowercase"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={activeFilterCount === 0}
              >
                clear all
              </motion.button>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-taro hover:bg-taro/90 text-white rounded-lg font-display text-sm transition-colors lowercase shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                apply filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
