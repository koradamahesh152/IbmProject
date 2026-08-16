import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { getAnalysisByScenarioId } from '@/services/analysisService';
import { Card, LoadingState, ErrorState, PageHeader } from '@/components/ui';
import { CostBarChart, TCOLineChart } from '@/components/charts';
import { MODEL_INFO } from '@/config/scoringRules';
import { COST_DISCLAIMER } from '@/config/costConfig';
import type { AnalysisResult, CloudModel } from '@/types';
import { DollarSign, ArrowLeft } from 'lucide-react';

export function CostComparisonPage() {
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

  const { costEstimates, scenario } = result;

  const chartData = (['iaas', 'paas', 'saas'] as CloudModel[]).map((m) => {
    const ce = costEstimates.find((c) => c.model === m);
    return {
      model: MODEL_INFO[m].name,
      monthly: ce?.monthly_cost || 0,
      annual: ce?.annual_cost || 0,
      tco: ce?.three_year_tco || 0,
    };
  });

  const iaasMonthly = costEstimates.find((c) => c.model === 'iaas')?.monthly_cost || 0;
  const paasMonthly = costEstimates.find((c) => c.model === 'paas')?.monthly_cost || 0;
  const saasMonthly = costEstimates.find((c) => c.model === 'saas')?.monthly_cost || 0;

  return (
    <DashboardLayout>
      <PageHeader title="Cost Comparison" subtitle={scenario.name} action={<Link to={`/scenarios/${scenario.id}/results`} className="inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium"><ArrowLeft className="w-4 h-4" /> Back to Results</Link>} />

      <Card className="p-5 mb-6">
        <div className="flex items-center gap-2 mb-4"><DollarSign className="w-5 h-5 text-slate-700" /><h3 className="font-semibold text-gray-800">Cost Breakdown by Model</h3></div>
        <CostBarChart data={chartData} />
      </Card>

      <Card className="p-5 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">3-Year TCO Projection (Cumulative Monthly Cost)</h3>
        <TCOLineChart iaas={iaasMonthly} paas={paasMonthly} saas={saasMonthly} />
      </Card>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {(['iaas', 'paas', 'saas'] as CloudModel[]).map((m) => {
          const ce = costEstimates.find((c) => c.model === m);
          if (!ce) return null;
          const info = MODEL_INFO[m];
          return (
            <Card key={m} className="p-5">
              <h4 className="font-semibold mb-3" style={{ color: info.color }}>{info.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Initial Cost</span><span className="font-medium">${ce.initial_cost.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Monthly</span><span className="font-medium">${ce.monthly_cost.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Annual</span><span className="font-medium">${ce.annual_cost.toLocaleString()}</span></div>
                <div className="flex justify-between border-t border-gray-100 pt-2"><span className="text-gray-700 font-medium">3-Year TCO</span><span className="font-bold text-gray-800">${ce.three_year_tco.toLocaleString()}</span></div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">Assumptions:</p>
                <ul className="space-y-1">
                  {ce.assumptions.map((a, i) => <li key={i} className="text-xs text-gray-400 flex items-start gap-1"><span>•</span><span>{a}</span></li>)}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-700 italic">{COST_DISCLAIMER}</p>
      </div>
    </DashboardLayout>
  );
}
