'use client';

import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  CreditCard,
  FileText,
  Upload,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
} from 'lucide-react';
import { Icon } from '@iconify/react';

export default function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative max-w-6xl mx-auto"
    >
      {/* Browser Chrome */}
      <div className="bg-cream rounded-t-xl p-3 flex items-center space-x-2 border-4 border-ink border-b-0">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 bg-strawberry rounded-full border-2 border-ink"></div>
          <div className="w-3 h-3 bg-thai-tea rounded-full border-2 border-ink"></div>
          <div className="w-3 h-3 bg-matcha rounded-full border-2 border-ink"></div>
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white rounded-lg px-4 py-1.5 text-sm font-black text-ink border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]">
            🧋 portal.pixelboba.com
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="bg-gradient-to-br from-milk-tea/20 via-white to-taro/10 rounded-b-xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] overflow-hidden min-h-[700px]">
        {/* Header */}
        <div className="bg-white border-b-4 border-ink p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-taro to-deep-taro rounded-full border-4 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
                <Icon icon="ph:drop-duotone" className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-display text-2xl font-black text-ink uppercase">
                  Client Portal
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="px-3 py-1 bg-gradient-to-r from-taro to-deep-taro text-white rounded-full border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] text-xs font-black uppercase">
                    Taro Cloud
                  </div>
                  <span className="text-sm font-bold text-ink/60">Premium Tier</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-ink cursor-pointer hover:text-taro transition-colors" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-strawberry text-white rounded-full text-xs font-black flex items-center justify-center border-2 border-white">
                  3
                </div>
              </div>
              <div className="flex items-center space-x-3 px-4 py-2 bg-cream rounded-xl border-3 border-ink">
                <div>
                  <div className="text-sm font-black text-ink text-right">Sarah Chen</div>
                  <div className="text-xs font-bold text-ink/60">Team Owner</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-thai-tea to-strawberry rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
                  <span className="text-white font-black text-lg">S</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-cream border-b-4 border-ink px-6">
          <div className="flex space-x-1 overflow-x-auto">
            <div className="px-6 py-4 bg-gradient-to-br from-taro to-deep-taro text-white text-sm font-black flex items-center space-x-2 rounded-t-xl border-3 border-ink border-b-0 shadow-[0px_-2px_0px_0px_rgba(58,0,29,1)] uppercase relative -mb-[4px]">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
            <div className="px-6 py-4 text-ink text-sm font-black flex items-center space-x-2 hover:bg-white/50 transition-all uppercase cursor-pointer">
              <FolderKanban className="w-4 h-4" />
              <span>Projects</span>
            </div>
            <div className="px-6 py-4 text-ink text-sm font-black flex items-center space-x-2 hover:bg-white/50 transition-all uppercase cursor-pointer">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tasks</span>
            </div>
            <div className="px-6 py-4 text-ink text-sm font-black flex items-center space-x-2 hover:bg-white/50 transition-all uppercase cursor-pointer relative">
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
              <div className="absolute top-2 right-2 w-2 h-2 bg-matcha rounded-full border border-white"></div>
            </div>
            <div className="px-6 py-4 text-ink text-sm font-black flex items-center space-x-2 hover:bg-white/50 transition-all uppercase cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Files</span>
            </div>
            <div className="px-6 py-4 text-ink text-sm font-black flex items-center space-x-2 hover:bg-white/50 transition-all uppercase cursor-pointer relative">
              <CreditCard className="w-4 h-4" />
              <span>Invoices</span>
              <div className="absolute top-2 right-2 w-5 h-5 bg-thai-tea text-white rounded-full text-xs font-black flex items-center justify-center border-2 border-white">
                1
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-br from-taro/20 to-deep-taro/20 rounded-xl border-4 border-ink p-6 shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-ink uppercase mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-taro" />
                  Welcome Back, Sarah!
                </h2>
                <p className="text-ink/70 font-bold">
                  Your Brand Redesign project is 68% complete. 2 tasks need your review.
                </p>
              </div>
              <button className="px-6 py-3 bg-gradient-to-br from-taro to-deep-taro text-white font-black rounded-xl border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all uppercase text-sm">
                View Tasks
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border-4 border-ink p-5 shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-ink/60 uppercase">Active Projects</span>
                <div className="w-10 h-10 bg-gradient-to-br from-thai-tea to-strawberry rounded-full border-3 border-ink flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]">
                  <FolderKanban className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-black text-ink">2</div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-matcha" />
                <span className="text-xs font-bold text-matcha">On Track</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border-4 border-ink p-5 shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-ink/60 uppercase">Tasks Due</span>
                <div className="w-10 h-10 bg-gradient-to-br from-matcha to-green-600 rounded-full border-3 border-ink flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-black text-ink">5</div>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3 text-thai-tea" />
                <span className="text-xs font-bold text-thai-tea">2 urgent</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border-4 border-ink p-5 shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-ink/60 uppercase">Team Members</span>
                <div className="w-10 h-10 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-black text-ink">4/5</div>
              <div className="flex items-center gap-1 mt-2">
                <div className="flex -space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-thai-tea to-strawberry rounded-full border-2 border-white"></div>
                  <div className="w-5 h-5 bg-gradient-to-br from-matcha to-green-600 rounded-full border-2 border-white"></div>
                  <div className="w-5 h-5 bg-gradient-to-br from-taro to-deep-taro rounded-full border-2 border-white"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-4 border-ink p-5 shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-ink/60 uppercase">Next Delivery</span>
                <div className="w-10 h-10 bg-gradient-to-br from-milk-tea to-brown-sugar rounded-full border-3 border-ink flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-black text-ink">24h</div>
              <div className="flex items-center gap-1 mt-2">
                <Sparkles className="w-3 h-3 text-taro" />
                <span className="text-xs font-bold text-taro">Express</span>
              </div>
            </div>
          </div>

          {/* Current Project Progress */}
          <div className="bg-white rounded-xl border-4 border-ink p-6 shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-ink uppercase">Brand Redesign Project</h3>
              <div className="px-4 py-2 bg-gradient-to-br from-matcha/20 to-green-600/20 text-matcha rounded-lg border-2 border-matcha font-black text-sm uppercase">
                In Progress
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <span className="text-xs font-black text-ink/60 uppercase block mb-2">
                  Progress
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-3 bg-cream rounded-full border-2 border-ink overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-matcha to-green-600 rounded-full"
                        style={{ width: '68%' }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-ink">68%</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-black text-ink/60 uppercase block mb-2">
                  Deadline
                </span>
                <div className="text-lg font-black text-ink">Feb 28, 2025</div>
              </div>
              <div>
                <span className="text-xs font-black text-ink/60 uppercase block mb-2">
                  Time Tracked
                </span>
                <div className="text-lg font-black text-ink">42.5 hrs</div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'Discovery', status: 'complete' },
                { label: 'Wireframe', status: 'complete' },
                { label: 'Design', status: 'current' },
                { label: 'Development', status: 'pending' },
                { label: 'Launch', status: 'pending' },
              ].map((phase, i) => (
                <div key={i} className="text-center">
                  <div
                    className={`w-full h-2 rounded-full border-2 border-ink mb-2 ${
                      phase.status === 'complete'
                        ? 'bg-matcha'
                        : phase.status === 'current'
                          ? 'bg-thai-tea'
                          : 'bg-cream'
                    }`}
                  ></div>
                  <span className="text-xs font-bold text-ink uppercase">{phase.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border-4 border-ink p-6 shadow-[4px_4px_0px_0px_rgba(58,0,29,1)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-ink uppercase">Recent Activity</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-matcha rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-ink/60 uppercase">Live Updates</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: <CheckCircle2 className="w-4 h-4" />,
                  color: 'from-matcha to-green-600',
                  title: 'Design Review Approved',
                  desc: 'Homepage mockups approved - moving to development',
                  time: '2h ago',
                },
                {
                  icon: <Upload className="w-4 h-4" />,
                  color: 'from-taro to-deep-taro',
                  title: 'New Files Uploaded',
                  desc: '3 brand assets added to project files',
                  time: '5h ago',
                },
                {
                  icon: <MessageSquare className="w-4 h-4" />,
                  color: 'from-thai-tea to-strawberry',
                  title: 'New Message from Alex',
                  desc: 'Color palette feedback requested',
                  time: '1d ago',
                },
                {
                  icon: <Calendar className="w-4 h-4" />,
                  color: 'from-milk-tea to-brown-sugar',
                  title: 'Meeting Scheduled',
                  desc: 'Weekly sync call set for Thursday 2pm',
                  time: '2d ago',
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 bg-cream/30 rounded-lg border-2 border-ink/10 hover:border-taro/30 transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${activity.color} shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]`}
                  >
                    <div className="text-white">{activity.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-black text-ink text-sm uppercase truncate">
                        {activity.title}
                      </span>
                      <span className="text-xs font-bold text-ink/50 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-ink/70">{activity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-taro/10 via-thai-tea/10 to-matcha/10 rounded-xl blur-2xl transform scale-110"></div>
    </motion.div>
  );
}
