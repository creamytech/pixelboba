'use client';

import { motion } from 'framer-motion';
import { MoreVertical, Users, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    progress: number;
    dueDate?: Date;
    teamMembers?: {
      name: string;
      image?: string;
    }[];
    tasksCompleted: number;
    totalTasks: number;
    status: 'on-track' | 'at-risk' | 'delayed';
  };
  delay?: number;
  href?: string; // Optional href - if not provided, card won't be clickable
  onClick?: () => void; // Optional click handler
}

export default function ProjectCard({ project, delay = 0, href, onClick }: ProjectCardProps) {
  const statusColors = {
    'on-track': 'from-green-500 to-emerald-500',
    'at-risk': 'from-orange-500 to-amber-500',
    delayed: 'from-red-500 to-rose-500',
  };

  const statusLabels = {
    'on-track': 'On Track',
    'at-risk': 'At Risk',
    delayed: 'Delayed',
  };

  const progressColor =
    project.progress >= 75
      ? 'bg-green-500'
      : project.progress >= 50
        ? 'bg-taro'
        : project.progress >= 25
          ? 'bg-orange-500'
          : 'bg-red-500';

  const cardContent = (
    <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm border-2 border-brown-sugar/10 rounded-3xl p-6 shadow-sm group-hover:shadow-2xl transition-all">
      {/* Gradient Decoration */}
      <div
        className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${statusColors[project.status]} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg text-ink truncate mb-1">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-ink/60 line-clamp-2">{project.description}</p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-brown-sugar/10 rounded-xl transition-colors flex-shrink-0"
          onClick={(e) => e.preventDefault()}
        >
          <MoreVertical className="w-4 h-4 text-ink/60" />
        </motion.button>
      </div>

      {/* Status Badge */}
      <div className="mb-4 relative z-10">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${statusColors[project.status]} text-white text-xs font-semibold shadow-sm`}
        >
          <TrendingUp className="w-3 h-3" />
          {statusLabels[project.status]}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-display font-medium text-ink/60">Progress</span>
          <span className="text-xs font-display font-bold text-ink">{project.progress}%</span>
        </div>
        <div className="h-2 bg-brown-sugar/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${progressColor} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 relative z-10">
        {/* Tasks */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-taro/10 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-taro" />
          </div>
          <div>
            <p className="text-xs text-ink/60">Tasks</p>
            <p className="text-sm font-display font-bold text-ink">
              {project.tasksCompleted}/{project.totalTasks}
            </p>
          </div>
        </div>

        {/* Due Date */}
        {project.dueDate && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brown-sugar/10 rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 text-brown-sugar" />
            </div>
            <div>
              <p className="text-xs text-ink/60">Due</p>
              <p className="text-sm font-display font-bold text-ink">
                {new Date(project.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Team Members */}
      {project.teamMembers && project.teamMembers.length > 0 && (
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 bg-milk-tea/30 rounded-xl flex items-center justify-center">
            <Users className="w-4 h-4 text-brown-sugar" />
          </div>
          <div className="flex -space-x-2">
            {project.teamMembers.slice(0, 3).map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.4 + index * 0.1 }}
                className="relative"
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-white shadow-sm bg-gradient-to-br from-taro to-brown-sugar flex items-center justify-center text-white text-xs font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </motion.div>
            ))}
            {project.teamMembers.length > 3 && (
              <div className="w-7 h-7 rounded-full border-2 border-white shadow-sm bg-brown-sugar/20 flex items-center justify-center text-ink text-xs font-bold">
                +{project.teamMembers.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hover Indicator */}
      {(href || onClick) && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-taro via-brown-sugar to-taro"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );

  const motionWrapper = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={href || onClick ? { y: -6, scale: 1.02 } : undefined}
      className="group relative"
      onClick={onClick}
      style={onClick && !href ? { cursor: 'pointer' } : undefined}
    >
      {cardContent}
    </motion.div>
  );

  // If href is provided, wrap in Link
  if (href) {
    return <Link href={href}>{motionWrapper}</Link>;
  }

  // Otherwise just return the motion wrapper (non-clickable card)
  return motionWrapper;
}
