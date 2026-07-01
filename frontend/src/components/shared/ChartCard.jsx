import React from 'react';
import * as Icons from 'lucide-react';
import { PAGE } from '../../constants/testIds';

export const ChartCard = ({ title, subtitle, icon = 'BarChart3', actions, children, className = '', testKey, tall = false, badge }) => {
  const Icon = Icons[icon] || Icons.BarChart3;
  return (
    <div
      data-testid={PAGE.chartCard(testKey || title?.toLowerCase().replace(/\s+/g, '-'))}
      className={`bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Icon size={14} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <div className="font-heading font-semibold text-[14px] text-slate-900 truncate">{title}</div>
            {subtitle && <div className="text-[11px] text-slate-500 truncate">{subtitle}</div>}
          </div>
          {badge && <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">{badge}</span>}
        </div>
        {actions}
      </div>
      <div className={`p-4 ${tall ? 'h-80' : 'h-64'}`}>{children}</div>
    </div>
  );
};

export default ChartCard;
