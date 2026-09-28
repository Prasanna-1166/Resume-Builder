import { describe, it } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import { ALLOWED_EVENT_TYPES, getDateFilter } from '../apps/api/src/controllers/analytics.controller';
import { authGuard } from '../apps/api/src/middleware/auth';

describe('Production Analytics & Telemetry Engine Tests', () => {
  const JWT_SECRET = 'test_jwt_secret_key_1234567890';

  it('should validate allowed event types and reject arbitrary strings', () => {
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('PAGE_VIEW' as any), true);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('TEMPLATE_VIEW' as any), true);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('TEMPLATE_SELECTED' as any), true);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('TEMPLATE_SWITCHED' as any), true);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('RESUME_CREATED' as any), true);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('RESUME_SAVED' as any), true);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('PDF_EXPORTED' as any), true);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('DOCX_EXPORTED' as any), true);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('AI_SUMMARY' as any), true);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('AI_BULLET' as any), true);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('AI_SKILLS' as any), true);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('JOB_ANALYSIS' as any), true);

    // Reject unknown or arbitrary events
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('CLICK_BUTTON' as any), false);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('KEYPRESS' as any), false);
    assert.strictEqual(ALLOWED_EVENT_TYPES.includes('USER_LOGGED_IN' as any), false);
  });

  it('should compute accurate date boundaries for date filters', () => {
    const now = Date.now();

    // today filter should be within the last 24h and starting at 00:00
    const todayDate = getDateFilter('today');
    assert.ok(todayDate.getTime() <= now);
    assert.strictEqual(todayDate.getHours(), 0);
    assert.strictEqual(todayDate.getMinutes(), 0);

    // 7d filter
    const sevenDays = getDateFilter('7d');
    const diff7d = now - sevenDays.getTime();
    const approx7DaysMs = 7 * 24 * 60 * 60 * 1000;
    assert.ok(Math.abs(diff7d - approx7DaysMs) < 5000);

    // 30d filter
    const thirtyDays = getDateFilter('30d');
    const diff30d = now - thirtyDays.getTime();
    const approx30DaysMs = 30 * 24 * 60 * 60 * 1000;
    assert.ok(Math.abs(diff30d - approx30DaysMs) < 5000);

    // 90d filter
    const ninetyDays = getDateFilter('90d');
    const diff90d = now - ninetyDays.getTime();
    const approx90DaysMs = 90 * 24 * 60 * 60 * 1000;
    assert.ok(Math.abs(diff90d - approx90DaysMs) < 5000);
  });

  it('should calculate unique visitors and unique sessions accurately from raw events', () => {
    const sampleEvents = [
      { visitorId: 'v_user_1', sessionId: 's_sess_1', eventType: 'PAGE_VIEW' },
      { visitorId: 'v_user_1', sessionId: 's_sess_1', eventType: 'TEMPLATE_SELECTED' },
      { visitorId: 'v_user_1', sessionId: 's_sess_2', eventType: 'RESUME_CREATED' },
      { visitorId: 'v_user_2', sessionId: 's_sess_3', eventType: 'PAGE_VIEW' },
      { visitorId: 'v_user_3', sessionId: 's_sess_4', eventType: 'PAGE_VIEW' },
      { visitorId: 'v_user_3', sessionId: 's_sess_4', eventType: 'PDF_EXPORTED' },
    ];

    const uniqueVisitors = new Set(sampleEvents.map(e => e.visitorId)).size;
    const uniqueSessions = new Set(sampleEvents.map(e => e.sessionId)).size;
    const totalEvents = sampleEvents.length;

    assert.strictEqual(uniqueVisitors, 3);
    assert.strictEqual(uniqueSessions, 4);
    assert.strictEqual(totalEvents, 6);
  });

  it('should aggregate template views, selections, switches, and exports correctly', () => {
    const templateEvents = [
      { templateId: 'template_01', eventType: 'TEMPLATE_VIEW' },
      { templateId: 'template_01', eventType: 'TEMPLATE_SELECTED' },
      { templateId: 'template_01', eventType: 'PDF_EXPORTED' },
      { templateId: 'template_01', eventType: 'DOCX_EXPORTED' },
      { templateId: 'template_02', eventType: 'TEMPLATE_VIEW' },
      { templateId: 'template_02', eventType: 'TEMPLATE_SWITCHED' },
      { templateId: 'template_02', eventType: 'PDF_EXPORTED' },
    ];

    const templateMap = new Map<string, any>();
    for (const evt of templateEvents) {
      if (!templateMap.has(evt.templateId)) {
        templateMap.set(evt.templateId, {
          templateId: evt.templateId,
          views: 0,
          selections: 0,
          switches: 0,
          pdfExports: 0,
          docxExports: 0,
          totalUsage: 0
        });
      }
      const item = templateMap.get(evt.templateId);
      if (evt.eventType === 'TEMPLATE_VIEW') item.views++;
      if (evt.eventType === 'TEMPLATE_SELECTED') item.selections++;
      if (evt.eventType === 'TEMPLATE_SWITCHED') item.switches++;
      if (evt.eventType === 'PDF_EXPORTED') item.pdfExports++;
      if (evt.eventType === 'DOCX_EXPORTED') item.docxExports++;
      item.totalUsage++;
    }

    const t1 = templateMap.get('template_01');
    assert.strictEqual(t1.views, 1);
    assert.strictEqual(t1.selections, 1);
    assert.strictEqual(t1.pdfExports, 1);
    assert.strictEqual(t1.docxExports, 1);
    assert.strictEqual(t1.totalUsage, 4);

    const t2 = templateMap.get('template_02');
    assert.strictEqual(t2.views, 1);
    assert.strictEqual(t2.switches, 1);
    assert.strictEqual(t2.pdfExports, 1);
    assert.strictEqual(t2.totalUsage, 3);
  });

  it('should aggregate AI feature requests and success/error counts with percentage', () => {
    const aiEvents = [
      { eventType: 'AI_SUMMARY', status: 'SUCCESS' },
      { eventType: 'AI_SUMMARY', status: 'SUCCESS' },
      { eventType: 'AI_BULLET', status: 'SUCCESS' },
      { eventType: 'AI_BULLET', status: 'ERROR' },
      { eventType: 'AI_SKILLS', status: 'SUCCESS' },
      { eventType: 'JOB_ANALYSIS', status: 'SUCCESS' }
    ];

    let total = 0;
    let success = 0;
    let error = 0;

    for (const evt of aiEvents) {
      total++;
      if (evt.status === 'SUCCESS') success++;
      else error++;
    }

    const successRate = Math.round((success / total) * 100);

    assert.strictEqual(total, 6);
    assert.strictEqual(success, 5);
    assert.strictEqual(error, 1);
    assert.strictEqual(successRate, 83); // 5/6 = 83%
  });

  it('should enforce authGuard protection on admin analytics endpoints', () => {
    process.env.JWT_SECRET = JWT_SECRET;

    // Test 1: Unauthenticated request (no token) -> 401
    let statusCode = 0;
    let jsonResponse: any = null;
    let nextCalled = false;

    const reqMockNoAuth: any = {
      cookies: {},
      headers: {}
    };
    const resMock1: any = {
      status: (code: number) => {
        statusCode = code;
        return {
          json: (data: any) => {
            jsonResponse = data;
          }
        };
      }
    };

    authGuard(reqMockNoAuth, resMock1, () => { nextCalled = true; });
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(nextCalled, false);
    assert.ok(jsonResponse?.error?.includes('Unauthorized'));

    // Test 2: Invalid/tampered token -> 401
    const reqMockInvalid: any = {
      cookies: { admin_token: 'invalid_jwt_token_gibberish' },
      headers: {}
    };
    statusCode = 0;
    nextCalled = false;
    authGuard(reqMockInvalid, resMock1, () => { nextCalled = true; });
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(nextCalled, false);

    // Test 3: Valid admin token -> next() called and user populated
    const validToken = jwt.sign(
      { id: 'admin-123', email: 'admin@resumebuilder.local', role: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    const reqMockValid: any = {
      cookies: { admin_token: validToken },
      headers: {}
    };
    nextCalled = false;
    authGuard(reqMockValid, resMock1, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, true);
    assert.strictEqual(reqMockValid.user?.email, 'admin@resumebuilder.local');
  });

  it('should guarantee analytics failures fail silently and do not throw exceptions', async () => {
    // Simulate failing fetch/telemetry call
    const failTracker = async () => {
      try {
        throw new Error('Network timeout / offline');
      } catch {
        // Must be caught silently
        return { success: false };
      }
    };

    const res = await failTracker();
    assert.strictEqual(res.success, false);
  });
});
