'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { MapPin, Building2, Users, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface County {
  id: string;
  name: string;
  code: string;
  region: string;
  _count: {
    stations: number;
    users: number;
  };
  activeCases: number;
}

export default function CountiesPage() {
  const { token } = useAuth();
  const [counties, setCounties] = useState<County[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCounties();
  }, [token]);

  const fetchCounties = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/counties', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCounties(data.counties);
      }
    } catch (error) {
      console.error('Failed to fetch counties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCounties = counties.filter(county =>
    county.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    county.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = {
    counties: counties.length,
    stations: counties.reduce((sum, c) => sum + c._count.stations, 0),
    officers: counties.reduce((sum, c) => sum + c._count.users, 0),
    cases: counties.reduce((sum, c) => sum + c.activeCases, 0),
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Counties</h1>
          <p className="text-gray-400 mt-1">National county management - All 47 counties</p>
        </div>

        {/* National Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm mb-1">Total Counties</p>
                <p className="text-2xl font-bold text-white">{totalStats.counties}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm mb-1">Police Stations</p>
                <p className="text-2xl font-bold text-white">{totalStats.stations}</p>
              </div>
              <Building2 className="h-8 w-8 text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm mb-1">Total Officers</p>
                <p className="text-2xl font-bold text-white">{totalStats.officers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400 opacity-50" />
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm mb-1">Active Cases</p>
                <p className="text-2xl font-bold text-white">{totalStats.cases}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search counties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder-gray-400"
          />
        </div>

        {/* Counties Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading counties...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCounties.map((county) => (
              <div
                key={county.id}
                className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-6 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{county.name}</h3>
                      <p className="text-sm text-gray-400">{county.code} • {county.region}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Police Stations</span>
                    <span className="text-white font-semibold">{county._count.stations}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Officers</span>
                    <span className="text-white font-semibold">{county._count.users}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Active Cases</span>
                    <span className="text-orange-400 font-semibold">{county.activeCases}</span>
                  </div>
                </div>

                <Link
                  href={`/counties/${county.id}`}
                  className="mt-4 block text-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
