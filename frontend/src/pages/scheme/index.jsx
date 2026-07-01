import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { ModulePage, gen } from '../../components/shared/ModulePage';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import { ConfidenceBar, StatusBadge } from '../../components/shared/StatusBadge';
import { KPICard } from '../../components/shared/KPICard';
import { ChartCard } from '../../components/shared/ChartCard';
import { LineChartX, BarChartX, DonutChart } from '../../components/shared/Charts';

// 73. Scheme Registry
export const SchemeRegistry = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/schemes').then((r) => setItems(r.data.items || [])); }, []);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 10 · Screen 73" id={73} title="Scheme Registry" description="All flagship central & state schemes integrated with GCSR." icon="BookMarked" />
      <DataTable
        testKey="schemes"
        pageSize={12}
        searchable
        columns={[
          { key: 'code', label: 'Code', render: (r) => <span className="font-mono text-[11.5px]">{r.code}</span> },
          { key: 'name', label: 'Scheme' },
          { key: 'dept', label: 'Dept' },
          { key: 'beneficiaries', label: 'Beneficiaries', render: (r) => r.beneficiaries.toLocaleString('en-IN') },
          { key: 'coverage_pct', label: 'Coverage', render: (r) => <ConfidenceBar value={r.coverage_pct / 100} /> },
          { key: 'monthly_disbursal_cr', label: '₹ Cr/month', render: (r) => `₹ ${r.monthly_disbursal_cr}` },
          { key: 'leakage_pct', label: 'Leakage', render: (r) => <span className={`text-[11.5px] font-mono ${r.leakage_pct > 3 ? 'text-rose-700' : 'text-slate-700'}`}>{r.leakage_pct}%</span> },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={items}
      />
    </div>
  );
};

// 74. Eligibility Engine
export const EligibilityEngine = () => (
  <ModulePage config={{
    eyebrow: 'Module 10 · Screen 74', id: 74, title: 'Eligibility Engine', icon: 'CheckCircle2',
    description: 'Rule-based + ML eligibility engine evaluates citizens against 200+ schemes.',
    kpis: [
      gen.kpi('Evaluated (24h)', '4.2M', 8.4, 'Zap', 'primary'),
      gen.kpi('Newly Eligible', '128K', 12.4, 'UserPlus', 'success'),
      gen.kpi('No Longer Eligible', '42K', -8.2, 'UserMinus', 'warning'),
      gen.kpi('Rules Active', '204', 4.1, 'ListChecks', 'accent'),
    ],
    tables: [{
      key: 'rules', full: true, title: 'Active Eligibility Rules', pageSize: 8,
      columns: [
        { key: 'scheme', label: 'Scheme' },
        { key: 'rule', label: 'Rule' },
        { key: 'population', label: 'Applies to' },
        { key: 'eligible', label: 'Eligible' },
        gen.statusCol(),
      ],
      rows: [
        { scheme: 'PMAY-G', rule: 'income < ₹3L AND rural AND no pucca house', population: '2.4 Cr', eligible: '38.2 L', status: 'Active' },
        { scheme: 'PM-KISAN', rule: 'landholding > 0 AND < 2 ha', population: '89 L', eligible: '54.3 L', status: 'Active' },
        { scheme: 'VVY', rule: 'girl child in family AND income < ₹2L', population: '12 L', eligible: '3.4 L', status: 'Active' },
        { scheme: 'MYSY', rule: 'HSC passed AND income < ₹6L', population: '4.2 L', eligible: '1.28 L', status: 'Active' },
        { scheme: 'PMJAY', rule: 'SECC 2011 deprivation OR income < ₹1.5L', population: '68 L', eligible: '54.2 L', status: 'Active' },
      ],
    }],
  }} />
);

// 75. Scheme Recommendation
export const SchemeRecommendation = () => (
  <ModulePage config={{
    eyebrow: 'Module 10 · Screen 75', id: 75, title: 'Scheme Recommendation', icon: 'Sparkles',
    description: 'AI recommends schemes for citizens based on Golden 360 profile.',
    kpis: [
      gen.kpi('Recommendations (24h)', '842K', 12.4, 'Sparkles', 'primary'),
      gen.kpi('Accepted', '312K', 8.2, 'CheckCircle2', 'success'),
      gen.kpi('Precision @5', '78%', 3.4, 'Target', 'accent'),
      gen.kpi('Coverage lift', '+18.4%', 4.1, 'TrendingUp', 'secondary'),
    ],
    tables: [{
      key: 'rec', full: true, title: 'Sample Recommendations', pageSize: 6,
      columns: [
        { key: 'citizen', label: 'Citizen' },
        { key: 'scheme', label: 'Recommended Scheme' },
        { key: 'reason', label: 'Reason' },
        { key: 'score', label: 'Score', render: (r) => <ConfidenceBar value={r.score} /> },
      ],
      rows: Array.from({ length: 8 }, (_, i) => ({
        citizen: ['Kiran Patel','Priya Shah','Rakesh Modi','Nisha Desai','Mahesh Mehta','Anjali Rana'][i % 6],
        scheme: ['PMAY-G','VVY','MYSY','MGNREGA','PMKSN','PMJAY','SBM','PMUY'][i],
        reason: ['Rural + income match','Female child in family','HSC + income match','Rural + wage seeker','Small farmer','SECC deprivation','No toilet','No LPG'][i],
        score: 0.7 + Math.random() * 0.3,
      })),
    }],
  }} />
);

