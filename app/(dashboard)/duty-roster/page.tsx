'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { Calendar, Clock, Users } from 'lucide-react';

export default function DutyRosterPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Duty Roster</h1>
          <p className="text-gray-400 mt-1">Manage officer schedules and assignments</p>
        </div>

        <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Duty Roster Management</h3>
          <p className="text-gray-400 mb-2">Shift scheduling system coming soon</p>
          <p className="text-sm text-gray-500">
            Features: Shift assignments, officer availability, automatic rotation, and conflict detection
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
