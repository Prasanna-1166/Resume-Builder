import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { geminiClient, GEMINI_MODEL } from '../config/gemini';

export async function getHealth(_req: Request, res: Response): Promise<void> {
  try {
    let dbStatus = 'healthy';
    let totalTemplates = 0;
    let activeTemplates = 0;
    let pendingTemplates = 0;

    try {
      totalTemplates = await prisma.template.count();
      activeTemplates = await prisma.template.count({ where: { status: 'ACTIVE' } });
      pendingTemplates = await prisma.template.count({ where: { status: 'PENDING' } });
    } catch (e) {
      dbStatus = 'unreachable';
    }

    const memory = process.memoryUsage();

    res.json({
      status: 'online',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        totalTemplates,
        activeTemplates,
        pendingTemplates
      },
      aiService: {
        configured: Boolean(geminiClient),
        model: GEMINI_MODEL,
        provider: 'Google Gemini (@google/genai)'
      },
      system: {
        uptimeSeconds: Math.floor(process.uptime()),
        heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
        nodeVersion: process.version
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ status: 'error', error: 'System health check failed.' });
  }
}
