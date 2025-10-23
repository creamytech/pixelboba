'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import PortalLayout from '@/components/layout/PortalLayout';
import DashboardHeader from '@/components/layout/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ProjectCard from '@/components/dashboard/ProjectCard';
import MessageCenter from '@/components/portal/MessageCenter';
import InvoiceCenter from '@/components/portal/InvoiceCenter';
import ContractCenter from '@/components/portal/ContractCenter';
import FileCenter from '@/components/portal/FileCenter';
import NotificationCenter from '@/components/portal/NotificationCenter';
import NotificationPreferences from '@/components/portal/NotificationPreferences';
import BillingCenter from '@/components/portal/BillingCenter';
import LockedFeature from '@/components/portal/LockedFeature';
import ProjectTaskBoard from '@/components/kanban/ProjectTaskBoard';
import WebsitePreview from '@/components/portal/WebsitePreview';
import TeamManagement from '@/components/portal/TeamManagement';
import RequestTracking from '@/components/portal/RequestTracking';
import MeetingScheduler from '@/components/portal/MeetingScheduler';
import ProjectDetails from '@/components/portal/ProjectDetails';
import GlobalSearch from '@/components/portal/GlobalSearch';
// import OnboardingTour from '@/components/portal/OnboardingTour'; // Temporarily disabled for React 18 compatibility
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  MessageSquare,
  CreditCard,
  FileCheck,
  Upload,
  Send,
  Eye,
  Plus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { Project, User as UserType } from '@/types/portal';
import { Session } from 'next-auth';

interface PortalData {
  user: UserType;
  subscription: {
    tier: string | null;
    isActive: boolean;
  };
  projects: Project[];
  unreadMessages: number;
  pendingInvoices: number;
  pendingContracts: number;
}

