import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

export async function getUsers(req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
}

export async function getUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

export async function updateUser(req, res) {
  const { name, role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { name, role }, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });
  await AuditLog.create({ userId: req.user._id, action: 'user_update', entity: 'user', entityId: user._id, metadata: { role } });
  res.json(user);
}

export async function deleteUser(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  await AuditLog.create({ userId: req.user._id, action: 'user_delete', entity: 'user', entityId: req.params.id });
  res.json({ message: 'User deleted' });
}
