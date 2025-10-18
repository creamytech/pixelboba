'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  differenceInDays,
  addMonths,
  subMonths,
  isWithinInterval,
} from 'date-fns';
import { ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

interface GanttViewProps {
  tasks: any[];
  onTaskClick: (task: any) => void;
}

export default function GanttView({ tasks, onTaskClick }: GanttViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filter tasks with due dates
  const tasksWithDates = useMemo(() => {
    return tasks.filter((task) => task.dueDate || task.createdAt);
  }, [tasks]);

  // Calculate date range
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate task bars
  const taskBars = useMemo(() => {
    return tasksWithDates.map((task) => {
      const startDate = new Date(task.createdAt);
      const endDate = task.dueDate ? new Date(task.dueDate) : new Date();

      // Calculate position and width relative to month
      const daysSinceMonthStart = differenceInDays(startDate, monthStart);
      const duration = differenceInDays(endDate, startDate);

      // Check if task overlaps with current month
      const overlapsMonth =
        isWithinInterval(startDate, { start: monthStart, end: monthEnd }) ||
        isWithinInterval(endDate, { start: monthStart, end: monthEnd }) ||
        (startDate < monthStart && endDate > monthEnd);

      // Calculate visible portion
      let visibleStart = Math.max(0, daysSinceMonthStart);
      let visibleWidth = duration;

      if (startDate < monthStart) {
        visibleStart = 0;
        visibleWidth = differenceInDays(endDate, monthStart);
      }

      if (endDate > monthEnd) {
        visibleWidth = differenceInDays(monthEnd, startDate < monthStart ? monthStart : startDate);
      }

      const left = (visibleStart / days.length) * 100;
      const width = (visibleWidth / days.length) * 100;

      return {
        task,
        left,
        width: Math.max(width, 2), // Minimum 2% width
        overlapsMonth,
      };
    });
  }, [tasksWithDates, monthStart, monthEnd, days.length]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500 border-red-600';
      case 'HIGH':
        return 'bg-orange-500 border-orange-600';
      case 'MEDIUM':
        return 'bg-yellow-500 border-yellow-600';
      case 'LOW':
        return 'bg-green-500 border-green-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const getStatusOpacity = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'opacity-50';
      case 'BLOCKED':
        return 'opacity-70 line-through';
      default:
        return 'opacity-100';
    }
  };

  return (
    <motion.div
      className="bg-white/60 backdrop-blur-lg rounded-xl p-6 border border-brown-sugar/20 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-taro" />
          <h2 className="font-display text-2xl font-bold text-ink lowercase">gantt chart</h2>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg bg-taro/10 hover:bg-taro/20 text-taro transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div className="font-display text-lg font-semibold text-ink min-w-[180px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </div>

          <motion.button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg bg-taro/10 hover:bg-taro/20 text-taro transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="border border-brown-sugar/20 rounded-lg overflow-hidden bg-white/50">
        {/* Timeline Header */}
        <div className="bg-gradient-to-r from-taro/5 to-brown-sugar/5 border-b border-brown-sugar/20">
          <div className="flex">
            <div className="w-48 flex-shrink-0 px-4 py-3 font-display font-semibold text-ink/70 text-sm border-r border-brown-sugar/20">
              Task
            </div>
            <div className="flex-1 flex">
              {days.map((day, index) => (
                <div
                  key={index}
                  className="flex-1 px-1 py-3 text-center border-r border-brown-sugar/10 last:border-r-0"
                  style={{ minWidth: '30px' }}
                >
                  <div className="text-xs font-display font-medium text-ink/60">
                    {format(day, 'd')}
                  </div>
                  <div className="text-xs font-display text-ink/40">{format(day, 'EEE')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Rows */}
        <div className="max-h-[500px] overflow-y-auto">
          {taskBars.map(({ task, left, width, overlapsMonth }, index) => {
            if (!overlapsMonth) return null;

            return (
              <motion.div
                key={task.id}
                className="flex border-b border-brown-sugar/10 hover:bg-taro/5 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Task Name Column */}
                <div className="w-48 flex-shrink-0 px-4 py-3 border-r border-brown-sugar/20">
                  <button onClick={() => onTaskClick(task)} className="text-left w-full group">
                    <p className="font-display font-medium text-ink text-sm truncate group-hover:text-taro transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-display px-2 py-0.5 rounded ${getPriorityColor(task.priority)} text-white`}
                      >
                        {task.priority.toLowerCase()}
                      </span>
                      <span className="text-xs text-ink/60 font-display">
                        {task.status.replace('_', ' ').toLowerCase()}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Timeline Bar */}
                <div className="flex-1 relative py-2">
                  <motion.button
                    onClick={() => onTaskClick(task)}
                    className={`absolute h-8 rounded-lg border-2 group ${getPriorityColor(task.priority)} ${getStatusOpacity(task.status)} hover:shadow-lg transition-all`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    whileHover={{ scaleY: 1.2, zIndex: 10 }}
                  >
                    <div className="px-2 py-1 text-white text-xs font-display font-medium truncate">
                      {width > 10 && task.title}
                    </div>
                  </motion.button>

                  {/* Today Marker */}
                  {isWithinInterval(new Date(), { start: monthStart, end: monthEnd }) && (
                    <div
                      className="absolute top-0 bottom-0 w-px bg-red-500 opacity-50"
                      style={{
                        left: `${(differenceInDays(new Date(), monthStart) / days.length) * 100}%`,
                      }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {taskBars.filter((b) => b.overlapsMonth).length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-ink/20 mx-auto mb-4" />
            <p className="font-display text-ink/60">No tasks in this month</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-brown-sugar/20">
        <p className="text-xs text-ink/60 font-display uppercase mb-3">priority legend</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'urgent', color: 'bg-red-500' },
            { label: 'high', color: 'bg-orange-500' },
            { label: 'medium', color: 'bg-yellow-500' },
            { label: 'low', color: 'bg-green-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${item.color}`} />
              <span className="text-xs font-display text-ink/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
