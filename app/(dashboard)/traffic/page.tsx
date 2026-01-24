'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import Link from 'next/link';
import { Plus, Search, Car, Calendar, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TrafficOffensesPage() {
  const { token } = useAuth();
  const [offenses, setOffenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data for now - implement API later
    setOffenses([]);
    setIsLoading(false);
  }, [token]);

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Traffic Offenses</h1>
            <p className="text-gray-400 mt-1">Manage traffic violations and fines</p>
          </div>
          <Link
            href="/traffic/new"
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Traffic Stop
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm mb-1">Total Offenses</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <Car className="h-8 w-8 text-yellow-400 opacity-50" />
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm mb-1">Unpaid</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-400 opacity-50" />
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm mb-1">Paid</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm mb-1">This Month</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by vehicle registration, driver name, or offense number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
          <Car className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Traffic Offenses</h3>
          <p className="text-gray-400 mb-6">Start logging traffic violations from the field</p>
          <Link
            href="/traffic/new"
            className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="h-5 w-5" />
            Log First Offense
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
