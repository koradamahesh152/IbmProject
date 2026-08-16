// Backend Decision Engine — JS reference implementation
// Mirrors src/services/decisionEngine.ts
import { SCORING_RULES, CATEGORY_WEIGHTS, FACTOR_CATEGORIES, FACTOR_WEIGHTS, CONFIDENCE_THRESHOLDS } from '../config/scoringRules.js';

const SCENARIO_FACTOR_MAP = {
  infrastructureControl: 'infrastructureControl',
  customization: 'customization',
  scalability: 'scalability',
  performance: 'performance',
  security: 'security',
  integration: 'integration',
  technicalExpertise: 'technicalExpertise',
  managementPreference: 'managementPreference',
  maintenanceTolerance: 'maintenanceTolerance',
  deploymentSpeed: 'deploymentSpeed',
  budget: 'budget',
  costSensitivity: 'costSensitivity',
  timeToMarket: 'timeToMarket',
  flexibility: 'flexibility',
  vendorLockInTolerance: 'vendorLockInTolerance',
};

export function runDecisionEngine(scenario) {
  const factorScores = [];
  const categoryScores = { iaas: 0, paas: 0, saas: 0 };

  for (const [scenarioField, ruleKey] of Object.entries(SCENARIO_FACTOR_MAP)) {
    const level = scenario[scenarioField] || 'Medium';
    const rule = SCORING_RULES[ruleKey];
    const levelScore = rule[level] || rule['Medium'];
    const category = FACTOR_CATEGORIES[ruleKey];
    const fw = FACTOR_WEIGHTS[ruleKey];
    const cw = CATEGORY_WEIGHTS[category];

    categoryScores.iaas += levelScore.iaas * fw * cw;
    categoryScores.paas += levelScore.paas * fw * cw;
    categoryScores.saas += levelScore.saas * fw * cw;

    factorScores.push({ factor: ruleKey, category, weight: fw * cw, iaasScore: levelScore.iaas, paasScore: levelScore.paas, saasScore: levelScore.saas });
  }

  const iaasScore = Math.round(categoryScores.iaas * 20);
  const paasScore = Math.round(categoryScores.paas * 20);
  const saasScore = Math.round(categoryScores.saas * 20);

  const scores = [{ model: 'iaas', score: iaasScore }, { model: 'paas', score: paasScore }, { model: 'saas', score: saasScore }];
  scores.sort((a, b) => b.score - a.score);

  const ranking = scores.map(s => s.model);
  const recommendedModel = scores[0].model;
  const confidenceDifference = scores[0].score - scores[1].score;

  let confidence;
  if (confidenceDifference >= CONFIDENCE_THRESHOLDS.high) confidence = 'High';
  else if (confidenceDifference >= CONFIDENCE_THRESHOLDS.moderate) confidence = 'Moderate';
  else confidence = 'Low';

  return { iaasScore, paasScore, saasScore, ranking, recommendedModel, confidence, confidenceDifference, factorScores };
}
