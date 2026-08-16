// ============================================================
// Analysis Service — Runs decision engine, cost engine, saves results
// ============================================================

import { supabase } from '@/lib/supabase';
import type { Scenario, Analysis, CostEstimate, AnalysisResult } from '@/types';
import { runDecisionEngine } from './decisionEngine';
import { runCostEngine } from './costEngine';
import { generateExplanation } from './explanationEngine';
import { logAudit } from './auditService';
import { FACTOR_LABELS } from '@/config/scoringRules';

export async function runAnalysis(scenario: Scenario): Promise<{ data: AnalysisResult | null; error: string | null }> {
  try {
    // 1. Run decision engine
    const decision = runDecisionEngine(scenario);

    // 2. Run cost engine
    const costs = runCostEngine(scenario);

    // 3. Generate explanation
    const explanation = generateExplanation(scenario, decision);

    // 4. Save analysis to database
    const analysisInsert = {
      scenario_id: scenario.id,
      recommended_model: decision.recommendedModel,
      iaas_score: decision.iaasScore,
      paas_score: decision.paasScore,
      saas_score: decision.saasScore,
      ranking: decision.ranking,
      confidence: decision.confidence,
      confidence_difference: decision.confidenceDifference,
      reasons: explanation.reasons,
      advantages: explanation.advantages,
      tradeoffs: explanation.tradeoffs,
      factor_scores: decision.factorScores.map((f) => ({
        ...f,
        label: FACTOR_LABELS[f.factor] || f.factor,
      })),
    };

    const { data: analysisData, error: analysisError } = await supabase
      .from('analyses')
      .insert(analysisInsert)
      .select()
      .single();

    if (analysisError) throw new Error(analysisError.message);

    const analysis = analysisData as Analysis;

    // 5. Save cost estimates
    const costInserts = costs.map((c) => ({
      analysis_id: analysis.id,
      model: c.model,
      monthly_cost: c.monthlyCost,
      annual_cost: c.annualCost,
      three_year_tco: c.threeYearTCO,
      initial_cost: c.initialCost,
      assumptions: c.assumptions,
    }));

    const { data: costData, error: costError } = await supabase
      .from('cost_estimates')
      .insert(costInserts)
      .select();

    if (costError) throw new Error(costError.message);

    // 6. Log audit
    await logAudit('run_analysis', 'analysis', analysis.id, {
      scenario: scenario.name,
      recommendation: decision.recommendedModel,
    });

    return {
      data: {
        analysis,
        scenario,
        costEstimates: costData as CostEstimate[],
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error running analysis';
    return { data: null, error: message };
  }
}

export async function getAnalysisByScenarioId(scenarioId: string): Promise<{ data: AnalysisResult | null; error: string | null }> {
  // Get scenario
  const { data: scenarioData, error: scenarioError } = await supabase
    .from('scenarios')
    .select('*')
    .eq('id', scenarioId)
    .maybeSingle();

  if (scenarioError) return { data: null, error: scenarioError.message };
  if (!scenarioData) return { data: null, error: 'Scenario not found' };

  // Get latest analysis
  const { data: analysisData, error: analysisError } = await supabase
    .from('analyses')
    .select('*')
    .eq('scenario_id', scenarioId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (analysisError) return { data: null, error: analysisError.message };
  if (!analysisData) return { data: null, error: 'No analysis found for this scenario' };

  // Get cost estimates
  const { data: costData, error: costError } = await supabase
    .from('cost_estimates')
    .select('*')
    .eq('analysis_id', (analysisData as Analysis).id);

  if (costError) return { data: null, error: costError.message };

  return {
    data: {
      analysis: analysisData as Analysis,
      scenario: scenarioData as Scenario,
      costEstimates: costData as CostEstimate[],
    },
    error: null,
  };
}

export async function getAllAnalyses(): Promise<{ data: Array<Analysis & { scenario_name: string }> | null; error: string | null }> {
  const { data, error } = await supabase
    .from('analyses')
    .select(`
      *,
      scenarios!inner(name)
    `)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error: error.message };

  const mapped = (data as any[]).map((a) => ({
    ...a,
    scenario_name: a.scenarios?.name || 'Unknown',
  }));

  return { data: mapped, error: null };
}
