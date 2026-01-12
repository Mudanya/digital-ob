"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Building2, ArrowLeft } from "lucide-react";

const StationAdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    badgeNumber: "",
    password: "",
    station: "",
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Station Admin Login attempt:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#1e3a5f] to-[#1a2332] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-yellow-500/30">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Station Admin Login
            </h2>
            <p className="text-gray-300 text-sm">
              For OCS and Station Inspectors
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Badge Number */}
            <div>
              <label
                htmlFor="badgeNumber"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Badge Number / Officer ID
              </label>
              <input
                type="text"
                id="badgeNumber"
                value={formData.badgeNumber}
                onChange={(e) =>
                  setFormData({ ...formData, badgeNumber: e.target.value })
                }
                placeholder="e.g., INS/12345 or OCS/12345"
                className="w-full px-4 py-3 bg-white/5 border-2 border-yellow-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Station Selection */}
            <div>
              <label
                htmlFor="station"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Station Command
              </label>
              <select
                id="station"
                value={formData.station}
                onChange={(e) =>
                  setFormData({ ...formData, station: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border-2 border-yellow-500 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="" className="bg-[#1a2332]">
                  Select your station
                </option>
                <option value="central" className="bg-[#1a2332]">
                  Central Police Station
                </option>
                <option value="industrial-area" className="bg-[#1a2332]">
                  Industrial Area Police Station
                </option>
                <option value="pangani" className="bg-[#1a2332]">
                  Pangani Police Station
                </option>
                <option value="kilimani" className="bg-[#1a2332]">
                  Kilimani Police Station
                </option>
                <option value="karen" className="bg-[#1a2332]">
                  Karen Police Station
                </option>
                <option value="buruburu" className="bg-[#1a2332]">
                  Buruburu Police Station
                </option>
                <option value="langata" className="bg-[#1a2332]">
                  Langata Police Station
                </option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/5 border-2 border-yellow-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-gray-300">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Access Station Dashboard
            </button>

            {/* Admin Features Notice */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-200 text-center">
                Station Admin access includes: OB Management, Officer Rosters,
                Case Approvals, and Local Analytics
              </p>
            </div>

            {/* Help Section */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-sm text-gray-300 mb-2">
                Technical issues or access problems?
              </p>
              <Link
                href="/support"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Contact Regional IT Support
              </Link>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Station Admin portal with enhanced privileges.
            <br />
            All administrative actions are logged and audited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StationAdminLogin;