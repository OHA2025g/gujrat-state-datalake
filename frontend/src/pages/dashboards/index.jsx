import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import * as Icons from 'lucide-react';
import { PageHeader, HeaderActions } from '../../components/shared/PageHeader';
import { KPICard } from '../../components/shared/KPICard';
import { ChartCard } from '../../components/shared/ChartCard';
import { DataTable } from '../../components/shared/DataTable';
import { StatusBadge, InsightPill, ConfidenceBar } from '../../components/shared/StatusBadge';
import { LineChartX, AreaChartX, BarChartX, DonutChart, RadarChartX, HeatmapGrid, StackedBar } from '../../components/shared/Charts';

const useApi = (url) => {
  const [d, setD] = useState(null);
  useEffect(() => { api.get(url).then((r) => setD(r.data)).catch(() => setD({})); }, [url]);
  return d;
};

// ============ 7. State Dashboard ============
export const StateDashboard = () => {
  const data = useApi('/dashboards/state');
  if (!data) return <div className="p-8 text-slate-400">Loading…</div>;
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Module 2 · Screen 7"
        id={7}
        title="State Command Centre"
        description="Live view of Gujarat's Common Social Registry across 33 districts and 46 departments."
        icon="Landmark"
        actions={<><HeaderActions.Filter /><HeaderActions.Export /></>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {(data.kpis || []).map((k) => (
          <KPICard key={k.key} testKey={k.key} label={k.label} value={k.value} change={k.change} icon={k.icon} color={k.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Registry Growth" subtitle="Citizens & families onboarded (8 months)" icon="TrendingUp" testKey="growth" tall className="lg:col-span-2">
          <AreaChartX data={data.registry_growth?.map((d) => ({ month: d.month, value: d.citizens }))} />
        </ChartCard>
        <ChartCard title="Real-time Alerts" subtitle="Anomalies, workflows & AI events" icon="Bell" testKey="alerts" tall>
          <div className="h-full overflow-y-auto space-y-2 -m-2 p-2">
            {(data.alerts || []).map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                  a.type === 'danger' ? 'bg-rose-500' : a.type === 'warning' ? 'bg-amber-500' : a.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                }`} />
                <div className="min-w-0">
                  <div className="text-[12.5px] font-medium text-slate-900 truncate">{a.title}</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Department Coverage" subtitle="% families integrated per department" icon="Building2" testKey="dept-cov" tall>
          <BarChartX data={(data.department_coverage || []).map((d) => ({ name: d.dept.split(' ')[0], value: d.coverage }))} />
        </ChartCard>
        <ChartCard title="Scheme Saturation" subtitle="Top 8 flagship schemes across Gujarat" icon="Target" testKey="scheme-sat" tall>
          <BarChartX horizontal data={(data.scheme_saturation || []).map((s) => ({ name: s.scheme, value: s.saturation }))} />
        </ChartCard>
      </div>

      <ChartCard title="Vulnerability Heatmap · Gujarat districts" subtitle="Composite index across 33 districts (higher = higher risk)" icon="Map" testKey="vuln-map" tall>
        <HeatmapGrid items={data.vulnerability_map || []} labelKey="district" valueKey="score" formatValue={(v) => v.toFixed(2)} />
      </ChartCard>

      <DataTable
        testKey="district-leaderboard"
        columns={[
          { key: 'district', label: 'District' },
          { key: 'families', label: 'Families', render: (r) => r.families.toLocaleString('en-IN') },
          { key: 'coverage', label: 'Coverage %', render: (r) => <ConfidenceBar value={r.coverage / 100} /> },
          { key: 'dq', label: 'DQ Score', render: (r) => <ConfidenceBar value={r.dq} /> },
          { key: 'action', label: '', align: 'right', render: () => <button className="text-[12px] text-indigo-600 hover:underline">Drill down →</button> },
        ]}
        rows={data.district_leaderboard || []}
        searchable
        pageSize={8}
      />
    </div>
  );
};

// ============ 8. District Dashboard ============
export const DistrictDashboard = () => {
  const data = useApi('/dashboards/district');
  if (!data) return null;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 2 · Screen 8" id={8} title="District Dashboard" description="Deep drill-down for one district — households, coverage, scheme mix." icon="MapPin"
        actions={<><HeaderActions.Filter /><HeaderActions.Export /></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(data.kpis || []).map((k) => <KPICard key={k.key} testKey={k.key} {...k} />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Taluka-wise Coverage" icon="MapPin" tall><BarChartX data={data.talukas?.map(t => ({ name: t.taluka, value: t.coverage }))} /></ChartCard>
        <ChartCard title="Scheme Mix" icon="Layers" tall><DonutChart data={data.welfare_mix?.map(w => ({ name: w.scheme, value: w.value }))} /></ChartCard>
      </div>
    </div>
  );
};

// ============ 9. Department Dashboard ============
export const DepartmentDashboard = () => {
  const data = useApi('/dashboards/department');
  if (!data) return null;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 2 · Screen 9" id={9} title="Department Dashboard" description="46-department integration overview and API SLAs." icon="Building2" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(data.kpis || []).map((k) => <KPICard key={k.key} testKey={k.key} {...k} />)}
      </div>
      <ChartCard title="Ingestion Throughput (14 days)" icon="Activity" tall>
        <AreaChartX data={(data.trends || []).map(t => ({ month: t.date, value: t.throughput }))} />
      </ChartCard>
      <DataTable
        testKey="dept-list"
        columns={[
          { key: 'name', label: 'Department' },
          { key: 'record_count', label: 'Records', render: (r) => r.record_count.toLocaleString('en-IN') },
          { key: 'quality_score', label: 'Quality', render: (r) => <ConfidenceBar value={r.quality_score} /> },
          { key: 'integration_status', label: 'Status', render: (r) => <StatusBadge status={r.integration_status} /> },
          { key: 'last_sync', label: 'Last Sync', render: (r) => new Date(r.last_sync).toLocaleTimeString() },
        ]}
        rows={data.departments || []}
        searchable
      />
    </div>
  );
};

// ============ 10. Data Lake Health ============
export const DataLakeHealth = () => {
  const data = useApi('/dashboards/data-lake');
  if (!data) return null;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 2 · Screen 10" id={10} title="Data Lake Health" description="Zones, storage, ingestion & cluster utilization." icon="Waves" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(data.kpis || []).map((k) => <KPICard key={k.key} testKey={k.key} {...k} />)}
      </div>
      <div className="grid lg:grid-cols-4 gap-4">
        {(data.zones || []).map((z, i) => (
          <div key={z.zone} className="kpi-card bg-white rounded-xl border border-slate-200 p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full`} style={{ background: ['#B45309','#94A3B8','#D97706','#0F172A'][i] }} />
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">{z.zone}</div>
            </div>
            <div className="text-2xl font-heading font-bold text-slate-900">{z.size_tb} TB</div>
            <div className="text-[11px] text-slate-500 mt-1">{z.files_m}M objects · +{z.growth}% growth</div>
          </div>
        ))}
      </div>
      <ChartCard title="Ingestion Throughput (24h)" icon="Activity" tall>
        <AreaChartX data={(data.ingestion || []).map(x => ({ month: x.hour, value: x.records }))} />
      </ChartCard>
    </div>
  );
};

