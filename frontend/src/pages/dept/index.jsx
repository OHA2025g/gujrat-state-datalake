import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import api from '../../lib/api';
import { ModulePage, gen } from '../../components/shared/ModulePage';
import { PageHeader, HeaderActions } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import { StatusBadge, ConfidenceBar } from '../../components/shared/StatusBadge';

// ------- 25. Department Registry -------
export const DepartmentRegistry = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/departments').then((r) => setItems(r.data.items || [])); }, []);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 4 · Screen 25" id={25} title="Department Registry" description="All state departments integrated with GCSR + their integration status." icon="Building" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {items.map((d) => (
          <div key={d.id} className="kpi-card bg-white rounded-xl border border-slate-200 shadow-card p-5">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-3" style={{ background: `${d.color}18`, color: d.color }}>
              {React.createElement(Icons[d.icon] || Icons.Circle, { size: 20 })}
            </div>
            <div className="font-heading font-semibold text-slate-900 text-[13.5px] leading-tight">{d.name}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{d.code}</div>
            <div className="mt-3 flex items-center gap-2"><StatusBadge status={d.integration_status} /></div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div><div className="text-slate-500">Records</div><div className="font-mono font-semibold text-slate-900">{(d.record_count / 1e6).toFixed(1)}M</div></div>
              <div><div className="text-slate-500">Quality</div><ConfidenceBar value={d.quality_score} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ------- 26. Integration Dashboard -------
export const IntegrationDashboard = () => (
  <ModulePage config={{
    eyebrow: 'Module 4 · Screen 26', id: 26, title: 'Integration Dashboard', icon: 'LayoutDashboard',
    description: 'Live health of all department API integrations.',
    kpis: [
      gen.kpi('Live APIs', '184', 4.2, 'Cable', 'primary'),
      gen.kpi('SLA (30d)', '99.72%', 0.1, 'Activity', 'success'),
      gen.kpi('4xx Errors', '0.42%', -12.4, 'AlertCircle', 'warning'),
      gen.kpi('5xx Errors', '0.02%', -50.0, 'AlertOctagon', 'danger'),
    ],
    charts: [
      { key: 'lat', title: 'API Latency (p95)', type: 'line', tall: true, icon: 'Timer',
        data: Array.from({ length: 24 }, (_, i) => ({ month: `${i}:00`, value: 100 + Math.random() * 80 })) },
      { key: 'thr', title: 'Requests / hour', type: 'area', tall: true, icon: 'Activity',
        data: Array.from({ length: 24 }, (_, i) => ({ month: `${i}:00`, value: 20000 + Math.random() * 50000 })) },
    ],
  }} />
);

// ------- 27. API Configuration -------
export const APIConfiguration = () => (
  <ModulePage config={{
    eyebrow: 'Module 4 · Screen 27', id: 27, title: 'API Configuration', icon: 'Cable',
    description: 'Configure endpoints, auth, rate limits and consent flows.',
    kpis: [
      gen.kpi('Endpoints', '184', 3.1, 'Cable', 'primary'),
      gen.kpi('Public', '42', 0, 'Globe', 'accent'),
      gen.kpi('Private', '124', 6.2, 'Lock', 'success'),
      gen.kpi('Deprecated', '18', -20.0, 'Archive', 'warning'),
    ],
    tables: [{
      key: 'endpoints', full: true, title: 'Endpoints', searchable: true, pageSize: 8,
      columns: [
        { key: 'method', label: 'Method', render: (r) => <span className={`font-mono text-[10.5px] px-1.5 py-0.5 rounded ${
          r.method === 'GET' ? 'bg-emerald-50 text-emerald-700' : r.method === 'POST' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
        }`}>{r.method}</span> },
        { key: 'path', label: 'Path', render: (r) => <span className="font-mono text-[12px]">{r.path}</span> },
        { key: 'dept', label: 'Owner' },
        { key: 'auth', label: 'Auth' },
        { key: 'rate', label: 'Rate' },
        gen.statusCol(),
      ],
      rows: [
        { method: 'GET', path: '/api/v1/citizens/{id}', dept: 'GCSR', auth: 'JWT + Consent', rate: '1K/min', status: 'Active' },
        { method: 'POST', path: '/api/v1/families/merge', dept: 'GCSR', auth: 'JWT + RBAC', rate: '100/min', status: 'Active' },
        { method: 'GET', path: '/api/v1/schemes/eligibility', dept: 'DBT', auth: 'JWT', rate: '500/min', status: 'Active' },
        { method: 'POST', path: '/api/v1/consent/grant', dept: 'GCSR', auth: 'Aadhaar OTP', rate: '50/min', status: 'Active' },
        { method: 'GET', path: '/api/v1/health/pmjay/{aadhaar}', dept: 'HEALTH', auth: 'JWT + Consent', rate: '200/min', status: 'Active' },
        { method: 'DELETE', path: '/api/v1/consent/{id}', dept: 'GCSR', auth: 'JWT', rate: '50/min', status: 'Active' },
      ],
    }],
  }} />
);

