import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { PageHeader, HeaderActions } from '../../components/shared/PageHeader';
import { ChartCard } from '../../components/shared/ChartCard';
import { KPICard } from '../../components/shared/KPICard';
import { DataTable } from '../../components/shared/DataTable';
import { LineChartX, BarChartX, DonutChart } from '../../components/shared/Charts';
import { ModulePage, gen } from '../../components/shared/ModulePage';
import { Button } from '../../components/ui/button';
import * as Icons from 'lucide-react';

const ReportPage = ({ id, title, kind, description, kpis, primaryChart }) => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get(`/reports/${kind}`).then((r) => setData(r.data)); }, [kind]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={`Module 15 · Screen ${id}`} id={id} title={title} description={description} icon="FileBarChart"
        actions={<><HeaderActions.Filter /><HeaderActions.Export /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => <KPICard key={k.key} {...k} testKey={k.key} />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title={primaryChart || 'Trend'} icon="TrendingUp" tall className="lg:col-span-2">
          <LineChartX data={data?.series || []} />
        </ChartCard>
        <ChartCard title="Breakdown" icon="PieChart" tall>
          <DonutChart data={data?.table?.slice(0, 5).map((r) => ({ name: r.row, value: r.value_a })) || []} />
        </ChartCard>
      </div>
      <DataTable
        testKey={`report-${kind}`}
        pageSize={10}
        searchable
        columns={[
          { key: 'row', label: 'Category' },
          { key: 'value_a', label: 'Metric A', render: (r) => r.value_a.toLocaleString('en-IN') },
          { key: 'value_b', label: 'Metric B', render: (r) => `${r.value_b}%` },
          { key: 'value_c', label: 'Metric C' },
        ]}
        rows={data?.table || []}
      />
    </div>
  );
};

// 113-119
export const ExecutiveReports = () => <ReportPage id={113} title="Executive Reports" kind="executive" description="C-level snapshot for weekly cabinet briefings." primaryChart="Weekly registry throughput" kpis={[
  gen.kpi('Sections', '18', 0, 'BookOpen', 'primary'),
  gen.kpi('Charts', '42', 0, 'BarChart3', 'accent'),
  gen.kpi('Distributed to', '38', 0, 'Users', 'success'),
  gen.kpi('Format', 'PDF+PPT', 0, 'FileText', 'secondary'),
]} />;

export const CitizenReports = () => <ReportPage id={114} title="Citizen Reports" kind="citizen" description="Demographic and registry statistics." primaryChart="New citizens per month" kpis={[
  gen.kpi('Citizens', '6.42 Cr', 2.4, 'Users', 'primary'),
  gen.kpi('Verified', '5.98 Cr', 3.1, 'UserCheck', 'success'),
  gen.kpi('Under Review', '4.4 L', -8.4, 'Eye', 'accent'),
  gen.kpi('New (30d)', '2.1 L', 12.4, 'UserPlus', 'secondary'),
]} />;

export const FamilyReports = () => <ReportPage id={115} title="Family Reports" kind="family" description="Household composition, size, income and welfare." primaryChart="Golden Families over time" kpis={[
  gen.kpi('Families', '1.38 Cr', 3.1, 'Home', 'primary'),
  gen.kpi('Avg Size', '4.6', -0.1, 'Users', 'accent'),
  gen.kpi('Rural %', '58%', -0.4, 'Trees', 'success'),
  gen.kpi('Female HoF', '38.4%', 3.1, 'HeartHandshake', 'secondary'),
]} />;

export const DepartmentReports = () => <ReportPage id={116} title="Department Reports" kind="department" description="Department-wise integration and enrichment stats." primaryChart="Enrichment throughput" kpis={[
  gen.kpi('Depts', '42', 4.4, 'Building2', 'primary'),
  gen.kpi('Avg DQ', '92%', 1.4, 'ShieldCheck', 'success'),
  gen.kpi('APIs', '184', 4.2, 'Cable', 'accent'),
  gen.kpi('SLA', '99.72%', 0.1, 'Activity', 'secondary'),
]} />;

