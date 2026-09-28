import { describe, it } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  studentFresherFixture,
  softwareEngineerFixture,
  productManagerFixture,
  sparseResumeFixture,
  longResumeFixture
} from '../packages/resume-core/src/index';
import { TEMPLATE_CATALOG, TEMPLATE_REGISTRY } from '../packages/templates/src/index';

describe('All 28 Templates Rendering & Visual Stability Matrix', () => {
  const fixtures = [
    { name: 'Student Fresher', data: studentFresherFixture },
    { name: 'Senior SWE', data: softwareEngineerFixture },
    { name: 'Product Manager', data: productManagerFixture },
    { name: 'Sparse Resume', data: sparseResumeFixture },
    { name: 'Long Executive Resume', data: longResumeFixture }
  ];

  for (const meta of TEMPLATE_CATALOG) {
    it(`should render template [${meta.id}] "${meta.name}" across all 5 test fixtures without errors`, () => {
      const TemplateComponent = TEMPLATE_REGISTRY[meta.id];
      assert.ok(TemplateComponent, `Missing component for ${meta.id}`);

      for (const fixture of fixtures) {
        const html = renderToString(<TemplateComponent data={fixture.data} />);
        assert.ok(html.length > 200, `Rendered HTML too short for ${meta.id} on ${fixture.name}`);
        assert.ok(html.includes(fixture.data.personalInfo.fullName), `HTML missing candidate name for ${meta.id}`);
      }
    });
  }
});
