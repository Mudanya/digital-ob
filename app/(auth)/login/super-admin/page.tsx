"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Shield, ArrowLeft } from "lucide-react";

const SuperAdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [formData, setFormData] = useState({
    commandId: "",
    password: "",
    twoFactorCode: "",
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!show2FA) {
      // Simulate password verification, then show 2FA
      setShow2FA(true);
    } else {
      // Handle final login with 2FA
      console.log("Super Admin Login attempt:", formData);
    }
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
          {/* Security Badge */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full">
              <Lock className="h-3 w-3 text-red-400" />
              <span className="text-xs text-red-300 font-medium">
                Maximum Security
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8 mt-4">
            <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-yellow-500/30">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              National Command Login
            </h2>
            <p className="text-gray-300 text-sm">
              Inspector General & Deputy IG Access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!show2FA ? (
              <>
                {/* Command ID */}
                <div>
                  <label
                    htmlFor="commandId"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    National Command ID
                  </label>
                  <input
                    type="text"
                    id="commandId"
                    value={formData.commandId}
                    onChange={(e) =>
                      setFormData({ ...formData, commandId: e.target.value })
                    }
                    placeholder="e.g., IG/2024/001 or DIG/2024/001"
                    className="w-full px-4 py-3 bg-white/5 border-2 border-yellow-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    required
                  />
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
                      className="w-full px-4 py-3 bg-white/5 border-2 border-yellow-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-12"
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
                        setFormData({
                          ...formData,
                          rememberMe: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-gray-300">
                      Remember this device
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Reset password
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Continue to 2FA Verification
                </button>
              </>
            ) : (
              <>
                {/* 2FA Section */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-5 w-5 text-red-400" />
                    <h3 className="text-white font-semibold">
                      Two-Factor Authentication
                    </h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="twoFactorCode"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Authentication Code
                  </label>
                  <input
                    type="text"
                    id="twoFactorCode"
                    value={formData.twoFactorCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        twoFactorCode: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-yellow-500 rounded-xl text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    required
                    autoFocus
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Access National Command Center
                </button>

                <button
                  type="button"
                  onClick={() => setShow2FA(false)}
                  className="w-full text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ← Back to login
                </button>
              </>
            )}

            {/* Super Admin Features Notice */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-4">
              <p className="text-sm text-red-200 text-center font-medium">
                Full system access including: National Dashboard, All Station
                Oversight, System Configuration, User Management, and Judiciary
                Integration
              </p>
            </div>

            {/* Help Section */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-sm text-gray-300 mb-2">
                Critical system access issues?
              </p>
              <Link
                href="/support"
                className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center justify-center gap-1"
              >
                <Shield className="h-4 w-4" />
                Emergency IT Support Hotline
              </Link>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            <span className="text-red-400 font-medium">
              RESTRICTED ACCESS:
            </span>{" "}
            National Command Portal
            <br />
            All access attempts are logged, monitored, and require multi-factor
            authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;