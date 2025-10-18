'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, Priority, User as UserType } from '@prisma/client';
import KanbanBoard from './KanbanBoard';
import TaskModal from './TaskModal';
import TimelineView from './TimelineView';
import ListView from './ListView';
import GanttView from './GanttView';
import AnalyticsDashboard from './AnalyticsDashboard';
import AdvancedFilters from './AdvancedFilters';
import BulkOperations from './BulkOperations';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import PresenceIndicator from '@/components/realtime/PresenceIndicator';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useRealtime } from '@/hooks/useRealtime';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  LayoutGrid,
  Calendar as CalendarIcon,
  Keyboard,
  List as ListIcon,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

interface ProjectTaskBoardProps {
  projectId: string;
  projectName: string;
  currentUser: { id: string; role: string; email: string };
}

export default function ProjectTaskBoard({
  projectId,
  projectName,
  currentUser,
}: ProjectTaskBoardProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'timeline' | 'list' | 'gantt' | 'analytics'>(
    'kanban'
  );
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Advanced filters state
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    assignedTo: [] as string[],
    tags: [] as string[],
    dateRange: { start: null as string | null, end: null as string | null },
    overdue: false,
  });

  // Real-time collaboration
  const { onlineUsers, isConnected } = useRealtime({
    projectId,
    onTaskCreated: (task) => setTasks((prev) => [...prev, task]),
    onTaskUpdated: (task) => setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t))),
    onTaskDeleted: (taskId) => setTasks((prev) => prev.filter((t) => t.id !== taskId)),
    onTaskMoved: async (data) => {
      // Refresh tasks to get updated order
      await fetchTasks();
    },
    enabled: true,
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  // Handle task move (drag and drop)
  const handleTaskMove = async (taskId: string, newStatus: TaskStatus, newOrder: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, newOrder }),
      });

      if (response.ok) {
        // Refresh tasks
        await fetchTasks();
      }
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  // Handle task update
  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
        setSelectedTask(updatedTask);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  // Handle task delete
  const handleTaskDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        setIsModalOpen(false);
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Handle task click
  const handleTaskClick = async (task: Task) => {
    try {
      // Fetch full task details including comments
      const response = await fetch(`/api/tasks/${task.id}`);
      if (response.ok) {
        const fullTask = await response.json();
        setSelectedTask(fullTask);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch task details:', error);
    }
  };

  // Handle add task
  const handleAddTask = async (status: TaskStatus) => {
    const title = prompt('Enter task title:');
    if (!title) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          projectId,
          status,
          priority: 'MEDIUM',
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prev) => [...prev, newTask]);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // Bulk operations handlers
  const handleBulkMove = async (status: string) => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) =>
          fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          })
        )
      );
      await fetchTasks();
      setSelectedTasks([]);
    } catch (error) {
      console.error('Failed to bulk move tasks:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) => fetch(`/api/tasks/${taskId}`, { method: 'DELETE' }))
      );
      await fetchTasks();
      setSelectedTasks([]);
    } catch (error) {
      console.error('Failed to bulk delete tasks:', error);
    }
  };

  const handleBulkAssign = async (userId: string) => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) =>
          fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignedToId: userId }),
          })
        )
      );
      await fetchTasks();
      setSelectedTasks([]);
    } catch (error) {
      console.error('Failed to bulk assign tasks:', error);
    }
  };

  const handleBulkPriority = async (priority: string) => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) =>
          fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priority }),
          })
        )
      );
      await fetchTasks();
      setSelectedTasks([]);
    } catch (error) {
      console.error('Failed to bulk update priority:', error);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts(
    {
      onNewTask: () => handleAddTask('TODO'),
      onSearch: () => document.getElementById('task-search')?.focus(),
      onHelp: () => setShowShortcuts(true),
      onEscape: () => {
        setIsModalOpen(false);
        setSelectedTasks([]);
        setShowShortcuts(false);
      },
    },
    !isModalOpen
  );

  // Filter tasks based on search and advanced filters
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = filters.status.length === 0 || filters.status.includes(task.status);

    // Priority filter
    const matchesPriority =
      filters.priority.length === 0 || filters.priority.includes(task.priority);

    // Assignee filter
    const matchesAssignee =
      filters.assignedTo.length === 0 ||
      (task.assignedToId && filters.assignedTo.includes(task.assignedToId));

    // Tags filter
    const matchesTags =
      filters.tags.length === 0 ||
      (task.tags && filters.tags.some((tag: string) => task.tags.includes(tag)));

    // Date range filter
    const matchesDateRange =
      (!filters.dateRange.start && !filters.dateRange.end) ||
      (task.dueDate &&
        (!filters.dateRange.start || new Date(task.dueDate) >= new Date(filters.dateRange.start)) &&
        (!filters.dateRange.end || new Date(task.dueDate) <= new Date(filters.dateRange.end)));

    // Overdue filter
    const matchesOverdue =
      !filters.overdue ||
      (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED');

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesAssignee &&
      matchesTags &&
      matchesDateRange &&
      matchesOverdue
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-taro border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-ink/60 font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-2 border-brown-sugar/20 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink flex items-center gap-3">
              <span className="text-3xl">📋</span>
              {projectName} Task Board
            </h2>
            <p className="text-ink/60 mt-1">
              {tasks.length} total tasks • {tasks.filter((t) => t.status === 'COMPLETED').length}{' '}
              completed
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Presence Indicator */}
            <PresenceIndicator
              users={onlineUsers}
              isConnected={isConnected}
              currentUserId={currentUser.id}
            />

            {/* View Mode Toggle */}
            <div className="flex bg-white/70 rounded-lg p-1 border border-brown-sugar/20">
              <motion.button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded text-xs font-display font-medium transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-taro text-white shadow-sm'
                    : 'text-ink/60 hover:bg-taro/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Kanban Board"
              >
                <LayoutGrid className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded text-xs font-display font-medium transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-taro text-white shadow-sm'
                    : 'text-ink/60 hover:bg-taro/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Timeline View"
              >
                <CalendarIcon className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded text-xs font-display font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-taro text-white shadow-sm'
                    : 'text-ink/60 hover:bg-taro/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('gantt')}
                className={`px-3 py-1.5 rounded text-xs font-display font-medium transition-all ${
                  viewMode === 'gantt'
                    ? 'bg-taro text-white shadow-sm'
                    : 'text-ink/60 hover:bg-taro/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Gantt Chart"
              >
                <BarChart3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('analytics')}
                className={`px-3 py-1.5 rounded text-xs font-display font-medium transition-all ${
                  viewMode === 'analytics'
                    ? 'bg-taro text-white shadow-sm'
                    : 'text-ink/60 hover:bg-taro/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Analytics Dashboard"
              >
                <TrendingUp className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input
                id="task-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks... (⌘K)"
                className="pl-10 pr-4 py-2 border-2 border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro bg-milk-tea/30 font-display text-sm"
              />
            </div>

            {/* Advanced Filters */}
            <AdvancedFilters filters={filters} onFiltersChange={setFilters} />

            {/* Keyboard Shortcuts */}
            <motion.button
              onClick={() => setShowShortcuts(true)}
              className="p-2 bg-white/70 hover:bg-white border border-brown-sugar/20 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="w-5 h-5 text-ink/60" />
            </motion.button>

            {/* Quick Add Task */}
            <motion.button
              onClick={() => handleAddTask('TODO')}
              className="flex items-center gap-2 px-4 py-2 bg-taro text-white rounded-lg font-display font-medium hover:bg-deep-taro transition-colors shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline lowercase">new task</span>
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            {
              label: 'Backlog',
              count: tasks.filter((t) => t.status === 'BACKLOG').length,
              color: 'bg-gray-100 text-gray-700',
            },
            {
              label: 'In Progress',
              count: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
              color: 'bg-blue-100 text-blue-700',
            },
            {
              label: 'In Review',
              count: tasks.filter((t) => t.status === 'IN_REVIEW').length,
              color: 'bg-brown-sugar/10 text-brown-sugar',
            },
            {
              label: 'Completed',
              count: tasks.filter((t) => t.status === 'COMPLETED').length,
              color: 'bg-matcha/10 text-matcha',
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`${stat.color} rounded-lg p-3 text-center`}
            >
              <div className="text-2xl font-bold">{stat.count}</div>
              <div className="text-xs font-medium opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'kanban' && (
          <motion.div
            key="kanban"
            className="bg-gradient-to-b from-milk-tea/30 to-white rounded-2xl border-2 border-brown-sugar/20 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <KanbanBoard
              projectId={projectId}
              tasks={filteredTasks}
              onTaskMove={handleTaskMove}
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTask}
            />
          </motion.div>
        )}

        {viewMode === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TimelineView tasks={filteredTasks} onTaskClick={handleTaskClick} />
          </motion.div>
        )}

        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ListView tasks={filteredTasks} onTaskClick={handleTaskClick} />
          </motion.div>
        )}

        {viewMode === 'gantt' && (
          <motion.div
            key="gantt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GanttView tasks={filteredTasks} onTaskClick={handleTaskClick} />
          </motion.div>
        )}

        {viewMode === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AnalyticsDashboard tasks={tasks} projectName={projectName} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Operations */}
      <AnimatePresence>
        {selectedTasks.length > 0 && (
          <BulkOperations
            selectedTasks={selectedTasks}
            onClearSelection={() => setSelectedTasks([])}
            onBulkDelete={handleBulkDelete}
            onBulkMove={handleBulkMove}
            onBulkAssign={handleBulkAssign}
            onBulkPriority={handleBulkPriority}
          />
        )}
      </AnimatePresence>

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
        currentUser={currentUser}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
}