export default function ClientPortalClient({ session }: { session: Session }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [runOnboarding, setRunOnboarding] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  // Initialize online status tracking
  useOnlineStatus();

  useEffect(() => {
    fetchPortalData();
  }, []);

  // Keyboard shortcut for global search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchPortalData = async () => {
    try {
      const response = await fetch('/api/portal/dashboard');
      if (response.ok) {
        const data = await response.json();
        console.log('Portal data received:', data);
        console.log(
          'Projects with websiteUrl:',
          data.projects?.map((p: any) => ({
            name: p.name,
            websiteUrl: p.websiteUrl,
          }))
        );
        setPortalData(data);

        // Check if user needs onboarding
        if (data.user && !data.user.onboardingCompleted) {
          // Delay onboarding slightly to let the UI render
          setTimeout(() => {
            setRunOnboarding(true);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error fetching portal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    setRunOnboarding(false);

    // Mark onboarding as completed
    try {
      await fetch('/api/portal/onboarding', {
        method: 'POST',
      });

      // Update local state
      if (portalData) {
        setPortalData({
          ...portalData,
          user: {
            ...portalData.user,
            onboardingCompleted: true,
          },
        });
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleOnboardingSkip = async () => {
    setRunOnboarding(false);

    // Mark onboarding as completed (even if skipped)
    try {
      await fetch('/api/portal/onboarding', {
        method: 'POST',
      });

      // Update local state
      if (portalData) {
        setPortalData({
          ...portalData,
          user: {
            ...portalData.user,
            onboardingCompleted: true,
          },
        });
      }
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  const handleReplayTour = async () => {
    // Reset onboarding status
    try {
      await fetch('/api/portal/onboarding', {
        method: 'DELETE',
      });

      // Update local state and start tour
      if (portalData) {
        setPortalData({
          ...portalData,
          user: {
            ...portalData.user,
            onboardingCompleted: false,
          },
        });
      }

      setRunOnboarding(true);
    } catch (error) {
      console.error('Error replaying tour:', error);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-milk-tea/20 via-white to-taro/10 relative overflow-hidden flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center bg-white rounded-xl p-8 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]"
        >
          <motion.div
            className="w-12 h-12 border-4 border-taro/30 border-t-taro rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.p
            className="font-display font-bold text-ink/70 uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Loading your portal...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!portalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-milk-tea/20 via-white to-taro/10 relative overflow-hidden flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center bg-white rounded-xl p-8 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]"
        >
          <p className="font-display font-black uppercase text-ink mb-4">
            Unable to load portal data
          </p>
          <motion.button
            onClick={fetchPortalData}
            className="px-6 py-3 bg-gradient-to-r from-taro to-brown-sugar text-white font-display font-black uppercase rounded-xl border-4 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            data={portalData}
            expandedProjectId={expandedProjectId}
            setExpandedProjectId={setExpandedProjectId}
            onSearchClick={() => setShowGlobalSearch(true)}
            onViewProject={(projectId: string) => {
              setSelectedProjectId(projectId);
              setActiveTab('projects');
            }}
            onTabChange={(tab: string) => setActiveTab(tab)}
          />
        );
      case 'projects':
        if (selectedProjectId) {
          return (
            <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
              <ProjectDetails
                projectId={selectedProjectId}
                onBack={() => {
                  setSelectedProjectId(null);
                  setActiveTab('dashboard');
                }}
              />
            </div>
          );
        }
        // If no project selected, show project list
        return (
          <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <h2 className="font-black text-2xl text-ink uppercase mb-6">Your Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portalData.projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className="text-left bg-cream rounded-lg border-3 border-ink p-6 hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  <h3 className="font-black text-lg text-ink uppercase mb-2">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-ink/70 font-bold mb-4">{project.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-taro uppercase">{project.status}</span>
                    <span className="text-xs font-bold text-ink/60">{project.progress}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 'tasks':
        // Lock tasks for non-subscribers
        if (!portalData.subscription.isActive) {
          return (
            <LockedFeature
              title="Task Management Locked"
              description="Access the powerful kanban board and task management system with any Boba Club subscription."
              requiredTier="any Boba Club tier"
              onUpgrade={() => setActiveTab('billing')}
            >
              <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] min-h-[400px]" />
            </LockedFeature>
          );
        }
        return <TasksView data={portalData} />;
      case 'messages':
        // Lock messages for non-subscribers
        if (!portalData.subscription.isActive) {
          return (
            <LockedFeature
              title="Messaging Locked"
              description="Communicate directly with your team through the message center with any Boba Club subscription."
              requiredTier="any Boba Club tier"
              onUpgrade={() => setActiveTab('billing')}
            >
              <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] min-h-[400px]" />
            </LockedFeature>
          );
        }
        return (
          <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <MessageCenter projects={portalData.projects} />
          </div>
        );
      case 'invoices':
        return (
          <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <InvoiceCenter />
          </div>
        );
      case 'contracts':
        return (
          <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <ContractCenter />
          </div>
        );
      case 'files':
        // Lock file management for non-subscribers
        if (!portalData.subscription.isActive) {
          return (
            <LockedFeature
              title="File Management Locked"
              description="Upload, organize, and access your project files with any Boba Club subscription."
              requiredTier="any Boba Club tier"
              onUpgrade={() => setActiveTab('billing')}
            >
              <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] min-h-[400px]" />
            </LockedFeature>
          );
        }
        return (
          <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <FileCenter projects={portalData.projects} />
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <NotificationCenter />
          </div>
        );
      case 'billing':
        return (
          <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <BillingCenter />
          </div>
        );
      case 'team':
        return (
          <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <TeamManagement onUpgrade={() => setActiveTab('billing')} />
          </div>
        );
      case 'requests':
        return (
          <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <RequestTracking onUpgrade={() => setActiveTab('billing')} />
          </div>
        );
      case 'meetings':
        return (
          <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <MeetingScheduler onUpgrade={() => setActiveTab('billing')} />
          </div>
        );
      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
              <NotificationPreferences />
            </div>

            {/* Replay Onboarding Tour */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-taro/10 to-brown-sugar/10 rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black uppercase text-lg text-ink mb-1">
                    Portal Tour
                  </h3>
                  <p className="text-sm text-ink/60 font-bold">
                    New to the portal? Take a guided tour to learn about all the features.
                  </p>
                </div>
                <button
                  onClick={handleReplayTour}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-taro to-brown-sugar text-white font-black uppercase border-4 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  Start Tour
                </button>
              </div>
            </motion.div>
          </div>
        );
      default:
        return (
          <DashboardView
            data={portalData}
            expandedProjectId={expandedProjectId}
            setExpandedProjectId={setExpandedProjectId}
          />
        );
    }
  };

  return (
    <PortalLayout
      user={{
        name: portalData.user.name || 'User',
        email: portalData.user.email || '',
        image: portalData.user.image,
      }}
      subscription={portalData.subscription}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      badges={{
        messages: portalData.unreadMessages,
        invoices: portalData.pendingInvoices,
        contracts: portalData.pendingContracts,
      }}
      onLogout={handleLogout}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveTab()}
        </motion.div>
      </AnimatePresence>

      {/* Onboarding Tour - Temporarily disabled for React 18 compatibility */}
      {/* <OnboardingTour
        run={runOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      /> */}

      {/* Global Search */}
      <GlobalSearch isOpen={showGlobalSearch} onClose={() => setShowGlobalSearch(false)} />
    </PortalLayout>
  );
}

// Dashboard View Component
function DashboardView({
  data,
  expandedProjectId,
  setExpandedProjectId,
  onSearchClick,
  onViewProject,
  onTabChange,
}: {
  data: PortalData;
  expandedProjectId: string | null;
  setExpandedProjectId: (id: string | null) => void;
  onSearchClick?: () => void;
  onViewProject?: (projectId: string) => void;
  onTabChange?: (tab: string) => void;
}) {
  const activeProjects = data.projects.filter(
    (p) => !['COMPLETED', 'CANCELLED'].includes(p.status)
  );

  // Calculate metrics
  const metrics = [
    {
      title: 'Active Projects',
      value: activeProjects.length,
      change: { value: activeProjects.length > 0 ? 12 : 0, type: 'increase' as const },
      icon: FolderKanban,
      gradient: 'from-taro to-deep-taro',
      subtitle: `${data.projects.length} total`,
    },
    {
      title: 'Tasks Completed',
      value: data.projects.reduce(
        (acc, p) => acc + (p.milestones?.filter((m) => m.completedAt).length || 0),
        0
      ),
      change: { value: 8, type: 'increase' as const },
      icon: CheckCircle2,
      gradient: 'from-matcha to-green-600',
      subtitle: 'This month',
    },
    {
      title: 'Pending Items',
      value: data.unreadMessages + data.pendingInvoices + data.pendingContracts,
      icon: Clock,
      gradient: 'from-thai-tea to-orange-600',
      subtitle: 'Requires attention',
    },
    {
      title: 'Overall Progress',
      value:
        data.projects.length > 0
          ? Math.round(data.projects.reduce((acc, p) => acc + p.progress, 0) / data.projects.length)
          : 0,
      suffix: '%',
      icon: CheckCircle2,
      gradient: 'from-strawberry to-pink-600',
      subtitle: 'Average completion',
    },
  ];

  // Convert projects to the format expected by ProjectCard
  const projectsForCards = activeProjects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    progress: project.progress || 0,
    dueDate: project.deadline ? new Date(project.deadline) : undefined,
    tasksCompleted: project.milestones?.filter((m) => m.completedAt).length || 0,
    totalTasks: project.milestones?.length || 0,
    status:
      project.progress >= 75
        ? ('on-track' as const)
        : project.progress >= 50
          ? ('at-risk' as const)
          : ('delayed' as const),
    teamMembers: [],
  }));

  // Create activity feed
  const activities = [
    ...(data.unreadMessages > 0
      ? [
          {
            id: 'msg-1',
            type: 'comment' as const,
            title: 'New Messages',
            description: `You have ${data.unreadMessages} unread message${data.unreadMessages > 1 ? 's' : ''}`,
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
          },
        ]
      : []),
    ...(data.pendingInvoices > 0
      ? [
          {
            id: 'inv-1',
            type: 'file_uploaded' as const,
            title: 'Pending Invoices',
            description: `${data.pendingInvoices} invoice${data.pendingInvoices > 1 ? 's' : ''} awaiting payment`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          },
        ]
      : []),
    {
      id: 'act-1',
      type: 'task_completed' as const,
      title: 'Project Milestone Reached',
      description: 'Your latest project phase has been completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader
        userName={data.user.name?.split(' ')[0] || 'there'}
        notificationCount={data.unreadMessages + data.pendingInvoices + data.pendingContracts}
        onSearchClick={onSearchClick}
        onNotificationClick={() => onTabChange?.('notifications')}
      />

      {/* Metrics Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        data-tour="dashboard-metrics"
      >
        {metrics.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} delay={index * 0.1} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects - 2/3 width */}
        <div className="lg:col-span-2 space-y-6" data-tour="projects-section">
          <div className="mb-4">
            <h2 className="font-display font-black uppercase text-2xl text-ink mb-2">
              Your Projects
            </h2>
            <p className="text-ink/60 text-sm font-bold">
              Track progress and manage your active projects
            </p>
          </div>

          {projectsForCards.length > 0 ? (
            <div className="space-y-6">
              {/* Project Cards */}
              <div className="grid grid-cols-1 gap-6">
                {projectsForCards.map((project, index) => {
                  const fullProject = activeProjects.find((p) => p.id === project.id);
                  const isExpanded = expandedProjectId === project.id;

                  return (
                    <div key={project.id}>
                      <ProjectCard
                        project={project}
                        delay={0.2 + index * 0.1}
                        onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                      />

                      {/* Expanded Project Details */}
                      {isExpanded && fullProject && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 bg-white border-4 border-ink rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]"
                        >
                          <div className="p-6 space-y-6">
                            {/* Project Description */}
                            {fullProject.description && (
                              <div>
                                <h3 className="font-display font-black uppercase text-lg text-ink mb-2">
                                  About This Project
                                </h3>
                                <p className="text-ink/70 font-bold">{fullProject.description}</p>
                              </div>
                            )}

                            {/* Milestones */}
                            {fullProject.milestones && fullProject.milestones.length > 0 && (
                              <div>
                                <h3 className="font-display font-black uppercase text-lg text-ink mb-3">
                                  Milestones
                                </h3>
                                <div className="space-y-2">
                                  {fullProject.milestones.map((milestone, idx) => (
                                    <div
                                      key={idx}
                                      className={`flex items-center justify-between p-3 rounded-xl ${
                                        milestone.completedAt
                                          ? 'bg-green-50 border border-green-200'
                                          : 'bg-milk-tea/30 border border-brown-sugar/10'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                            milestone.completedAt
                                              ? 'bg-green-500 text-white'
                                              : 'bg-brown-sugar/20 text-ink/40'
                                          }`}
                                        >
                                          {milestone.completedAt ? '✓' : idx + 1}
                                        </div>
                                        <span className="font-bold text-ink">
                                          {milestone.title}
                                        </span>
                                      </div>
                                      {milestone.completedAt && (
                                        <span className="text-xs text-green-600">
                                          Completed{' '}
                                          {new Date(milestone.completedAt).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Website Preview */}
                            {fullProject.websiteUrl && (
                              <div data-tour="website-preview">
                                <h3 className="font-display font-black uppercase text-lg text-ink mb-3">
                                  Live Website Preview
                                </h3>
                                <WebsitePreview
                                  url={fullProject.websiteUrl}
                                  projectName={fullProject.name}
                                />
                              </div>
                            )}

                            {/* Project Timeline */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-taro/10 rounded-xl">
                                <p className="text-xs text-ink/60 mb-1 uppercase font-bold">
                                  Started
                                </p>
                                <p className="font-bold text-ink">
                                  {new Date(fullProject.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                              {fullProject.deadline && (
                                <div className="p-4 bg-brown-sugar/10 rounded-xl">
                                  <p className="text-xs text-ink/60 mb-1 uppercase font-bold">
                                    Target Completion
                                  </p>
                                  <p className="font-bold text-ink">
                                    {new Date(fullProject.deadline).toLocaleDateString('en-US', {
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <motion.div
              className="bg-white rounded-xl p-12 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-taro/20 to-brown-sugar/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="material-symbols:palette-outline" className="text-4xl text-taro/60" />
              </div>
              <h3 className="font-display font-black uppercase text-2xl text-ink mb-2">
                No Active Projects
              </h3>
              <p className="text-ink/60 mb-4 font-bold">
                Ready to start? Your projects will appear here once we begin working together!
              </p>
            </motion.div>
          )}
        </div>

        {/* Activity Feed - 1/3 width */}
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} maxItems={5} />
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-gradient-to-br from-taro/10 to-brown-sugar/10 rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
        <h2 className="font-display font-black uppercase text-xl text-ink mb-4 flex items-center gap-2">
          <Icon icon="material-symbols:bolt" className="text-2xl text-taro" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickActionButton
            icon={<Upload className="w-5 h-5" />}
            label="Upload Files"
            onClick={() => onTabChange?.('files')}
          />
          <QuickActionButton
            icon={<Send className="w-5 h-5" />}
            label="Send Message"
            onClick={() => onTabChange?.('messages')}
          />
          <QuickActionButton
            icon={<Eye className="w-5 h-5" />}
            label="View Invoice"
            onClick={() => onTabChange?.('invoices')}
          />
          <QuickActionButton
            icon={<Plus className="w-5 h-5" />}
            label="New Request"
            onClick={() => onTabChange?.('requests')}
          />
        </div>
      </div>

      {/* Content Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MessagesPreviewCard
          count={data.unreadMessages}
          onClick={() => onTabChange?.('messages')}
        />
        <InvoicesPreviewCard
          count={data.pendingInvoices}
          onClick={() => onTabChange?.('invoices')}
        />
        <ContractsPreviewCard
          count={data.pendingContracts}
          onClick={() => onTabChange?.('contracts')}
        />
      </div>
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] hover:shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-taro to-deep-taro flex items-center justify-center text-white">
        {icon}
      </div>
      <span className="text-xs font-bold text-ink text-center uppercase">{label}</span>
    </motion.button>
  );
}

// Messages Preview Card
function MessagesPreviewCard({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <motion.div
      className="bg-white border-4 border-ink rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className="bg-gradient-to-br from-taro to-deep-taro p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon icon="material-symbols:chat-bubble-outline" className="text-3xl text-white" />
            <h3 className="font-display font-black uppercase text-white">Messages</h3>
          </div>
          {count > 0 && (
            <div className="bg-white text-taro font-bold text-sm px-3 py-1 rounded-full">
              {count}
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        {count > 0 ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brown-sugar to-thai-tea flex items-center justify-center text-white font-bold">
                PM
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">Your Project Manager</p>
                <p className="text-xs text-ink/60 line-clamp-2">
                  {count === 1 ? 'You have 1 unread message' : `You have ${count} unread messages`}
                </p>
                <p className="text-xs text-taro font-bold mt-1">30 minutes ago</p>
              </div>
            </div>
            <button className="w-full py-2 bg-taro/10 text-taro font-bold text-sm rounded-lg hover:bg-taro/20 transition-colors uppercase">
              View All Messages
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <Icon
              icon="material-symbols:check-circle-outline"
              className="text-4xl text-matcha/60 mx-auto mb-2"
            />
            <p className="text-sm font-bold text-ink/60">All caught up!</p>
            <p className="text-xs text-ink/40">No new messages</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Invoices Preview Card
function InvoicesPreviewCard({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <motion.div
      className="bg-white border-4 border-ink rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className="bg-gradient-to-br from-thai-tea to-orange-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon icon="material-symbols:receipt-long-outline" className="text-3xl text-white" />
            <h3 className="font-display font-black uppercase text-white">Invoices</h3>
          </div>
          {count > 0 && (
            <div className="bg-white text-thai-tea font-bold text-sm px-3 py-1 rounded-full">
              {count}
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        {count > 0 ? (
          <div className="space-y-3">
            <div className="bg-thai-tea/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-ink/60 uppercase">Next Payment</span>
                <span className="text-xs font-bold text-thai-tea uppercase">Due Soon</span>
              </div>
              <p className="font-display font-black text-2xl text-ink mb-1">$2,500.00</p>
              <p className="text-xs text-ink/60 font-bold">
                {count === 1 ? '1 invoice' : `${count} invoices`} awaiting payment
              </p>
            </div>
            <button className="w-full py-2 bg-thai-tea/10 text-thai-tea font-bold text-sm rounded-lg hover:bg-thai-tea/20 transition-colors uppercase">
              View & Pay
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <Icon
              icon="material-symbols:check-circle-outline"
              className="text-4xl text-matcha/60 mx-auto mb-2"
            />
            <p className="text-sm font-bold text-ink/60">All paid up!</p>
            <p className="text-xs text-ink/40">No pending invoices</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Contracts Preview Card
function ContractsPreviewCard({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <motion.div
      className="bg-white border-4 border-ink rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className="bg-gradient-to-br from-matcha to-green-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon icon="material-symbols:contract-outline" className="text-3xl text-white" />
            <h3 className="font-display font-black uppercase text-white">Contracts</h3>
          </div>
          {count > 0 && (
            <div className="bg-white text-matcha font-bold text-sm px-3 py-1 rounded-full">
              {count}
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        {count > 0 ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-matcha/10 rounded-lg">
                <Icon icon="material-symbols:edit-document" className="text-lg text-matcha" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-ink">Service Agreement</p>
                  <p className="text-xs text-ink/60">Awaiting signature</p>
                </div>
              </div>
            </div>
            <button className="w-full py-2 bg-matcha/10 text-matcha font-bold text-sm rounded-lg hover:bg-matcha/20 transition-colors uppercase">
              Review & Sign
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <Icon
              icon="material-symbols:check-circle-outline"
              className="text-4xl text-matcha/60 mx-auto mb-2"
            />
            <p className="text-sm font-bold text-ink/60">All signed!</p>
            <p className="text-xs text-ink/40">No pending contracts</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Quick Action Card Component
function QuickActionCard({
  icon,
  title,
  description,
  count,
  onClick,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  count?: number;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative bg-white border-4 border-ink rounded-xl p-6 text-left shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 shadow-lg`}
      >
        {icon}
      </div>
      <h3 className="font-display font-black uppercase text-lg text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink/60 mb-2 font-bold">{description}</p>
      {count !== undefined && count > 0 && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brown-sugar/10 text-brown-sugar rounded-full text-sm font-bold uppercase">
          {count} pending
        </div>
      )}
    </motion.button>
  );
}

// Tasks View Component
function TasksView({ data }: { data: PortalData }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const activeProjects = data.projects.filter(
    (p) => !['COMPLETED', 'CANCELLED'].includes(p.status)
  );
  const defaultProject = activeProjects.length > 0 ? activeProjects[0] : data.projects[0];

  useEffect(() => {
    if (defaultProject && !selectedProjectId) {
      setSelectedProjectId(defaultProject.id);
    }
  }, [defaultProject, selectedProjectId]);

  if (data.projects.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-xl p-12 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-taro/20 to-brown-sugar/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-taro/60" />
        </div>
        <h3 className="font-display text-2xl font-black uppercase text-ink mb-2">
          No Projects Yet
        </h3>
        <p className="text-ink/60 font-bold">
          Tasks will appear here once you have active projects with us
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Selector */}
      <motion.div
        className="bg-white rounded-xl p-6 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <label className="font-display text-sm font-bold uppercase text-ink/70 mb-3 block">
          Select Project
        </label>
        <select
          value={selectedProjectId || ''}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="w-full px-4 py-3 bg-white border-4 border-ink rounded-xl focus:outline-none focus:ring-2 focus:ring-taro/20 focus:border-taro/40 transition-all font-display font-bold text-ink"
        >
          {data.projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name} ({project.status.toLowerCase().replace('_', ' ')})
            </option>
          ))}
        </select>
      </motion.div>

      {/* Kanban Board */}
      {selectedProjectId && (
        <motion.div
          key={selectedProjectId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProjectTaskBoard
            projectId={selectedProjectId}
            projectName={data.projects.find((p) => p.id === selectedProjectId)?.name || 'Project'}
            currentUser={{
              id: data.user.id,
              role: data.user.role,
              email: data.user.email,
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
