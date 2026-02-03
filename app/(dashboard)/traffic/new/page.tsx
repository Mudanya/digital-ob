"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Save, X, Car, User, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewTrafficOffensePage() {
  const { token } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    vehicleReg: "",
    driverName: "",
    driverIdNumber: "",
    driverLicense: "",
    offenseType: "SPEEDING",
    location: "",
    fineAmount: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/traffic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/traffic");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create offense");
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
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">New Traffic Stop</h1>
          <p className="text-gray-400 mt-1">Log a traffic offense</p>
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

          {/* Vehicle Information */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Car className="h-5 w-5 text-yellow-400" />
              Vehicle Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vehicle Registration <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  name="vehicleReg"
                  value={formData.vehicleReg}
                  onChange={handleChange}
                  required
                  placeholder="e.g., KAA 123A"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Driver Information */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Driver Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Driver Name <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleChange}
                  required
                  placeholder="Full name of driver"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Driver ID Number
                </label>
                <Input
                  type="text"
                  name="driverIdNumber"
                  value={formData.driverIdNumber}
                  onChange={handleChange}
                  placeholder="National ID or Passport number"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Driver License Number
                </label>
                <Input
                  type="text"
                  name="driverLicense"
                  value={formData.driverLicense}
                  onChange={handleChange}
                  placeholder="DL number (optional)"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Offense Details */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Offense Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Offense Type <span className="text-red-400">*</span>
                </label>
                <Select
                  value={formData.offenseType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, offenseType: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="SPEEDING" className="text-white">
                      Speeding
                    </SelectItem>
                    <SelectItem value="NO_LICENSE" className="text-white">
                      No License
                    </SelectItem>
                    <SelectItem value="NO_INSURANCE" className="text-white">
                      No Insurance
                    </SelectItem>
                    <SelectItem value="DRUNK_DRIVING" className="text-white">
                      Drunk Driving
                    </SelectItem>
                    <SelectItem value="RECKLESS_DRIVING" className="text-white">
                      Reckless Driving
                    </SelectItem>
                    <SelectItem value="ILLEGAL_PARKING" className="text-white">
                      Illegal Parking
                    </SelectItem>
                    <SelectItem value="RED_LIGHT" className="text-white">
                      Running Red Light
                    </SelectItem>
                    <SelectItem value="OVERLOADING" className="text-white">
                      Overloading
                    </SelectItem>
                    <SelectItem value="NO_SEATBELT" className="text-white">
                      No Seatbelt
                    </SelectItem>
                    <SelectItem
                      value="PHONE_WHILE_DRIVING"
                      className="text-white"
                    >
                      Phone While Driving
                    </SelectItem>
                    <SelectItem value="OTHER" className="text-white">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Where the offense occurred"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fine Amount (KES)
                </label>
                <Input
                  type="number"
                  name="fineAmount"
                  value={formData.fineAmount}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Latitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g., -1.2921"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Longitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g., 36.8219"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              href="/traffic"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Logging...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Log Traffic Stop
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
