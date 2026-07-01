import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ModulePage, gen } from '../../components/shared/ModulePage';
import { PageHeader } from '../../components/shared/PageHeader';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Timeline } from '../../components/shared/Timeline';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { DataTable } from '../../components/shared/DataTable';

// 97. Citizen Login
export const CitizenLogin = () => (
  <div className="min-h-[80vh] flex items-center justify-center">
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-card-hover p-8">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg">
        <Icons.UserCircle2 size={24} className="text-white" />
      </div>
      <h2 className="font-heading font-bold text-2xl text-slate-900">Citizen Portal</h2>
      <p className="text-sm text-slate-500 mt-1">Sign in with your Aadhaar-linked mobile</p>
      <div className="mt-6 space-y-3">
        <Input placeholder="+91 mobile number" className="h-11" />
        <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800">Send OTP</Button>
      </div>
    </div>
  </div>
);

// 98. Search Family ID
export const SearchFamilyID = () => (
  <div className="space-y-6">
    <PageHeader eyebrow="Module 13 · Screen 98" id={98} title="Search Family ID" description="Look up your Family ID using Aadhaar or mobile." icon="Search" />
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-8 text-center max-w-2xl mx-auto">
      <Icons.Search size={40} className="text-slate-300 mx-auto mb-4" />
      <h3 className="font-heading font-semibold text-slate-900">Find your household record</h3>
      <div className="mt-6 space-y-3 max-w-md mx-auto">
        <Input placeholder="Last 4 digits of Aadhaar" className="h-11 text-center font-mono tracking-widest" />
        <Input placeholder="Registered mobile number" className="h-11" />
        <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800">Search</Button>
      </div>
    </div>
  </div>
);

// 99. View Family Profile
export const ViewFamilyProfile = () => (
  <div className="space-y-6">
    <PageHeader eyebrow="Module 13 · Screen 99" id={99} title="Your Family Profile" description="Your GCSR household record." icon="Users" />
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-heading font-bold text-2xl shadow-lg">
          PS
        </div>
        <div>
          <div className="text-[11px] font-mono text-slate-500">Family ID · F48210394</div>
          <h3 className="font-heading font-bold text-xl">Priya Shah's Family</h3>
          <div className="text-[12px] text-slate-500">4 members · Vadodara · Rural</div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {[
          { r: 'Head of Family', n: 'Rajesh Shah', a: 48 },
          { r: 'Spouse', n: 'Priya Shah', a: 42 },
          { r: 'Son', n: 'Kaushik Shah', a: 18 },
          { r: 'Daughter', n: 'Meera Shah', a: 14 },
        ].map((m) => (
          <div key={m.n} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold">{m.n[0]}</div>
            <div><div className="font-medium">{m.n}</div><div className="text-[11px] text-slate-500">{m.r} · {m.a} yrs</div></div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-4">
        <Link to="/portal/update" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50">
          <Icons.FilePen size={18} className="text-indigo-600" />
          <div><div className="font-medium">Update Member</div><div className="text-[11px] text-slate-500">Change address, mobile, etc.</div></div>
        </Link>
        <Link to="/portal/correction" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50">
          <Icons.FileEdit size={18} className="text-indigo-600" />
          <div><div className="font-medium">Raise a correction</div><div className="text-[11px] text-slate-500">Fix errors in your record</div></div>
        </Link>
      </div>
    </div>
  </div>
);

// 100-103
export const UpdateMember = () => (
  <div className="space-y-6">
    <PageHeader eyebrow="Module 13 · Screen 100" id={100} title="Update Member" description="Update phone, address or minor demographic details." icon="FilePen" />
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 max-w-2xl">
      <div className="grid md:grid-cols-2 gap-4">
        {[['Full name','Priya Shah'],['Mobile','+91-98240-XXXXX'],['Email','priya.shah@example.in'],['Address','12/A Sec-15, Vadodara']].map(([k, v]) => (
          <div key={k}><label className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">{k}</label><Input defaultValue={v} className="mt-1" /></div>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-2"><Button variant="outline">Cancel</Button><Button className="bg-slate-900 hover:bg-slate-800">Submit for review</Button></div>
    </div>
  </div>
);

export const RequestMerge = () => (
  <ModulePage config={{
    eyebrow: 'Module 13 · Screen 101', id: 101, title: 'Request Family Merge', icon: 'Merge',
    description: 'Request to merge your household with another Family ID (e.g., after marriage).',
    kpis: [
      gen.kpi('Your requests', '2', 0, 'FileText', 'primary'),
      gen.kpi('Approved', '1', 0, 'CheckCircle2', 'success'),
      gen.kpi('Pending', '1', 0, 'Clock', 'accent'),
    ],
  }} />
);

export const RequestSplit = () => (
  <ModulePage config={{
    eyebrow: 'Module 13 · Screen 102', id: 102, title: 'Request Family Split', icon: 'Split',
    description: 'Request to split from parent household (e.g., separate residence, marriage).',
  }} />
);

export const CorrectionRequest = () => (
  <div className="space-y-6">
    <PageHeader eyebrow="Module 13 · Screen 103" id={103} title="Correction Request" description="Report an error in your family or personal record." icon="FileEdit" />
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 max-w-2xl">
      <div className="space-y-4">
        <div><label className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">Category</label>
          <select className="mt-1 w-full h-11 px-3 rounded-md border border-slate-200 text-[13px]"><option>Name spelling</option><option>Date of birth</option><option>Address</option><option>Family member missing</option><option>Wrong member listed</option></select>
        </div>
        <div><label className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">Description</label>
          <textarea rows={4} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-200 text-[13px]" placeholder="Describe the issue" />
        </div>
        <div><label className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">Supporting document</label>
          <div className="mt-1 border-2 border-dashed border-slate-300 rounded-md p-6 text-center text-[12.5px] text-slate-500"><Icons.Upload size={20} className="mx-auto mb-2" />Upload PDF or image (max 5 MB)</div>
        </div>
        <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800">Submit correction request</Button>
      </div>
    </div>
  </div>
);

// 104. Track Request
export const TrackRequest = () => (
  <div className="space-y-6">
    <PageHeader eyebrow="Module 13 · Screen 104" id={104} title="Track Request" description="Track the status of your submitted requests." icon="PackageSearch" />
    <DataTable
      testKey="track"
      pageSize={8}
      columns={[
        { key: 'id', label: 'Ref #', render: (r) => <span className="font-mono">{r.id}</span> },
        { key: 'type', label: 'Type' },
        { key: 'submitted', label: 'Submitted' },
        { key: 'assignee', label: 'With' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
      ]}
      rows={[
        { id: 'REQ-84210', type: 'Address change', submitted: '3 days ago', assignee: 'District Officer', status: 'Approved' },
        { id: 'REQ-84280', type: 'Correction', submitted: '1 day ago', assignee: 'Reviewer', status: 'Pending Review' },
        { id: 'REQ-84392', type: 'Family split', submitted: '5 hr ago', assignee: 'GCSR MDM', status: 'Draft' },
      ]}
    />
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
      <h3 className="font-heading font-semibold text-slate-900 mb-4">Recent activity</h3>
      <Timeline items={[
        { date: '3 days ago', event: 'Request REQ-84210 submitted', source: 'Citizen Portal', icon: 'FilePen' },
        { date: '2 days ago', event: 'Under review by District Collector', source: 'Vadodara', icon: 'Eye' },
        { date: '1 day ago', event: 'Approved and applied to Golden record', source: 'GCSR', icon: 'CheckCircle2' },
      ]} />
    </div>
  </div>
);
