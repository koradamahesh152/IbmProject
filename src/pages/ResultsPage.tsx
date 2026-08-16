import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { getAnalysisByScenarioId } from '@/services/analysisService';
import { Card, Badge, LoadingState, ErrorState, PageHeader, ScoreBar } from '@/components/ui';
import { ScoreBarChart, FactorRadarChart } from '@/components/charts';
import { MODEL_INFO, FACTOR_LABELS } from '@/config/scoringRules';
import { COST_DISCLAIMER } from '@/config/costConfig';
import type { AnalysisResult, CloudModel } from '@/types';
import { CheckCircle2, AlertTriangle, DollarSign, FileText, BarChart3, Network, Layers, Download } from 'lucide-react';

export function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    setError(null);
    const { data, error } = await getAnalysisByScenarioId(id);
    if (error) setError(error);
    else setResult(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  if (loading) return <DashboardLayout><LoadingState message="Loading analysis results..." /></DashboardLayout>;
  if (error) return <DashboardLayout><ErrorState message={error} onRetry={load} /></DashboardLayout>;
  if (!result) return <DashboardLayout><ErrorState message="No analysis found. Run an analysis first." /></DashboardLayout>;

  const { analysis, scenario, costEstimates } = result;
  const recInfo = MODEL_INFO[analysis.recommended_model];
  const scores = (['iaas', 'paas', 'saas'] as CloudModel[]).map((m) => ({
    model: m,
    score: m === 'iaas' ? analysis.iaas_score : m === 'paas' ? analysis.paas_score : analysis.saas_score,
  }));

  return (
    <DashboardLayout>
      <PageHeader
        title="Analysis Results"
        subtitle={scenario.name}
        action={
          <Link to={`/scenarios/${scenario.id}/report`} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> View Report
          </Link>
        }
      />

      {/* Recommendation banner */}
      <Card className="p-6 mb-6 border-2" style={{ borderColor: recInfo.color }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Recommended Cloud Service Model</p>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-bold" style={{ color: recInfo.color }}>{recInfo.name}</h2>
              <Badge color={analysis.confidence === 'High' ? 'green' : analysis.confidence === 'Moderate' ? 'amber' : 'red'}>
                {analysis.confidence} Confidence
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">{recInfo.fullName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Score Gap</p>
            <p className="text-2xl font-bold text-gray-800">{analysis.confidence_difference} pts</p>
            <p className="text-xs text-gray-400">top vs runner-up</p>
          </div>
        </div>
      </Card>

      {/* Model scores */}
      <Card className="p-5 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Model Suitability Scores</h3>
        <ScoreBarChart scores={scores} />
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {scores.map((s) => {
            const info = MODEL_INFO[s.model];
            const isRec = analysis.recommended_model === s.model;
            return (
              <div key={s.model} className={`p-4 rounded-lg border ${isRec ? 'border-slate-800 bg-slate-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{info.name}</span>
                  {isRec && <Badge color="green">Recommended</Badge>}
                </div>
                <p className="text-2xl font-bold mb-2" style={{ color: info.color }}>{s.score}<span className="text-sm text-gray-400">/100</span></p>
                <ScoreBar score={s.score} color={info.color} />
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3 italic">
          This confidence indicator is an analytical measure, not a statistical probability.
        </p>
      </Card>

      {/* Why + Trade-offs */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-800">Why {recInfo.name}?</h3>
          </div>
          <ul className="space-y-2">
            {analysis.reasons.map((r, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-2">Advantages:</p>
            <ul className="space-y-1.5">
              {analysis.advantages.map((a, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">+</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-gray-800">Trade-offs</h3>
          </div>
          <ul className="space-y-2">
            {analysis.tradeoffs.map((t, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Cost summary */}
      <Card className="p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-slate-700" />
          <h3 className="font-semibold text-gray-800">Cost Comparison Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="py-2.5 px-3 font-medium">Model</th>
                <th className="py-2.5 px-3 font-medium text-right">Monthly</th>
                <th className="py-2.5 px-3 font-medium text-right">Annual</th>
                <th className="py-2.5 px-3 font-medium text-right">3-Year TCO</th>
              </tr>
            </thead>
            <tbody>
              {(['iaas', 'paas', 'saas'] as CloudModel[]).map((m) => {
                const ce = costEstimates.find((c) => c.model === m);
                if (!ce) return null;
                const info = MODEL_INFO[m];
                return (
                  <tr key={m} className="border-b border-gray-100">
                    <td className="py-3 px-3 font-medium" style={{ color: info.color }}>{info.name}</td>
                    <td className="py-3 px-3 text-right text-gray-700">${ce.monthly_cost.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-gray-700">${ce.annual_cost.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-semibold text-gray-800">${ce.three_year_tco.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-amber-600 mt-3 italic">{COST_DISCLAIMER}</p>
        <div className="mt-3">
          <Link to={`/scenarios/${scenario.id}/cost`} className="text-sm text-sky-600 hover:text-sky-700 font-medium">View detailed cost analysis →</Link>
        </div>
      </Card>

      {/* Factor radar */}
      <Card className="p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-slate-700" />
          <h3 className="font-semibold text-gray-800">Factor-by-Factor Comparison</h3>
        </div>
        <FactorRadarChart factorScores={analysis.factor_scores} />
      </Card>

      {/* Navigation links */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to={`/scenarios/${scenario.id}/technical`}>
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Network className="w-6 h-6 text-slate-600 mb-2" />
            <p className="font-medium text-gray-800 text-sm">Technical Comparison</p>
            <p className="text-xs text-gray-400">Control, scalability, security...</p>
          </Card>
        </Link>
        <Link to={`/scenarios/${scenario.id}/models`}>
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Layers className="w-6 h-6 text-slate-600 mb-2" />
            <p className="font-medium text-gray-800 text-sm">Model Comparison</p>
            <p className="text-xs text-gray-400">Side-by-side IaaS vs PaaS vs SaaS</p>
          </Card>
        </Link>
        <Link to={`/scenarios/${scenario.id}/report`}>
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <FileText className="w-6 h-6 text-slate-600 mb-2" />
            <p className="font-medium text-gray-800 text-sm">Decision Report</p>
            <p className="text-xs text-gray-400">Download full report</p>
          </Card>
        </Link>
      </div>
    </DashboardLayout>
  );
}
