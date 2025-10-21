'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Milestone } from '@/types/portal';
import { Icon } from '@iconify/react';

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
      discovery: 'ph:magnifying-glass-duotone',
      design: 'ph:palette-duotone',
      development: 'ph:lightning-duotone',
      qa: 'ph:flask-duotone',
      launch: 'ph:rocket-launch-duotone',
    };
    const key = title.toLowerCase() as keyof typeof icons;
    return icons[key] || 'ph:note-duotone';
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

  // Get recent milestone updates (completed in last 30 days)
  const recentUpdates = sortedMilestones
    .filter(
      (m) =>
        m.completedAt && new Date(m.completedAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
    )
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

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

      {/* Recent Updates */}
      {recentUpdates.length > 0 && (
        <motion.div
          className="bg-green-50 border border-green-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Icon icon="ph:confetti-duotone" className="w-5 h-5 text-green-600" />
            <h4 className="font-display text-sm font-semibold text-green-700 lowercase">
              recent milestone updates
            </h4>
          </div>
          <div className="space-y-2">
            {recentUpdates.slice(0, 3).map((milestone, index) => (
              <motion.div
                key={milestone.id}
                className="flex items-center gap-3 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Icon icon="ph:check-circle-duotone" className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">{milestone.title}</span>
                <span className="text-green-600">•</span>
                <span className="text-green-600/80">
                  completed{' '}
                  {new Date(milestone.completedAt!).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </motion.div>
            ))}
            {recentUpdates.length > 3 && (
              <p className="text-xs text-green-600/70 ml-8">
                +{recentUpdates.length - 3} more milestone{recentUpdates.length - 3 > 1 ? 's' : ''}{' '}
                completed this month
              </p>
            )}
          </div>
        </motion.div>
      )}

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
                  {isCompleted ? (
                    <Icon icon="ph:check-circle-duotone" className="w-8 h-8 text-green-600" />
                  ) : (
                    <Icon icon={getPhaseIcon(milestone.title)} className="w-8 h-8" />
                  )}
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
