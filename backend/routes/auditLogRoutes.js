import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.get('/', auth, requireRole('admin'), getAuditLogs);
export default router;
