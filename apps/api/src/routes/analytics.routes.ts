import { Router } from 'express';
import {
  trackEvent,
  getOverview,
  getTimeseries,
  getTemplateStats,
  getAiStats
} from '../controllers/analytics.controller';
import { authGuard } from '../middleware/auth';

const router = Router();

// Public telemetry ingestion endpoints
router.post('/track', trackEvent);
router.post('/events', trackEvent);

// Protected admin analytics endpoints
router.get('/overview', authGuard, getOverview);
router.get('/timeseries', authGuard, getTimeseries);
router.get('/templates', authGuard, getTemplateStats);
router.get('/ai', authGuard, getAiStats);

export default router;
