import mongoose from 'mongoose';

const scenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organizationName: { type: String, required: true },
  industry: { type: String, default: 'Technology' },
  description: { type: String, default: '' },
  applicationType: { type: String, default: 'Web Application' },
  userCount: { type: Number, default: 100 },
  trafficLevel: { type: String, default: 'Medium' },
  complexity: { type: String, default: 'Medium' },
  customization: { type: String, default: 'Medium' },
  infrastructureControl: { type: String, default: 'Medium' },
  scalability: { type: String, default: 'Medium' },
  performance: { type: String, default: 'Medium' },
  availability: { type: String, default: 'Medium' },
  security: { type: String, default: 'Medium' },
  integration: { type: String, default: 'Medium' },
  technicalExpertise: { type: String, default: 'Medium' },
  managementPreference: { type: String, default: 'Medium' },
  maintenanceTolerance: { type: String, default: 'Medium' },
  deploymentSpeed: { type: String, default: 'Medium' },
  budget: { type: String, default: 'Medium' },
  costSensitivity: { type: String, default: 'Medium' },
  usagePattern: { type: String, default: 'Steady' },
  pricingPreference: { type: String, default: 'Pay-as-you-go' },
  timeToMarket: { type: String, default: 'Medium' },
  flexibility: { type: String, default: 'Medium' },
  vendorLockInTolerance: { type: String, default: 'Medium' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

scenarioSchema.index({ createdBy: 1, createdAt: -1 });

export default mongoose.model('Scenario', scenarioSchema);
