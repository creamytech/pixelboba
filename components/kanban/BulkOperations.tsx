'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Trash2, User, Tag, Calendar, X } from 'lucide-react';

interface BulkOperationsProps {
  selectedTasks: string[];
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkMove: (status: string) => void;
  onBulkAssign: (userId: string) => void;
  onBulkPriority: (priority: string) => void;
  availableUsers?: Array<{ id: string; name: string }>;
}

const statusOptions = [
  { value: 'BACKLOG', label: 'backlog' },
  { value: 'TODO', label: 'todo' },
  { value: 'IN_PROGRESS', label: 'in progress' },
  { value: 'IN_REVIEW', label: 'in review' },
  { value: 'COMPLETED', label: 'completed' },
  { value: 'BLOCKED', label: 'blocked' },
];

const priorityOptions = [
  { value: 'LOW', label: 'low' },
  { value: 'MEDIUM', label: 'medium' },
  { value: 'HIGH', label: 'high' },
  { value: 'URGENT', label: 'urgent' },
];

export default function BulkOperations({
  selectedTasks,
  onClearSelection,
  onBulkDelete,
  onBulkMove,
  onBulkAssign,
  onBulkPriority,
  availableUsers = [],
}: BulkOperationsProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (selectedTasks.length === 0) return null;

  const handleBulkMove = (status: string) => {
    onBulkMove(status);
    setShowStatusMenu(false);
  };

  const handleBulkAssign = (userId: string) => {
    onBulkAssign(userId);
    setShowAssignMenu(false);
  };

  const handleBulkPriority = (priority: string) => {
    onBulkPriority(priority);
    setShowPriorityMenu(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onBulkDelete();
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-brown-sugar/20 p-4">
        <div className="flex items-center gap-4">
          {/* Selection Count */}
          <div className="flex items-center gap-2 px-4 py-2 bg-taro/10 rounded-lg">
            <CheckSquare className="w-5 h-5 text-taro" />
            <span className="font-display font-semibold text-taro">
              {selectedTasks.length} selected
            </span>
          </div>

          <div className="w-px h-8 bg-brown-sugar/20" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Move Status */}
            <div className="relative">
              <motion.button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-display text-sm transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Tag className="w-4 h-4" />
                <span className="lowercase">move to</span>
              </motion.button>

              <AnimatePresence>
                {showStatusMenu && (
                  <motion.div
                    className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-xl border border-brown-sugar/20 overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleBulkMove(option.value)}
                        className="w-full text-left px-4 py-2 hover:bg-taro/10 font-display text-sm transition-colors lowercase"
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Assign */}
            {availableUsers.length > 0 && (
              <div className="relative">
                <motion.button
                  onClick={() => setShowAssignMenu(!showAssignMenu)}
                  className="px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg font-display text-sm transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-4 h-4" />
                  <span className="lowercase">assign</span>
                </motion.button>

                <AnimatePresence>
                  {showAssignMenu && (
                    <motion.div
                      className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-xl border border-brown-sugar/20 overflow-hidden max-h-64 overflow-y-auto"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {availableUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleBulkAssign(user.id)}
                          className="w-full text-left px-4 py-2 hover:bg-taro/10 font-display text-sm transition-colors"
                        >
                          {user.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Priority */}
            <div className="relative">
              <motion.button
                onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg font-display text-sm transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar className="w-4 h-4" />
                <span className="lowercase">priority</span>
              </motion.button>

              <AnimatePresence>
                {showPriorityMenu && (
                  <motion.div
                    className="absolute bottom-full left-0 mb-2 w-40 bg-white rounded-lg shadow-xl border border-brown-sugar/20 overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleBulkPriority(option.value)}
                        className="w-full text-left px-4 py-2 hover:bg-taro/10 font-display text-sm transition-colors lowercase"
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Delete */}
            <motion.button
              onClick={handleDelete}
              className={`px-4 py-2 rounded-lg font-display text-sm transition-colors flex items-center gap-2 ${
                confirmDelete
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-red-50 hover:bg-red-100 text-red-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
              <span className="lowercase">{confirmDelete ? 'confirm?' : 'delete'}</span>
            </motion.button>
          </div>

          <div className="w-px h-8 bg-brown-sugar/20" />

          {/* Clear Selection */}
          <motion.button
            onClick={onClearSelection}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5 text-ink/60" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
