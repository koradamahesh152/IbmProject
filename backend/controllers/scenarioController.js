import Scenario from '../models/Scenario.js';
import AuditLog from '../models/AuditLog.js';

export async function getScenarios(req, res) {
  const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
  const scenarios = await Scenario.find(filter).sort({ createdAt: -1 });
  res.json(scenarios);
}

export async function getScenarioById(req, res) {
  const scenario = await Scenario.findById(req.params.id);
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });
  if (req.user.role !== 'admin' && scenario.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  res.json(scenario);
}

export async function createScenario(req, res) {
  const scenario = await Scenario.create({ ...req.body, createdBy: req.user._id });
  await AuditLog.create({ userId: req.user._id, action: 'create_scenario', entity: 'scenario', entityId: scenario._id, metadata: { name: scenario.name } });
  res.status(201).json(scenario);
}

export async function updateScenario(req, res) {
  const scenario = await Scenario.findById(req.params.id);
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });
  if (req.user.role !== 'admin' && scenario.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  Object.assign(scenario, req.body);
  await scenario.save();
  await AuditLog.create({ userId: req.user._id, action: 'update_scenario', entity: 'scenario', entityId: scenario._id });
  res.json(scenario);
}

export async function deleteScenario(req, res) {
  const scenario = await Scenario.findById(req.params.id);
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });
  if (req.user.role !== 'admin' && scenario.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  await scenario.deleteOne();
  await AuditLog.create({ userId: req.user._id, action: 'delete_scenario', entity: 'scenario', entityId: req.params.id });
  res.json({ message: 'Scenario deleted' });
}
