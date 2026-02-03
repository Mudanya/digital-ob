'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  Edit,
  Trash2,
  FileText,
  Users,
  Package,
  Scale,
} from 'lucide-react';
import Link from 'next/link';

export default function CaseDetailPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchCaseDetail();
    }
  }, [params.id, token]);

  const fetchCaseDetail = async () => {
    if (!token) return;

    try {
      const response = await fetch(`/api/cases/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCaseData(data);
        setNewStatus(data.status);
      } else {
        router.push('/cases');
      }
    } catch (error) {
      console.error('Failed to fetch case:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!token || !newStatus) return;
    
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/cases/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchCaseDetail();
        setShowStatusModal(false);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!caseData) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <p className="text-gray-400">Case not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REPORTED': return 'bg-blue-500/20 text-blue-400';
      case 'UNDER_INVESTIGATION': return 'bg-purple-500/20 text-purple-400';
      case 'RESOLVED': return 'bg-green-500/20 text-green-400';
      case 'CLOSED': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/cases"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cases
          </Link>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{caseData.obNumber}</h1>
                <Badge className={getPriorityColor(caseData.priority)}>
                  {caseData.priority}
                </Badge>
                <Badge className={getStatusColor(caseData.status)}>
                  {caseData.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              <p className="text-xl text-gray-300">{caseData.title}</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowStatusModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
                Update Status
              </button>
            </div>
          </div>
        </div>

        {/* Case Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white/10 rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Case Description</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{caseData.description}</p>
            </div>

            {/* Location */}
            <div className="bg-white/10 rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                Location Details
              </h3>
              <div className="space-y-2">
                <p className="text-gray-300">{caseData.location}</p>
                {caseData.latitude && caseData.longitude && (
                  <p className="text-sm text-gray-400">
                    Coordinates: {caseData.latitude}, {caseData.longitude}
                  </p>
                )}
              </div>
            </div>

            {/* Suspects */}
            {caseData.suspects && caseData.suspects.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-400" />
                  Suspects ({caseData.suspects.length})
                </h3>
                <div className="space-y-3">
                  {caseData.suspects.map((suspect: any) => (
                    <div key={suspect.id} className="p-4 bg-white/5 rounded-lg">
                      <p className="font-semibold text-white">
                        {suspect.firstName} {suspect.lastName}
                      </p>
                      {suspect.idNumber && (
                        <p className="text-sm text-gray-400">ID: {suspect.idNumber}</p>
                      )}
                      {suspect.isCustody && (
                        <Badge className="mt-2 bg-red-500/20 text-red-400">In Custody</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence */}
            {caseData.evidence && caseData.evidence.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-400" />
                  Evidence ({caseData.evidence.length})
                </h3>
                <div className="space-y-3">
                  {caseData.evidence.map((evidence: any) => (
                    <div key={evidence.id} className="p-4 bg-white/5 rounded-lg">
                      <p className="font-semibold text-white">{evidence.type}</p>
                      <p className="text-sm text-gray-400 mt-1">{evidence.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Collected: {new Date(evidence.collectedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Case Information */}
            <div className="bg-white/10 rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Case Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="text-white font-medium">{caseData.category.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Incident Date</p>
                  <p className="text-white font-medium">
                    {new Date(caseData.incidentDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Reported Date</p>
                  <p className="text-white font-medium">
                    {new Date(caseData.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Reported By */}
            <div className="bg-white/10 rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" />
                Reported By
              </h3>
              <div>
                <p className="text-white font-medium">
                  {caseData.reportedBy.rank} {caseData.reportedBy.firstName} {caseData.reportedBy.lastName}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Service No: {caseData.reportedBy.serviceNumber}
                </p>
              </div>
            </div>

            {/* Assigned To */}
            {caseData.assignedTo && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Assigned To</h3>
                <div>
                  <p className="text-white font-medium">
                    {caseData.assignedTo.rank} {caseData.assignedTo.firstName} {caseData.assignedTo.lastName}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Service No: {caseData.assignedTo.serviceNumber}
                  </p>
                </div>
              </div>
            )}

            {/* Station */}
            <div className="bg-white/10 rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Station</h3>
              <div>
                <p className="text-white font-medium">{caseData.station.name}</p>
                <p className="text-sm text-gray-400 mt-1">Code: {caseData.station.code}</p>
              </div>
            </div>

            {/* Court Files */}
            {caseData.courtFiles && caseData.courtFiles.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-purple-400" />
                  Court Files
                </h3>
                <div className="space-y-2">
                  {caseData.courtFiles.map((file: any) => (
                    <div key={file.id} className="p-3 bg-white/5 rounded-lg">
                      <p className="text-sm font-medium text-white">{file.courtName}</p>
                      <p className="text-xs text-gray-400 mt-1">Case No: {file.caseNumber}</p>
                      <Badge className="mt-2 text-xs">{file.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Case Updates Timeline */}
        {caseData.caseUpdates && caseData.caseUpdates.length > 0 && (
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Case Timeline</h3>
            <div className="space-y-4">
              {caseData.caseUpdates.map((update: any, index: number) => (
                <div key={update.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    {index < caseData.caseUpdates.length - 1 && (
                      <div className="flex-1 w-0.5 bg-white/20 min-h-8"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-white font-medium">{update.updateType}</p>
                    <p className="text-gray-400 text-sm mt-1">{update.description}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(update.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-white/20 p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Update Case Status</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Status
                </label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="REPORTED" className="text-white">Reported</SelectItem>
                    <SelectItem value="UNDER_INVESTIGATION" className="text-white">Under Investigation</SelectItem>
                    <SelectItem value="ASSIGNED_TO_DCI" className="text-white">Assigned to DCI</SelectItem>
                    <SelectItem value="ASSIGNED_TO_PROSECUTION" className="text-white">Assigned to Prosecution</SelectItem>
                    <SelectItem value="ASSIGNED_TO_ARBITRATION" className="text-white">Assigned to Arbitration</SelectItem>
                    <SelectItem value="COURT_FILED" className="text-white">Court Filed</SelectItem>
                    <SelectItem value="RESOLVED" className="text-white">Resolved</SelectItem>
                    <SelectItem value="CLOSED" className="text-white">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdatingStatus}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
