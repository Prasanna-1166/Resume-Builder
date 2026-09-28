import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const ALLOWED_EVENT_TYPES = [
  'PAGE_VIEW',
  'TEMPLATE_VIEW',
  'TEMPLATE_SELECTED',
  'TEMPLATE_SWITCHED',
  'RESUME_CREATED',
  'RESUME_SAVED',
  'PDF_EXPORTED',
  'DOCX_EXPORTED',
  'AI_SUMMARY',
  'AI_BULLET',
  'AI_SKILLS',
  'JOB_ANALYSIS'
] as const;

export type EventType = (typeof ALLOWED_EVENT_TYPES)[number];

const FORBIDDEN_METADATA_KEYS = [
  'name', 'fullname', 'email', 'phone', 'address', 'summary',
  'experience', 'education', 'skills', 'projects', 'certifications',
  'prompt', 'response', 'jobdescription', 'resume', 'resumedata', 'content'
];

/**
 * Sanitizes arbitrary metadata to guarantee zero PII or large textual inputs are persisted.
 */
function sanitizeMetadata(raw: any): string | null {
  if (!raw || typeof raw !== 'object') return null;
  const safeObj: Record<string, any> = {};

  for (const [key, val] of Object.entries(raw)) {
    const lowerKey = key.toLowerCase();
    if (FORBIDDEN_METADATA_KEYS.some(f => lowerKey.includes(f))) {
      continue; // Strip out sensitive or prompt keys
    }
    if (typeof val === 'string' && val.length < 100) {
      safeObj[key] = val;
    } else if (typeof val === 'number' || typeof val === 'boolean') {
      safeObj[key] = val;
    }
  }

  return Object.keys(safeObj).length > 0 ? JSON.stringify(safeObj) : null;
}

