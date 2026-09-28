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
  if (!data.personalInfo.email || !data.personalInfo.email.includes('@')) {
    issues.push({
      id: 'missing-email',
      severity: 'error',
      category: 'contact',
      title: 'Missing or Invalid Email',
      description: 'ATS parsers require a valid email to associate candidate records.',
      suggestion: 'Provide a clean professional email address.'
    });
  }

  if (!data.personalInfo.phone || data.personalInfo.phone.length < 7) {
    issues.push({
      id: 'missing-phone',
      severity: 'error',
      category: 'contact',
      title: 'Missing Phone Number',
      description: 'Recruiters and automated schedulers look for a valid contact number.',
      suggestion: 'Include your phone number with country and area code.'
    });
  }

  if (!data.personalInfo.location) {
    issues.push({
      id: 'missing-location',
      severity: 'warning',
      category: 'contact',
      title: 'Missing Location / City',
      description: 'ATS geo-filters check candidate location for remote vs on-site compatibility.',
      suggestion: 'Add City, State/Country (e.g. San Francisco, CA or Bangalore, India).'
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
      suggestion: 'Add your degree, university, and graduation year.'
    });
  }

  if ((!data.experience || data.experience.length === 0) && (!data.projects || data.projects.length === 0)) {
    issues.push({
      id: 'missing-experience-projects',
      severity: 'error',
      category: 'sections',
      title: 'Missing Experience / Projects',
      description: 'A resume without work experience or technical projects may fail recruiter screening.',
      suggestion: 'Add work experience, internships, or academic/personal projects.'
    });
  }

  // 3. Bullet quality & Action Verbs
  const allBullets: string[] = [];
  data.experience?.forEach(exp => exp.bullets?.forEach(b => allBullets.push(b)));
  data.projects?.forEach(proj => proj.bullets?.forEach(b => allBullets.push(b)));

  let actionVerbCount = 0;
  let metricCount = 0;

  const metricRegex = /\b(\d+(?:\.\d+)?%?|\$\d+(?:\.\d+)?|\d+\+?|\d+x)\b/i;

  allBullets.forEach(b => {
    const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z-]/g, '');
    if (firstWord && STRONG_ACTION_VERBS.has(firstWord)) {
      actionVerbCount++;
    }
    if (metricRegex.test(b)) {
      metricCount++;
    }

    if (b.length > 250) {
      issues.push({
        id: `long-bullet-${b.slice(0, 15)}`,
        severity: 'info',
        category: 'formatting',
        title: 'Long Bullet Point (>250 chars)',
        description: 'Lengthy run-on bullet points reduce readability for human reviewers.',
        suggestion: 'Condense into 1-2 punchy lines highlighting action and result.'
      });
    }
  });

  const actionVerbRatio = allBullets.length > 0 ? actionVerbCount / allBullets.length : 0;

  if (allBullets.length > 0 && actionVerbRatio < 0.5) {
    issues.push({
      id: 'weak-action-verbs',
      severity: 'warning',
      category: 'keywords',
      title: 'Low Action Verb Density',
      description: `Only ${Math.round(actionVerbRatio * 100)}% of bullets begin with recognized strong action verbs (e.g., "Engineered", "Spearheaded", "Reduced").`,
      suggestion: 'Begin bullet points with dynamic past-tense action verbs.'
    });
  }

  if (allBullets.length > 0 && metricCount === 0) {
    issues.push({
      id: 'missing-quantifiable-metrics',
      severity: 'warning',
      category: 'keywords',
      title: 'No Quantifiable Metrics Detected',
      description: 'Resumes with numerical metrics (%, latency, users, revenue) perform 40% better in screenings.',
      suggestion: 'Add factual numbers to highlight impact where applicable (e.g., "reduced latency by 30%").'
    });
  }

  // 4. Skills count
  const skillCount = data.skills?.reduce((acc, cat) => acc + (cat.items?.length || 0), 0) || 0;
  if (skillCount < 5) {
    issues.push({
      id: 'low-skill-count',
      severity: 'warning',
      category: 'keywords',
      title: 'Low Keyword / Skill Count',
      description: 'ATS parsers match job qualifications against skills listed in your profile.',
      suggestion: 'List at least 6-10 specific technologies, frameworks, and methodologies.'
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
