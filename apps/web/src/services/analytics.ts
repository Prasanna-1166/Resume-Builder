import { apiClient } from './api';

const VISITOR_STORAGE_KEY = 'ai_resume_visitor_id';
const SESSION_STORAGE_KEY = 'ai_resume_session_id';
const SESSION_LAST_ACTIVE_KEY = 'ai_resume_session_active_ts';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes inactivity timeout

/**
 * Generates a random standard UUID v4 or crypto fallback.
 */
function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Anonymous, non-PII visitor identifier persisted in browser localStorage.
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server_session';
  try {
    let vid = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!vid) {
      vid = `v_${generateUuid()}`;
      localStorage.setItem(VISITOR_STORAGE_KEY, vid);
    }
    return vid;
  } catch {
    return 'anonymous_visitor';
  }
}

/**
 * Anonymous, non-PII session identifier stored in sessionStorage with a 30-minute inactivity rollover.
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  try {
    const now = Date.now();
    const lastActive = parseInt(localStorage.getItem(SESSION_LAST_ACTIVE_KEY) || '0', 10);
    let sid = sessionStorage.getItem(SESSION_STORAGE_KEY);

    // If no session exists or session expired due to 30min inactivity, create fresh session
    if (!sid || (lastActive && now - lastActive > SESSION_TIMEOUT_MS)) {
      sid = `s_${generateUuid()}`;
      sessionStorage.setItem(SESSION_STORAGE_KEY, sid);
    }

    localStorage.setItem(SESSION_LAST_ACTIVE_KEY, String(now));
    return sid;
  } catch {
    return 'anonymous_session';
  }
}

/**
 * Coarse device category for aggregate metrics without fingerprinting.
 */
export function getCoarseDevice(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export type EventType =
  | 'PAGE_VIEW'
  | 'TEMPLATE_VIEW'
  | 'TEMPLATE_SELECTED'
  | 'TEMPLATE_SWITCHED'
  | 'RESUME_CREATED'
  | 'RESUME_SAVED'
  | 'PDF_EXPORTED'
  | 'DOCX_EXPORTED'
  | 'AI_SUMMARY'
  | 'AI_BULLET'
  | 'AI_SKILLS'
  | 'JOB_ANALYSIS';

interface TrackOptions {
  templateId?: string | null;
  status?: 'SUCCESS' | 'ERROR';
  metadata?: Record<string, any>;
}

/**
 * Privacy-preserving event tracker.
 * Guaranteed never to block UI, throw errors, or send personal resume data / AI prompts.
 */
export async function track(eventType: EventType, options: TrackOptions = {}): Promise<void> {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const device = getCoarseDevice();

    // Fire non-blocking async request
    apiClient.trackEvent({
      eventType,
      visitorId,
      sessionId,
      templateId: options.templateId || null,
      device,
      status: options.status || 'SUCCESS',
      metadata: options.metadata
    }).catch(() => {
      // Non-blocking catch
    });
  } catch {
    // Fail silently in all edge-cases
  }
}
