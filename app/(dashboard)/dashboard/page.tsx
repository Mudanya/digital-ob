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
  Users,
  Scale,
  Plus,
  Search,
  FileOutput,
  UserPlus,
} from "lucide-react";

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const response = await fetch("/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      <section className="w-full h-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="animate-pulse w-full">
            <div className="h-20 bg-white/20 rounded w-1/5 mb-6"></div>

          <div className="flex md:flex-row flex-col gap-4 mb-6 sm:mb-8">
            <div className="h-32 bg-white/20 rounded w-1/4 mb-2"></div>
            <div className="h-32 bg-white/20 rounded w-1/4 mb-2"></div>
            <div className="h-32 bg-white/20 rounded w-1/4 mb-2"></div>
            <div className="h-32 bg-white/20 rounded w-1/4 mb-2"></div>
          </div>
          <div className="flex md:flex-row flex-col gap-4 mb-6 sm:mb-8">
            <div className="h-80 bg-white/20 rounded w-2/3"></div>
            <div className="h-80 bg-white/20 rounded w-1/3"></div>
          </div>
           <div className="h-48 bg-white/20 rounded w-1/2"></div>
        </div>
      </section>
    );
  }

  const carditems: DashCardItem[] = [
    {
      title: "Total Cases",
      value: stats?.stats.totalCases.count || 0,
      icon: <FileText className="h-6 w-6" />,
      change: stats?.stats.totalCases.change,
      color: "bg-blue-500",
    },
    {
      title: "Pending Cases",
      value: stats?.stats.pendingCases.count || 0,
      icon: <AlertCircle className="h-6 w-6" />,
      change: `${stats?.stats.pendingCases.urgent || 0} urgent`,
      color: "bg-orange-500",
    },
    {
      title: "Officers Active",
      value: stats?.stats.officersActive.count || 0,
      icon: <Users className="h-6 w-6" />,
      change: stats?.stats.officersActive.status,
      color: "bg-green-500",
    },
    {
      title: "Court Cases",
      value: stats?.stats.courtCases.count || 0,
      icon: <Scale className="h-6 w-6" />,
      change: `${stats?.stats.courtCases.thisWeek || 0} this week`,
      color: "bg-purple-500",
    },
  ];

  return (
    <section className="w-full h-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Dashboard Overview
        </h2>
        <p className="text-sm sm:text-lg mt-1 text-gray-300">
          {user?.station?.name || "National Police Service"} - Real-time
          operational status
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {carditems.map((item) => (
          <DashboardCard key={item.title} {...item} />
        ))}
      </div>

      {/* Recent Cases & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {/* Recent Cases - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 bg-white/12 border border-white/20 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-white/20">
            <h3 className="text-base sm:text-lg font-semibold">Recent Cases</h3>
            <Link
              href={"/cases"}
              className="text-sm sm:text-base text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {stats?.recentCases && stats.recentCases.length > 0 ? (
              stats.recentCases.slice(0, 3).map((caseItem) => (
                <div key={caseItem.id} className="px-4 sm:px-6 py-4 sm:py-5">
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

        {/* Quick Actions - Takes 1 column on large screens */}
        <div className="bg-white/12 rounded-xl border border-white/20 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-white/20">
            <h3 className="text-base sm:text-lg font-semibold">
              Quick Actions
            </h3>
          </div>
          <div className="p-4 sm:p-6 space-y-3">
            <Link
              href={"/cases/new"}
              className="flex items-center gap-3 bg-blue-500 py-3 sm:py-4 px-4 rounded-xl hover:opacity-80 transition-opacity text-sm sm:text-base font-medium"
            >
              <Plus className="h-5 w-5" />
              New OB Entry
            </Link>
            <Link
              href={"/cases"}
              className="flex items-center gap-3 bg-yellow-500 py-3 sm:py-4 px-4 rounded-xl hover:opacity-80 transition-opacity text-sm sm:text-base font-medium"
            >
              <Search className="h-5 w-5" />
              Search Cases
            </Link>
            <Link
              href={"/reports"}
              className="flex items-center gap-3 bg-purple-500 py-3 sm:py-4 px-4 rounded-xl hover:opacity-80 transition-opacity text-sm sm:text-base font-medium"
            >
              <FileOutput className="h-5 w-5" />
              Generate Report
            </Link>
            <Link
              href={"/officers/new"}
              className="flex items-center gap-3 bg-green-500 py-3 sm:py-4 px-4 rounded-xl hover:opacity-80 transition-opacity text-sm sm:text-base font-medium"
            >
              <UserPlus className="h-5 w-5" />
              Add Officer
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/12 rounded-xl border border-white/20 w-full lg:w-2/3 xl:w-1/2">
        <div className="px-4 sm:px-6 py-4 border-b border-white/20">
          <h3 className="text-base sm:text-lg font-semibold">
            Recent Activity
          </h3>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start">
                <div
                  className={`h-10 w-10 rounded-full flex-shrink-0 ${
                    activity.action.includes("RESOLVE") ||
                    activity.action.includes("CLOSE")
                      ? "bg-green-500"
                      : activity.action.includes("CREATE")
                        ? "bg-blue-500"
                        : activity.action.includes("UPDATE")
                          ? "bg-yellow-500"
                          : "bg-purple-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-medium">
                    {activity.action.replace(/_/g, " ").toLowerCase()}
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    by {activity.description} •{" "}
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
