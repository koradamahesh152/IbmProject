import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true, enum: [
    'login', 'register', 'create_scenario', 'update_scenario', 'delete_scenario',
    'run_analysis', 'generate_report', 'user_update', 'user_delete'
  ]},
  entity: { type: String, default: '' },
  entityId: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

auditLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
