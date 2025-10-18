import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/layout/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { CheckCircle2, FolderKanban, Users, TrendingUp, Clock, Target } from 'lucide-react';

export default async function NewDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Mock data - replace with real data from your database
  const metrics = [
    {
      title: 'Active Projects',
      value: 12,
      change: { value: 8, type: 'increase' as const },
      icon: FolderKanban,
      gradient: 'from-taro to-deep-taro',
    },
    {
      title: 'Tasks Completed',
      value: 247,
      change: { value: 12, type: 'increase' as const },
      icon: CheckCircle2,
      gradient: 'from-matcha to-green-600',
    },
    {
      title: 'Team Members',
      value: 8,
      change: { value: 2, type: 'increase' as const },
      icon: Users,
      gradient: 'from-strawberry to-pink-600',
    },
    {
      title: 'Completion Rate',
      value: 94,
      suffix: '%',
      change: { value: 5, type: 'increase' as const },
      icon: TrendingUp,
      gradient: 'from-thai-tea to-orange-600',
    },
  ];

  const activities = [
    {
      id: '1',
      type: 'task_completed' as const,
      title: 'Design System v2.0 completed',
      description: 'All components have been updated with the new design system',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
      user: {
        name: session.user.name || 'User',
        image: session.user.image,
      },
    },
    {
      id: '2',
      type: 'comment' as const,
      title: 'New comment on "API Integration"',
      description: 'Sarah mentioned you in a comment about API endpoints',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
    },
    {
      id: '3',
      type: 'task_created' as const,
      title: 'New task created',
      description: 'Implement user authentication flow',
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    },
    {
      id: '4',
      type: 'member_added' as const,
      title: 'New team member joined',
      description: 'Alex Johnson joined the Design Team',
      timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    },
    {
      id: '5',
      type: 'file_uploaded' as const,
      title: 'Design mockups uploaded',
      description: 'Homepage_v3.fig added to project files',
      timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    },
  ];

  const projects = [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Building a modern e-commerce solution with Next.js',
      progress: 75,
      dueDate: new Date('2025-11-15'),
      tasksCompleted: 24,
      totalTasks: 32,
      status: 'on-track' as const,
      teamMembers: [
        { name: 'John Doe', image: undefined },
        { name: 'Jane Smith', image: undefined },
        { name: 'Bob Wilson', image: undefined },
      ],
    },
    {
      id: '2',
      name: 'Mobile App Redesign',
      description: 'Complete UI/UX overhaul for iOS and Android apps',
      progress: 45,
      dueDate: new Date('2025-10-30'),
      tasksCompleted: 18,
      totalTasks: 40,
      status: 'at-risk' as const,
      teamMembers: [
        { name: 'Sarah Lee', image: undefined },
        { name: 'Mike Johnson', image: undefined },
      ],
    },
    {
      id: '3',
      name: 'API Migration',
      description: 'Migrating from REST to GraphQL architecture',
      progress: 30,
      dueDate: new Date('2025-10-25'),
      tasksCompleted: 9,
      totalTasks: 30,
      status: 'delayed' as const,
      teamMembers: [
        { name: 'Alex Turner', image: undefined },
        { name: 'Emma Davis', image: undefined },
        { name: 'Chris Brown', image: undefined },
        { name: 'Lisa White', image: undefined },
      ],
    },
  ];

  const handleLogout = async () => {
    'use server';
    // Implement logout
  };

  return (
    <DashboardLayout
      user={{
        name: session.user.name || 'User',
        email: session.user.email || '',
        image: session.user.image,
        role: 'Admin',
      }}
    >
      {/* Header */}
      <DashboardHeader
        userName={session.user.name?.split(' ')[0] || 'there'}
        notificationCount={5}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} delay={index * 0.1} />
        ))}
      </div>

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Projects - 2/3 width */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="font-display font-bold text-2xl text-ink mb-2">Active Projects</h2>
            <p className="text-ink/60 text-sm">Your current projects and their progress</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} delay={0.2 + index * 0.1} />
            ))}
          </div>
        </div>

        {/* Recent Activity - 1/3 width */}
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} maxItems={5} />
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stat 1 */}
        <div className="bg-gradient-to-br from-taro/10 to-white/70 backdrop-blur-sm border-2 border-brown-sugar/10 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-ink/60 text-sm font-body">Avg. Task Time</p>
              <p className="font-display font-bold text-2xl text-ink">2.4 days</p>
            </div>
          </div>
          <p className="text-xs text-ink/50">12% faster than last month</p>
        </div>

        {/* Quick Stat 2 */}
        <div className="bg-gradient-to-br from-matcha/10 to-white/70 backdrop-blur-sm border-2 border-brown-sugar/10 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-matcha to-green-600 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-ink/60 text-sm font-body">Goals Achieved</p>
              <p className="font-display font-bold text-2xl text-ink">8/10</p>
            </div>
          </div>
          <p className="text-xs text-ink/50">2 goals remaining this quarter</p>
        </div>

        {/* Quick Stat 3 */}
        <div className="bg-gradient-to-br from-strawberry/10 to-white/70 backdrop-blur-sm border-2 border-brown-sugar/10 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-strawberry to-pink-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-ink/60 text-sm font-body">Team Velocity</p>
              <p className="font-display font-bold text-2xl text-ink">42 pts</p>
            </div>
          </div>
          <p className="text-xs text-ink/50">Up 18% from last sprint</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
