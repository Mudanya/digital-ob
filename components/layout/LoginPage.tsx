"use client";

import { useState } from "react";
import { Shield, Eye, EyeOff, Loader2, CheckCircle2, Users, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Your authentication logic here
    // Role-based routing will happen after successful login
    
    setTimeout(() => setIsLoading(false), 2000);
  };

  const features = [
    {
      icon: <CheckCircle2 className="h-4 w-4" />,
      text: "Secure role-based access",
    },
    {
      icon: <Users className="h-4 w-4" />,
      text: "Automatic permissions",
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      text: "Real-time management",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-500 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Centered Container - About 50% of page width */}
      <div className="w-full max-w-3xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row">
          {/* Left Section - Branding & Info */}
          <div className="hidden lg:flex lg:w-5/12 p-6 flex-col justify-between rounded-l-2xl bg-white/5 backdrop-blur-sm border-l border-t border-b border-white/10">
            {/* Content */}
            <div>
              {/* Logo */}
              <div className="flex items-center gap-2 mb-6">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-yellow-400/50 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Digital OB</h1>
                  <p className="text-lg text-blue-200">Kenya Police</p>
                </div>
              </div>

              {/* Main Message */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                  Modernizing Law Enforcement
                </h2>
                <p className="text-lg text-blue-100 leading-relaxed">
                  Unified digital platform for case management.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-white">
                    <div className="h-7 w-7 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <span className="text-sm text-blue-100">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Security Notice */}
            <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-2 mt-4">
              <p className="text-sm text-yellow-100">
                <span className="font-semibold">Security:</span> Unauthorized access prohibited.
              </p>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="w-full lg:w-7/12">
            {/* Mobile Logo - Only visible on small screens */}
            <div className="lg:hidden mb-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl mb-3 shadow-lg border-2 border-yellow-400/50">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Digital OB</h1>
              <p className="text-sm text-blue-200">Kenya Police Service</p>
            </div>

            {/* Login Card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl lg:rounded-l-none lg:rounded-r-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-900 to-blue-950 p-5 text-center">
                <div className="hidden lg:inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl mb-2 border-2 border-yellow-400/50 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
                <p className="text-blue-100 text-xs">Sign in to access your dashboard</p>
              </div>

              {/* Form */}
              <div className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Identifier Input */}
                  <div>
                    <label htmlFor="identifier" className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Service Number or Email
                    </label>
                    <Input
                      id="identifier"
                      type="text"
                      required
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      placeholder="Enter credentials"
                      className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 h-10"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter password"
                        className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 h-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Checkbox id="remember-me" />
                      <label
                        htmlFor="remember-me"
                        className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                    <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500">Need help?</span>
                  </div>
                </div>

                {/* Help Links */}
                <div className="space-y-1.5 text-center text-xs">
                  <p className="text-gray-600">
                    Contact station admin or IT support
                  </p>
                  <div className="flex items-center justify-center gap-3 text-blue-600">
                    <a href="mailto:support@digitalob.go.ke" className="hover:text-blue-700 transition-colors font-medium">
                      Email
                    </a>
                    <span className="text-gray-300">|</span>
                    <a href="tel:0800123456" className="hover:text-blue-700 transition-colors font-medium">
                      0800 123 456
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-5 py-2.5 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  © 2026 Kenya Police Service | v2.0.1
                </p>
              </div>
            </div>

            {/* Mobile Security Notice */}
            <div className="lg:hidden mt-3 p-3 bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg">
              <p className="text-xs text-yellow-100 text-center">
                <span className="font-semibold">Security:</span> Unauthorized access prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