// 76. DBT Dashboard
export const DBTDashboard = () => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/dbt/dashboard').then((r) => setData(r.data)); }, []);
  if (!data) return null;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 10 · Screen 76" id={76} title="DBT Dashboard" description="Direct Benefit Transfer state-wide performance." icon="BarChart3" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(data.kpis || []).map((k) => <KPICard key={k.key} {...k} testKey={k.key} />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Disbursals (₹ Cr)" icon="TrendingUp" tall><LineChartX data={data.trend} yKey="amount" /></ChartCard>
        <ChartCard title="By Scheme (₹ Cr)" icon="Layers" tall><BarChartX data={data.by_scheme?.map(s => ({ name: s.scheme, value: s.amount }))} /></ChartCard>
      </div>
      <ChartCard title="Welfare Leakage by district (₹ Cr)" icon="AlertTriangle" tall>
        <BarChartX data={data.leakage_by_district?.map(d => ({ name: d.district, value: d.leakage_cr }))} />
      </ChartCard>
    </div>
  );
};

// 77. Benefit History
export const BenefitHistory = () => (
  <ModulePage config={{
    eyebrow: 'Module 10 · Screen 77', id: 77, title: 'Benefit History', icon: 'History',
    description: 'All benefits disbursed to a family across schemes and years.',
    tables: [{
      key: 'ben', full: true, title: 'Benefits received', searchable: true, pageSize: 10,
      columns: [
        { key: 'date', label: 'Date' },
        { key: 'scheme', label: 'Scheme' },
        { key: 'amount', label: 'Amount', render: (r) => `₹ ${r.amount.toLocaleString('en-IN')}` },
        { key: 'account', label: 'Credited to' },
        gen.statusCol(),
      ],
      rows: Array.from({ length: 15 }, (_, i) => ({
        date: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        scheme: ['PM-KISAN','PMAY-G','MGNREGA','VVY','MDM','MYSY','NSAP','PMUY'][i % 8],
        amount: [2000, 40000, 4200, 4000, 800, 25000, 1000, 1600][i % 8],
        account: `SBI ****${Math.floor(1000 + Math.random() * 9000)}`,
        status: Math.random() > 0.1 ? 'OK' : 'FAIL',
      })),
    }],
  }} />
);

// 78-80
export const DuplicateBenefit = () => (
  <ModulePage config={{
    eyebrow: 'Module 10 · Screen 78', id: 78, title: 'Duplicate Benefit', icon: 'Copy',
    description: 'Detect citizens receiving overlapping benefits from multiple sources.',
    kpis: [
      gen.kpi('Detected', '12,842', -18.4, 'Copy', 'warning'),
      gen.kpi('₹ Recovered', '38.2 Cr', 12.4, 'RefreshCw', 'success'),
      gen.kpi('Under Review', '4,218', -8.4, 'Eye', 'accent'),
      gen.kpi('Confirmed', '8,624', 4.2, 'CheckCircle2', 'primary'),
    ],
  }} />
);

export const SchemeSaturation = () => (
  <ModulePage config={{
    eyebrow: 'Module 10 · Screen 79', id: 79, title: 'Scheme Saturation', icon: 'Target',
    description: 'How saturated each scheme is against eligible population.',
    charts: [
      { key: 'sat', title: 'Saturation %', type: 'bar', tall: true, full: true, icon: 'Target',
        data: [
          { name: 'PMAY-G', value: 78 }, { name: 'PMJAY', value: 92 }, { name: 'MDM', value: 96 },
          { name: 'PM-KISAN', value: 82 }, { name: 'MGNREGA', value: 68 }, { name: 'VVY', value: 42 },
          { name: 'MYSY', value: 51 }, { name: 'NSAP', value: 88 }, { name: 'PMUY', value: 84 },
          { name: 'PDS', value: 98 }, { name: 'ICDS', value: 91 }, { name: 'SBM', value: 74 },
        ]},
    ],
  }} />
);

export const WelfareLeakage = () => (
  <ModulePage config={{
    eyebrow: 'Module 10 · Screen 80', id: 80, title: 'Welfare Leakage', icon: 'AlertTriangle',
    description: 'Estimated leakage in welfare disbursement with district drill-down.',
    kpis: [
      gen.kpi('Leakage (12m)', '1.82%', -0.6, 'AlertTriangle', 'warning'),
      gen.kpi('₹ Lost', '892 Cr', -18.4, 'Coins', 'danger'),
      gen.kpi('₹ Recovered', '380 Cr', 24.1, 'RefreshCw', 'success'),
      gen.kpi('Fraud Rings Detected', '38', 12.4, 'Users', 'primary'),
    ],
    charts: [
      { key: 'leak-dist', title: 'Leakage by district', type: 'bar', tall: true, full: true, icon: 'MapPin',
        data: gen.distSeries(15).map((d) => ({ name: d.name, value: Math.round(Math.random() * 45) })) },
    ],
  }} />
);
