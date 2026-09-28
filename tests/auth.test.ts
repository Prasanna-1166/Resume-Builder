import { describe, it } from 'node:test';
import assert from 'node:assert';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Admin Authentication & Security Tests', () => {
  const JWT_SECRET = 'test_jwt_secret_key_1234567890';

  it('should securely hash and verify passwords using bcrypt', async () => {
    const rawPassword = 'AdminSecurePassword2026!';
    const hashed = await bcrypt.hash(rawPassword, 12);

    assert.notStrictEqual(hashed, rawPassword);
    assert.ok(hashed.startsWith('$2'));

    const isMatch = await bcrypt.compare(rawPassword, hashed);
    assert.strictEqual(isMatch, true);

    const isWrong = await bcrypt.compare('WrongPassword123', hashed);
    assert.strictEqual(isWrong, false);
  });

  it('should issue and verify valid admin JWT session tokens', () => {
    const payload = {
      id: 'admin-uuid-1234',
      email: 'admin@resumebuilder.local',
      role: 'SUPER_ADMIN'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    assert.ok(token && typeof token === 'string');

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    assert.strictEqual(decoded.id, payload.id);
    assert.strictEqual(decoded.email, payload.email);
    assert.strictEqual(decoded.role, payload.role);
  });

  it('should reject invalid, tampered, or expired tokens', () => {
    const validToken = jwt.sign({ id: '123' }, JWT_SECRET, { expiresIn: '7d' });
    const tamperedToken = validToken.slice(0, -5) + 'abcde';

    assert.throws(() => {
      jwt.verify(tamperedToken, JWT_SECRET);
    });

    const expiredToken = jwt.sign({ id: '123' }, JWT_SECRET, { expiresIn: '-1s' });
    assert.throws(() => {
      jwt.verify(expiredToken, JWT_SECRET);
    });
  });
});
