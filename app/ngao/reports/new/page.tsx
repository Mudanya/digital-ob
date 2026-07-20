'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNgaoAuth } from '@/contexts/ngao-auth-context';
import Link from 'next/link';
import { Shield, ArrowLeft, Send } from 'lucide-react';

const CATEGORIES = ['THEFT', 'ASSAULT', 'ROBBERY', 'MURDER', 'TRAFFIC', 'DOMESTIC', 'FRAUD', 'CYBERCRIME', 'NARCOTICS', 'OTHER'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function NewNgaoReportPage() {
  const { ngaoUser, ngaoToken, isLoading } = useNgaoAuth();
  const router = useRouter();
  const [stations, setStations] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', category: '', priority: 'MEDIUM',
    location: '', latitude: '', longitude: '', referredToStationId: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !ngaoUser) router.push('/ngao/login');
  }, [ngaoUser, isLoading]);

  useEffect(() => {
    if (ngaoToken) fetchStations();
  }, [ngaoToken]);

  const fetchStations = async () => {
    const res = await fetch('/api/ngao/stations', { headers: { Authorization: `Bearer ${ngaoToken}` } });
    if (res.ok) setStations((await res.json()).stations || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.location) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/ngao/reports', {
        method: 'POST',
        headers: { Authorization: `Bearer ${ngaoToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          latitude: form.latitude ? parseFloat(form.latitude) : undefined,
          longitude: form.longitude ? parseFloat(form.longitude) : undefined,
          referredToStationId: form.referredToStationId || undefined,
        }),
      });
      if (res.ok) {
        router.push('/ngao/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit report.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !ngaoUser) return null;

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg"><Shield className="h-5 w-5 text-white" /></div>
          <p className="text-white font-semibold text-sm">NGAO Portal</p>
          <Link href="/ngao/dashboard" className="ml-auto flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">File Community Report</h1>
          <p className="text-gray-400 text-sm mt-1">Report a community incident or refer it directly to a police station.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <h2 className="text-white font-medium text-sm uppercase tracking-wider">Incident Details</h2>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Brief title describing the incident"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Description *</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe the incident in detail — what happened, who was involved, when it occurred..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                >
                  <option value="" disabled className="bg-slate-800">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-800">{c.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Priority *</label>
                <select
                  value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                >
                  {PRIORITIES.map(p => <option key={p} value={p} className="bg-slate-800">{p}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Location *</label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="Village, sub-location, or area where the incident occurred"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <h2 className="text-white font-medium text-sm uppercase tracking-wider">Police Station Referral (Optional)</h2>
            <p className="text-gray-400 text-xs">If this matter requires police action, refer it directly to a station. The OCS will be notified.</p>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Refer to Station</label>
              <select
                value={form.referredToStationId}
                onChange={e => setForm(f => ({ ...f, referredToStationId: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              >
                <option value="" className="bg-slate-800">No referral — report only</option>
                {stations.map(s => <option key={s.id} value={s.id} className="bg-slate-800">{s.name} ({s.code})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Additional Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Any additional notes for the police..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Link href="/ngao/dashboard" className="flex-1 py-3 text-center border border-white/20 text-gray-300 hover:text-white hover:border-white/40 rounded-xl text-sm font-medium transition-all">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || !form.title || !form.description || !form.category || !form.location}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