export function getDateFilter(range?: string): Date {
  const now = new Date();
  switch (range) {
    case 'today': {
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      return todayStart;
    }
    case '7d': {
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    case '30d': {
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    case '90d': {
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }
    default: {
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }
}

/**
 * Public ingestion endpoint for telemetry events.
 * Never throws 500 to caller to avoid blocking user actions.
 */
export async function trackEvent(req: Request, res: Response): Promise<void> {
  try {
    const { eventType, visitorId, sessionId, templateId, device, status, metadata } = req.body;

    if (!eventType || !ALLOWED_EVENT_TYPES.includes(eventType as EventType)) {
      res.status(400).json({ error: 'Invalid or missing eventType.' });
      return;
    }

    if (!visitorId || !sessionId) {
      res.status(400).json({ error: 'visitorId and sessionId are required.' });
      return;
    }

    const safeDevice = typeof device === 'string' && ['desktop', 'mobile', 'tablet'].includes(device)
      ? device
      : 'desktop';
    
    const safeStatus = status === 'ERROR' ? 'ERROR' : 'SUCCESS';
    const safeTemplateId = typeof templateId === 'string' && templateId.length < 50 ? templateId : null;
    const sanitizedMeta = sanitizeMetadata(metadata);

    await prisma.analyticsEvent.create({
      data: {
        eventType,
        visitorId: String(visitorId).slice(0, 100),
        sessionId: String(sessionId).slice(0, 100),
        templateId: safeTemplateId,
        device: safeDevice,
        status: safeStatus,
        metadata: sanitizedMeta
      }
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('[Analytics Ingest Error (Non-blocking)]:', error);
    res.status(200).json({ success: false, message: 'Event ingestion failed silently' });
  }
}

/**
 * Admin Overview stats: Unique visitors, sessions, creation, export, and AI counts.
 */
export async function getOverview(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || '30d';
    const startDate = getDateFilter(range);

    const where = {
      createdAt: { gte: startDate }
    };

    const [
      allEvents,
      visitorGroups,
      sessionGroups
    ] = await Promise.all([
      prisma.analyticsEvent.findMany({
        where,
        select: { eventType: true, status: true }
      }),
      prisma.analyticsEvent.groupBy({
        by: ['visitorId'],
        where
      }),
      prisma.analyticsEvent.groupBy({
        by: ['sessionId'],
        where
      })
    ]);

    let resumeCreations = 0;
    let resumeSaves = 0;
    let pdfExports = 0;
    let docxExports = 0;
    let aiRequests = 0;
    let pageViews = 0;

    for (const evt of allEvents) {
      switch (evt.eventType) {
        case 'RESUME_CREATED':
          resumeCreations++;
          break;
        case 'RESUME_SAVED':
          resumeSaves++;
          break;
        case 'PDF_EXPORTED':
          pdfExports++;
          break;
        case 'DOCX_EXPORTED':
          docxExports++;
          break;
        case 'AI_SUMMARY':
        case 'AI_BULLET':
        case 'AI_SKILLS':
        case 'JOB_ANALYSIS':
          aiRequests++;
          break;
        case 'PAGE_VIEW':
          pageViews++;
          break;
      }
    }

    res.json({
      range,
      startDate: startDate.toISOString(),
      uniqueVisitors: visitorGroups.length,
      sessions: sessionGroups.length,
      totalEvents: allEvents.length,
      pageViews,
      resumeCreations,
      resumeSaves,
      pdfExports,
      docxExports,
      aiRequests
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ error: 'Failed to compute analytics overview' });
  }
}

/**
 * Admin Timeseries stats: Bucket counts per day for chart visualizations.
 */
export async function getTimeseries(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || '30d';
    const startDate = getDateFilter(range);

    const events = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      select: {
        eventType: true,
        visitorId: true,
        sessionId: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Bucket by YYYY-MM-DD
    const dayMap = new Map<string, {
      date: string;
      visitors: Set<string>;
      sessions: Set<string>;
      pageViews: number;
      resumes: number;
      exports: number;
      aiRequests: number;
    }>();

    // Fill days in range
    const now = new Date();
    const cursor = new Date(startDate);
    while (cursor <= now) {
      const dateKey = cursor.toISOString().split('T')[0];
      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, {
          date: dateKey,
          visitors: new Set(),
          sessions: new Set(),
          pageViews: 0,
          resumes: 0,
          exports: 0,
          aiRequests: 0
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    for (const evt of events) {
      const dateKey = evt.createdAt.toISOString().split('T')[0];
      let dayData = dayMap.get(dateKey);
      if (!dayData) {
        dayData = {
          date: dateKey,
          visitors: new Set(),
          sessions: new Set(),
          pageViews: 0,
          resumes: 0,
          exports: 0,
          aiRequests: 0
        };
        dayMap.set(dateKey, dayData);
      }

      dayData.visitors.add(evt.visitorId);
      dayData.sessions.add(evt.sessionId);

      if (evt.eventType === 'PAGE_VIEW') {
        dayData.pageViews++;
      } else if (evt.eventType === 'RESUME_CREATED' || evt.eventType === 'RESUME_SAVED') {
        dayData.resumes++;
      } else if (evt.eventType === 'PDF_EXPORTED' || evt.eventType === 'DOCX_EXPORTED') {
        dayData.exports++;
      } else if (
        evt.eventType === 'AI_SUMMARY' ||
        evt.eventType === 'AI_BULLET' ||
        evt.eventType === 'AI_SKILLS' ||
        evt.eventType === 'JOB_ANALYSIS'
      ) {
        dayData.aiRequests++;
      }
    }

    const series = Array.from(dayMap.values()).map(d => ({
      date: d.date,
      visitors: d.visitors.size,
      sessions: d.sessions.size,
      pageViews: d.pageViews,
      resumes: d.resumes,
      exports: d.exports,
      aiRequests: d.aiRequests
    })).sort((a, b) => a.date.localeCompare(b.date));

    res.json({ range, series });
  } catch (error) {
    console.error('Analytics timeseries error:', error);
    res.status(500).json({ error: 'Failed to compute timeseries analytics' });
  }
}

/**
 * Admin Template Analytics: Views, selections, switches, and exports per template.
 */
export async function getTemplateStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || '30d';
    const startDate = getDateFilter(range);

    const events = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: startDate },
        templateId: { not: null },
        eventType: {
          in: ['TEMPLATE_VIEW', 'TEMPLATE_SELECTED', 'TEMPLATE_SWITCHED', 'PDF_EXPORTED', 'DOCX_EXPORTED']
        }
      },
      select: {
        templateId: true,
        eventType: true
      }
    });

    const templateMap = new Map<string, {
      templateId: string;
      views: number;
      selections: number;
      switches: number;
      pdfExports: number;
      docxExports: number;
      totalUsage: number;
    }>();

    for (const evt of events) {
      if (!evt.templateId) continue;
      let stat = templateMap.get(evt.templateId);
      if (!stat) {
        stat = {
          templateId: evt.templateId,
          views: 0,
          selections: 0,
          switches: 0,
          pdfExports: 0,
          docxExports: 0,
          totalUsage: 0
        };
        templateMap.set(evt.templateId, stat);
      }

      if (evt.eventType === 'TEMPLATE_VIEW') stat.views++;
      else if (evt.eventType === 'TEMPLATE_SELECTED') stat.selections++;
      else if (evt.eventType === 'TEMPLATE_SWITCHED') stat.switches++;
      else if (evt.eventType === 'PDF_EXPORTED') stat.pdfExports++;
      else if (evt.eventType === 'DOCX_EXPORTED') stat.docxExports++;

      stat.totalUsage++;
    }

    const templates = Array.from(templateMap.values()).sort((a, b) => b.totalUsage - a.totalUsage);

    res.json({ range, templates });
  } catch (error) {
    console.error('Analytics template stats error:', error);
    res.status(500).json({ error: 'Failed to compute template analytics' });
  }
}

