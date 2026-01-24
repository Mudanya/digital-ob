'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Save, X, MapPin, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewCasePage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    priority: 'MEDIUM',
    location: '',
    latitude: '',
    longitude: '',
    incidentDate: new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
          longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/cases/${data.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create case');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">New OB Entry</h1>
          <p className="text-gray-400 mt-1">Create a new occurrence book entry</p>
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

          {/* Case Information */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Case Information</h3>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Case Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of the incident"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Detailed description of the incident, including what happened, when, where, and any other relevant details..."
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="THEFT">Theft</option>
                    <option value="ASSAULT">Assault</option>
                    <option value="ROBBERY">Robbery</option>
                    <option value="MURDER">Murder</option>
                    <option value="TRAFFIC">Traffic Accident</option>
                    <option value="DOMESTIC">Domestic Violence</option>
                    <option value="FRAUD">Fraud</option>
                    <option value="CYBERCRIME">Cybercrime</option>
                    <option value="NARCOTICS">Narcotics</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location and Time */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              Location & Time
            </h3>
            
            <div className="space-y-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Westlands, Nairobi or specific address"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Coordinates (Optional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Latitude (Optional)
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g., -1.2921"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Longitude (Optional)
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g., 36.8219"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Incident Date and Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Incident Date and Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Station Info */}
          {user?.station && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                This case will be registered at: <strong>{user.station.name}</strong>
              </p>
              <p className="text-blue-400 text-xs mt-1">
                An OB number will be automatically generated upon submission
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              href="/cases"
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
                  Create OB Entry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
