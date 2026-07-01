/**
 * Chart helpers using Recharts, with the GCSR palette.
 */
import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, AreaChart, Area, Legend, Treemap,
} from 'recharts';
import { CHART_COLORS } from '../../constants/gujaratData';

const grid = { stroke: '#F1F5F9' };
const axis = { fontSize: 11, fill: '#64748B' };

const tooltipStyle = {
  contentStyle: { background: '#0F172A', border: 'none', borderRadius: 8, fontSize: 12, color: '#fff', boxShadow: '0 10px 40px rgba(15,23,42,0.2)' },
  itemStyle: { color: '#fff' },
  labelStyle: { color: '#94A3B8', fontSize: 11 },
};

export const LineChartX = ({ data, xKey = 'month', yKey = 'value', label = 'Value' }) => (
  <ResponsiveContainer>
    <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3A8A" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#1E3A8A" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid vertical={false} {...grid} />
      <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={axis} />
      <YAxis axisLine={false} tickLine={false} tick={axis} />
      <Tooltip {...tooltipStyle} />
      <Line type="monotone" dataKey={yKey} stroke="#1E3A8A" strokeWidth={2.5} dot={{ r: 3, fill: '#1E3A8A' }} activeDot={{ r: 5 }} name={label} />
    </LineChart>
  </ResponsiveContainer>
);

export const AreaChartX = ({ data, xKey = 'month', yKey = 'value' }) => (
  <ResponsiveContainer>
    <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <CartesianGrid vertical={false} {...grid} />
      <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={axis} />
      <YAxis axisLine={false} tickLine={false} tick={axis} />
      <Tooltip {...tooltipStyle} />
      <Area type="monotone" dataKey={yKey} stroke="#4F46E5" strokeWidth={2} fill="url(#areaFill)" />
    </AreaChart>
  </ResponsiveContainer>
);

export const BarChartX = ({ data, xKey = 'name', yKey = 'value', barColor = '#1E3A8A', horizontal = false }) => (
  <ResponsiveContainer>
    <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} layout={horizontal ? 'vertical' : 'horizontal'}>
      <CartesianGrid vertical={false} {...grid} />
      {horizontal ? (
        <>
          <XAxis type="number" axisLine={false} tickLine={false} tick={axis} />
          <YAxis dataKey={xKey} type="category" axisLine={false} tickLine={false} tick={axis} width={90} />
        </>
      ) : (
        <>
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={axis} />
          <YAxis axisLine={false} tickLine={false} tick={axis} />
        </>
      )}
      <Tooltip {...tooltipStyle} />
      <Bar dataKey={yKey} fill={barColor} radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const StackedBar = ({ data, xKey = 'name', keys = [], colors = CHART_COLORS }) => (
  <ResponsiveContainer>
    <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
      <CartesianGrid vertical={false} {...grid} />
      <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={axis} />
      <YAxis axisLine={false} tickLine={false} tick={axis} />
      <Tooltip {...tooltipStyle} />
      <Legend wrapperStyle={{ fontSize: 11, color: '#64748B' }} />
      {keys.map((k, i) => (
        <Bar key={k} dataKey={k} stackId="a" fill={colors[i % colors.length]} radius={i === keys.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]} />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

export const DonutChart = ({ data, valueKey = 'value', nameKey = 'name', colors = CHART_COLORS }) => (
  <ResponsiveContainer>
    <PieChart>
      <Pie data={data} innerRadius="55%" outerRadius="80%" dataKey={valueKey} nameKey={nameKey} paddingAngle={2}>
        {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
      </Pie>
      <Tooltip {...tooltipStyle} />
      <Legend wrapperStyle={{ fontSize: 11, color: '#64748B' }} />
    </PieChart>
  </ResponsiveContainer>
);

export const RadarChartX = ({ data, dataKey = 'score', nameKey = 'dim' }) => (
  <ResponsiveContainer>
    <RadarChart data={data}>
      <PolarGrid stroke="#E2E8F0" />
      <PolarAngleAxis dataKey={nameKey} tick={{ fontSize: 11, fill: '#475569' }} />
      <PolarRadiusAxis tick={{ fontSize: 10, fill: '#94A3B8' }} angle={30} />
      <Radar name={dataKey} dataKey={dataKey} stroke="#1E3A8A" fill="#1E3A8A" fillOpacity={0.25} strokeWidth={2} />
      <Tooltip {...tooltipStyle} />
    </RadarChart>
  </ResponsiveContainer>
);

export const HeatmapGrid = ({ items = [], labelKey = 'district', valueKey = 'score', formatValue }) => {
  // simple color-scale grid
  const values = items.map((i) => i[valueKey]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const scale = (v) => (max === min ? 0.5 : (v - min) / (max - min));
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-1.5 h-full overflow-auto">
      {items.map((it) => {
        const s = scale(it[valueKey]);
        const bg = `rgba(30, 58, 138, ${0.15 + s * 0.75})`;
        return (
          <div
            key={it[labelKey]}
            title={`${it[labelKey]}: ${it[valueKey]}`}
            className="rounded-md p-2 text-white text-[10.5px] font-medium flex flex-col justify-between transition-transform hover:scale-105"
            style={{ background: bg }}
          >
            <div className="truncate opacity-90">{it[labelKey]}</div>
            <div className="font-mono text-[11.5px] font-bold">{formatValue ? formatValue(it[valueKey]) : it[valueKey]}</div>
          </div>
        );
      })}
    </div>
  );
};

export const TreemapX = ({ data }) => (
  <ResponsiveContainer>
    <Treemap data={data} dataKey="value" stroke="#fff" fill="#1E3A8A" content={<CustomizedContent />} />
  </ResponsiveContainer>
);

const CustomizedContent = ({ root, depth, x, y, width, height, index, name, value }) => (
  <g>
    <rect x={x} y={y} width={width} height={height} style={{ fill: CHART_COLORS[index % CHART_COLORS.length], stroke: '#fff', strokeWidth: 2, fillOpacity: 0.9 }} />
    {width > 60 && height > 30 && (
      <>
        <text x={x + 8} y={y + 18} fill="#fff" fontSize="11" fontWeight="600">{name}</text>
        <text x={x + 8} y={y + 32} fill="#fff" fontSize="10" opacity="0.85">{typeof value === 'number' ? value.toLocaleString() : value}</text>
      </>
    )}
  </g>
);
