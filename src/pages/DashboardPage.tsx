import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { getDashboardStats } from '@/services/dashboardService';
import { Card, StatCard, LoadingState, ErrorState, PageHeader } from '@/components/ui';
import { DistributionPieChart, CostBarChart } from '@/components/charts';
import { MODEL_INFO } from '@/config/scoringRules';
import type { DashboardStats } from '@/types';
import { FileStack, Server, Boxes, AppWindow, TrendingUp, DollarSign, Plus, ArrowRight } from 'lucide-react';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadStats() {
    setLoading(true);
    setError(null);
    const { data, error } = await getDashboardStats();
    if (error) setError(error);
    else setStats(data);
    setLoading(false);
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <DashboardLayout><LoadingState message="Loading dashboard..." /></DashboardLayout>;
  if (error) return <DashboardLayout><ErrorState message={error} onRetry={loadStats} /></DashboardLayout>;
  if (!stats) return <DashboardLayout><ErrorState message="No data available" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your cloud service model analyses"
        action={
          <Link to="/scenarios/create" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> New Scenario
          </Link>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard label="Total Scenarios" value={stats.totalScenarios} icon={<FileStack className="w-6 h-6" />} color="bg-slate-100 text-slate-700" />
        <StatCard label="IaaS Picks" value={stats.iaasRecommendations} icon={<Server className="w-6 h-6" />} color="bg-sky-100 text-sky-700" />
        <StatCard label="PaaS Picks" value={stats.paasRecommendations} icon={<Boxes className="w-6 h-6" />} color="bg-emerald-100 text-emerald-700" />
        <StatCard label="SaaS Picks" value={stats.saasRecommendations} icon={<AppWindow className="w-6 h-6" />} color="bg-amber-100 text-amber-700" />
        <StatCard label="Avg Score" value={`${stats.averageScore}/100`} icon={<TrendingUp className="w-6 h-6" />} color="bg-indigo-100 text-indigo-700" />
        <StatCard label="Avg Cost/mo" value={`$${stats.averageMonthlyCost.toLocaleString()}`} icon={<DollarSign className="w-6 h-6" />} color="bg-rose-100 text-rose-700" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Recommendation Distribution</h3>
          {stats.modelDistribution.some((d) => d.count > 0) ? (
            <DistributionPieChart data={stats.modelDistribution} />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
              No analyses yet. Run an analysis to see distribution.
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Average Cost Comparison</h3>
          {stats.costComparison.length > 0 ? (
            <CostBarChart data={stats.costComparison} />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
              No cost data yet. Run an analysis to see cost comparison.
            </div>
          )}
        </Card>
      </div>

      {/* Recent analyses */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Analyses</h3>
          <Link to="/scenarios" className="text-sm text-sky-600 hover:text-sky-700 font-medium inline-flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentAnalyses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="mb-4">No analyses yet.</p>
            <Link to="/scenarios/create" className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" /> Create your first scenario
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2.5 px-3 font-medium">Scenario</th>
                  <th className="py-2.5 px-3 font-medium">Recommended</th>
                  <th className="py-2.5 px-3 font-medium">Score</th>
                  <th className="py-2.5 px-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAnalyses.map((a) => {
                  const info = MODEL_INFO[a.recommended_model];
                  return (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-800">{a.scenario_name}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: info.color }}>
                          {info.name}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-600">{a.top_score}/100</td>
                      <td className="py-3 px-3 text-gray-400">{new Date(a.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
