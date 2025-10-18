'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface TimelineViewProps {
  tasks: any[];
  onTaskClick: (task: any) => void;
}

export default function TimelineView({ tasks, onTaskClick }: TimelineViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filter tasks with due dates
  const tasksWithDates = useMemo(() => {
    return tasks.filter((task) => task.dueDate);
  }, [tasks]);

  // Get days in current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group tasks by due date
  const tasksByDate = useMemo(() => {
    const grouped: { [key: string]: any[] } = {};
    tasksWithDates.forEach((task) => {
      if (task.dueDate) {
        const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });
    return grouped;
  }, [tasksWithDates]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-50 border-green-200';
      case 'IN_PROGRESS':
        return 'bg-violet-50 border-violet-200';
      case 'IN_REVIEW':
        return 'bg-yellow-50 border-yellow-200';
      case 'BLOCKED':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

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
          <CalendarIcon className="w-6 h-6 text-taro" />
          <h2 className="font-display text-2xl font-bold text-ink lowercase">timeline view</h2>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={handlePrevMonth}
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
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-taro/10 hover:bg-taro/20 text-taro transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/50 rounded-lg p-3 border border-brown-sugar/10">
          <p className="text-xs text-ink/60 font-display uppercase mb-1">tasks this month</p>
          <p className="text-2xl font-bold text-ink">{tasksWithDates.length}</p>
        </div>
        <div className="bg-white/50 rounded-lg p-3 border border-brown-sugar/10">
          <p className="text-xs text-ink/60 font-display uppercase mb-1">completed</p>
          <p className="text-2xl font-bold text-green-600">
            {tasksWithDates.filter((t) => t.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="bg-white/50 rounded-lg p-3 border border-brown-sugar/10">
          <p className="text-xs text-ink/60 font-display uppercase mb-1">overdue</p>
          <p className="text-2xl font-bold text-red-600">
            {
              tasksWithDates.filter(
                (t) => new Date(t.dueDate!) < new Date() && t.status !== 'COMPLETED'
              ).length
            }
          </p>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="space-y-2">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-display font-semibold text-ink/60 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Days */}
          {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayTasks = tasksByDate[dateKey] || [];
            const isToday = isSameDay(day, new Date());

            return (
              <motion.div
                key={dateKey}
                className={`aspect-square rounded-lg border p-2 transition-all ${
                  isToday
                    ? 'bg-taro/10 border-taro/40 ring-2 ring-taro/20'
                    : dayTasks.length > 0
                      ? 'bg-white/70 border-brown-sugar/20 hover:shadow-md'
                      : 'bg-gray-50/50 border-gray-200'
                }`}
                whileHover={dayTasks.length > 0 ? { scale: 1.02, y: -2 } : {}}
              >
                <div className="flex flex-col h-full">
                  <div
                    className={`text-xs font-display font-medium mb-1 ${
                      isToday ? 'text-taro' : 'text-ink/60'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>

                  {dayTasks.length > 0 && (
                    <div className="flex-1 space-y-1 overflow-hidden">
                      {dayTasks.slice(0, 2).map((task) => (
                        <motion.button
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className={`w-full text-left rounded px-1.5 py-0.5 border text-xs truncate ${getStatusColor(task.status)}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}
                            />
                            <span className="font-display font-medium truncate">{task.title}</span>
                          </div>
                        </motion.button>
                      ))}

                      {dayTasks.length > 2 && (
                        <div className="text-xs text-ink/50 font-display text-center">
                          +{dayTasks.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
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
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-xs font-display text-ink/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
