import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { ModulePage, gen } from '../../components/shared/ModulePage';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import { StatusBadge } from '../../components/shared/StatusBadge';

// 89. Consent Management
export const ConsentManagement = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/consents').then((r) => setItems(r.data.items || [])); }, []);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 12 · Screen 89" id={89} title="Consent Management" description="Aadhaar-secured, purpose-limited consent grants and revocations." icon="ShieldCheck" />
      <DataTable
        testKey="consents"
        pageSize={10}
        searchable
        columns={[
          { key: 'citizen_id', label: 'Citizen', render: (r) => <span className="font-mono text-[11.5px]">{r.citizen_id}</span> },
          { key: 'purpose', label: 'Purpose' },
          { key: 'scope', label: 'Scope', render: (r) => <div className="flex flex-wrap gap-1">{r.scope.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100">{s}</span>)}</div> },
          { key: 'granted', label: 'Granted', render: (r) => new Date(r.granted).toLocaleDateString() },
          { key: 'expires', label: 'Expires', render: (r) => new Date(r.expires).toLocaleDateString() },
          gen.statusCol(),
        ]}
        rows={items}
      />
    </div>
  );
};

// 90-96
export const AccessRequests = () => (
  <ModulePage config={{
    eyebrow: 'Module 12 · Screen 90', id: 90, title: 'Access Requests', icon: 'Key',
    description: 'Requests from departments to access PII / restricted datasets.',
    kpis: [
      gen.kpi('Open', '38', -12.4, 'Key', 'accent'),
      gen.kpi('Approved (30d)', '184', 8.2, 'CheckCircle2', 'success'),
      gen.kpi('Rejected', '12', -22.4, 'XCircle', 'danger'),
      gen.kpi('Avg TAT', '1.8d', -18.4, 'Timer', 'primary'),
    ],
    tables: [{
      key: 'req', full: true, title: 'Requests', searchable: true, pageSize: 8,
      columns: [
        { key: 'requester', label: 'Requester' },
        { key: 'dataset', label: 'Dataset' },
        { key: 'purpose', label: 'Purpose' },
        { key: 'age', label: 'Age' },
        gen.statusCol(),
      ],
      rows: [
        { requester: 'Health Dept', dataset: 'citizens.aadhaar', purpose: 'PMJAY re-verification', age: '2d', status: 'Pending Review' },
        { requester: 'Rev Dept', dataset: 'families.income', purpose: 'PMAY-G eligibility', age: '4d', status: 'Approved' },
        { requester: 'Agri', dataset: 'citizens.bank', purpose: 'PM-KISAN', age: '1d', status: 'Approved' },
        { requester: 'FCS', dataset: 'families', purpose: 'PDS audit', age: '3d', status: 'Pending Review' },
        { requester: 'Auditor', dataset: 'audit_logs', purpose: 'Compliance', age: '6d', status: 'Approved' },
      ],
    }],
  }} />
);

export const RolePermission = () => (
  <ModulePage config={{
    eyebrow: 'Module 12 · Screen 91', id: 91, title: 'Role & Permission', icon: 'UserCog',
    description: 'Role definitions and permission matrix (RBAC + ABAC).',
    tables: [{
      key: 'roles', full: true, title: 'Roles', pageSize: 6,
      columns: [
        { key: 'role', label: 'Role' },
        { key: 'users', label: 'Users' },
        { key: 'scopes', label: 'Scopes' },
        { key: 'level', label: 'Level' },
      ],
      rows: [
        { role: 'State Admin', users: 8, scopes: 'All', level: 'L1' },
        { role: 'Dept Officer (Health)', users: 42, scopes: 'HEALTH.*', level: 'L2' },
        { role: 'District Officer', users: 132, scopes: 'district.{id}.*', level: 'L2' },
        { role: 'Reviewer', users: 380, scopes: 'exceptions.*', level: 'L3' },
        { role: 'Auditor', users: 12, scopes: 'audit_logs.read', level: 'L1' },
        { role: 'Citizen', users: '6.4 Cr', scopes: 'self.*', level: 'L4' },
      ],
    }],
  }} />
);

