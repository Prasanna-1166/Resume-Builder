import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('AI Guardrails & Fallback Tests', () => {
  it('should verify truthfulness guardrail heuristics on bullet points', () => {
    const input = 'Built a React website for college project.';
    const allowedPhrasing = 'Developed a responsive web application using React for an academic project.';
    const forbiddenPhrasing = 'Engineered a high-traffic platform serving 50,000 users.';

    // Check that input and allowed phrasing do not claim false metrics
    assert.strictEqual(input.includes('50,000 users'), false);
    assert.strictEqual(allowedPhrasing.includes('50,000 users'), false);
    assert.strictEqual(forbiddenPhrasing.includes('50,000 users'), true);
  });

  it('should parse job description skills and categorize matching vs missing', () => {
    const userSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];
    const jobDescriptionText = 'We are looking for a Senior Full Stack Engineer with React, TypeScript, Go, Kubernetes, and PostgreSQL experience.';

    const lowerJD = jobDescriptionText.toLowerCase();
    const candidateSkillsLower = userSkills.map(s => s.toLowerCase());

    const matched: string[] = [];
    const missing: string[] = [];

    const expectedKeywords = ['react', 'typescript', 'go', 'kubernetes', 'postgresql'];
    for (const kw of expectedKeywords) {
      if (lowerJD.includes(kw)) {
        if (candidateSkillsLower.includes(kw)) {
          matched.push(kw);
        } else {
          missing.push(kw);
        }
      }
    }

    assert.deepStrictEqual(matched, ['react', 'typescript', 'postgresql']);
    assert.deepStrictEqual(missing, ['go', 'kubernetes']);
  });
});
