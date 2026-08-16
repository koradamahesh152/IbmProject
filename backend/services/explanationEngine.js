// Backend Explanation Engine — JS reference implementation
import { FACTOR_LABELS } from '../config/scoringRules.js';

const MODEL_FULL = { iaas: 'IaaS', paas: 'PaaS', saas: 'SaaS' };
const MODEL_DESC = {
  iaas: 'renting virtual machines, storage, and networking while managing the OS, runtime, and application yourself',
  paas: 'renting a managed platform where you deploy your application code while the provider manages the runtime, OS, and infrastructure',
  saas: 'using ready-made software delivered over the internet where the provider manages the entire stack',
};

const ADVANTAGES = {
  iaas: ['Maximum control over infrastructure, OS, and runtime', 'Highly customizable', 'No vendor lock-in', 'Direct control over security and compliance', 'Suitable for complex networking'],
  paas: ['Reduced infrastructure management', 'Faster deployment and time to market', 'Built-in scalability', 'Managed database and runtime services', 'Lower operational overhead'],
  saas: ['Fastest deployment — ready-made software', 'No infrastructure or platform management', 'Predictable subscription-based pricing', 'Provider handles maintenance, updates, and security', 'Lowest technical expertise requirement'],
};

const TRADEOFFS = {
  iaas: ['Requires significant technical expertise and ops team', 'Higher management and maintenance overhead', 'Slower deployment compared to PaaS and SaaS', 'You are responsible for OS patching, security, and backups', 'Higher initial setup cost and complexity'],
  paas: ['Less infrastructure control than IaaS', 'Potential vendor lock-in through platform-specific APIs', 'Platform-specific limitations on runtime and framework choices', 'May be more expensive than IaaS for predictable workloads', 'Limited control over OS-level configuration'],
  saas: ['Least customization — limited to provider configuration options', 'Highest vendor lock-in risk', 'Data resides in the provider system — limited data portability', 'Recurring subscription costs can be high at scale', 'Dependent on provider for feature roadmap and SLAs'],
};

export function generateExplanation(scenario, result) {
  const model = result.recommendedModel;
  const reasons = [];
  const topFactors = [...result.factorScores].sort((a, b) => {
    const key = `${model}Score`;
    return b[key] - a[key];
  }).slice(0, 4);

  reasons.push(`Based on the weighted analysis of ${result.factorScores.length} factors across technical, operational, financial, and business categories, ${MODEL_FULL[model]} scored ${model === 'iaas' ? result.iaasScore : model === 'paas' ? result.paasScore : result.saasScore}/100, the highest among all three cloud service models.`);
  reasons.push(`The organization's requirements align with ${MODEL_DESC[model]}.`);
  topFactors.forEach(f => {
    const label = FACTOR_LABELS[f.factor] || f.factor;
    reasons.push(`${label} strongly favors ${model.toUpperCase()}.`);
  });

  if (result.confidence === 'High') reasons.push(`Confidence is High (score gap of ${result.confidenceDifference} points), indicating a clear preference for ${model.toUpperCase()}.`);
  else if (result.confidence === 'Moderate') reasons.push(`Confidence is Moderate (score gap of ${result.confidenceDifference} points), suggesting ${model.toUpperCase()} is a good fit but the runner-up is also viable.`);
  else reasons.push(`Confidence is Low (score gap of only ${result.confidenceDifference} points), meaning the models are closely matched.`);

  return { reasons, advantages: ADVANTAGES[model], tradeoffs: TRADEOFFS[model] };
}
