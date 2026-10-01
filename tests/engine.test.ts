import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  ResumeDataSchema,
  calculateResumeCompleteness,
  runAtsAudit,
  generateDocxBlob,
  studentFresherFixture,
  softwareEngineerFixture,
  productManagerFixture,
  sparseResumeFixture,
  longResumeFixture
} from '../packages/resume-core/src/index';
import { TEMPLATE_CATALOG, TEMPLATE_REGISTRY } from '../packages/templates/src/index';

describe('Core Resume Engine Tests', () => {
  it('should validate all 5 test fixtures against Zod ResumeDataSchema', () => {
    const fixtures = [
      studentFresherFixture,
      softwareEngineerFixture,
      productManagerFixture,
      sparseResumeFixture,
      longResumeFixture
    ];

    for (const f of fixtures) {
      const parsed = ResumeDataSchema.safeParse(f);
      assert.strictEqual(parsed.success, true, `Fixture ${f.id} failed validation: ${JSON.stringify(parsed)}`);
    }
  });

  it('should accurately calculate deterministic completeness scores', () => {
    const fullReport = calculateResumeCompleteness(studentFresherFixture);
    assert.ok(fullReport.score >= 80, `Expected full score >= 80, got ${fullReport.score}`);
    assert.strictEqual(fullReport.missingCritical.length, 0);

    const sparseReport = calculateResumeCompleteness(sparseResumeFixture);
    assert.ok(sparseReport.score <= 80, `Expected sparse score <= 80, got ${sparseReport.score}`);
    assert.ok(sparseReport.score < fullReport.score, 'Sparse resume should have lower score than full resume');
  });

  it('should run deterministic ATS audit heuristics', () => {
    const atsResult = runAtsAudit(softwareEngineerFixture);
    assert.ok(atsResult.score >= 80);
    assert.ok(atsResult.actionVerbRatio > 50, `Expected action verb ratio > 50%, got ${atsResult.actionVerbRatio}%`);
    assert.ok(atsResult.keywordCount > 5);
  });

  it('should generate valid DOCX buffers from ResumeData', async () => {
    const docxBuffer = await generateDocxBlob(studentFresherFixture);
    assert.ok(docxBuffer instanceof Buffer);
    assert.ok(docxBuffer.length > 500, 'DOCX buffer should be non-empty');
  });

  it('should verify all canonical templates are cataloged and registered (>=30 templates)', () => {
    assert.ok(TEMPLATE_CATALOG.length >= 30, `Expected >= 30 templates in catalog, found ${TEMPLATE_CATALOG.length}`);
    assert.strictEqual(TEMPLATE_CATALOG.length, 38, `Expected exactly 38 templates, found ${TEMPLATE_CATALOG.length}`);

    const resumeCount = TEMPLATE_CATALOG.filter(t => t.documentType === 'RESUME').length;
    const cvCount = TEMPLATE_CATALOG.filter(t => t.documentType === 'CV').length;
    const clCount = TEMPLATE_CATALOG.filter(t => t.documentType === 'COVER_LETTER').length;

    assert.ok(resumeCount >= 20, `Expected >= 20 Resume templates, found ${resumeCount}`);
    assert.ok(cvCount >= 5, `Expected >= 5 CV templates, found ${cvCount}`);
    assert.ok(clCount >= 5, `Expected >= 5 Cover Letter templates, found ${clCount}`);

    for (const meta of TEMPLATE_CATALOG) {
      const comp = TEMPLATE_REGISTRY[meta.id];
      assert.ok(comp, `Template component missing for ${meta.id}`);
      assert.ok(meta.name.length > 0);
      assert.ok(meta.category);
      assert.ok(['letter', 'a4', 'creative'].includes(meta.pageSize));
      assert.ok([1, 2].includes(meta.columns));
    }
  });
});
