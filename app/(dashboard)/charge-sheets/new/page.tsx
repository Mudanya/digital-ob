'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { FileText, Save, Printer } from 'lucide-react';

function NewChargeSheetContent() {
  const { token, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCaseId = searchParams.get('caseId') || '';

  const [cases, setCases] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [suspects, setSuspects] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    caseId: preselectedCaseId,
    courtFileNo: '',
    odppCaseNo: '',
    odppStation: '',
    policeCaseNo: '',
    dateDrafted: today,
    accusedFirstName: '',
    accusedSurname: '',
    accusedIdNumber: '',
    accusedSex: 'MALE',
    accusedNationality: 'KENYAN',
    accusedApparentAge: 'ADULT',
    accusedAddress: '',
    charge: '',
    particularsOfOffence: '',
    wasArrested: true,
    dateOfArrest: '',
    withoutWarrant: true,
    dateApprehensionReport: '',
    bondOrBail: 'IN CUSTODY',
    summonsMade: false,
    remandedOrAdjourned: '',
    complainant: 'REPUBLIC',
    witnesses: '',
    sentenceCourtDate: '',
    prosecutorName: '',
    prosecutorRank: '',
  });

  const setField = (field: string, value: any) =>
    setForm(f => ({ ...f, [field]: value }));

  useEffect(() => {
    if (token) fetchCases();
  }, [token]);

  useEffect(() => {
    if (preselectedCaseId && cases.length) {
      const c = cases.find(c => c.id === preselectedCaseId);
      if (c) handleCaseSelect(c);
    }
  }, [preselectedCaseId, cases]);

  const fetchCases = async () => {
    const res = await fetch('/api/cases', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setCases((await res.json()).cases || []);
  };

  const handleCaseSelect = async (c: any) => {
    setSelectedCase(c);
    setField('caseId', c.id);
    setField('policeCaseNo', c.obNumber);
    // fetch suspects for the case
    const res = await fetch(`/api/cases/${c.id}`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      const caseSuspects = data.case?.suspects || [];
      setSuspects(caseSuspects);
      if (caseSuspects.length > 0) {
        const s = caseSuspects[0];
        setForm(f => ({
          ...f,
          accusedFirstName: s.firstName || '',
          accusedSurname: s.lastName || '',
          accusedIdNumber: s.idNumber || '',
          accusedSex: s.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
          accusedApparentAge: s.age ? String(s.age) : 'ADULT',
          accusedAddress: s.address || '',
          charge: s.charges || '',
          dateOfArrest: s.arrestDate ? new Date(s.arrestDate).toISOString().split('T')[0] : '',
          wasArrested: s.isCustody || !!s.arrestDate,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.caseId || !form.accusedFirstName || !form.accusedSurname || !form.charge || !form.particularsOfOffence) {
      setError('Please fill in all required fields (Case, Accused name, Charge, Particulars).');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/charge-sheets', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/charge-sheets/${data.chargeSheet.id}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create charge sheet.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all';
  const labelCls = 'block text-xs font-medium text-gray-300 mb-1.5';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-6 w-6 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold text-white">New Charge Sheet</h1>
            <p className="text-sm text-gray-400">Republic of Kenya — Charge Sheet (Magistrate's Court)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Case Selection */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="font-semibold text-white text-xs mb-4 uppercase tracking-wider">Case Reference</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>Case / OB Entry *</label>
                <select
                  value={form.caseId}
                  onChange={e => {
                    const c = cases.find(c => c.id === e.target.value);
                    if (c) handleCaseSelect(c);
                  }}
                  className={inputCls}
                  required
                >
                  <option value="" className="bg-slate-800">Select a case...</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id} className="bg-slate-800">{c.obNumber} — {c.title}</option>
                  ))}
                </select>
                {selectedCase && suspects.length > 1 && (
                  <div className="mt-2">
                    <label className={labelCls}>Select Accused (from case suspects)</label>
                    <select
                      className={inputCls}
                      onChange={e => {
                        const s = suspects.find(s => s.id === e.target.value);
                        if (s) setForm(f => ({
                          ...f,
                          accusedFirstName: s.firstName || '',
                          accusedSurname: s.lastName || '',
                          accusedIdNumber: s.idNumber || '',
                          accusedSex: s.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
                          accusedApparentAge: s.age ? String(s.age) : 'ADULT',
                          accusedAddress: s.address || '',
                          charge: s.charges || f.charge,
                        }));
                      }}
                    >
                      <option value="" className="bg-slate-800">Auto-filled from first suspect</option>
                      {suspects.map(s => (
                        <option key={s.id} value={s.id} className="bg-slate-800">{s.firstName} {s.lastName} — ID: {s.idNumber || 'N/A'}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Court File No.</label>
                <input type="text" value={form.courtFileNo} onChange={e => setField('courtFileNo', e.target.value)} className={inputCls} placeholder="E.g. E315/2026" />
              </div>
              <div>
                <label className={labelCls}>Police Case No.</label>
                <input type="text" value={form.policeCaseNo} onChange={e => setField('policeCaseNo', e.target.value)} className={inputCls} placeholder="Auto-filled from OB" />
              </div>
              <div>
                <label className={labelCls}>ODPP Case No.</label>
                <input type="text" value={form.odppCaseNo} onChange={e => setField('odppCaseNo', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>ODPP Station</label>
                <input type="text" value={form.odppStation} onChange={e => setField('odppStation', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Date Drafted</label>
                <input type="date" value={form.dateDrafted} onChange={e => setField('dateDrafted', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Accused */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="font-semibold text-white text-xs mb-4 uppercase tracking-wider">Accused Person</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Christian Name in Full *</label>
                <input type="text" value={form.accusedFirstName} onChange={e => setField('accusedFirstName', e.target.value)} className={inputCls} required placeholder="e.g. RAPHAEL" />
              </div>
              <div>
                <label className={labelCls}>Surname *</label>
                <input type="text" value={form.accusedSurname} onChange={e => setField('accusedSurname', e.target.value)} className={inputCls} required placeholder="e.g. TUJU" />
              </div>
              <div>
                <label className={labelCls}>ID Number</label>
                <input type="text" value={form.accusedIdNumber} onChange={e => setField('accusedIdNumber', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Sex</label>
                <select value={form.accusedSex} onChange={e => setField('accusedSex', e.target.value)} className={inputCls}>
                  <option className="bg-slate-800">MALE</option>
                  <option className="bg-slate-800">FEMALE</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Nationality / Tribe</label>
                <input type="text" value={form.accusedNationality} onChange={e => setField('accusedNationality', e.target.value)} className={inputCls} placeholder="KENYAN" />
              </div>
              <div>
                <label className={labelCls}>Apparent Age</label>
                <input type="text" value={form.accusedApparentAge} onChange={e => setField('accusedApparentAge', e.target.value)} className={inputCls} placeholder="ADULT / 35" />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Address (include district and location)</label>
                <input type="text" value={form.accusedAddress} onChange={e => setField('accusedAddress', e.target.value)} className={inputCls} placeholder="C/O NAIROBI" />
              </div>
            </div>
          </div>

          {/* Charge */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="font-semibold text-white text-xs mb-4 uppercase tracking-wider">Charge &amp; Offence</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Charge *</label>
                <input type="text" value={form.charge} onChange={e => setField('charge', e.target.value)} className={inputCls} required placeholder="GIVING FALSE INFORMATION TO A PERSON EMPLOYED IN PUBLIC SERVICE CONTRARY TO SECTION 129(a) OF THE PENAL CODE." />
              </div>
              <div>
                <label className={labelCls}>Particulars of Offence * (see second schedule of c.p.c)</label>
                <textarea rows={5} value={form.particularsOfOffence} onChange={e => setField('particularsOfOffence', e.target.value)} className={inputCls} required placeholder="ACCUSED NAME : On the ... day of ... at ... within ... sub-county, ..." />
              </div>
            </div>
          </div>

          {/* Arrest Details */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="font-semibold text-white text-xs mb-4 uppercase tracking-wider">Arrest Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="wasArrested" checked={form.wasArrested} onChange={e => setField('wasArrested', e.target.checked)} className="rounded" />
                <label htmlFor="wasArrested" className="text-sm text-gray-300">If accused arrested — YES</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="withoutWarrant" checked={form.withoutWarrant} onChange={e => setField('withoutWarrant', e.target.checked)} className="rounded" />
                <label htmlFor="withoutWarrant" className="text-sm text-gray-300">Without warrant (W/O)</label>
              </div>
              <div>
                <label className={labelCls}>Date of Arrest</label>
                <input type="date" value={form.dateOfArrest} onChange={e => setField('dateOfArrest', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Date Apprehension Report to Court</label>
                <input type="date" value={form.dateApprehensionReport} onChange={e => setField('dateApprehensionReport', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Bond or Bail and Amount</label>
                <input type="text" value={form.bondOrBail} onChange={e => setField('bondOrBail', e.target.value)} className={inputCls} placeholder="IN CUSTODY" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="summonsMade" checked={form.summonsMade} onChange={e => setField('summonsMade', e.target.checked)} className="rounded" />
                <label htmlFor="summonsMade" className="text-sm text-gray-300">Application made for summons to issue</label>
              </div>
            </div>
          </div>

          {/* Court Process */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="font-semibold text-white text-xs mb-4 uppercase tracking-wider">Court Process</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>Remanded or Adjourned to</label>
                <input type="text" value={form.remandedOrAdjourned} onChange={e => setField('remandedOrAdjourned', e.target.value)} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Complainant and Addresses</label>
                <input type="text" value={form.complainant} onChange={e => setField('complainant', e.target.value)} className={inputCls} placeholder="REPUBLIC" />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Witnesses (one per line)</label>
                <textarea rows={3} value={form.witnesses} onChange={e => setField('witnesses', e.target.value)} className={inputCls} placeholder="1. CI PURITY KOBIA&#10;2. SGT FREDERICK KWETE&#10;Others to be stated" />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Sentence, Court and Date</label>
                <input type="text" value={form.sentenceCourtDate} onChange={e => setField('sentenceCourtDate', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Prosecutor */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="font-semibold text-white text-xs mb-4 uppercase tracking-wider">Prosecutor</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Name &amp; Rank of Prosecutor</label>
                <input type="text" value={form.prosecutorName} onChange={e => setField('prosecutorName', e.target.value)} className={inputCls} placeholder="Inspector Jane Doe" />
              </div>
              <div>
                <label className={labelCls}>Rank</label>
                <input type="text" value={form.prosecutorRank} onChange={e => setField('prosecutorRank', e.target.value)} className={inputCls} placeholder="INSPECTOR" />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Save className="h-4 w-4" />
              {submitting ? 'Saving...' : 'Save & Preview'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default function NewChargeSheetPage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="p-8 text-center text-gray-400">Loading...</div></DashboardLayout>}>
      <NewChargeSheetContent />
    </Suspense>
  );
}
