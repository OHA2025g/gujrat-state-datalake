import React from 'react';
import * as Icons from 'lucide-react';
import { PAGE } from '../../constants/testIds';

const colorMap = {
  primary:   { bg: 'bg-blue-50',    text: 'text-blue-700',    ring: 'ring-blue-100' },
  secondary: { bg: 'bg-indigo-50',  text: 'text-indigo-700',  ring: 'ring-indigo-100' },
  accent:    { bg: 'bg-cyan-50',    text: 'text-cyan-700',    ring: 'ring-cyan-100' },
  success:   { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-100' },
  warning:   { bg: 'bg-amber-50',   text: 'text-amber-700',   ring: 'ring-amber-100' },
  danger:    { bg: 'bg-rose-50',    text: 'text-rose-700',    ring: 'ring-rose-100' },
};

export const KPICard = ({ label, value, change, icon = 'Circle', color = 'primary', testKey, subtitle }) => {
  const Icon = Icons[icon] || Icons.Circle;
  const c = colorMap[color] || colorMap.primary;
  const positive = (change ?? 0) >= 0;
  return (
    <div
      data-testid={PAGE.kpi(testKey || label?.toLowerCase().replace(/\s+/g, '-'))}
      className="kpi-card bg-white rounded-xl border border-slate-200 p-5 shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.15em]">{label}</div>
          <div className="mt-2 text-2xl font-heading font-bold text-slate-900 tracking-tight truncate">{value}</div>
          {subtitle && <div className="text-[11px] text-slate-400 mt-0.5">{subtitle}</div>}
        </div>
        <div className={`shrink-0 w-10 h-10 rounded-lg ${c.bg} ${c.text} ring-1 ${c.ring} flex items-center justify-center`}>
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
      {change != null && (
        <div className="mt-4 flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {positive ? <Icons.TrendingUp size={12} /> : <Icons.TrendingDown size={12} />}
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-[11px] text-slate-400">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
