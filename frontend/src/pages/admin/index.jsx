import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { ModulePage, gen } from '../../components/shared/ModulePage';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import { StatusBadge } from '../../components/shared/StatusBadge';

// 105. User Management
export const UserManagement = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/admin/users').then((r) => setItems(r.data.items || [])); }, []);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 14 · Screen 105" id={105} title="User Management" description="Manage officers and administrative users across GCSR." icon="Users" />
      <DataTable
        testKey="users"
        pageSize={10}
        searchable
        columns={[
          { key: 'full_name', label: 'Name' },
          { key: 'username', label: 'Username', render: (r) => <span className="font-mono text-[11.5px]">{r.username}</span> },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'department', label: 'Dept' },
          { key: 'district', label: 'District', render: (r) => r.district || 'State-wide' },
          gen.statusCol(),
        ]}
        rows={items}
      />
    </div>
  );
};

// 106-112
export const DepartmentMgmt = () => (
  <ModulePage config={{
    eyebrow: 'Module 14 · Screen 106', id: 106, title: 'Department Management', icon: 'Building2',
    description: 'Onboarded departments, integration owners, SLA contracts.',
    kpis: [
      gen.kpi('Onboarded', '42 / 46', 4.4, 'Building2', 'primary'),
      gen.kpi('Active SLAs', '38', 0, 'FileText', 'accent'),
      gen.kpi('Renewals due', '4', -50, 'Clock', 'warning'),
    ],
  }} />
);

export const WorkflowConfig = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/admin/workflows').then((r) => setItems(r.data.items || [])); }, []);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 14 · Screen 107" id={107} title="Workflow Configuration" description="Business workflows for merges, approvals, corrections and consent renewals." icon="Workflow" />
      <DataTable
        testKey="workflows"
        pageSize={10}
        columns={[
          { key: 'name', label: 'Workflow' },
          { key: 'steps', label: 'Steps' },
          { key: 'sla_hours', label: 'SLA (hrs)' },
          { key: 'active_instances', label: 'Active' },
          { key: 'success_rate', label: 'Success', render: (r) => `${r.success_rate}%` },
        ]}
        rows={items}
      />
    </div>
  );
};

export const BusinessRules = () => (
  <ModulePage config={{
    eyebrow: 'Module 14 · Screen 108', id: 108, title: 'Business Rules', icon: 'ListChecks',
    description: 'Define matching rules, survivorship rules, eligibility rules — all versioned.',
    kpis: [
      gen.kpi('Rules', '284', 4.2, 'ListChecks', 'primary'),
      gen.kpi('Active', '256', 2.1, 'CheckCircle2', 'success'),
      gen.kpi('Draft', '18', -12.4, 'FilePen', 'accent'),
      gen.kpi('Deprecated', '10', 0, 'Archive', 'warning'),
    ],
  }} />
);

export const NotificationsCfg = () => (
  <ModulePage config={{
    eyebrow: 'Module 14 · Screen 109', id: 109, title: 'Notifications', icon: 'Bell',
    description: 'Configure notification channels — SMS, email, DigiLocker, WhatsApp Business.',
    kpis: [
      gen.kpi('Sent (24h)', '1.24M', 8.4, 'Send', 'primary'),
      gen.kpi('SMS', '820K', 4.2, 'Smartphone', 'accent'),
      gen.kpi('Email', '312K', 12.4, 'Mail', 'secondary'),
      gen.kpi('WhatsApp', '108K', 42.4, 'MessageCircle', 'success'),
    ],
  }} />
);

