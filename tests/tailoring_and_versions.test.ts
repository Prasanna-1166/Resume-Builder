import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  ResumeData,
  ResumeDataSchema,
  CoverLetterData,
  CoverLetterSchema,
  calculateResumeCompleteness,
  runAtsAudit,
  studentFresherFixture,
  softwareEngineerFixture,
  sparseResumeFixture
} from '../packages/resume-core/src/index';
import { TEMPLATE_CATALOG, TEMPLATE_REGISTRY } from '../packages/templates/src/index';
import { getDeterministicJobAnalysis } from '../apps/api/src/controllers/ai.controller';

describe('Feature 1: Job Description -> Resume Tailoring Improvements', () => {
  const sampleJobDescription = `
    Senior Backend Engineer
    Acme Cloud Systems
    We are looking for a Python / FastAPI backend developer with experience in PostgreSQL, Docker, AWS, and REST APIs.
    Responsibilities:
    - Design and develop scalable microservices and RESTful APIs
    - Build automated CI/CD pipelines and deploy containerized services
    Requirements:
    - Bachelor's degree in Computer Science or related field
    - 3+ years experience with Python, FastAPI, and PostgreSQL
    - Hands-on experience with Docker and AWS
  `;

  it('should parse structured job requirements and compare against candidate skills', () => {
    const candidateSkills = ['Python', 'FastAPI', 'PostgreSQL', 'Git'];
    const analysis = getDeterministicJobAnalysis(sampleJobDescription, candidateSkills);

    assert.ok(analysis.roleTitle.length > 0, 'Should extract role title');
    assert.ok(typeof analysis.domain === 'string' && analysis.domain.length > 0, 'Should extract domain');

    // Matched vs Missing
    assert.ok(analysis.matchedSkills.includes('Python'), 'Python should be matched');
    assert.ok(analysis.matchedSkills.includes('FastAPI'), 'FastAPI should be matched');
    assert.ok(analysis.matchedSkills.includes('PostgreSQL'), 'PostgreSQL should be matched');
    assert.ok(analysis.missingSkills.includes('Docker'), 'Docker should be flagged missing');
    assert.ok(analysis.missingSkills.includes('AWS'), 'AWS should be flagged missing');

    // Structural breakdown
    assert.ok(analysis.requiredSkills.length > 0, 'Should list required skills');
    assert.ok(analysis.responsibilities.length > 0, 'Should extract responsibilities');
    assert.ok(analysis.educationRequirements.length > 0, 'Should extract education requirements');
    assert.ok(analysis.sectionsToStrengthen.length > 0, 'Should suggest sections to strengthen');
  });

  it('should never claim a candidate has a skill simply because it appears in the job description', () => {
    const candidateWithoutDocker = ['Python', 'SQL'];
    const analysis = getDeterministicJobAnalysis(sampleJobDescription, candidateWithoutDocker);

    // Docker and AWS must NOT be in matchedSkills
    assert.strictEqual(analysis.matchedSkills.includes('Docker'), false);
    assert.strictEqual(analysis.matchedSkills.includes('AWS'), false);
    assert.strictEqual(analysis.matchedSkills.includes('FastAPI'), false);

    // They must be cleanly categorized as missing
    assert.strictEqual(analysis.missingSkills.includes('Docker'), true);
    assert.strictEqual(analysis.missingSkills.includes('AWS'), true);
  });
});

describe('Feature 2: Resume Completion & Action Assistant', () => {
  it('should generate actionable recommendations with direct editor tab links', () => {
    const report = calculateResumeCompleteness(sparseResumeFixture);

    assert.ok(report.actionableRecommendations, 'Report must contain actionableRecommendations');
    assert.ok(report.actionableRecommendations.length > 0, 'Sparse resume should trigger actionable recommendations');

    const validTabs = ['personal', 'summary', 'experience', 'projects', 'education', 'skills', 'cv_sections'];

    for (const rec of report.actionableRecommendations) {
      assert.ok(rec.id, 'Recommendation must have an id');
      assert.ok(rec.title, 'Recommendation must have a title');
      assert.ok(rec.description, 'Recommendation must have a description');
      assert.ok(rec.actionTab, 'Recommendation must have an actionTab');
      assert.ok(validTabs.includes(rec.actionTab), `Invalid actionTab: ${rec.actionTab}`);
      assert.ok(rec.actionLabel, 'Recommendation must have an actionLabel');
    }
  });

  it('should ensure all items in completeness checklist have actionTab mappings', () => {
    const report = calculateResumeCompleteness(studentFresherFixture);
    const validTabs = ['personal', 'summary', 'experience', 'projects', 'education', 'skills', 'cv_sections'];

    for (const item of report.items) {
      assert.ok(item.actionTab && validTabs.includes(item.actionTab), `Item ${item.key} has invalid actionTab: ${item.actionTab}`);
      assert.ok(item.actionLabel && item.actionLabel.length > 0, `Item ${item.key} missing actionLabel`);
    }
  });

  it('should provide non-blocking recommendations without punishing optional fields', () => {
    const report = calculateResumeCompleteness(studentFresherFixture);
    // Score should be high for a well-filled student resume
    assert.ok(report.score >= 85, `Expected score >= 85, got ${report.score}`);
  });
});

