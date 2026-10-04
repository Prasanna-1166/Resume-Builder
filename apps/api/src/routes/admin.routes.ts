import { Router } from 'express';
import { getAdminUsersList } from '../controllers/admin.controller';
import { getAdminFeedback, updateFeedbackStatus } from '../controllers/feedback.controller';
import { authGuard } from '../middleware/auth';

const router = Router();

router.get('/users', authGuard, getAdminUsersList);
router.get('/feedback', authGuard, getAdminFeedback);
router.patch('/feedback/:id', authGuard, updateFeedbackStatus);

export default router;
