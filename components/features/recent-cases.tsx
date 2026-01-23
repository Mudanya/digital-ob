'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CaseCategory, CaseStatus, CasePriority } from '@/types';

interface RecentCasesProps {
  caseData: {
    id: string;
    obNumber: string;
    title: string;
    category: CaseCategory;
    status: CaseStatus;
    priority: CasePriority;
    location: string;
    reportedBy: string;
    station: string;
    createdAt: Date;
  };
}

const RecentCases = ({ caseData }: RecentCasesProps) => {
  const getPriorityColor = (priority: CasePriority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'LOW':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case 'REPORTED':
        return 'bg-blue-500/20 text-blue-400';
      case 'UNDER_INVESTIGATION':
        return 'bg-purple-500/20 text-purple-400';
      case 'ASSIGNED_TO_DCI':
      case 'ASSIGNED_TO_PROSECUTION':
      case 'ASSIGNED_TO_ARBITRATION':
        return 'bg-indigo-500/20 text-indigo-400';
      case 'COURT_FILED':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'RESOLVED':
        return 'bg-green-500/20 text-green-400';
      case 'CLOSED':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <Link
      href={`/cases/${caseData.id}`}
      className="block hover:bg-white/5 transition-colors rounded-lg -m-2 p-2"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500 text-xl font-bold">•</span>
            <h4 className="font-semibold text-sm sm:text-base truncate">
              {caseData.obNumber}
            </h4>
            <Badge className={`${getPriorityColor(caseData.priority)} text-xs`}>
              {caseData.priority}
            </Badge>
          </div>
          <p className="text-sm text-gray-300 mb-1 truncate">{caseData.title}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>{caseData.category.replace(/_/g, ' ')}</span>
            <span>•</span>
            <span>{caseData.location}</span>
            <span>•</span>
            <span>{caseData.reportedBy}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={`${getStatusColor(caseData.status)} text-xs whitespace-nowrap`}>
            {caseData.status.replace(/_/g, ' ')}
          </Badge>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatDate(caseData.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RecentCases;
