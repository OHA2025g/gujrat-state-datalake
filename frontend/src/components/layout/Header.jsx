import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NAV, ALL_SCREENS } from '../../constants/navigation';
import { NAV_TID, AUTH } from '../../constants/testIds';
import api from '../../lib/api';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';

const findCrumbs = (path) => {
  const cur = ALL_SCREENS.find((s) => s.path === path);
  if (!cur) return [];
  return [{ label: cur.moduleLabel, path: '#' }, { label: cur.label, path }];
};

export const Header = ({ onOpenCopilot }) => {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const crumbs = findCrumbs(loc.pathname);
  const [q, setQ] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [notifs, setNotifs] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    api.get('/notifications').then((r) => setNotifs(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpenSearch(true); }
      if (e.key === 'Escape') setOpenSearch(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = q
    ? ALL_SCREENS.filter((s) =>
        s.label.toLowerCase().includes(q.toLowerCase()) ||
        s.moduleLabel.toLowerCase().includes(q.toLowerCase()),
      ).slice(0, 8)
    : [];

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center gap-4 px-6 glass border-b border-slate-200/60"
      data-testid="app-header"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0" data-testid="breadcrumb">
        <Icons.LayoutGrid size={14} className="text-slate-400" />
        {crumbs.length > 0 ? (
          crumbs.map((c, i) => (
            <React.Fragment key={i}>
              <span className={`text-[12.5px] truncate ${i === crumbs.length - 1 ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>{c.label}</span>
              {i < crumbs.length - 1 && <Icons.ChevronRight size={12} className="text-slate-300" />}
            </React.Fragment>
          ))
        ) : (
          <span className="text-[12.5px] text-slate-500">Overview</span>
        )}
      </div>

      {/* Search */}
      <button
        onClick={() => setOpenSearch(true)}
        data-testid={NAV_TID.globalSearch}
        className="ml-4 hidden md:flex items-center gap-2 h-9 px-3 min-w-[280px] rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-500 text-[13px] transition-colors shadow-card"
      >
        <Icons.Search size={14} />
        <span className="flex-1 text-left">Search anything… citizens, families, schemes</span>
        <kbd className="hidden sm:inline text-[10px] font-mono bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-500">⌘K</kbd>
      </button>

      <div className="flex-1" />

      {/* AI Copilot quick launch */}
      <button
        onClick={onOpenCopilot}
        data-testid={NAV_TID.copilotOpen}
        className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[13px] font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
      >
        <Icons.Sparkles size={14} />
        <span>Copilot</span>
      </button>

      {/* Notifications */}
      <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
        <DropdownMenuTrigger asChild>
          <button
            data-testid={NAV_TID.notifBtn}
            className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600"
          >
            <Icons.Bell size={16} />
            {notifs?.unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-96 p-0">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="font-heading font-semibold">Notifications</div>
            <Badge variant="secondary" className="text-xs">{notifs?.unread ?? 0} new</Badge>
          </div>
          <div className="max-h-96 overflow-auto">
            {(notifs?.items ?? []).map((n) => (
              <div key={n.id} className="px-3 py-2.5 border-b border-slate-100 hover:bg-slate-50">
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                      n.type === 'danger' ? 'bg-rose-500' :
                      n.type === 'warning' ? 'bg-amber-500' :
                      n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-slate-900 truncate">{n.title}</div>
                    <div className="text-[12px] text-slate-500 truncate">{n.body}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{new Date(n.time).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 text-center border-t">
            <Link to="/dashboard/alerts" className="text-[12px] text-indigo-600 hover:underline">View all alerts →</Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 h-9 pl-2 pr-3 rounded-full hover:bg-slate-100" data-testid="header-user-menu">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="bg-slate-900 text-white text-[11px] font-semibold">
                {user?.full_name?.split(' ').slice(0, 2).map((s) => s[0]).join('') ?? 'GC'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-[12px] font-medium text-slate-900">{user?.full_name ?? 'Guest'}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role?.replace('_', ' ')}</div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="text-slate-900 font-medium">{user?.full_name}</div>
            <div className="text-[11px] text-slate-500">{user?.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile"><Icons.User size={14} className="mr-2" /> User Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/sessions"><Icons.Monitor size={14} className="mr-2" /> Sessions</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/settings"><Icons.Settings2 size={14} className="mr-2" /> Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} data-testid={AUTH.logoutBtn} className="text-rose-600 focus:text-rose-600">
            <Icons.LogOut size={14} className="mr-2" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Global command palette */}
      {openSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpenSearch(false)}>
          <div className="w-full max-w-xl bg-white rounded-xl shadow-dropdown border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <Icons.Search size={16} className="text-slate-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search screens, citizens, families, schemes…"
                className="flex-1 bg-transparent outline-none text-[14px]"
              />
              <kbd className="text-[10px] font-mono bg-slate-100 rounded px-1.5 py-0.5 text-slate-500">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-auto p-2">
              {results.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-sm">
                  Start typing to search across all 120 GCSR screens
                </div>
              )}
              {results.map((r) => (
                <Link
                  key={r.id}
                  to={r.path}
                  onClick={() => setOpenSearch(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-md"
                >
                  <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                    <Icons.FileText size={12} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-slate-900">{r.label}</div>
                    <div className="text-[11px] text-slate-500">{r.moduleLabel}</div>
                  </div>
                  <Icons.ArrowRight size={14} className="text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
