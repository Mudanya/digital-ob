'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import Link from 'next/link';
import { Plus, Search, Users, Shield, UserCheck, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Officer {
  id: string;
  serviceNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  rank: string;
  isActive: boolean;
  lastLogin: string | null;
  station: {
    name: string;
    code: string;
  } | null;
  county: {
    name: string;
    code: string;
  } | null;
  _count: {
    casesReported: number;
    casesAssigned: number;
  };
}

export default function OfficersPage() {
  const { token, user } = useAuth();
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const canCreateOfficer = ['INSPECTOR_GENERAL', 'DEPUTY_INSPECTOR_GENERAL', 'OCS', 'COUNTY_COMMANDER'].includes(user?.role || '');

  useEffect(() => {
    fetchOfficers();
  }, [token, roleFilter, statusFilter]);

  const fetchOfficers = async () => {
    if (!token) return;
    
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('isActive', statusFilter);
      
      const response = await fetch(`/api/officers?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setOfficers(data.officers || []);
      }
    } catch (error) {
      console.error('Failed to fetch officers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOfficers = officers.filter(officer =>
    officer.serviceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    if (role.includes('INSPECTOR_GENERAL')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (role.includes('COMMANDER')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (role.includes('OCS') || role.includes('OCPD')) return 'bg-green-500/20 text-green-400 border-green-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const stats = {
    total: officers.length,
    active: officers.filter(o => o.isActive).length,
    inactive: officers.filter(o => !o.isActive).length,
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Officers Management</h1>
            <p className="text-gray-400 mt-1">Manage police officers and personnel</p>
          </div>
          {canCreateOfficer && (
            <Link
              href="/officers/new"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Officer
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm mb-1">Total Officers</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm mb-1">Active</p>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm mb-1">Inactive</p>
                <p className="text-2xl font-bold text-white">{stats.inactive}</p>
              </div>
              <UserX className="h-8 w-8 text-red-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search officers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Ranks</option>
              <option value="INSPECTOR_GENERAL">Inspector General</option>
              <option value="DEPUTY_INSPECTOR_GENERAL">Deputy IG</option>
              <option value="COUNTY_COMMANDER">County Commander</option>
              <option value="OCPD">OCPD</option>
              <option value="OCS">OCS</option>
              <option value="INSPECTOR">Inspector</option>
              <option value="SERGEANT">Sergeant</option>
              <option value="CORPORAL">Corporal</option>
              <option value="CONSTABLE">Constable</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Officers List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading officers...</p>
          </div>
        ) : filteredOfficers.length === 0 ? (
          <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
            <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Officers Found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || roleFilter || statusFilter
                ? 'Try adjusting your filters'
                : 'Add your first officer to get started'}
            </p>
            {!searchTerm && !roleFilter && !statusFilter && canCreateOfficer && (
              <Link
                href="/officers/new"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add First Officer
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOfficers.map((officer) => (
              <div
                key={officer.id}
                className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-6 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${officer.isActive ? 'bg-green-600' : 'bg-gray-600'}`}>
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {officer.rank} {officer.firstName} {officer.lastName}
                      </h3>
                      <p className="text-sm text-gray-400">{officer.serviceNumber}</p>
                    </div>
                  </div>
                  <Badge className={officer.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                    {officer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <Badge className={getRoleBadgeColor(officer.role)}>
                    {officer.role.replace(/_/g, ' ')}
                  </Badge>
                  
                  <div className="text-sm text-gray-300">
                    <p>📧 {officer.email}</p>
                    <p>📱 {officer.phoneNumber}</p>
                  </div>

                  {officer.station && (
                    <p className="text-sm text-blue-400">
                      📍 {officer.station.name}
                    </p>
                  )}

                  {officer.county && !officer.station && (
                    <p className="text-sm text-purple-400">
                      🗺️ {officer.county.name} County
                    </p>
                  )}
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/10 text-xs">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{officer._count.casesReported}</p>
                    <p className="text-gray-400">Reported</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{officer._count.casesAssigned}</p>
                    <p className="text-gray-400">Assigned</p>
                  </div>
                  {officer.lastLogin && (
                    <div className="text-center flex-1">
                      <p className="text-xs text-gray-400">Last Login</p>
                      <p className="text-xs text-white">
                        {new Date(officer.lastLogin).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
