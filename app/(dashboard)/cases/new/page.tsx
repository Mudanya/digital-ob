"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Save, X, MapPin, Plus, Trash2, User, Users, Package, Car, Lock, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewCasePage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "OTHER",
    priority: "MEDIUM",
    location: "",
    latitude: "",
    longitude: "",
    incidentDate: new Date().toISOString().slice(0, 16),
    assignedToId: "", // Optional officer assignment
    
    // Reporting Persons
    reportingPersons: [{ name: "", contact: "", idNumber: "", address: "" }],
    
    // Witnesses
    witnesses: [{ name: "", contact: "", address: "", statement: "" }],
    
    // Suspects
    suspects: [{ 
      firstName: "", 
      lastName: "", 
      idNumber: "", 
      phoneNumber: "", 
      description: "", 
      charges: "",
      isCustody: false 
    }],
    
    // Items Lost
    itemsLost: [{ description: "", quantity: "1", estimatedValue: "" }],
    
    // Items Recovered
    itemsRecovered: [{ description: "", quantity: "1", condition: "", locationFound: "" }],
    
    // Vehicles
    vehicles: [{ make: "", model: "", registrationNumber: "", color: "", ownerName: "" }],
    
    // Cell Admission
    cellAdmission: {
      admitted: false,
      suspectName: "",
      cellNumber: "",
      admissionTime: "",
      itemsAtCounter: "",
      reason: ""
    },
    
    // Payment
    payment: {
      required: false,
      type: "FINE",
      amount: "",
      status: "PENDING"
    }
  });

  const addItem = (field: string) => {
    const templates: any = {
      reportingPersons: { name: "", contact: "", idNumber: "", address: "" },
      witnesses: { name: "", contact: "", address: "", statement: "" },
      suspects: { firstName: "", lastName: "", idNumber: "", phoneNumber: "", description: "", charges: "", isCustody: false },
      itemsLost: { description: "", quantity: "1", estimatedValue: "" },
      itemsRecovered: { description: "", quantity: "1", condition: "", locationFound: "" },
      vehicles: { make: "", model: "", registrationNumber: "", color: "", ownerName: "" }
    };
    
    setFormData({
      ...formData,
      [field]: [...(formData as any)[field], templates[field]]
    });
  };

  const removeItem = (field: string, index: number) => {
    setFormData({
      ...formData,
      [field]: (formData as any)[field].filter((_: any, i: number) => i !== index)
    });
  };

  const updateItem = (field: string, index: number, key: string, value: any) => {
    const updated = [...(formData as any)[field]];
    updated[index][key] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handlePayLater = () => {
    setFormData({
      ...formData,
      payment: { ...formData.payment, status: "DEFERRED" }
    });
    setShowPaymentModal(false);
  };

  const processPayment = () => {
    // Simulate payment processing
    const transactionId = `TXN${Date.now()}`;
    setFormData({
      ...formData,
      payment: { 
        ...formData.payment, 
        status: "PAID",
        method: paymentMethod,
        transactionId
      } as any
    });
    setShowPaymentModal(false);
    alert(`Payment successful! Transaction ID: ${transactionId}`);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Filter out empty items before submission
      const cleanData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        reportingPersons: formData.reportingPersons.filter(p => p.name),
        witnesses: formData.witnesses.filter(w => w.name),
        suspects: formData.suspects.filter(s => s.firstName && s.lastName),
        itemsLost: formData.itemsLost.filter(i => i.description),
        itemsRecovered: formData.itemsRecovered.filter(i => i.description),
        vehicles: formData.vehicles.filter(v => v.registrationNumber),
      };

      const response = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/cases/${data.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create case");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">New OB Entry</h1>
          <p className="text-gray-400 mt-1">
            Create a comprehensive occurrence book entry
          </p>
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
            <h3 className="text-lg font-semibold text-white mb-4">
              Case Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Case Title <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of the incident"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Description <span className="text-red-400">*</span>
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Detailed description of the incident..."
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="THEFT" className="text-white">Theft</SelectItem>
                      <SelectItem value="ASSAULT" className="text-white">Assault</SelectItem>
                      <SelectItem value="ROBBERY" className="text-white">Robbery</SelectItem>
                      <SelectItem value="MURDER" className="text-white">Murder</SelectItem>
                      <SelectItem value="TRAFFIC" className="text-white">Traffic Accident</SelectItem>
                      <SelectItem value="DOMESTIC" className="text-white">Domestic Violence</SelectItem>
                      <SelectItem value="FRAUD" className="text-white">Fraud</SelectItem>
                      <SelectItem value="CYBERCRIME" className="text-white">Cybercrime</SelectItem>
                      <SelectItem value="NARCOTICS" className="text-white">Narcotics</SelectItem>
                      <SelectItem value="OTHER" className="text-white">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority <span className="text-red-400">*</span>
                  </label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="LOW" className="text-white">Low Priority</SelectItem>
                      <SelectItem value="MEDIUM" className="text-white">Medium Priority</SelectItem>
                      <SelectItem value="HIGH" className="text-white">High Priority</SelectItem>
                      <SelectItem value="URGENT" className="text-white">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Assign to Officer (Optional)
                  </label>
                  <Input
                    type="text"
                    name="assignedToId"
                    value={formData.assignedToId}
                    onChange={handleChange}
                    placeholder="Officer ID or leave blank"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                  />
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
                  placeholder="e.g., Westlands, Nairobi or specific address"
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Latitude (Optional)
                  </label>
                  <Input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g., -1.2921"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Longitude (Optional)
                  </label>
                  <Input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g., 36.8219"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Incident Date & Time <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="datetime-local"
                    name="incidentDate"
                    value={formData.incidentDate}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reporting Persons */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="h-5 w-5 text-green-400" />
                Reporting Persons
              </h3>
              <button
                type="button"
                onClick={() => addItem('reportingPersons')}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Person
              </button>
            </div>

            <div className="space-y-3">
              {formData.reportingPersons.map((person, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-400">Person {idx + 1}</span>
                    {formData.reportingPersons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem('reportingPersons', idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Full Name"
                      value={person.name}
                      onChange={(e) => updateItem('reportingPersons', idx, 'name', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Contact Number"
                      value={person.contact}
                      onChange={(e) => updateItem('reportingPersons', idx, 'contact', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="ID Number"
                      value={person.idNumber}
                      onChange={(e) => updateItem('reportingPersons', idx, 'idNumber', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Address"
                      value={person.address}
                      onChange={(e) => updateItem('reportingPersons', idx, 'address', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Witnesses */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Witnesses
              </h3>
              <button
                type="button"
                onClick={() => addItem('witnesses')}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Witness
              </button>
            </div>

            <div className="space-y-3">
              {formData.witnesses.map((witness, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-400">Witness {idx + 1}</span>
                    {formData.witnesses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem('witnesses', idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Full Name"
                      value={witness.name}
                      onChange={(e) => updateItem('witnesses', idx, 'name', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Contact"
                      value={witness.contact}
                      onChange={(e) => updateItem('witnesses', idx, 'contact', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Address"
                      value={witness.address}
                      onChange={(e) => updateItem('witnesses', idx, 'address', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suspects */}
          <div className="bg-red-500/10 rounded-xl border border-red-500/30 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-red-400" />
                Suspects
              </h3>
              <button
                type="button"
                onClick={() => addItem('suspects')}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Suspect
              </button>
            </div>

            <div className="space-y-3">
              {formData.suspects.map((suspect, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-400">Suspect {idx + 1}</span>
                    {formData.suspects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem('suspects', idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <Input
                      placeholder="First Name"
                      value={suspect.firstName}
                      onChange={(e) => updateItem('suspects', idx, 'firstName', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Last Name"
                      value={suspect.lastName}
                      onChange={(e) => updateItem('suspects', idx, 'lastName', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="ID Number"
                      value={suspect.idNumber}
                      onChange={(e) => updateItem('suspects', idx, 'idNumber', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Phone Number"
                      value={suspect.phoneNumber}
                      onChange={(e) => updateItem('suspects', idx, 'phoneNumber', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Physical Description"
                      value={suspect.description}
                      onChange={(e) => updateItem('suspects', idx, 'description', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Charges"
                      value={suspect.charges}
                      onChange={(e) => updateItem('suspects', idx, 'charges', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={suspect.isCustody}
                      onChange={(e) => updateItem('suspects', idx, 'isCustody', e.target.checked)}
                      className="w-4 h-4"
                    />
                    In Custody / Arrested
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Items Lost */}
          <div className="bg-orange-500/10 rounded-xl border border-orange-500/30 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-400" />
                Items Lost / Stolen
              </h3>
              <button
                type="button"
                onClick={() => addItem('itemsLost')}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {formData.itemsLost.map((item, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-400">Item {idx + 1}</span>
                    {formData.itemsLost.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem('itemsLost', idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem('itemsLost', idx, 'description', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => updateItem('itemsLost', idx, 'quantity', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      type="number"
                      placeholder="Estimated Value (KES)"
                      value={item.estimatedValue}
                      onChange={(e) => updateItem('itemsLost', idx, 'estimatedValue', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items Recovered */}
          <div className="bg-green-500/10 rounded-xl border border-green-500/30 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-green-400" />
                Items Recovered
              </h3>
              <button
                type="button"
                onClick={() => addItem('itemsRecovered')}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {formData.itemsRecovered.map((item, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-400">Item {idx + 1}</span>
                    {formData.itemsRecovered.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem('itemsRecovered', idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem('itemsRecovered', idx, 'description', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => updateItem('itemsRecovered', idx, 'quantity', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Condition"
                      value={item.condition}
                      onChange={(e) => updateItem('itemsRecovered', idx, 'condition', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Location Found"
                      value={item.locationFound}
                      onChange={(e) => updateItem('itemsRecovered', idx, 'locationFound', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicles */}
          <div className="bg-purple-500/10 rounded-xl border border-purple-500/30 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Car className="h-5 w-5 text-purple-400" />
                Vehicles Involved
              </h3>
              <button
                type="button"
                onClick={() => addItem('vehicles')}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Vehicle
              </button>
            </div>

            <div className="space-y-3">
              {formData.vehicles.map((vehicle, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-400">Vehicle {idx + 1}</span>
                    {formData.vehicles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem('vehicles', idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <Input
                      placeholder="Make"
                      value={vehicle.make}
                      onChange={(e) => updateItem('vehicles', idx, 'make', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Model"
                      value={vehicle.model}
                      onChange={(e) => updateItem('vehicles', idx, 'model', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Reg Number *"
                      value={vehicle.registrationNumber}
                      onChange={(e) => updateItem('vehicles', idx, 'registrationNumber', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Color"
                      value={vehicle.color}
                      onChange={(e) => updateItem('vehicles', idx, 'color', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <Input
                      placeholder="Owner Name"
                      value={vehicle.ownerName}
                      onChange={(e) => updateItem('vehicles', idx, 'ownerName', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cell Admission */}
          <div className="bg-gray-500/10 rounded-xl border border-gray-500/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={formData.cellAdmission.admitted}
                onChange={(e) => setFormData({
                  ...formData,
                  cellAdmission: { ...formData.cellAdmission, admitted: e.target.checked }
                })}
                className="w-4 h-4"
              />
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-gray-400" />
                Cell Admission
              </h3>
            </div>

            {formData.cellAdmission.admitted && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Suspect Name"
                  value={formData.cellAdmission.suspectName}
                  onChange={(e) => setFormData({
                    ...formData,
                    cellAdmission: { ...formData.cellAdmission, suspectName: e.target.value }
                  })}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
                <Input
                  placeholder="Cell Number (e.g., Cell A-12)"
                  value={formData.cellAdmission.cellNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    cellAdmission: { ...formData.cellAdmission, cellNumber: e.target.value }
                  })}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
                <Input
                  type="datetime-local"
                  placeholder="Admission Time"
                  value={formData.cellAdmission.admissionTime}
                  onChange={(e) => setFormData({
                    ...formData,
                    cellAdmission: { ...formData.cellAdmission, admissionTime: e.target.value }
                  })}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
                <Input
                  placeholder="Items Left at Counter"
                  value={formData.cellAdmission.itemsAtCounter}
                  onChange={(e) => setFormData({
                    ...formData,
                    cellAdmission: { ...formData.cellAdmission, itemsAtCounter: e.target.value }
                  })}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                />
                <Textarea
                  placeholder="Reason for detention"
                  value={formData.cellAdmission.reason}
                  onChange={(e) => setFormData({
                    ...formData,
                    cellAdmission: { ...formData.cellAdmission, reason: e.target.value }
                  })}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500 md:col-span-2"
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-yellow-500/10 rounded-xl border border-yellow-500/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={formData.payment.required}
                onChange={(e) => setFormData({
                  ...formData,
                  payment: { ...formData.payment, required: e.target.checked } as any
                })}
                className="w-4 h-4"
              />
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-yellow-400" />
                Payment Required
              </h3>
            </div>

            {formData.payment.required && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Type
                    </label>
                    <Select
                      value={formData.payment.type}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          payment: { ...formData.payment, type: value } as any
                        })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        <SelectItem value="FINE" className="text-white">Fine</SelectItem>
                        <SelectItem value="BAIL" className="text-white">Bail</SelectItem>
                        <SelectItem value="BOND" className="text-white">Bond</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount (KES)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.payment.amount}
                      onChange={(e) => setFormData({
                        ...formData,
                        payment: { ...formData.payment, amount: e.target.value } as any
                      })}
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                {formData.payment.status === 'PENDING' && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePayNow}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <CreditCard className="h-4 w-4" />
                      Pay Now
                    </button>
                    <button
                      type="button"
                      onClick={handlePayLater}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Pay Later
                    </button>
                  </div>
                )}

                {formData.payment.status === 'PAID' && (
                  <div className="p-3 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg">
                    ✓ Payment completed - Transaction ID: {(formData.payment as any).transactionId}
                  </div>
                )}

                {formData.payment.status === 'DEFERRED' && (
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-lg">
                    ⓘ Payment deferred - Can be processed later
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Station Info */}
          {user?.station && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                This case will be registered at:{" "}
                <strong>{user.station.name}</strong>
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

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-white/20 p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Process Payment</h3>
              
              <div className="mb-4">
                <p className="text-gray-400 mb-2">
                  Amount: <span className="font-bold text-white">KES {formData.payment.amount}</span>
                </p>
                <p className="text-gray-400 mb-4">
                  Type: <span className="font-bold text-white">{formData.payment.type}</span>
                </p>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="MPESA" className="text-white">M-Pesa</SelectItem>
                    <SelectItem value="CARD" className="text-white">Credit/Debit Card</SelectItem>
                    <SelectItem value="BANK_TRANSFER" className="text-white">Bank Transfer</SelectItem>
                    <SelectItem value="CASH" className="text-white">Cash</SelectItem>
                  </SelectContent>
                </Select>

                {paymentMethod === 'MPESA' && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm font-medium text-green-300 mb-1">M-Pesa Instructions:</p>
                    <ol className="text-sm text-gray-400 list-decimal list-inside space-y-1">
                      <li>Go to M-Pesa menu</li>
                      <li>Select Lipa na M-Pesa → PayBill</li>
                      <li>Business No: <strong>123456</strong></li>
                      <li>Amount: <strong>{formData.payment.amount}</strong></li>
                    </ol>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={!paymentMethod}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}