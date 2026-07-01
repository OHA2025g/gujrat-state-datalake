import React from 'react';
import { ModulePage, gen } from '../../components/shared/ModulePage';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import { ConfidenceBar, StatusBadge } from '../../components/shared/StatusBadge';

// 61. Registry Comparison
export const RegistryComparison = () => (
  <ModulePage config={{
    eyebrow: 'Module 8 · Screen 61', id: 61, title: 'Registry Comparison', icon: 'GitCompare',
    description: 'Compare a citizen or family record across source datasets against the Golden record.',
    tables: [{
      key: 'cmp', full: true, title: 'Field-by-field Comparison', pageSize: 12,
      columns: [
        { key: 'field', label: 'Field' },
        { key: 'aadhaar', label: 'Aadhaar' },
        { key: 'pds', label: 'PDS' },
        { key: 'pmjay', label: 'PMJAY' },
        { key: 'golden', label: 'Golden', render: (r) => <span className="font-semibold text-emerald-700">{r.golden}</span> },
        gen.confCol(),
      ],
      rows: [
        { field: 'Name', aadhaar: 'Kiran R Patel', pds: 'Kiran Patel', pmjay: 'K. R. Patel', golden: 'Kiran R Patel', confidence: 0.98 },
        { field: 'DOB', aadhaar: '1985-04-12', pds: '1985-04-12', pmjay: '1985-04-15', golden: '1985-04-12', confidence: 0.94 },
        { field: 'Gender', aadhaar: 'M', pds: 'M', pmjay: 'M', golden: 'M', confidence: 1 },
        { field: 'Mobile', aadhaar: '+91-98240-XXXXX', pds: '+91-98240-XXXXX', pmjay: '+91-98240-XXXXX', golden: '+91-98240-XXXXX', confidence: 0.99 },
        { field: 'Address', aadhaar: '4/12 Sec-15, Gnr', pds: '4/12 Sec-15, GNR', pmjay: 'Sec 15, Gandhinagar', golden: '4/12 Sector 15, Gandhinagar - 382015', confidence: 0.88 },
        { field: 'District', aadhaar: 'Gandhinagar', pds: 'Gandhinagar', pmjay: 'Gandhinagar', golden: 'Gandhinagar', confidence: 1 },
      ],
    }],
  }} />
);

// 62. Confidence Score
export const ConfidenceScore = () => (
  <ModulePage config={{
    eyebrow: 'Module 8 · Screen 62', id: 62, title: 'Confidence Score', icon: 'Gauge',
    description: 'Explain how confidence scores are computed for each Golden record.',
    kpis: [
      gen.kpi('Median Confidence', '0.92', 0.02, 'Gauge', 'success'),
      gen.kpi('High (>0.9)', '78%', 3.4, 'CheckCircle2', 'primary'),
      gen.kpi('Medium (0.7-0.9)', '18%', -2.1, 'AlertTriangle', 'accent'),
      gen.kpi('Low (<0.7)', '4%', -12.4, 'AlertOctagon', 'warning'),
    ],
    charts: [
      { key: 'dist', title: 'Confidence Distribution (6.4 Cr citizens)', type: 'bar', tall: true, icon: 'BarChart3', full: true,
        data: [{name:'0.5-0.6',value:38000},{name:'0.6-0.7',value:184000},{name:'0.7-0.8',value:820000},{name:'0.8-0.9',value:2400000},{name:'0.9-0.95',value:12400000},{name:'0.95-1.0',value:46200000}] },
    ],
  }} />
);

// 63. Change History
export const ChangeHistory = () => (
  <ModulePage config={{
    eyebrow: 'Module 8 · Screen 63', id: 63, title: 'Change History', icon: 'History',
    description: 'Every change ever made to the Golden record, with before/after values.',
    tables: [{
      key: 'hist', full: true, title: 'Field Changes', pageSize: 10,
      columns: [
        { key: 'time', label: 'Time' },
        { key: 'field', label: 'Field' },
        { key: 'before', label: 'Before' },
        { key: 'after', label: 'After', render: (r) => <span className="font-semibold text-emerald-700">{r.after}</span> },
        { key: 'source', label: 'Source' },
        { key: 'actor', label: 'Actor' },
      ],
      rows: [
        { time: '2 hr ago', field: 'mobile', before: '+91-98240-XXXX1', after: '+91-98240-XXXX7', source: 'Citizen Portal', actor: 'citizen' },
        { time: '1 day ago', field: 'address', before: 'Sec-15 GNR', after: '4/12 Sector 15, Gandhinagar', source: 'Address Std v5.0', actor: 'system' },
        { time: '4 days ago', field: 'family_id', before: 'F84210321', after: 'F84210332', source: 'Family merge', actor: 'district_officer' },
        { time: '2 weeks ago', field: 'ration_type', before: 'APL', after: 'PHH', source: 'FCS sync', actor: 'system' },
        { time: '1 month ago', field: 'occupation', before: 'Farmer', after: 'Small Business', source: 'Correction request', actor: 'reviewer' },
      ],
    }],
  }} />
);
