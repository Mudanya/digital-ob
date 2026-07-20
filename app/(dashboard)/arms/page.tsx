'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Crosshair, Plus, Search, RotateCcw, UserPlus } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  IN_ARMORY: 'bg-green-500/20 text-green-400 border-green-500/30',
  ASSIGNED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  LOST: 'bg-red-500/20 text-red-400 border-red-500/30',
  DAMAGED: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  CONDEMNED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  UNDER_REPAIR: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const CONDITION_COLORS: Record<string, string> = {
  SERVICEABLE: 'text-green-400',
  UNSERVICEABLE: 'text-red-400',
  NEEDS_REPAIR: 'text-yellow-400',
};

const WEAPON_TYPES = ['PISTOL', 'REVOLVER', 'RIFLE', 'SHOTGUN', 'SMG', 'SNIPER_RIFLE', 'GRENADE_LAUNCHER', 'OTHER'];
const WEAPON_STATUSES = ['IN_ARMORY', 'ASSIGNED', 'LOST', 'DAMAGED', 'CONDEMNED', 'UNDER_REPAIR'];
const WEAPON_CONDITIONS = ['SERVICEABLE', 'UNSERVICEABLE', 'NEEDS_REPAIR'];

export default function ArmsPage() {
  const { token, user } = useAuth();
  const [weapons, setWeapons] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Register weapon form
  const [regOpen, setRegOpen] = useState(false);
  const [regForm, setRegForm] = useState({ serialNumber: '', weaponType: '', make: '', model: '', caliber: '', condition: 'SERVICEABLE', dateAcquired: '', notes: '' });

  // Assign weapon dialog
  const [assignWeapon, setAssignWeapon] = useState<any>(null);
  const [assignOfficerId, setAssignOfficerId] = useState('');
  const [assignPurpose, setAssignPurpose] = useState('');

  const canManage = user && ['INSPECTOR_GENERAL', 'DEPUTY_INSPECTOR_GENERAL', 'OCS', 'OCPD', 'OCP', 'INSPECTOR'].includes(user.role);

  useEffect(() => {
    fetchWeapons();
    fetchOfficers();
  }, [token, statusFilter, typeFilter]);

  const fetchWeapons = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter && typeFilter !== 'all') params.set('weaponType', typeFilter);
      const res = await fetch(`/api/weapons?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setWeapons((await res.json()).weapons || []);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOfficers = async () => {
    if (!token) return;
    const res = await fetch('/api/officers', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setOfficers((await res.json()).officers || []);
  };

  const handleRegister = async () => {
    if (!token) return;
    const res = await fetch('/api/weapons', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(regForm),
    });
    if (res.ok) {
      setRegOpen(false);
      setRegForm({ serialNumber: '', weaponType: '', make: '', model: '', caliber: '', condition: 'SERVICEABLE', dateAcquired: '', notes: '' });
      fetchWeapons();
    }
  };

  const handleAssign = async () => {
    if (!token || !assignWeapon || !assignOfficerId) return;
    const res = await fetch(`/api/weapons/${assignWeapon.id}/assign`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ officerId: assignOfficerId, purpose: assignPurpose }),
    });
    if (res.ok) {
      setAssignWeapon(null);
      setAssignOfficerId('');
      setAssignPurpose('');
      fetchWeapons();
    }
  };

  const handleReturn = async (weaponId: string) => {
    if (!token) return;
    const res = await fetch(`/api/weapons/${weaponId}/return`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (res.ok) fetchWeapons();
  };

  const filtered = weapons.filter(w =>
    !search || w.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
    w.make.toLowerCase().includes(search.toLowerCase()) ||
    (w.model || '').toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: weapons.length,
    inArmory: weapons.filter(w => w.status === 'IN_ARMORY').length,
    assigned: weapons.filter(w => w.status === 'ASSIGNED').length,
    others: weapons.filter(w => !['IN_ARMORY', 'ASSIGNED'].includes(w.status)).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Arms Registry</h1>
            <p className="text-gray-400 text-sm mt-1">Station armory — weapon register & assignment log</p>
          </div>
          {canManage && (
            <Dialog open={regOpen} onOpenChange={setRegOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Plus className="h-4 w-4" /> Register Weapon
                </button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Register New Weapon</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-300 text-xs">Serial Number *</Label>
                      <Input className="bg-white/5 border-white/10 text-white mt-1" value={regForm.serialNumber} onChange={e => setRegForm(f => ({ ...f, serialNumber: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-xs">Weapon Type *</Label>
                      <Select value={regForm.weaponType} onValueChange={v => setRegForm(f => ({ ...f, weaponType: v }))}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/10">{WEAPON_TYPES.map(t => <SelectItem key={t} value={t} className="text-white">{t.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300 text-xs">Make *</Label>
                      <Input className="bg-white/5 border-white/10 text-white mt-1" placeholder="e.g. Glock" value={regForm.make} onChange={e => setRegForm(f => ({ ...f, make: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-xs">Model</Label>
                      <Input className="bg-white/5 border-white/10 text-white mt-1" placeholder="e.g. 17" value={regForm.model} onChange={e => setRegForm(f => ({ ...f, model: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-xs">Caliber</Label>
                      <Input className="bg-white/5 border-white/10 text-white mt-1" placeholder="e.g. 9mm" value={regForm.caliber} onChange={e => setRegForm(f => ({ ...f, caliber: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-xs">Date Acquired</Label>
                      <Input type="date" className="bg-white/5 border-white/10 text-white mt-1" value={regForm.dateAcquired} onChange={e => setRegForm(f => ({ ...f, dateAcquired: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300 text-xs">Notes</Label>
                    <Input className="bg-white/5 border-white/10 text-white mt-1" value={regForm.notes} onChange={e => setRegForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                  <button onClick={handleRegister} disabled={!regForm.serialNumber || !regForm.weaponType || !regForm.make} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Register Weapon
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Weapons', value: stats.total, color: 'text-white' },
            { label: 'In Armory', value: stats.inArmory, color: 'text-green-400' },
            { label: 'Assigned', value: stats.assigned, color: 'text-blue-400' },
            { label: 'Lost / Damaged', value: stats.others, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input className="pl-9 bg-white/5 border-white/10 text-white" placeholder="Search by serial, make, model..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white"><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10">
              <SelectItem value="all" className="text-white">All Statuses</SelectItem>
              {WEAPON_STATUSES.map(s => <SelectItem key={s} value={s} className="text-white">{s.replace(/_/g, ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10">
              <SelectItem value="all" className="text-white">All Types</SelectItem>
              {WEAPON_TYPES.map(t => <SelectItem key={t} value={t} className="text-white">{t.replace(/_/g, ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Serial No.</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Type / Make</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Caliber</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Condition</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Assigned To</th>
                {canManage && <th className="text-left px-4 py-3 text-gray-400 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No weapons found</td></tr>
              ) : filtered.map(w => {
                const activeAssignment = w.assignments?.[0];
                return (
                  <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-white text-xs">{w.serialNumber}</td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{w.weaponType.replace(/_/g, ' ')}</p>
                      <p className="text-gray-400 text-xs">{w.make}{w.model ? ` ${w.model}` : ''}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{w.caliber || '—'}</td>
                    <td className={`px-4 py-3 text-xs font-medium ${CONDITION_COLORS[w.condition] || 'text-gray-400'}`}>
                      {w.condition.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[w.status] || 'bg-gray-500/20 text-gray-400'}`}>
                        {w.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {activeAssignment ? (
                        <div>
                          <p className="text-white text-xs">{activeAssignment.officer.firstName} {activeAssignment.officer.lastName}</p>
                          <p className="text-gray-400 text-xs">{activeAssignment.officer.rank}</p>
                        </div>
                      ) : <span className="text-gray-500 text-xs">—</span>}
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {w.status === 'IN_ARMORY' && (
                            <button onClick={() => setAssignWeapon(w)} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 px-2 py-1 rounded transition-colors">
                              <UserPlus className="h-3 w-3" /> Assign
                            </button>
                          )}
                          {w.status === 'ASSIGNED' && (
                            <button onClick={() => handleReturn(w.id)} className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 border border-green-500/30 px-2 py-1 rounded transition-colors">
                              <RotateCcw className="h-3 w-3" /> Return
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Dialog */}
      {assignWeapon && (
        <Dialog open={!!assignWeapon} onOpenChange={() => setAssignWeapon(null)}>
          <DialogContent className="bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Assign Weapon</DialogTitle>
            </DialogHeader>
            <p className="text-gray-400 text-sm">Assigning: <span className="text-white font-mono">{assignWeapon.serialNumber}</span> ({assignWeapon.make} {assignWeapon.weaponType})</p>
            <div className="space-y-3">
              <div>
                <Label className="text-gray-300 text-xs">Officer *</Label>
                <Select value={assignOfficerId} onValueChange={setAssignOfficerId}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue placeholder="Select officer" /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {officers.map(o => <SelectItem key={o.id} value={o.id} className="text-white">{o.firstName} {o.lastName} — {o.rank} ({o.serviceNumber})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300 text-xs">Purpose</Label>
                <Input className="bg-white/5 border-white/10 text-white mt-1" placeholder="e.g. Field patrol duty" value={assignPurpose} onChange={e => setAssignPurpose(e.target.value)} />
              </div>
              <button onClick={handleAssign} disabled={!assignOfficerId} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Confirm Assignment
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
