// ============================================================
// Explanation Engine — Generates human-readable analysis
// ============================================================
// Takes the decision result and scenario, produces reasons,
// advantages, and trade-offs for the recommended model.
// ============================================================

import type { Scenario, DecisionResult, ExplanationResult, CloudModel } from '@/types';
import { FACTOR_LABELS } from '@/config/scoringRules';

const MODEL_FULL_NAMES: Record<CloudModel, string> = {
  iaas: 'IaaS (Infrastructure as a Service)',
  paas: 'PaaS (Platform as a Service)',
  saas: 'SaaS (Software as a Service)',
};

const MODEL_DESCRIPTIONS: Record<CloudModel, string> = {
  iaas: 'renting virtual machines, storage, and networking while managing the OS, runtime, and application yourself',
  paas: 'renting a managed platform where you deploy your application code while the provider manages the runtime, OS, and infrastructure',
  saas: 'using ready-made software delivered over the internet where the provider manages the entire stack',
};

function getTopFactors(result: DecisionResult, model: CloudModel, count: number): string[] {
  const modelKey = `${model}Score` as keyof typeof result.factorScores[0];
  return [...result.factorScores]
    .sort((a, b) => (b[modelKey] as number) - (a[modelKey] as number))
    .slice(0, count)
    .map((f) => f.factor);
}

export function generateExplanation(
  scenario: Scenario,
  result: DecisionResult
): ExplanationResult {
  const model = result.recommendedModel;
  const topFactors = getTopFactors(result, model, 4);
  const reasons: string[] = [];
  const advantages: string[] = [];
  const tradeoffs: string[] = [];

  // Generate reasons
  reasons.push(
    `Based on the weighted analysis of ${result.factorScores.length} factors across technical, operational, financial, and business categories, ${MODEL_FULL_NAMES[model]} scored ${getModelScore(model, result)}/100, the highest among all three cloud service models.`
  );

  reasons.push(
    `The organization's requirements align with ${MODEL_DESCRIPTIONS[model]}.`
  );

  for (const factor of topFactors) {
    const label = FACTOR_LABELS[factor] || factor;
    const level = getScenarioLevel(scenario, factor);
    reasons.push(`${label} is ${level}, which strongly favors ${model.toUpperCase()}.`);
  }

  // Generate advantages
  const advantageMap: Record<CloudModel, string[]> = {
    iaas: [
      'Maximum control over infrastructure, OS, and runtime',
      'Highly customizable — you can configure everything',
      'No vendor lock-in — portable workloads',
      'Direct control over security and compliance',
      'Suitable for complex networking and firewall requirements',
    ],
    paas: [
      'Reduced infrastructure management — focus on application code',
      'Faster deployment and time to market',
      'Built-in scalability and load balancing',
      'Managed database and runtime services',
      'Lower operational overhead than IaaS',
    ],
    saas: [
      'Fastest deployment — ready-made software',
      'No infrastructure or platform management',
      'Predictable subscription-based pricing',
      'Provider handles maintenance, updates, and security patches',
      'Lowest technical expertise requirement',
    ],
  };
  advantages.push(...advantageMap[model]);

  // Generate trade-offs
  const tradeoffMap: Record<CloudModel, string[]> = {
    iaas: [
      'Requires significant technical expertise and ops team',
      'Higher management and maintenance overhead',
      'Slower deployment compared to PaaS and SaaS',
      'You are responsible for OS patching, security, and backups',
      'Higher initial setup cost and complexity',
    ],
    paas: [
      'Less infrastructure control than IaaS',
      'Potential vendor lock-in through platform-specific APIs',
      'Platform-specific limitations on runtime and framework choices',
      'May be more expensive than IaaS for predictable, steady workloads',
      'Limited control over OS-level configuration',
    ],
    saas: [
      'Least customization — limited to provider configuration options',
      'Highest vendor lock-in risk',
      'Data resides in the provider system — limited data portability',
      'Recurring subscription costs can be high at scale',
      'Dependent on provider for feature roadmap and SLAs',
    ],
  };
  tradeoffs.push(...tradeoffMap[model]);

  // Add confidence-based reason
  if (result.confidence === 'High') {
    reasons.push(
      `Confidence is High (score gap of ${result.confidenceDifference} points between top and second model), indicating a clear preference for ${model.toUpperCase()} based on the given requirements.`
    );
  } else if (result.confidence === 'Moderate') {
    reasons.push(
      `Confidence is Moderate (score gap of ${result.confidenceDifference} points), suggesting ${model.toUpperCase()} is a good fit but the runner-up model is also viable depending on priorities.`
    );
  } else {
    reasons.push(
      `Confidence is Low (score gap of only ${result.confidenceDifference} points), meaning the models are closely matched. The recommendation should be reviewed alongside organizational priorities.`
    );
  }

  return { reasons, advantages, tradeoffs };
}

function getModelScore(model: CloudModel, result: DecisionResult): number {
  if (model === 'iaas') return result.iaasScore;
  if (model === 'paas') return result.paasScore;
  return result.saasScore;
}

function getScenarioLevel(scenario: Scenario, factor: string): string {
  const fieldMap: Record<string, keyof Scenario> = {
    infrastructureControl: 'infrastructure_control',
    customization: 'customization',
    scalability: 'scalability',
    performance: 'performance',
    security: 'security',
    integration: 'integration',
    technicalExpertise: 'technical_expertise',
    managementPreference: 'management_preference',
    maintenanceTolerance: 'maintenance_tolerance',
    deploymentSpeed: 'deployment_speed',
    budget: 'budget',
    costSensitivity: 'cost_sensitivity',
    timeToMarket: 'time_to_market',
    flexibility: 'flexibility',
    vendorLockInTolerance: 'vendor_lockin_tolerance',
  };
  const field = fieldMap[factor];
  if (field) {
    return String(scenario[field]);
  }
  return 'Medium';
}