/**
 * Admin AI Analytics: Tool invocations, success/error distribution, and health.
 */
export async function getAiStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const range = (req.query.range as string) || '30d';
    const startDate = getDateFilter(range);

    const aiEvents = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: startDate },
        eventType: {
          in: ['AI_SUMMARY', 'AI_BULLET', 'AI_SKILLS', 'JOB_ANALYSIS']
        }
      },
      select: {
        eventType: true,
        status: true
      }
    });

    const breakdown = {
      summary: { total: 0, success: 0, error: 0 },
      bullet: { total: 0, success: 0, error: 0 },
      skills: { total: 0, success: 0, error: 0 },
      jobAnalysis: { total: 0, success: 0, error: 0 }
    };

    let totalAi = 0;
    let totalSuccess = 0;
    let totalError = 0;

    for (const evt of aiEvents) {
      totalAi++;
      const isSuccess = evt.status === 'SUCCESS';
      if (isSuccess) totalSuccess++;
      else totalError++;

      if (evt.eventType === 'AI_SUMMARY') {
        breakdown.summary.total++;
        if (isSuccess) breakdown.summary.success++;
        else breakdown.summary.error++;
      } else if (evt.eventType === 'AI_BULLET') {
        breakdown.bullet.total++;
        if (isSuccess) breakdown.bullet.success++;
        else breakdown.bullet.error++;
      } else if (evt.eventType === 'AI_SKILLS') {
        breakdown.skills.total++;
        if (isSuccess) breakdown.skills.success++;
        else breakdown.skills.error++;
      } else if (evt.eventType === 'JOB_ANALYSIS') {
        breakdown.jobAnalysis.total++;
        if (isSuccess) breakdown.jobAnalysis.success++;
        else breakdown.jobAnalysis.error++;
      }
    }

    const successRate = totalAi > 0 ? Math.round((totalSuccess / totalAi) * 100) : 100;

    res.json({
      range,
      totalRequests: totalAi,
      successCount: totalSuccess,
      errorCount: totalError,
      successRate,
      breakdown
    });
  } catch (error) {
    console.error('Analytics AI stats error:', error);
    res.status(500).json({ error: 'Failed to compute AI analytics' });
  }
}
