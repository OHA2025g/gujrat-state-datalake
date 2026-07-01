import React from 'react';
import { ModulePage, gen } from '../../components/shared/ModulePage';

const enrichConfig = (id, title, icon, dept, desc, extras = {}) => ({
  eyebrow: `Module 9 · Screen ${id}`, id, title, icon, description: desc,
  kpis: [
    gen.kpi(`${dept} Records`, `${(4 + Math.random() * 8).toFixed(1)}M`, +(Math.random()*8).toFixed(1), 'Database', 'primary'),
    gen.kpi('Match Rate', `${(85 + Math.random() * 12).toFixed(1)}%`, +(Math.random()*4).toFixed(1), 'Target', 'success'),
    gen.kpi('Enriched Citizens', `${(2 + Math.random() * 4).toFixed(1)} Cr`, +(Math.random()*6).toFixed(1), 'UserCheck', 'accent'),
    gen.kpi('Data Freshness', 'Real-time', 0, 'Activity', 'secondary'),
  ],
  charts: [
    { key: 'trend', title: `${dept} enrolment trend`, type: 'area', tall: true, icon: 'TrendingUp',
      data: gen.monthSeries(8, 800) },
    { key: 'district', title: `${dept} coverage by top districts`, type: 'bar', tall: true, icon: 'MapPin',
      data: gen.distSeries(10) },
  ],
  ...extras,
});

export const HealthIntegration       = () => <ModulePage config={enrichConfig(64, 'Health Integration',      'HeartPulse',   'PMJAY / MA-Yojana', 'PMJAY, Ayushman card, MA Yojana, Anganwadi and hospital data.')} />;
export const EducationIntegration    = () => <ModulePage config={enrichConfig(65, 'Education Integration',   'GraduationCap','Schools / MDM',    'Mid-Day Meal, MYSY, scholarships and Anganwadi to school transition.')} />;
export const RevenueLand             = () => <ModulePage config={enrichConfig(66, 'Revenue & Land',          'Landmark',     'Revenue',          'Land records (7/12 utara), property registry and stamp duty.')} />;
export const AgricultureIntegration  = () => <ModulePage config={enrichConfig(67, 'Agriculture Integration', 'Wheat',        'Agriculture',      'PM-KISAN, crop insurance, soil health cards and iKhedut applications.')} />;
export const SocialWelfare           = () => <ModulePage config={enrichConfig(68, 'Social Welfare',          'HeartHandshake','SJ&E',             'Pension schemes, disability certificates, widow assistance, SC/ST welfare.')} />;
export const BankingDBT              = () => <ModulePage config={enrichConfig(69, 'Banking & DBT',           'Banknote',     'Banks / NPCI',     'PMJDY, DBT credits, Aadhaar mapper and failed payment resolution.')} />;
export const UtilityIntegration      = () => <ModulePage config={enrichConfig(70, 'Utility Integration',     'Zap',          'Utilities',        'UGVCL / PGVCL / MGVCL / DGVCL and PMUY LPG integration.')} />;
export const AddressVerification     = () => <ModulePage config={enrichConfig(71, 'Address Verification',    'MapPin',       'Addresses',        'Cross-source address matching and physical verification workflows.')} />;

export const EnrichmentDashboard = () => (
  <ModulePage config={{
    eyebrow: 'Module 9 · Screen 72', id: 72, title: 'Enrichment Dashboard', icon: 'LayoutDashboard',
    description: 'One glance at all 8 department enrichments and their contribution to Golden records.',
    kpis: [
      gen.kpi('Depts Integrated', '8 / 10', 12.5, 'Building2', 'primary'),
      gen.kpi('Fields Enriched', '184', 4.2, 'Layers', 'accent'),
      gen.kpi('Match Rate (avg)', '92.4%', 1.8, 'Target', 'success'),
      gen.kpi('Records/day', '12.4M', 8.2, 'Activity', 'secondary'),
    ],
    charts: [
      { key: 'by-dept', title: 'Enrichment contribution by department', type: 'bar', tall: true, full: true, icon: 'Building2',
        data: [{name:'Health',value:24},{name:'Education',value:18},{name:'Revenue',value:22},{name:'Agriculture',value:12},{name:'Welfare',value:14},{name:'Banking',value:20},{name:'Utility',value:11},{name:'Address',value:9}] },
    ],
  }} />
);
