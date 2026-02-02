'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import Link from 'next/link';
import { Plus, Search, Filter, SlidersHorizontal, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CasesPage() {
  const { token } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REPORTED': return 'bg-blue-500/20 text-blue-400';
      case 'UNDER_INVESTIGATION': return 'bg-purple-500/20 text-purple-400';
      case 'RESOLVED': return 'bg-green-500/20 text-green-400';
      case 'CLOSED': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  useEffect(() => {
    fetchCases();
  }, [token, statusFilter, priorityFilter, categoryFilter]);

  const fetchCases = async () => {
    if (!token) return;
    
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      
      const response = await fetch(`/api/cases?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCases(data.cases || []);
      }
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCases = cases.filter(c =>
    c.obNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Case Management</h1>
            <p className="text-gray-400 mt-1">View and manage all cases</p>
          </div>
          <Link
            href="/cases/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Case
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by OB number or case title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="REPORTED">Reported</option>
                <option value="UNDER_INVESTIGATION">Under Investigation</option>
                <option value="ASSIGNED_TO_DCI">Assigned to DCI</option>
                <option value="ASSIGNED_TO_PROSECUTION">Assigned to Prosecution</option>
                <option value="COURT_FILED">Court Filed</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="THEFT">Theft</option>
                <option value="ASSAULT">Assault</option>
                <option value="ROBBERY">Robbery</option>
                <option value="MURDER">Murder</option>
                <option value="TRAFFIC">Traffic</option>
                <option value="DOMESTIC">Domestic</option>
                <option value="FRAUD">Fraud</option>
                <option value="CYBERCRIME">Cybercrime</option>
                <option value="NARCOTICS">Narcotics</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 text-sm mb-1">Total Cases</p>
            <p className="text-2xl font-bold text-white">{cases.length}</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <p className="text-orange-400 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-white">
              {cases.filter(c => c.status === 'REPORTED' || c.status === 'UNDER_INVESTIGATION').length}
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm mb-1">Urgent</p>
            <p className="text-2xl font-bold text-white">
              {cases.filter(c => c.priority === 'URGENT').length}
            </p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 text-sm mb-1">Resolved</p>
            <p className="text-2xl font-bold text-white">
              {cases.filter(c => c.status === 'RESOLVED').length}
            </p>
          </div>
        </div>

        {/* Cases List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading cases...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No Cases Found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter || priorityFilter || categoryFilter
                ? 'Try adjusting your filters'
                : 'Get started by creating your first case'}
            </p>
            {!searchTerm && !statusFilter && !priorityFilter && !categoryFilter && (
              <Link
                href="/cases/new"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create First Case
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map((caseItem) => (
              <Link
                key={caseItem.id}
                href={`/cases/${caseItem.id}`}
                className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-6 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-white">
                        {caseItem.obNumber}
                      </h3>
                      <Badge className={getPriorityColor(caseItem.priority)}>
                        {caseItem.priority}
                      </Badge>
                      <Badge className={getStatusColor(caseItem.status)}>
                        {caseItem.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-lg text-gray-200 mb-3">{caseItem.title}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {caseItem.category.replace(/_/g, ' ')}
                      </span>
                      <span>•</span>
                      <span>{caseItem.location}</span>
                      <span>•</span>
                      <span>
                        {caseItem.reportedBy.rank} {caseItem.reportedBy.firstName}{' '}
                        {caseItem.reportedBy.lastName}
                      </span>
                      <span>•</span>
                      <span>{caseItem.station.name}</span>
                      <span>•</span>
                      <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