// ============ 11. Data Quality Dashboard ============
export const DataQualityDashboard = () => {
  const data = useApi('/dashboards/data-quality');
  if (!data) return null;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 2 · Screen 11" id={11} title="Data Quality Dashboard" description="Six-dimensional quality index across all departmental datasets." icon="ShieldCheck" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(data.kpis || []).map((k) => <KPICard key={k.key} testKey={k.key} {...k} />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="DQ Radar" subtitle="6 dimensions" icon="Compass" tall>
          <RadarChartX data={data.radar || []} />
        </ChartCard>
        <ChartCard title="Departmental DQ Scores" icon="Building2" tall>
          <BarChartX data={(data.dept_dq || []).map(d => ({ name: d.dept.split(' ')[0], value: d.score }))} />
        </ChartCard>
      </div>
    </div>
  );
};

// ============ 12. AI Governance ============
export const AIGovernance = () => {
  const data = useApi('/dashboards/ai-governance');
  if (!data) return null;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 2 · Screen 12" id={12} title="AI Governance" description="Model registry, fairness, drift and prediction throughput." icon="Brain" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(data.kpis || []).map((k) => <KPICard key={k.key} testKey={k.key} {...k} />)}
      </div>
      <DataTable
        testKey="ai-models"
        columns={[
          { key: 'name', label: 'Model', render: (r) => <span className="font-medium">{r.name}</span> },
          { key: 'type', label: 'Type' },
          { key: 'accuracy', label: 'Accuracy', render: (r) => <ConfidenceBar value={r.accuracy / 100} /> },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={data.models || []}
      />
    </div>
  );
};

// ============ 13. Citizen & Family KPIs ============
export const CitizenFamilyKPIs = () => {
  const data = useApi('/dashboards/citizen-kpis');
  if (!data) return null;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 2 · Screen 13" id={13} title="Citizen & Family KPIs" description="Demographic composition and household statistics." icon="Users" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(data.kpis || []).map((k) => <KPICard key={k.key} testKey={k.key} {...k} />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Age & Gender Pyramid" icon="Users" tall>
          <StackedBar data={data.age_pyramid} xKey="band" keys={['male','female']} colors={['#1E3A8A','#DB2777']} />
        </ChartCard>
        <ChartCard title="Social Category" icon="PieChart" tall>
          <DonutChart data={data.category_split} />
        </ChartCard>
      </div>
    </div>
  );
};

// ============ 14. Alerts & Notifications ============
export const AlertsPage = () => {
  const notifs = useApi('/notifications');
  if (!notifs) return null;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 2 · Screen 14" id={14} title="Alerts & Notifications" description="System-wide alerts across workflows, AI and integrations." icon="Bell" />
      <div className="grid gap-3">
        {(notifs.items || []).map((n) => (
          <div key={n.id} className="bg-white rounded-xl border border-slate-200 shadow-card p-4 flex items-start gap-3">
            <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
              n.type === 'danger' ? 'bg-rose-500' : n.type === 'warning' ? 'bg-amber-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
            }`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="text-[13.5px] font-semibold text-slate-900">{n.title}</div>
                {!n.read && <span className="text-[9px] px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-semibold">NEW</span>}
              </div>
              <div className="text-[12.5px] text-slate-600 mt-0.5">{n.body}</div>
              <div className="text-[11px] text-slate-400 mt-1">{new Date(n.time).toLocaleString()}</div>
            </div>
            <StatusBadge status={n.type === 'danger' ? 'FAIL' : n.type === 'warning' ? 'Warning' : n.type === 'success' ? 'OK' : 'Info'} />
          </div>
        ))}
      </div>
    </div>
  );
};
