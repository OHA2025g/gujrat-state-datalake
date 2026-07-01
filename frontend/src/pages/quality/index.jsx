import React from 'react';
import { ModulePage, gen } from '../../components/shared/ModulePage';
import { GJ_DISTRICTS } from '../../constants/gujaratData';

// 33. Data Profiling
export const DataProfiling = () => (
  <ModulePage config={{
    eyebrow: 'Module 5 · Screen 33', id: 33, title: 'Data Profiling', icon: 'BarChart2',
    description: 'Column-level statistics: nulls, cardinality, distributions.',
    kpis: [
      gen.kpi('Columns Profiled', '18,432', 4.3, 'Columns3', 'primary'),
      gen.kpi('Null %', '2.14%', -8.4, 'MinusCircle', 'warning'),
      gen.kpi('High Cardinality', '842', 2.1, 'Sigma', 'accent'),
      gen.kpi('Skewed', '128', -12.2, 'TrendingUp', 'secondary'),
    ],
    charts: [
      { key: 'nulls', title: 'Nulls by Column (Top 10)', type: 'hbar', tall: true, icon: 'MinusCircle',
        data: ['aadhaar_seeded','father_name','mother_name','pincode','landline','alt_mobile','email','pan','occupation','education'].map((n) => ({ name: n, value: Math.random() * 30 })) },
      { key: 'card', title: 'Cardinality Distribution', type: 'donut', tall: true, icon: 'PieChart',
        data: [{name:'Low (<10)',value:412},{name:'Medium (10-1K)',value:2410},{name:'High (>1K)',value:842},{name:'Unique',value:184}] },
    ],
  }} />
);

// 34. Cleansing Workbench
export const CleansingWorkbench = () => (
  <ModulePage config={{
    eyebrow: 'Module 5 · Screen 34', id: 34, title: 'Cleansing Workbench', icon: 'Sparkles',
    description: 'Interactive workbench to apply cleansing rules on staged data.',
    kpis: [
      gen.kpi('Rules Active', '284', 4.2, 'ListChecks', 'primary'),
      gen.kpi('Records Cleaned', '18.4M', 12.2, 'Sparkles', 'success'),
      gen.kpi('Rules Fired', '4.2M', 8.4, 'Zap', 'accent'),
      gen.kpi('Manual Review', '128', -22.1, 'Eye', 'warning'),
    ],
    tables: [{
      key: 'rules', full: true, title: 'Cleansing Rules', searchable: true, pageSize: 8,
      columns: [
        { key: 'rule', label: 'Rule' },
        { key: 'target', label: 'Target' },
        { key: 'fired', label: 'Fired', render: (r) => r.fired.toLocaleString('en-IN') },
        { key: 'success', label: 'Success', render: (r) => <span className="text-emerald-700 font-semibold">{r.success}%</span> },
        gen.statusCol(),
      ],
      rows: [
        { rule: 'Trim whitespace', target: 'all string columns', fired: 3_142_000, success: 100, status: 'Active' },
        { rule: 'Title-case names', target: 'citizens.name', fired: 481_000, success: 98.4, status: 'Active' },
        { rule: 'Standardize gender codes', target: 'citizens.gender', fired: 92_000, success: 99.8, status: 'Active' },
        { rule: 'Fix pincode length', target: 'address.pincode', fired: 24_000, success: 96.2, status: 'Active' },
        { rule: 'Mask Aadhaar', target: 'citizens.aadhaar', fired: 6_420_000, success: 100, status: 'Active' },
        { rule: 'Phonetic name key', target: 'citizens.name', fired: 4_820_000, success: 99.4, status: 'Active' },
      ],
    }],
  }} />
);

