import React from 'react';
import * as Icons from 'lucide-react';

export const Timeline = ({ items = [] }) => (
  <ol className="relative border-l-2 border-dashed border-slate-200 pl-6 space-y-6 ml-2">
    {items.map((it, i) => {
      const Icon = Icons[it.icon] || Icons.Circle;
      return (
        <li key={i} className="relative">
          <span className="absolute -left-[33px] top-0 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-card">
            <Icon size={13} className="text-slate-700" />
          </span>
          <div className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400">{it.date}</div>
          <div className="text-[13px] font-medium text-slate-900 mt-0.5">{it.event}</div>
          {it.source && <div className="text-[11.5px] text-slate-500 mt-0.5">via {it.source}</div>}
        </li>
      );
    })}
  </ol>
);

export default Timeline;
