import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import api from '../../lib/api';
import { ModulePage, gen } from '../../components/shared/ModulePage';
import { PageHeader, HeaderActions } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import { StatusBadge, ConfidenceBar, InsightPill } from '../../components/shared/StatusBadge';
import { ChartCard } from '../../components/shared/ChartCard';
import { BarChartX, DonutChart, AreaChartX } from '../../components/shared/Charts';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

// ------- 15. Dataset Catalog -------
export const DatasetCatalog = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/datasets').then((r) => setItems(r.data.items || [])); }, []);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 3 · Screen 15" id={15} title="Dataset Catalog" description="Registered datasets across Bronze / Silver / Gold / Platinum zones."
        icon="FolderKanban" actions={<><HeaderActions.Filter /><HeaderActions.Export /><HeaderActions.Primary label="Register Dataset" /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Registered" value={items.length} icon="Files" color="primary" />
        <StatCard label="Gold Zone" value={items.filter(x => x.zone === 'Gold').length} icon="Award" color="warning" />
        <StatCard label="Pending Review" value={items.filter(x => x.status === 'Pending Review').length} icon="Clock" color="accent" />
        <StatCard label="Avg Quality" value={items.length ? `${(items.reduce((a, b) => a + b.quality, 0) / items.length * 100).toFixed(1)}%` : '—'} icon="ShieldCheck" color="success" />
      </div>
      <DataTable
        testKey="dataset-catalog"
        searchable
        pageSize={10}
        columns={[
          { key: 'name', label: 'Dataset', render: (r) => (
            <div>
              <div className="font-medium text-slate-900">{r.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">{r.id} · {r.version}</div>
            </div>
          )},
          { key: 'department', label: 'Dept' },
          { key: 'zone', label: 'Zone', render: (r) => (
            <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              r.zone === 'Bronze' ? 'bg-orange-50 text-orange-700' :
              r.zone === 'Silver' ? 'bg-slate-100 text-slate-700' :
              r.zone === 'Gold' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
            }`}>{r.zone}</span>
          )},
          { key: 'format', label: 'Format' },
          { key: 'size_gb', label: 'Size', render: (r) => `${r.size_gb} GB` },
          { key: 'rows_m', label: 'Rows', render: (r) => `${r.rows_m}M` },
          { key: 'quality', label: 'Quality', render: (r) => <ConfidenceBar value={r.quality} /> },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={items}
      />
    </div>
  );
};

const StatCard = ({ label, value, icon, color = 'primary' }) => {
  const Icon = Icons[icon] || Icons.Circle;
  const colors = { primary: 'bg-blue-50 text-blue-700', secondary: 'bg-indigo-50 text-indigo-700', accent: 'bg-cyan-50 text-cyan-700', success: 'bg-emerald-50 text-emerald-700', warning: 'bg-amber-50 text-amber-700' };
  return (
    <div className="kpi-card bg-white rounded-xl border border-slate-200 p-5 shadow-card">
      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}><Icon size={18} /></span>
        <div><div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">{label}</div><div className="font-heading font-bold text-2xl text-slate-900">{value}</div></div>
      </div>
    </div>
  );
};

// ------- 16. Dataset Upload -------
export const DatasetUpload = () => (
  <div className="space-y-6">
    <PageHeader eyebrow="Module 3 · Screen 16" id={16} title="Dataset Upload" description="Upload files or connect a source for ingestion into the lakehouse." icon="Upload" />
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl border-2 border-dashed border-slate-300 shadow-card p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Icons.CloudUpload size={30} className="text-white" />
        </div>
        <h3 className="font-heading font-bold text-lg text-slate-900">Drop files to upload</h3>
        <p className="text-sm text-slate-500 mt-1">CSV, Parquet, Delta, GeoJSON up to 5 GB per file</p>
        <div className="mt-5 flex justify-center gap-2">
          <Button className="bg-slate-900 hover:bg-slate-800"><Icons.Upload size={14} className="mr-1.5" />Browse files</Button>
          <Button variant="outline"><Icons.Link size={14} className="mr-1.5" />Connect source</Button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
        <h4 className="font-heading font-semibold text-slate-900 mb-3">Upload configuration</h4>
        <div className="space-y-3 text-[12.5px]">
          {[['Department','Health & Family Welfare'],['Target zone','Bronze (Raw)'],['Owner','You'],['PII Classification','Contains-PII'],['Retention','7 years']].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="text-slate-500">{k}</span><span className="font-medium text-slate-900">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ------- 17. Dataset Registration -------
export const DatasetRegistration = () => (
  <ModulePage config={{
    eyebrow: 'Module 3 · Screen 17', id: 17, title: 'Dataset Registration',
    description: 'Register a new dataset with metadata, schema, PII tags and ownership.', icon: 'FilePlus',
    kpis: [
      gen.kpi('Pending', '18', 5.2, 'Clock', 'accent'),
      gen.kpi('Approved (30d)', '124', 12.4, 'CheckCircle2', 'success'),
      gen.kpi('Rejected', '4', -22.0, 'XCircle', 'danger'),
      gen.kpi('Avg Time', '2.3d', -18.4, 'Timer', 'primary'),
    ],
    tables: [{
      key: 'reg-queue', full: true, title: 'Registration Queue',
      searchable: true, pageSize: 8,
      columns: [
        { key: 'name', label: 'Dataset' },
        { key: 'dept', label: 'Dept' },
        { key: 'submitted', label: 'Submitted' },
        gen.confCol('completeness'),
        gen.statusCol(),
      ],
      rows: Array.from({ length: 12 }, (_, i) => ({
        name: ['PMAY-Gj v22','MDM Attendance Q4','MYSY Ledger','PDS Rations Feb','Land Records v5','Anganwadi Fresh','MA-Yojana New','Jan Dhan Feb','KISAN Q4','MGNREGA Feb','SBM v3','Consumer Master'][i],
        dept: ['REV','EDU','EDU','FOOD','REV','WCD','HEALTH','FIN','AGRI','LABOR','UTIL','UTIL'][i],
        submitted: `${i + 1} day${i ? 's' : ''} ago`,
        completeness: 0.6 + Math.random() * 0.4,
        status: ['Pending Review','Pending Review','Approved','Draft','Pending Review','Approved','Draft','Pending Review','Approved','Pending Review','Draft','Approved'][i],
      })),
    }],
  }} />
);

// ------- 18. Dataset Preview -------
export const DatasetPreview = () => (
  <div className="space-y-6">
    <PageHeader eyebrow="Module 3 · Screen 18" id={18} title="Dataset Preview" description="First 100 rows sample from the selected dataset." icon="Eye" />
    <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.Database size={14} className="text-slate-500" />
          <span className="font-mono text-[12px] text-slate-700">PMJAY_Gujarat_Master.parquet</span>
          <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">v22.4</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">18.4M rows · 42 columns</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="bg-slate-50">
            <tr>{['member_id','name','gender','age','district','aadhaar','card_type','enrolled_on'].map((c) => (
              <th key={c} className="px-4 py-2 text-left text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">{c}</th>
            ))}</tr>
          </thead>
          <tbody>
            {Array.from({ length: 20 }, (_, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2 font-mono text-slate-600">C{Math.floor(10000000 + Math.random() * 90000000)}</td>
                <td className="px-4 py-2 font-medium text-slate-900">{['Kiran Patel','Priya Shah','Rajesh Modi','Nisha Desai','Mahesh Mehta','Anjali Rana','Rakesh Vora','Sunita Bhatt'][i % 8]}</td>
                <td className="px-4 py-2">{['M','F'][i % 2]}</td>
                <td className="px-4 py-2">{20 + (i * 3) % 60}</td>
                <td className="px-4 py-2 text-slate-700">{['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar'][i % 5]}</td>
                <td className="px-4 py-2 font-mono text-slate-500">XXXX-XXXX-{1000 + i * 137}</td>
                <td className="px-4 py-2"><StatusBadge status={['Active','Active','Active','Pending'][i % 4]} /></td>
                <td className="px-4 py-2 text-slate-500">2024-{String((i % 12) + 1).padStart(2, '0')}-{String((i % 28) + 1).padStart(2, '0')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ------- 19. Version History -------
export const VersionHistory = () => (
  <ModulePage config={{
    eyebrow: 'Module 3 · Screen 19', id: 19, title: 'Version History', icon: 'History',
    description: 'All versions of the selected dataset with schema drift and approval trail.',
    tables: [{
      key: 'versions', full: true, title: 'Versions', pageSize: 10,
      columns: [
        { key: 'version', label: 'Version', render: (r) => <span className="font-mono text-[12px]">{r.version}</span> },
        { key: 'author', label: 'Author' },
        { key: 'changes', label: 'Change summary' },
        { key: 'rows', label: 'Rows', render: (r) => `${r.rows}M` },
        { key: 'drift', label: 'Drift', render: (r) => <ConfidenceBar value={r.drift} /> },
        gen.statusCol(),
      ],
      rows: Array.from({ length: 12 }, (_, i) => ({
        version: `v${22 - i}.${Math.floor(Math.random() * 9)}`,
        author: ['data-team-a','data-team-b','health-tech'][i % 3],
        changes: ['Schema change: +2 columns','Row-level updates','Full refresh','PII masking rule change','Retention update','Hotfix: null handling','Address standardization v5','Aadhaar seeding fix','Consent flag added','Duplicate cleanup','Column rename','Initial'][i],
        rows: (18 - i * 0.3).toFixed(2),
        drift: 0.02 + Math.random() * 0.3,
        status: i === 0 ? 'Active' : 'Approved',
      })),
    }],
  }} />
);

// ------- 20. Validation Results -------
export const ValidationResults = () => (
  <ModulePage config={{
    eyebrow: 'Module 3 · Screen 20', id: 20, title: 'Validation Results', icon: 'CheckCircle2',
    description: 'Automated validation rules run at ingestion — schema, PII, freshness, business rules.',
    kpis: [
      gen.kpi('Rules Run', '184', 6.4, 'ListChecks', 'primary'),
      gen.kpi('Passed', '176', 5.8, 'CheckCircle2', 'success'),
      gen.kpi('Failed', '5', -12.4, 'XCircle', 'danger'),
      gen.kpi('Warnings', '3', 0, 'AlertTriangle', 'warning'),
    ],
    charts: [
      { key: 'pass-rate', title: 'Pass Rate (14d)', icon: 'TrendingUp', type: 'area', data: gen.monthSeries(14, 92).map((d, i) => ({ month: `D-${14 - i}`, value: 90 + Math.random() * 8 })), tall: true },
      { key: 'category', title: 'Failure Categories', icon: 'PieChart', type: 'donut', tall: true,
        data: [{ name: 'PII', value: 3 }, { name: 'Schema', value: 1 }, { name: 'Freshness', value: 1 }] },
    ],
    tables: [{
      key: 'rules', full: true, title: 'Rule Results', pageSize: 8,
      columns: [
        { key: 'rule', label: 'Rule' },
        { key: 'category', label: 'Category' },
        { key: 'expected', label: 'Expected' },
        { key: 'actual', label: 'Actual' },
        gen.statusCol('outcome'),
      ],
      rows: [
        { rule: 'aadhaar_format', category: 'PII', expected: '100%', actual: '99.6%', outcome: 'FAIL' },
        { rule: 'row_count_delta', category: 'Freshness', expected: '±5%', actual: '+2.3%', outcome: 'OK' },
        { rule: 'null_district', category: 'Completeness', expected: '<1%', actual: '0.24%', outcome: 'OK' },
        { rule: 'unique_member_id', category: 'Uniqueness', expected: '100%', actual: '99.98%', outcome: 'Warning' },
        { rule: 'pincode_valid', category: 'Validity', expected: '100%', actual: '99.4%', outcome: 'Warning' },
        { rule: 'schema_match', category: 'Schema', expected: '42 cols', actual: '42 cols', outcome: 'OK' },
        { rule: 'consent_present', category: 'Consent', expected: 'true', actual: 'true', outcome: 'OK' },
      ],
    }],
  }} />
);

// ------- 21. Metadata Management -------
export const MetadataManagement = () => (
  <ModulePage config={{
    eyebrow: 'Module 3 · Screen 21', id: 21, title: 'Metadata Management', icon: 'Tags',
    description: 'Business, technical and operational metadata across the lakehouse.',
    kpis: [
      gen.kpi('Tables', '412', 6.2, 'Table', 'primary'),
      gen.kpi('Columns', '18,432', 4.3, 'Columns3', 'secondary'),
      gen.kpi('Tags', '2,148', 8.9, 'Tag', 'accent'),
      gen.kpi('Glossary Terms', '384', 2.1, 'BookOpen', 'success'),
    ],
    tables: [{
      key: 'meta', full: true, title: 'Metadata Registry', searchable: true, pageSize: 8,
      columns: [
        { key: 'entity', label: 'Entity' },
        { key: 'type', label: 'Type' },
        { key: 'owner', label: 'Owner' },
        { key: 'pii', label: 'PII', render: (r) => <StatusBadge status={r.pii ? 'Warning' : 'OK'} /> },
        { key: 'tags', label: 'Tags', render: (r) => <div className="flex gap-1 flex-wrap">{r.tags.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">{t}</span>)}</div> },
      ],
      rows: [
        { entity: 'citizens.member_id', type: 'Column', owner: 'GCSR', pii: false, tags: ['golden','primary-key'] },
        { entity: 'citizens.aadhaar', type: 'Column', owner: 'GCSR', pii: true, tags: ['pii','masked'] },
        { entity: 'families', type: 'Table', owner: 'GCSR', pii: false, tags: ['gold','curated'] },
        { entity: 'pmjay_master', type: 'Table', owner: 'Health', pii: true, tags: ['bronze','contains-pii'] },
        { entity: 'pds_ration_cards', type: 'Table', owner: 'FCS', pii: true, tags: ['silver','contains-pii'] },
        { entity: 'schemes_registry', type: 'Table', owner: 'DBT Mission', pii: false, tags: ['reference'] },
      ],
    }],
  }} />
);

// ------- 22. Data Lineage -------
export const DataLineage = () => (
  <div className="space-y-6">
    <PageHeader eyebrow="Module 3 · Screen 22" id={22} title="Data Lineage" description="End-to-end lineage from source systems → Bronze → Silver → Gold → Golden Registry." icon="GitBranch" />
    <div className="bg-white rounded-xl border border-slate-200 shadow-card p-8">
      <div className="grid grid-cols-5 gap-4 items-center">
        {[
          { title: 'Source', nodes: ['Aadhaar Auth','PDS Portal','PMJAY DB','PM-KISAN','MGNREGA'], color: 'bg-slate-100 text-slate-700' },
          { title: 'Bronze (Raw)', nodes: ['aadhaar_raw','pds_raw','pmjay_raw','kisan_raw','mgnrega_raw'], color: 'bg-orange-50 text-orange-800' },
          { title: 'Silver', nodes: ['aadhaar_cleansed','pds_std','pmjay_std','kisan_std','mgnrega_std'], color: 'bg-slate-100 text-slate-800' },
          { title: 'Gold', nodes: ['citizen_master','family_master','benefit_master'], color: 'bg-amber-50 text-amber-900' },
          { title: 'Platinum (MDM)', nodes: ['Golden Citizen 360','Golden Family 360'], color: 'bg-indigo-50 text-indigo-900' },
        ].map((stage, si) => (
          <div key={stage.title} className="space-y-2">
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 text-center">{stage.title}</div>
            {stage.nodes.map((n) => (
              <div key={n} className={`text-[11px] font-medium px-3 py-2 rounded-lg text-center ${stage.color} ring-1 ring-inset ring-slate-200/60`}>{n}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-2 text-[11px] text-slate-500">
        <div className="w-3 h-3 bg-orange-100 rounded" /> Bronze
        <div className="w-3 h-3 bg-slate-100 rounded ml-2" /> Silver
        <div className="w-3 h-3 bg-amber-100 rounded ml-2" /> Gold
        <div className="w-3 h-3 bg-indigo-100 rounded ml-2" /> Platinum
        <span className="ml-auto">Zoom · Fit · Trace impact ↗</span>
      </div>
    </div>
  </div>
);

// ------- 23. Approval Workflow -------
export const ApprovalWorkflow = () => (
  <ModulePage config={{
    eyebrow: 'Module 3 · Screen 23', id: 23, title: 'Approval Workflow', icon: 'Workflow',
    description: '6-step dataset onboarding workflow — from submission to production.',
    kpis: [
      gen.kpi('Pending', '12', 4.2, 'Clock', 'accent'),
      gen.kpi('SLA Breached', '2', -33.0, 'AlertTriangle', 'danger'),
      gen.kpi('Approved (7d)', '38', 8.4, 'CheckCircle2', 'success'),
      gen.kpi('Avg Cycle', '2.1d', -12.4, 'Timer', 'primary'),
    ],
    footer: (
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
        <h3 className="font-heading font-semibold text-slate-900 mb-6">Workflow Stages</h3>
        <div className="flex items-center gap-2">
          {['Submitted','Validated','DQ Passed','Metadata OK','Approved','Published'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex-1 rounded-lg px-3 py-2.5 text-[12px] font-medium text-center ring-1 ${
                i < 3 ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' :
                i === 3 ? 'bg-indigo-50 text-indigo-800 ring-indigo-200' :
                'bg-slate-100 text-slate-500 ring-slate-200'
              }`}>{s}</div>
              {i < 5 && <Icons.ChevronRight size={14} className={i < 3 ? 'text-emerald-500' : 'text-slate-300'} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    ),
  }} />
);

// ------- 24. Dataset Monitoring -------
export const DatasetMonitoring = () => (
  <ModulePage config={{
    eyebrow: 'Module 3 · Screen 24', id: 24, title: 'Dataset Monitoring', icon: 'Activity',
    description: 'Freshness, volume, quality and cost per dataset (last 24 hours).',
    kpis: [
      gen.kpi('Fresh (SLA met)', '98.4%', 0.6, 'Timer', 'success'),
      gen.kpi('Volume Anomalies', '4', -25.0, 'AlertTriangle', 'warning'),
      gen.kpi('Compute Cost (24h)', '₹ 4,120', -3.2, 'Coins', 'primary'),
      gen.kpi('Storage Growth', '+4.2 TB', 6.1, 'HardDrive', 'accent'),
    ],
    charts: [
      { key: 'vol', title: 'Ingestion Volume (24h)', type: 'area', tall: true, icon: 'Activity',
        data: Array.from({ length: 24 }, (_, i) => ({ month: `${i}:00`, value: 200 + Math.random() * 500 })) },
      { key: 'stale', title: 'Stale Datasets by Dept', type: 'bar', tall: true, icon: 'Clock',
        data: [{name:'HEALTH',value:2},{name:'EDU',value:1},{name:'AGRI',value:3},{name:'REV',value:1},{name:'WCD',value:2},{name:'FOOD',value:1}] },
    ],
  }} />
);
