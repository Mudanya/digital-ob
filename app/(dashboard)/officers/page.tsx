'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import Link from 'next/link';
import { Plus, Search, Users, Shield } from 'lucide-react';

export default function OfficersPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Officers Management</h1>
            <p className="text-gray-400 mt-1">Manage police personnel and assignments</p>
          </div>
          <Link
            href="/officers/new"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Officer
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm mb-1">Total Officers</p>
                <p className="text-2xl font-bold text-white">7</p>
              </div>
              <Users className="h-8 w-8 text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm mb-1">On Duty</p>
                <p className="text-2xl font-bold text-white">5</p>
              </div>
              <Shield className="h-8 w-8 text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm mb-1">Off Duty</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
              <Users className="h-8 w-8 text-yellow-400 opacity-50" />
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm mb-1">Leave</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <Users className="h-8 w-8 text-purple-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
          <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Officers Management</h3>
          <p className="text-gray-400 mb-2">Full officer management system coming soon</p>
          <p className="text-sm text-gray-500">
            Features: Add/Edit officers, duty assignments, performance tracking, and more
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
