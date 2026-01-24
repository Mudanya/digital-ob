'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DashboardCard from '@/components/features/dashboard-card';
import RecentCases from '@/components/features/recent-cases';
import { DashboardStats, DashCardItem } from '@/types';
import Link from 'next/link';
import {
  FileText,
  AlertCircle,
  Users,
  Scale,
  Plus,
  Search,
  FileOutput,
  UserPlus,
  Calendar,
  Car,
  Shield,
} from 'lucide-react';

export default function OCSDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (isLoading) {
    return (
      <div className="animate-pulse p-6">
        <div className="h-8 bg-white/20 rounded w-1/4 mb-4"></div>
      </div>
    );
  }

  const carditems: DashCardItem[] = [
    {
      title: 'Total Cases',
      value: stats?.stats.totalCases.count || 0,
      icon: <FileText className="h-6 w-6" />,
      change: stats?.stats.totalCases.change,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending Cases',
      value: stats?.stats.pendingCases.count || 0,
      icon: <AlertCircle className="h-6 w-6" />,
      change: `${stats?.stats.pendingCases.urgent || 0} urgent`,
      color: 'bg-orange-500',
    },
    {
      title: 'Officers Active',
      value: stats?.stats.officersActive.count || 0,
      icon: <Users className="h-6 w-6" />,
      change: stats?.stats.officersActive.status,
      color: 'bg-green-500',
    },
    {
      title: 'Court Cases',
      value: stats?.stats.courtCases.count || 0,
      icon: <Scale className="h-6 w-6" />,
      change: `${stats?.stats.courtCases.thisWeek || 0} this week`,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Station Command Center
        </h2>
        <p className="text-sm sm:text-lg mt-1 text-gray-300">
          {user?.station?.name} - Real-time operational status
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {carditems.map((item) => (
          <DashboardCard key={item.title} {...item} />
        ))}
      </div>

      {/* Recent Cases & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
        {/* Recent Cases */}
        <div className="lg:col-span-2 bg-white/12 border border-white/20 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-white/20">
            <h3 className="text-base sm:text-lg font-semibold">Recent Cases</h3>
            <Link
              href={'/cases'}
              className="text-sm sm:text-base text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {stats?.recentCases && stats.recentCases.length > 0 ? (
              stats.recentCases.slice(0, 3).map((caseItem) => (
                <div key={caseItem.id} className="px-4 sm:px-6 py-4 sm:py-5">
                  <RecentCases caseData={caseItem} />
                </div>
              ))
            ) : (
              <div className="px-4 sm:px-6 py-8 text-center text-gray-400">
                No recent cases
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/12 rounded-xl border border-white/20 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-white/20">
            <h3 className="text-base sm:text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-3">
            <Link
              href={'/cases/new'}
              className="flex items-center gap-3 bg-blue-500 py-3 sm:py-4 px-4 rounded-xl hover:opacity-80 transition-opacity text-sm sm:text-base font-medium"
            >
              <Plus className="h-5 w-5" />
              New OB Entry
            </Link>
            <Link
              href={'/cases'}
              className="flex items-center gap-3 bg-yellow-500 py-3 sm:py-4 px-4 rounded-xl hover:opacity-80 transition-opacity text-sm sm:text-base font-medium"
            >
              <Search className="h-5 w-5" />
              Search Cases
            </Link>
            <Link
              href={'/duty-roster'}
              className="flex items-center gap-3 bg-purple-500 py-3 sm:py-4 px-4 rounded-xl hover:opacity-80 transition-opacity text-sm sm:text-base font-medium"
            >
              <Calendar className="h-5 w-5" />
              Duty Roster
            </Link>
            <Link
              href={'/officers'}
              className="flex items-center gap-3 bg-green-500 py-3 sm:py-4 px-4 rounded-xl hover:opacity-80 transition-opacity text-sm sm:text-base font-medium"
            >
              <UserPlus className="h-5 w-5" />
              Manage Officers
            </Link>
          </div>
        </div>
      </div>

      {/* Station Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* On Duty Officers */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Officers On Duty
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-gray-300">Morning Shift</span>
              <span className="text-sm font-bold text-green-400">8/10</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-gray-300">Afternoon Shift</span>
              <span className="text-sm font-bold text-yellow-400">7/10</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-gray-300">Night Shift</span>
              <span className="text-sm font-bold text-blue-400">8/12</span>
            </div>
          </div>
        </div>

        {/* Today's Activity */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Car className="h-5 w-5 text-orange-400" />
            Today's Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-gray-300">New OB Entries</span>
              <span className="text-lg font-bold text-white">12</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-gray-300">Traffic Stops</span>
              <span className="text-lg font-bold text-white">45</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-gray-300">Cases Resolved</span>
              <span className="text-lg font-bold text-white">8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/12 rounded-xl border border-white/20 w-full">
        <div className="px-4 sm:px-6 py-4 border-b border-white/20">
          <h3 className="text-base sm:text-lg font-semibold">Recent Station Activity</h3>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start">
                <div
                  className={`h-10 w-10 rounded-full flex-shrink-0 ${
                    activity.action.includes('RESOLVE') || activity.action.includes('CLOSE')
                      ? 'bg-green-500'
                      : activity.action.includes('CREATE')
                      ? 'bg-blue-500'
                      : activity.action.includes('UPDATE')
                      ? 'bg-yellow-500'
                      : 'bg-purple-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-medium">
                    {activity.action.replace(/_/g, ' ').toLowerCase()}
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    by {activity.description} •{' '}
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
}
