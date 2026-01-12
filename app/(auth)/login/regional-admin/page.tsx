"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Users, ArrowLeft } from "lucide-react";

const RegionalAdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    officerId: "",
    password: "",
    region: "",
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Regional Admin Login attempt:", formData);
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
            <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-yellow-500/30">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Regional Admin Login
            </h2>
            <p className="text-gray-300 text-sm">
              For County Commanders and OCPDs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Officer ID */}
            <div>
              <label
                htmlFor="officerId"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Officer ID / Command Number
              </label>
              <input
                type="text"
                id="officerId"
                value={formData.officerId}
                onChange={(e) =>
                  setFormData({ ...formData, officerId: e.target.value })
                }
                placeholder="e.g., OCPD/NBI/001 or CC/NAI/001"
                className="w-full px-4 py-3 bg-white/5 border-2 border-yellow-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Region Selection */}
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                County / Region
              </label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border-2 border-yellow-500 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              >
                <option value="" className="bg-[#1a2332]">
                  Select your county/region
                </option>
                <option value="nairobi" className="bg-[#1a2332]">
                  Nairobi County
                </option>
                <option value="kiambu" className="bg-[#1a2332]">
                  Kiambu County
                </option>
                <option value="machakos" className="bg-[#1a2332]">
                  Machakos County
                </option>
                <option value="kajiado" className="bg-[#1a2332]">
                  Kajiado County
                </option>
                <option value="mombasa" className="bg-[#1a2332]">
                  Mombasa County
                </option>
                <option value="kisumu" className="bg-[#1a2332]">
                  Kisumu County
                </option>
                <option value="nakuru" className="bg-[#1a2332]">
                  Nakuru County
                </option>
                <option value="uasin-gishu" className="bg-[#1a2332]">
                  Uasin Gishu County
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
                  className="w-full px-4 py-3 bg-white/5 border-2 border-yellow-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-12"
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
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-gray-300">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Access Regional Command
            </button>

            {/* Admin Features Notice */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mt-4">
              <p className="text-sm text-orange-200 text-center">
                Regional access includes: Multi-Station Oversight, Resource
                Allocation, County Analytics, and Case Escalation Management
              </p>
            </div>

            {/* Help Section */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-sm text-gray-300 mb-2">
                System access or technical support?
              </p>
              <Link
                href="/support"
                className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
              >
                Contact National IT Helpdesk
              </Link>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Regional Command portal with county-wide access privileges.
            <br />
            All command-level actions are logged and monitored by National HQ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegionalAdminLogin;