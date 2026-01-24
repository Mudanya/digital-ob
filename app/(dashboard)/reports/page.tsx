'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { FileBarChart } from 'lucide-react';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
        <p className="text-gray-400 mb-6">Generate comprehensive reports</p>
        <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
          <FileBarChart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Report Generation</h3>
          <p className="text-gray-400 text-sm">PDF reports, Excel exports, and data visualization coming soon</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
