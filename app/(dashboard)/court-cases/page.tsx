"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Scale, Plus, Search, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CourtFile {
  id: string;
  caseNumber: string;
  courtName: string;
  filingDate: string;
  hearingDate: string | null;
  verdict: string | null;
  status: string;
  notes: string | null;
  case: {
    obNumber: string;
    title: string;
    category: string;
    station: {
      name: string;
    };
  };
  filedBy: {
    firstName: string;
    lastName: string;
    rank: string;
    serviceNumber: string;
  };
}

export default function CourtCasesPage() {
  const { token } = useAuth();
  const [courtFiles, setCourtFiles] = useState<CourtFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFileModal, setShowFileModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cases, setCases] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    caseId: "",
    courtName: "",
    caseNumber: "",
    filingDate: new Date().toISOString().split("T")[0],
    hearingDate: "",
    notes: "",
  });

  useEffect(() => {
    fetchCourtFiles();
  }, [token, statusFilter]);

  useEffect(() => {
    if (showFileModal) {
      fetchCases();
    }
  }, [showFileModal, token]);

  const fetchCases = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/cases", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCases(data.cases || []);
      }
    } catch (error) {
      console.error("Failed to fetch cases:", error);
    }
  };

  const fetchCourtFiles = async () => {
    if (!token) return;

    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`/api/court-files?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCourtFiles(data.courtFiles || []);
      }
    } catch (error) {
      console.error("Failed to fetch court files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/court-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caseId: formData.caseId,
          courtName: formData.courtName,
          caseNumber: formData.caseNumber,
          filingDate: formData.filingDate,
          hearingDate: formData.hearingDate || null,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        setShowFileModal(false);
        setFormData({
          caseId: "",
          courtName: "",
          caseNumber: "",
          filingDate: new Date().toISOString().split("T")[0],
          hearingDate: "",
          notes: "",
        });
        fetchCourtFiles();
      }
    } catch (error) {
      console.error("Failed to file case:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFiles = courtFiles.filter(
    (file) =>
      file.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.courtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.case.obNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.case.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FILED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "HEARING":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "VERDICT":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "CLOSED":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const stats = {
    total: courtFiles.length,
    filed: courtFiles.filter((f) => f.status === "FILED").length,
    pending: courtFiles.filter((f) => f.status === "PENDING").length,
    closed: courtFiles.filter((f) => f.status === "CLOSED").length,
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Court Cases</h1>
            <p className="text-gray-400 mt-1">Track cases filed in court</p>
          </div>
          <button
            onClick={() => setShowFileModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="h-5 w-5" />
            File Court Case
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm mb-1">Total Cases</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Scale className="h-8 w-8 text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm mb-1">Filed</p>
                <p className="text-2xl font-bold text-white">{stats.filed}</p>
              </div>
              <FileText className="h-8 w-8 text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm mb-1">Pending</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Closed</p>
                <p className="text-2xl font-bold text-white">{stats.closed}</p>
              </div>
              <Scale className="h-8 w-8 text-gray-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by case number, court name, or OB number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                <SelectItem value="all" className="text-white">
                  All Status
                </SelectItem>
                <SelectItem value="FILED" className="text-white">
                  Filed
                </SelectItem>
                <SelectItem value="PENDING" className="text-white">
                  Pending
                </SelectItem>
                <SelectItem value="HEARING" className="text-white">
                  Hearing
                </SelectItem>
                <SelectItem value="VERDICT" className="text-white">
                  Verdict
                </SelectItem>
                <SelectItem value="CLOSED" className="text-white">
                  Closed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Court Files List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading court cases...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
            <Scale className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Court Cases
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter
                ? "No cases match your filters"
                : "No cases have been filed in court yet"}
            </p>
            <button
              onClick={() => setShowFileModal(true)}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Plus className="h-5 w-5" />
              File First Court Case
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-6 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-purple-600 p-2 rounded-lg">
                        <Scale className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {file.caseNumber}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {file.courtName}
                        </p>
                      </div>
                      <Badge className={getStatusColor(file.status)}>
                        {file.status}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <Link
                        href={`/cases/${file.case.obNumber}`}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        OB: {file.case.obNumber}
                      </Link>
                      <p className="text-gray-300">{file.case.title}</p>
                      <p className="text-sm text-gray-400">
                        {file.case.category.replace(/_/g, " ")} •{" "}
                        {file.case.station.name}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          Filed:{" "}
                          {new Date(file.filingDate).toLocaleDateString()}
                        </span>
                      </div>

                      {file.hearingDate && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="h-4 w-4 text-yellow-400" />
                          <span>
                            Hearing:{" "}
                            {new Date(file.hearingDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="font-semibold">Filed by:</span>
                        <span>
                          {file.filedBy.rank} {file.filedBy.firstName}{" "}
                          {file.filedBy.lastName}
                        </span>
                      </div>
                    </div>

                    {file.verdict && (
                      <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-sm text-green-400 font-semibold mb-1">
                          Verdict:
                        </p>
                        <p className="text-sm text-gray-300">{file.verdict}</p>
                      </div>
                    )}

                    {file.notes && !file.verdict && (
                      <p className="text-sm text-gray-400 mt-3 italic">
                        {file.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* File Court Case Modal */}
        {showFileModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-white/20 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">
                File Court Case
              </h3>

              <form onSubmit={handleFileCase} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Case <span className="text-red-400">*</span>
                    </label>
                    <Select
                      value={formData.caseId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, caseId: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                        <SelectValue placeholder="Select Case" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        <SelectItem value="-" className="text-white">
                          Select Case
                        </SelectItem>
                        {cases.map((caseItem) => (
                          <SelectItem
                            key={caseItem.id}
                            value={caseItem.id}
                            className="text-white"
                          >
                            {caseItem.obNumber} - {caseItem.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Court Name <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.courtName}
                      onChange={(e) =>
                        setFormData({ ...formData, courtName: e.target.value })
                      }
                      placeholder="e.g., Milimani Law Courts"
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Court Case Number <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.caseNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, caseNumber: e.target.value })
                      }
                      placeholder="e.g., CMCC-12345/2024"
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Filing Date <span className="text-red-400">*</span>
                      </label>
                      <Input
                        type="date"
                        required
                        value={formData.filingDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            filingDate: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Hearing Date
                      </label>
                      <Input
                        type="date"
                        value={formData.hearingDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hearingDate: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notes
                    </label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                      placeholder="Additional notes about the court filing..."
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowFileModal(false)}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Filing..." : "File Case"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
