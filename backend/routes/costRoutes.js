import express from 'express';
import { runAnalysis, getAnalysis } from '../controllers/analysisController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth);
router.post('/:scenarioId', runAnalysis);
router.get('/:scenarioId', getAnalysis);
export default router;
