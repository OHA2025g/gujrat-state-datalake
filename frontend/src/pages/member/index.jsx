import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import api from '../../lib/api';
import { ModulePage, gen } from '../../components/shared/ModulePage';
import { PageHeader, HeaderActions } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import { StatusBadge, ConfidenceBar, InsightPill } from '../../components/shared/StatusBadge';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Timeline } from '../../components/shared/Timeline';

// ========== 41. Member Search ==========
export const MemberSearch = () => {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);

  const search = async () => {
    const r = await api.get('/citizens', { params: { q, limit: 25 } });
    setRows(r.data.items || []);
  };
  useEffect(() => { search(); }, []);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 6 · Screen 41" id={41} title="Member Search" description="Find any citizen by name, member ID, mobile or Aadhaar suffix." icon="Search"
        actions={<HeaderActions.Export />} />
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 flex items-center gap-2">
        <Icons.Search size={16} className="text-slate-400" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, mobile, member ID (e.g., 'Priya Shah', 'C48210394')" className="flex-1 h-10" />
        <Button onClick={search} className="bg-slate-900 hover:bg-slate-800">Search</Button>
      </div>
      <DataTable
        testKey="member-search"
        pageSize={10}
        columns={[
          { key: 'name', label: 'Name', render: (r) => <div><div className="font-medium">{r.name}</div><div className="text-[11px] text-slate-500 font-mono">{r.member_id}</div></div> },
          { key: 'gender', label: 'Gen' },
          { key: 'age', label: 'Age' },
          { key: 'district', label: 'District' },
          { key: 'mobile', label: 'Mobile', render: (r) => <span className="font-mono text-[11.5px]">{r.mobile || '—'}</span> },
          { key: 'family_id', label: 'Family ID', render: (r) => <span className="font-mono text-[11.5px]">{r.family_id}</span> },
          { key: 'confidence_score', label: 'Confidence', render: (r) => <ConfidenceBar value={r.confidence_score} /> },
          gen.statusCol(),
        ]}
        rows={rows}
        onRowClick={setSelected}
      />
    </div>
  );
};

