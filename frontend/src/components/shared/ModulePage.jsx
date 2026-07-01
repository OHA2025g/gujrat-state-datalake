/**
 * ModulePage — a data-driven page renderer used by 100+ screens.
 * Each screen provides a config object with sections; ModulePage renders a professional layout.
 */
import React from 'react';
import * as Icons from 'lucide-react';
import { PageHeader, HeaderActions } from './PageHeader';
import { Toolbar, ToolbarSearch, ToolbarSelect, ToolbarButton } from './Toolbar';
import { KPICard } from './KPICard';
import { ChartCard } from './ChartCard';
import { DataTable } from './DataTable';
import { StatusBadge, ConfidenceBar, InsightPill } from './StatusBadge';
import { LineChartX, AreaChartX, BarChartX, DonutChart, RadarChartX, HeatmapGrid, StackedBar } from './Charts';
import { seedSeries, monthSeries, GJ_DISTRICTS, CHART_COLORS } from '../../constants/gujaratData';

const rand = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

const generateFallbackKPIs = (count = 4, colors = ['primary','secondary','accent','success','warning','danger']) => {
  const icons = ['Database','Users','ShieldCheck','Activity','TrendingUp','Target','Layers','Gauge'];
  const labels = ['Records','Coverage','Quality','Throughput','Approved','Pending','Rejected','Duration'];
  return Array.from({ length: count }, (_, i) => ({
    key: `k${i}`,
    label: labels[i % labels.length],
    value: (Math.random() * 1000).toFixed(0),
    change: (Math.random() * 12 - 4).toFixed(1),
    icon: icons[i % icons.length],
    color: colors[i % colors.length],
  }));
};

const ChartComponent = ({ type, data, keys, colors }) => {
  switch (type) {
    case 'line':    return <LineChartX data={data} />;
    case 'area':    return <AreaChartX data={data} />;
    case 'bar':     return <BarChartX data={data} xKey="name" yKey="value" />;
    case 'hbar':    return <BarChartX data={data} xKey="name" yKey="value" horizontal />;
    case 'donut':   return <DonutChart data={data} />;
    case 'radar':   return <RadarChartX data={data} />;
    case 'heatmap': return <HeatmapGrid items={data} />;
    case 'stacked': return <StackedBar data={data} keys={keys || ['a','b','c']} colors={colors} />;
    default:        return <BarChartX data={data} />;
  }
};

/**
 * config:
 *  { eyebrow, title, description, icon, id, actions?, insights?, kpis?, charts?, tables?, toolbar? }
 */
export const ModulePage = ({ config }) => {
  const kpis = config.kpis || generateFallbackKPIs();
  const insights = config.insights || [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        icon={config.icon}
        id={config.id}
        actions={
          config.actions ?? (
            <>
              <HeaderActions.Filter />
              <HeaderActions.Export />
              {config.primaryAction && <HeaderActions.Primary label={config.primaryAction} />}
            </>
          )
        }
      />

      {config.toolbar && (
        <Toolbar>{config.toolbar}</Toolbar>
      )}

      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {insights.map((ins, i) => <InsightPill key={i} tone={ins.tone}>{ins.text}</InsightPill>)}
        </div>
      )}

      {kpis.length > 0 && (
        <div className={`grid grid-cols-2 ${kpis.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
          {kpis.map((k, i) => (
            <KPICard key={i} testKey={k.key} label={k.label} value={k.value} change={k.change} icon={k.icon} color={k.color} subtitle={k.subtitle} />
          ))}
        </div>
      )}

      {(config.charts?.length > 0 || config.tables?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(config.charts || []).map((c, i) => (
            <ChartCard key={`c${i}`} title={c.title} subtitle={c.subtitle} icon={c.icon} testKey={c.key} tall={c.tall} badge={c.badge} className={c.full ? 'lg:col-span-2' : ''}>
              <ChartComponent type={c.type} data={c.data} keys={c.keys} colors={c.colors} />
            </ChartCard>
          ))}

          {(config.tables || []).map((t, i) => (
            <div key={`t${i}`} className={t.full ? 'lg:col-span-2' : ''}>
              {t.title && (
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-slate-900">{t.title}</h3>
                  {t.badge && <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{t.badge}</span>}
                </div>
              )}
              <DataTable
                testKey={t.key}
                columns={t.columns}
                rows={t.rows || []}
                searchable={t.searchable}
                pageSize={t.pageSize || 8}
                emptyText={t.emptyText || 'No records'}
              />
            </div>
          ))}
        </div>
      )}

      {config.footer}
    </div>
  );
};

// ================================
// Config generators (per module)
// ================================
export const gen = {
  kpi: (label, value, change, icon = 'Activity', color = 'primary', subtitle = null) => ({ label, value, change, icon, color, subtitle }),

  monthSeries,
  distSeries: (count = 10) => GJ_DISTRICTS.slice(0, count).map((d) => ({ name: d, value: rand(120, 980) })),

  audit: (n = 20) => Array.from({ length: n }, (_, i) => ({
    time: new Date(Date.now() - i * 3600_000).toLocaleString(),
    actor: ['state_admin','dept_officer','district_officer','system'][rand(0,3)],
    action: ['LOGIN','APPROVE_DATASET','MERGE_FAMILY','EXPORT_REPORT','VIEW_CITIZEN'][rand(0,4)],
    resource: `entity:${rand(100000, 999999)}`,
    ip: `10.0.${rand(1,254)}.${rand(1,254)}`,
    status: ['OK','OK','OK','FAIL'][rand(0,3)],
  })),

  statusCol: (key = 'status') => ({ key, label: 'Status', render: (r) => <StatusBadge status={r[key]} /> }),
  confCol:   (key = 'confidence') => ({ key, label: 'Confidence', render: (r) => <ConfidenceBar value={r[key] ?? 0.8} /> }),
};

export default ModulePage;
