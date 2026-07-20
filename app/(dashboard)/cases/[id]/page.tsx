"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  Edit,
  FileText,
  Users,
  Package,
  Scale,
  Download,
  Share2,
  Car,
  Lock,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

export default function CaseDetailPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchCaseDetail();
    }
  }, [params.id, token]);

  const fetchCaseDetail = async () => {
    if (!token) return;

    try {
      const response = await fetch(`/api/cases/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCaseData(data);
        setNewStatus(data.status);
      } else {
        router.push("/cases");
      }
    } catch (error) {
      console.error("Failed to fetch case:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!token || !newStatus) return;

    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/cases/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchCaseDetail();
        setShowStatusModal(false);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentW = pageW - margin * 2;
    let y = margin;

    const blue: [number, number, number] = [30, 64, 175];
    const white: [number, number, number] = [255, 255, 255];
    const dark: [number, number, number] = [30, 30, 30];
    const grey: [number, number, number] = [100, 100, 100];

    const sectionHeader = (title: string) => {
      doc.setFillColor(...blue);
      doc.rect(margin, y, contentW, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...white);
      doc.text(title, margin + 3, y + 5);
      y += 10;
      doc.setTextColor(...dark);
    };

    const field = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...dark);
      doc.text(`${label}:`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...grey);
      const lines = doc.splitTextToSize(value || 'N/A', contentW - 45);
      doc.text(lines, margin + 42, y);
      y += Math.max(6, lines.length * 5);
    };

    const checkPage = (needed = 20) => {
      if (y + needed > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // ── Header ──────────────────────────────────────────
    doc.setFillColor(...blue);
    doc.rect(0, 0, pageW, 28, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...white);
    doc.text('OCCURRENCE BOOK ENTRY', pageW / 2, 10, { align: 'center' });

    doc.setFontSize(11);
    doc.text(caseData.obNumber, pageW / 2, 18, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(
      `${caseData.station.name}  ·  ${new Date(caseData.createdAt).toLocaleDateString()}  ·  ${caseData.priority}  ·  ${caseData.status.replace(/_/g, ' ')}`,
      pageW / 2, 24, { align: 'center' }
    );
    y = 34;

    // ── Incident Details ─────────────────────────────────
    sectionHeader('INCIDENT DETAILS');
    field('Title', caseData.title);
    field('Category', caseData.category.replace(/_/g, ' '));
    field('Location', caseData.location);
    field('Incident Date', new Date(caseData.incidentDate).toLocaleString());
    checkPage(20);
    field('Description', caseData.description);

    // ── Officers ─────────────────────────────────────────
    checkPage(20);
    y += 4;
    sectionHeader('OFFICERS');
    field('Reporting Officer', `${caseData.reportedBy.rank} ${caseData.reportedBy.firstName} ${caseData.reportedBy.lastName} (${caseData.reportedBy.serviceNumber})`);
    if (caseData.assignedTo) {
      field('Assigned Officer', `${caseData.assignedTo.rank} ${caseData.assignedTo.firstName} ${caseData.assignedTo.lastName} (${caseData.assignedTo.serviceNumber})`);
    }

    // ── Reporting Persons ─────────────────────────────────
    if (caseData.reportingPersons?.length) {
      checkPage(30);
      y += 4;
      sectionHeader('REPORTING PERSONS');
      autoTable(doc, {
        startY: y,
        head: [['Name', 'Contact', 'ID Number', 'Address']],
        body: caseData.reportingPersons.map((p: any) => [p.name, p.contact || 'N/A', p.idNumber || 'N/A', p.address || 'N/A']),
        margin: { left: margin, right: margin },
        headStyles: { fillColor: blue, fontSize: 8 },
        bodyStyles: { fontSize: 8, textColor: dark },
        theme: 'grid',
      });
      y = (doc as any).lastAutoTable.finalY + 4;
    }

    // ── Suspects ──────────────────────────────────────────
    if (caseData.suspects?.length) {
      checkPage(30);
      y += 4;
      sectionHeader('SUSPECTS');
      autoTable(doc, {
        startY: y,
        head: [['Name', 'ID No.', 'Contact', 'Charges', 'Status']],
        body: caseData.suspects.map((s: any) => [
          `${s.firstName} ${s.lastName}`,
          s.idNumber || 'N/A',
          s.phoneNumber || 'N/A',
          s.charges || 'N/A',
          s.isCustody ? 'In Custody' : 'At Large',
        ]),
        margin: { left: margin, right: margin },
        headStyles: { fillColor: blue, fontSize: 8 },
        bodyStyles: { fontSize: 8, textColor: dark },
        theme: 'grid',
      });
      y = (doc as any).lastAutoTable.finalY + 4;
    }

    // ── Witnesses ─────────────────────────────────────────
    if (caseData.witnesses?.length) {
      checkPage(30);
      y += 4;
      sectionHeader('WITNESSES');
      autoTable(doc, {
        startY: y,
        head: [['Name', 'Contact', 'Address']],
        body: caseData.witnesses.map((w: any) => [
          w.name || `${w.firstName} ${w.lastName}`,
          w.contact || w.phoneNumber || 'N/A',
          w.address || 'N/A',
        ]),
        margin: { left: margin, right: margin },
        headStyles: { fillColor: blue, fontSize: 8 },
        bodyStyles: { fontSize: 8, textColor: dark },
        theme: 'grid',
      });
      y = (doc as any).lastAutoTable.finalY + 4;
    }

    // ── Items Lost ────────────────────────────────────────
    if (caseData.itemsLost?.length) {
      checkPage(30);
      y += 4;
      sectionHeader('ITEMS LOST / STOLEN');
      autoTable(doc, {
        startY: y,
        head: [['Description', 'Qty', 'Est. Value (KES)']],
        body: caseData.itemsLost.map((i: any) => [i.description, i.quantity, i.estimatedValue || 'N/A']),
        margin: { left: margin, right: margin },
        headStyles: { fillColor: blue, fontSize: 8 },
        bodyStyles: { fontSize: 8, textColor: dark },
        theme: 'grid',
      });
      y = (doc as any).lastAutoTable.finalY + 4;
    }

    // ── Items Recovered ───────────────────────────────────
    if (caseData.itemsRecovered?.length) {
      checkPage(30);
      y += 4;
      sectionHeader('ITEMS RECOVERED');
      autoTable(doc, {
        startY: y,
        head: [['Description', 'Qty', 'Condition', 'Location Found']],
        body: caseData.itemsRecovered.map((i: any) => [i.description, i.quantity, i.condition || 'N/A', i.locationFound || 'N/A']),
        margin: { left: margin, right: margin },
        headStyles: { fillColor: blue, fontSize: 8 },
        bodyStyles: { fontSize: 8, textColor: dark },
        theme: 'grid',
      });
      y = (doc as any).lastAutoTable.finalY + 4;
    }

    // ── Vehicles ──────────────────────────────────────────
    if (caseData.vehicles?.length) {
      checkPage(30);
      y += 4;
      sectionHeader('VEHICLES INVOLVED');
      autoTable(doc, {
        startY: y,
        head: [['Make/Model', 'Reg. No.', 'Color', 'Owner']],
        body: caseData.vehicles.map((v: any) => [`${v.make || ''} ${v.model || ''}`.trim(), v.registrationNumber, v.color || 'N/A', v.ownerName || 'N/A']),
        margin: { left: margin, right: margin },
        headStyles: { fillColor: blue, fontSize: 8 },
        bodyStyles: { fontSize: 8, textColor: dark },
        theme: 'grid',
      });
      y = (doc as any).lastAutoTable.finalY + 4;
    }

    // ── Cell Admissions ───────────────────────────────────
    if (caseData.cellAdmissions?.length) {
      checkPage(30);
      y += 4;
      sectionHeader('CELL ADMISSIONS');
      autoTable(doc, {
        startY: y,
        head: [['Suspect', 'Cell No.', 'Admission Time', 'Status', 'Reason']],
        body: caseData.cellAdmissions.map((ca: any) => [
          ca.suspectName,
          ca.cellNumber,
          new Date(ca.admissionTime).toLocaleString(),
          ca.status,
          ca.reason || 'N/A',
        ]),
        margin: { left: margin, right: margin },
        headStyles: { fillColor: blue, fontSize: 8 },
        bodyStyles: { fontSize: 8, textColor: dark },
        theme: 'grid',
      });
      y = (doc as any).lastAutoTable.finalY + 4;
    }

    // ── Signatures ────────────────────────────────────────
    checkPage(35);
    y += 10;
    const sigY = y + 15;
    doc.setDrawColor(50, 50, 50);
    doc.line(margin, sigY, margin + 70, sigY);
    doc.line(pageW - margin - 70, sigY, pageW - margin, sigY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...dark);
    doc.text(`${caseData.reportedBy.rank} ${caseData.reportedBy.firstName} ${caseData.reportedBy.lastName}`, margin, sigY + 4);
    doc.text(`Svc No: ${caseData.reportedBy.serviceNumber}`, margin, sigY + 8);
    doc.text('Reporting Officer', margin, sigY + 12);
    doc.text('Station Commander', pageW - margin - 70, sigY + 4);
    doc.text('Signature: _______________', pageW - margin - 70, sigY + 8);
    doc.text('Date: _______________', pageW - margin - 70, sigY + 12);

    // ── Footer ────────────────────────────────────────────
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(...grey);
      doc.text(
        `Generated: ${new Date().toLocaleString()}  ·  OB: ${caseData.obNumber}  ·  ${caseData.station.name}  ·  Page ${i}/${totalPages}`,
        pageW / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' }
      );
    }

    doc.save(`OB_${caseData.obNumber.replace(/\//g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const shareOB = () => {
    const text = `OB Entry: ${caseData.obNumber}\nTitle: ${caseData.title}\nDate: ${new Date(caseData.createdAt).toLocaleDateString()}\nLocation: ${caseData.location}\nStatus: ${caseData.status}`;
    
    if (navigator.share) {
      navigator.share({
        title: `OB Entry ${caseData.obNumber}`,
        text: text,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(text);
      alert('OB details copied to clipboard!');
    }
  };


  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!caseData) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <p className="text-gray-400">Case not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "HIGH":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "LOW":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REPORTED":
        return "bg-blue-500/20 text-blue-400";
      case "UNDER_INVESTIGATION":
        return "bg-purple-500/20 text-purple-400";
      case "RESOLVED":
        return "bg-green-500/20 text-green-400";
      case "CLOSED":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/cases"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cases
          </Link>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">
                  {caseData.obNumber}
                </h1>
                <Badge className={getPriorityColor(caseData.priority)}>
                  {caseData.priority}
                </Badge>
                <Badge className={getStatusColor(caseData.status)}>
                  {caseData.status.replace(/_/g, " ")}
                </Badge>
              </div>
              <p className="text-xl text-gray-300">{caseData.title}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
              <button
                onClick={shareOB}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button
                onClick={() => setShowStatusModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
                Update Status
              </button>
            </div>
          </div>
        </div>

        {/* Case Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white/10 rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Case Description
              </h3>
              <p className="text-gray-300 whitespace-pre-wrap">
                {caseData.description}
              </p>
            </div>

            {/* Location */}
            <div className="bg-white/10 rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                Location Details
              </h3>
              <div className="space-y-2">
                <p className="text-gray-300">{caseData.location}</p>
                {caseData.latitude && caseData.longitude && (
                  <p className="text-sm text-gray-400">
                    Coordinates: {caseData.latitude}, {caseData.longitude}
                  </p>
                )}
              </div>
            </div>

            {/* Reporting Persons */}
            {caseData.reportingPersons && caseData.reportingPersons.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-green-400" />
                  Reporting Persons ({caseData.reportingPersons.length})
                </h3>
                <div className="space-y-3">
                  {caseData.reportingPersons.map((person: any) => (
                    <div key={person.id} className="p-3 bg-white/5 rounded-lg">
                      <p className="font-medium text-white">{person.name}</p>
                      <div className="text-sm text-gray-400 mt-1 space-y-1">
                        {person.contact && <p>Contact: {person.contact}</p>}
                        {person.idNumber && <p>ID: {person.idNumber}</p>}
                        {person.address && <p>Address: {person.address}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Witnesses */}
            {caseData.witnesses && caseData.witnesses.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Witnesses ({caseData.witnesses.length})
                </h3>
                <div className="space-y-3">
                  {caseData.witnesses.map((witness: any) => (
                    <div key={witness.id} className="p-3 bg-white/5 rounded-lg">
                      <p className="font-medium text-white">
                        {witness.name || `${witness.firstName} ${witness.lastName}`}
                      </p>
                      <div className="text-sm text-gray-400 mt-1 space-y-1">
                        {(witness.contact || witness.phoneNumber) && (
                          <p>Contact: {witness.contact || witness.phoneNumber}</p>
                        )}
                        {witness.address && <p>Address: {witness.address}</p>}
                        {witness.statement && (
                          <p className="mt-2 text-gray-300">Statement: {witness.statement}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suspects */}
            {caseData.suspects && caseData.suspects.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-400" />
                  Suspects ({caseData.suspects.length})
                </h3>
                <div className="space-y-3">
                  {caseData.suspects.map((suspect: any) => (
                    <div key={suspect.id} className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-white">
                          {suspect.firstName} {suspect.lastName}
                        </p>
                        {suspect.isCustody && (
                          <Badge className="bg-red-600 text-white text-xs">In Custody</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 mt-2 space-y-1">
                        {suspect.idNumber && <p>ID: {suspect.idNumber}</p>}
                        {suspect.phoneNumber && <p>Contact: {suspect.phoneNumber}</p>}
                        {suspect.description && <p>Description: {suspect.description}</p>}
                        {suspect.charges && (
                          <p className="text-red-400 font-medium mt-2">Charges: {suspect.charges}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Items Lost */}
            {caseData.itemsLost && caseData.itemsLost.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-orange-400" />
                  Items Lost / Stolen ({caseData.itemsLost.length})
                </h3>
                <div className="space-y-2">
                  {caseData.itemsLost.map((item: any) => (
                    <div key={item.id} className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                      <p className="font-medium text-white">{item.description}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Quantity: {item.quantity} {item.estimatedValue && `• Value: KES ${item.estimatedValue}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Items Recovered */}
            {caseData.itemsRecovered && caseData.itemsRecovered.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-400" />
                  Items Recovered ({caseData.itemsRecovered.length})
                </h3>
                <div className="space-y-2">
                  {caseData.itemsRecovered.map((item: any) => (
                    <div key={item.id} className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                      <p className="font-medium text-white">{item.description}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Quantity: {item.quantity}
                        {item.condition && ` • Condition: ${item.condition}`}
                        {item.locationFound && ` • Found at: ${item.locationFound}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vehicles */}
            {caseData.vehicles && caseData.vehicles.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Car className="h-5 w-5 text-purple-400" />
                  Vehicles Involved ({caseData.vehicles.length})
                </h3>
                <div className="space-y-3">
                  {caseData.vehicles.map((vehicle: any) => (
                    <div key={vehicle.id} className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <p className="font-medium text-white">
                        {vehicle.make} {vehicle.model} • {vehicle.registrationNumber}
                      </p>
                      <div className="text-sm text-gray-400 mt-1">
                        {vehicle.color && <span>Color: {vehicle.color} </span>}
                        {vehicle.ownerName && <span>• Owner: {vehicle.ownerName}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cell Admissions */}
            {caseData.cellAdmissions && caseData.cellAdmissions.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-gray-400" />
                  Cell Admission
                </h3>
                {caseData.cellAdmissions.map((admission: any) => (
                  <div key={admission.id} className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Suspect Name</p>
                        <p className="text-white font-medium">{admission.suspectName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Cell Number</p>
                        <p className="text-white font-medium">{admission.cellNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Admission Time</p>
                        <p className="text-white font-medium">
                          {new Date(admission.admissionTime).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Status</p>
                        <Badge className={admission.status === 'IN_CUSTODY' ? 'bg-red-600' : 'bg-green-600'}>
                          {admission.status}
                        </Badge>
                      </div>
                    </div>
                    {admission.itemsAtCounter && (
                      <div>
                        <p className="text-sm text-gray-400">Items at Counter</p>
                        <p className="text-gray-300">{admission.itemsAtCounter}</p>
                      </div>
                    )}
                    {admission.reason && (
                      <div>
                        <p className="text-sm text-gray-400">Reason</p>
                        <p className="text-gray-300">{admission.reason}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Payments */}
            {caseData.payments && caseData.payments.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-yellow-400" />
                  Payment Information
                </h3>
                {caseData.payments.map((payment: any) => (
                  <div key={payment.id} className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Type</p>
                        <p className="text-white font-medium">{payment.paymentType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Amount</p>
                        <p className="text-white font-medium">KES {payment.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Status</p>
                        <Badge className={
                          payment.status === 'PAID' ? 'bg-green-600' :
                          payment.status === 'PENDING' ? 'bg-yellow-600' :
                          'bg-gray-600'
                        }>
                          {payment.status}
                        </Badge>
                      </div>
                      {payment.transactionId && (
                        <div>
                          <p className="text-sm text-gray-400">Transaction ID</p>
                          <p className="text-white font-medium text-xs">{payment.transactionId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Evidence */}
            {caseData.evidence && caseData.evidence.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-400" />
                  Evidence ({caseData.evidence.length})
                </h3>
                <div className="space-y-3">
                  {caseData.evidence.map((evidence: any) => (
                    <div key={evidence.id} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-white">{evidence.type}</p>
                        <span className="text-xs text-gray-400">
                          {new Date(evidence.collectedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{evidence.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Collected by: {evidence.collectedBy}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Case Information */}
            <div className="bg-white/10 rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Case Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="text-white font-medium">
                    {caseData.category.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Incident Date</p>
                  <p className="text-white font-medium">
                    {new Date(caseData.incidentDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Reported Date</p>
                  <p className="text-white font-medium">
                    {new Date(caseData.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Reported By */}
            <div className="bg-white/10 rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" />
                Reported By
              </h3>
              <div>
                <p className="text-white font-medium">
                  {caseData.reportedBy.rank} {caseData.reportedBy.firstName}{" "}
                  {caseData.reportedBy.lastName}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Service No: {caseData.reportedBy.serviceNumber}
                </p>
              </div>
            </div>

            {/* Assigned To */}
            {caseData.assignedTo && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Assigned To
                </h3>
                <div>
                  <p className="text-white font-medium">
                    {caseData.assignedTo.rank} {caseData.assignedTo.firstName}{" "}
                    {caseData.assignedTo.lastName}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Service No: {caseData.assignedTo.serviceNumber}
                  </p>
                </div>
              </div>
            )}

            {/* Station */}
            <div className="bg-white/10 rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Station</h3>
              <div>
                <p className="text-white font-medium">
                  {caseData.station.name}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Code: {caseData.station.code}
                </p>
              </div>
            </div>

            {/* Court Files */}
            {caseData.courtFiles && caseData.courtFiles.length > 0 && (
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-purple-400" />
                  Court Files
                </h3>
                <div className="space-y-2">
                  {caseData.courtFiles.map((file: any) => (
                    <div key={file.id} className="p-3 bg-white/5 rounded-lg">
                      <p className="text-sm font-medium text-white">
                        {file.courtName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Case No: {file.caseNumber}
                      </p>
                      <Badge className="mt-2 text-xs">{file.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Case Updates Timeline */}
        {caseData.caseUpdates && caseData.caseUpdates.length > 0 && (
          <div className="bg-white/10 rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Case Timeline
            </h3>
            <div className="space-y-4">
              {caseData.caseUpdates.map((update: any, index: number) => (
                <div key={update.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    {index < caseData.caseUpdates.length - 1 && (
                      <div className="flex-1 w-0.5 bg-white/20 min-h-8"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-white font-medium">
                      {update.updateType}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {update.description}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(update.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-white/20 p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">
                Update Case Status
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Status
                </label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="REPORTED" className="text-white">
                      Reported
                    </SelectItem>
                    <SelectItem
                      value="UNDER_INVESTIGATION"
                      className="text-white"
                    >
                      Under Investigation
                    </SelectItem>
                    <SelectItem value="ASSIGNED_TO_DCI" className="text-white">
                      Assigned to DCI
                    </SelectItem>
                    <SelectItem
                      value="ASSIGNED_TO_PROSECUTION"
                      className="text-white"
                    >
                      Assigned to Prosecution
                    </SelectItem>
                    <SelectItem
                      value="ASSIGNED_TO_ARBITRATION"
                      className="text-white"
                    >
                      Assigned to Arbitration
                    </SelectItem>
                    <SelectItem value="COURT_FILED" className="text-white">
                      Court Filed
                    </SelectItem>
                    <SelectItem value="RESOLVED" className="text-white">
                      Resolved
                    </SelectItem>
                    <SelectItem value="CLOSED" className="text-white">
                      Closed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdatingStatus}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingStatus ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}