import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  SKILLS_CATALOG,
  SKILL_CATEGORIES_PRESETS,
  ALL_SKILLS_FLAT,
  getRecommendedSkillsForCategory,
  filterSkillsCatalog
} from '@ai-resume/core';

describe('Feature: Skills Catalog, Custom Skill Entry & Categorized Dropdown Picker', () => {
  it('should contain rich predefined skill categories with extensive industry coverage', () => {
    assert.ok(SKILLS_CATALOG.length >= 8, 'Skills catalog should have at least 8 categories');
    
    const categoryIds = SKILLS_CATALOG.map(c => c.id);
    assert.ok(categoryIds.includes('languages'), 'Must contain languages');
    assert.ok(categoryIds.includes('frameworks'), 'Must contain frameworks');
    assert.ok(categoryIds.includes('databases'), 'Must contain databases');
    assert.ok(categoryIds.includes('cloud_devops'), 'Must contain cloud & devops');
    assert.ok(categoryIds.includes('tools'), 'Must contain developer tools');

    assert.ok(ALL_SKILLS_FLAT.length > 100, `Expected over 100 total curated skills, found ${ALL_SKILLS_FLAT.length}`);
  });

  it('should return smart recommendations for specific category names', () => {
    const langRecs = getRecommendedSkillsForCategory('Programming Languages', ['JavaScript']);
    assert.ok(langRecs.includes('Python'), 'Languages recommendations should include Python');
    assert.ok(langRecs.includes('TypeScript'), 'Languages recommendations should include TypeScript');
    assert.ok(!langRecs.includes('JavaScript'), 'Already existing skill should be filtered out');

    const frameRecs = getRecommendedSkillsForCategory('Frameworks & Libraries', ['React']);
    assert.ok(frameRecs.includes('Next.js'), 'Frameworks recommendations should include Next.js');
    assert.ok(!frameRecs.includes('React'), 'Existing React should be excluded from recommendations');
  });

  it('should filter skills by search query across multiple categories', () => {
    const pyMatches = filterSkillsCatalog('py');
    const matchNames = pyMatches.map(m => m.name.toLowerCase());
    assert.ok(matchNames.some(n => n.includes('python')), 'Search for "py" must include Python');
    assert.ok(matchNames.some(n => n.includes('pytorch')), 'Search for "py" must include PyTorch');

    const dbMatches = filterSkillsCatalog('post', 'databases');
    assert.ok(dbMatches.some(m => m.name.toLowerCase().includes('postgresql')), 'Search in databases must find PostgreSQL');
  });

  it('should provide preset standard category names for 1-click group creation', () => {
    assert.ok(SKILL_CATEGORIES_PRESETS.length > 5);
    assert.ok(SKILL_CATEGORIES_PRESETS.includes('Languages'));
    assert.ok(SKILL_CATEGORIES_PRESETS.includes('Frameworks & Libraries'));
    assert.ok(SKILL_CATEGORIES_PRESETS.includes('Databases & Storage'));
    assert.ok(SKILL_CATEGORIES_PRESETS.includes('Cloud & DevOps'));
  });
});