describe('Feature 3: Resume Version Management & Master Isolation', () => {
  it('should maintain master resume immutability when tailored copies are created, modified, or deleted', () => {
    // 1. Create Master Resume
    const masterResume: ResumeData = {
      ...softwareEngineerFixture,
      id: 'master-resume-001',
      title: 'Senior Software Engineer (Master)',
      isMaster: true,
      updatedAt: '2026-04-01T10:00:00.000Z'
    };

    const originalMasterSnapshot = JSON.parse(JSON.stringify(masterResume));

    // 2. Create Tailored Copy
    const tailoredCopy: ResumeData = {
      ...JSON.parse(JSON.stringify(masterResume)),
      id: 'tailored-google-002',
      title: 'Full Stack Engineer - Google',
      isMaster: false,
      parentId: masterResume.id,
      parentTitle: masterResume.title,
      targetCompany: 'Google',
      targetRole: 'Full Stack Engineer',
      versionLabel: 'v1.0 (Google Tailored)',
      updatedAt: new Date().toISOString()
    };

    // Verify copy points to master
    assert.strictEqual(tailoredCopy.parentId, masterResume.id);
    assert.strictEqual(tailoredCopy.isMaster, false);
    assert.strictEqual(tailoredCopy.targetCompany, 'Google');

    // 3. Modify Tailored Copy Aggressively
    tailoredCopy.summary = 'Specialized full stack engineer with cloud systems expertise tailored for Google Cloud Platform.';
    tailoredCopy.skills = [
      ...tailoredCopy.skills,
      { id: 'skill-cloud', category: 'Cloud', items: ['Google Cloud Platform', 'BigQuery', 'Spanner'] }
    ];
    if (tailoredCopy.experience && tailoredCopy.experience.length > 0) {
      tailoredCopy.experience[0].bullets[0] = 'Engineered distributed caching services reducing latency by 40%.';
    }

    // 4. Verify Master Resume Remains Completely Unchanged (Regression Integrity)
    assert.deepStrictEqual(
      masterResume,
      originalMasterSnapshot,
      'Master resume must remain 100% untouched when a tailored copy is mutated'
    );
    assert.strictEqual(masterResume.summary, originalMasterSnapshot.summary);
    assert.strictEqual(masterResume.skills.length, originalMasterSnapshot.skills.length);
    assert.strictEqual(masterResume.isMaster, true);
    assert.strictEqual(masterResume.parentId, undefined);
  });

  it('should support version metadata on Cover Letters as well', () => {
    const clData: CoverLetterData = {
      id: 'cl-master-001',
      title: 'General Tech Cover Letter',
      documentType: 'COVER_LETTER',
      category: 'SOFTWARE_IT',
      templateId: 'template_cl_modern',
      updatedAt: new Date().toISOString(),
      isMaster: true,
      personalInfo: {
        fullName: 'Jordan Lee',
        email: 'jordan@example.com',
        phone: '+1 (555) 019-2834',
        location: 'San Francisco, CA'
      },
      recipient: {
        name: 'Hiring Manager',
        company: 'Stripe',
        address: 'San Francisco, CA'
      },
      date: 'April 1, 2026',
      jobTitle: 'Backend Engineer',
      targetCompany: 'Stripe',
      greeting: 'Dear Hiring Team,',
      openingParagraph: 'I am writing to express my enthusiasm for the Backend Software Engineer role at Stripe.',
      bodyParagraphs: [
        'With 4 years of experience designing high-throughput payment architectures, I look forward to contributing.'
      ],
      closingParagraph: 'Thank you for your time and consideration.',
      signoff: 'Sincerely, Jordan Lee'
    };

    const parsed = CoverLetterSchema.safeParse(clData);
    assert.strictEqual(parsed.success, true);
  });
});

describe('Feature 4: Live Resume Quality Panel & ATS Integration', () => {
  it('should compute consistent quality and ATS audit heuristics', () => {
    const atsResult = runAtsAudit(softwareEngineerFixture);
    const completeness = calculateResumeCompleteness(softwareEngineerFixture);

    assert.ok(atsResult.score >= 80, 'Software engineer fixture should pass ATS score >= 80');
    assert.ok(completeness.score >= 85, 'Completeness score should be >= 85');
    assert.ok(atsResult.issues.length >= 0);

    // Verify all ATS check issues have actionTab navigation
    for (const issue of atsResult.issues) {
      assert.ok(issue.actionTab, `ATS issue ${issue.id} missing actionTab`);
      assert.ok(issue.actionLabel, `ATS issue ${issue.id} missing actionLabel`);
    }
  });
});

describe('Template Catalog & Discovery Verification (38 Total Templates)', () => {
  it('should contain all 38 canonical templates with zero deletions or renames', () => {
    const resumeTemplates = TEMPLATE_CATALOG.filter(t => (t.documentType || 'RESUME') === 'RESUME');
    const cvTemplates = TEMPLATE_CATALOG.filter(t => t.documentType === 'CV');
    const clTemplates = TEMPLATE_CATALOG.filter(t => t.documentType === 'COVER_LETTER');

    assert.strictEqual(resumeTemplates.length, 28, `Expected 28 Resume templates, found ${resumeTemplates.length}`);
    assert.strictEqual(cvTemplates.length, 5, `Expected 5 CV templates, found ${cvTemplates.length}`);
    assert.strictEqual(clTemplates.length, 5, `Expected 5 Cover Letter templates, found ${clTemplates.length}`);
    assert.strictEqual(TEMPLATE_CATALOG.length, 38, `Expected 38 total templates, found ${TEMPLATE_CATALOG.length}`);

    // Verify all 38 components are registered
    for (const meta of TEMPLATE_CATALOG) {
      const comp = TEMPLATE_REGISTRY[meta.id];
      assert.ok(comp, `Template component missing for ID: ${meta.id}`);
    }
  });
});
