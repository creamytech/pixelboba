'use client';

import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal } from 'lucide-react';
import TaskCard from './TaskCard';
import SortableTaskCard from './SortableTaskCard';
import { Task, TaskStatus, User as UserType } from '@prisma/client';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: (Task & {
    assignedTo?: Partial<UserType> | null;
    project?: { id: string; name: string };
    comments?: any[];
    attachments?: any[];
  })[];
  onAddTask?: () => void;
  onTaskClick?: (task: Task) => void;
  color: string;
  icon: string;
}

const statusConfig: Record<TaskStatus, { gradient: string; bg: string; text: string }> = {
  BACKLOG: {
    gradient: 'from-gray-100 to-gray-50',
    bg: 'bg-gray-100/50',
    text: 'text-gray-700',
  },
  TODO: {
    gradient: 'from-taro/10 to-taro/5',
    bg: 'bg-taro/10',
    text: 'text-taro',
  },
  IN_PROGRESS: {
    gradient: 'from-blue-100 to-blue-50',
    bg: 'bg-blue-100/50',
    text: 'text-blue-700',
  },
  IN_REVIEW: {
    gradient: 'from-brown-sugar/10 to-brown-sugar/5',
    bg: 'bg-brown-sugar/10',
    text: 'text-brown-sugar',
  },
  COMPLETED: {
    gradient: 'from-matcha/10 to-matcha/5',
    bg: 'bg-matcha/10',
    text: 'text-matcha',
  },
  BLOCKED: {
    gradient: 'from-red-100 to-red-50',
    bg: 'bg-red-100/50',
    text: 'text-red-700',
  },
};

export default function KanbanColumn({
  id,
  title,
  tasks,
  onAddTask,
  onTaskClick,
  color,
  icon,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const config = statusConfig[id];
  const taskIds = tasks.map((task) => task.id);

  return (
    <div className="flex-shrink-0 w-80">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col h-full"
      >
        {/* Column Header */}
        <div
          className={`
          rounded-t-2xl p-4 border-2 border-b-0 border-brown-sugar/20
          bg-gradient-to-b ${config.gradient}
          transition-colors duration-200
        `}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <h3 className={`font-bold text-lg ${config.text}`}>{title}</h3>
              <span
                className={`
                px-2.5 py-0.5 rounded-full text-xs font-bold
                ${config.bg} ${config.text}
              `}
              >
                {tasks.length}
              </span>
            </div>

            <button
              className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Column options menu
              }}
            >
              <MoreHorizontal className="w-4 h-4 text-ink/40" />
            </button>
          </div>

          {/* Add Task Button */}
          <button
            onClick={onAddTask}
            className={`
              w-full flex items-center justify-center gap-2 py-2 px-3
              rounded-lg border-2 border-dashed transition-all
              ${config.bg} ${config.text} border-current/30
              hover:border-current/50 hover:bg-white/30
              font-medium text-sm
            `}
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {/* Column Body - Droppable Area */}
        <div
          ref={setNodeRef}
          className={`
            flex-1 p-3 space-y-3 rounded-b-2xl border-2 border-brown-sugar/20
            bg-gradient-to-b from-milk-tea/30 to-white
            transition-all duration-200 overflow-y-auto
            ${isOver ? 'border-taro border-dashed bg-taro/5 ring-4 ring-taro/10' : ''}
          `}
          style={{
            minHeight: '400px',
            maxHeight: 'calc(100vh - 300px)',
          }}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl mb-3 opacity-20">🧋</div>
                <p className="text-ink/40 text-sm font-medium">No tasks yet</p>
                <p className="text-ink/30 text-xs mt-1">Drag a task here or create a new one</p>
              </div>
            ) : (
              tasks.map((task) => (
                <SortableTaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
              ))
            )}
          </SortableContext>

          {/* Floating Boba Pearls at bottom */}
          {isOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center gap-2 py-4"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-taro/40"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
