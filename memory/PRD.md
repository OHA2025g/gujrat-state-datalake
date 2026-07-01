# GCSR — State Data Lakehouse (Gujarat Common Social Registry) · PoC PRD

## Problem statement
Deliver a complete enterprise-grade Proof of Concept (PoC) for **STATE DATA LAKEHOUSE with GUJARAT COMMON SOCIAL REGISTRY (GCSR)** — a digital public infrastructure platform inspired by Aadhaar, Ayushman Bharat, India's Family ID, Palantir Foundry, Databricks and Microsoft Fabric.

Design 120 screens organized into 15 modules that support the flow:
> One Citizen → One Member ID → One Family → One Family ID → Golden Citizen → Golden Family → 360° View → Department Enrichment → AI/DBT Analytics → Governance.

## Architecture

**Backend** — FastAPI + MongoDB (motor)
- JWT auth (python-jose) + bcrypt hashing (passlib)
- Mistral AI integration (direct HTTPS to `/v1/chat/completions`)
- Rich Gujarat seed data (33 districts, 10 departments, 14 schemes, 480+ citizens, 120+ families)
- 30+ REST endpoints under `/api`

**Frontend** — React 19 + TailwindCSS + Shadcn UI + Recharts + lucide-react
- Router: 120 routes → 15 module folders → screens
- Premium enterprise light theme (Cabinet Grotesk / Public Sans / JetBrains Mono)
- Dark navy sidebar + white content area (Palantir-inspired hybrid)
- Reusable primitives: `PageHeader`, `KPICard`, `ChartCard`, `DataTable`, `Toolbar`, `Timeline`, `StatusBadge`, `ConfidenceBar`, `Charts` (Line/Area/Bar/Donut/Radar/Heatmap/Stacked/Treemap), `ModulePage` (config-driven page renderer)
- Global header with breadcrumb, ⌘K search across all 120 screens, notification center, AI Copilot drawer
- Collapsible module-grouped sidebar with 120 numbered links

## Personas
- **State Admin** (Vikram Sinha, IAS) — full access
- **Department Officer** (Dr. Anjali Desai — Health) — dept scope
- **District Officer** (Rakesh Patel, IAS — Ahmedabad) — district scope
- **Citizen** (Priya Shah, Vadodara) — self-service portal

## What's implemented (Feb 2026)
- ✅ Full JWT authentication with 4 seeded demo accounts
- ✅ Rich Gujarat sample data seeded on startup (idempotent)
- ✅ 120 screens routed across 15 modules
- ✅ 8 executive dashboards (State / District / Dept / Data Lake / DQ / AI Gov / Citizen KPI / Alerts)
- ✅ Golden Citizen 360 + Golden Family 360 with department enrichments and timeline
- ✅ Relationship tree, family tree, member search, family search (backed by MongoDB)
- ✅ Data quality, MDM, dataset lifecycle, workflow, lineage screens
- ✅ AI Copilot (Mistral) — floating drawer + full-page mode + suggestions
- ✅ Policy Simulator, Citizen Risk Score, Vulnerability Index, GIS heatmap
- ✅ Consent, audit logs, RBAC, API access, compliance dashboards
- ✅ Citizen self-service portal (family lookup, correction, tracking)
- ✅ Report Builder scaffold + 7 pre-built report pages
- ✅ ⌘K global search across all 120 screens
- ✅ Notification center with real-time alerts

## Backlog (post-PoC)
- **P0**: Wire up policy-simulator to real backend rule engine; harden Mistral rate-limits.
- **P1**: Real GIS map (Mapbox / MapLibre) with district shapefiles.
- **P1**: Dataset ingestion pipeline (S3 → Bronze → Silver) with actual file upload.
- **P2**: WhatsApp Business API for citizen notifications.
- **P2**: DigiLocker consent integration.
- **P2**: PDF export for report builder using headless browser.
- **P3**: Multi-tenant support for other Indian states.

## Next tasks
- End-to-end testing (auth, navigation, dashboards, copilot, family/citizen search)
- Optional: connect additional AI-powered flows (duplicate detection, NL-to-SQL)
