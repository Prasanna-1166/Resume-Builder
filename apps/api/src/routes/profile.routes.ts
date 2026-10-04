import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { requireUserAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireUserAuth, getProfile);
router.put('/', requireUserAuth, updateProfile);

export default router;
