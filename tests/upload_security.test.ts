import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('File Upload Security & Path Traversal Guards', () => {
  it('should validate allowed MIME types and reject unsafe executable files', () => {
    const allowedMime = ['application/pdf', 'image/png', 'image/jpeg'];
    const allowedExt = ['.pdf', '.png', '.jpg', '.jpeg'];

    const testCases = [
      { name: 'resume_template.pdf', mime: 'application/pdf', valid: true },
      { name: 'preview.png', mime: 'image/png', valid: true },
      { name: 'exploit.exe', mime: 'application/x-msdownload', valid: false },
      { name: 'script.sh', mime: 'application/x-sh', valid: false },
      { name: 'webshell.php', mime: 'application/x-httpd-php', valid: false },
      { name: '../../../etc/passwd.pdf', mime: 'application/pdf', valid: true } // Path traversal in filename
    ];

    for (const tc of testCases) {
      const ext = '.' + tc.name.split('.').pop()?.toLowerCase();
      const isMimeOk = allowedMime.includes(tc.mime);
      const isExtOk = allowedExt.includes(ext);
      const passes = isMimeOk && isExtOk;

      assert.strictEqual(passes, tc.valid, `Failed for ${tc.name}`);
    }
  });

  it('should sanitize uploaded filenames against path traversal attacks', () => {
    const sanitizeFilename = (filename: string, uniqueId: string) => {
      const ext = (filename.includes('.') ? '.' + filename.split('.').pop() : '').toLowerCase().replace(/[^a-z0-9.]/g, '');
      return `template-ref-${uniqueId}${ext}`;
    };

    const maliciousName = '../../../../windows/system32/cmd.exe.pdf';
    const sanitized = sanitizeFilename(maliciousName, 'uuid-1234');

    assert.strictEqual(sanitized, 'template-ref-uuid-1234.pdf');
    assert.strictEqual(sanitized.includes('..'), false);
    assert.strictEqual(sanitized.includes('/'), false);
    assert.strictEqual(sanitized.includes('\\'), false);
  });
});
