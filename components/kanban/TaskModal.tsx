'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  User,
  Clock,
  Tag,
  Paperclip,
  MessageCircle,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Task, TaskStatus, Priority, User as UserType } from '@prisma/client';
import { format } from 'date-fns';

interface TaskModalProps {
  task:
    | (Task & {
        assignedTo?: Partial<UserType> | null;
        createdBy?: Partial<UserType>;
        project?: { id: string; name: string };
        comments?: any[];
        attachments?: any[];
      })
    | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  currentUser?: { id: string; role: string };
}

const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'BACKLOG', label: 'Backlog', color: 'bg-gray-100 text-gray-700' },
  { value: 'TODO', label: 'To Do', color: 'bg-taro/10 text-taro' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'IN_REVIEW', label: 'In Review', color: 'bg-brown-sugar/10 text-brown-sugar' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-matcha/10 text-matcha' },
  { value: 'BLOCKED', label: 'Blocked', color: 'bg-red-100 text-red-700' },
];

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'LOW', label: 'Low', color: 'bg-matcha/10 text-matcha' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-brown-sugar/10 text-brown-sugar' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-700' },
];

export default function TaskModal({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  currentUser,
}: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '');
      setEstimatedHours(task.estimatedHours?.toString() || '');
    }
  }, [task]);

  if (!task) return null;

  const handleSave = async () => {
    if (!onUpdate) return;

    setIsSaving(true);
    try {
      await onUpdate(task.id, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
      } as any);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await onDelete(task.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/tasks/${task.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        setNewComment('');
        // Refresh task data
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border-4 border-ink"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b-2 border-brown-sugar/20">
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-2xl font-bold text-ink bg-milk-tea/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-taro"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-ink">{task.title}</h2>
                    )}
                    <p className="text-sm text-ink/50 mt-1">
                      in {task.project?.name} • Created{' '}
                      {format(new Date(task.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-milk-tea rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {/* Status and Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-ink mb-2">Status</label>
                      {isEditing ? (
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as TaskStatus)}
                          className="w-full px-3 py-2 border-2 border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro"
                        >
                          {statusOptions
                            .filter((opt) => {
                              // Clients can only select TODO or BACKLOG
                              if (currentUser?.role === 'CLIENT') {
                                return opt.value === 'TODO' || opt.value === 'BACKLOG';
                              }
                              return true;
                            })
                            .map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <div
                          className={`inline-flex px-4 py-2 rounded-lg font-medium ${statusOptions.find((s) => s.value === task.status)?.color}`}
                        >
                          {statusOptions.find((s) => s.value === task.status)?.label}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-ink mb-2">Priority</label>
                      {isEditing ? (
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as Priority)}
                          className="w-full px-3 py-2 border-2 border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro"
                        >
                          {priorityOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div
                          className={`inline-flex px-4 py-2 rounded-lg font-medium ${priorityOptions.find((p) => p.value === task.priority)?.color}`}
                        >
                          {priorityOptions.find((p) => p.value === task.priority)?.label}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">Description</label>
                    {isEditing ? (
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border-2 border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro resize-none"
                        placeholder="Add a description..."
                      />
                    ) : (
                      <p className="text-ink/70 whitespace-pre-wrap">
                        {task.description || 'No description provided'}
                      </p>
                    )}
                  </div>

                  {/* Due Date and Estimate */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-ink mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Due Date
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro"
                        />
                      ) : (
                        <p className="text-ink/70">
                          {task.dueDate
                            ? format(new Date(task.dueDate), 'MMM d, yyyy')
                            : 'No due date'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-ink mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Estimated Hours
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={estimatedHours}
                          onChange={(e) => setEstimatedHours(e.target.value)}
                          step="0.5"
                          min="0"
                          className="w-full px-3 py-2 border-2 border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro"
                          placeholder="0"
                        />
                      ) : (
                        <p className="text-ink/70">
                          {task.estimatedHours ? `${task.estimatedHours} hours` : 'Not estimated'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Assigned To
                    </label>
                    {task.assignedTo ? (
                      <div className="flex items-center gap-3">
                        {task.assignedTo.image ? (
                          <img
                            src={task.assignedTo.image}
                            alt={task.assignedTo.name || ''}
                            className="w-8 h-8 rounded-full border-2 border-taro"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-taro/20 border-2 border-taro flex items-center justify-center">
                            <User className="w-4 h-4 text-taro" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-ink">{task.assignedTo.name}</p>
                          <p className="text-sm text-ink/50">{task.assignedTo.email}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-ink/50">Unassigned</p>
                    )}
                  </div>

                  {/* Comments Section */}
                  <div>
                    <label className="block text-sm font-bold text-ink mb-3 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Comments ({task.comments?.length || 0})
                    </label>

                    {/* Add Comment */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 border-2 border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro"
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="px-4 py-2 bg-taro text-white rounded-lg font-medium hover:bg-deep-taro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {task.comments && task.comments.length > 0 ? (
                        task.comments.map((comment: any) => (
                          <div key={comment.id} className="bg-milk-tea/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              {comment.author.image ? (
                                <img
                                  src={comment.author.image}
                                  alt={comment.author.name}
                                  className="w-6 h-6 rounded-full"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-taro/20 flex items-center justify-center">
                                  <User className="w-3 h-3 text-taro" />
                                </div>
                              )}
                              <span className="font-medium text-sm text-ink">
                                {comment.author.name}
                              </span>
                              <span className="text-xs text-ink/40">
                                {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <p className="text-ink/80 text-sm">{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-ink/40 text-sm text-center py-8">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t-2 border-brown-sugar/20 bg-milk-tea/20">
                  <div className="flex gap-2">
                    {currentUser?.role !== 'CLIENT' && (
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border-2 border-brown-sugar/20 text-ink rounded-lg font-medium hover:bg-milk-tea transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-6 py-2 bg-taro text-white rounded-lg font-medium hover:bg-deep-taro transition-colors disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-taro text-white rounded-lg font-medium hover:bg-deep-taro transition-colors"
                      >
                        Edit Task
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
