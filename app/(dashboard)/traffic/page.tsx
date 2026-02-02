'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import Link from 'next/link';
import { Plus, Search, Car, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TrafficOffense {
  id: string;
  offenseNumber: string;
  vehicleReg: string;
  driverName: string;
  driverIdNumber: string | null;
  driverLicense: string | null;
  offenseType: string;
  location: string;
  fineAmount: number | null;
  isPaid: boolean;
  offenseDate: string;
  officer: {
    firstName: string;
    lastName: string;
    rank: string;
    station: {
      name: string;
    };
  };
}

export default function TrafficOffensesPage() {
  const { token } = useAuth();
  const [offenses, setOffenses] = useState<TrafficOffense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOffenses();
  }, [token]);

  const fetchOffenses = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/traffic', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setOffenses(data.offenses || []);
      }
    } catch (error) {
      console.error('Failed to fetch offenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOffenses = offenses.filter(offense =>
    offense.vehicleReg.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offense.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: offenses.length,
    unpaid: offenses.filter(o => !o.isPaid).length,
    paid: offenses.filter(o => o.isPaid).length,
    thisMonth: offenses.filter(o => {
      const date = new Date(o.offenseDate);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
  };

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
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Car className="h-8 w-8 text-yellow-400 opacity-50" />
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm mb-1">Unpaid</p>
                <p className="text-2xl font-bold text-white">{stats.unpaid}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400 opacity-50" />
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm mb-1">Paid</p>
                <p className="text-2xl font-bold text-white">{stats.paid}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm mb-1">This Month</p>
                <p className="text-2xl font-bold text-white">{stats.thisMonth}</p>
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
              placeholder="Search by vehicle registration or driver name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* Offenses List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading offenses...</p>
          </div>
        ) : filteredOffenses.length === 0 ? (
          <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
            <Car className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Traffic Offenses</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'No results found' : 'Start logging traffic violations from the field'}
            </p>
            {!searchTerm && (
              <Link
                href="/traffic/new"
                className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Plus className="h-5 w-5" />
                Log First Offense
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOffenses.map((offense) => (
              <div
                key={offense.id}
                className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-6 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-yellow-600 p-2 rounded-lg">
                        <Car className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {offense.vehicleReg}
                        </h3>
                        <p className="text-sm text-gray-400">{offense.driverName}</p>
                      </div>
                      <Badge
                        className={
                          offense.isPaid
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }
                      >
                        {offense.isPaid ? 'PAID' : 'UNPAID'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="font-semibold">Offense:</span>
                        <span>{offense.offenseType.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="font-semibold">Offense #:</span>
                        <span>{offense.offenseNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="font-semibold">Location:</span>
                        <span>{offense.location}</span>
                      </div>
                      {offense.fineAmount && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <DollarSign className="h-4 w-4" />
                          <span>KES {offense.fineAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(offense.offenseDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="font-semibold">By:</span>
                        <span>
                          {offense.officer.rank} {offense.officer.firstName} {offense.officer.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <span>{offense.officer.station.name}</span>
                      </div>
                      {offense.driverLicense && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <span className="font-semibold">DL:</span>
                          <span>{offense.driverLicense}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
