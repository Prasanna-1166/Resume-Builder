import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { Template } from '@prisma/client';

export async function listTemplates(req: Request, res: Response): Promise<void> {
  try {
    const { category, status, search, limit } = req.query;

    const where: any = {};
    if (category && typeof category === 'string' && category !== 'all') {
      where.category = category;
    }

    if (status && typeof status === 'string') {
      where.status = status;
    } else {
      // By default for public users, only return ACTIVE templates
      const isAdmin = (req as any).user;
      if (!isAdmin) {
        where.status = 'ACTIVE';
      }
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } }
      ];
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: limit ? parseInt(limit as string) : undefined
    });

    const formatted = templates.map((t: Template) => ({
      ...t,
      suitableFor: JSON.parse(t.suitableFor || '[]'),
      tags: JSON.parse(t.tags || '[]')
    }));

    res.json({ templates: formatted, total: formatted.length });
  } catch (error) {
    console.error('List templates error:', error);
    res.status(500).json({ error: 'Failed to retrieve templates.' });
  }
}

export async function getTemplateById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const template = await prisma.template.findUnique({
      where: { id }
    });

    if (!template) {
      res.status(404).json({ error: 'Template not found.' });
      return;
    }

    res.json({
      template: {
        ...template,
        suitableFor: JSON.parse(template.suitableFor || '[]'),
        tags: JSON.parse(template.tags || '[]')
      }
    });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Failed to retrieve template.' });
  }
}

export async function updateTemplate(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const { name, category, description, status, isPopular, displayOrder, colorScheme } = req.body;

    const updated = await prisma.template.update({
      where: { id },
      data: {
        name,
        category,
        description,
        status,
        isPopular,
        displayOrder,
        colorScheme
      }
    });

    res.json({
      success: true,
      template: {
        ...updated,
        suitableFor: JSON.parse(updated.suitableFor || '[]'),
        tags: JSON.parse(updated.tags || '[]')
      }
    });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ error: 'Failed to update template.' });
  }
}

export async function uploadReference(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No reference file uploaded.' });
      return;
    }

    const { notes } = req.body;

    const record = await prisma.uploadedReference.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storagePath: file.path,
        status: 'PENDING',
        notes: notes || null
      }
    });

    res.json({
      success: true,
      message: 'Template reference uploaded successfully. It is now in PENDING status until rendered.',
      reference: record
    });
  } catch (error) {
    console.error('Upload reference error:', error);
    res.status(500).json({ error: 'Failed to upload template reference.' });
  }
}
