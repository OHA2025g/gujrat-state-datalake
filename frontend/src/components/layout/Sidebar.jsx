import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { NAV } from '../../constants/navigation';
import { NAV_TID } from '../../constants/testIds';

const Icon = ({ name, className, size = 18 }) => {
  const Cmp = Icons[name] || Icons.Circle;
  return <Cmp size={size} strokeWidth={1.7} className={className} />;
};

export const Sidebar = ({ collapsed, onToggle }) => {
  const loc = useLocation();
  const [openGroups, setOpenGroups] = useState(() => {
    const s = new Set();
    NAV.forEach((m) => {
      if (m.items.some((it) => loc.pathname.startsWith(it.path))) s.add(m.id);
    });
    if (s.size === 0) s.add('exec');
    return s;
  });

  const toggle = (id) => {
    const next = new Set(openGroups);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpenGroups(next);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      data-testid="sidebar"
    >
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg">
          <Icons.Layers size={20} className="text-white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-heading font-bold text-white tracking-tight leading-tight text-[15px]">GCSR</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-[0.15em] leading-tight">Gujarat • State Lakehouse</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-3 px-2">
        {NAV.map((m) => {
          const open = openGroups.has(m.id);
          const active = m.items.some((it) => loc.pathname === it.path);
          return (
            <div key={m.id} className="mb-1">
              <button
                data-testid={NAV_TID.group(m.id)}
                onClick={() => !collapsed && toggle(m.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  active ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={m.label}
              >
                <span
                  className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${m.color}22`, color: m.color }}
                >
                  <Icon name={m.icon} size={15} />
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-[13px] font-medium truncate">{m.label}</span>
                    <Icons.ChevronRight size={14} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
                  </>
                )}
              </button>
              {!collapsed && open && (
                <div className="mt-0.5 mb-2 space-y-0.5 pl-3 border-l border-slate-800 ml-6">
                  {m.items.map((it) => {
                    const isActive = loc.pathname === it.path;
                    return (
                      <Link
                        key={it.id}
                        to={it.path}
                        data-testid={NAV_TID.link(it.id)}
                        className={`group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-md text-[12.5px] transition-colors ${
                          isActive
                            ? 'bg-indigo-500/15 text-white font-medium'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-indigo-400' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                        <Icon name={it.icon} size={13} className="opacity-70" />
                        <span className="truncate">{it.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / toggle */}
      <div className="border-t border-slate-800 p-3 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span>v1.0 • PoC</span>
          </div>
        )}
        <button
          data-testid={NAV_TID.toggle}
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {collapsed ? <Icons.PanelLeftOpen size={16} /> : <Icons.PanelLeftClose size={16} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
