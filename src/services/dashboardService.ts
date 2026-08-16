// ============================================================
// Dashboard Service — Aggregated statistics for the dashboard
// ============================================================

import { supabase } from '@/lib/supabase';
import type { DashboardStats } from '@/types';

export async function getDashboardStats(): Promise<{ data: DashboardStats | null; error: string | null }> {
  try {
    // Get scenarios count
    const { count: scenarioCount } = await supabase
      .from('scenarios')
      .select('*', { count: 'exact', head: true });

    // Get all analyses
    const { data: analyses, error: analysesError } = await supabase
      .from('analyses')
      .select(`
        id,
        recommended_model,
        iaas_score,
        paas_score,
        saas_score,
        created_at,
        scenarios!inner(name)
      `)
      .order('created_at', { ascending: false });

    if (analysesError) throw new Error(analysesError.message);

    const analysisList = analyses || [];

    // Count recommendations
    const iaasCount = analysisList.filter((a: any) => a.recommended_model === 'iaas').length;
    const paasCount = analysisList.filter((a: any) => a.recommended_model === 'paas').length;
    const saasCount = analysisList.filter((a: any) => a.recommended_model === 'saas').length;

    // Average top score
    const avgScore = analysisList.length > 0
      ? Math.round(
          analysisList.reduce((sum: number, a: any) => {
            const top = Math.max(a.iaas_score, a.paas_score, a.saas_score);
            return sum + top;
          }, 0) / analysisList.length
        )
      : 0;

    // Get cost estimates for all analyses
    const analysisIds = analysisList.map((a: any) => a.id);
    let avgMonthlyCost = 0;

    if (analysisIds.length > 0) {
      const { data: costs } = await supabase
        .from('cost_estimates')
        .select('monthly_cost, analysis_id')
        .in('analysis_id', analysisIds);

      if (costs && costs.length > 0) {
        // Average of recommended model's monthly cost per analysis
        const costByAnalysis: Record<string, number[]> = {};
        costs.forEach((c: any) => {
          if (!costByAnalysis[c.analysis_id]) costByAnalysis[c.analysis_id] = [];
          costByAnalysis[c.analysis_id].push(c.monthly_cost);
        });
        const avgCosts = Object.values(costByAnalysis).map((costs) => {
          const sum = costs.reduce((s, c) => s + c, 0);
          return sum / costs.length;
        });
        avgMonthlyCost = Math.round(avgCosts.reduce((s, c) => s + c, 0) / avgCosts.length);
      }
    }

    // Recent analyses
    const recentAnalyses = analysisList.slice(0, 5).map((a: any) => ({
      id: a.id,
      scenario_name: a.scenarios?.name || 'Unknown',
      recommended_model: a.recommended_model,
      top_score: Math.max(a.iaas_score, a.paas_score, a.saas_score),
      created_at: a.created_at,
    }));

    // Model distribution
    const modelDistribution = [
      { model: 'IaaS', count: iaasCount },
      { model: 'PaaS', count: paasCount },
      { model: 'SaaS', count: saasCount },
    ];

    // Cost comparison (average across all analyses)
    let costComparison: Array<{ model: string; monthly: number; annual: number; tco: number }> = [];
    if (analysisIds.length > 0) {
      const { data: allCosts } = await supabase
        .from('cost_estimates')
        .select('model, monthly_cost, annual_cost, three_year_tco')
        .in('analysis_id', analysisIds);

      if (allCosts && allCosts.length > 0) {
        const byModel: Record<string, { monthly: number[]; annual: number[]; tco: number[] }> = {
          iaas: { monthly: [], annual: [], tco: [] },
          paas: { monthly: [], annual: [], tco: [] },
          saas: { monthly: [], annual: [], tco: [] },
        };
        allCosts.forEach((c: any) => {
          byModel[c.model]?.monthly.push(c.monthly_cost);
          byModel[c.model]?.annual.push(c.annual_cost);
          byModel[c.model]?.tco.push(c.three_year_tco);
        });
        costComparison = ['iaas', 'paas', 'saas'].map((m) => {
          const d = byModel[m];
          const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0);
          return {
            model: m.toUpperCase(),
            monthly: avg(d.monthly),
            annual: avg(d.annual),
            tco: avg(d.tco),
          };
        });
      }
    }

    return {
      data: {
        totalScenarios: scenarioCount || 0,
        iaasRecommendations: iaasCount,
        paasRecommendations: paasCount,
        saasRecommendations: saasCount,
        averageScore: avgScore,
        averageMonthlyCost: avgMonthlyCost,
        recentAnalyses,
        modelDistribution,
        costComparison,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load dashboard stats';
    return { data: null, error: message };
  }
}
