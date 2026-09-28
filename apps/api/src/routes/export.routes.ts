import { Router } from 'express';
import { exportDocx, exportPdf } from '../controllers/export.controller';

const router = Router();

router.post('/docx', exportDocx);
router.post('/pdf', exportPdf);

export default router;
