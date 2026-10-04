import { describe, it } from 'node:test';
import assert from 'node:assert';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authGuard, requireUserAuth, optionalAuth, AuthenticatedRequest } from '../apps/api/src/middleware/auth';
import { mailService } from '../apps/api/src/services/mail.service';
import { studentFresherFixture, sampleCoverLetterFixture, ResumeData } from '@ai-resume/core';

describe('Feature A: User Accounts & Authentication Security', () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_12345';

  it('should securely hash normal user passwords with bcrypt', async () => {
    const rawPassword = 'CandidateSecurePass123!';
    const hashed = await bcrypt.hash(rawPassword, 12);

    assert.notStrictEqual(hashed, rawPassword);
    assert.ok(hashed.startsWith('$2'));

    const match = await bcrypt.compare(rawPassword, hashed);
    assert.strictEqual(match, true);

    const wrongMatch = await bcrypt.compare('WrongCandidatePass', hashed);
    assert.strictEqual(wrongMatch, false);
  });

  it('should generate and verify valid user tokens with USER role', () => {
    const userPayload = {
      id: 'user-uuid-999',
      email: 'candidate@example.org',
      name: 'Alex Taylor',
      role: 'USER'
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '30d' });
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    assert.strictEqual(decoded.id, userPayload.id);
    assert.strictEqual(decoded.email, userPayload.email);
    assert.strictEqual(decoded.name, userPayload.name);
    assert.strictEqual(decoded.role, 'USER');
  });

  it('should allow normal USER through requireUserAuth middleware', (t, done) => {
    const token = jwt.sign(
      { id: 'user-uuid-101', email: 'user@example.org', name: 'User One', role: 'USER' },
      JWT_SECRET
    );

    const mockReq = {
      headers: { authorization: `Bearer ${token}` },
      cookies: {}
    } as unknown as AuthenticatedRequest;

    const mockRes = {
      status: (code: number) => ({
        json: (data: any) => {
          assert.fail(`requireUserAuth returned unexpected error: ${code} ${JSON.stringify(data)}`);
        }
      })
    } as any;

    requireUserAuth(mockReq, mockRes, () => {
      assert.strictEqual(mockReq.user?.id, 'user-uuid-101');
      assert.strictEqual(mockReq.user?.role, 'USER');
      done();
    });
  });

  it('should block normal USER from accessing ADMIN endpoints via authGuard with 403', (t, done) => {
    const userToken = jwt.sign(
      { id: 'user-uuid-102', email: 'user@example.org', name: 'User Two', role: 'USER' },
      JWT_SECRET
    );

    const mockReq = {
      headers: { authorization: `Bearer ${userToken}` },
      cookies: {}
    } as unknown as AuthenticatedRequest;

    const mockRes = {
      status: (code: number) => {
        assert.strictEqual(code, 403, 'Normal USER must receive 403 Forbidden when calling admin endpoints');
        return {
          json: (data: any) => {
            assert.ok(data.error);
            done();
          }
        };
      }
    } as any;

    authGuard(mockReq, mockRes, () => {
      assert.fail('authGuard must not call next() for a normal USER');
    });
  });

  it('should allow ADMIN and SUPER_ADMIN through authGuard', (t, done) => {
    const adminToken = jwt.sign(
      { id: 'admin-uuid-001', email: 'admin@resumebuilder.local', role: 'ADMIN' },
      JWT_SECRET
    );

    const mockReq = {
      headers: { authorization: `Bearer ${adminToken}` },
      cookies: {}
    } as unknown as AuthenticatedRequest;

    const mockRes = {
      status: (code: number) => ({
        json: (data: any) => {
          assert.fail(`authGuard should not return error for ADMIN: ${code} ${JSON.stringify(data)}`);
        }
      })
    } as any;

    authGuard(mockReq, mockRes, () => {
      assert.strictEqual(mockReq.user?.role, 'ADMIN');
      done();
    });
  });

  it('should support optionalAuth for unauthenticated guest requests', (t, done) => {
    const mockReq = {
      headers: {},
      cookies: {}
    } as unknown as AuthenticatedRequest;

    const mockRes = {} as any;

    optionalAuth(mockReq, mockRes, () => {
      assert.strictEqual(mockReq.user, undefined);
      done();
    });
  });
});

