import Scenario from '../models/Scenario.js';
import Analysis from '../models/Analysis.js';
import CostEstimate from '../models/CostEstimate.js';

export async function getDashboardStats(req, res) {
  const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
  const scenarios = await Scenario.countDocuments(filter);
  const analyses = await Analysis.find(filter).sort({ createdAt: -1 });

  const iaasCount = analyses.filter(a => a.recommendedModel === 'iaas').length;
  const paasCount = analyses.filter(a => a.recommendedModel === 'paas').length;
  const saasCount = analyses.filter(a => a.recommendedModel === 'saas').length;

  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((s, a) => s + Math.max(a.iaasScore, a.paasScore, a.saasScore), 0) / analyses.length)
    : 0;

  const recent = analyses.slice(0, 5).map(a => ({
    id: a._id, recommendedModel: a.recommendedModel,
    topScore: Math.max(a.iaasScore, a.paasScore, a.saasScore),
    createdAt: a.createdAt,
  }));

  res.json({
    totalScenarios: scenarios,
    iaasRecommendations: iaasCount,
    paasRecommendations: paasCount,
    saasRecommendations: saasCount,
    averageScore: avgScore,
    recentAnalyses: recent,
  });
}
