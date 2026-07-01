import React from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { PAGE } from '../../constants/testIds';

/**
 * PageHeader — consistent page title, description, and action buttons.
 */
export const PageHeader = ({ title, description, icon = 'LayoutDashboard', actions }) => {
  const Icon = Icons[icon] || Icons.LayoutDashboard;
  return (
    <div className="flex items-start justify-between gap-4 mb-6" data-testid={PAGE.header}>
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center shrink-0 shadow-md">
            <Icon size={18} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <h1 className="font-heading font-bold text-2xl md:text-[26px] tracking-tight text-slate-900 leading-tight">{title}</h1>
            {description && <p className="text-[13px] text-slate-500 mt-0.5 max-w-3xl">{description}</p>}
          </div>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};

export const HeaderActions = {
  Export: () => (
    <Button variant="outline" size="sm" data-testid="header-action-export"><Icons.Download size={14} className="mr-1.5" />Export</Button>
  ),
  Filter: () => (
    <Button variant="outline" size="sm" data-testid="header-action-filter"><Icons.SlidersHorizontal size={14} className="mr-1.5" />Filters</Button>
  ),
  Primary: ({ label, icon = 'Plus', onClick }) => {
    const Icon = Icons[icon] || Icons.Plus;
    return (
      <Button size="sm" onClick={onClick} data-testid="header-action-primary" className="bg-slate-900 hover:bg-slate-800 text-white">
        <Icon size={14} className="mr-1.5" />{label}
      </Button>
    );
  },
};

export default PageHeader;
