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
  href?: string;
  onClick?: () => void;
}

export default function ProjectCard({ project, delay = 0, href, onClick }: ProjectCardProps) {
  const statusColors = {
    'on-track': 'from-matcha to-matcha/80',
    'at-risk': 'from-thai-tea to-thai-tea/80',
    delayed: 'from-strawberry to-strawberry/80',
  };

  const statusLabels = {
    'on-track': 'On Track',
    'at-risk': 'At Risk',
    delayed: 'Delayed',
  };

  const progressColor =
    project.progress >= 75
      ? 'bg-matcha'
      : project.progress >= 50
        ? 'bg-taro'
        : project.progress >= 25
          ? 'bg-thai-tea'
          : 'bg-strawberry';

  const cardContent = (
    <div className="relative overflow-hidden bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-all p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-black text-lg text-ink truncate mb-1">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-ink/60 font-bold line-clamp-2">{project.description}</p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-cream rounded-lg transition-colors flex-shrink-0"
          onClick={(e) => e.preventDefault()}
        >
          <MoreVertical className="w-5 h-5 text-ink/60" strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${statusColors[project.status]} text-white font-black text-xs uppercase border-2 border-ink`}
        >
          <TrendingUp className="w-3 h-3" strokeWidth={3} />
          {statusLabels[project.status]}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-ink/60 uppercase">Progress</span>
          <span className="text-sm font-black text-ink">{project.progress}%</span>
        </div>
        <div className="h-3 bg-cream rounded-full border-2 border-ink overflow-hidden">
          <motion.div
            className={`h-full ${progressColor} transition-all duration-500`}
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4">
        {/* Tasks */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-taro to-deep-taro rounded-full border-2 border-ink flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs text-ink/60 font-bold uppercase">Tasks</p>
            <p className="text-sm font-black text-ink">
              {project.tasksCompleted}/{project.totalTasks}
            </p>
          </div>
        </div>

        {/* Due Date */}
        {project.dueDate && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-thai-tea to-thai-tea/80 rounded-full border-2 border-ink flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs text-ink/60 font-bold uppercase">Due</p>
              <p className="text-sm font-black text-ink">
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
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-matcha to-matcha/80 rounded-full border-2 border-ink flex items-center justify-center">
            <Users className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex -space-x-2">
            {project.teamMembers.slice(0, 3).map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.4 + index * 0.1 }}
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-8 h-8 rounded-full border-3 border-white shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border-3 border-white shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] bg-gradient-to-br from-taro to-deep-taro flex items-center justify-center text-white text-xs font-black">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </motion.div>
            ))}
            {project.teamMembers.length > 3 && (
              <div className="w-8 h-8 rounded-full border-3 border-white shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] bg-cream flex items-center justify-center text-ink text-xs font-black">
                +{project.teamMembers.length - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const motionWrapper = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="group"
      onClick={onClick}
      style={onClick && !href ? { cursor: 'pointer' } : undefined}
    >
      {cardContent}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{motionWrapper}</Link>;
  }

  return motionWrapper;
}
