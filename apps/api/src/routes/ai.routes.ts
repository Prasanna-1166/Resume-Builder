import { Router } from 'express';
import { improveSummary, improveBullet, suggestSkills, analyzeJob } from '../controllers/ai.controller';
import { aiRateLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/improve-summary', aiRateLimiter, improveSummary);
router.post('/improve-bullet', aiRateLimiter, improveBullet);
router.post('/suggest-skills', aiRateLimiter, suggestSkills);
router.post('/analyze-job', aiRateLimiter, analyzeJob);

export default router;