// ========== 42. Member Profile & 58. Golden Citizen 360 ==========
const MemberProfileView = ({ id, screenId, title }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const load = async () => {
      const list = await api.get('/citizens', { params: { limit: 1 } });
      const cid = id || list.data.items?.[0]?.id;
      if (cid) {
        const r = await api.get(`/citizens/${cid}`);
        setData(r.data);
      }
    };
    load();
  }, [id]);

  if (!data) return <div className="p-8 text-slate-400">Loading citizen…</div>;
  const { citizen, family, timeline, enrichments, ai_summary } = data;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={`Module · Screen ${screenId}`} id={screenId} title={title} description="360° view of a citizen across all department datasets." icon="UserCheck" />

      {/* Hero card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative z-10 flex items-start gap-6 flex-wrap">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-heading font-bold text-3xl shadow-xl">
            {citizen.name.split(' ').slice(0, 2).map((s) => s[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-cyan-300 font-mono uppercase tracking-widest">Member ID · {citizen.member_id}</div>
            <h2 className="font-heading font-bold text-3xl mt-1 tracking-tight">{citizen.name}</h2>
            <div className="flex items-center gap-3 text-slate-300 text-sm mt-1 flex-wrap">
              <span>{citizen.age} yrs</span>
              <span>·</span>
              <span>{citizen.gender === 'M' ? 'Male' : 'Female'}</span>
              <span>·</span>
              <span>{citizen.village}, {citizen.district}</span>
              <span>·</span>
              <span className="font-mono">{citizen.aadhaar_masked}</span>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              <StatusBadge status={citizen.verified ? 'Verified' : 'Under Review'} />
              <StatusBadge status={citizen.status} />
              <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-white/10 text-white ring-1 ring-white/20">Category · {citizen.category}</span>
              <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-white/10 text-white ring-1 ring-white/20">{citizen.religion}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[220px]">
            {[
              ['Confidence', `${(citizen.confidence_score * 100).toFixed(1)}%`],
              ['Vulnerability', `${(citizen.vulnerability_score * 100).toFixed(0)}%`],
              ['Risk Score', `${(citizen.risk_score * 100).toFixed(0)}%`],
              ['Sources', `${citizen.sources.length}`],
            ].map(([k, v]) => (
              <div key={k} className="glass-dark border border-white/10 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">{k}</div>
                <div className="font-heading font-bold text-xl text-white">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI summary */}
      <InsightPill tone="info">
        <div><strong className="text-slate-900">AI Copilot Summary:</strong> {ai_summary}</div>
      </InsightPill>

      {/* Departmental enrichment cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { icon: 'HeartPulse',  label: 'Health',       color: '#DC2626', items: [['Insurance', enrichments.health.insurance], ['Jan Aushadhi visits', enrichments.health.jan_aushadhi_visits], ['Hospitalizations', enrichments.health.hospitalizations], ['Chronic', enrichments.health.chronic.join(', ') || 'None']] },
          { icon: 'GraduationCap', label: 'Education',  color: '#2563EB', items: [['School', enrichments.education.school || '—'], ['Highest', enrichments.education.highest], ['Scholarships', enrichments.education.scholarships]] },
          { icon: 'Wheat',       label: 'Agriculture',  color: '#059669', items: [['Land (ha)', enrichments.agriculture.land_ha], ['Primary crop', enrichments.agriculture.crop]] },
          { icon: 'Banknote',    label: 'Banking / DBT',color: '#0891B2', items: [['Accounts', enrichments.banking.accounts], ['Jan Dhan', enrichments.banking.jan_dhan ? 'Yes' : 'No'], ['Last DBT credit', new Date(enrichments.banking.dbt_last_credit).toLocaleDateString()]] },
          { icon: 'Zap',         label: 'Utility',      color: '#D97706', items: [['Electricity', enrichments.utility.electricity], ['LPG', enrichments.utility.lpg]] },
          { icon: 'Home',        label: 'Property / PDS',color: '#7C3AED',items: [['PMAY beneficiary', enrichments.property.pmay ? 'Yes' : 'No'], ['Ration category', enrichments.property.ration]] },
          { icon: 'Briefcase',   label: 'Employment',   color: '#4F46E5', items: [['MGNREGA days', enrichments.employment.mgnrega_days], ['Occupation', enrichments.employment.occupation]] },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${c.color}18`, color: c.color }}>
                {React.createElement(Icons[c.icon], { size: 18 })}
              </div>
              <div className="font-heading font-semibold text-slate-900">{c.label}</div>
            </div>
            <div className="space-y-2 text-[12.5px]">
              {c.items.map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-medium text-slate-900">{v ?? '—'}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Timeline + family */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-card p-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-5 flex items-center gap-2"><Icons.Clock size={16} /> Life Timeline</h3>
          <Timeline items={timeline} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-3 flex items-center gap-2"><Icons.Home size={16} /> Family {family?.family_id}</h3>
          <div className="text-[12.5px] text-slate-600 mb-3">HoF: <strong className="text-slate-900">{family?.hof_name}</strong> · {family?.household_size} members</div>
          <div className="space-y-2 max-h-96 overflow-auto">
            {data.members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[11px] font-semibold">
                  {m.name.split(' ')[0][0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium truncate">{m.name}</div>
                  <div className="text-[10.5px] text-slate-500">{m.relation_to_head} · {m.age} yrs</div>
                </div>
                {m.is_head_of_family && <Icons.Crown size={12} className="text-amber-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MemberProfile = () => <MemberProfileView screenId={42} title="Member Profile" />;
export const GoldenCitizen360 = () => <MemberProfileView screenId={58} title="Golden Citizen 360" />;

// ========== 43. Member ID Generation ==========
export const MemberIDGeneration = () => (
  <ModulePage config={{
    eyebrow: 'Module 6 · Screen 43', id: 43, title: 'Member ID Generation', icon: 'Fingerprint',
    description: 'Deterministic Member ID generation from Aadhaar + demographic clustering.',
    kpis: [
      gen.kpi('Generated (24h)', '38,204', 6.2, 'Fingerprint', 'primary'),
      gen.kpi('Uniqueness', '99.996%', 0.002, 'Award', 'success'),
      gen.kpi('Collisions', '3', -50, 'AlertOctagon', 'warning'),
      gen.kpi('Cluster Size (avg)', '1.02', 0, 'Layers', 'accent'),
    ],
    tables: [{
      key: 'gen', full: true, title: 'Recent Member ID Generations', pageSize: 8,
      columns: [
        { key: 'time', label: 'Time' },
        { key: 'member_id', label: 'Member ID' },
        { key: 'name', label: 'Name' },
        { key: 'sources', label: 'Sources' },
        gen.confCol(),
        gen.statusCol(),
      ],
      rows: Array.from({ length: 10 }, (_, i) => ({
        time: `${i * 3} min ago`,
        member_id: `C${Math.floor(10000000 + Math.random() * 90000000)}`,
        name: ['Kiran Patel','Priya Shah','Rakesh Modi','Nisha Desai','Mahesh Mehta','Anjali Rana','Rakesh Vora','Sunita Bhatt'][i % 8],
        sources: ['Aadhaar+PDS','Aadhaar+PMJAY+PDS','Aadhaar','PDS+MGNREGA','Aadhaar+KISAN'][i % 5],
        confidence: 0.9 + Math.random() * 0.1,
        status: 'Active',
      })),
    }],
  }} />
);

// ========== 44. Matching Review ==========
export const MatchingReview = () => {
  const [pairs, setPairs] = useState([]);
  useEffect(() => { api.get('/members/matching').then((r) => setPairs(r.data.pairs || [])); }, []);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 6 · Screen 44" id={44} title="Matching Review" description="Reviewer workbench for pending duplicate matches." icon="GitCompare" />
      <div className="space-y-3">
        {pairs.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-card p-4 grid md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-center">
            <div>
              <div className="text-[10.5px] uppercase text-slate-500 tracking-wider">Record A</div>
              <div className="font-medium text-slate-900">{p.a.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">{p.a.id} · {p.a.district} · {p.a.aadhaar}</div>
            </div>
            <div className="text-center">
              <div className="text-[10.5px] uppercase text-slate-500 tracking-wider">Score</div>
              <div className="font-heading font-bold text-2xl text-indigo-600">{(p.score * 100).toFixed(0)}%</div>
              <div className="text-[11px] text-slate-500">{p.reason}</div>
            </div>
            <div>
              <div className="text-[10.5px] uppercase text-slate-500 tracking-wider">Record B</div>
              <div className="font-medium text-slate-900">{p.b.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">{p.b.id} · {p.b.district} · {p.b.aadhaar}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">Merge</Button>
              <Button size="sm" variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">Not a match</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========== 45. Duplicate Resolution ==========
export const DuplicateResolution = () => (
  <ModulePage config={{
    eyebrow: 'Module 6 · Screen 45', id: 45, title: 'Duplicate Resolution', icon: 'Users',
    description: 'Resolve duplicate citizens with merge / split / not-a-match decisions.',
    kpis: [
      gen.kpi('Open', '4,188', -22.4, 'Users', 'accent'),
      gen.kpi('Resolved (7d)', '12,842', 8.4, 'CheckCircle2', 'success'),
      gen.kpi('Avg Time', '4.2m', -18.4, 'Timer', 'primary'),
      gen.kpi('Auto Rate', '86%', 3.1, 'Zap', 'secondary'),
    ],
  }} />
);

// ========== 46. Member Timeline ==========
export const MemberTimeline = () => (
  <div className="space-y-6">
    <PageHeader eyebrow="Module 6 · Screen 46" id={46} title="Member Timeline" description="All events across all departments for a selected member." icon="Clock" />
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
      <Timeline items={[
        { date: '2020-01-14', event: 'Aadhaar enrolled', source: 'UIDAI', icon: 'IdCard' },
        { date: '2020-06-22', event: 'PDS ration card linked', source: 'FCS', icon: 'ShoppingBasket' },
        { date: '2021-03-11', event: 'Bank account opened (PMJDY)', source: 'SBI', icon: 'Banknote' },
        { date: '2022-08-04', event: 'Enrolled in PMJAY', source: 'Health Dept', icon: 'HeartPulse' },
        { date: '2023-11-19', event: 'PM-KISAN installment received', source: 'Agriculture', icon: 'Wheat' },
        { date: '2024-02-08', event: 'Address updated', source: 'Revenue', icon: 'MapPin' },
        { date: '2024-09-15', event: 'Family merged (F84210321 ↔ F84210332)', source: 'GCSR', icon: 'Merge' },
        { date: '2025-06-01', event: 'Consent renewed', source: 'Citizen Portal', icon: 'ShieldCheck' },
        { date: '2026-01-14', event: 'Golden Citizen record refreshed', source: 'GCSR MDM', icon: 'RefreshCw' },
      ]} />
    </div>
  </div>
);

// ========== 47. Audit History ==========
export const MemberAudit = () => (
  <ModulePage config={{
    eyebrow: 'Module 6 · Screen 47', id: 47, title: 'Audit History', icon: 'FileClock',
    description: 'Immutable audit trail of every action on this member record.',
    tables: [{
      key: 'audit', full: true, title: 'Audit Log', searchable: true, pageSize: 10,
      columns: [
        { key: 'time', label: 'Time' },
        { key: 'actor', label: 'Actor' },
        { key: 'action', label: 'Action', render: (r) => <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100">{r.action}</span> },
        { key: 'resource', label: 'Resource' },
        { key: 'ip', label: 'IP' },
        gen.statusCol(),
      ],
      rows: gen.audit(20),
    }],
  }} />
);
