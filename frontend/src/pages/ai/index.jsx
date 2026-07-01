import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import api from '../../lib/api';
import { ModulePage, gen } from '../../components/shared/ModulePage';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import { StatusBadge, ConfidenceBar, InsightPill } from '../../components/shared/StatusBadge';
import { ChartCard } from '../../components/shared/ChartCard';
import { LineChartX, BarChartX, DonutChart, HeatmapGrid } from '../../components/shared/Charts';
import { GJ_DISTRICTS } from '../../constants/gujaratData';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { COPILOT } from '../../constants/testIds';

// 81. AI Copilot (full page)
export const AICopilot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste 🙏 I am the GCSR AI Copilot powered by Mistral. Ask me anything about citizens, families, schemes, DBT, or data quality across Gujarat.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => { api.get('/copilot/suggestions').then((r) => setSuggestions(r.data.suggestions || [])); }, []);

  const send = async (text) => {
    const prompt = (text ?? input).trim();
    if (!prompt || loading) return;
    setInput('');
    const next = [...messages, { role: 'user', content: prompt }];
    setMessages(next);
    setLoading(true);
    try {
      const r = await api.post('/copilot/chat', { prompt, history: next.slice(1, -1).map((m) => ({ role: m.role, content: m.content })) });
      setMessages((p) => [...p, { role: 'assistant', content: r.data.answer }]);
    } catch { setMessages((p) => [...p, { role: 'assistant', content: '⚠️ Copilot request failed.' }]); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 11 · Screen 81" id={81} title="AI Copilot" description="Chat with the GCSR AI to explore, reason and act across all 6.4 crore records." icon="Bot" />

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-card flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`} data-testid={COPILOT.msg(i)}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                  m.role === 'user' ? 'bg-slate-900 text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                }`}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm inline-flex items-center gap-1.5 text-slate-500 text-[13px]">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-slate-100 p-4 flex items-end gap-2 bg-white">
            <textarea rows={2} value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about DBT leakage, family duplicates, scheme saturation…"
              data-testid={COPILOT.input}
              className="flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-[13.5px] outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300" />
            <Button onClick={() => send()} disabled={loading || !input.trim()} data-testid={COPILOT.send}
              className="h-11 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90">
              <Icons.Send size={15} />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
            <h3 className="font-heading font-semibold text-slate-900 mb-3 flex items-center gap-2"><Icons.Sparkles size={14} /> Suggestions</h3>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => send(s)} data-testid={COPILOT.suggest(i)}
                  className="w-full text-left text-[12.5px] px-3 py-2 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-100 hover:border-indigo-200 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-xl p-5 shadow-card">
            <Icons.Info size={16} className="mb-2 opacity-80" />
            <div className="font-heading font-semibold text-[14px]">Model: Mistral Large</div>
            <div className="text-[12px] opacity-90 mt-1">Every Copilot suggestion is advisory. All actions require officer approval and are audited.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 82. NL Query
export const NLQuery = () => (
  <ModulePage config={{
    eyebrow: 'Module 11 · Screen 82', id: 82, title: 'Natural Language Query', icon: 'MessageSquare',
    description: 'Ask questions in English or Gujarati; NL2SQL engine translates to safe read-only queries.',
    kpis: [
      gen.kpi('Queries (24h)', '4,218', 12.4, 'MessageSquare', 'primary'),
      gen.kpi('Success rate', '96.8%', 1.2, 'CheckCircle2', 'success'),
      gen.kpi('Avg latency', '1.4s', -0.2, 'Timer', 'accent'),
      gen.kpi('Languages', 'EN + GU', 0, 'Languages', 'secondary'),
    ],
    tables: [{
      key: 'recent', full: true, title: 'Recent NL queries', pageSize: 6,
      columns: [
        { key: 'query', label: 'Query' },
        { key: 'sql', label: 'Translated SQL' },
        { key: 'rows', label: 'Rows' },
        { key: 'time', label: 'Time' },
      ],
      rows: [
        { query: 'Show me families with 5+ members in Kutch', sql: 'SELECT * FROM families WHERE household_size >= 5 AND district = "Kutch"', rows: '18,204', time: '1.2s' },
        { query: 'Top 10 districts by welfare saturation', sql: 'SELECT district, AVG(welfare_saturation) FROM families GROUP BY district ORDER BY 2 DESC LIMIT 10', rows: '10', time: '0.8s' },
        { query: 'Duplicates flagged in Feb 2026', sql: 'SELECT * FROM matches WHERE created_at BETWEEN "2026-02-01" AND "2026-02-28"', rows: '2,842', time: '2.1s' },
      ],
    }],
  }} />
);

