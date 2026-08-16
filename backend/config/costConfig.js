// Backend cost config — mirrors src/config/costConfig.ts
export const COST_CONFIG = {
  iaas: { vmBaseCost: 120, storagePerGB: 0.10, networkPerGB: 0.09, backupRate: 0.15, managementHours: 40, staffHourlyRate: 75, vmsPerTrafficLevel: { 'Very Low': 2, Low: 4, Medium: 8, High: 16, 'Very High': 32 } },
  paas: { appInstanceBase: 150, databaseBase: 200, storagePerGB: 0.12, networkPerGB: 0.08, managedServicePremium: 0.25, instancesPerTrafficLevel: { 'Very Low': 1, Low: 2, Medium: 4, High: 8, 'Very High': 16 } },
  saas: { subscriptionPerUser: 25, premiumMultiplier: { 'Very Low': 1.0, Low: 1.2, Medium: 1.5, High: 2.0, 'Very High': 2.5 }, storageBase: 100, supportBase: 200 },
  initialCost: { iaas: 5000, paas: 2000, saas: 500 },
  saasVolumeDiscount: { threshold1: 100, threshold2: 1000, threshold3: 5000 },
};
export const COST_DISCLAIMER = 'Illustrative academic cost model. Actual cloud costs vary by provider, region, usage, discounts, contracts, service configuration, and support plans.';
