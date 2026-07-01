import React from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from '@/components/ui/sonner';

// Auth pages
import { Login, MFA, ForgotPassword, RoleSelection } from '@/pages/auth/AuthPages';
import { UserProfile, SessionManagement } from '@/pages/auth/ProfilePages';

// Executive Dashboards
import {
  StateDashboard, DistrictDashboard, DepartmentDashboard, DataLakeHealth,
  DataQualityDashboard, AIGovernance, CitizenFamilyKPIs, AlertsPage,
} from '@/pages/dashboards';

// Dataset
import {
  DatasetCatalog, DatasetUpload, DatasetRegistration, DatasetPreview,
  VersionHistory, ValidationResults, MetadataManagement, DataLineage,
  ApprovalWorkflow, DatasetMonitoring,
} from '@/pages/dataset';

// Department Integration
import {
  DepartmentRegistry, IntegrationDashboard, APIConfiguration, BatchImport,
  RealTimeSync, APIUsage, IntegrationErrors, DepartmentHealth,
} from '@/pages/dept';

// Data Quality
import {
  DataProfiling, CleansingWorkbench, AddressStandardization, NameStandardization,
  DuplicateDetection, RecordMerge, ExceptionQueue, DQScorecard,
} from '@/pages/quality';

// Member ID
import {
  MemberSearch, MemberProfile, MemberIDGeneration, MatchingReview,
  DuplicateResolution, MemberTimeline, MemberAudit,
} from '@/pages/member';

// Family ID
import {
  FamilySearch, FamilyProfile, RelationshipTree, FamilyFormation,
  HoFValidation, FamilyIDGeneration, FamilyMerge, FamilySplit,
  UpdateRequest, FamilyTimeline, GoldenFamily360, HouseholdSummary,
} from '@/pages/family';
// Golden Citizen 360 lives in member/index
import { GoldenCitizen360 } from '@/pages/member';

// Registry
import { RegistryComparison, ConfidenceScore, ChangeHistory } from '@/pages/registry';

// Enrichment
import {
  HealthIntegration, EducationIntegration, RevenueLand, AgricultureIntegration,
  SocialWelfare, BankingDBT, UtilityIntegration, AddressVerification, EnrichmentDashboard,
} from '@/pages/enrichment';

// Scheme
import {
  SchemeRegistry, EligibilityEngine, SchemeRecommendation, DBTDashboard,
  BenefitHistory, DuplicateBenefit, SchemeSaturation, WelfareLeakage,
} from '@/pages/scheme';

// AI
import {
  AICopilot, NLQuery, CitizenRiskScore, VulnerabilityIndex,
  PredictiveAnalytics, PolicySimulator, GISAnalytics, AIInsightExplorer,
} from '@/pages/ai';

// Governance
import {
  ConsentManagement, AccessRequests, RolePermission, APIAccessControl,
  AuditLogs, SecurityMonitoring, DataSharing, ComplianceDashboard,
} from '@/pages/governance';

// Portal
import {
  CitizenLogin, SearchFamilyID, ViewFamilyProfile, UpdateMember,
  RequestMerge, RequestSplit, CorrectionRequest, TrackRequest,
} from '@/pages/portal';

// Admin
import {
  UserManagement, DepartmentMgmt, WorkflowConfig, BusinessRules,
  NotificationsCfg, MasterDataCfg, Scheduler, SystemSettings,
} from '@/pages/admin';

// Reports
import {
  ExecutiveReports, CitizenReports, FamilyReports, DepartmentReports,
  DBTReports, DataQualityReports, AIReports, ReportBuilder,
} from '@/pages/reports';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading GCSR…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
};

