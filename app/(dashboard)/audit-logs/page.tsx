"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Activity } from "lucide-react";

export default function AuditLogsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Audit Logs</h1>
        <p className="text-gray-400 mb-6">System activity and security logs</p>
        <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
          <Activity className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Activity Monitoring
          </h3>
          <p className="text-gray-400 text-sm">
            Complete audit trail of all system actions
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
