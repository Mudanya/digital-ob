'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNgaoAuth } from '@/contexts/ngao-auth-context';
import Link from 'next/link';
import { Shield, ArrowLeft, Plus, FileText, Filter } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ACKNOWLEDGED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  REFERRED_TO_POLICE: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
  CLOSED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: 'text-red-400', HIGH: 'text-orange-400', MEDIUM: 'text-yellow-400', LOW: 'text-green-400',
};

const STATUS_OPTIONS = ['ALL', 'SUBMITTED', 'ACKNOWLEDGED', 'REFERRED_TO_POLICE', 'RESOLVED', 'CLOSED'];

export default function NgaoReportsPage() {
  const { ngaoUser, ngaoToken, isLoading } = useNgaoAuth();
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    if (!isLoading && !ngaoUser) router.push('/ngao/login');
  }, [ngaoUser, isLoading]);

  useEffect(() => {
    if (ngaoToken) fetchReports();
  }, [ngaoToken]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ngao/reports', { headers: { Authorization: `Bearer ${ngaoToken}` } });
      if (res.ok) setReports((await res.json()).reports || []);
    } finally {
      setLoading(false);
    }
  };

  const filtered = statusFilter === 'ALL' ? reports : reports.filter(r => r.status === statusFilter);

  if (isLoading || !ngaoUser) return null;

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg"><Shield className="h-5 w-5 text-white" /></div>
          <p className="text-white font-semibold text-sm">NGAO Portal</p>
          <Link href="/ngao/dashboard" className="ml-auto flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Community Reports</h1>
            <p className="text-gray-400 text-sm mt-0.5">All incident reports you have filed</p>
          </div>
          <Link
            href="/ngao/reports/new"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" /> New Report
          </Link>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-green-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {s === 'ALL' ? 'All' : s.replace(/_/g, ' ')}
            </button>
          ))}
          <span className="ml-auto text-gray-500 text-xs">{filtered.length} report{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading reports...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                {statusFilter === 'ALL' ? 'No reports filed yet.' : `No reports with status "${statusFilter.replace(/_/g, ' ')}".`}
              </p>
              {statusFilter === 'ALL' && (
                <Link href="/ngao/reports/new" className="inline-block mt-3 text-green-400 hover:text-green-300 text-sm">
                  File your first report →
                </Link>
              )}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Category</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Priority</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Referred To</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Filed</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{r.title}</p>
                      <p className="text-gray-400 text-xs truncate max-w-xs">{r.location}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{r.category.replace(/_/g, ' ')}</td>
                    <td className={`px-4 py-3 text-xs font-medium ${PRIORITY_COLORS[r.priority] || 'text-gray-400'}`}>
                      {r.priority}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[r.status] || 'bg-gray-500/20 text-gray-400'}`}>
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs">
                      {r.referredToStation ? r.referredToStation.name : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(r.createdAt).toLocaleDateString('en-KE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
