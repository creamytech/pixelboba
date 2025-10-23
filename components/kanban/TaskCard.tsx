'use client';

import { motion } from 'framer-motion';
import { Calendar, MessageCircle, Paperclip, User, Clock, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { Task, User as UserType } from '@prisma/client';
import { Icon } from '@iconify/react';

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
    color: 'bg-matcha text-ink border-ink',
    label: 'Low',
    icon: 'ph:circle-duotone',
  },
  MEDIUM: {
    color: 'bg-thai-tea text-ink border-ink',
    label: 'Medium',
    icon: 'ph:circles-three-duotone',
  },
  HIGH: {
    color: 'bg-strawberry text-ink border-ink',
    label: 'High',
    icon: 'ph:warning-duotone',
  },
  URGENT: {
    color: 'bg-strawberry text-white border-ink',
    label: 'Urgent',
    icon: 'ph:fire-duotone',
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
        group relative bg-white rounded-xl p-4 border-4 border-ink cursor-pointer
        transition-all duration-200
        ${
          isDragging
            ? 'shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] rotate-2 scale-105 opacity-90'
            : 'shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
        }
      `}
    >
      {/* Priority Badge - Top Right */}
      <div className="absolute top-3 right-3">
        <div
          className={`
          px-3 py-1.5 rounded-full text-xs font-black border-2 uppercase flex items-center gap-1
          ${priority.color}
        `}
        >
          <Icon icon={priority.icon} className="w-3.5 h-3.5" />
          {priority.label}
        </div>
      </div>

      {/* Task Title */}
      <h3 className="font-black uppercase text-ink text-base mb-2 pr-20 line-clamp-2">
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-ink/60 mb-3 line-clamp-2 font-bold">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-taro text-white text-xs rounded-full font-black uppercase border-2 border-ink"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-1 bg-cream text-ink text-xs rounded-full font-black uppercase border-2 border-ink">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer Metadata */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t-3 border-ink/20">
        {/* Left Side - Assigned User */}
        <div className="flex items-center gap-2">
          {task.assignedTo ? (
            <>
              {task.assignedTo.image ? (
                <img
                  src={task.assignedTo.image}
                  alt={task.assignedTo.name || ''}
                  className="w-8 h-8 rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-taro to-deep-taro border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-xs text-ink/60 font-bold uppercase">
                {task.assignedTo.name?.split(' ')[0]}
              </span>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-ink/40">
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Unassigned</span>
            </div>
          )}
        </div>

        {/* Right Side - Icons & Metadata */}
        <div className="flex items-center gap-3">
          {/* Due Date */}
          {task.dueDate && (
            <div
              className={`flex items-center gap-1 ${isOverdue ? 'text-strawberry font-black' : 'text-ink/50 font-bold'}`}
            >
              {isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs uppercase">
                {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
              </span>
            </div>
          )}

          {/* Time Estimate */}
          {task.estimatedHours && (
            <div className="flex items-center gap-1 text-ink/50">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase">{task.estimatedHours}h</span>
            </div>
          )}

          {/* Comments Count */}
          {commentCount > 0 && (
            <div className="flex items-center gap-1 text-ink/50">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">{commentCount}</span>
            </div>
          )}

          {/* Attachments Count */}
          {attachmentCount > 0 && (
            <div className="flex items-center gap-1 text-ink/50">
              <Paperclip className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">{attachmentCount}</span>
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
