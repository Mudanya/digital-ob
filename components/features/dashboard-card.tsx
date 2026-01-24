"use client";

import { DashCardItem } from "@/types";

interface DashboardCardProps extends DashCardItem {}

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  change,
  color,
}: DashboardCardProps) => {
  return (
    <div className="bg-white/12 border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm sm:text-base text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            {value}
          </h3>
          {change && (
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
              {change.startsWith("+") ? (
                <span className="text-green-400">↑</span>
              ) : change.includes("urgent") ? (
                <span className="text-red-400">⚠</span>
              ) : (
                <span className="text-blue-400">→</span>
              )}
              {change}
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          {<Icon className="h-6 w-6" />}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
