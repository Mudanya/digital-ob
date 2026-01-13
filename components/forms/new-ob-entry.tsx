
import React, { useState } from 'react';
import { X, FilePlus, Info, FileText, AlertCircle, MapPin, Users, Paperclip, ClipboardCheck, UploadCloud, Save, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
const NewOBEntry = () => {
    const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files!);
    setSelectedFiles(files);
    if (files.length > 0) {
      const fileNames = files.map(f => f.name).join(', ');
      alert(`Selected files: ${fileNames}`);
    }
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    alert('OB Entry submitted successfully! OB Number: OB/2024/001568');
  };

  const priorities = [
    { value: 'urgent', label: 'Urgent', subtitle: 'Immediate', color: 'text-red-400' },
    { value: 'high', label: 'High', subtitle: 'Very Important', color: 'text-amber-400' },
    { value: 'medium', label: 'Medium', subtitle: 'Normal', color: 'text-blue-400' },
    { value: 'low', label: 'Low', subtitle: 'Routine', color: 'text-emerald-400' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-white/20 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-700 p-3 rounded-xl">
              <FilePlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">New OB Entry</h2>
              <p className="text-blue-200 text-sm">Record a new occurrence book entry</p>
            </div>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div onSubmit={handleSubmit}>
            {/* Auto-generated Notice */}
            <Alert className="mb-8 bg-blue-500/10 border-blue-500/30 text-white">
              <Info className="w-5 h-5 text-blue-400" />
              <AlertDescription>
                <div className="font-semibold text-blue-400 mb-1">Auto-generated Information</div>
                <div className="text-blue-200 text-sm">OB Number, Date & Time, and Officer details will be automatically recorded</div>
              </AlertDescription>
            </Alert>

            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-4">
                <FileText className="w-5 h-5" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Entry Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors"
                    placeholder="Brief title of the incident"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors" required>
                    <option value="" className="bg-slate-800">Select category</option>
                    <option value="theft" className="bg-slate-800">Theft</option>
                    <option value="assault" className="bg-slate-800">Assault</option>
                    <option value="traffic" className="bg-slate-800">Traffic Incident</option>
                    <option value="domestic" className="bg-slate-800">Domestic Disturbance</option>
                    <option value="robbery" className="bg-slate-800">Robbery</option>
                    <option value="burglary" className="bg-slate-800">Burglary</option>
                    <option value="missing" className="bg-slate-800">Missing Person</option>
                    <option value="accident" className="bg-slate-800">Accident</option>
                    <option value="other" className="bg-slate-800">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Sub-Category
                  </label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors">
                    <option value="" className="bg-slate-800">Select sub-category</option>
                    <option value="armed" className="bg-slate-800">Armed</option>
                    <option value="unarmed" className="bg-slate-800">Unarmed</option>
                    <option value="vehicle" className="bg-slate-800">Vehicle Related</option>
                    <option value="property" className="bg-slate-800">Property</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Priority Level */}
            <div className="mb-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-4">
                <AlertCircle className="w-5 h-5" />
                Priority Level <span className="text-red-400">*</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {priorities.map((priority) => (
                  <div
                    key={priority.value}
                    onClick={() => setSelectedPriority(priority.value)}
                    className={`bg-white/10 border-2 rounded-lg p-4 cursor-pointer text-center transition-all ${
                      selectedPriority === priority.value
                        ? `border-current ${priority.color} bg-white/15`
                        : 'border-white/20 hover:bg-white/15'
                    }`}
                  >
                    <div className={`font-semibold mb-1 ${priority.color}`}>{priority.label}</div>
                    <div className="text-xs opacity-80 text-white">{priority.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incident Details */}
            <div className="mb-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-4">
                <MapPin className="w-5 h-5" />
                Incident Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors"
                    placeholder="Specific location of incident"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Sub-County
                  </label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors">
                    <option value="" className="bg-slate-800">Select sub-county</option>
                    <option value="westlands" className="bg-slate-800">Westlands</option>
                    <option value="dagoretti" className="bg-slate-800">Dagoretti</option>
                    <option value="langata" className="bg-slate-800">Lang&apos;ata</option>
                    <option value="kibra" className="bg-slate-800">Kibra</option>
                    <option value="roysambu" className="bg-slate-800">Roysambu</option>
                    <option value="kasarani" className="bg-slate-800">Kasarani</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Incident Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors resize-y min-h-[100px]"
                    placeholder="Detailed description of the incident..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Parties Involved */}
            <div className="mb-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-4">
                <Users className="w-5 h-5" />
                Parties Involved
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Reporter Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors"
                    placeholder="Name of person reporting"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Reporter ID/Passport
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors"
                    placeholder="ID or passport number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Reporter Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors"
                    placeholder="+254 700 000 000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Reporter Address
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors"
                    placeholder="Physical address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Suspect Information
                  </label>
                  <textarea
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors resize-y min-h-[80px]"
                    placeholder="Details about suspect(s) if known..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Witness Information
                  </label>
                  <textarea
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors resize-y min-h-[80px]"
                    placeholder="Details about witness(es) if any..."
                  />
                </div>
              </div>
            </div>

            {/* Evidence & Attachments */}
            <div className="mb-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-4">
                <Paperclip className="w-5 h-5" />
                Evidence & Attachments
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Upload Files
                  </label>
                  <div
                    // onClick={() => document.getElementById('fileInput').click()}
                    className="bg-white/5 border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:bg-white/10 hover:border-blue-400 transition-colors"
                  >
                    <UploadCloud className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <div className="text-blue-200 text-sm mb-2">Click to upload or drag and drop</div>
                    <div className="text-gray-400 text-xs">PDF, Images, Documents (Max 10MB each)</div>
                  </div>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors resize-y min-h-[100px]"
                    placeholder="Any additional information or notes..."
                  />
                </div>
              </div>
            </div>

            {/* Action Required */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-4">
                <ClipboardCheck className="w-5 h-5" />
                Action Required
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Assign To
                  </label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors">
                    <option value="" className="bg-slate-800">Select officer</option>
                    <option value="officer1" className="bg-slate-800">PC Mary Wanjiku</option>
                    <option value="officer2" className="bg-slate-800">Cpl James Ochieng</option>
                    <option value="officer3" className="bg-slate-800">PC Grace Muthoni</option>
                    <option value="officer4" className="bg-slate-800">Sgt John Kamau</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Follow-up Required
                  </label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors">
                    <option value="yes" className="bg-slate-800">Yes</option>
                    <option value="no" className="bg-slate-800">No</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Immediate Action Taken
                  </label>
                  <textarea
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors resize-y min-h-[80px]"
                    placeholder="Describe any immediate actions taken..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/20 p-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/15 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/15 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Submit Entry
          </button>
        </div>
      </div>

      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
    </div>
  );
}

export default NewOBEntry