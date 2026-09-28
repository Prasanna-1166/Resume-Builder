import { describe, it } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  studentFresherFixture,
  ResumeData
} from '../packages/resume-core/src/index';
import { TEMPLATE_CATALOG, getTemplateComponent } from '../packages/templates/src/index';

describe('Loss-Free Template Switching Invariance Tests', () => {
  it('should switch between all 28 templates without mutating or dropping any ResumeData field', () => {
    // Clone original data
    const initialData: ResumeData = JSON.parse(JSON.stringify(studentFresherFixture));
    let currentData = JSON.parse(JSON.stringify(initialData));

    // Iterate through all 28 templates in sequence
    for (const templateMeta of TEMPLATE_CATALOG) {
      // Switch templateId
      currentData = {
        ...currentData,
        templateId: templateMeta.id
      };

      // Render template component using React.createElement
      const Component = getTemplateComponent(templateMeta.id);
      assert.ok(Component, `Renderer not found for ${templateMeta.id}`);

      const html = renderToString(React.createElement(Component, { data: currentData }));
      assert.ok(html.length > 200, `Template ${templateMeta.id} rendered suspiciously short HTML`);
      assert.ok(html.includes(currentData.personalInfo.fullName), `Template ${templateMeta.id} omitted candidate name`);
    }

    // Switch back to initial template
    currentData.templateId = initialData.templateId;

    // Deep equality check: all personal info, education, experience, projects, skills, etc. must match 100%
    assert.deepStrictEqual(
      currentData.personalInfo,
      initialData.personalInfo,
      'Personal info mutated during template switching'
    );
    assert.deepStrictEqual(
      currentData.education,
      initialData.education,
      'Education mutated during template switching'
    );
    assert.deepStrictEqual(
      currentData.experience,
      initialData.experience,
      'Experience mutated during template switching'
    );
    assert.deepStrictEqual(
      currentData.projects,
      initialData.projects,
      'Projects mutated during template switching'
    );
    assert.deepStrictEqual(
      currentData.skills,
      initialData.skills,
      'Skills mutated during template switching'
    );
    assert.deepStrictEqual(
      currentData.certifications,
      initialData.certifications,
      'Certifications mutated during template switching'
    );
  });
});
