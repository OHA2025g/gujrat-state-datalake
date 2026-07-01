import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/shared/PageHeader';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { DataTable } from '../../components/shared/DataTable';

export const UserProfile = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 1 · Screen 5" id={5} title="User Profile" description="Your GCSR identity, roles, permissions and preferences." icon="User" />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-card p-6 text-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 text-white flex items-center justify-center text-3xl font-heading font-bold mx-auto shadow-lg">
            {user?.full_name?.split(' ').slice(0, 2).map((s) => s[0]).join('') ?? 'U'}
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900 mt-4">{user?.full_name}</h3>
          <div className="text-[12px] text-slate-500">{user?.designation || user?.role}</div>
          <div className="mt-4 flex justify-center gap-2 flex-wrap">
            <StatusBadge status="Verified" />
            <StatusBadge status="Active" />
          </div>
          <div className="mt-6 space-y-2 text-left text-[12.5px]">
            {[
              ['Email', user?.email],
              ['Role', user?.role?.replace('_', ' ')],
              ['Department', user?.department || '—'],
              ['District', user?.district || 'State-wide'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-slate-500">{k}</span>
                <span className="text-slate-900 font-medium truncate ml-4">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
            <h3 className="font-heading font-semibold text-slate-900 mb-4">Preferences</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { l: 'Full name', v: user?.full_name },
                { l: 'Email', v: user?.email },
                { l: 'Phone', v: '+91-98240-XXXXX' },
                { l: 'Language', v: 'English (Gujarati available)' },
                { l: 'Timezone', v: 'Asia/Kolkata (IST)' },
                { l: 'Default district', v: user?.district || 'State-wide' },
              ].map((f) => (
                <div key={f.l}>
                  <label className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">{f.l}</label>
                  <Input defaultValue={f.v || ''} className="mt-1" />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-slate-900 hover:bg-slate-800">Save changes</Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
            <h3 className="font-heading font-semibold text-slate-900 mb-4">Permissions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['View Citizens','Merge Families','Approve Datasets','Export Reports','Manage Users','Run AI Copilot','Configure Rules','View Audit'].map((p) => (
                <div key={p} className="flex items-center gap-2 text-[12.5px] p-2 rounded-md bg-slate-50 border border-slate-100">
                  <Icons.CheckCircle2 size={13} className="text-emerald-600" />
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  useEffect(() => { api.get('/auth/sessions').then((r) => setSessions(r.data.sessions || [])); }, []);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 1 · Screen 6" id={6} title="Session Management" description="Active devices and sessions across your GCSR account." icon="Monitor" />
      <DataTable
        testKey="sessions"
        columns={[
          { key: 'device', label: 'Device' },
          { key: 'ip', label: 'IP address' },
          { key: 'location', label: 'Location' },
          { key: 'started', label: 'Started', render: (r) => new Date(r.started).toLocaleString() },
          { key: 'current', label: 'Status', render: (r) => r.current ? <StatusBadge status="Active" /> : <StatusBadge status="OK" /> },
        ]}
        rows={sessions}
      />
    </div>
  );
};
