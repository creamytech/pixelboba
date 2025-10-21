'use client';

import { motion } from 'framer-motion';
import {
  User,
  MessageSquare,
  Receipt,
  FileText,
  Folder,
  Bell,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Icon } from '@iconify/react';

export default function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative max-w-4xl mx-auto"
    >
      {/* Browser Chrome */}
      <div className="bg-gray-100 rounded-t-xl p-3 flex items-center space-x-2">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-600">
            client.pixelboba.com
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="bg-gray-50 rounded-b-xl shadow-2xl border border-gray-200 overflow-hidden min-h-[600px]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <Icon icon="ph:drop-duotone" className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">client portal</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">welcome back!</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">scott b</span>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex space-x-0">
            <div className="px-6 py-3 bg-purple-500 text-white text-sm font-medium flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>dashboard</span>
            </div>
            <div className="px-6 py-3 text-gray-600 text-sm font-medium flex items-center space-x-2 hover:bg-gray-50">
              <MessageSquare className="w-4 h-4" />
              <span>messages</span>
            </div>
            <div className="px-6 py-3 text-gray-600 text-sm font-medium flex items-center space-x-2 hover:bg-gray-50 relative">
              <Receipt className="w-4 h-4" />
              <span>invoices</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center">
                1
              </div>
            </div>
            <div className="px-6 py-3 text-gray-600 text-sm font-medium flex items-center space-x-2 hover:bg-gray-50">
              <FileText className="w-4 h-4" />
              <span>contracts</span>
            </div>
            <div className="px-6 py-3 text-gray-600 text-sm font-medium flex items-center space-x-2 hover:bg-gray-50">
              <Folder className="w-4 h-4" />
              <span>files</span>
            </div>
            <div className="px-6 py-3 text-gray-600 text-sm font-medium flex items-center space-x-2 hover:bg-gray-50">
              <Bell className="w-4 h-4" />
              <span>notifications</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Current Project Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">current project</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">artisan coffee redesign</h3>
              <p className="text-gray-600 mb-4">
                redesign and rebuild of existing coffee shop website
              </p>

              <div className="grid grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="text-gray-500">status:</span>
                  <div className="mt-1">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      design
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">deadline:</span>
                  <div className="mt-1 font-medium">tbd</div>
                </div>
                <div>
                  <span className="text-gray-500">started:</span>
                  <div className="mt-1 font-medium">9/4/2025</div>
                </div>
              </div>
            </div>

            {/* Project Progress */}
            <div className="mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4">project milestones</h4>

              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  {/* Progress Circle */}
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#8b5cf6"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${22 * 2.51} ${100 * 2.51}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">22%</span>
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  design
                </span>
                <p className="text-sm text-gray-600 mt-2">designing visuals</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">ACTIVE PROJECTS</span>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Icon icon="ph:fire-duotone" className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">1</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">UNREAD MESSAGES</span>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">0</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">PENDING INVOICES</span>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Icon icon="ph:currency-dollar-duotone" className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">1</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">PENDING CONTRACTS</span>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">0</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">recent activity</h3>
              <span className="text-sm text-gray-500">live updates</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Invoice Pending</span>
                    <span className="text-xs text-gray-500">pending</span>
                  </div>
                  <p className="text-sm text-gray-600">1 invoice awaiting payment</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Milestone Completed</span>
                    <span className="text-xs text-gray-500">3d ago</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    discovery phase finished - design phase starting soon
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Design Review Ready</span>
                    <span className="text-xs text-gray-500">5d ago</span>
                  </div>
                  <p className="text-sm text-gray-600">initial mockups ready for your feedback</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Project Kickoff</span>
                    <span className="text-xs text-gray-500">1w ago</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    welcome to your project! we&apos;re excited to work with you
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/5 to-purple-600/5 rounded-xl blur-xl transform scale-105"></div>
    </motion.div>
  );
}
