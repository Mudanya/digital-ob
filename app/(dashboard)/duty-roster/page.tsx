"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Calendar, Plus, Clock, Users, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface DutyRoster {
  id: string;
  dutyDate: string;
  shiftStart: string;
  shiftEnd: string;
  status: string;
  assignment: string | null;
  notes: string | null;
  officer: {
    firstName: string;
    lastName: string;
    rank: string;
    serviceNumber: string;
  };
  station: {
    name: string;
    code: string;
  };
}

export default function DutyRosterPage() {
  const { token, user } = useAuth();
  const [rosters, setRosters] = useState<DutyRoster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [officers, setOfficers] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    officerId: "",
    stationId: user?.stationId || "",
    dutyDate: new Date().toISOString().split("T")[0],
    shiftStart: "",
    shiftEnd: "",
    status: "ON_DUTY",
    assignment: "",
    notes: "",
  });

  const canCreateRoster = [
    "INSPECTOR_GENERAL",
    "DEPUTY_INSPECTOR_GENERAL",
    "COUNTY_COMMANDER",
    "OCPD",
    "OCS",
  ].includes(user?.role || "");

  useEffect(() => {
    fetchRosters();
  }, [token, selectedDate]);

  useEffect(() => {
    if (showScheduleModal) {
      fetchOfficers();
      fetchStations();
    }
  }, [showScheduleModal, token]);

  const fetchRosters = async () => {
    if (!token) return;

    try {
      const params = new URLSearchParams();
      if (selectedDate) params.append("date", selectedDate);

      const response = await fetch(`/api/duty-roster?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setRosters(data.rosters || []);
      }
    } catch (error) {
      console.error("Failed to fetch rosters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOfficers = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/officers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setOfficers(data.officers || []);
      }
    } catch (error) {
      console.error("Failed to fetch officers:", error);
    }
  };

  const fetchStations = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/stations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStations(data.stations || []);
      }
    } catch (error) {
      console.error("Failed to fetch stations:", error);
    }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Combine date and time
      const startDateTime = new Date(
        `${formData.dutyDate}T${formData.shiftStart}`,
      );
      const endDateTime = new Date(`${formData.dutyDate}T${formData.shiftEnd}`);

      const response = await fetch("/api/duty-roster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          officerId: formData.officerId,
          stationId: formData.stationId,
          dutyDate: formData.dutyDate,
          shiftStart: startDateTime.toISOString(),
          shiftEnd: endDateTime.toISOString(),
          status: formData.status,
          assignment: formData.assignment || null,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        setShowScheduleModal(false);
        setFormData({
          officerId: "",
          stationId: user?.stationId || "",
          dutyDate: new Date().toISOString().split("T")[0],
          shiftStart: "",
          shiftEnd: "",
          status: "ON_DUTY",
          assignment: "",
          notes: "",
        });
        fetchRosters();
      }
    } catch (error) {
      console.error("Failed to create roster:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ON_DUTY":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "OFF_DUTY":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "LEAVE":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "SICK_LEAVE":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "TRAINING":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = {
    total: rosters.length,
    onDuty: rosters.filter((r) => r.status === "ON_DUTY").length,
    offDuty: rosters.filter((r) => r.status === "OFF_DUTY").length,
    leave: rosters.filter(
      (r) => r.status === "LEAVE" || r.status === "SICK_LEAVE",
    ).length,
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Duty Roster</h1>
            <p className="text-gray-400 mt-1">
              Manage officer duty schedules and assignments
            </p>
          </div>
          {canCreateRoster && (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Plus className="h-5 w-5" />
              Schedule Duty
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm mb-1">Total Scheduled</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm mb-1">On Duty</p>
                <p className="text-2xl font-bold text-white">{stats.onDuty}</p>
              </div>
              <Shield className="h-8 w-8 text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Off Duty</p>
                <p className="text-2xl font-bold text-white">{stats.offDuty}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-400 opacity-50" />
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm mb-1">On Leave</p>
                <p className="text-2xl font-bold text-white">{stats.leave}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-white/10 rounded-xl border border-white/20 p-4 mb-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
            <button
              onClick={() =>
                setSelectedDate(new Date().toISOString().split("T")[0])
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        {/* Roster List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading duty roster...</p>
          </div>
        ) : rosters.length === 0 ? (
          <div className="bg-white/10 rounded-xl border border-white/20 p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Duty Scheduled
            </h3>
            <p className="text-gray-400 mb-6">
              No officers scheduled for {selectedDate}
            </p>
            {canCreateRoster && (
              <button
                onClick={() => setShowScheduleModal(true)}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Plus className="h-5 w-5" />
                Schedule First Duty
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {rosters.map((roster) => (
              <div
                key={roster.id}
                className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-6 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {roster.officer.rank} {roster.officer.firstName}{" "}
                          {roster.officer.lastName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {roster.officer.serviceNumber}
                        </p>
                      </div>
                      <Badge className={getStatusColor(roster.status)}>
                        {roster.status.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                          {formatTime(roster.shiftStart)} -{" "}
                          {formatTime(roster.shiftEnd)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-300">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span>{roster.station.name}</span>
                      </div>

                      {roster.assignment && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <span className="font-semibold">Assignment:</span>
                          <span>{roster.assignment}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {new Date(roster.dutyDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {roster.notes && (
                      <p className="text-sm text-gray-400 mt-3 italic">
                        {roster.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Schedule Duty Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-white/20 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">
                Schedule Duty
              </h3>

              <form onSubmit={handleSchedule} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Officer <span className="text-red-400">*</span>
                    </label>
                    <Select
                      value={formData.officerId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, officerId: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                        <SelectValue placeholder="Select Officer" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        <SelectItem value="-" className="text-white">
                          Select Officer
                        </SelectItem>
                        {officers.map((officer) => (
                          <SelectItem
                            key={officer.id}
                            value={officer.id}
                            className="text-white"
                          >
                            {officer.rank} {officer.firstName}{" "}
                            {officer.lastName} ({officer.serviceNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Station <span className="text-red-400">*</span>
                    </label>
                    <Select
                      value={formData.stationId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, stationId: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                        <SelectValue placeholder="Select Station" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        <SelectItem value="-" className="text-white">
                          Select Station
                        </SelectItem>
                        {stations.map((station) => (
                          <SelectItem
                            key={station.id}
                            value={station.id}
                            className="text-white"
                          >
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duty Date <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="date"
                      required
                      value={formData.dutyDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dutyDate: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status <span className="text-red-400">*</span>
                    </label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        <SelectItem value="ON_DUTY" className="text-white">
                          On Duty
                        </SelectItem>
                        <SelectItem value="OFF_DUTY" className="text-white">
                          Off Duty
                        </SelectItem>
                        <SelectItem value="LEAVE" className="text-white">
                          Leave
                        </SelectItem>
                        <SelectItem value="SICK_LEAVE" className="text-white">
                          Sick Leave
                        </SelectItem>
                        <SelectItem value="TRAINING" className="text-white">
                          Training
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Shift Start <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="time"
                      required
                      value={formData.shiftStart}
                      onChange={(e) =>
                        setFormData({ ...formData, shiftStart: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Shift End <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="time"
                      required
                      value={formData.shiftEnd}
                      onChange={(e) =>
                        setFormData({ ...formData, shiftEnd: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Assignment
                    </label>
                    <Input
                      type="text"
                      value={formData.assignment}
                      onChange={(e) =>
                        setFormData({ ...formData, assignment: e.target.value })
                      }
                      placeholder="e.g., Patrol, Desk duty, Investigation"
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notes
                    </label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                      placeholder="Additional notes..."
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Scheduling..." : "Schedule Duty"}
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
