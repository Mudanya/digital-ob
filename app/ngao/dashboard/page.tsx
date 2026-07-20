'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNgaoAuth } from '@/contexts/ngao-auth-context';
import Link from 'next/link';
import {
  Shield, LogOut, FileText, MessageSquare, Plus, Clock, CheckCircle,
  AlertTriangle, ArrowRight, MapPin,
} from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  COUNTY_COMMISSIONER: 'County Commissioner',
  SUB_COUNTY_COMMISSIONER: 'Sub-County Commissioner',
  CHIEF: 'Chief',
  SUB_CHIEF: 'Sub-Chief',
  ASSISTANT_CHIEF: 'Assistant Chief',
  VILLAGE_ELDER: 'Village Elder',
};

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

export default function NgaoDashboardPage() {
  const { ngaoUser, ngaoToken, logout, isLoading } = useNgaoAuth();
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !ngaoUser) router.push('/ngao/login');
  }, [ngaoUser, isLoading]);

  useEffect(() => {
    if (ngaoToken) fetchReports();
  }, [ngaoToken]);

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const res = await fetch('/api/ngao/reports', { headers: { Authorization: `Bearer ${ngaoToken}` } });
      if (res.ok) setReports((await res.json()).reports || []);
    } finally {
      setReportsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/ngao/login');
  };

  if (isLoading || !ngaoUser) return null;

  const stats = {
    total: reports.length,
    pending: reports.filter(r => ['SUBMITTED', 'ACKNOWLEDGED'].includes(r.status)).length,
    referred: reports.filter(r => r.status === 'REFERRED_TO_POLICE').length,
    resolved: reports.filter(r => ['RESOLVED', 'CLOSED'].includes(r.status)).length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{ngaoUser.name}</p>
            <p className="text-green-400 text-xs">{ROLE_LABELS[ngaoUser.role] || ngaoUser.role}</p>
          </div>
          {ngaoUser.location && (
            <div className="flex items-center gap-1 ml-2 text-gray-400 text-xs">
              <MapPin className="h-3 w-3" />
              <span>{ngaoUser.location.name}</span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Link href="/ngao/messages" className="flex items-center gap-1.5 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all text-sm">
              <MessageSquare className="h-4 w-4" /> Messages
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all text-sm">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-0.5">Community incident reports and communication</p>
          </div>
          <Link href="/ngao/reports/new" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" /> New Report
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Reports', value: stats.total, color: 'text-white', icon: <FileText className="h-5 w-5 text-gray-400" /> },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400', icon: <Clock className="h-5 w-5 text-yellow-400" /> },
            { label: 'Referred to Police', value: stats.referred, color: 'text-orange-400', icon: <ArrowRight className="h-5 w-5 text-orange-400" /> },
            { label: 'Resolved', value: stats.resolved, color: 'text-green-400', icon: <CheckCircle className="h-5 w-5 text-green-400" /> },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
              <div className="mt-0.5">{s.icon}</div>
              <div>
                <p className="text-gray-400 text-xs">{s.label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Community Reports</h2>
            <Link href="/ngao/reports" className="text-green-400 hover:text-green-300 text-sm transition-colors">View all →</Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {reportsLoading ? (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No reports filed yet</p>
                <Link href="/ngao/reports/new" className="inline-block mt-3 text-green-400 hover:text-green-300 text-sm">File your first report →</Link>
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
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.slice(0, 8).map(r => (
                    <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{r.title}</p>
                        <p className="text-gray-400 text-xs truncate max-w-xs">{r.location}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs">{r.category.replace(/_/g, ' ')}</td>
                      <td className={`px-4 py-3 text-xs font-medium ${PRIORITY_COLORS[r.priority] || 'text-gray-400'}`}>{r.priority}</td>
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
        </div>
      </main>
    </div>
  );
}
