'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Activity, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: any;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    rank: string;
    serviceNumber: string;
  };
}

export default function AuditLogsPage() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [token, actionFilter]);

  const fetchLogs = async () => {
    if (!token) return;
    
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.append('action', actionFilter);
      
      const response = await fetch(`/api/audit-logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.serviceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${log.user.firstName} ${log.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (action.includes('UPDATE')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (action.includes('DELETE')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (action.includes('LOGIN')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
          <p className="text-gray-400 mt-1">System activity and security logs</p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                <SelectItem value="" className="text-white">All Actions</SelectItem>
                <SelectItem value="USER_LOGIN" className="text-white">User Login</SelectItem>
                <SelectItem value="USER_LOGOUT" className="text-white">User Logout</SelectItem>
                <SelectItem value="CASE_CREATED" className="text-white">Case Created</SelectItem>
                <SelectItem value="CASE_UPDATED" className="text-white">Case Updated</SelectItem>
                <SelectItem value="CASE_DELETED" className="text-white">Case Deleted</SelectItem>
                <SelectItem value="OFFICER_CREATED" className="text-white">Officer Created</SelectItem>
                <SelectItem value="OFFICER_UPDATED" className="text-white">Officer Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Logs List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading activity logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
            <Activity className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Logs Found</h3>
            <p className="text-gray-400">
              {searchTerm || actionFilter ? 'Try adjusting your filters' : 'Activity logs will appear here'}
            </p>
          </div>
        ) : (
          <div className="bg-white/10 rounded-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                      Entity Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                      Metadata
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getActionColor(log.action)}>
                          {log.action.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="text-white font-medium">
                            {log.user.rank} {log.user.firstName} {log.user.lastName}
                          </p>
                          <p className="text-gray-400 text-xs">{log.user.serviceNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {log.entityType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                        {log.metadata ? JSON.stringify(log.metadata) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {log.ipAddress || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
