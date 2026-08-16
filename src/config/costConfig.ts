// ============================================================
// Cost Engine Configuration — Illustrative Academic Cost Model
// ============================================================
// This is NOT real AWS/Azure/GCP pricing. It is an illustrative
// academic cost model designed to demonstrate how cloud cost
// estimation works conceptually. Actual cloud costs vary by
// provider, region, usage, discounts, contracts, and configuration.
// ============================================================

// Base monthly rates (illustrative, in USD)
export const COST_CONFIG = {
  // IaaS base unit costs (per month)
  iaas: {
    vmBaseCost: 120,        // base cost per VM instance
    storagePerGB: 0.10,     // per GB per month
    networkPerGB: 0.09,      // per GB data transfer
    backupRate: 0.15,       // 15% of storage cost
    managementHours: 40,    // estimated management hours per month
    staffHourlyRate: 75,    // loaded staff cost per hour
    vmsPerTrafficLevel: {
      'Very Low': 2,
      Low: 4,
      Medium: 8,
      High: 16,
      'Very High': 32,
    },
  },
  // PaaS base unit costs (per month)
  paas: {
    appInstanceBase: 150,   // base cost per app instance
    databaseBase: 200,      // managed database base cost
    storagePerGB: 0.12,    // per GB per month
    networkPerGB: 0.08,    // per GB data transfer
    managedServicePremium: 0.25, // 25% premium over compute
    instancesPerTrafficLevel: {
      'Very Low': 1,
      Low: 2,
      Medium: 4,
      High: 8,
      'Very High': 16,
    },
  },
  // SaaS base unit costs (per month)
  saas: {
    subscriptionPerUser: 25, // base subscription per user per month
    premiumMultiplier: {
      'Very Low': 1.0,
      Low: 1.2,
      Medium: 1.5,
      High: 2.0,
      'Very High': 2.5,
    },
    storageBase: 100,       // base storage add-on
    supportBase: 200,       // base support plan
  },
  // Initial setup costs
  initialCost: {
    iaas: 5000,   // infrastructure setup, migration, training
    paas: 2000,   // platform setup, migration
    saas: 500,    // configuration, data import, training
  },
  // User count tiers for SaaS discount
  saasVolumeDiscount: {
    threshold1: 100,   // 10% discount above 100 users
    threshold2: 1000,  // 20% discount above 1000 users
    threshold3: 5000,  // 30% discount above 5000 users
  },
};

export const COST_DISCLAIMER =
  'Illustrative academic cost model. Actual cloud costs vary by provider, region, usage, discounts, contracts, service configuration, and support plans.';
