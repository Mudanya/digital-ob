'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, AlertTriangle } from 'lucide-react';

const WEAPON_TYPES = ['PISTOL', 'REVOLVER', 'RIFLE', 'SHOTGUN', 'SMG', 'SNIPER_RIFLE', 'GRENADE_LAUNCHER', 'OTHER'];

export default function CivilianFirearmsPage() {
  const { token, user } = useAuth();
  const [firearms, setFirearms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regOpen, setRegOpen] = useState(false);
  const [regForm, setRegForm] = useState({
    ownerName: '', ownerIdNumber: '', ownerPhone: '', ownerAddress: '',
    serialNumber: '', weaponType: '', make: '', model: '', caliber: '',
    licenseNumber: '', licenseIssuedAt: '', licenseExpiresAt: '', notes: '',
  });

  const canManage = user && ['INSPECTOR_GENERAL', 'DEPUTY_INSPECTOR_GENERAL', 'OCS', 'OCPD'].includes(user.role);

  useEffect(() => { fetchFirearms(); }, [token, search]);

  const fetchFirearms = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/civilian-firearms?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setFirearms((await res.json()).firearms || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!token) return;
    const res = await fetch('/api/civilian-firearms', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(regForm),
    });
    if (res.ok) {
      setRegOpen(false);
      setRegForm({ ownerName: '', ownerIdNumber: '', ownerPhone: '', ownerAddress: '', serialNumber: '', weaponType: '', make: '', model: '', caliber: '', licenseNumber: '', licenseIssuedAt: '', licenseExpiresAt: '', notes: '' });
      fetchFirearms();
    }
  };

  const isExpiringSoon = (expiresAt: string) => {
    const days = (new Date(expiresAt).getTime() - Date.now()) / 86400000;
    return days <= 30;
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Civilian Firearms Register</h1>
            <p className="text-gray-400 text-sm mt-1">Licensed civilian firearms under this station's jurisdiction</p>
          </div>
          {canManage && (
            <Dialog open={regOpen} onOpenChange={setRegOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Plus className="h-4 w-4" /> Register Firearm
                </button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10 text-white max-w-xl">
                <DialogHeader><DialogTitle>Register Civilian Firearm</DialogTitle></DialogHeader>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Owner Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-gray-300 text-xs">Full Name *</Label><Input className="bg-white/5 border-white/10 text-white mt-1" value={regForm.ownerName} onChange={e => setRegForm(f => ({ ...f, ownerName: e.target.value }))} /></div>
                    <div><Label className="text-gray-300 text-xs">National ID *</Label><Input className="bg-white/5 border-white/10 text-white mt-1" value={regForm.ownerIdNumber} onChange={e => setRegForm(f => ({ ...f, ownerIdNumber: e.target.value }))} /></div>
                    <div><Label className="text-gray-300 text-xs">Phone</Label><Input className="bg-white/5 border-white/10 text-white mt-1" value={regForm.ownerPhone} onChange={e => setRegForm(f => ({ ...f, ownerPhone: e.target.value }))} /></div>
                    <div><Label className="text-gray-300 text-xs">Address</Label><Input className="bg-white/5 border-white/10 text-white mt-1" value={regForm.ownerAddress} onChange={e => setRegForm(f => ({ ...f, ownerAddress: e.target.value }))} /></div>
                  </div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider pt-2">Firearm Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-gray-300 text-xs">Serial Number *</Label><Input className="bg-white/5 border-white/10 text-white mt-1" value={regForm.serialNumber} onChange={e => setRegForm(f => ({ ...f, serialNumber: e.target.value }))} /></div>
                    <div>
                      <Label className="text-gray-300 text-xs">Weapon Type *</Label>
                      <Select value={regForm.weaponType} onValueChange={v => setRegForm(f => ({ ...f, weaponType: v }))}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/10">{WEAPON_TYPES.map(t => <SelectItem key={t} value={t} className="text-white">{t.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label className="text-gray-300 text-xs">Make *</Label><Input className="bg-white/5 border-white/10 text-white mt-1" value={regForm.make} onChange={e => setRegForm(f => ({ ...f, make: e.target.value }))} /></div>
                    <div><Label className="text-gray-300 text-xs">Model</Label><Input className="bg-white/5 border-white/10 text-white mt-1" value={regForm.model} onChange={e => setRegForm(f => ({ ...f, model: e.target.value }))} /></div>
                    <div><Label className="text-gray-300 text-xs">Caliber</Label><Input className="bg-white/5 border-white/10 text-white mt-1" value={regForm.caliber} onChange={e => setRegForm(f => ({ ...f, caliber: e.target.value }))} /></div>
                  </div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider pt-2">License Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2"><Label className="text-gray-300 text-xs">License Number *</Label><Input className="bg-white/5 border-white/10 text-white mt-1" value={regForm.licenseNumber} onChange={e => setRegForm(f => ({ ...f, licenseNumber: e.target.value }))} /></div>
                    <div><Label className="text-gray-300 text-xs">Issued Date *</Label><Input type="date" className="bg-white/5 border-white/10 text-white mt-1" value={regForm.licenseIssuedAt} onChange={e => setRegForm(f => ({ ...f, licenseIssuedAt: e.target.value }))} /></div>
                    <div><Label className="text-gray-300 text-xs">Expiry Date *</Label><Input type="date" className="bg-white/5 border-white/10 text-white mt-1" value={regForm.licenseExpiresAt} onChange={e => setRegForm(f => ({ ...f, licenseExpiresAt: e.target.value }))} /></div>
                  </div>
                  <button onClick={handleRegister} disabled={!regForm.ownerName || !regForm.ownerIdNumber || !regForm.serialNumber || !regForm.weaponType || !regForm.make || !regForm.licenseNumber || !regForm.licenseIssuedAt || !regForm.licenseExpiresAt} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors mt-2">
                    Register Firearm
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input className="pl-9 bg-white/5 border-white/10 text-white" placeholder="Search by owner name, ID, license, or serial number..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Owner</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Firearm</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Serial No.</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">License No.</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Expiry</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : firearms.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No civilian firearms registered</td></tr>
              ) : firearms.map(f => {
                const expired = isExpired(f.licenseExpiresAt);
                const expiring = !expired && isExpiringSoon(f.licenseExpiresAt);
                return (
                  <tr key={f.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{f.ownerName}</p>
                      <p className="text-gray-400 text-xs">ID: {f.ownerIdNumber}</p>
                      {f.ownerPhone && <p className="text-gray-400 text-xs">{f.ownerPhone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white">{f.weaponType.replace(/_/g, ' ')}</p>
                      <p className="text-gray-400 text-xs">{f.make}{f.model ? ` ${f.model}` : ''}{f.caliber ? ` · ${f.caliber}` : ''}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-300 text-xs">{f.serialNumber}</td>
                    <td className="px-4 py-3 font-mono text-gray-300 text-xs">{f.licenseNumber}</td>
                    <td className="px-4 py-3">
                      <p className={`text-xs ${expired ? 'text-red-400' : expiring ? 'text-yellow-400' : 'text-gray-300'}`}>
                        {new Date(f.licenseExpiresAt).toLocaleDateString()}
                      </p>
                      {(expired || expiring) && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <AlertTriangle className={`h-3 w-3 ${expired ? 'text-red-400' : 'text-yellow-400'}`} />
                          <span className={`text-xs ${expired ? 'text-red-400' : 'text-yellow-400'}`}>{expired ? 'Expired' : 'Expiring soon'}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${f.isActive && !expired ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                        {f.isActive && !expired ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
