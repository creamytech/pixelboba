'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Milestone } from '@/types/portal';

interface MilestoneTrackerProps {
  milestones?: Milestone[];
  currentPhase: string;
  estimatedDeadline?: string;
}

const defaultMilestones = [
  {
    id: '1',
    title: 'Discovery',
    description: 'Project planning and requirements',
    order: 1,
    completedAt: new Date(),
    createdAt: new Date(),
    projectId: '',
    targetDate: new Date(),
  },
  {
    id: '2',
    title: 'Design',
    description: 'Visual design and prototypes',
    order: 2,
    completedAt: undefined,
    createdAt: new Date(),
    projectId: '',
    targetDate: new Date(),
  },
  {
    id: '3',
    title: 'Development',
    description: 'Code implementation and testing',
    order: 3,
    completedAt: undefined,
    createdAt: new Date(),
    projectId: '',
    targetDate: new Date(),
  },
  {
    id: '4',
    title: 'QA',
    description: 'Quality assurance and bug fixes',
    order: 4,
    completedAt: undefined,
    createdAt: new Date(),
    projectId: '',
    targetDate: new Date(),
  },
  {
    id: '5',
    title: 'Launch',
    description: 'Deployment and go-live',
    order: 5,
    completedAt: undefined,
    createdAt: new Date(),
    projectId: '',
    targetDate: new Date(),
  },
];

export default function MilestoneTracker({
  milestones = defaultMilestones,
  currentPhase = 'design',
  estimatedDeadline,
}: MilestoneTrackerProps) {
  const sortedMilestones = milestones.sort((a, b) => (a.order || 0) - (b.order || 0));
  const currentIndex = sortedMilestones.findIndex((m) =>
    m.title.toLowerCase().includes(currentPhase.toLowerCase())
  );

  const getPhaseIcon = (title: string) => {
    const icons = {
      discovery: '🔍',
      design: '🎨',
      development: '⚡',
      qa: '🧪',
      launch: '🚀',
    };
    const key = title.toLowerCase() as keyof typeof icons;
    return icons[key] || '📋';
  };

  const getPhaseColor = (index: number, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) {
      return 'bg-green-100 text-green-700 border-green-200';
    } else if (isCurrent) {
      return 'bg-taro/10 text-taro border-taro/20';
    } else if (index < currentIndex) {
      return 'bg-green-100 text-green-700 border-green-200';
    } else {
      return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink lowercase">
          project milestones
        </h3>
        {estimatedDeadline && (
          <div className="text-right">
            <p className="font-display text-sm text-ink/60 lowercase">estimated completion</p>
            <p className="font-display text-sm font-medium text-ink">
              {new Date(estimatedDeadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200" />
        <motion.div
          className="absolute left-6 top-8 w-0.5 bg-gradient-to-b from-green-500 to-taro"
          initial={{ height: 0 }}
          animate={{
            height: `${Math.max(0, currentIndex) * 25}%`,
          }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Milestones */}
        <div className="space-y-6">
          {sortedMilestones.map((milestone, index) => {
            const isCompleted = milestone.completedAt !== undefined || index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <motion.div
                key={milestone.id}
                className="relative flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Icon */}
                <motion.div
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getPhaseColor(index, isCompleted, isCurrent)} shadow-sm`}
                  whileHover={{ scale: 1.05 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                >
                  <span className="text-lg">
                    {isCompleted ? '✅' : getPhaseIcon(milestone.title)}
                  </span>
                </motion.div>

                {/* Content */}
                <motion.div
                  className={`flex-1 pb-6 ${isCurrent ? 'ring-2 ring-taro/20 bg-taro/5' : ''} rounded-lg p-4 transition-all duration-300`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4
                      className={`font-display font-semibold lowercase ${isCurrent ? 'text-taro' : 'text-ink'}`}
                    >
                      {milestone.title}
                    </h4>
                    {isCurrent && (
                      <motion.span
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-taro bg-taro/10 rounded-full"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Circle size={8} className="fill-current" />
                        in progress
                      </motion.span>
                    )}
                    {isCompleted && milestone.completedAt && (
                      <span className="text-xs text-green-600 font-medium">
                        completed {new Date(milestone.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="font-display text-sm text-ink/60 lowercase">
                    {milestone.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
