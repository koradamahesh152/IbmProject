import Analysis from '../models/Analysis.js';
import CostEstimate from '../models/CostEstimate.js';
import Scenario from '../models/Scenario.js';
import AuditLog from '../models/AuditLog.js';
import { runDecisionEngine } from '../services/decisionEngine.js';
import { runCostEngine } from '../services/costEngine.js';
import { generateExplanation } from '../services/explanationEngine.js';

export async function runAnalysis(req, res) {
  const scenario = await Scenario.findById(req.params.scenarioId);
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });

  const decision = runDecisionEngine(scenario);
  const costs = runCostEngine(scenario);
  const explanation = generateExplanation(scenario, decision);

  const analysis = await Analysis.create({
    scenarioId: scenario._id,
    recommendedModel: decision.recommendedModel,
    iaasScore: decision.iaasScore,
    paasScore: decision.paasScore,
    saasScore: decision.saasScore,
    ranking: decision.ranking,
    confidence: decision.confidence,
    confidenceDifference: decision.confidenceDifference,
    reasons: explanation.reasons,
    advantages: explanation.advantages,
    tradeoffs: explanation.tradeoffs,
    factorScores: decision.factorScores,
    createdBy: req.user._id,
  });

  const costDocs = await CostEstimate.insertMany(costs.map(c => ({ ...c, analysisId: analysis._id })));

  await AuditLog.create({ userId: req.user._id, action: 'run_analysis', entity: 'analysis', entityId: analysis._id, metadata: { scenario: scenario.name, recommendation: decision.recommendedModel } });

  res.status(201).json({ analysis, costEstimates: costDocs });
}

export async function getAnalysis(req, res) {
  const analysis = await Analysis.findOne({ scenarioId: req.params.scenarioId }).sort({ createdAt: -1 });
  if (!analysis) return res.status(404).json({ error: 'No analysis found' });
  const costEstimates = await CostEstimate.find({ analysisId: analysis._id });
  res.json({ analysis, costEstimates });
}