// ------- 28. Batch Import -------
export const BatchImport = () => (
  <ModulePage config={{
    eyebrow: 'Module 4 · Screen 28', id: 28, title: 'Batch Import', icon: 'PackageOpen',
    description: 'Scheduled and ad-hoc batch imports from department source systems.',
    kpis: [
      gen.kpi('Jobs (24h)', '164', 3.2, 'Package', 'primary'),
      gen.kpi('Success', '158', 4.1, 'CheckCircle2', 'success'),
      gen.kpi('Failed', '4', -50.0, 'XCircle', 'danger'),
      gen.kpi('Retries', '12', 8.4, 'RefreshCw', 'warning'),
    ],
    tables: [{
      key: 'jobs', full: true, title: 'Batch Jobs', searchable: true, pageSize: 8,
      columns: [
        { key: 'job', label: 'Job' },
        { key: 'dept', label: 'Dept' },
        { key: 'rows', label: 'Rows' },
        { key: 'started', label: 'Started' },
        { key: 'duration', label: 'Duration' },
        gen.statusCol(),
      ],
      rows: Array.from({ length: 12 }, (_, i) => ({
        job: ['PMJAY_nightly','PDS_hourly','PMKISAN_weekly','MGNREGA_daily','MDM_daily','MYSY_weekly','JanDhan_hourly','Aadhaar_seed_daily','MAYojana_nightly','Anganwadi_daily','LandRecords_weekly','UGVCL_hourly'][i],
        dept: ['HEALTH','FOOD','AGRI','LABOR','EDU','EDU','FIN','GCSR','HEALTH','WCD','REV','UTIL'][i],
        rows: `${(Math.random() * 8 + 0.4).toFixed(1)}M`,
        started: `${i + 1}h ago`,
        duration: `${(Math.random() * 40 + 2).toFixed(0)}m`,
        status: [Math.random() > 0.15 ? 'OK' : 'FAIL'][0],
      })),
    }],
  }} />
);

// ------- 29. Real-Time Sync -------
export const RealTimeSync = () => (
  <ModulePage config={{
    eyebrow: 'Module 4 · Screen 29', id: 29, title: 'Real-Time Sync Monitor', icon: 'RefreshCw',
    description: 'Kafka + change data capture streams from department systems.',
    kpis: [
      gen.kpi('Topics', '42', 0, 'Radio', 'primary'),
      gen.kpi('Msgs/sec', '18.4K', 12.2, 'Zap', 'accent'),
      gen.kpi('Consumer Lag', '128', -18.4, 'Timer', 'warning'),
      gen.kpi('Dead Letters', '12', -25.0, 'AlertOctagon', 'danger'),
    ],
    charts: [
      { key: 'msgs', title: 'Messages per second (last hour)', type: 'area', tall: true, full: true, icon: 'Activity',
        data: Array.from({ length: 60 }, (_, i) => ({ month: `${i}m`, value: 14000 + Math.random() * 8000 })) },
    ],
  }} />
);

