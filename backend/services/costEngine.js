// Backend Cost Engine — JS reference implementation
// Mirrors src/services/costEngine.ts
import { COST_CONFIG } from '../config/costConfig.js';

function calcIaaS(scenario) {
  const c = COST_CONFIG.iaas;
  const vms = c.vmsPerTrafficLevel[scenario.trafficLevel] || 8;
  const compute = vms * c.vmBaseCost;
  const storageGB = Math.ceil(scenario.userCount * 0.5 + 100);
  const storage = storageGB * c.storagePerGB;
  const networkGB = Math.ceil(scenario.userCount * 0.2);
  const network = networkGB * c.networkPerGB;
  const backup = storage * c.backupRate;
  const mgmt = c.managementHours * c.staffHourlyRate;
  const monthly = Math.round(compute + storage + network + backup + mgmt);
  return { model: 'iaas', monthlyCost: monthly, annualCost: monthly * 12, threeYearTCO: COST_CONFIG.initialCost.iaas + monthly * 36, initialCost: COST_CONFIG.initialCost.iaas, assumptions: [`${vms} VMs`, `${storageGB} GB storage`, `${networkGB} GB/month network`, `${c.managementHours} hrs/mo management`] };
}

function calcPaaS(scenario) {
  const c = COST_CONFIG.paas;
  const inst = c.instancesPerTrafficLevel[scenario.trafficLevel] || 4;
  const app = inst * c.appInstanceBase;
  const db = c.databaseBase;
  const storageGB = Math.ceil(scenario.userCount * 0.3 + 50);
  const storage = storageGB * c.storagePerGB;
  const networkGB = Math.ceil(scenario.userCount * 0.15);
  const network = networkGB * c.networkPerGB;
  const base = app + db + storage + network;
  const premium = base * c.managedServicePremium;
  const monthly = Math.round(base + premium);
  return { model: 'paas', monthlyCost: monthly, annualCost: monthly * 12, threeYearTCO: COST_CONFIG.initialCost.paas + monthly * 36, initialCost: COST_CONFIG.initialCost.paas, assumptions: [`${inst} app instances`, `Managed DB $${db}/mo`, `${storageGB} GB storage`, '25% managed service premium'] };
}

function calcSaaS(scenario) {
  const c = COST_CONFIG.saas;
  const mult = c.premiumMultiplier[scenario.customization] || 1.5;
  let perUser = c.subscriptionPerUser * mult;
  if (scenario.userCount > 5000) perUser *= 0.70;
  else if (scenario.userCount > 1000) perUser *= 0.80;
  else if (scenario.userCount > 100) perUser *= 0.90;
  const sub = Math.round(scenario.userCount * perUser);
  const monthly = sub + c.storageBase + c.supportBase;
  return { model: 'saas', monthlyCost: monthly, annualCost: monthly * 12, threeYearTCO: COST_CONFIG.initialCost.saas + monthly * 36, initialCost: COST_CONFIG.initialCost.saas, assumptions: [`$${perUser.toFixed(2)}/user/mo`, `${scenario.userCount} users`, 'Volume discount applied'] };
}

export function runCostEngine(scenario) {
  return [calcIaaS(scenario), calcPaaS(scenario), calcSaaS(scenario)];
}
