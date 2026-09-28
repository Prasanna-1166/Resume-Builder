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
    assert.ok(sparseReport.score <= 70, `Expected sparse score <= 70, got ${sparseReport.score}`);
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

  it('should verify all 28 unique templates are cataloged and registered', () => {
    assert.strictEqual(TEMPLATE_CATALOG.length, 28, `Expected 28 templates in catalog, found ${TEMPLATE_CATALOG.length}`);

    for (const meta of TEMPLATE_CATALOG) {
      const comp = TEMPLATE_REGISTRY[meta.id];
      assert.ok(comp, `Template component missing for ${meta.id}`);
      assert.ok(meta.name.length > 0);
      assert.ok(meta.category);
      assert.ok(['letter', 'a4'].includes(meta.pageSize));
      assert.ok([1, 2].includes(meta.columns));
    }
  });
});
