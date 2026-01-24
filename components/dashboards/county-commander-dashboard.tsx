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
  Building2,
  MapPin,
  TrendingUp,
  Car,
  Calendar,
} from 'lucide-react';

export default function CountyCommanderDashboard() {
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
      title: 'County Cases',
      value: stats?.stats.totalCases.count || 0,
      icon: FileText,
      change: stats?.stats.totalCases.change,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending Cases',
      value: stats?.stats.pendingCases.count || 0,
      icon: AlertCircle,
      change: `${stats?.stats.pendingCases.urgent || 0} urgent`,
      color: 'bg-orange-500',
    },
    {
      title: 'County Officers',
      value: stats?.stats.officersActive.count || 0,
      icon: Users,
      change: stats?.stats.officersActive.status,
      color: 'bg-green-500',
    },
    {
      title: 'Court Cases',
      value: stats?.stats.courtCases.count || 0,
      icon: Scale,
      change: `${stats?.stats.courtCases.thisWeek || 0} this week`,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-white">
          County Command Center
        </h2>
        <p className="text-lg mt-1 text-gray-300">
          {user?.county?.name} County - Operational Overview
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {carditems.map((item) => (
          <DashboardCard key={item.title} {...item} />
        ))}
      </div>

      {/* County Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Link
          href="/stations"
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 hover:shadow-xl transition-all"
        >
          <Building2 className="h-8 w-8 text-white mb-3" />
          <h3 className="text-2xl font-bold text-white">12</h3>
          <p className="text-blue-200">Police Stations in County</p>
        </Link>

        <Link
          href="/traffic"
          className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-6 hover:shadow-xl transition-all"
        >
          <Car className="h-8 w-8 text-white mb-3" />
          <h3 className="text-2xl font-bold text-white">245</h3>
          <p className="text-amber-200">Traffic Offenses (This Month)</p>
        </Link>

        <Link
          href="/analytics"
          className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 hover:shadow-xl transition-all"
        >
          <TrendingUp className="h-8 w-8 text-white mb-3" />
          <h3 className="text-2xl font-bold text-white">-12%</h3>
          <p className="text-emerald-200">Crime Rate (vs Last Month)</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Link
          href="/cases/new"
          className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 transition-all"
        >
          <FileText className="h-6 w-6 text-blue-400 mb-2" />
          <h4 className="font-semibold text-white">New Case</h4>
          <p className="text-xs text-gray-400 mt-1">Create OB entry</p>
        </Link>

        <Link
          href="/officers"
          className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 transition-all"
        >
          <Users className="h-6 w-6 text-green-400 mb-2" />
          <h4 className="font-semibold text-white">Manage Officers</h4>
          <p className="text-xs text-gray-400 mt-1">County personnel</p>
        </Link>

        <Link
          href="/duty-roster"
          className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 transition-all"
        >
          <Calendar className="h-6 w-6 text-purple-400 mb-2" />
          <h4 className="font-semibold text-white">Duty Rosters</h4>
          <p className="text-xs text-gray-400 mt-1">Schedule management</p>
        </Link>

        <Link
          href="/reports"
          className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 transition-all"
        >
          <TrendingUp className="h-6 w-6 text-orange-400 mb-2" />
          <h4 className="font-semibold text-white">County Reports</h4>
          <p className="text-xs text-gray-400 mt-1">Generate analytics</p>
        </Link>
      </div>

      {/* Stations Performance */}
      <div className="bg-white/10 rounded-xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Station Performance Overview
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Central Station', cases: 45, resolved: 38, percentage: 84 },
            { name: 'Kilimani Station', cases: 32, resolved: 28, percentage: 87 },
            { name: 'Ruiru Station', cases: 28, resolved: 20, percentage: 71 },
          ].map((station) => (
            <div
              key={station.name}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-white">{station.name}</h4>
                <p className="text-xs text-gray-400">
                  {station.cases} cases • {station.resolved} resolved
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-400">
                  {station.percentage}%
                </p>
                <p className="text-xs text-gray-400">Resolution rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
