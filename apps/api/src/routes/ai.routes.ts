import { Router } from 'express';
import {
  improveSummary,
  improveBullet,
  suggestSkills,
  analyzeJob,
  generateCoverLetter,
  improveCoverLetter,
  tailorDocument,
  suggestCvSections
} from '../controllers/ai.controller';
import { aiRateLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/improve-summary', aiRateLimiter, improveSummary);
router.post('/improve-bullet', aiRateLimiter, improveBullet);
router.post('/suggest-skills', aiRateLimiter, suggestSkills);
router.post('/analyze-job', aiRateLimiter, analyzeJob);
router.post('/generate-cover-letter', aiRateLimiter, generateCoverLetter);
router.post('/improve-cover-letter', aiRateLimiter, improveCoverLetter);
router.post('/tailor-document', aiRateLimiter, tailorDocument);
router.post('/suggest-cv-sections', aiRateLimiter, suggestCvSections);

export default router;
