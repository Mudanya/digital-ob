"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import DashboardCard from "@/components/features/dashboard-card";
import RecentCases from "@/components/features/recent-cases";
import { DashboardStats, DashCardItem } from "@/types";
import Link from "next/link";
import {
  FileText,
  AlertCircle,
  Car,
  Calendar,
  Plus,
  Search,
  MapPin,
  Clock,
} from "lucide-react";

export default function ConstableDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const response = await fetch("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (isLoading) {
    return (
      <div className="animate-pulse p-6">
        <div className="h-8 bg-white/20 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/20 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const carditems: DashCardItem[] = [
    {
      title: "My Reports",
      value: 12,
      icon: FileText,
      change: "+3 this week",
      color: "bg-blue-500",
    },
    {
      title: "Active Cases",
      value: stats?.stats.pendingCases.count || 0,
      icon: AlertCircle,
      change: `${stats?.stats.pendingCases.urgent || 0} urgent`,
      color: "bg-orange-500",
    },
    {
      title: "Traffic Stops",
      value: 23,
      icon: Car,
      change: "This month",
      color: "bg-green-500",
    },
    {
      title: "Patrol Hours",
      value: 156,
      icon: Clock,
      change: "This month",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Field Operations
        </h2>
        <p className="text-sm sm:text-lg mt-1 text-gray-300">
          {user?.station?.name} - Officer {user?.serviceNumber}
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {carditems.map((item) => (
          <DashboardCard key={item.title} {...item} />
        ))}
      </div>

      {/* Current Duty Status */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">ON DUTY</span>
            </div>
            <p className="text-green-100 text-sm">
              Morning Shift • Patrol Beat: Downtown
            </p>
            <p className="text-green-100 text-xs mt-1">
              Shift ends in 4 hours 23 minutes
            </p>
          </div>
          <Calendar className="h-12 w-12 text-green-200 opacity-50" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link
          href={"/cases/new"}
          className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-5 transition-all group"
        >
          <Plus className="h-8 w-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-white mb-1">New OB Entry</h4>
          <p className="text-xs text-gray-400">Report incident</p>
        </Link>

        <Link
          href={"/traffic/new"}
          className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-5 transition-all group"
        >
          <Car className="h-8 w-8 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-white mb-1">Traffic Stop</h4>
          <p className="text-xs text-gray-400">Log offense</p>
        </Link>

        <Link
          href={"/cases"}
          className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-5 transition-all group"
        >
          <Search className="h-8 w-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-white mb-1">Search Cases</h4>
          <p className="text-xs text-gray-400">Find records</p>
        </Link>

        <Link
          href={"/duty-roster"}
          className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-5 transition-all group"
        >
          <Calendar className="h-8 w-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold text-white mb-1">My Schedule</h4>
          <p className="text-xs text-gray-400">View roster</p>
        </Link>
      </div>

      {/* My Recent Cases & Patrol Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* My Recent Cases */}
        <div className="bg-white/12 border border-white/20 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-white/20">
            <h3 className="text-base sm:text-lg font-semibold">
              My Recent Reports
            </h3>
            <Link
              href={"/cases?officer=" + user?.id}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {stats?.recentCases && stats.recentCases.length > 0 ? (
              stats.recentCases.slice(0, 3).map((caseItem) => (
                <div key={caseItem.id} className="px-4 sm:px-6 py-4">
                  <RecentCases caseData={caseItem} />
                </div>
              ))
            ) : (
              <div className="px-4 sm:px-6 py-8 text-center text-gray-400">
                No recent cases
              </div>
            )}
          </div>
        </div>

        {/* Today's Patrol Log */}
        <div className="bg-white/12 border border-white/20 rounded-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-white/20">
            <h3 className="text-base sm:text-lg font-semibold">
              Today's Patrol Log
            </h3>
          </div>
          <div className="p-4 sm:p-6 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Downtown Patrol
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  06:00 - 09:30 • 3.5 hours
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Market Area Check
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  09:30 - 11:00 • 1.5 hours
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  School Zone Patrol
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  11:00 - Current • Ongoing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Briefing */}
      <div className="bg-white/10 rounded-xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Today's Briefing & Alerts
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-300 mb-1">High Alert</h4>
                <p className="text-sm text-red-200">
                  Be vigilant for suspicious vehicle: White Toyota, Reg: KCA
                  123X
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-300 mb-1">Notice</h4>
                <p className="text-sm text-yellow-200">
                  Increased traffic enforcement in CBD area today. Focus on
                  illegal parking.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-300 mb-1">
                  Information
                </h4>
                <p className="text-sm text-blue-200">
                  Community policing meeting scheduled for tomorrow at 14:00
                  hrs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