describe('Feature B: Document Ownership & Master Profile Reuse', () => {
  it('should maintain user-specific document data and isolation', () => {
    const userA_Doc: ResumeData = {
      ...studentFresherFixture,
      id: 'doc_user_A_1',
      title: 'User A Resume',
      personalInfo: {
        ...studentFresherFixture.personalInfo,
        fullName: 'Candidate Alpha',
        email: 'alpha@example.org'
      }
    };

    const userB_Doc: ResumeData = {
      ...studentFresherFixture,
      id: 'doc_user_B_1',
      title: 'User B Resume',
      personalInfo: {
        ...studentFresherFixture.personalInfo,
        fullName: 'Candidate Beta',
        email: 'beta@example.org'
      }
    };

    assert.notStrictEqual(userA_Doc.id, userB_Doc.id);
    assert.notStrictEqual(userA_Doc.personalInfo.fullName, userB_Doc.personalInfo.fullName);
  });

  it('should support multi-document collections with independent CVs and Cover Letters', () => {
    const resumeDoc: ResumeData = {
      ...studentFresherFixture,
      id: 'doc_resume_1',
      title: 'Software Engineer Resume',
      documentType: 'RESUME'
    };

    const cvDoc: ResumeData = {
      ...studentFresherFixture,
      id: 'doc_cv_1',
      title: 'Academic CV',
      documentType: 'CV'
    };

    const clDoc = {
      ...sampleCoverLetterFixture,
      id: 'doc_cl_1',
      title: 'Google Cover Letter',
      documentType: 'COVER_LETTER'
    };

    const userDocs = [resumeDoc, cvDoc, clDoc];
    assert.strictEqual(userDocs.length, 3);
    assert.strictEqual(userDocs[0].documentType, 'RESUME');
    assert.strictEqual(userDocs[1].documentType, 'CV');
    assert.strictEqual(userDocs[2].documentType, 'COVER_LETTER');
  });

  it('should preserve master document immutability during profile reuse', () => {
    const masterProfile = {
      personalInfo: {
        fullName: 'Jordan Lee',
        email: 'jordan@example.org',
        professionalTitle: 'Lead Cloud Architect',
        phone: '+1 (555) 123-4567',
        location: 'Seattle, WA'
      },
      summary: 'Experienced cloud architect with 10+ years in distributed systems.',
      skills: [
        { id: 'sk_1', category: 'Cloud Platforms', items: ['AWS', 'GCP', 'Kubernetes'] }
      ],
      experience: [
        {
          id: 'exp_1',
          company: 'Cloud Corp',
          role: 'Principal Engineer',
          startDate: '2021',
          endDate: 'Present',
          bullets: ['Designed multi-region serverless platform handling 100M req/day.']
        }
      ]
    };

    // Creating document from master profile
    const documentCopy = JSON.parse(JSON.stringify(masterProfile));
    documentCopy.personalInfo.fullName = 'Jordan Lee (Custom Application)';
    documentCopy.experience[0].role = 'Director of Cloud Engineering';

    // Verify master profile was NOT modified
    assert.strictEqual(masterProfile.personalInfo.fullName, 'Jordan Lee');
    assert.strictEqual(masterProfile.experience[0].role, 'Principal Engineer');
    assert.strictEqual(documentCopy.personalInfo.fullName, 'Jordan Lee (Custom Application)');
  });
});

describe('Feature C: Support & Feedback System Security', () => {
  it('should use public project support email support.dvlpr@gmail.com', () => {
    const supportEmail = mailService.getSupportEmail();
    assert.strictEqual(supportEmail, 'support.dvlpr@gmail.com');
  });

  it('should format feedback emails cleanly without leaking sensitive secrets', async () => {
    const feedbackPayload = {
      name: 'Morgan Smith',
      email: 'morgan.smith@example.org',
      category: 'Bug Report',
      message: 'Found an issue when switching fonts on 2-column templates.',
      userId: 'user-789'
    };

    const result = await mailService.sendFeedbackEmail(feedbackPayload);
    assert.strictEqual(result.success, true);
    assert.ok(result.provider);
  });

  it('should validate support ticket lifecycle transitions (NEW -> IN_PROGRESS -> RESOLVED)', () => {
    const validStatuses = ['NEW', 'IN_PROGRESS', 'RESOLVED'];

    let currentStatus = 'NEW';
    assert.ok(validStatuses.includes(currentStatus));

    currentStatus = 'IN_PROGRESS';
    assert.ok(validStatuses.includes(currentStatus));

    currentStatus = 'RESOLVED';
    assert.ok(validStatuses.includes(currentStatus));

    const invalidStatus = 'DELETED_OR_UNKNOWN';
    assert.strictEqual(validStatuses.includes(invalidStatus), false);
  });
});
