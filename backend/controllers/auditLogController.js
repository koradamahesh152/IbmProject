import AuditLog from '../models/AuditLog.js';

export async function getAuditLogs(req, res) {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200);
  res.json(logs);
}
