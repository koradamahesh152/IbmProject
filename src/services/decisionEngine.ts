// ============================================================
// Decision Engine — Weighted Scoring for IaaS / PaaS / SaaS
// ============================================================
// This is the core intelligence of the application. It takes a
// scenario's requirements and produces suitability scores for
// each cloud service model using a weighted multi-factor model.
//
// Scoring system: 1-5 per factor, normalized to 0-100.
// Categories: Technical (40%), Operational (25%), Financial (20%), Business (15%)
// ============================================================

import type {
  Scenario,
  DecisionResult,
  FactorScore,
  CloudModel,
  ConfidenceLevel,
} from '@/types';
import {
  SCORING_RULES,
  CATEGORY_WEIGHTS,
  FACTOR_CATEGORIES,
  FACTOR_WEIGHTS,
  CONFIDENCE_THRESHOLDS,
} from '@/config/scoringRules';

// Map scenario field names to scoring rule keys
const SCENARIO_FACTOR_MAP: Record<string, keyof typeof SCORING_RULES> = {
  infrastructure_control: 'infrastructureControl',
  customization: 'customization',
  scalability: 'scalability',
  performance: 'performance',
  security: 'security',
  integration: 'integration',
  technical_expertise: 'technicalExpertise',
  management_preference: 'managementPreference',
  maintenance_tolerance: 'maintenanceTolerance',
  deployment_speed: 'deploymentSpeed',
  budget: 'budget',
  cost_sensitivity: 'costSensitivity',
  time_to_market: 'timeToMarket',
  flexibility: 'flexibility',
  vendor_lockin_tolerance: 'vendorLockInTolerance',
};

export function runDecisionEngine(scenario: Scenario): DecisionResult {
  const factorScores: FactorScore[] = [];

  // Category accumulators
  const categoryScores: Record<CloudModel, number> = {
    iaas: 0,
    paas: 0,
    saas: 0,
  };

  // Process each factor
  for (const [scenarioField, ruleKey] of Object.entries(SCENARIO_FACTOR_MAP)) {
    const level = scenario[scenarioField as keyof Scenario] as string;
    const rule = SCORING_RULES[ruleKey];
    const levelScore = rule[level as keyof typeof rule] ?? rule['Medium'];

    const category = FACTOR_CATEGORIES[ruleKey];
    const factorWeight = FACTOR_WEIGHTS[ruleKey];
    const categoryWeight = CATEGORY_WEIGHTS[category];

    const weightedIaas = levelScore.iaas * factorWeight * categoryWeight;
    const weightedPaas = levelScore.paas * factorWeight * categoryWeight;
    const weightedSaas = levelScore.saas * factorWeight * categoryWeight;

    categoryScores.iaas += weightedIaas;
    categoryScores.paas += weightedPaas;
    categoryScores.saas += weightedSaas;

    factorScores.push({
      factor: ruleKey,
      category,
      weight: factorWeight * categoryWeight,
      iaasScore: levelScore.iaas,
      paasScore: levelScore.paas,
      saasScore: levelScore.saas,
    });
  }

  // Normalize to 0-100 scale
  // Max possible score per model = sum of all (5 * factorWeight * categoryWeight) = 5
  // So multiply by 20 to get 0-100
  const iaasScore = Math.round(categoryScores.iaas * 20);
  const paasScore = Math.round(categoryScores.paas * 20);
  const saasScore = Math.round(categoryScores.saas * 20);

  // Build ranking
  const scores: Array<{ model: CloudModel; score: number }> = [
    { model: 'iaas', score: iaasScore },
    { model: 'paas', score: paasScore },
    { model: 'saas', score: saasScore },
  ];
  scores.sort((a, b) => b.score - a.score);

  const ranking = scores.map((s) => s.model);
  const recommendedModel = scores[0].model;
  const confidenceDifference = scores[0].score - scores[1].score;

  let confidence: ConfidenceLevel;
  if (confidenceDifference >= CONFIDENCE_THRESHOLDS.high) {
    confidence = 'High';
  } else if (confidenceDifference >= CONFIDENCE_THRESHOLDS.moderate) {
    confidence = 'Moderate';
  } else {
    confidence = 'Low';
  }

  return {
    iaasScore,
    paasScore,
    saasScore,
    ranking,
    recommendedModel,
    confidence,
    confidenceDifference,
    factorScores,
  };
}

export function getModelScore(model: CloudModel, result: DecisionResult): number {
  switch (model) {
    case 'iaas':
      return result.iaasScore;
    case 'paas':
      return result.paasScore;
    case 'saas':
      return result.saasScore;
  }
}
