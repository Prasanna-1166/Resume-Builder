import { describe, it } from 'node:test';
import assert from 'node:assert';
import app from '../apps/api/src/app';

describe('Render Reverse Proxy & Trust Proxy Configuration Tests', () => {
  it('should have Express trust proxy configured for reverse proxy deployments', () => {
    const trustProxySetting = app.get('trust proxy');
    // In Express, setting 'trust proxy' to 1 creates a hop counter function or returns 1
    assert.ok(
      trustProxySetting === 1 ||
      (typeof trustProxySetting === 'function' && trustProxySetting('127.0.0.1', 1) === true),
      'Express app must have trust proxy enabled (1 hop) for Render deployment'
    );
  });
});
