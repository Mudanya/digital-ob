'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Shield, CheckCircle, Clock, AlertTriangle, XCircle, ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';

const STATUS_INFO: Record<string, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  REPORTED: {
    label: 'Reported',
    color: 'text-blue-400',
    icon: <Clock className="h-5 w-5 text-blue-400" />,
    description: 'Your case has been received and is awaiting assignment to an investigating officer.',
  },
  UNDER_INVESTIGATION: {
    label: 'Under Investigation',
    color: 'text-purple-400',
    icon: <Search className="h-5 w-5 text-purple-400" />,
    description: 'An officer has been assigned and is actively investigating your case.',
  },
  ASSIGNED_TO_DCI: {
    label: 'Referred to DCI',
    color: 'text-orange-400',
    icon: <ArrowRight className="h-5 w-5 text-orange-400" />,
    description: 'Your case has been referred to the Directorate of Criminal Investigations for further inquiry.',
  },
  ASSIGNED_TO_PROSECUTION: {
    label: 'Referred to Prosecution',
    color: 'text-yellow-400',
    icon: <ArrowRight className="h-5 w-5 text-yellow-400" />,
    description: 'Your case has been forwarded to the DPP for prosecution.',
  },
  ASSIGNED_TO_ARBITRATION: {
    label: 'Under Arbitration',
    color: 'text-cyan-400',
    icon: <ArrowRight className="h-5 w-5 text-cyan-400" />,
    description: 'Your case is currently being handled through alternative dispute resolution.',
  },
  COURT_FILED: {
    label: 'Court Filed',
    color: 'text-indigo-400',
    icon: <CheckCircle className="h-5 w-5 text-indigo-400" />,
    description: 'This case has been filed in court. Contact the station for hearing details.',
  },
  RESOLVED: {
    label: 'Resolved',
    color: 'text-green-400',
    icon: <CheckCircle className="h-5 w-5 text-green-400" />,
    description: 'Your case has been resolved.',
  },
  CLOSED: {
    label: 'Closed',
    color: 'text-gray-400',
    icon: <XCircle className="h-5 w-5 text-gray-400" />,
    description: 'This case has been closed.',
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  THEFT: 'Theft', ASSAULT: 'Assault', ROBBERY: 'Robbery', MURDER: 'Murder',
  TRAFFIC: 'Traffic', DOMESTIC: 'Domestic Violence', FRAUD: 'Fraud',
  CYBERCRIME: 'Cybercrime', NARCOTICS: 'Narcotics', OTHER: 'Other',
};

export default function TrackCasePage() {
  const [obNumber, setObNumber] = useState('');
  const [caseData, setCaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!obNumber.trim()) return;

    setIsLoading(true);
    setError('');
    setCaseData(null);

    try {
      const res = await fetch(`/api/public/cases?obNumber=${encodeURIComponent(obNumber.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'An error occurred. Please try again.');
      } else {
        setCaseData(data.case);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusInfo = caseData ? (STATUS_INFO[caseData.status] || { label: caseData.status, color: 'text-gray-400', icon: <Clock className="h-5 w-5" />, description: '' }) : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">Kenya Police Service</h1>
            <p className="text-gray-400 text-xs">Digital OB — Case Tracking</p>
          </div>
          <Link href="/login" className="ml-auto text-xs text-gray-400 hover:text-white transition-colors">
            Officer Login →
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start py-16 px-4">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Track Your Case</h2>
            <p className="text-gray-400">Enter the OB number you received when you reported your case at the police station.</p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={obNumber}
                onChange={e => setObNumber(e.target.value)}
                placeholder="e.g. NBI-CENTRAL/2024/0001"
                className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !obNumber.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-medium text-sm">Case Not Found</p>
                <p className="text-red-300/70 text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Result */}
          {caseData && statusInfo && (
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {/* Status banner */}
              <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center gap-3">
                {statusInfo.icon}
                <div>
                  <p className="text-gray-400 text-xs">Case Status</p>
                  <p className={`font-bold text-lg ${statusInfo.color}`}>{statusInfo.label}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-gray-400 text-xs">OB Number</p>
                  <p className="text-white font-mono font-medium">{caseData.obNumber}</p>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4">
                {/* Status description */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-300 text-sm">{statusInfo.description}</p>
                </div>

                {/* Case details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Category</p>
                    <p className="text-white">{CATEGORY_LABELS[caseData.category] || caseData.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Incident Date</p>
                    <p className="text-white">{new Date(caseData.incidentDate).toLocaleDateString('en-KE', { dateStyle: 'long' })}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Location</p>
                    <p className="text-white">{caseData.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Reported On</p>
                    <p className="text-white">{new Date(caseData.createdAt).toLocaleDateString('en-KE', { dateStyle: 'long' })}</p>
                  </div>
                </div>

                {/* Station contact */}
                {caseData.station && (
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-gray-400 text-xs mb-2">Handling Station</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium">{caseData.station.name}</p>
                      {caseData.station.phoneNumber && (
                        <a href={`tel:${caseData.station.phoneNumber}`} className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                          <Phone className="h-4 w-4" />
                          {caseData.station.phoneNumber}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent updates */}
                {caseData.caseUpdates?.length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-gray-400 text-xs mb-3">Recent Updates</p>
                    <div className="space-y-2">
                      {caseData.caseUpdates.map((u: any, i: number) => (
                        <div key={i} className="flex gap-3 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                          <div>
                            <p className="text-white">{u.description}</p>
                            <p className="text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString('en-KE')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Help text */}
          {!caseData && !error && (
            <div className="text-center text-gray-500 text-sm mt-8">
              <p>Your OB number was provided on the slip you received at the station.</p>
              <p className="mt-1">For urgent matters, please call the station directly or dial <span className="text-white font-medium">999</span>.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-white/10 py-4 text-center text-gray-600 text-xs">
        Kenya Police Service — Digital OB System. For emergencies, call 999 or 112.
      </footer>
    </div>
  );
}
