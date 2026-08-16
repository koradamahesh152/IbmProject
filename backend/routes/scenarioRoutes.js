import express from 'express';
import { getScenarios, getScenarioById, createScenario, updateScenario, deleteScenario } from '../controllers/scenarioController.js';
import { auth } from '../middleware/auth.js';
import { scenarioValidation, validate } from '../middleware/validate.js';

const router = express.Router();
router.use(auth);
router.get('/', getScenarios);
router.post('/', scenarioValidation, validate, createScenario);
router.get('/:id', getScenarioById);
router.put('/:id', updateScenario);
router.delete('/:id', deleteScenario);
export default router;
