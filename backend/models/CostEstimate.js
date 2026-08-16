import mongoose from 'mongoose';

const costEstimateSchema = new mongoose.Schema({
  analysisId: { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis', required: true },
  model: { type: String, enum: ['iaas', 'paas', 'saas'], required: true },
  monthlyCost: { type: Number, default: 0 },
  annualCost: { type: Number, default: 0 },
  threeYearTCO: { type: Number, default: 0 },
  initialCost: { type: Number, default: 0 },
  assumptions: [String],
}, { timestamps: true });

costEstimateSchema.index({ analysisId: 1 });

export default mongoose.model('CostEstimate', costEstimateSchema);
