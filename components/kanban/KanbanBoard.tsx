'use client';

import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { Task, TaskStatus, User as UserType } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';

interface KanbanBoardProps {
  projectId: string;
  tasks: (Task & {
    assignedTo?: Partial<UserType> | null;
    project?: { id: string; name: string };
    comments?: any[];
    attachments?: any[];
  })[];
  onTaskMove?: (taskId: string, newStatus: TaskStatus, newOrder: number) => Promise<void>;
  onTaskClick?: (task: Task) => void;
  onAddTask?: (status: TaskStatus) => void;
}

const columns: { id: TaskStatus; title: string; icon: string }[] = [
  { id: 'BACKLOG', title: 'Backlog', icon: '🧊' },
  { id: 'TODO', title: 'To Do', icon: '📝' },
  { id: 'IN_PROGRESS', title: 'In Progress', icon: '🚀' },
  { id: 'IN_REVIEW', title: 'In Review', icon: '👀' },
  { id: 'COMPLETED', title: 'Completed', icon: '✓' },
  { id: 'BLOCKED', title: 'Blocked', icon: '🚫' },
];

export default function KanbanBoard({
  projectId,
  tasks: initialTasks,
  onTaskMove,
  onTaskClick,
  onAddTask,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    })
  );

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, typeof tasks> = {
      BACKLOG: [],
      TODO: [],
      IN_PROGRESS: [],
      IN_REVIEW: [],
      COMPLETED: [],
      BLOCKED: [],
    };

    tasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    // Sort by order within each status
    Object.keys(grouped).forEach((status) => {
      grouped[status as TaskStatus].sort((a, b) => a.order - b.order);
    });

    return grouped;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Determine the target status
    let targetStatus: TaskStatus;

    // Check if we're over a column
    if (columns.find((col) => col.id === overId)) {
      targetStatus = overId as TaskStatus;
    } else {
      // We're over another task, get its status
      const targetTask = tasks.find((t) => t.id === overId);
      if (!targetTask) return;
      targetStatus = targetTask.status;
    }

    // If status hasn't changed, don't update
    if (activeTask.status === targetStatus) return;

    // Optimistically update the UI
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => {
        if (task.id === activeId) {
          return { ...task, status: targetStatus };
        }
        return task;
      });
      return updatedTasks;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    let targetStatus: TaskStatus = activeTask.status;
    let targetIndex = 0;

    // Determine target status and position
    if (columns.find((col) => col.id === overId)) {
      // Dropped on a column
      targetStatus = overId as TaskStatus;
      targetIndex = tasksByStatus[targetStatus].length;
    } else {
      // Dropped on a task
      const targetTask = tasks.find((t) => t.id === overId);
      if (targetTask) {
        targetStatus = targetTask.status;
        targetIndex = tasksByStatus[targetStatus].findIndex((t) => t.id === overId);
      }
    }

    // Get the current column tasks
    const columnTasks = tasksByStatus[targetStatus];
    const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
    const newIndex = targetIndex;

    // If dropped in the same position, do nothing
    if (oldIndex === newIndex && activeTask.status === targetStatus) {
      return;
    }

    // Reorder tasks within the column
    const reorderedTasks = arrayMove(
      columnTasks,
      oldIndex === -1 ? columnTasks.length : oldIndex,
      newIndex
    );

    // Update local state with new order
    setTasks((prevTasks) => {
      const otherTasks = prevTasks.filter((t) => t.status !== targetStatus || t.id === activeId);
      const updatedColumnTasks = reorderedTasks.map((task, index) => ({
        ...task,
        status: targetStatus,
        order: index,
      }));

      return [...otherTasks, ...updatedColumnTasks].sort((a, b) => {
        if (a.status !== b.status) return 0;
        return a.order - b.order;
      });
    });

    // Call the onTaskMove callback
    if (onTaskMove) {
      await onTaskMove(activeId, targetStatus, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 px-1">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            icon={column.icon}
            color={column.id}
            tasks={tasksByStatus[column.id]}
            onAddTask={() => onAddTask?.(column.id)}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 scale-105">
            <TaskCard task={activeTask} isDragging={true} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
