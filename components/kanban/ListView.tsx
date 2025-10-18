'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  List as ListIcon,
  Calendar,
  AlertCircle,
  User,
  Flag,
} from 'lucide-react';
import { format } from 'date-fns';

interface ListViewProps {
  tasks: any[];
  onTaskClick: (task: any) => void;
}

type SortField = 'title' | 'priority' | 'dueDate' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';
type GroupBy = 'none' | 'status' | 'priority' | 'assignee';

export default function ListView({ tasks, onTaskClick }: ListViewProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');

  // Sort tasks
  const sortedTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { LOW: 0, MEDIUM: 1, HIGH: 2, URGENT: 3 };
          aVal = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 0;
          bVal = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 0;
          break;
        case 'dueDate':
          aVal = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          bVal = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [tasks, sortField, sortDirection]);

  // Group tasks
  const groupedTasks = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Tasks': sortedTasks };
    }

    const groups: { [key: string]: any[] } = {};

    sortedTasks.forEach((task) => {
      let groupKey = '';

      switch (groupBy) {
        case 'status':
          groupKey = task.status.replace('_', ' ');
          break;
        case 'priority':
          groupKey = task.priority;
          break;
        case 'assignee':
          groupKey = task.assignedTo?.name || 'Unassigned';
          break;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
    });

    return groups;
  }, [sortedTasks, groupBy]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600 bg-red-50';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-50';
      case 'IN_PROGRESS':
        return 'text-violet-600 bg-violet-50';
      case 'IN_REVIEW':
        return 'text-yellow-600 bg-yellow-50';
      case 'BLOCKED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <motion.div
      className="bg-white/60 backdrop-blur-lg rounded-xl border border-brown-sugar/20 shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Controls */}
      <div className="p-4 bg-gradient-to-r from-taro/5 to-brown-sugar/5 border-b border-brown-sugar/20">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <ListIcon className="w-5 h-5 text-taro" />
            <h3 className="font-display font-semibold text-ink lowercase">list view</h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Group By */}
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              className="px-3 py-1.5 bg-white border border-brown-sugar/20 rounded-lg text-sm font-display focus:outline-none focus:ring-2 focus:ring-taro/20"
            >
              <option value="none">No Grouping</option>
              <option value="status">Group by Status</option>
              <option value="priority">Group by Priority</option>
              <option value="assignee">Group by Assignee</option>
            </select>

            {/* Sort Direction */}
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-white hover:bg-gray-50 border border-brown-sugar/20 rounded-lg transition-colors"
              title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortDirection === 'asc' ? (
                <ChevronUp className="w-4 h-4 text-ink" />
              ) : (
                <ChevronDown className="w-4 h-4 text-ink" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-gray-50/50 border-b border-brown-sugar/20">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-display font-semibold text-ink/60 uppercase">
          <button
            onClick={() => handleSort('title')}
            className="col-span-4 flex items-center gap-2 hover:text-taro transition-colors text-left"
          >
            <span>Task</span>
            <SortIcon field="title" />
          </button>
          <button
            onClick={() => handleSort('status')}
            className="col-span-2 flex items-center gap-2 hover:text-taro transition-colors"
          >
            <span>Status</span>
            <SortIcon field="status" />
          </button>
          <button
            onClick={() => handleSort('priority')}
            className="col-span-2 flex items-center gap-2 hover:text-taro transition-colors"
          >
            <span>Priority</span>
            <SortIcon field="priority" />
          </button>
          <button
            onClick={() => handleSort('dueDate')}
            className="col-span-2 flex items-center gap-2 hover:text-taro transition-colors"
          >
            <span>Due Date</span>
            <SortIcon field="dueDate" />
          </button>
          <div className="col-span-2 flex items-center gap-2">
            <span>Assignee</span>
          </div>
        </div>
      </div>

      {/* Task Groups */}
      <div className="max-h-[600px] overflow-y-auto">
        {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
          <div key={groupName} className="border-b border-brown-sugar/10 last:border-b-0">
            {groupBy !== 'none' && (
              <div className="bg-gray-50/30 px-4 py-2 border-b border-brown-sugar/10">
                <h4 className="font-display font-medium text-ink text-sm lowercase">
                  {groupName} ({groupTasks.length})
                </h4>
              </div>
            )}

            {groupTasks.map((task, index) => {
              const isOverdue =
                task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

              return (
                <motion.button
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="w-full grid grid-cols-12 gap-4 px-4 py-3 hover:bg-taro/5 transition-colors border-b border-brown-sugar/5 last:border-b-0 text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ x: 4 }}
                >
                  {/* Task Title */}
                  <div className="col-span-4 flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority).split(' ')[1]}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-medium text-ink truncate">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-ink/60 truncate mt-0.5">{task.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-display font-medium ${getStatusColor(task.status)}`}
                    >
                      {task.status.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>

                  {/* Priority */}
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-display font-medium ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority.toLowerCase()}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="col-span-2 flex items-center gap-2">
                    {task.dueDate ? (
                      <>
                        <Calendar className="w-3 h-3 text-ink/40" />
                        <span
                          className={`text-sm font-display ${isOverdue ? 'text-red-600 font-medium' : 'text-ink/70'}`}
                        >
                          {format(new Date(task.dueDate), 'MMM d')}
                        </span>
                        {isOverdue && <AlertCircle className="w-3 h-3 text-red-600" />}
                      </>
                    ) : (
                      <span className="text-sm text-ink/40 font-display">-</span>
                    )}
                  </div>

                  {/* Assignee */}
                  <div className="col-span-2 flex items-center gap-2">
                    {task.assignedTo ? (
                      <>
                        {task.assignedTo.image ? (
                          <img
                            src={task.assignedTo.image}
                            alt={task.assignedTo.name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-taro/20 flex items-center justify-center">
                            <User className="w-3 h-3 text-taro" />
                          </div>
                        )}
                        <span className="text-sm font-display text-ink/70 truncate">
                          {task.assignedTo.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-ink/40 font-display">Unassigned</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <ListIcon className="w-12 h-12 text-ink/20 mx-auto mb-4" />
          <p className="font-display text-ink/60">No tasks to display</p>
        </div>
      )}
    </motion.div>
  );
}
