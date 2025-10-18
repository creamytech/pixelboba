'use client';

import { motion } from 'framer-motion';
import { Calendar, MessageCircle, Paperclip, User, Clock, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { Task, User as UserType } from '@prisma/client';

interface TaskCardProps {
  task: Task & {
    assignedTo?: Partial<UserType> | null;
    project?: { id: string; name: string };
    comments?: any[];
    attachments?: any[];
  };
  onClick?: () => void;
  isDragging?: boolean;
}

const priorityConfig = {
  LOW: {
    color: 'bg-matcha/10 text-matcha border-matcha/20',
    label: 'Low',
    icon: '●',
  },
  MEDIUM: {
    color: 'bg-brown-sugar/10 text-brown-sugar border-brown-sugar/20',
    label: 'Medium',
    icon: '●●',
  },
  HIGH: {
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    label: 'High',
    icon: '●●●',
  },
  URGENT: {
    color: 'bg-red-100 text-red-700 border-red-200',
    label: 'Urgent',
    icon: '🔥',
  },
};

export default function TaskCard({ task, onClick, isDragging = false }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'COMPLETED';
  const commentCount = task.comments?.length || 0;
  const attachmentCount = task.attachments?.length || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: isDragging ? 1 : 1.02, y: isDragging ? 0 : -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        group relative bg-white rounded-xl p-4 border-2 cursor-pointer
        transition-all duration-200
        ${
          isDragging
            ? 'border-taro shadow-2xl rotate-2 scale-105 opacity-90'
            : 'border-brown-sugar/20 hover:border-taro/40 hover:shadow-lg'
        }
      `}
    >
      {/* Priority Badge - Top Right */}
      <div className="absolute top-3 right-3">
        <div
          className={`
          px-2 py-1 rounded-full text-xs font-bold border
          ${priority.color}
        `}
        >
          <span className="mr-1">{priority.icon}</span>
          {priority.label}
        </div>
      </div>

      {/* Task Title */}
      <h3 className="font-bold text-ink text-base mb-2 pr-20 line-clamp-2">{task.title}</h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-ink/60 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-taro/10 text-taro text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-ink/5 text-ink/50 text-xs rounded-full font-medium">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer Metadata */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-brown-sugar/10">
        {/* Left Side - Assigned User */}
        <div className="flex items-center gap-2">
          {task.assignedTo ? (
            <>
              {task.assignedTo.image ? (
                <img
                  src={task.assignedTo.image}
                  alt={task.assignedTo.name || ''}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-taro/20 border-2 border-white shadow-sm flex items-center justify-center">
                  <User className="w-3 h-3 text-taro" />
                </div>
              )}
              <span className="text-xs text-ink/60 font-medium">
                {task.assignedTo.name?.split(' ')[0]}
              </span>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-ink/40">
              <User className="w-4 h-4" />
              <span className="text-xs">Unassigned</span>
            </div>
          )}
        </div>

        {/* Right Side - Icons & Metadata */}
        <div className="flex items-center gap-3">
          {/* Due Date */}
          {task.dueDate && (
            <div
              className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-ink/50'}`}
            >
              {isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
              </span>
            </div>
          )}

          {/* Time Estimate */}
          {task.estimatedHours && (
            <div className="flex items-center gap-1 text-ink/50">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{task.estimatedHours}h</span>
            </div>
          )}

          {/* Comments Count */}
          {commentCount > 0 && (
            <div className="flex items-center gap-1 text-ink/50">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{commentCount}</span>
            </div>
          )}

          {/* Attachments Count */}
          {attachmentCount > 0 && (
            <div className="flex items-center gap-1 text-ink/50">
              <Paperclip className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Boba Pearl Accent - shows on hover */}
      <motion.div
        className="absolute -bottom-1 -right-1 w-4 h-4 bg-taro rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
