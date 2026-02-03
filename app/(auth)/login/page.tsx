'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [serviceNumber, setServiceNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ serviceNumber, password });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <Shield className="h-16 w-16 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-4xl font-extrabold text-white">Digital OB</h2>
          <p className="mt-2 text-lg text-blue-200">
            National Police Service of Kenya
          </p>
          <p className="mt-1 text-sm text-blue-300">
            Officer Portal - Secure Access
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="serviceNumber"
                className="block text-sm font-medium text-blue-100 mb-2"
              >
                Service Number
              </label>
              <Input
                id="serviceNumber"
                name="serviceNumber"
                type="text"
                required
                value={serviceNumber}
                onChange={(e) => setServiceNumber(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-blue-300 h-12 focus-visible:ring-blue-400"
                placeholder="Enter your service number"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blue-100 mb-2"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-blue-300 h-12 focus-visible:ring-blue-400"
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-900"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-blue-200">
          <p>For technical support, contact your station administrator</p>
          <p className="mt-1">or call the helpdesk at: <span className="font-semibold">0800-POLICE-1</span></p>
        </div>

        {/* Demo Credentials (Remove in production) */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-xs text-yellow-200 font-semibold mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-yellow-100">
            <p>• IG: IG-001 / password123</p>
            <p>• OCS: OCS-001 / password123</p>
            <p>• Constable: PC-001 / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
