import Analysis from '../models/Analysis.js';
import Scenario from '../models/Scenario.js';
import CostEstimate from '../models/CostEstimate.js';
import AuditLog from '../models/AuditLog.js';

export async function getReport(req, res) {
  const analysis = await Analysis.findById(req.params.analysisId);
  if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
  const scenario = await Scenario.findById(analysis.scenarioId);
  const costEstimates = await CostEstimate.find({ analysisId: analysis._id });

  await AuditLog.create({ userId: req.user._id, action: 'generate_report', entity: 'analysis', entityId: analysis._id });

  res.json({ analysis, scenario, costEstimates });
}
