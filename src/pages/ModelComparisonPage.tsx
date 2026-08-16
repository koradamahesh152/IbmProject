import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { getAnalysisByScenarioId } from '@/services/analysisService';
import { Card, LoadingState, ErrorState, PageHeader, ScoreBar, Badge } from '@/components/ui';
import { MODEL_INFO, FACTOR_LABELS } from '@/config/scoringRules';
import type { AnalysisResult, CloudModel } from '@/types';
import { ArrowLeft, Trophy } from 'lucide-react';

export function ModelComparisonPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    const { data, error } = await getAnalysisByScenarioId(id);
    if (error) setError(error);
    else setResult(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  if (loading) return <DashboardLayout><LoadingState /></DashboardLayout>;
  if (error) return <DashboardLayout><ErrorState message={error} onRetry={load} /></DashboardLayout>;
  if (!result) return <DashboardLayout><ErrorState message="No analysis found." /></DashboardLayout>;

  const { analysis, scenario } = result;
  const models: CloudModel[] = ['iaas', 'paas', 'saas'];

  return (
    <DashboardLayout>
      <PageHeader title="Model Comparison" subtitle={`Side-by-side comparison for ${scenario.name}`} action={<Link to={`/scenarios/${scenario.id}/results`} className="inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium"><ArrowLeft className="w-4 h-4" /> Back</Link>} />

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {models.map((m) => {
          const info = MODEL_INFO[m];
          const score = m === 'iaas' ? analysis.iaas_score : m === 'paas' ? analysis.paas_score : analysis.saas_score;
          const isRec = analysis.recommended_model === m;
          const rank = analysis.ranking.indexOf(m) + 1;
          return (
            <Card key={m} className={`p-5 ${isRec ? 'border-2 border-slate-800' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: info.color }}>{info.name}</h3>
                  <p className="text-xs text-gray-400">{info.fullName}</p>
                </div>
                {isRec ? <Badge color="green"><Trophy className="w-3 h-3 inline mr-1" />Recommended</Badge> : <Badge color="slate">Rank #{rank}</Badge>}
              </div>
              <div className="mb-3">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold" style={{ color: info.color }}>{score}</span>
                  <span className="text-sm text-gray-400">/100</span>
                </div>
                <ScoreBar score={score} color={info.color} />
              </div>
              <div className="space-y-1.5 pt-3 border-t border-gray-100">
                {analysis.factor_scores.map((fs) => {
                  const modelScore = m === 'iaas' ? fs.iaasScore : m === 'paas' ? fs.paasScore : fs.saasScore;
                  const label = FACTOR_LABELS[fs.factor] || fs.factor;
                  return (
                    <div key={fs.factor} className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-gray-700">{modelScore}/5</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Ranking</h3>
        <div className="space-y-3">
          {analysis.ranking.map((m, i) => {
            const info = MODEL_INFO[m];
            const score = m === 'iaas' ? analysis.iaas_score : m === 'paas' ? analysis.paas_score : analysis.saas_score;
            return (
              <div key={m} className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-gray-600">{i + 1}</span>
                <span className="font-semibold text-gray-800 w-16">{info.name}</span>
                <div className="flex-1"><ScoreBar score={score} color={info.color} /></div>
                <span className="font-bold text-gray-800 w-12 text-right">{score}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </DashboardLayout>
  );
}
