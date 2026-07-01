import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import api from '../../lib/api';
import { ModulePage, gen } from '../../components/shared/ModulePage';
import { PageHeader, HeaderActions } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import { StatusBadge, ConfidenceBar } from '../../components/shared/StatusBadge';
import { Timeline } from '../../components/shared/Timeline';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

// 48. Family Search
export const FamilySearch = () => {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const search = async () => {
    const r = await api.get('/families', { params: { q, limit: 25 } });
    setRows(r.data.items || []);
  };
  useEffect(() => { search(); }, []);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 7 · Screen 48" id={48} title="Family Search" description="Search Golden Families by ID, Head of Family or district." icon="Search" />
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 flex items-center gap-2">
        <Icons.Search size={16} className="text-slate-400" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Family ID or HoF name" className="flex-1 h-10" />
        <Button onClick={search} className="bg-slate-900 hover:bg-slate-800">Search</Button>
      </div>
      <DataTable
        testKey="family-search"
        pageSize={10}
        columns={[
          { key: 'family_id', label: 'Family ID', render: (r) => <span className="font-mono">{r.family_id}</span> },
          { key: 'hof_name', label: 'Head of Family' },
          { key: 'household_size', label: 'Size' },
          { key: 'district', label: 'District' },
          { key: 'village', label: 'Village' },
          { key: 'annual_income', label: 'Income' },
          { key: 'ration_card_type', label: 'Ration' },
          { key: 'welfare_saturation', label: 'Welfare', render: (r) => <ConfidenceBar value={r.welfare_saturation} /> },
        ]}
        rows={rows}
      />
    </div>
  );
};

