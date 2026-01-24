'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { Scale } from 'lucide-react';

export default function CourtCasesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Court Cases</h1>
        <p className="text-gray-400 mb-6">Track cases in the judicial system</p>
        <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
          <Scale className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Court File Management</h3>
          <p className="text-gray-400 text-sm">Court integration and case tracking coming soon</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
