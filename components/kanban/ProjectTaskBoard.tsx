'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, Priority, User as UserType } from '@prisma/client';
import KanbanBoard from './KanbanBoard';
import TaskModal from './TaskModal';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, LayoutGrid, List, Calendar as CalendarIcon } from 'lucide-react';

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
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter tasks based on search
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 border-2 border-brown-sugar/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-taro bg-milk-tea/30"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                p-2 rounded-lg transition-colors
                ${showFilters ? 'bg-taro text-white' : 'bg-milk-tea/50 text-ink hover:bg-taro/10'}
              `}
            >
              <Filter className="w-5 h-5" />
            </button>

            {/* Quick Add Task */}
            <button
              onClick={() => handleAddTask('TODO')}
              className="flex items-center gap-2 px-4 py-2 bg-taro text-white rounded-lg font-medium hover:bg-deep-taro transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Task</span>
            </button>
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

      {/* Kanban Board */}
      <div className="bg-gradient-to-b from-milk-tea/30 to-white rounded-2xl border-2 border-brown-sugar/20 p-6">
        <KanbanBoard
          projectId={projectId}
          tasks={filteredTasks}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTask}
        />
      </div>

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
    </div>
  );
}
