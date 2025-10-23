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
  { value: 'BACKLOG', label: 'Backlog', color: 'bg-cream text-ink border-2 border-ink' },
  { value: 'TODO', label: 'To Do', color: 'bg-taro text-white border-2 border-ink' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-thai-tea text-ink border-2 border-ink' },
  { value: 'IN_REVIEW', label: 'In Review', color: 'bg-milk-tea text-ink border-2 border-ink' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-matcha text-ink border-2 border-ink' },
  { value: 'BLOCKED', label: 'Blocked', color: 'bg-strawberry text-white border-2 border-ink' },
];

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'LOW', label: 'Low', color: 'bg-matcha text-ink border-2 border-ink' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-thai-tea text-ink border-2 border-ink' },
  { value: 'HIGH', label: 'High', color: 'bg-strawberry text-ink border-2 border-ink' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-strawberry text-white border-2 border-ink' },
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
            className="fixed inset-0 bg-ink/40 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl bg-white rounded-xl shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] border-4 border-ink"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b-4 border-ink">
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-2xl font-black uppercase text-ink bg-white rounded-lg px-4 py-3 border-3 border-ink focus:outline-none focus:ring-4 focus:ring-taro/20"
                      />
                    ) : (
                      <h2 className="text-2xl font-black uppercase text-ink">{task.title}</h2>
                    )}
                    <p className="text-sm text-ink/50 mt-1 font-bold uppercase">
                      in {task.project?.name} • Created{' '}
                      {format(new Date(task.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 bg-white hover:bg-cream rounded-lg border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {/* Status and Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black uppercase text-ink mb-2">
                        Status
                      </label>
                      {isEditing ? (
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as TaskStatus)}
                          className="w-full px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20"
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
                          className={`inline-flex px-3 py-1.5 rounded-full font-black text-xs uppercase ${statusOptions.find((s) => s.value === task.status)?.color}`}
                        >
                          {statusOptions.find((s) => s.value === task.status)?.label}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-black uppercase text-ink mb-2">
                        Priority
                      </label>
                      {isEditing ? (
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as Priority)}
                          className="w-full px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20"
                        >
                          {priorityOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div
                          className={`inline-flex px-3 py-1.5 rounded-full font-black text-xs uppercase ${priorityOptions.find((p) => p.value === task.priority)?.color}`}
                        >
                          {priorityOptions.find((p) => p.value === task.priority)?.label}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-black uppercase text-ink mb-2">
                      Description
                    </label>
                    {isEditing ? (
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20 resize-none"
                        placeholder="Add a description..."
                      />
                    ) : (
                      <p className="text-ink/70 whitespace-pre-wrap font-bold">
                        {task.description || 'No description provided'}
                      </p>
                    )}
                  </div>

                  {/* Due Date and Estimate */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black uppercase text-ink mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Due Date
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="w-full px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20"
                        />
                      ) : (
                        <p className="text-ink/70 font-bold">
                          {task.dueDate
                            ? format(new Date(task.dueDate), 'MMM d, yyyy')
                            : 'No due date'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-black uppercase text-ink mb-2 flex items-center gap-2">
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
                          className="w-full px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20"
                          placeholder="0"
                        />
                      ) : (
                        <p className="text-ink/70 font-bold">
                          {task.estimatedHours ? `${task.estimatedHours} hours` : 'Not estimated'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label className="block text-sm font-black uppercase text-ink mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Assigned To
                    </label>
                    {task.assignedTo ? (
                      <div className="flex items-center gap-3">
                        {task.assignedTo.image ? (
                          <img
                            src={task.assignedTo.image}
                            alt={task.assignedTo.name || ''}
                            className="w-12 h-12 rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-black uppercase text-ink">{task.assignedTo.name}</p>
                          <p className="text-sm text-ink/50 font-bold">{task.assignedTo.email}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-ink/50 font-bold uppercase">Unassigned</p>
                    )}
                  </div>

                  {/* Comments Section */}
                  <div>
                    <label className="block text-sm font-black uppercase text-ink mb-3 flex items-center gap-2">
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
                        className="flex-1 px-4 py-3 bg-white rounded-lg border-3 border-ink font-bold focus:outline-none focus:ring-4 focus:ring-taro/20"
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="px-6 py-3 bg-matcha text-ink rounded-full font-black uppercase border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {task.comments && task.comments.length > 0 ? (
                        task.comments.map((comment: any) => (
                          <div
                            key={comment.id}
                            className="bg-cream rounded-lg p-3 border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {comment.author.image ? (
                                <img
                                  src={comment.author.image}
                                  alt={comment.author.name}
                                  className="w-8 h-8 rounded-full border-2 border-ink"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-taro to-deep-taro border-2 border-ink flex items-center justify-center">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                              )}
                              <span className="font-black text-sm text-ink uppercase">
                                {comment.author.name}
                              </span>
                              <span className="text-xs text-ink/40 font-bold uppercase">
                                {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <p className="text-ink/80 text-sm font-bold">{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-ink/40 text-sm text-center py-8 font-bold uppercase">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t-4 border-ink bg-cream/30">
                  <div className="flex gap-2">
                    {currentUser?.role !== 'CLIENT' && (
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-strawberry font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all"
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
                          className="px-6 py-3 bg-white text-ink font-black rounded-full border-3 border-ink uppercase shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-matcha text-ink font-black rounded-full border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] uppercase transition-all"
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
