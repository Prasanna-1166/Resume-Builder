import { Router } from 'express';
import {
  getUserDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  syncDocuments
} from '../controllers/documents.controller';
import { requireUserAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireUserAuth, getUserDocuments);
router.post('/sync', requireUserAuth, syncDocuments);
router.get('/:id', requireUserAuth, getDocumentById);
router.post('/', requireUserAuth, createDocument);
router.put('/:id', requireUserAuth, updateDocument);
router.delete('/:id', requireUserAuth, deleteDocument);

export default router;
