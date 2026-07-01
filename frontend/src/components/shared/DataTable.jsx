import React, { useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import { PAGE } from '../../constants/testIds';

/**
 * DataTable — reusable enterprise table.
 * columns: [{ key, label, render?, className?, align? }]
 */
export const DataTable = ({
  columns = [],
  rows = [],
  testKey,
  emptyText = 'No records found',
  searchable = false,
  pageSize = 10,
  onRowClick,
  compact = false,
}) => {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const s = q.toLowerCase();
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(s));
  }, [rows, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden" data-testid={PAGE.table(testKey || 'default')}>
      {searchable && (
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2">
          <Icons.Search size={14} className="text-slate-400" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); }}
            placeholder="Filter rows…"
            className="flex-1 bg-transparent outline-none text-[12.5px]"
          />
          <span className="text-[11px] text-slate-400">{filtered.length} rows</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-4 ${compact ? 'py-2' : 'py-2.5'} text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500 ${c.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-400 text-sm">
                  {emptyText}
                </td>
              </tr>
            )}
            {pageRows.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={`border-t border-slate-100 hover:bg-slate-50/70 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-4 ${compact ? 'py-2' : 'py-3'} text-[13px] text-slate-700 ${c.align === 'right' ? 'text-right' : ''} ${c.className || ''}`}
                  >
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 text-[12px] text-slate-500">
          <span>Page {page + 1} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
              className="h-7 px-2 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40">
              <Icons.ChevronLeft size={14} />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="h-7 px-2 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40">
              <Icons.ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