export const MasterDataCfg = () => (
  <ModulePage config={{
    eyebrow: 'Module 14 · Screen 110', id: 110, title: 'Master Data Config', icon: 'Database',
    description: 'Reference lists: districts, talukas, categories, income bands, etc.',
    tables: [{
      key: 'ref', full: true, title: 'Reference Lists', pageSize: 6,
      columns: [
        { key: 'list', label: 'List' },
        { key: 'entries', label: 'Entries' },
        { key: 'version', label: 'Version' },
        { key: 'last_updated', label: 'Last updated' },
      ],
      rows: [
        { list: 'Districts', entries: 33, version: 'v2.0', last_updated: '2024-04-01' },
        { list: 'Talukas', entries: 250, version: 'v2.1', last_updated: '2024-06-11' },
        { list: 'Villages', entries: 18410, version: 'v3.0', last_updated: '2025-02-14' },
        { list: 'Categories', entries: 5, version: 'v1.0', last_updated: '2023-01-15' },
        { list: 'Income bands', entries: 6, version: 'v1.2', last_updated: '2025-04-10' },
        { list: 'Occupations', entries: 68, version: 'v2.0', last_updated: '2025-08-22' },
      ],
    }],
  }} />
);

export const Scheduler = () => (
  <ModulePage config={{
    eyebrow: 'Module 14 · Screen 111', id: 111, title: 'Scheduler & Jobs', icon: 'CalendarClock',
    description: 'Cron-scheduled ingestion, DQ and MDM jobs.',
    kpis: [
      gen.kpi('Jobs', '184', 3.1, 'Calendar', 'primary'),
      gen.kpi('Running', '18', 0, 'Play', 'success'),
      gen.kpi('Failed (24h)', '4', -50, 'AlertOctagon', 'danger'),
      gen.kpi('Avg Duration', '4.2m', -8.4, 'Timer', 'accent'),
    ],
    tables: [{
      key: 'jobs', full: true, title: 'Scheduled Jobs', pageSize: 8,
      columns: [
        { key: 'name', label: 'Job' },
        { key: 'schedule', label: 'Schedule' },
        { key: 'last_run', label: 'Last Run' },
        { key: 'duration', label: 'Duration' },
        gen.statusCol(),
      ],
      rows: [
        { name: 'daily_family_refresh', schedule: '0 2 * * *', last_run: '2h ago', duration: '38m', status: 'OK' },
        { name: 'hourly_ingestion', schedule: '0 * * * *', last_run: '12m ago', duration: '4m', status: 'OK' },
        { name: 'weekly_dq_scorecard', schedule: '0 3 * * 0', last_run: '4d ago', duration: '52m', status: 'OK' },
        { name: 'monthly_leakage_scan', schedule: '0 4 1 * *', last_run: '18d ago', duration: '2h 8m', status: 'OK' },
        { name: 'nightly_ai_retrain', schedule: '0 3 * * *', last_run: '4h ago', duration: '48m', status: 'FAIL' },
      ],
    }],
  }} />
);

export const SystemSettings = () => (
  <ModulePage config={{
    eyebrow: 'Module 14 · Screen 112', id: 112, title: 'System Settings', icon: 'Settings2',
    description: 'Global platform configuration — feature flags, retention, branding.',
    tables: [{
      key: 'flags', full: true, title: 'Feature Flags', pageSize: 8,
      columns: [
        { key: 'flag', label: 'Flag' },
        { key: 'env', label: 'Env' },
        { key: 'enabled', label: 'Enabled' },
        { key: 'rollout', label: 'Rollout' },
      ],
      rows: [
        { flag: 'ai_copilot_v2', env: 'prod', enabled: 'Yes', rollout: '100%' },
        { flag: 'nl_query_gujarati', env: 'prod', enabled: 'Yes', rollout: '25%' },
        { flag: 'auto_family_merge_v2', env: 'prod', enabled: 'Yes', rollout: '100%' },
        { flag: 'digilocker_consent', env: 'prod', enabled: 'Yes', rollout: '100%' },
        { flag: 'policy_simulator', env: 'prod', enabled: 'Yes', rollout: '10%' },
        { flag: 'whatsapp_notify', env: 'stg', enabled: 'Yes', rollout: '5%' },
      ],
    }],
  }} />
);