// 35. Address Standardization
export const AddressStandardization = () => (
  <ModulePage config={{
    eyebrow: 'Module 5 · Screen 35', id: 35, title: 'Address Standardization', icon: 'MapPinned',
    description: 'Parse, standardize and geocode addresses across all datasets.',
    kpis: [
      gen.kpi('Standardized', '96.8%', 2.1, 'CheckCircle2', 'success'),
      gen.kpi('Geocoded', '92.4%', 3.4, 'MapPin', 'primary'),
      gen.kpi('Unmatched', '3.2%', -12.4, 'HelpCircle', 'warning'),
      gen.kpi('Duplicates Cleared', '128K', 8.2, 'Copy', 'accent'),
    ],
    tables: [{
      key: 'addr', full: true, title: 'Sample Standardized Addresses', pageSize: 8,
      columns: [
        { key: 'raw', label: 'Raw' },
        { key: 'std', label: 'Standardized' },
        { key: 'pin', label: 'PIN' },
        { key: 'district', label: 'District' },
        gen.confCol(),
      ],
      rows: Array.from({ length: 8 }, (_, i) => ({
        raw: [`123, mn rd, ${GJ_DISTRICTS[i]}`,`nr temple, ${GJ_DISTRICTS[i]}`,`h no 4, ${GJ_DISTRICTS[i]}`,`101 bazaar rd`,`opp bus stand`,`sec-15 gnr`,`plot 42 gidc`,`vill patelpura`][i],
        std: `Plot ${100 + i * 3}, Main Road, ${GJ_DISTRICTS[i]}, Gujarat`,
        pin: `${360000 + i * 1000}`,
        district: GJ_DISTRICTS[i],
        confidence: 0.7 + Math.random() * 0.3,
      })),
    }],
  }} />
);

// 36. Name Standardization
export const NameStandardization = () => (
  <ModulePage config={{
    eyebrow: 'Module 5 · Screen 36', id: 36, title: 'Name Standardization', icon: 'CaseSensitive',
    description: 'Transliteration, phonetic keys, and cultural normalization for Indian names.',
    kpis: [
      gen.kpi('Names Processed', '6.42 Cr', 3.2, 'Users', 'primary'),
      gen.kpi('Phonetic-Keyed', '99.4%', 0.4, 'AudioWaveform', 'success'),
      gen.kpi('Gujarati ↔ English', '98.8%', 1.2, 'Languages', 'accent'),
      gen.kpi('Manual Escalations', '842', -18.4, 'Flag', 'warning'),
    ],
    tables: [{
      key: 'names', full: true, title: 'Sample Name Standardization', pageSize: 8,
      columns: [
        { key: 'raw', label: 'Raw' },
        { key: 'std', label: 'Standardized' },
        { key: 'phonetic', label: 'Phonetic key' },
        { key: 'guj', label: 'Gujarati' },
        gen.confCol(),
      ],
      rows: [
        { raw: 'kirn patell', std: 'Kiran Patel', phonetic: 'KRN_PTL', guj: 'કિરણ પટેલ', confidence: 0.97 },
        { raw: 'priya shah', std: 'Priya Shah', phonetic: 'PRY_SH', guj: 'પ્રિયા શાહ', confidence: 0.99 },
        { raw: 'rakesh modi', std: 'Rakesh Modi', phonetic: 'RKS_MD', guj: 'રાકેશ મોદી', confidence: 0.98 },
        { raw: 'nishaben desai', std: 'Nisha Desai', phonetic: 'NSH_DS', guj: 'નિશા દેસાઈ', confidence: 0.94 },
      ],
    }],
  }} />
);

// 37. Duplicate Detection
export const DuplicateDetection = () => (
  <ModulePage config={{
    eyebrow: 'Module 5 · Screen 37', id: 37, title: 'Duplicate Detection', icon: 'Copy',
    description: 'ML-powered duplicate detection using name + DOB + Aadhaar + phonetic + fuzzy matches.',
    kpis: [
      gen.kpi('Potential Duplicates', '142,308', -12.4, 'Copy', 'warning'),
      gen.kpi('Auto-Resolved', '138,120', 8.2, 'CheckCircle2', 'success'),
      gen.kpi('Reviewer Queue', '4,188', -22.4, 'Users', 'accent'),
      gen.kpi('Precision', '96.4%', 0.8, 'Target', 'primary'),
    ],
    charts: [
      { key: 'score', title: 'Duplicate Score Distribution', type: 'bar', tall: true, icon: 'BarChart3',
        data: [{name:'0.5-0.6',value:420},{name:'0.6-0.7',value:820},{name:'0.7-0.8',value:1240},{name:'0.8-0.9',value:2400},{name:'0.9-1.0',value:8420}] },
      { key: 'src', title: 'By source dataset', type: 'donut', tall: true, icon: 'Database',
        data: [{name:'PDS',value:42},{name:'PMJAY',value:28},{name:'MGNREGA',value:12},{name:'Aadhaar',value:8},{name:'Others',value:10}] },
    ],
  }} />
);

