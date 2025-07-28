import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createIncident, getIncidents, summarizeIncident } from '../controllers/incident.controller';

const router = Router();

router.post('/', authenticate, createIncident);
router.get('/', authenticate, getIncidents);
router.post('/:id/summarize', authenticate, summarizeIncident);

export default router;
