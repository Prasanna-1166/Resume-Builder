import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller';
import { requireUserAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.get('/me', requireUserAuth, getMe);
router.post('/logout', logout);

export default router;
