import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { mailService } from '../services/mail.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_CATEGORIES = [
  'General Question',
  'Bug Report',
  'Feedback',
  'Feature Request',
  'Account Problem',
  'Template Problem',
  'Other'
];

export async function submitFeedback(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, email, category, message } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Name is required.' });
      return;
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      res.status(400).json({ error: 'A valid email address is required.' });
      return;
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    const cleanCategory = VALID_CATEGORIES.includes(category) ? category : 'General Question';
    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanMessage = message.trim();

    const feedback = await prisma.feedback.create({
      data: {
        userId: req.user?.id || null,
        name: cleanName,
        email: cleanEmail,
        category: cleanCategory,
        message: cleanMessage,
        status: 'NEW'
      }
    });

    // Send backend notification email asynchronously
    mailService.sendFeedbackEmail({
      name: cleanName,
      email: cleanEmail,
      category: cleanCategory,
      message: cleanMessage,
      userId: req.user?.id || null
    }).catch(err => {
      console.error('[Feedback] Email notification non-fatal error:', err?.message);
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been received.',
      feedbackId: feedback.id
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback. Please try again later.' });
  }
}

export async function getAdminFeedback(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({ success: true, feedbacks });
  } catch (error) {
    console.error('Get admin feedback error:', error);
    res.status(500).json({ error: 'Failed to retrieve feedback list.' });
  }
}

export async function updateFeedbackStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    if (!['NEW', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Expected NEW, IN_PROGRESS, or RESOLVED.' });
      return;
    }

    const feedback = await prisma.feedback.update({
      where: { id },
      data: { status }
    });

    res.json({ success: true, feedback });
  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({ error: 'Failed to update feedback status.' });
  }
}
