'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { TrendingUp, BarChart3, PieChart, MapPin, Calendar, AlertTriangle } from 'lucide-react';

export default function AnalyticsPage() {
  const { token, user } = useAuth();
  const [dateRange, setDateRange] = useState('month');
  const [stats, setStats] = useState({
    totalCases: 145,
    solvedCases: 98,
    pendingCases: 47,
    trafficOffenses: 234,
    courtCases: 56,
    activeOfficers: 127,
  });

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Data insights and performance metrics</p>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-4 mb-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">Total Cases</h3>
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">{stats.totalCases}</p>
            <div className="flex items-center text-sm text-green-400">
              <span>↑ 12.5%</span>
              <span className="text-gray-400 ml-2">vs last period</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">Solved Cases</h3>
              <BarChart3 className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">{stats.solvedCases}</p>
            <div className="flex items-center text-sm">
              <span className="text-green-400">67.6% solve rate</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">Pending Cases</h3>
              <AlertTriangle className="h-5 w-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">{stats.pendingCases}</p>
            <div className="flex items-center text-sm text-orange-400">
              <span>32.4% pending</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Crime Trends */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Crime Trends
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 78, 45, 89, 67, 92, 78, 56, 73, 88, 95, 82].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-2">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Case Categories */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-400" />
              Case Categories
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Theft', value: 34, color: 'bg-blue-500' },
                { name: 'Traffic', value: 28, color: 'bg-yellow-500' },
                { name: 'Assault', value: 18, color: 'bg-red-500' },
                { name: 'Fraud', value: 12, color: 'bg-purple-500' },
                { name: 'Other', value: 8, color: 'bg-gray-500' },
              ].map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-300">{category.name}</span>
                    <span className="text-white font-semibold">{category.value}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} rounded-full`}
                      style={{ width: `${category.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Response Time */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Avg Response Time</h3>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-400 mb-2">24m</p>
              <p className="text-sm text-gray-400">18m faster than target</p>
              <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-600 to-green-400 w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Case Resolution Rate */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Resolution Rate</h3>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-400 mb-2">67.6%</p>
              <p className="text-sm text-gray-400">Above national average</p>
              <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 w-2/3"></div>
              </div>
            </div>
          </div>

          {/* Officer Efficiency */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Officer Efficiency</h3>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-400 mb-2">8.4</p>
              <p className="text-sm text-gray-400">Cases per officer</p>
              <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 w-5/6"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Heat Map Placeholder */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-400" />
            Crime Heat Map
          </h3>
          <div className="h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Geographic crime data visualization</p>
              <p className="text-sm text-gray-500 mt-2">Heat map integration coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
