"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Shield } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    badgeNumber: "",
    password: "",
    rememberMe: false,
  });
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", formData);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a2332] via-[#1e3a5f] to-[#1a2332] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="flex-1 text-white space-y-6 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="rounded-xl  flex items-center justify-center shadow-xl">
              <div className="h-full w-auto overflow-hidden rounded ">
                <Image
                  className="object-contain"
                  src="/logo.png"
                  alt="logo"
                  width={35}
                  height={35}
                />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold">Digital OB</h1>
              <p className="text-sm text-gray-400">Kenya Police Service</p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <h2 className="text-3xl font-bold leading-tight">
              Modernizing Law Enforcement
              <br />
              Record Management
            </h2>
            <p className="text-gray-300 text-lg max-w-md mx-auto lg:mx-0">
              Secure, efficient, and real-time occurrence book management system
              for Kenya Police Service stations nationwide.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {[
              {
                title: "Real-time Updates",
                desc: "Instant case synchronization",
              },
              { title: "Secure Access", desc: "Role-based authentication" },
              { title: "Digital Records", desc: "Paperless case management" },
              { title: "Analytics", desc: "Comprehensive reporting" },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
              >
                <h4 className="font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-[480px]">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Officer Login
              </h2>
              <p className="text-gray-300 text-sm">
                Enter your credentials to access the system
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Badge Number */}
              <div>
                <label
                  htmlFor="badgeNumber"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Badge Number / Service Number
                </label>
                <input
                  type="text"
                  id="badgeNumber"
                  value={formData.badgeNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, badgeNumber: e.target.value })
                  }
                  placeholder="e.g., NM/12345"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
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
                onClick={()=>{
                    router.push('/dashboard')
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">
                    Need help?
                  </span>
                </div>
              </div>

              {/* Help Links */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-300">
                  Contact your station administrator or
                </p>
                <Link
                  href="/support"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                >
                  <Shield className="h-4 w-4" />
                  IT Support Center
                </Link>
              </div>
            </form>
          </div>

          {/* Footer Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              This is a restricted system for authorized Kenya Police Service
              personnel only.
              <br />
              Unauthorized access is prohibited and will be prosecuted.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500">
        <p>© 2026 Kenya Police Service. All rights reserved. | Version 1.0.1</p>
      </div>
    </div>
  );
};

export default LoginPage;
