'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import Link from 'next/link';
import { Plus, Search, Filter, FileText, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface OBEntry {
  id: string;
  entryNumber: number;
  case: {
    id: string;
    obNumber: string;
    title: string;
    category: string;
    status: string;
    priority: string;
  };
  officer: {
    firstName: string;
    lastName: string;
    rank: string;
  };
  station: {
    name: string;
  };
  entryDate: string;
  description: string;
}

export default function OBEntriesPage() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<OBEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEntries();
  }, [token]);

  const fetchEntries = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/ob-entries', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Failed to fetch OB entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">OB Entries</h1>
            <p className="text-gray-400 mt-1">Digital Occurrence Book Records</p>
          </div>
          <Link
            href="/cases/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="h-5 w-5" />
            New OB Entry
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by OB number, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              <Filter className="h-5 w-5" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              <Calendar className="h-5 w-5" />
              Date Range
            </button>
          </div>
        </div>

        {/* OB Entries List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading OB entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No OB Entries Found</h3>
            <p className="text-gray-400 mb-6">Get started by creating your first OB entry</p>
            <Link
              href="/cases/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create First Entry
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries
              .filter(entry => 
                entry.case.obNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.case.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((entry) => (
                <Link
                  key={entry.id}
                  href={`/cases/${entry.case.id}`}
                  className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-6 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-blue-400 font-mono font-bold">
                          #{entry.entryNumber}
                        </span>
                        <span className="text-white font-semibold">
                          {entry.case.obNumber}
                        </span>
                        <Badge className={getPriorityColor(entry.case.priority)}>
                          {entry.case.priority}
                        </Badge>
                        <Badge className={getStatusColor(entry.case.status)}>
                          {entry.case.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {entry.case.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {entry.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {entry.case.category.replace(/_/g, ' ')}
                        </span>
                        <span>
                          By: {entry.officer.rank} {entry.officer.firstName} {entry.officer.lastName}
                        </span>
                        <span>{entry.station.name}</span>
                        <span>
                          {new Date(entry.entryDate).toLocaleDateString()} at{' '}
                          {new Date(entry.entryDate).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}

        {/* Pagination */}
        {entries.length > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 border border-blue-600 rounded-lg">
              1
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              2
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              3
            </button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
