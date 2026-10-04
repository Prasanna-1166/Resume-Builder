import { Router } from 'express';
import { submitFeedback, getAdminFeedback, updateFeedbackStatus } from '../controllers/feedback.controller';
import { optionalAuth, authGuard } from '../middleware/auth';

const router = Router();

// Public / Authenticated feedback submission
router.post('/', optionalAuth, submitFeedback);

// Admin-only management routes
router.get('/admin', authGuard, getAdminFeedback);
router.patch('/admin/:id', authGuard, updateFeedbackStatus);

export default router;
