
import React, { useState } from 'react';
import { X, FilePlus, Info, FileText, AlertCircle, MapPin, Users, Paperclip, ClipboardCheck, UploadCloud, Save, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
                  <Input
                    type="text"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm py-3"
                    placeholder="Brief title of the incident"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm py-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="-" className="text-white">Select category</SelectItem>
                      <SelectItem value="theft" className="text-white">Theft</SelectItem>
                      <SelectItem value="assault" className="text-white">Assault</SelectItem>
                      <SelectItem value="traffic" className="text-white">Traffic Incident</SelectItem>
                      <SelectItem value="domestic" className="text-white">Domestic Disturbance</SelectItem>
                      <SelectItem value="robbery" className="text-white">Robbery</SelectItem>
                      <SelectItem value="burglary" className="text-white">Burglary</SelectItem>
                      <SelectItem value="missing" className="text-white">Missing Person</SelectItem>
                      <SelectItem value="accident" className="text-white">Accident</SelectItem>
                      <SelectItem value="other" className="text-white">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Sub-Category
                  </label>
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm py-3">
                      <SelectValue placeholder="Select sub-category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="-" className="text-white">Select sub-category</SelectItem>
                      <SelectItem value="armed" className="text-white">Armed</SelectItem>
                      <SelectItem value="unarmed" className="text-white">Unarmed</SelectItem>
                      <SelectItem value="vehicle" className="text-white">Vehicle Related</SelectItem>
                      <SelectItem value="property" className="text-white">Property</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Input
                    type="text"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm py-3"
                    placeholder="Specific location of incident"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Sub-County
                  </label>
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm py-3">
                      <SelectValue placeholder="Select sub-county" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="-" className="text-white">Select sub-county</SelectItem>
                      <SelectItem value="westlands" className="text-white">Westlands</SelectItem>
                      <SelectItem value="dagoretti" className="text-white">Dagoretti</SelectItem>
                      <SelectItem value="langata" className="text-white">Lang&apos;ata</SelectItem>
                      <SelectItem value="kibra" className="text-white">Kibra</SelectItem>
                      <SelectItem value="roysambu" className="text-white">Roysambu</SelectItem>
                      <SelectItem value="kasarani" className="text-white">Kasarani</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Incident Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm py-3 resize-y min-h-[100px]"
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
                  <Input
                    type="text"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm py-3"
                    placeholder="Name of person reporting"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Reporter ID/Passport
                  </label>
                  <Input
                    type="text"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm py-3"
                    placeholder="ID or passport number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Reporter Phone
                  </label>
                  <Input
                    type="tel"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm py-3"
                    placeholder="+254 700 000 000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Reporter Address
                  </label>
                  <Input
                    type="text"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm py-3"
                    placeholder="Physical address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Suspect Information
                  </label>
                  <Textarea
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm py-3 resize-y min-h-[80px]"
                    placeholder="Details about suspect(s) if known..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Witness Information
                  </label>
                  <Textarea
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm py-3 resize-y min-h-[80px]"
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
                  <Textarea
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm py-3 resize-y min-h-[100px]"
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
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm py-3">
                      <SelectValue placeholder="Select officer" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="-" className="text-white">Select officer</SelectItem>
                      <SelectItem value="officer1" className="text-white">PC Mary Wanjiku</SelectItem>
                      <SelectItem value="officer2" className="text-white">Cpl James Ochieng</SelectItem>
                      <SelectItem value="officer3" className="text-white">PC Grace Muthoni</SelectItem>
                      <SelectItem value="officer4" className="text-white">Sgt John Kamau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Follow-up Required
                  </label>
                  <Select defaultValue="yes">
                    <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm py-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="yes" className="text-white">Yes</SelectItem>
                      <SelectItem value="no" className="text-white">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Immediate Action Taken
                  </label>
                  <Textarea
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm py-3 resize-y min-h-[80px]"
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