export const DBTReports = () => <ReportPage id={117} title="DBT Reports" kind="dbt" description="Direct Benefit Transfer coverage, disbursal, leakage." primaryChart="Monthly DBT disbursal (₹ Cr)" kpis={[
  gen.kpi('Disbursed (FY)', '₹ 48,392 Cr', 12.4, 'Banknote', 'success'),
  gen.kpi('Beneficiaries', '4.28 Cr', 3.2, 'Users', 'primary'),
  gen.kpi('Leakage', '1.82%', -0.6, 'AlertTriangle', 'warning'),
  gen.kpi('Failed', '38K', -18.2, 'XCircle', 'danger'),
]} />;

export const DataQualityReports = () => <ReportPage id={118} title="Data Quality Reports" kind="quality" description="Six-dimensional DQ scorecard trends." primaryChart="DQ Index (12m)" kpis={[
  gen.kpi('DQ Index', '94.2%', 0.8, 'ShieldCheck', 'success'),
  gen.kpi('Duplicates', '142K', -12.4, 'Copy', 'warning'),
  gen.kpi('Invalid Aadhaar', '0.42%', -0.08, 'AlertCircle', 'danger'),
  gen.kpi('Standardized', '96.8%', 2.1, 'MapPin', 'primary'),
]} />;

export const AIReports = () => <ReportPage id={119} title="AI Insights Reports" kind="ai" description="Model performance, drift, fairness metrics." primaryChart="Model accuracy over time" kpis={[
  gen.kpi('Live Models', '18', 12.5, 'Brain', 'primary'),
  gen.kpi('Predictions', '3.42M', 8.4, 'Zap', 'accent'),
  gen.kpi('Fairness', '0.91', 0.02, 'Scale', 'success'),
  gen.kpi('Drift Alerts', '3', -25, 'AlertTriangle', 'warning'),
]} />;

// 120. Report Builder
export const ReportBuilder = () => (
  <div className="space-y-6">
    <PageHeader eyebrow="Module 15 · Screen 120" id={120} title="Report Builder" description="Drag-and-drop report designer for custom cabinet reports." icon="PencilRuler"
      actions={<><Button variant="outline" size="sm"><Icons.Save size={14} className="mr-1.5" />Save</Button><Button size="sm" className="bg-slate-900 hover:bg-slate-800"><Icons.Play size={14} className="mr-1.5" />Run</Button></>} />
    <div className="grid lg:grid-cols-[220px_1fr_260px] gap-6 h-[70vh]">
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 mb-3">Datasets</div>
        <div className="space-y-1">
          {['citizens','families','schemes','benefits','districts','departments','audit_logs','consents'].map((d) => (
            <div key={d} className="flex items-center gap-2 text-[12.5px] px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-grab">
              <Icons.Table size={13} className="text-slate-500" /> {d}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-6">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="col-span-1 bg-white rounded-xl border border-slate-200 p-4"><div className="text-[10.5px] uppercase text-slate-500">KPI</div><div className="font-heading font-bold text-xl mt-1">Metric A</div><div className="text-[11px] text-slate-400 mt-1">Drop dataset field here</div></div>
          <div className="col-span-1 bg-white rounded-xl border border-slate-200 p-4"><div className="text-[10.5px] uppercase text-slate-500">KPI</div><div className="font-heading font-bold text-xl mt-1">Metric B</div></div>
          <div className="col-span-1 bg-white rounded-xl border border-slate-200 p-4"><div className="text-[10.5px] uppercase text-slate-500">KPI</div><div className="font-heading font-bold text-xl mt-1">Metric C</div></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 h-56 flex items-center justify-center text-slate-400 text-sm"><Icons.LineChart size={40} className="mr-3" /> Drop a dataset + measure to see a chart</div>
        <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4 h-48 flex items-center justify-center text-slate-400 text-sm"><Icons.Table size={30} className="mr-3" /> Drop columns for tabular report</div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 mb-3">Properties</div>
        <div className="space-y-3 text-[12.5px]">
          {[['Title','Untitled report'],['Owner','You'],['Refresh','Daily'],['Access','State-wide'],['Export','PDF · PPT · XLSX']].map(([k, v]) => (
            <div key={k}><div className="text-slate-500 text-[10.5px] uppercase tracking-wider">{k}</div><div className="font-medium">{v}</div></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