// 49. Family Profile & 59. Golden Family 360 & 60. Household Summary
const FamilyProfileView = ({ screenId, title }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const load = async () => {
      const list = await api.get('/families', { params: { limit: 1 } });
      const fid = list.data.items?.[0]?.family_id;
      if (fid) {
        const r = await api.get(`/families/${fid}`);
        setData(r.data);
      }
    };
    load();
  }, []);
  if (!data) return <div className="p-8 text-slate-400">Loading…</div>;
  const { family, members, timeline } = data;
  const hof = members.find((m) => m.is_head_of_family);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={`Module · Screen ${screenId}`} id={screenId} title={title} description="Household view with all members, welfare & timeline." icon="Home" />

      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="relative z-10 grid md:grid-cols-[1fr_320px] gap-6">
          <div>
            <div className="text-[11px] text-cyan-300 font-mono uppercase tracking-widest">Family ID · {family.family_id}</div>
            <h2 className="font-heading font-bold text-3xl mt-1 tracking-tight">{family.hof_name}'s Household</h2>
            <div className="flex items-center gap-3 text-slate-300 text-sm mt-2 flex-wrap">
              <Icons.Users size={14} /><span>{family.household_size} members</span>
              <span>·</span><Icons.MapPin size={14} /><span>{family.village}, {family.taluka}, {family.district}</span>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              <StatusBadge status={family.verified ? 'Verified' : 'Under Review'} />
              <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-white/10 text-white ring-1 ring-white/20">{family.rural_urban}</span>
              <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-white/10 text-white ring-1 ring-white/20">Category · {family.category}</span>
              <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-white/10 text-white ring-1 ring-white/20">Ration · {family.ration_card_type}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Confidence', `${(family.confidence_score * 100).toFixed(1)}%`],
              ['Welfare Saturation', `${(family.welfare_saturation * 100).toFixed(0)}%`],
              ['Schemes', `${family.schemes_enrolled.length}`],
              ['Income Band', family.annual_income],
            ].map(([k, v]) => (
              <div key={k} className="glass-dark border border-white/10 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">{k}</div>
                <div className="font-heading font-bold text-xl">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-card p-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-5 flex items-center gap-2"><Icons.Users size={16} /> Household Members</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {members.map((m) => (
              <div key={m.id} className={`rounded-xl border p-3 ${m.is_head_of_family ? 'border-amber-200 bg-amber-50/40' : 'border-slate-200 bg-slate-50/40'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${m.is_head_of_family ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                    {m.name.split(' ')[0][0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-[13px] truncate">{m.name}</div>
                    <div className="text-[10.5px] text-slate-500">{m.relation_to_head} · {m.age} yrs · {m.gender === 'M' ? 'Male' : 'Female'}</div>
                  </div>
                  {m.is_head_of_family && <Icons.Crown size={14} className="text-amber-500" />}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">{m.member_id}</span>
                  <span className="text-[10px] text-slate-400">·</span>
                  <span className="text-[10px] text-slate-500 truncate">{m.occupation}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-heading font-semibold text-slate-900 mt-8 mb-3 flex items-center gap-2"><Icons.Sparkles size={16} /> Schemes Enrolled</h3>
          <div className="flex flex-wrap gap-2">
            {family.schemes_enrolled.map((s) => (
              <span key={s} className="text-[11.5px] px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 font-medium">{s}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-5 flex items-center gap-2"><Icons.Clock size={16} /> Family Timeline</h3>
          <Timeline items={timeline} />
        </div>
      </div>
    </div>
  );
};

export const FamilyProfile = () => <FamilyProfileView screenId={49} title="Family Profile" />;
export const GoldenFamily360 = () => <FamilyProfileView screenId={59} title="Golden Family 360" />;
export const HouseholdSummary = () => <FamilyProfileView screenId={60} title="Household Summary" />;

// 50. Relationship Tree
export const RelationshipTree = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get('/families', { params: { limit: 1 } })
      .then((r) => api.get(`/families/${r.data.items?.[0]?.family_id}`))
      .then((r) => setData(r.data));
  }, []);
  if (!data) return null;
  const hof = data.members.find((m) => m.is_head_of_family);
  const spouse = data.members.find((m) => m.relation_to_head === 'Spouse');
  const children = data.members.filter((m) => ['Son','Daughter'].includes(m.relation_to_head));
  const others = data.members.filter((m) => !m.is_head_of_family && m.relation_to_head !== 'Spouse' && !['Son','Daughter'].includes(m.relation_to_head));

  const Node = ({ m, tone = 'default' }) => (
    <div className={`inline-flex flex-col items-center gap-1 p-3 rounded-xl border shadow-card ${
      tone === 'hof' ? 'bg-amber-50 border-amber-200' : tone === 'spouse' ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'
    }`}>
      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold ${
        tone === 'hof' ? 'bg-amber-100 text-amber-800' : tone === 'spouse' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
      }`}>{m.name.split(' ')[0][0]}</div>
      <div className="text-[12px] font-medium text-slate-900 text-center">{m.name}</div>
      <div className="text-[10px] text-slate-500 font-mono">{m.member_id}</div>
      <div className="text-[10px] text-slate-500">{m.relation_to_head} · {m.age}y</div>
    </div>
  );
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 7 · Screen 50" id={50} title="Relationship Tree" description="Kinship graph of the family with HoF, spouse and dependents." icon="Network" />
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-8 overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="flex items-center justify-center gap-8">
            {hof && <Node m={hof} tone="hof" />}
            {spouse && (
              <>
                <div className="flex flex-col items-center"><div className="w-16 h-px bg-slate-300" /><div className="text-[10px] text-slate-400 mt-1">married</div></div>
                <Node m={spouse} tone="spouse" />
              </>
            )}
          </div>
          {children.length > 0 && (
            <>
              <div className="flex justify-center my-4"><div className="w-px h-8 bg-slate-300" /></div>
              <div className="flex items-start justify-center gap-4 flex-wrap">
                {children.map((c) => <Node key={c.id} m={c} />)}
              </div>
            </>
          )}
          {others.length > 0 && (
            <>
              <div className="mt-8 mb-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">Other relations</div>
              <div className="flex items-start justify-center gap-4 flex-wrap">
                {others.map((c) => <Node key={c.id} m={c} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// 51-57 — configuration-driven
const scheme = (screenId, title, icon, description, extra = {}) => ({
  eyebrow: `Module 7 · Screen ${screenId}`, id: screenId, title, icon, description, ...extra,
});

export const FamilyFormation = () => (
  <ModulePage config={scheme(51, 'Family Formation', 'UserPlus', 'Clustering algorithm groups related citizens into families using address, surname & Aadhaar cluster.', {
    kpis: [
      gen.kpi('Formed (24h)', '8,204', 4.2, 'UserPlus', 'primary'),
      gen.kpi('Auto', '7,890', 5.1, 'Zap', 'success'),
      gen.kpi('Manual Review', '314', -12.2, 'Eye', 'warning'),
      gen.kpi('Avg Cluster Size', '4.6', 0.1, 'Users', 'accent'),
    ],
  })} />
);
export const HoFValidation = () => (
  <ModulePage config={scheme(52, 'Head of Family Validation', 'Crown', 'Verify designated HoF using seniority, income, gender-neutral policies.', {
    kpis: [
      gen.kpi('Verified', '1.34 Cr', 2.8, 'Crown', 'success'),
      gen.kpi('Pending', '18,204', -12.4, 'Clock', 'warning'),
      gen.kpi('Reassigned', '8,420', 4.2, 'RefreshCw', 'accent'),
      gen.kpi('Women HoF %', '38.4%', 3.1, 'HeartHandshake', 'primary'),
    ],
  })} />
);
export const FamilyIDGeneration = () => (
  <ModulePage config={scheme(53, 'Family ID Generation', 'Fingerprint', 'Deterministic Family ID from HoF Aadhaar + household hash.', {
    kpis: [
      gen.kpi('Generated (24h)', '8,204', 4.2, 'Fingerprint', 'primary'),
      gen.kpi('Uniqueness', '100%', 0, 'Award', 'success'),
      gen.kpi('Collisions', '0', 0, 'AlertOctagon', 'accent'),
      gen.kpi('Golden Families', '1.38 Cr', 3.1, 'Home', 'secondary'),
    ],
  })} />
);
export const FamilyMerge = () => (
  <ModulePage config={scheme(54, 'Family Merge', 'Merge', 'Merge families identified as duplicates or living-together clusters.', {
    kpis: [
      gen.kpi('Merges (24h)', '412', 6.2, 'Merge', 'primary'),
      gen.kpi('Auto', '384', 8.4, 'Zap', 'success'),
      gen.kpi('Manual', '28', -12.4, 'Users', 'accent'),
      gen.kpi('Reversed', '2', -50.0, 'RotateCcw', 'warning'),
    ],
  })} />
);
export const FamilySplit = () => (
  <ModulePage config={scheme(55, 'Family Split', 'Split', 'Split families due to marriage, migration or divorce events.', {
    kpis: [
      gen.kpi('Splits (30d)', '2,842', 8.4, 'Split', 'primary'),
      gen.kpi('Marriage', '1,204', 12.2, 'Heart', 'accent'),
      gen.kpi('Migration', '842', 4.1, 'MoveRight', 'secondary'),
      gen.kpi('Other', '796', -2.1, 'Circle', 'warning'),
    ],
  })} />
);
export const UpdateRequest = () => (
  <ModulePage config={scheme(56, 'Update Request', 'FilePen', 'Citizen-initiated update requests routed to district officers.', {
    kpis: [
      gen.kpi('Open', '4,218', -8.4, 'FilePen', 'primary'),
      gen.kpi('Approved (7d)', '12,840', 12.2, 'CheckCircle2', 'success'),
      gen.kpi('Rejected', '842', -18.4, 'XCircle', 'danger'),
      gen.kpi('Avg TAT', '2.4d', -12.2, 'Timer', 'accent'),
    ],
  })} />
);
export const FamilyTimeline = () => (
  <div className="space-y-6">
    <PageHeader eyebrow="Module 7 · Screen 57" id={57} title="Family Timeline" description="Chronological events across the household." icon="Clock" />
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
      <Timeline items={[
        { date: '2020-11-04', event: 'Family formed from Aadhaar cluster', source: 'GCSR', icon: 'Users' },
        { date: '2021-05-22', event: 'PDS ration card issued', source: 'FCS', icon: 'ShoppingBasket' },
        { date: '2022-01-14', event: 'PMJAY enrolment completed', source: 'Health', icon: 'HeartPulse' },
        { date: '2022-08-04', event: 'New member added (birth)', source: 'Panchayat', icon: 'Baby' },
        { date: '2023-03-11', event: 'Address updated', source: 'Revenue', icon: 'MapPin' },
        { date: '2024-11-19', event: 'PM-KISAN installment credited', source: 'Agri', icon: 'Wheat' },
        { date: '2025-06-04', event: 'HoF re-verified', source: 'GCSR', icon: 'Crown' },
      ]} />
    </div>
  </div>
);
