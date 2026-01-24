'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-gray-400 mb-6">Configure system parameters</p>
        <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
          <SettingsIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Configuration</h3>
          <p className="text-gray-400 text-sm">User preferences, system settings, and integrations</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