// 83. Citizen Risk Score
export const CitizenRiskScore = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/ai/risk-scores').then((r) => setItems(r.data.items || [])); }, []);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 11 · Screen 83" id={83} title="Citizen Risk Score" description="AI risk score highlighting fraud, duplicate benefit or leakage risk." icon="ShieldAlert" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          gen.kpi('High Risk', items.filter(i => i.risk_score > 0.6).length, 4.2, 'AlertOctagon', 'danger'),
          gen.kpi('Medium', items.filter(i => i.risk_score >= 0.3 && i.risk_score <= 0.6).length, -8.4, 'AlertTriangle', 'warning'),
          gen.kpi('Low', items.filter(i => i.risk_score < 0.3).length, 12.4, 'CheckCircle2', 'success'),
          gen.kpi('Avg Score', items.length ? (items.reduce((a,b) => a + b.risk_score, 0) / items.length).toFixed(2) : '—', 0, 'Gauge', 'primary'),
        ].map((k, i) => (
          <div key={i} className="kpi-card bg-white rounded-xl border border-slate-200 p-5 shadow-card">
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">{k.label}</div>
            <div className="font-heading font-bold text-2xl mt-1">{k.value}</div>
          </div>
        ))}
      </div>
      <DataTable
        testKey="risk"
        pageSize={12}
        columns={[
          { key: 'name', label: 'Citizen' },
          { key: 'district', label: 'District' },
          { key: 'family_id', label: 'Family', render: (r) => <span className="font-mono text-[11px]">{r.family_id}</span> },
          { key: 'vulnerability_score', label: 'Vulnerability', render: (r) => <ConfidenceBar value={r.vulnerability_score} /> },
          { key: 'risk_score', label: 'Risk', render: (r) => {
            const v = r.risk_score;
            const tone = v > 0.6 ? 'text-rose-700' : v > 0.3 ? 'text-amber-700' : 'text-emerald-700';
            return <span className={`font-mono font-bold ${tone}`}>{(v * 100).toFixed(0)}%</span>;
          } },
        ]}
        rows={items}
      />
    </div>
  );
};

// 84. Vulnerability Index
export const VulnerabilityIndex = () => (
  <ModulePage config={{
    eyebrow: 'Module 11 · Screen 84', id: 84, title: 'Vulnerability Index', icon: 'Gauge',
    description: 'Composite social vulnerability index by district (economic + social + health).',
    charts: [
      { key: 'heat', title: 'Vulnerability heatmap · 33 districts', type: 'heatmap', tall: true, full: true, icon: 'Map',
        data: GJ_DISTRICTS.map((d) => ({ district: d, score: 20 + Math.random() * 65 })) },
    ],
  }} />
);

// 85. Predictive Analytics
export const PredictiveAnalytics = () => (
  <ModulePage config={{
    eyebrow: 'Module 11 · Screen 85', id: 85, title: 'Predictive Analytics', icon: 'TrendingUp',
    description: 'Forecasts and predictions for coverage, disbursal and eligibility.',
    kpis: [
      gen.kpi('DBT Forecast (Q4)', '₹ 12,842 Cr', 8.2, 'TrendingUp', 'primary'),
      gen.kpi('New Enrolments', '2.4 L', 12.4, 'UserPlus', 'success'),
      gen.kpi('Leakage Trend', '-14%', -14.0, 'TrendingDown', 'accent'),
      gen.kpi('Confidence', '89%', 2.1, 'Target', 'secondary'),
    ],
    charts: [
      { key: 'forecast', title: 'DBT Forecast (12 months)', type: 'line', tall: true, full: true, icon: 'TrendingUp',
        data: Array.from({ length: 12 }, (_, i) => ({ month: ['Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb'][i], value: 3800 + Math.random() * 1400 + i * 80 })) },
    ],
  }} />
);

