'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  MessageCircle,
  CreditCard,
  ExternalLink,
  FileText,
} from 'lucide-react';

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
            client.pixelboba.com/projects/artisan-studio
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="bg-white rounded-b-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-taro to-deep-taro text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold lowercase">artisan studio redesign</h1>
              <p className="text-taro-100 lowercase">launched 2 weeks ago</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full lowercase">
                live
              </span>
              <button className="bg-white/20 text-white px-3 py-1 rounded-md text-sm lowercase flex items-center space-x-1">
                <ExternalLink className="w-4 h-4" />
                <span>view site</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-milk-tea/10 p-4 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-taro">100%</div>
            <div className="text-xs text-gray-600 lowercase">progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-matcha">95</div>
            <div className="text-xs text-gray-600 lowercase">lighthouse</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ink">12</div>
            <div className="text-xs text-gray-600 lowercase">messages</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-taro">$2.4k</div>
            <div className="text-xs text-gray-600 lowercase">paid</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Tracking */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-ink mb-4 lowercase flex items-center">
                <Clock className="w-5 h-5 mr-2 text-taro" />
                progress tracking
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm lowercase">1) shake - discovery</span>
                  </div>
                  <span className="text-xs text-gray-500">completed</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm lowercase">2) brew - architecture</span>
                  </div>
                  <span className="text-xs text-gray-500">completed</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm lowercase">3) layer - visual design</span>
                  </div>
                  <span className="text-xs text-gray-500">completed</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm lowercase">4) pop - build</span>
                  </div>
                  <span className="text-xs text-gray-500">completed</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm lowercase">5) launch</span>
                  </div>
                  <span className="text-xs text-gray-500">completed</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-taro rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm lowercase">6) refill - ongoing care</span>
                  </div>
                  <span className="text-xs text-taro font-medium">active</span>
                </div>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-ink mb-4 lowercase flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-matcha" />
                recent messages
              </h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border-l-4 border-matcha">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-ink">Scott</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600 lowercase">
                    site is live! analytics and monitoring are all set up. let me know if you notice
                    any issues.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border-l-4 border-gray-200">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-ink">You</span>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600 lowercase">
                    looks amazing! can we add a small contact form to the services page?
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border-l-4 border-taro">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-ink">Joel</span>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                  <p className="text-sm text-gray-600 lowercase">
                    final design files uploaded. mobile version looks perfect now.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Preview */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-ink mb-4 lowercase flex items-center">
                <ExternalLink className="w-5 h-5 mr-2 text-taro" />
                live previews
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block bg-white rounded-lg p-3 hover:bg-gray-50 transition-colors border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm lowercase">staging site</div>
                      <div className="text-xs text-gray-500">updated 2 days ago</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </a>
                <a
                  href="#"
                  className="block bg-white rounded-lg p-3 hover:bg-gray-50 transition-colors border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm lowercase">production site</div>
                      <div className="text-xs text-gray-500">live version</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </a>
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-ink mb-4 lowercase flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-matcha" />
                invoices & payments
              </h3>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3 flex items-center justify-between border">
                  <div>
                    <div className="text-sm font-medium">$1,200.00</div>
                    <div className="text-xs text-gray-500">deposit - paid</div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    paid
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center justify-between border">
                  <div>
                    <div className="text-sm font-medium">$1,200.00</div>
                    <div className="text-xs text-gray-500">final - paid</div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    paid
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center justify-between border">
                  <div>
                    <div className="text-sm font-medium">$99.00</div>
                    <div className="text-xs text-gray-500">care plan - monthly</div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    active
                  </span>
                </div>
              </div>
            </div>

            {/* Files */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-ink mb-4 lowercase flex items-center">
                <FileText className="w-5 h-5 mr-2 text-ink" />
                project files
              </h3>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-2 flex items-center space-x-3 border">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm lowercase">final-designs.zip</div>
                    <div className="text-xs text-gray-500">2.1 MB</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 flex items-center space-x-3 border">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm lowercase">brand-assets.zip</div>
                    <div className="text-xs text-gray-500">4.8 MB</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 flex items-center space-x-3 border">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm lowercase">lighthouse-report.pdf</div>
                    <div className="text-xs text-gray-500">156 KB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-taro/5 to-matcha/5 rounded-xl blur-xl transform scale-105"></div>
    </motion.div>
  );
}
