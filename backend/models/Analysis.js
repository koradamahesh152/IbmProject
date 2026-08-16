import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  scenarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  recommendedModel: { type: String, enum: ['iaas', 'paas', 'saas'], required: true },
  iaasScore: { type: Number, default: 0 },
  paasScore: { type: Number, default: 0 },
  saasScore: { type: Number, default: 0 },
  ranking: [{ type: String, enum: ['iaas', 'paas', 'saas'] }],
  confidence: { type: String, enum: ['High', 'Moderate', 'Low'], default: 'Moderate' },
  confidenceDifference: { type: Number, default: 0 },
  reasons: [String],
  advantages: [String],
  tradeoffs: [String],
  factorScores: [{
    factor: String,
    category: String,
    weight: Number,
    iaasScore: Number,
    paasScore: Number,
    saasScore: Number,
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

analysisSchema.index({ scenarioId: 1, createdAt: -1 });

export default mongoose.model('Analysis', analysisSchema);
