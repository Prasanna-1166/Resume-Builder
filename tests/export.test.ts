import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  generateDocxBlob,
  studentFresherFixture,
  softwareEngineerFixture,
  productManagerFixture,
  sparseResumeFixture,
  longResumeFixture
} from '../packages/resume-core/src/index';

describe('DOCX Export Engine Tests', () => {
  const fixtures = [
    { name: 'Student Fresher', data: studentFresherFixture },
    { name: 'Senior SWE', data: softwareEngineerFixture },
    { name: 'Product Manager', data: productManagerFixture },
    { name: 'Sparse Resume', data: sparseResumeFixture },
    { name: 'Long Executive Resume', data: longResumeFixture }
  ];

  for (const f of fixtures) {
    it(`should generate valid DOCX zip archive for ${f.name}`, async () => {
      const buffer = await generateDocxBlob(f.data);
      assert.ok(buffer instanceof Buffer);
      assert.ok(buffer.length > 1000, `DOCX buffer too small (${buffer.length} bytes)`);

      // Verify ZIP / OpenXML magic header bytes: 0x50 0x4B 0x03 0x04 ('PK\x03\x04')
      assert.strictEqual(buffer[0], 0x50, 'Invalid DOCX magic byte 0');
      assert.strictEqual(buffer[1], 0x4B, 'Invalid DOCX magic byte 1');
      assert.strictEqual(buffer[2], 0x03, 'Invalid DOCX magic byte 2');
      assert.strictEqual(buffer[3], 0x04, 'Invalid DOCX magic byte 3');
    });
  }
});
