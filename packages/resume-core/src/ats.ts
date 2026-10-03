import { ResumeData, AtsCheckResult, AtsCheckIssue } from './types.js';

const STRONG_ACTION_VERBS = new Set([
  'architected', 'accelerated', 'achieved', 'authored', 'automated', 'built', 'championed',
  'compiled', 'configured', 'constructed', 'coordinated', 'created', 'decreased', 'delivered',
  'deployed', 'designed', 'developed', 'devised', 'directed', 'doubled', 'drove', 'eliminated',
  'engineered', 'enhanced', 'established', 'executed', 'expanded', 'expedited', 'formulated',
  'generated', 'guided', 'headed', 'implemented', 'improved', 'increased', 'initiated',
  'innovated', 'integrated', 'introduced', 'launched', 'led', 'managed', 'maximized',
  'mentored', 'migrated', 'modernized', 'negotiated', 'optimized', 'orchestrated', 'overhauled',
  'pioneered', 'produced', 'programmed', 'published', 're-engineered', 'reduced', 'refactored',
  'redesigned', 'resolved', 'restructured', 'revamped', 'scaled', 'shipped', 'simplified',
  'spearheaded', 'standardized', 'streamlined', 'strengthened', 'structured', 'surpassed',
  'synthesized', 'transformed', 'upgraded', 'validated', 'yielded'
]);