// 38. Record Merge
export const RecordMerge = () => (
  <ModulePage config={{
    eyebrow: 'Module 5 · Screen 38', id: 38, title: 'Record Merge', icon: 'Merge',
    description: 'Golden record survivorship rules: source ranking, freshness, confidence.',
    kpis: [
      gen.kpi('Merges (24h)', '12,842', 4.2, 'Merge', 'primary'),
      gen.kpi('Auto', '11,890', 5.1, 'Zap', 'success'),
      gen.kpi('Manual', '952', -8.2, 'Users', 'accent'),
      gen.kpi('Reversed', '18', -50.0, 'RotateCcw', 'warning'),
    ],
    footer: (
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6">
        <h3 className="font-heading font-semibold mb-4">Survivorship Rules (priority order)</h3>
        <ol className="space-y-2 text-[13px] text-slate-700">
          <li>1. <strong>Aadhaar-seeded record</strong> wins over non-seeded.</li>
          <li>2. <strong>Most recent</strong> update wins for volatile fields (mobile, address).</li>
          <li>3. <strong>Highest source rank</strong>: Aadhaar &gt; Voter &gt; PDS &gt; PMJAY &gt; Others.</li>
          <li>4. <strong>Highest confidence</strong> wins for demographic fields (name, DOB).</li>
          <li>5. Manual reviewer override always wins with audit trail.</li>
        </ol>
      </div>
    ),
  }} />
);

// 39. Exception Queue
export const ExceptionQueue = () => (
  <ModulePage config={{
    eyebrow: 'Module 5 · Screen 39', id: 39, title: 'Exception Queue', icon: 'AlertTriangle',
    description: 'Records that failed automated rules and require reviewer attention.',
    kpis: [
      gen.kpi('Open Exceptions', '4,188', -8.4, 'AlertTriangle', 'warning'),
      gen.kpi('Assigned', '3,120', 4.2, 'UserCheck', 'primary'),
      gen.kpi('Resolved (7d)', '12,842', 12.2, 'CheckCircle2', 'success'),
      gen.kpi('SLA Breached', '82', -22.4, 'Timer', 'danger'),
    ],
    tables: [{
      key: 'exc', full: true, title: 'Exceptions', searchable: true, pageSize: 8,
      columns: [
        { key: 'entity', label: 'Entity' },
        { key: 'reason', label: 'Reason' },
        { key: 'assignee', label: 'Assignee' },
        { key: 'age', label: 'Age' },
        { key: 'priority', label: 'Priority', render: (r) => <span className={`text-[10.5px] font-bold uppercase ${r.priority === 'HIGH' ? 'text-rose-700' : r.priority === 'MED' ? 'text-amber-700' : 'text-slate-600'}`}>{r.priority}</span> },
      ],
      rows: Array.from({ length: 10 }, (_, i) => ({
        entity: `C${Math.floor(10000000 + Math.random() * 90000000)}`,
        reason: ['Aadhaar format invalid','Name mismatch across sources','DOB conflict','Duplicate cluster','Phonetic collision','Address unparseable'][i % 6],
        assignee: ['R. Patel','A. Desai','K. Solanki','S. Rana'][i % 4],
        age: `${i + 1}d`,
        priority: ['HIGH','MED','LOW','MED','HIGH','LOW','MED','HIGH','LOW','MED'][i],
      })),
    }],
  }} />
);

// 40. DQ Scorecard
export const DQScorecard = () => (
  <ModulePage config={{
    eyebrow: 'Module 5 · Screen 40', id: 40, title: 'DQ Scorecard', icon: 'Trophy',
    description: 'Department-level scorecard on 6 dimensions of data quality.',
    kpis: [
      gen.kpi('Overall Grade', 'A-', 0, 'Award', 'success'),
      gen.kpi('DQ Index', '94.2%', 0.8, 'ShieldCheck', 'primary'),
      gen.kpi('Top Dept', 'Health', 0, 'Crown', 'accent'),
      gen.kpi('Attention Needed', 'Utility', 0, 'AlertTriangle', 'warning'),
    ],
    charts: [
      { key: 'radar', title: 'DQ Radar', type: 'radar', tall: true, icon: 'Compass',
        data: ['Completeness','Uniqueness','Validity','Consistency','Accuracy','Timeliness'].map((d) => ({ dim: d, score: 80 + Math.random() * 18 })) },
      { key: 'grade', title: 'Grade Distribution by Dept', type: 'bar', tall: true, icon: 'Award',
        data: [{name:'A+',value:4},{name:'A',value:12},{name:'B+',value:8},{name:'B',value:14},{name:'C',value:6},{name:'D',value:2}] },
    ],
  }} />
);
