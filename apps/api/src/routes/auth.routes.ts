import { Router } from 'express';
import { login, getMe, logout } from '../controllers/auth.controller';
import { authGuard } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/login', authRateLimiter, login);
router.get('/me', authGuard, getMe);
router.post('/logout', logout);

export default router;