export function runAtsAudit(data: ResumeData): AtsCheckResult {
  const issues: AtsCheckIssue[] = [];

  // 1. Contact checks
  if (!data.personalInfo?.email || !data.personalInfo.email.includes('@')) {
    issues.push({
      id: 'missing-email',
      severity: 'error',
      category: 'contact',
      title: 'Missing or Invalid Email',
      description: 'ATS parsers require a valid email to associate candidate records.',
      suggestion: 'Provide a clean professional email address.',
      actionTab: 'personal',
      actionLabel: 'Add Email'
    });
  }

  if (!data.personalInfo?.phone || data.personalInfo.phone.length < 7) {
    issues.push({
      id: 'missing-phone',
      severity: 'error',
      category: 'contact',
      title: 'Missing Phone Number',
      description: 'Recruiters and automated schedulers look for a valid contact number.',
      suggestion: 'Include your phone number with country and area code.',
      actionTab: 'personal',
      actionLabel: 'Add Phone'
    });
  }

  if (!data.personalInfo?.location) {
    issues.push({
      id: 'missing-location',
      severity: 'warning',
      category: 'contact',
      title: 'Missing Location / City',
      description: 'ATS geo-filters check candidate location for remote vs on-site compatibility.',
      suggestion: 'Add City, State/Country (e.g. San Francisco, CA or London, UK).',
      actionTab: 'personal',
      actionLabel: 'Add Location'
    });
  }

  // 2. Standard section checks
  if (!data.education || data.education.length === 0) {
    issues.push({
      id: 'missing-education',
      severity: 'error',
      category: 'sections',
      title: 'Missing Standard Section: Education',
      description: 'Educational history is a core filter in applicant tracking systems.',
      suggestion: 'Add your degree, institution, and graduation year.',
      actionTab: 'education',
      actionLabel: 'Add Education'
    });
  }

  if ((!data.experience || data.experience.length === 0) && (!data.projects || data.projects.length === 0)) {
    issues.push({
      id: 'missing-experience-projects',
      severity: 'error',
      category: 'sections',
      title: 'Missing Experience / Projects',
      description: 'A resume without work experience or technical projects may fail recruiter screening.',
      suggestion: 'Add work experience, internships, or academic/personal projects.',
      actionTab: 'experience',
      actionLabel: 'Add Experience'
    });
  }

  // 3. Summary check
  if (data.summary && data.summary.length > 600) {
    issues.push({
      id: 'long-summary',
      severity: 'info',
      category: 'formatting',
      title: 'Lengthy Summary (>600 chars)',
      description: 'A concise 2–3 sentence executive summary is easier to scan quickly.',
      suggestion: 'Condense your summary to focus strictly on your primary value proposition.',
      actionTab: 'summary',
      actionLabel: 'Edit Summary'
    });
  }

  // 4. Bullet quality, Action Verbs, Pronouns & Formatting
  const allBullets: string[] = [];
  data.experience?.forEach(exp => exp.bullets?.forEach(b => allBullets.push(b)));
  data.projects?.forEach(proj => proj.bullets?.forEach(b => allBullets.push(b)));

  let actionVerbCount = 0;
  let metricCount = 0;
  let firstPersonCount = 0;

  const metricRegex = /\b(\d+(?:\.\d+)?%?|\$\d+(?:\.\d+)?|\d+\+?|\d+x)\b/i;
  const firstPersonRegex = /\b(i|my|we|our|me)\b/i;

  allBullets.forEach(b => {
    const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z-]/g, '');
    if (firstWord && STRONG_ACTION_VERBS.has(firstWord)) {
      actionVerbCount++;
    }
    if (metricRegex.test(b)) {
      metricCount++;
    }
    if (firstPersonRegex.test(b)) {
      firstPersonCount++;
    }

    if (b.length > 250) {
      issues.push({
        id: `long-bullet-${b.slice(0, 15)}`,
        severity: 'info',
        category: 'formatting',
        title: 'Long Bullet Point (>250 chars)',
        description: 'Lengthy run-on bullet points reduce readability for human reviewers.',
        suggestion: 'Condense into 1-2 punchy lines highlighting action and result.',
        actionTab: 'experience',
        actionLabel: 'Edit Bullet'
      });
    }
  });

  if (firstPersonCount > 0) {
    issues.push({
      id: 'first-person-language',
      severity: 'info',
      category: 'formatting',
      title: 'First-Person Pronouns Detected',
      description: 'Traditional resume style avoids first-person pronouns ("I", "my", "we").',
      suggestion: 'Begin bullet points directly with action verbs (e.g., "Led development of..." instead of "I led...").',
      actionTab: 'experience',
      actionLabel: 'Edit Bullet'
    });
  }

  const actionVerbRatio = allBullets.length > 0 ? actionVerbCount / allBullets.length : 0;

  if (allBullets.length > 0 && actionVerbRatio < 0.5) {
    issues.push({
      id: 'weak-action-verbs',
      severity: 'warning',
      category: 'keywords',
      title: 'Low Action Verb Density',
      description: `Only ${Math.round(actionVerbRatio * 100)}% of bullets begin with recognized strong action verbs (e.g., "Engineered", "Spearheaded", "Delivered").`,
      suggestion: 'Begin bullet points with dynamic past-tense action verbs.',
      actionTab: 'experience',
      actionLabel: 'Improve Verbs'
    });
  }

  if (allBullets.length > 0 && metricCount === 0) {
    issues.push({
      id: 'missing-quantifiable-metrics',
      severity: 'warning',
      category: 'keywords',
      title: 'No Quantifiable Metrics Detected',
      description: 'Resumes with numerical metrics (%, latency, users, revenue) perform significantly better in screenings.',
      suggestion: 'Add factual numbers to highlight impact where applicable (e.g., "reduced build times by 35%").',
      actionTab: 'experience',
      actionLabel: 'Add Metrics'
    });
  }

  // 5. Skills & Duplicates Check
  const allSkillItems: string[] = [];
  const duplicateSkills = new Set<string>();
  const seenSkills = new Set<string>();

  data.skills?.forEach(cat => {
    cat.items?.forEach(item => {
      const normalized = item.trim().toLowerCase();
      if (seenSkills.has(normalized)) {
        duplicateSkills.add(item.trim());
      } else {
        seenSkills.add(normalized);
      }
      allSkillItems.push(item);
    });
  });

  if (duplicateSkills.size > 0) {
    issues.push({
      id: 'duplicate-skills',
      severity: 'info',
      category: 'keywords',
      title: 'Duplicate Skills Detected',
      description: `Skills appear in multiple categories: ${Array.from(duplicateSkills).join(', ')}.`,
      suggestion: 'Consolidate duplicate skills into a single relevant category.',
      actionTab: 'skills',
      actionLabel: 'Fix Duplicates'
    });
  }

  const skillCount = allSkillItems.length;
  if (skillCount < 5) {
    issues.push({
      id: 'low-skill-count',
      severity: 'warning',
      category: 'keywords',
      title: 'Low Keyword / Skill Count',
      description: 'ATS parsers match job qualifications against skills listed in your profile.',
      suggestion: 'List at least 6-10 specific technologies, frameworks, and methodologies.',
      actionTab: 'skills',
      actionLabel: 'Add Skills'
    });
  }

  // Calculate score
  let errorDeduction = issues.filter(i => i.severity === 'error').length * 20;
  let warningDeduction = issues.filter(i => i.severity === 'warning').length * 8;
  let infoDeduction = issues.filter(i => i.severity === 'info').length * 2;

  let score = Math.max(20, 100 - errorDeduction - warningDeduction - infoDeduction);
  let grade: 'A' | 'B' | 'C' | 'Needs Work' = 'A';
  if (score < 60) grade = 'Needs Work';
  else if (score < 75) grade = 'C';
  else if (score < 90) grade = 'B';

  return {
    score,
    grade,
    issues,
    keywordCount: skillCount,
    bulletCount: allBullets.length,
    actionVerbRatio: Math.round(actionVerbRatio * 100)
  };
}
