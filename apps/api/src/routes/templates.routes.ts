import { Router } from 'express';
import { listTemplates, getTemplateById, updateTemplate, uploadReference } from '../controllers/templates.controller';
import { authGuard } from '../middleware/auth';
import { uploadReferencePdf } from '../middleware/upload';

const router = Router();

// Public routes (Students)
router.get('/', listTemplates);
router.get('/:id', getTemplateById);

// Admin-protected routes
router.put('/:id', authGuard, updateTemplate);
router.post('/upload-reference', authGuard, uploadReferencePdf.single('file'), uploadReference);

export default router;
