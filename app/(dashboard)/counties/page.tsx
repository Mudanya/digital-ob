'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { MapPin } from 'lucide-react';

export default function CountiesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Counties</h1>
        <p className="text-gray-400 mb-6">National county management</p>
        <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
          <MapPin className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">County Administration</h3>
          <p className="text-gray-400 text-sm">Manage all 47 counties and regional commands</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
