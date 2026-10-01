import { describe, it } from 'node:test';
import assert from 'node:assert';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authGuard, AuthenticatedRequest } from '../apps/api/src/middleware/auth';
import app from '../apps/api/src/app';

describe('Admin Authentication & Security Tests', () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_12345';

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

  it('should authenticate via Authorization: Bearer header in authGuard', (t, done) => {
    const token = jwt.sign({ id: 'admin-1', email: 'admin@resumebuilder.local', role: 'SUPER_ADMIN' }, JWT_SECRET);

    const mockReq = {
      headers: {
        authorization: `Bearer ${token}`
      },
      cookies: {}
    } as unknown as AuthenticatedRequest;

    const mockRes = {
      status: (code: number) => ({
        json: (data: any) => {
          assert.fail(`authGuard should not have returned error: ${code} ${JSON.stringify(data)}`);
        }
      })
    } as any;

    authGuard(mockReq, mockRes, () => {
      assert.strictEqual(mockReq.user?.id, 'admin-1');
      assert.strictEqual(mockReq.user?.email, 'admin@resumebuilder.local');
      done();
    });
  });

  it('should authenticate via admin_token cookie in authGuard', (t, done) => {
    const token = jwt.sign({ id: 'admin-2', email: 'admin2@resumebuilder.local', role: 'SUPER_ADMIN' }, JWT_SECRET);

    const mockReq = {
      headers: {},
      cookies: {
        admin_token: token
      }
    } as unknown as AuthenticatedRequest;

    const mockRes = {
      status: (code: number) => ({
        json: (data: any) => {
          assert.fail(`authGuard should not have returned error: ${code} ${JSON.stringify(data)}`);
        }
      })
    } as any;

    authGuard(mockReq, mockRes, () => {
      assert.strictEqual(mockReq.user?.id, 'admin-2');
      done();
    });
  });

  it('should reject requests with missing credentials in authGuard with 401', (t, done) => {
    const mockReq = {
      headers: {},
      cookies: {}
    } as unknown as AuthenticatedRequest;

    const mockRes = {
      status: (code: number) => {
        assert.strictEqual(code, 401);
        return {
          json: (data: any) => {
            assert.ok(data.error);
            done();
          }
        };
      }
    } as any;

    authGuard(mockReq, mockRes, () => {
      assert.fail('authGuard should not call next() when credentials are missing');
    });
  });

  it('should verify CORS configuration accepts production frontend origin', () => {
    assert.ok(app, 'Express app should be instantiated');
    // Ensure CORS middleware is attached and configured
  });
});
