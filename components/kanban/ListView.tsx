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
        return 'text-white bg-strawberry border-2 border-ink';
      case 'HIGH':
        return 'text-ink bg-strawberry border-2 border-ink';
      case 'MEDIUM':
        return 'text-ink bg-thai-tea border-2 border-ink';
      case 'LOW':
        return 'text-ink bg-matcha border-2 border-ink';
      default:
        return 'text-ink bg-cream border-2 border-ink';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-ink bg-matcha border-2 border-ink';
      case 'IN_PROGRESS':
        return 'text-ink bg-thai-tea border-2 border-ink';
      case 'IN_REVIEW':
        return 'text-ink bg-milk-tea border-2 border-ink';
      case 'BLOCKED':
        return 'text-white bg-strawberry border-2 border-ink';
      case 'TODO':
        return 'text-white bg-taro border-2 border-ink';
      default:
        return 'text-ink bg-cream border-2 border-ink';
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
      className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Controls */}
      <div className="p-4 bg-gradient-to-r from-milk-tea to-cream rounded-t-xl border-b-4 border-ink">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <ListIcon className="w-5 h-5 text-ink" />
            <h3 className="font-display font-black text-ink uppercase">list view</h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Group By */}
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              className="px-4 py-3 bg-white border-3 border-ink rounded-lg text-sm font-display font-bold focus:outline-none focus:ring-4 focus:ring-taro/20 uppercase"
            >
              <option value="none">No Grouping</option>
              <option value="status">Group by Status</option>
              <option value="priority">Group by Priority</option>
              <option value="assignee">Group by Assignee</option>
            </select>

            {/* Sort Direction */}
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-white hover:bg-cream border-3 border-ink rounded-lg transition-colors shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
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
      <div className="bg-cream/30 border-b-4 border-ink">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-display font-black text-ink uppercase">
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
      <div className="max-h-[600px] overflow-y-auto bg-cream/30">
        {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
          <div key={groupName} className="border-b-3 border-ink/20 last:border-b-0">
            {groupBy !== 'none' && (
              <div className="bg-gradient-to-r from-milk-tea to-cream px-4 py-2 border-b-3 border-ink">
                <h4 className="font-display font-black text-ink text-sm uppercase">
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
                  className="w-full grid grid-cols-12 gap-4 px-4 py-3 hover:bg-taro/10 transition-all border-b-3 border-ink/10 last:border-b-0 text-left bg-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(147, 51, 234, 0.05)' }}
                >
                  {/* Task Title */}
                  <div className="col-span-4 flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full border-2 border-ink ${getPriorityColor(task.priority).split(' ')[1]}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-black uppercase text-ink truncate">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-ink/60 truncate mt-0.5 font-bold">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-display font-black uppercase ${getStatusColor(task.status)}`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Priority */}
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-display font-black uppercase ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="col-span-2 flex items-center gap-2">
                    {task.dueDate ? (
                      <>
                        <Calendar className="w-3 h-3 text-ink/40" />
                        <span
                          className={`text-sm font-display font-bold uppercase ${isOverdue ? 'text-strawberry font-black' : 'text-ink/70'}`}
                        >
                          {format(new Date(task.dueDate), 'MMM d')}
                        </span>
                        {isOverdue && <AlertCircle className="w-3 h-3 text-strawberry" />}
                      </>
                    ) : (
                      <span className="text-sm text-ink/40 font-display font-bold uppercase">
                        -
                      </span>
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
                            className="w-8 h-8 rounded-full border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-taro to-deep-taro border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <span className="text-sm font-display font-bold uppercase text-ink/70 truncate">
                          {task.assignedTo.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-ink/40 font-display font-bold uppercase">
                        Unassigned
                      </span>
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
        <div className="text-center py-12 bg-white">
          <ListIcon className="w-12 h-12 text-ink/20 mx-auto mb-4" />
          <p className="font-display font-black uppercase text-ink/60">No tasks to display</p>
        </div>
      )}
    </motion.div>
  );
}