// ------- 30. API Usage Dashboard -------
export const APIUsage = () => (
  <ModulePage config={{
    eyebrow: 'Module 4 · Screen 30', id: 30, title: 'API Usage Dashboard', icon: 'BarChart3',
    description: 'Consumption by department, endpoint and client — with quota tracking.',
    kpis: [
      gen.kpi('Requests (24h)', '18.4M', 8.2, 'Activity', 'primary'),
      gen.kpi('Unique Clients', '412', 4.1, 'Users', 'secondary'),
      gen.kpi('Data Egress', '82 GB', 2.4, 'Download', 'accent'),
      gen.kpi('Errors', '0.4%', -12.4, 'AlertCircle', 'warning'),
    ],
    charts: [
      { key: 'top-consumers', title: 'Top Consumers', type: 'bar', tall: true, icon: 'Users',
        data: [{name:'DBT Mission',value:4200000},{name:'Health',value:3400000},{name:'Education',value:2100000},{name:'FCS',value:1800000},{name:'Agri',value:1200000},{name:'Revenue',value:900000}] },
      { key: 'top-ep', title: 'Top Endpoints', type: 'hbar', tall: true, icon: 'Cable',
        data: [{name:'/citizens/{id}',value:6200000},{name:'/families/{id}',value:4100000},{name:'/schemes/eligibility',value:2400000},{name:'/consent/verify',value:1200000},{name:'/dbt/status',value:890000}] },
    ],
  }} />
);

// ------- 31. Integration Errors -------
export const IntegrationErrors = () => (
  <ModulePage config={{
    eyebrow: 'Module 4 · Screen 31', id: 31, title: 'Integration Errors', icon: 'AlertOctagon',
    description: 'Recent 4xx/5xx errors across department integrations with root-cause hints.',
    kpis: [
      gen.kpi('Errors (24h)', '4,218', -12.4, 'AlertOctagon', 'danger'),
      gen.kpi('Auth failures', '842', -22.1, 'ShieldOff', 'warning'),
      gen.kpi('Timeouts', '128', -8.4, 'Timer', 'accent'),
      gen.kpi('Retried', '3,124', 4.2, 'RefreshCw', 'primary'),
    ],
    tables: [{
      key: 'errors', full: true, title: 'Recent Errors', searchable: true, pageSize: 8,
      columns: [
        { key: 'time', label: 'Time' },
        { key: 'code', label: 'Code', render: (r) => <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">{r.code}</span> },
        { key: 'endpoint', label: 'Endpoint' },
        { key: 'dept', label: 'Dept' },
        { key: 'reason', label: 'Reason' },
      ],
      rows: Array.from({ length: 12 }, (_, i) => ({
        time: `${(i + 1) * 3} min ago`,
        code: ['429','401','500','503','422','403'][i % 6],
        endpoint: ['/citizens/lookup','/families/merge','/pmjay/status','/kisan/installment','/consent/verify','/schemes/eligibility'][i % 6],
        dept: ['HEALTH','FOOD','AGRI','EDU','LABOR','FIN'][i % 6],
        reason: ['Rate limit exceeded','Invalid JWT','Upstream 500','Circuit breaker open','Validation failed','Consent expired'][i % 6],
      })),
    }],
  }} />
);

// ------- 32. Department Health -------
export const DepartmentHealth = () => (
  <ModulePage config={{
    eyebrow: 'Module 4 · Screen 32', id: 32, title: 'Department Health', icon: 'HeartPulse',
    description: 'End-to-end health index of each department integration.',
    kpis: [
      gen.kpi('Healthy', '38', 4.2, 'CheckCircle2', 'success'),
      gen.kpi('Warning', '5', -12.4, 'AlertTriangle', 'warning'),
      gen.kpi('Degraded', '2', -50.0, 'AlertOctagon', 'danger'),
      gen.kpi('Not Onboarded', '4', 0, 'MinusCircle', 'primary'),
    ],
    charts: [
      { key: 'heat', title: 'Department Health Matrix', type: 'heatmap', tall: true, full: true, icon: 'Grid',
        data: ['Health','Education','Revenue','Agriculture','Welfare','Finance','Utility','Labour','WCD','FCS','Panchayat','Urban Dev','Home','Transport'].map((d) => ({ district: d, score: 70 + Math.random() * 28 })) },
    ],
  }} />
);
