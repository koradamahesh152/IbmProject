// ============================================================
// Cost Engine — Illustrative Academic Cost Model
// ============================================================
// Estimates monthly, annual, and 3-year TCO for IaaS, PaaS, SaaS
// based on scenario inputs. This is NOT real cloud pricing.
// ============================================================

import type { Scenario, CostResult, CloudModel, LevelValue } from '@/types';
import { COST_CONFIG, COST_DISCLAIMER } from '@/config/costConfig';

function calculateIaaSCost(scenario: Scenario): CostResult {
  const { iaas } = COST_CONFIG;
  const trafficLevel = scenario.traffic_level as LevelValue;
  const vmCount = iaas.vmsPerTrafficLevel[trafficLevel];

  const computeCost = vmCount * iaas.vmBaseCost;

  // Storage estimate based on user count and complexity
  const storageGB = Math.ceil(scenario.user_count * 0.5 + 100);
  const storageCost = storageGB * iaas.storagePerGB;

  // Network estimate based on traffic and users
  const networkGB = Math.ceil(scenario.user_count * 0.2);
  const networkCost = networkGB * iaas.networkPerGB;

  const backupCost = storageCost * iaas.backupRate;

  const managementCost = iaas.managementHours * iaas.staffHourlyRate;

  const monthlyCost = Math.round(
    computeCost + storageCost + networkCost + backupCost + managementCost
  );

  const annualCost = monthlyCost * 12;
  const initialCost = COST_CONFIG.initialCost.iaas;
  const threeYearTCO = initialCost + monthlyCost * 36;

  return {
    model: 'iaas',
    monthlyCost,
    annualCost,
    threeYearTCO,
    initialCost,
    assumptions: [
      `${vmCount} VM instances based on ${trafficLevel} traffic`,
      `${storageGB} GB storage estimated from ${scenario.user_count} users`,
      `${networkGB} GB/month network transfer`,
      `Backup at 15% of storage cost`,
      `${iaas.managementHours} hours/month management at $${iaas.staffHourlyRate}/hr`,
      `Initial setup: infrastructure, migration, training ($${initialCost})`,
    ],
  };
}

function calculatePaaSCost(scenario: Scenario): CostResult {
  const { paas } = COST_CONFIG;
  const trafficLevel = scenario.traffic_level as LevelValue;
  const instanceCount = paas.instancesPerTrafficLevel[trafficLevel];

  const appInstanceCost = instanceCount * paas.appInstanceBase;
  const databaseCost = paas.databaseBase;

  const storageGB = Math.ceil(scenario.user_count * 0.3 + 50);
  const storageCost = storageGB * paas.storagePerGB;

  const networkGB = Math.ceil(scenario.user_count * 0.15);
  const networkCost = networkGB * paas.networkPerGB;

  const baseCost = appInstanceCost + databaseCost + storageCost + networkCost;
  const managedServiceCost = baseCost * paas.managedServicePremium;

  const monthlyCost = Math.round(baseCost + managedServiceCost);
  const annualCost = monthlyCost * 12;
  const initialCost = COST_CONFIG.initialCost.paas;
  const threeYearTCO = initialCost + monthlyCost * 36;

  return {
    model: 'paas',
    monthlyCost,
    annualCost,
    threeYearTCO,
    initialCost,
    assumptions: [
      `${instanceCount} app instances based on ${trafficLevel} traffic`,
      `Managed database service ($${databaseCost}/month)`,
      `${storageGB} GB storage`,
      `${networkGB} GB/month network transfer`,
      `Managed service premium: 25% of base cost`,
      `Initial setup: platform config, migration ($${initialCost})`,
    ],
  };
}

function calculateSaaSCost(scenario: Scenario): CostResult {
  const { saas } = COST_CONFIG;
  const customizationLevel = scenario.customization as LevelValue;
  const premiumMultiplier = saas.premiumMultiplier[customizationLevel];

  let perUserCost = saas.subscriptionPerUser * premiumMultiplier;

  // Volume discounts
  const { threshold1, threshold2, threshold3 } = COST_CONFIG.saasVolumeDiscount;
  if (scenario.user_count > threshold3) {
    perUserCost *= 0.70;
  } else if (scenario.user_count > threshold2) {
    perUserCost *= 0.80;
  } else if (scenario.user_count > threshold1) {
    perUserCost *= 0.90;
  }

  const subscriptionCost = Math.round(scenario.user_count * perUserCost);
  const storageCost = saas.storageBase;
  const supportCost = saas.supportBase;

  const monthlyCost = subscriptionCost + storageCost + supportCost;
  const annualCost = monthlyCost * 12;
  const initialCost = COST_CONFIG.initialCost.saas;
  const threeYearTCO = initialCost + monthlyCost * 36;

  return {
    model: 'saas',
    monthlyCost,
    annualCost,
    threeYearTCO,
    initialCost,
    assumptions: [
      `$${(perUserCost).toFixed(2)}/user/month (base $${saas.subscriptionPerUser} × ${premiumMultiplier} premium${scenario.user_count > threshold1 ? ' × volume discount' : ''})`,
      `${scenario.user_count} users`,
      `Storage add-on: $${storageCost}/month`,
      `Support plan: $${supportCost}/month`,
      `Initial setup: configuration, data import ($${initialCost})`,
    ],
  };
}

export function runCostEngine(scenario: Scenario): CostResult[] {
  return [
    calculateIaaSCost(scenario),
    calculatePaaSCost(scenario),
    calculateSaaSCost(scenario),
  ];
}

export function getCostForModel(estimates: CostResult[], model: CloudModel): CostResult | undefined {
  return estimates.find((e) => e.model === model);
}

export { COST_DISCLAIMER };
