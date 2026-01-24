'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DashboardCard from '@/components/features/dashboard-card';
import { DashboardStats, DashCardItem } from '@/types';
import Link from 'next/link';
import {
  FileText,
  AlertCircle,
  Users,
  Scale,
  Plus,
  TrendingUp,
  Building2,
  MapPin,
  Shield,
  Activity,
} from 'lucide-react';

export default function IGDashboard() {
  const { token } = useAuth();
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/20 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const carditems: DashCardItem[] = [
    {
      title: 'Total Cases (National)',
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-white">
          National Command Center
        </h2>
        <p className="text-lg mt-1 text-gray-300">
          Inspector General - National Police Service Overview
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {carditems.map((item) => (
          <DashboardCard key={item.title} {...item} />
        ))}
      </div>

      {/* Additional National Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Link
          href="/counties"
          className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <MapPin className="h-8 w-8 text-white mb-3" />
              <h3 className="text-2xl font-bold text-white">47</h3>
              <p className="text-indigo-200">Counties</p>
            </div>
            <TrendingUp className="h-12 w-12 text-indigo-300 opacity-50" />
          </div>
        </Link>

        <Link
          href="/stations"
          className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <Building2 className="h-8 w-8 text-white mb-3" />
              <h3 className="text-2xl font-bold text-white">850+</h3>
              <p className="text-cyan-200">Police Stations</p>
            </div>
            <TrendingUp className="h-12 w-12 text-cyan-300 opacity-50" />
          </div>
        </Link>

        <Link
          href="/analytics"
          className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-6 hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <Activity className="h-8 w-8 text-white mb-3" />
              <h3 className="text-2xl font-bold text-white">Live</h3>
              <p className="text-pink-200">National Analytics</p>
            </div>
            <TrendingUp className="h-12 w-12 text-pink-300 opacity-50" />
          </div>
        </Link>
      </div>

      {/* Quick Actions for IG */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Link
          href="/officers/new"
          className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 transition-all"
        >
          <Shield className="h-6 w-6 text-blue-400 mb-2" />
          <h4 className="font-semibold text-white">Add Officer</h4>
          <p className="text-xs text-gray-400 mt-1">Create new officer account</p>
        </Link>

        <Link
          href="/stations/new"
          className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 transition-all"
        >
          <Building2 className="h-6 w-6 text-green-400 mb-2" />
          <h4 className="font-semibold text-white">Add Station</h4>
          <p className="text-xs text-gray-400 mt-1">Register new station</p>
        </Link>

        <Link
          href="/reports"
          className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 transition-all"
        >
          <FileText className="h-6 w-6 text-purple-400 mb-2" />
          <h4 className="font-semibold text-white">National Reports</h4>
          <p className="text-xs text-gray-400 mt-1">Generate comprehensive reports</p>
        </Link>

        <Link
          href="/settings"
          className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 transition-all"
        >
          <Activity className="h-6 w-6 text-orange-400 mb-2" />
          <h4 className="font-semibold text-white">System Settings</h4>
          <p className="text-xs text-gray-400 mt-1">Configure system parameters</p>
        </Link>
      </div>

      {/* Recent Activity - National Level */}
      <div className="bg-white/10 rounded-xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent National Activity
        </h3>
        <div className="space-y-3">
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
              >
                <div className="h-10 w-10 bg-blue-500 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">
                    {activity.action.replace(/_/g, ' ').toLowerCase()}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    by {activity.description} •{' '}
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
