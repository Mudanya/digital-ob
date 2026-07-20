'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Printer, ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';

function fmt(date: string | null | undefined) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-KE', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');
}

function fmtLong(date: string | null | undefined) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-KE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ChargeSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { token } = useAuth();
  const router = useRouter();
  const [sheet, setSheet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) fetchSheet();
  }, [token]);

  const fetchSheet = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/charge-sheets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setSheet((await res.json()).chargeSheet);
      else router.push('/charge-sheets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><div className="p-12 text-center text-gray-400">Loading...</div></DashboardLayout>;
  if (!sheet) return null;

  const witnesses: string[] = sheet.witnesses
    ? sheet.witnesses.split('\n').filter(Boolean)
    : [];

  return (
    <DashboardLayout>
      {/* Toolbar — hidden when printing */}
      <div className="print:hidden flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <Link href="/court-cases" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-sm text-gray-600 font-medium">Charge Sheet — {sheet.case?.obNumber}</span>
        <div className="ml-auto flex gap-2">
          <Link
            href={`/charge-sheets/new?caseId=${sheet.caseId}`}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Edit className="h-3.5 w-3.5" /> New Version
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #charge-sheet, #charge-sheet * { visibility: visible; }
          #charge-sheet { position: fixed; top: 0; left: 0; width: 100%; }
          @page { size: A4; margin: 15mm; }
        }
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          white-space: nowrap;
        }
        .slash-fill {
          background-image: repeating-linear-gradient(
            45deg, #000 0, #000 1px, transparent 0, transparent 50%
          );
          background-size: 4px 4px;
        }
      `}</style>

      {/* The charge sheet document */}
      <div className="bg-gray-100 print:bg-white min-h-screen py-8 print:py-0">
        <div
          id="charge-sheet"
          className="bg-white mx-auto shadow-lg print:shadow-none"
          style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Times New Roman, serif', fontSize: '10pt', color: '#000' }}
        >
          <div style={{ padding: '10mm' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '6px' }}>
              <img
                src="/KENYA-POLICE-Logo-Vector/KENYA-POLICE-Logo-Vector.jpg"
                alt="Kenya Coat of Arms"
                style={{ height: '60px', marginBottom: '4px' }}
              />
              <div style={{ fontWeight: 'bold', fontSize: '13pt', letterSpacing: '2px' }}>REPUBLIC OF KENYA</div>
              <div style={{ fontWeight: 'bold', fontSize: '11pt', letterSpacing: '1px' }}>CHARGE SHEET</div>
            </div>

            {/* Reference numbers */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4px', fontSize: '9.5pt' }}>
              <tbody>
                <tr>
                  <td style={{ width: '50%', paddingBottom: '3px' }}>
                    COURT FILE NO: <span style={{ borderBottom: '1px solid #000', display: 'inline-block', minWidth: '80px', fontWeight: 'bold', color: 'red' }}>{sheet.courtFileNo || ''}</span>
                  </td>
                  <td style={{ width: '50%', paddingBottom: '3px' }}>
                    POLICE CASE NO: <span style={{ borderBottom: '1px solid #000', display: 'inline-block', minWidth: '80px' }}>{sheet.policeCaseNo || ''}</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingBottom: '3px' }}>
                    ODPP CASE NO: <span style={{ borderBottom: '1px solid #000', display: 'inline-block', minWidth: '80px' }}>{sheet.odppCaseNo || ''}</span>
                  </td>
                  <td style={{ paddingBottom: '3px' }}>
                    OB NUMBER: <span style={{ borderBottom: '1px solid #000', display: 'inline-block', minWidth: '80px' }}>{sheet.case?.obNumber || ''}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    ODPP STATION: <span style={{ borderBottom: '1px solid #000', display: 'inline-block', minWidth: '80px' }}>{sheet.odppStation || ''}</span>
                  </td>
                  <td>
                    DATE DRAFTED: <span style={{ borderBottom: '1px solid #000', display: 'inline-block', minWidth: '80px' }}>{fmtLong(sheet.dateDrafted)}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Accused details table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '0', fontSize: '9pt' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'left', width: '22%', fontWeight: 'normal', fontSize: '8pt' }}>CHRISTIAN NAME IN FULL</th>
                  <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'left', width: '18%', fontWeight: 'normal', fontSize: '8pt' }}>SURNAME</th>
                  <th style={{ border: '1px solid #000', padding: '2px', width: '8%' }}>
                    <div className="vertical-text" style={{ fontSize: '8pt', padding: '2px', fontWeight: 'normal' }}>ID NUMBER</div>
                  </th>
                  <th style={{ border: '1px solid #000', padding: '2px', width: '6%' }}>
                    <div className="vertical-text" style={{ fontSize: '8pt', padding: '2px', fontWeight: 'normal' }}>SEX</div>
                  </th>
                  <th style={{ border: '1px solid #000', padding: '2px', width: '10%' }}>
                    <div className="vertical-text" style={{ fontSize: '8pt', padding: '2px', fontWeight: 'normal' }}>Nationality/Tribe</div>
                  </th>
                  <th style={{ border: '1px solid #000', padding: '2px', width: '8%' }}>
                    <div className="vertical-text" style={{ fontSize: '8pt', padding: '2px', fontWeight: 'normal' }}>Apparent age</div>
                  </th>
                  <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'left', fontWeight: 'normal', fontSize: '8pt' }}>
                    Address(include district and location where applicable)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '6px 5px', fontWeight: 'bold', fontSize: '11pt', verticalAlign: 'bottom' }}>
                    {sheet.accusedFirstName?.toUpperCase()}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '6px 5px', fontWeight: 'bold', fontSize: '11pt', verticalAlign: 'bottom' }}>
                    {sheet.accusedSurname?.toUpperCase()}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', fontSize: '9pt', verticalAlign: 'bottom' }}>
                    {sheet.accusedIdNumber}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', fontSize: '9pt', verticalAlign: 'bottom' }}>
                    {sheet.accusedSex === 'FEMALE' ? 'F' : 'M'}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', fontSize: '9pt', verticalAlign: 'bottom' }}>
                    {sheet.accusedNationality}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', fontSize: '9pt', verticalAlign: 'bottom' }}>
                    {sheet.accusedApparentAge}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '4px 5px', fontSize: '9pt', verticalAlign: 'bottom' }}>
                    {sheet.accusedAddress}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Charge */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none', fontSize: '9.5pt' }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '4px 5px', width: '20%', verticalAlign: 'top', fontWeight: 'bold' }}>CHARGE</td>
                  <td style={{ border: '1px solid #000', padding: '5px 8px', fontWeight: 'bold', fontSize: '10pt', lineHeight: '1.4' }}>
                    {sheet.charge?.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '4px 5px', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 'bold' }}>PARTICULARS OF</div>
                    <div style={{ fontWeight: 'bold' }}>OFFENCE(see</div>
                    <div style={{ fontWeight: 'bold' }}>second</div>
                    <div style={{ fontWeight: 'bold' }}>schedule of</div>
                    <div style={{ fontWeight: 'bold' }}>c.p.c)</div>
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px 8px', lineHeight: '1.6', fontSize: '9.5pt' }}>
                    {sheet.particularsOfOffence}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Arrest details table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none', fontSize: '9pt' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #000', padding: '3px 4px', fontWeight: 'normal', fontSize: '8pt', width: '13%' }}>If accused arrested</th>
                  <th style={{ border: '1px solid #000', padding: '3px 4px', fontWeight: 'normal', fontSize: '8pt', width: '12%' }}>Date of arrest</th>
                  <th style={{ border: '1px solid #000', padding: '3px 4px', fontWeight: 'normal', fontSize: '8pt', width: '12%' }}>Without or with warrant</th>
                  <th style={{ border: '1px solid #000', padding: '3px 4px', fontWeight: 'normal', fontSize: '8pt', width: '18%' }}>Date apprehension report to court</th>
                  <th style={{ border: '1px solid #000', padding: '3px 4px', fontWeight: 'normal', fontSize: '8pt', width: '18%' }}>Bond or bail and amount</th>
                  <th style={{ border: '1px solid #000', padding: '3px 4px', fontWeight: 'normal', fontSize: '8pt' }}>Is application made for summons to issue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px 4px', fontWeight: 'bold', textAlign: 'center' }}>
                    {sheet.wasArrested ? 'YES' : 'NO'}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px 4px', textAlign: 'center' }}>
                    {sheet.dateOfArrest ? fmt(sheet.dateOfArrest) : ''}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px 4px', textAlign: 'center', fontWeight: 'bold' }}>
                    {sheet.withoutWarrant ? 'W/O' : 'WITH'}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px 4px', textAlign: 'center' }}>
                    {sheet.dateApprehensionReport ? fmt(sheet.dateApprehensionReport) : ''}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px 4px', textAlign: 'center', fontWeight: 'bold' }}>
                    {sheet.bondOrBail || 'IN CUSTODY'}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '5px 4px', textAlign: 'center' }}>
                    {sheet.summonsMade ? (
                      <span>YES</span>
                    ) : (
                      <div className="slash-fill" style={{ height: '28px', width: '100%' }} />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Remanded / Complainant / Witnesses / Sentence */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none', fontSize: '9.5pt' }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '4px 5px', width: '30%', verticalAlign: 'top' }}>Remanded or adjourned to</td>
                  <td style={{ border: '1px solid #000', padding: '5px 8px', minHeight: '20px' }}>{sheet.remandedOrAdjourned || ''}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '4px 5px', verticalAlign: 'top', fontWeight: 'bold' }}>Complainant and addresses</td>
                  <td style={{ border: '1px solid #000', padding: '5px 8px', fontWeight: 'bold' }}>{sheet.complainant || 'REPUBLIC'}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '4px 5px', verticalAlign: 'top' }}>Witnesses</td>
                  <td style={{ border: '1px solid #000', padding: '5px 8px' }}>
                    {witnesses.length > 0 ? (
                      <ol style={{ margin: 0, paddingLeft: '20px' }}>
                        {witnesses.map((w, i) => (
                          <li key={i}>{w.replace(/^\d+\.\s*/, '')}</li>
                        ))}
                      </ol>
                    ) : (
                      <span style={{ fontStyle: 'italic', color: '#888' }}>Others to be stated</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '4px 5px', verticalAlign: 'top' }}>Sentence court and date</td>
                  <td style={{ border: '1px solid #000', padding: '5px 8px', minHeight: '40px' }}>
                    <div style={{ borderBottom: '1px dotted #666', marginTop: '16px' }}></div>
                    <div style={{ textAlign: 'right', fontSize: '8.5pt' }}>..........................fine paid</div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Signatures */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none', fontSize: '9pt' }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '30px 8px 8px', width: '50%', verticalAlign: 'bottom' }}>
                    <div style={{ borderTop: '1px solid #000', paddingTop: '4px', marginTop: '20px' }}>
                      NAME &amp; RANK OF PROSECUTOR
                    </div>
                    {sheet.prosecutorName && (
                      <div style={{ fontWeight: 'bold', marginTop: '2px' }}>
                        {sheet.prosecutorName} — {sheet.prosecutorRank}
                      </div>
                    )}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '30px 8px 8px', verticalAlign: 'bottom' }}>
                    <div style={{ borderTop: '1px solid #000', paddingTop: '4px', marginTop: '20px' }}>
                      ODPP STAMP/DATE/SIGNATURE
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '7.5pt', color: '#555' }}>
              Printed: {new Date().toLocaleDateString('en-KE')} — {sheet.case?.station?.name} Police Station
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
