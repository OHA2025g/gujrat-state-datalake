import React from 'react';
import * as Icons from 'lucide-react';

const styles = {
  Active:    'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Approved:  'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Healthy:   'bg-emerald-50 text-emerald-700 ring-emerald-200',
  OK:        'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Production:'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Verified:  'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Draft:     'bg-slate-100 text-slate-700 ring-slate-200',
  Pending:   'bg-amber-50 text-amber-700 ring-amber-200',
  'Pending Review': 'bg-amber-50 text-amber-700 ring-amber-200',
  Warning:   'bg-amber-50 text-amber-700 ring-amber-200',
  Staging:   'bg-amber-50 text-amber-700 ring-amber-200',
  'Under Review': 'bg-amber-50 text-amber-700 ring-amber-200',
  'Auto-merged': 'bg-blue-50 text-blue-700 ring-blue-200',
  Info:      'bg-blue-50 text-blue-700 ring-blue-200',
  FAIL:      'bg-rose-50 text-rose-700 ring-rose-200',
  Failed:    'bg-rose-50 text-rose-700 ring-rose-200',
  Degraded:  'bg-rose-50 text-rose-700 ring-rose-200',
  Expired:   'bg-rose-50 text-rose-700 ring-rose-200',
  Revoked:   'bg-rose-50 text-rose-700 ring-rose-200',
  Danger:    'bg-rose-50 text-rose-700 ring-rose-200',
};

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full ring-1 uppercase tracking-wider ${styles[status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
    {status}
  </span>
);

export const ConfidenceBar = ({ value = 0.8, label }) => {
  const pct = Math.round(value * 100);
  const color = pct >= 90 ? 'bg-emerald-500' : pct >= 75 ? 'bg-blue-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-mono text-slate-600 tabular-nums w-8 text-right">{pct}%</span>
      {label && <span className="text-[11px] text-slate-500">{label}</span>}
    </div>
  );
};

export const EmptyState = ({ icon = 'Inbox', title = 'No data yet', description, action }) => {
  const Icon = Icons[icon] || Icons.Inbox;
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-slate-400" strokeWidth={1.4} />
      </div>
      <div className="font-heading font-semibold text-slate-900 text-base">{title}</div>
      {description && <div className="text-sm text-slate-500 mt-1 max-w-md">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export const LoadingCard = () => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-3">
    <div className="h-3 w-24 shimmer rounded" />
    <div className="h-6 w-32 shimmer rounded" />
    <div className="h-2 w-16 shimmer rounded" />
  </div>
);

export const InsightPill = ({ tone = 'info', children }) => {
  const tones = {
    info:    'bg-blue-50 text-blue-800 ring-blue-100',
    success: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
    warning: 'bg-amber-50 text-amber-800 ring-amber-100',
    danger:  'bg-rose-50 text-rose-800 ring-rose-100',
  };
  return (
    <div className={`flex items-start gap-2 text-[12.5px] rounded-lg ring-1 px-3 py-2 ${tones[tone]}`}>
      <Icons.Sparkles size={14} className="mt-0.5 shrink-0 opacity-70" />
      <span>{children}</span>
    </div>
  );
};
