import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getUserDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const documents = await prisma.document.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ success: true, documents });
  } catch (error) {
    console.error('Get user documents error:', error);
    res.status(500).json({ error: 'Failed to retrieve documents.' });
  }
}

export async function getDocumentById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const id = String(req.params.id);

    const document = await prisma.document.findUnique({
      where: { id }
    });

    if (!document || document.userId !== req.user.id) {
      res.status(404).json({ error: 'Document not found.' });
      return;
    }

    res.json({ success: true, document });
  } catch (error) {
    console.error('Get document by id error:', error);
    res.status(500).json({ error: 'Failed to retrieve document.' });
  }
}

export async function createDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const {
      id,
      title,
      documentType,
      category,
      templateId,
      targetRole,
      targetCompany,
      parentId,
      parentTitle,
      isMaster,
      versionLabel,
      data
    } = req.body;

    if (!title || !data) {
      res.status(400).json({ error: 'Title and document data are required.' });
      return;
    }

    const docPayload: any = {
      userId: req.user.id,
      title: title.trim(),
      documentType: documentType || 'RESUME',
      category: category || 'STUDENT',
      templateId: templateId || 'template_01',
      targetRole: targetRole || null,
      targetCompany: targetCompany || null,
      parentId: parentId || null,
      parentTitle: parentTitle || null,
      isMaster: isMaster !== undefined ? Boolean(isMaster) : true,
      versionLabel: versionLabel || null,
      data
    };

    if (id && typeof id === 'string') {
      const existing = await prisma.document.findUnique({ where: { id } });
      if (!existing) {
        docPayload.id = id;
      }
    }

    const document = await prisma.document.create({
      data: docPayload
    });

    res.status(201).json({ success: true, document });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: 'Failed to create document.' });
  }
}

export async function updateDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const id = String(req.params.id);

    const existing = await prisma.document.findUnique({
      where: { id }
    });

    if (!existing || existing.userId !== req.user.id) {
      res.status(404).json({ error: 'Document not found.' });
      return;
    }

    const {
      title,
      documentType,
      category,
      templateId,
      targetRole,
      targetCompany,
      parentId,
      parentTitle,
      isMaster,
      versionLabel,
      data
    } = req.body;

    const updatePayload: any = {};
    if (title !== undefined) updatePayload.title = title.trim();
    if (documentType !== undefined) updatePayload.documentType = documentType;
    if (category !== undefined) updatePayload.category = category;
    if (templateId !== undefined) updatePayload.templateId = templateId;
    if (targetRole !== undefined) updatePayload.targetRole = targetRole;
    if (targetCompany !== undefined) updatePayload.targetCompany = targetCompany;
    if (parentId !== undefined) updatePayload.parentId = parentId;
    if (parentTitle !== undefined) updatePayload.parentTitle = parentTitle;
    if (isMaster !== undefined) updatePayload.isMaster = Boolean(isMaster);
    if (versionLabel !== undefined) updatePayload.versionLabel = versionLabel;
    if (data !== undefined) updatePayload.data = data;

    const document = await prisma.document.update({
      where: { id },
      data: updatePayload
    });

    res.json({ success: true, document });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Failed to update document.' });
  }
}

export async function deleteDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const id = String(req.params.id);

    const existing = await prisma.document.findUnique({
      where: { id }
    });

    if (!existing || existing.userId !== req.user.id) {
      res.status(404).json({ error: 'Document not found.' });
      return;
    }

    // Detach any child documents that referenced this parent
    await prisma.document.updateMany({
      where: { parentId: id, userId: req.user.id },
      data: { parentId: null, parentTitle: null }
    }).catch(() => {});

    await prisma.document.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Document deleted successfully.' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document.' });
  }
}

export async function syncDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { documents } = req.body;

    if (!Array.isArray(documents)) {
      res.status(400).json({ error: 'Expected documents array for synchronization.' });
      return;
    }

    let syncedCount = 0;

    for (const doc of documents) {
      if (!doc || !doc.id) continue;

      const docType = doc.documentType || 'RESUME';
      const cat = doc.category || 'STUDENT';
      const tpl = doc.templateId || 'template_01';

      const existing = await prisma.document.findUnique({
        where: { id: doc.id }
      });

      if (existing) {
        if (existing.userId === req.user.id) {
          // Update own document
          await prisma.document.update({
            where: { id: doc.id },
            data: {
              title: doc.title || existing.title,
              documentType: docType,
              category: cat,
              templateId: tpl,
              targetRole: doc.targetRole || null,
              targetCompany: doc.targetCompany || null,
              parentId: doc.parentId || null,
              parentTitle: doc.parentTitle || null,
              isMaster: doc.isMaster !== undefined ? Boolean(doc.isMaster) : existing.isMaster,
              versionLabel: doc.versionLabel || null,
              data: doc
            }
          });
          syncedCount++;
        }
      } else {
        // Create new document for user
        await prisma.document.create({
          data: {
            id: doc.id,
            userId: req.user.id,
            title: doc.title || 'Untitled Document',
            documentType: docType,
            category: cat,
            templateId: tpl,
            targetRole: doc.targetRole || null,
            targetCompany: doc.targetCompany || null,
            parentId: doc.parentId || null,
            parentTitle: doc.parentTitle || null,
            isMaster: doc.isMaster !== undefined ? Boolean(doc.isMaster) : true,
            versionLabel: doc.versionLabel || null,
            data: doc
          }
        });
        syncedCount++;
      }
    }

    const allDocuments = await prisma.document.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({
      success: true,
      syncedCount,
      documents: allDocuments
    });
  } catch (error) {
    console.error('Sync documents error:', error);
    res.status(500).json({ error: 'Failed to synchronize documents.' });
  }
}
