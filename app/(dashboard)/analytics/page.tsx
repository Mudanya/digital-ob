"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-400 mb-6">
          Crime trends and performance metrics
        </p>
        <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
          <TrendingUp className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Advanced Analytics
          </h3>
          <p className="text-gray-400 text-sm">
            Crime patterns, heatmaps, and predictive analytics coming soon
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