// 86. Policy Simulator
export const PolicySimulator = () => {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/ai/policy-simulator').then((r) => setData(r.data)); }, []);
  if (!data) return null;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 11 · Screen 86" id={86} title="Policy Simulator" description="Simulate rule changes and see impact on beneficiaries, cost and leakage." icon="Beaker" />
      <InsightPill tone="info">
        <div>The <strong>Vahli Dikri Yojana</strong> is currently limited to families with income &lt; ₹2 L. Simulate impact of raising cap to ₹3 L.</div>
      </InsightPill>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {data.scenarios.map((s, i) => (
          <div key={s.name} className={`bg-white rounded-xl border shadow-card p-5 ${i === 0 ? 'border-slate-300' : 'border-indigo-200'}`}>
            <div className="text-[10.5px] uppercase font-semibold tracking-wider text-slate-500">{i === 0 ? 'Baseline' : `Scenario ${i}`}</div>
            <div className="font-heading font-semibold text-slate-900 mt-1">{s.name}</div>
            <div className="mt-4 space-y-2 text-[12.5px]">
              <div className="flex justify-between"><span className="text-slate-500">Beneficiaries</span><span className="font-mono font-semibold">{s.beneficiaries_cr} Cr</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Fiscal Cost</span><span className="font-mono font-semibold">₹ {s.cost_cr} Cr</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Leakage</span><span className={`font-mono font-semibold ${s.leakage_pct < 1.6 ? 'text-emerald-600' : 'text-slate-900'}`}>{s.leakage_pct}%</span></div>
            </div>
          </div>
        ))}
      </div>
      <ChartCard title="Eligible citizens by district under selected scenario" icon="Map" tall>
        <BarChartX data={data.predictions.map(p => ({ name: p.district, value: p.eligible }))} />
      </ChartCard>
    </div>
  );
};

// 87. GIS Analytics
export const GISAnalytics = () => {
  const [d, setD] = useState([]);
  useEffect(() => { api.get('/gis/state').then((r) => setD(r.data.features || [])); }, []);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Module 11 · Screen 87" id={87} title="GIS Analytics" description="Spatial view of families, coverage and vulnerability across Gujarat." icon="Map" />
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Coverage heatmap" icon="MapPin" tall className="lg:col-span-2">
          <HeatmapGrid items={d} labelKey="district" valueKey="coverage" formatValue={(v) => `${v.toFixed(0)}%`} />
        </ChartCard>
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5">
          <h3 className="font-heading font-semibold text-slate-900 mb-3">Legend & filters</h3>
          <div className="space-y-2 text-[12.5px]">
            <div className="flex justify-between"><span className="text-slate-500">Layer</span><span className="font-medium">Coverage %</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Districts</span><span className="font-medium">{d.length}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Scale</span><span className="font-medium">60% – 97%</span></div>
          </div>
          <div className="mt-4 space-y-1.5">
            {['0-25%','25-50%','50-75%','75-100%'].map((k, i) => (
              <div key={k} className="flex items-center gap-2 text-[11.5px]"><div className="w-4 h-4 rounded" style={{ background: `rgba(30,58,138,${0.2 + i * 0.25})` }} />{k}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 88. AI Insight Explorer
export const AIInsightExplorer = () => (
  <ModulePage config={{
    eyebrow: 'Module 11 · Screen 88', id: 88, title: 'AI Insight Explorer', icon: 'Lightbulb',
    description: 'Curated AI-generated insights from the last 30 days.',
    insights: [
      { tone: 'warning', text: 'Kutch district shows a 12% spike in PDS transactions above statistical norm — likely spoofed cards. Recommend audit.' },
      { tone: 'success', text: 'PMJAY enrolment in Dahod grew 18% Q-o-Q — attributed to camp-mode outreach and district officer initiative.' },
      { tone: 'info', text: '8,204 families crossed income threshold for VVY eligibility — consider proactive outreach.' },
      { tone: 'danger', text: '38 fraud rings detected across MGNREGA muster rolls with shared bank IFSC + village.' },
      { tone: 'info', text: 'Predictive: DBT payment failures likely to drop 22% next quarter after Aadhaar mapper cleanup.' },
      { tone: 'success', text: 'Golden Family confidence score median rose from 0.88 → 0.92 after Address Std v5.0 rollout.' },
    ],
  }} />
);