const Public = ({ children }) => children;

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth (no layout) */}
            <Route path="/login" element={<Public><Login /></Public>} />
            <Route path="/mfa" element={<Public><MFA /></Public>} />
            <Route path="/role" element={<Public><RoleSelection /></Public>} />
            <Route path="/forgot" element={<Public><ForgotPassword /></Public>} />

            {/* Root → dashboard */}
            <Route path="/" element={<Navigate to="/dashboard/state" replace />} />

            {/* Auth / profile */}
            <Route path="/profile" element={<Protected><UserProfile /></Protected>} />
            <Route path="/sessions" element={<Protected><SessionManagement /></Protected>} />

            {/* Dashboards (7-14) */}
            <Route path="/dashboard/state" element={<Protected><StateDashboard /></Protected>} />
            <Route path="/dashboard/district" element={<Protected><DistrictDashboard /></Protected>} />
            <Route path="/dashboard/department" element={<Protected><DepartmentDashboard /></Protected>} />
            <Route path="/dashboard/data-lake" element={<Protected><DataLakeHealth /></Protected>} />
            <Route path="/dashboard/data-quality" element={<Protected><DataQualityDashboard /></Protected>} />
            <Route path="/dashboard/ai" element={<Protected><AIGovernance /></Protected>} />
            <Route path="/dashboard/citizen" element={<Protected><CitizenFamilyKPIs /></Protected>} />
            <Route path="/dashboard/alerts" element={<Protected><AlertsPage /></Protected>} />

            {/* Dataset (15-24) */}
            <Route path="/dataset/catalog" element={<Protected><DatasetCatalog /></Protected>} />
            <Route path="/dataset/upload" element={<Protected><DatasetUpload /></Protected>} />
            <Route path="/dataset/register" element={<Protected><DatasetRegistration /></Protected>} />
            <Route path="/dataset/preview" element={<Protected><DatasetPreview /></Protected>} />
            <Route path="/dataset/versions" element={<Protected><VersionHistory /></Protected>} />
            <Route path="/dataset/validation" element={<Protected><ValidationResults /></Protected>} />
            <Route path="/dataset/metadata" element={<Protected><MetadataManagement /></Protected>} />
            <Route path="/dataset/lineage" element={<Protected><DataLineage /></Protected>} />
            <Route path="/dataset/approval" element={<Protected><ApprovalWorkflow /></Protected>} />
            <Route path="/dataset/monitoring" element={<Protected><DatasetMonitoring /></Protected>} />

            {/* Department Integration (25-32) */}
            <Route path="/dept/registry" element={<Protected><DepartmentRegistry /></Protected>} />
            <Route path="/dept/dashboard" element={<Protected><IntegrationDashboard /></Protected>} />
            <Route path="/dept/api-config" element={<Protected><APIConfiguration /></Protected>} />
            <Route path="/dept/batch-import" element={<Protected><BatchImport /></Protected>} />
            <Route path="/dept/realtime-sync" element={<Protected><RealTimeSync /></Protected>} />
            <Route path="/dept/api-usage" element={<Protected><APIUsage /></Protected>} />
            <Route path="/dept/errors" element={<Protected><IntegrationErrors /></Protected>} />
            <Route path="/dept/health" element={<Protected><DepartmentHealth /></Protected>} />

            {/* Data Quality (33-40) */}
            <Route path="/quality/profiling" element={<Protected><DataProfiling /></Protected>} />
            <Route path="/quality/cleansing" element={<Protected><CleansingWorkbench /></Protected>} />
            <Route path="/quality/address" element={<Protected><AddressStandardization /></Protected>} />
            <Route path="/quality/name" element={<Protected><NameStandardization /></Protected>} />
            <Route path="/quality/duplicates" element={<Protected><DuplicateDetection /></Protected>} />
            <Route path="/quality/merge" element={<Protected><RecordMerge /></Protected>} />
            <Route path="/quality/exceptions" element={<Protected><ExceptionQueue /></Protected>} />
            <Route path="/quality/scorecard" element={<Protected><DQScorecard /></Protected>} />

            {/* Member (41-47) */}
            <Route path="/member/search" element={<Protected><MemberSearch /></Protected>} />
            <Route path="/member/profile" element={<Protected><MemberProfile /></Protected>} />
            <Route path="/member/generation" element={<Protected><MemberIDGeneration /></Protected>} />
            <Route path="/member/matching" element={<Protected><MatchingReview /></Protected>} />
            <Route path="/member/duplicates" element={<Protected><DuplicateResolution /></Protected>} />
            <Route path="/member/timeline" element={<Protected><MemberTimeline /></Protected>} />
            <Route path="/member/audit" element={<Protected><MemberAudit /></Protected>} />

            {/* Family (48-57) */}
            <Route path="/family/search" element={<Protected><FamilySearch /></Protected>} />
            <Route path="/family/profile" element={<Protected><FamilyProfile /></Protected>} />
            <Route path="/family/tree" element={<Protected><RelationshipTree /></Protected>} />
            <Route path="/family/formation" element={<Protected><FamilyFormation /></Protected>} />
            <Route path="/family/hof" element={<Protected><HoFValidation /></Protected>} />
            <Route path="/family/generation" element={<Protected><FamilyIDGeneration /></Protected>} />
            <Route path="/family/merge" element={<Protected><FamilyMerge /></Protected>} />
            <Route path="/family/split" element={<Protected><FamilySplit /></Protected>} />
            <Route path="/family/update" element={<Protected><UpdateRequest /></Protected>} />
            <Route path="/family/timeline" element={<Protected><FamilyTimeline /></Protected>} />

            {/* GCSR Registry (58-63) */}
            <Route path="/registry/citizen-360" element={<Protected><GoldenCitizen360 /></Protected>} />
            <Route path="/registry/family-360" element={<Protected><GoldenFamily360 /></Protected>} />
            <Route path="/registry/household" element={<Protected><HouseholdSummary /></Protected>} />
            <Route path="/registry/comparison" element={<Protected><RegistryComparison /></Protected>} />
            <Route path="/registry/confidence" element={<Protected><ConfidenceScore /></Protected>} />
            <Route path="/registry/history" element={<Protected><ChangeHistory /></Protected>} />

            {/* Enrichment (64-72) */}
            <Route path="/enrichment/health" element={<Protected><HealthIntegration /></Protected>} />
            <Route path="/enrichment/education" element={<Protected><EducationIntegration /></Protected>} />
            <Route path="/enrichment/revenue" element={<Protected><RevenueLand /></Protected>} />
            <Route path="/enrichment/agriculture" element={<Protected><AgricultureIntegration /></Protected>} />
            <Route path="/enrichment/social" element={<Protected><SocialWelfare /></Protected>} />
            <Route path="/enrichment/banking" element={<Protected><BankingDBT /></Protected>} />
            <Route path="/enrichment/utility" element={<Protected><UtilityIntegration /></Protected>} />
            <Route path="/enrichment/address" element={<Protected><AddressVerification /></Protected>} />
            <Route path="/enrichment/dashboard" element={<Protected><EnrichmentDashboard /></Protected>} />

            {/* Scheme & DBT (73-80) */}
            <Route path="/scheme/registry" element={<Protected><SchemeRegistry /></Protected>} />
            <Route path="/scheme/eligibility" element={<Protected><EligibilityEngine /></Protected>} />
            <Route path="/scheme/recommendation" element={<Protected><SchemeRecommendation /></Protected>} />
            <Route path="/scheme/dbt-dashboard" element={<Protected><DBTDashboard /></Protected>} />
            <Route path="/scheme/history" element={<Protected><BenefitHistory /></Protected>} />
            <Route path="/scheme/duplicate" element={<Protected><DuplicateBenefit /></Protected>} />
            <Route path="/scheme/saturation" element={<Protected><SchemeSaturation /></Protected>} />
            <Route path="/scheme/leakage" element={<Protected><WelfareLeakage /></Protected>} />

            {/* AI & Analytics (81-88) */}
            <Route path="/ai/copilot" element={<Protected><AICopilot /></Protected>} />
            <Route path="/ai/nl-query" element={<Protected><NLQuery /></Protected>} />
            <Route path="/ai/risk-score" element={<Protected><CitizenRiskScore /></Protected>} />
            <Route path="/ai/vulnerability" element={<Protected><VulnerabilityIndex /></Protected>} />
            <Route path="/ai/predictive" element={<Protected><PredictiveAnalytics /></Protected>} />
            <Route path="/ai/policy-sim" element={<Protected><PolicySimulator /></Protected>} />
            <Route path="/ai/gis" element={<Protected><GISAnalytics /></Protected>} />
            <Route path="/ai/insights" element={<Protected><AIInsightExplorer /></Protected>} />

            {/* Governance (89-96) */}
            <Route path="/gov/consent" element={<Protected><ConsentManagement /></Protected>} />
            <Route path="/gov/access" element={<Protected><AccessRequests /></Protected>} />
            <Route path="/gov/roles" element={<Protected><RolePermission /></Protected>} />
            <Route path="/gov/api-access" element={<Protected><APIAccessControl /></Protected>} />
            <Route path="/gov/audit" element={<Protected><AuditLogs /></Protected>} />
            <Route path="/gov/security" element={<Protected><SecurityMonitoring /></Protected>} />
            <Route path="/gov/data-sharing" element={<Protected><DataSharing /></Protected>} />
            <Route path="/gov/compliance" element={<Protected><ComplianceDashboard /></Protected>} />

            {/* Portal (97-104) */}
            <Route path="/portal/login" element={<Protected><CitizenLogin /></Protected>} />
            <Route path="/portal/search" element={<Protected><SearchFamilyID /></Protected>} />
            <Route path="/portal/view-family" element={<Protected><ViewFamilyProfile /></Protected>} />
            <Route path="/portal/update" element={<Protected><UpdateMember /></Protected>} />
            <Route path="/portal/request-merge" element={<Protected><RequestMerge /></Protected>} />
            <Route path="/portal/request-split" element={<Protected><RequestSplit /></Protected>} />
            <Route path="/portal/correction" element={<Protected><CorrectionRequest /></Protected>} />
            <Route path="/portal/track" element={<Protected><TrackRequest /></Protected>} />

            {/* Administration (105-112) */}
            <Route path="/admin/users" element={<Protected><UserManagement /></Protected>} />
            <Route path="/admin/departments" element={<Protected><DepartmentMgmt /></Protected>} />
            <Route path="/admin/workflows" element={<Protected><WorkflowConfig /></Protected>} />
            <Route path="/admin/rules" element={<Protected><BusinessRules /></Protected>} />
            <Route path="/admin/notifications" element={<Protected><NotificationsCfg /></Protected>} />
            <Route path="/admin/master-data" element={<Protected><MasterDataCfg /></Protected>} />
            <Route path="/admin/scheduler" element={<Protected><Scheduler /></Protected>} />
            <Route path="/admin/settings" element={<Protected><SystemSettings /></Protected>} />

            {/* Reports (113-120) */}
            <Route path="/reports/executive" element={<Protected><ExecutiveReports /></Protected>} />
            <Route path="/reports/citizen" element={<Protected><CitizenReports /></Protected>} />
            <Route path="/reports/family" element={<Protected><FamilyReports /></Protected>} />
            <Route path="/reports/department" element={<Protected><DepartmentReports /></Protected>} />
            <Route path="/reports/dbt" element={<Protected><DBTReports /></Protected>} />
            <Route path="/reports/quality" element={<Protected><DataQualityReports /></Protected>} />
            <Route path="/reports/ai" element={<Protected><AIReports /></Protected>} />
            <Route path="/reports/builder" element={<Protected><ReportBuilder /></Protected>} />

            <Route path="*" element={<Navigate to="/dashboard/state" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
