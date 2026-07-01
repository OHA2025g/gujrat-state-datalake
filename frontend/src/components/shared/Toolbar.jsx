import React from 'react';
import * as Icons from 'lucide-react';

/** Toolbar — sticky-ish filter/action bar for pages. */
export const Toolbar = ({ children, className = '' }) => (
  <div
    data-testid="page-toolbar"
    className={`bg-white rounded-xl border border-slate-200 shadow-card px-4 py-2.5 flex items-center gap-2 flex-wrap ${className}`}
  >
    {children}
  </div>
);

export const ToolbarSearch = ({ value, onChange, placeholder = 'Search…' }) => (
  <div className="flex items-center gap-2 h-9 px-3 rounded-md bg-slate-50 border border-slate-200 min-w-[220px] flex-1 max-w-md">
    <Icons.Search size={14} className="text-slate-400" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 bg-transparent outline-none text-[13px]"
    />
  </div>
);

export const ToolbarSelect = ({ value, onChange, options = [], placeholder = 'All' }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-9 px-3 rounded-md bg-white border border-slate-200 text-[13px] text-slate-700 hover:border-slate-300 outline-none"
  >
    <option value="">{placeholder}</option>
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

export const ToolbarButton = ({ children, icon, onClick, primary = false, testid }) => {
  const Icon = icon ? (Icons[icon] || Icons.Circle) : null;
  return (
    <button
      onClick={onClick}
      data-testid={testid}
      className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[13px] font-medium transition-colors ${
        primary ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
      }`}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
};

export default Toolbar;
