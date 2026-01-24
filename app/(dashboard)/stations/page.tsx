'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { Building2 } from 'lucide-react';

export default function StationsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Police Stations</h1>
        <p className="text-gray-400 mb-6">Manage police stations and posts</p>
        <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
          <Building2 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Station Management</h3>
          <p className="text-gray-400 text-sm">Add/edit stations, assign commanders, manage resources</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
