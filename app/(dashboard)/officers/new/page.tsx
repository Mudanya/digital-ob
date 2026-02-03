"use client";

import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Save, X, User, Shield, MapPin, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Station {
  id: string;
  name: string;
  code: string;
}

interface County {
  id: string;
  name: string;
  code: string;
}

export default function NewOfficerPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [counties, setCounties] = useState<County[]>([]);

  const [formData, setFormData] = useState({
    serviceNumber: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "CONSTABLE",
    rank: "Constable",
    stationId: "",
    countyId: "",
  });

  useEffect(() => {
    fetchStations();
    fetchCounties();
  }, [token]);

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

  const fetchCounties = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/counties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCounties(data.counties || []);
      }
    } catch (error) {
      console.error("Failed to fetch counties:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/officers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          stationId: formData.stationId || null,
          countyId: formData.countyId || null,
        }),
      });

      if (response.ok) {
        router.push("/officers");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create officer");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Add New Officer</h1>
          <p className="text-gray-400 mt-1">Register a new police officer</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Personal Information */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="+254 712 345678"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="officer@police.go.ke"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              Service Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Number <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  name="serviceNumber"
                  value={formData.serviceNumber}
                  onChange={handleChange}
                  required
                  placeholder="PC-12345"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Min 8 characters"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role <span className="text-red-400">*</span>
                </label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem
                      value="INSPECTOR_GENERAL"
                      className="text-white"
                    >
                      Inspector General
                    </SelectItem>
                    <SelectItem
                      value="DEPUTY_INSPECTOR_GENERAL"
                      className="text-white"
                    >
                      Deputy Inspector General
                    </SelectItem>
                    <SelectItem value="COUNTY_COMMANDER" className="text-white">
                      County Commander
                    </SelectItem>
                    <SelectItem value="OCPD" className="text-white">
                      OCPD
                    </SelectItem>
                    <SelectItem value="OCS" className="text-white">
                      OCS
                    </SelectItem>
                    <SelectItem value="OCP" className="text-white">
                      OCP
                    </SelectItem>
                    <SelectItem value="INSPECTOR" className="text-white">
                      Inspector
                    </SelectItem>
                    <SelectItem value="SERGEANT" className="text-white">
                      Sergeant
                    </SelectItem>
                    <SelectItem value="CORPORAL" className="text-white">
                      Corporal
                    </SelectItem>
                    <SelectItem value="CONSTABLE" className="text-white">
                      Constable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rank <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Constable, Sergeant"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-400" />
              Assignment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Station (Optional)
                </label>
                <Select
                  value={formData.stationId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, stationId: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                    <SelectValue placeholder="No Station Assignment" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="-" className="text-white">
                      No Station Assignment
                    </SelectItem>
                    {stations.map((station) => (
                      <SelectItem
                        key={station.id}
                        value={station.id}
                        className="text-white"
                      >
                        {station.name} ({station.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  County (Optional)
                </label>
                <Select
                  value={formData.countyId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, countyId: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                    <SelectValue placeholder="No County Assignment" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="-" className="text-white">
                      No County Assignment
                    </SelectItem>
                    {counties.map((county) => (
                      <SelectItem
                        key={county.id}
                        value={county.id}
                        className="text-white"
                      >
                        {county.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              href="/officers"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Create Officer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
