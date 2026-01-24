'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from './sidebar';
import { Bell, Search } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-slate-900/50 backdrop-blur-sm border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cases, officers, OB numbers..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Side - Notifications & User */}
            <div className="flex items-center gap-4 ml-6">
              <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Bell className="h-6 w-6 text-gray-300" />
                <span className="absolute top-1 right-1 bg-red-500 h-2 w-2 rounded-full"></span>
              </button>
              
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {user.rank}
                </p>
                <p className="text-xs text-gray-400">
                  {user.station?.name || 'National Police Service'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
