import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { getScenarioById, deleteScenario } from '@/services/scenarioService';
import { getAnalysisByScenarioId, runAnalysis } from '@/services/analysisService';
import { Card, Badge, LoadingState, ErrorState, PageHeader, ScoreBar } from '@/components/ui';
import { MODEL_INFO, FACTOR_LABELS } from '@/config/scoringRules';
import type { Scenario, AnalysisResult } from '@/types';
import { Trash2, Play, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export function ScenarioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    if (!id) return;
    setLoading(true);
    setError(null);
    const { data: sc, error: e1 } = await getScenarioById(id);
    if (e1 || !sc) { setError(e1 || 'Not found'); setLoading(false); return; }
    setScenario(sc);
    const { data: an, error: e2 } = await getAnalysisByScenarioId(id);
    if (!e2 && an) setAnalysis(an);
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function handleRunAnalysis() {
    if (!scenario) return;
    setRunning(true);
    const { data, error: e } = await runAnalysis(scenario);
    if (e) { setError(e); setRunning(false); return; }
    setAnalysis(data);
    setRunning(false);
    navigate(`/scenarios/${scenario.id}/results`);
  }

  async function handleDelete() {
    if (!scenario || !id) return;
    if (!confirm(`Delete "${scenario.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    const { error: e } = await deleteScenario(id);
    if (e) { setError(e); setDeleting(false); return; }
    navigate('/scenarios');
  }

  if (loading) return <DashboardLayout><LoadingState message="Loading scenario..." /></DashboardLayout>;
  if (error) return <DashboardLayout><ErrorState message={error} onRetry={load} /></DashboardLayout>;
  if (!scenario) return <DashboardLayout><ErrorState message="Scenario not found" /></DashboardLayout>;

  const reqFields = [
    { label: 'Infrastructure Control', value: scenario.infrastructure_control },
    { label: 'Customization', value: scenario.customization },
    { label: 'Scalability', value: scenario.scalability },
    { label: 'Performance', value: scenario.performance },
    { label: 'Security', value: scenario.security },
    { label: 'Integration', value: scenario.integration },
    { label: 'Technical Expertise', value: scenario.technical_expertise },
    { label: 'Mgmt Preference', value: scenario.management_preference },
    { label: 'Maintenance Tolerance', value: scenario.maintenance_tolerance },
    { label: 'Deployment Speed', value: scenario.deployment_speed },
    { label: 'Budget', value: scenario.budget },
    { label: 'Cost Sensitivity', value: scenario.cost_sensitivity },
    { label: 'Time to Market', value: scenario.time_to_market },
    { label: 'Flexibility', value: scenario.flexibility },
    { label: 'Vendor Lock-in Tol.', value: scenario.vendor_lockin_tolerance },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title={scenario.name}
        subtitle={`${scenario.organization_name} — ${scenario.industry}`}
        action={
          <div className="flex gap-2">
            <button onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-1.5 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button onClick={handleRunAnalysis} disabled={running} className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Running...</> : <><Play className="w-4 h-4" /> Run Analysis</>}
            </button>
          </div>
        }
      />

      {scenario.description && (
        <Card className="p-4 mb-6">
          <p className="text-sm text-gray-600">{scenario.description}</p>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Application Profile</h3>
          <div className="space-y-2 text-sm">
            <Row label="Application Type" value={scenario.application_type} />
            <Row label="Users" value={scenario.user_count.toLocaleString()} />
            <Row label="Traffic" value={scenario.traffic_level} />
            <Row label="Complexity" value={scenario.complexity} />
            <Row label="Usage Pattern" value={scenario.usage_pattern} />
            <Row label="Pricing Preference" value={scenario.pricing_preference} />
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Requirement Levels</h3>
          <div className="grid grid-cols-2 gap-2">
            {reqFields.map((f) => (
              <div key={f.label} className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{f.label}</span>
                <Badge color={levelColor(f.value)}>{f.value}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {analysis ? (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Latest Analysis</h3>
            <Link to={`/scenarios/${scenario.id}/results`} className="text-sm text-sky-600 hover:text-sky-700 font-medium inline-flex items-center gap-1">
              Full Results <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {(['iaas', 'paas', 'saas'] as const).map((m) => {
              const score = m === 'iaas' ? analysis.analysis.iaas_score : m === 'paas' ? analysis.analysis.paas_score : analysis.analysis.saas_score;
              const info = MODEL_INFO[m];
              const isRec = analysis.analysis.recommended_model === m;
              return (
                <div key={m} className={`p-4 rounded-lg border-2 ${isRec ? 'border-slate-800 bg-slate-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{info.name}</span>
                    {isRec && <Badge color="green">Recommended</Badge>}
                  </div>
                  <p className="text-3xl font-bold mb-2" style={{ color: info.color }}>{score}<span className="text-base text-gray-400">/100</span></p>
                  <ScoreBar score={score} color={info.color} />
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-gray-500">Confidence: <span className="font-medium text-gray-800">{analysis.analysis.confidence}</span></span>
            <span className="text-gray-500">Gap: <span className="font-medium text-gray-800">{analysis.analysis.confidence_difference} pts</span></span>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No analysis has been run for this scenario yet.</p>
          <button onClick={handleRunAnalysis} disabled={running} className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Running...</> : <><Play className="w-4 h-4" /> Run Analysis Now</>}
          </button>
        </Card>
      )}
    </DashboardLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><span className="text-gray-500">{label}</span><span className="font-medium text-gray-800">{value}</span></div>;
}

function levelColor(level: string) {
  const map: Record<string, 'blue' | 'green' | 'amber' | 'red' | 'slate'> = {
    'Very Low': 'red', 'Low': 'amber', 'Medium': 'slate', 'High': 'blue', 'Very High': 'green',
  };
  return map[level] || 'slate';
}