export const APIAccessControl = () => (
  <ModulePage config={{
    eyebrow: 'Module 12 · Screen 92', id: 92, title: 'API Access Control', icon: 'Cable',
    description: 'API tokens, rate limits, IP allow-lists and scopes.',
    kpis: [
      gen.kpi('Active Tokens', '412', 4.2, 'Key', 'primary'),
      gen.kpi('Scopes Defined', '184', 3.1, 'Layers', 'accent'),
      gen.kpi('Blocked IPs', '18', -22.4, 'ShieldOff', 'warning'),
      gen.kpi('Suspended Tokens', '4', -50, 'Ban', 'danger'),
    ],
  }} />
);

export const AuditLogs = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/audit-logs').then((r) => setItems(r.data.items || [])); }, []);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 12 · Screen 93" id={93} title="Audit Logs" description="Immutable audit trail of every action across GCSR." icon="FileClock" />
      <DataTable
        testKey="audit"
        pageSize={12}
        searchable
        columns={[
          { key: 'time', label: 'Time', render: (r) => new Date(r.time).toLocaleString() },
          { key: 'actor', label: 'Actor' },
          { key: 'action', label: 'Action', render: (r) => <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100">{r.action}</span> },
          { key: 'resource', label: 'Resource' },
          { key: 'ip', label: 'IP' },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
        rows={items}
      />
    </div>
  );
};

export const SecurityMonitoring = () => (
  <ModulePage config={{
    eyebrow: 'Module 12 · Screen 94', id: 94, title: 'Security Monitoring', icon: 'ShieldAlert',
    description: 'Real-time security posture — anomalies, threats and compliance signals.',
    kpis: [
      gen.kpi('Threats Detected', '2', -33.3, 'ShieldAlert', 'danger'),
      gen.kpi('Blocked IPs', '18', 12.5, 'ShieldOff', 'warning'),
      gen.kpi('Failed Logins', '842', -8.2, 'Lock', 'accent'),
      gen.kpi('Compliance Score', '96%', 1.2, 'BadgeCheck', 'success'),
    ],
    charts: [
      { key: 'threats', title: 'Threat trend (14 days)', type: 'area', tall: true, full: true, icon: 'ShieldAlert',
        data: Array.from({ length: 14 }, (_, i) => ({ month: `D-${14 - i}`, value: Math.round(Math.random() * 20) })) },
    ],
  }} />
);

export const DataSharing = () => (
  <ModulePage config={{
    eyebrow: 'Module 12 · Screen 95', id: 95, title: 'Data Sharing', icon: 'Share2',
    description: 'Track datasets shared with departments / partners with masked / consented flows.',
    tables: [{
      key: 'share', full: true, title: 'Sharing Agreements', pageSize: 8,
      columns: [
        { key: 'consumer', label: 'Consumer' },
        { key: 'dataset', label: 'Dataset' },
        { key: 'mode', label: 'Mode' },
        { key: 'records', label: 'Records / month' },
        gen.statusCol(),
      ],
      rows: [
        { consumer: 'PMJAY-Gj', dataset: 'citizens (masked)', mode: 'API', records: '12M', status: 'Active' },
        { consumer: 'MGNREGA', dataset: 'families', mode: 'Batch', records: '8M', status: 'Active' },
        { consumer: 'PDS FCS', dataset: 'families (ration)', mode: 'API', records: '18M', status: 'Active' },
        { consumer: 'Rev Dept', dataset: 'land_records', mode: 'Batch', records: '4M', status: 'Active' },
        { consumer: 'CAG Audit', dataset: 'benefits (sample)', mode: 'One-off', records: '500K', status: 'Approved' },
      ],
    }],
  }} />
);

export const ComplianceDashboard = () => (
  <ModulePage config={{
    eyebrow: 'Module 12 · Screen 96', id: 96, title: 'Compliance Dashboard', icon: 'BadgeCheck',
    description: 'DPDP Act 2023, Aadhaar Act, RTI compliance signals and evidence.',
    kpis: [
      gen.kpi('DPDP Score', '96%', 1.4, 'BadgeCheck', 'success'),
      gen.kpi('Data Fiduciary', '12', 0, 'Building2', 'primary'),
      gen.kpi('DPO Escalations', '4', -33.3, 'Flag', 'warning'),
      gen.kpi('Breach Reports (12m)', '0', 0, 'ShieldCheck', 'success'),
    ],
  }} />
);
