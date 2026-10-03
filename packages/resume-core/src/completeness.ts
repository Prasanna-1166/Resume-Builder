import { ResumeData, CompletenessReport, CompletenessItem, CareerDocument, ActionableRecommendation } from './types.js';
import { CoverLetterData } from './coverLetter.js';

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

export function calculateResumeCompleteness(doc: CareerDocument | ResumeData): CompletenessReport {
  const items: CompletenessItem[] = [];
  const recommendations: string[] = [];
  const actionableRecommendations: ActionableRecommendation[] = [];

  const docType = doc.documentType || 'RESUME';

  // -------------------------------------------------------------
  // 1. Cover Letter Specific Completeness Checks
  // -------------------------------------------------------------
  if (docType === 'COVER_LETTER') {
    const cl = doc as CoverLetterData;
    const hasName = Boolean(cl.personalInfo?.fullName && cl.personalInfo.fullName.trim().length > 1);
    items.push({
      key: 'name',
      label: 'Candidate Name',
      completed: hasName,
      required: true,
      category: 'contact',
      severity: hasName ? 'info' : 'critical',
      actionTab: 'personal',
      actionLabel: 'Add Candidate Name',
      message: hasName ? undefined : 'Add your name to the letterhead.'
    });

    const hasContact = Boolean(cl.personalInfo?.email && cl.personalInfo.email.includes('@'));
    items.push({
      key: 'email',
      label: 'Contact Email',
      completed: hasContact,
      required: true,
      category: 'contact',
      severity: hasContact ? 'info' : 'critical',
      actionTab: 'personal',
      actionLabel: 'Add Contact Email',
      message: hasContact ? undefined : 'Provide your contact email address.'
    });

    const hasTarget = Boolean(cl.jobTitle && (cl.targetCompany || cl.recipient?.company));
    items.push({
      key: 'targetRole',
      label: 'Target Role & Company',
      completed: hasTarget,
      required: true,
      category: 'summary',
      severity: hasTarget ? 'info' : 'warning',
      actionTab: 'recipient',
      actionLabel: 'Set Target Role',
      message: hasTarget ? undefined : 'Specify the target position and organization name.'
    });

    const hasOpening = Boolean(cl.openingParagraph && cl.openingParagraph.trim().length > 20);
    items.push({
      key: 'opening',
      label: 'Opening Statement',
      completed: hasOpening,
      required: true,
      category: 'summary',
      severity: hasOpening ? 'info' : 'warning',
      actionTab: 'letter',
      actionLabel: 'Write Opening',
      message: hasOpening ? undefined : 'State the role you are applying for and your motivation.'
    });

    const hasBody = Boolean(cl.bodyParagraphs && cl.bodyParagraphs.length > 0 && cl.bodyParagraphs.some(p => p.trim().length > 30));
    items.push({
      key: 'body',
      label: 'Body Paragraphs (Evidence)',
      completed: hasBody,
      required: true,
      category: 'experience',
      severity: hasBody ? 'info' : 'critical',
      actionTab: 'letter',
      actionLabel: 'Add Body Paragraph',
      message: hasBody ? undefined : 'Highlight 1–2 key achievements aligned with the role.'
    });

    const hasClosing = Boolean(cl.closingParagraph && cl.closingParagraph.trim().length > 15);
    items.push({
      key: 'closing',
      label: 'Closing & Call to Action',
      completed: hasClosing,
      required: true,
      category: 'structure',
      severity: hasClosing ? 'info' : 'warning',
      actionTab: 'letter',
      actionLabel: 'Add Closing',
      message: hasClosing ? undefined : 'Include a courteous closing thanking the reader.'
    });

    if (!hasTarget) {
      recommendations.push('Specify the target role and company name for higher impact.');
      actionableRecommendations.push({
        id: 'rec-target',
        title: 'Specify Target Role & Company',
        description: 'Specifying the exact job title and company increases personalization and callback rates.',
        severity: 'warning',
        category: 'summary',
        actionTab: 'recipient',
        actionLabel: 'Set Target Role'
      });
    }

    if (!hasBody) {
      recommendations.push('Add a paragraph connecting your technical skills to the job requirements.');
      actionableRecommendations.push({
        id: 'rec-body',
        title: 'Add Supporting Evidence Paragraph',
        description: 'Highlight 1-2 core achievements connecting your background directly to the role requirements.',
        severity: 'critical',
        category: 'experience',
        actionTab: 'letter',
        actionLabel: 'Add Body Paragraph'
      });
    }

    const totalCount = items.length;
    const completedCount = items.filter(i => i.completed).length;
    const score = Math.round((completedCount / totalCount) * 100);
    const missingCritical = items.filter(i => i.required && !i.completed).map(i => i.label);

    return {
      score,
      completedCount,
      totalCount,
      items,
      missingCritical,
      recommendations,
      actionableRecommendations
    };
  }

  // -------------------------------------------------------------
  // 2. Resume / CV Completeness Checks
  // -------------------------------------------------------------
  const data = doc as ResumeData;

  // Personal Info checks
  const hasName = Boolean(data.personalInfo?.fullName && data.personalInfo.fullName.trim().length > 1);
  items.push({
    key: 'name',
    label: 'Full Name',
    completed: hasName,
    required: true,
    category: 'contact',
    severity: hasName ? 'info' : 'critical',
    actionTab: 'personal',
    actionLabel: 'Add Full Name',
    message: hasName ? undefined : 'Add your full name to the header.'
  });

  const hasEmail = Boolean(data.personalInfo?.email && data.personalInfo.email.includes('@'));
  items.push({
    key: 'email',
    label: 'Email Address',
    completed: hasEmail,
    required: true,
    category: 'contact',
    severity: hasEmail ? 'info' : 'critical',
    actionTab: 'personal',
    actionLabel: 'Add Email',
    message: hasEmail ? undefined : 'Add a valid contact email.'
  });

  const hasPhone = Boolean(data.personalInfo?.phone && data.personalInfo.phone.trim().length >= 7);
  items.push({
    key: 'phone',
    label: 'Phone Number',
    completed: hasPhone,
    required: true,
    category: 'contact',
    severity: hasPhone ? 'info' : 'critical',
    actionTab: 'personal',
    actionLabel: 'Add Phone',
    message: hasPhone ? undefined : 'Add your phone number with country code.'
  });

  const hasLocation = Boolean(data.personalInfo?.location && data.personalInfo.location.trim().length > 1);
  items.push({
    key: 'location',
    label: 'Location (City, Country)',
    completed: hasLocation,
    required: true,
    category: 'contact',
    severity: hasLocation ? 'info' : 'warning',
    actionTab: 'personal',
    actionLabel: 'Add Location',
    message: hasLocation ? undefined : 'Add your city and region.'
  });

  const hasLinkedIn = Boolean(data.personalInfo?.linkedin && data.personalInfo.linkedin.trim().length > 3);
  items.push({
    key: 'linkedin',
    label: 'LinkedIn Profile',
    completed: hasLinkedIn,
    required: false,
    category: 'contact',
    severity: 'info',
    actionTab: 'personal',
    actionLabel: 'Add LinkedIn',
    message: hasLinkedIn ? undefined : 'Consider adding a LinkedIn profile link.'
  });

  const hasGithubOrPortfolio = Boolean(
    (data.personalInfo?.github && data.personalInfo.github.trim().length > 3) ||
    (data.personalInfo?.portfolio && data.personalInfo.portfolio.trim().length > 3) ||
    (data.personalInfo?.website && data.personalInfo.website.trim().length > 3)
  );

  // Summary check
  const summaryLength = data.summary ? data.summary.trim().length : 0;
  const hasSummary = summaryLength > 25;
  const isSummaryTooLong = summaryLength > 600;
  items.push({
    key: 'summary',
    label: docType === 'CV' ? 'Research Statement / Summary' : 'Professional Summary',
    completed: hasSummary,
    required: false,
    category: 'summary',
    severity: !hasSummary ? 'warning' : isSummaryTooLong ? 'info' : 'info',
    actionTab: 'summary',
    actionLabel: !hasSummary ? 'Add Summary' : isSummaryTooLong ? 'Condense Summary' : 'Edit Summary',
    message: hasSummary ? (isSummaryTooLong ? 'Summary is longer than 600 characters; consider condensing.' : undefined) : 'A 2-3 sentence overview highlights your unique expertise.'
  });

  // Education check
  const hasEducation = Boolean(data.education && data.education.length > 0 && data.education.some(e => e.institution && e.degree));
  items.push({
    key: 'education',
    label: 'Education History',
    completed: hasEducation,
    required: true,
    category: 'education',
    severity: hasEducation ? 'info' : 'critical',
    actionTab: 'education',
    actionLabel: 'Add Education',
    message: hasEducation ? undefined : 'Add at least one educational degree or certificate.'
  });

  // Work Experience / Projects check
  const hasExperience = Boolean(data.experience && data.experience.length > 0 && data.experience.some(e => e.company && e.bullets?.length > 0));
  const hasProjects = Boolean(data.projects && data.projects.length > 0 && data.projects.some(p => p.name && p.bullets?.length > 0));

  items.push({
    key: 'experience',
    label: 'Experience or Projects',
    completed: hasExperience || hasProjects,
    required: true,
    category: 'experience',
    severity: (hasExperience || hasProjects) ? 'info' : 'critical',
    actionTab: hasExperience ? 'experience' : 'projects',
    actionLabel: hasExperience ? 'Edit Experience' : 'Add Experience',
    message: (hasExperience || hasProjects) ? undefined : 'Add relevant work experience, internships, or technical projects.'
  });

  // Skills check
  const skillCount = data.skills?.reduce((acc, cat) => acc + (cat.items?.length || 0), 0) || 0;
  const hasSkills = skillCount >= 4;
  items.push({
    key: 'skills',
    label: 'Skills Inventory',
    completed: hasSkills,
    required: true,
    category: 'skills',
    severity: hasSkills ? 'info' : 'critical',
    actionTab: 'skills',
    actionLabel: 'Add Skills',
    message: hasSkills ? undefined : 'List at least 4 key technical or domain skills.'
  });

  // CV-Specific Academic Sections Check
  if (docType === 'CV') {
    const hasResearchOrPubs = Boolean(
      (data.research && data.research.length > 0) ||
      (data.publications && data.publications.length > 0) ||
      (data.conferences && data.conferences.length > 0)
    );
    items.push({
      key: 'scholarlySections',
      label: 'Research & Scholarly Output',
      completed: hasResearchOrPubs,
      required: false,
      category: 'scholarly',
      severity: hasResearchOrPubs ? 'info' : 'warning',
      actionTab: 'cv_sections',
      actionLabel: 'Add Research/Pubs',
      message: hasResearchOrPubs ? undefined : 'Include research projects, peer-reviewed publications, or conference presentations.'
    });
  }

  // Actionable Deep Heuristics (Experience bullets, action verbs, metrics, duplicate skills)
  const allBullets: string[] = [];
  data.experience?.forEach(exp => exp.bullets?.forEach(b => allBullets.push(b)));
  data.projects?.forEach(proj => proj.bullets?.forEach(b => allBullets.push(b)));

  let actionVerbCount = 0;
  let metricCount = 0;
  let firstPersonCount = 0;
  let longBulletCount = 0;

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
      longBulletCount++;
    }
  });

  // Duplicate skills check
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
    });
  });

  // -------------------------------------------------------------
  // Generate Actionable Recommendations
  // -------------------------------------------------------------
  if (!hasSummary) {
    recommendations.push('Add a concise professional summary tailored to your target position.');
    actionableRecommendations.push({
      id: 'rec-summary-missing',
      title: 'Add Professional Summary',
      description: 'A 2-3 sentence overview provides an immediate hook for recruiters scanning your application.',
      severity: 'warning',
      category: 'summary',
      actionTab: 'summary',
      actionLabel: 'Add Summary'
    });
  } else if (isSummaryTooLong) {
    recommendations.push('Condense professional summary to 2-3 concise sentences for faster scanning.');
    actionableRecommendations.push({
      id: 'rec-summary-long',
      title: 'Condense Summary',
      description: 'Executive summaries perform best when kept under 400-500 characters.',
      severity: 'info',
      category: 'summary',
      actionTab: 'summary',
      actionLabel: 'Edit Summary'
    });
  }

  if (!hasLinkedIn && !hasGithubOrPortfolio) {
    recommendations.push('Add a LinkedIn or portfolio link to increase response rates.');
    actionableRecommendations.push({
      id: 'rec-links',
      title: 'Add Professional Links',
      description: 'Adding LinkedIn, GitHub, or a portfolio gives recruiters verified evidence of your work.',
      severity: 'info',
      category: 'contact',
      actionTab: 'personal',
      actionLabel: 'Add Links'
    });
  }

  if (allBullets.length > 0 && metricCount === 0) {
    recommendations.push('Add measurable results (percentages, latency, scale) to your experience bullets.');
    actionableRecommendations.push({
      id: 'rec-metrics',
      title: 'Add Measurable Results',
      description: 'Include factual metrics (e.g. "improved throughput by 25%", "processed 10k daily requests") if available.',
      severity: 'warning',
      category: 'experience',
      actionTab: hasExperience ? 'experience' : 'projects',
      actionLabel: 'Add Metrics'
    });
  }

  if (allBullets.length > 0 && (actionVerbCount / allBullets.length) < 0.5) {
    recommendations.push('Start more bullet points with strong action verbs (e.g. Engineered, Spearheaded).');
    actionableRecommendations.push({
      id: 'rec-action-verbs',
      title: 'Strengthen Action Verbs',
      description: 'Begin each achievement directly with dynamic past-tense action verbs for maximum ATS punch.',
      severity: 'warning',
      category: 'experience',
      actionTab: hasExperience ? 'experience' : 'projects',
      actionLabel: 'Improve Action Verbs'
    });
  }

  if (longBulletCount > 0) {
    recommendations.push(`${longBulletCount} bullet point(s) exceed 250 characters. Consider breaking them into punchy lines.`);
    actionableRecommendations.push({
      id: 'rec-long-bullets',
      title: 'Shorten Lengthy Bullets',
      description: 'Keep bullets concise (1-2 lines) to maintain strong visual rhythm and readability.',
      severity: 'info',
      category: 'experience',
      actionTab: hasExperience ? 'experience' : 'projects',
      actionLabel: 'Shorten Bullets'
    });
  }

  if (firstPersonCount > 0) {
    recommendations.push('Remove first-person pronouns ("I", "my", "we") from experience bullets.');
    actionableRecommendations.push({
      id: 'rec-first-person',
      title: 'Remove First-Person Language',
      description: 'Use direct action statements (e.g. "Built REST API..." instead of "I built a REST API...").',
      severity: 'info',
      category: 'experience',
      actionTab: hasExperience ? 'experience' : 'projects',
      actionLabel: 'Edit Bullets'
    });
  }

  if (skillCount < 6) {
    recommendations.push('List additional tools and technologies to improve keyword matching.');
    actionableRecommendations.push({
      id: 'rec-skills-count',
      title: 'Expand Skills Inventory',
      description: 'Target 8-12 relevant technical competencies to maximize ATS keyword alignment.',
      severity: 'warning',
      category: 'skills',
      actionTab: 'skills',
      actionLabel: 'Add Skills'
    });
  }

  if (duplicateSkills.size > 0) {
    recommendations.push(`Consolidate duplicate skills (${Array.from(duplicateSkills).join(', ')}) into a single category.`);
    actionableRecommendations.push({
      id: 'rec-duplicate-skills',
      title: 'Remove Duplicate Skills',
      description: `Skills appear in multiple categories: ${Array.from(duplicateSkills).join(', ')}.`,
      severity: 'info',
      category: 'skills',
      actionTab: 'skills',
      actionLabel: 'Clean Duplicates'
    });
  }

  if (!hasExperience && !hasProjects) {
    recommendations.push('Include at least one practical project or internship experience.');
    actionableRecommendations.push({
      id: 'rec-exp-proj-missing',
      title: 'Add Experience or Projects',
      description: 'At least one work experience or project is required for standard resume parsing.',
      severity: 'critical',
      category: 'experience',
      actionTab: 'experience',
      actionLabel: 'Add Experience'
    });
  }

  const totalCount = items.length;
  const completedCount = items.filter(i => i.completed).length;
  const score = Math.round((completedCount / totalCount) * 100);

  const missingCritical = items
    .filter(i => i.required && !i.completed)
    .map(i => i.label);

  return {
    score,
    completedCount,
    totalCount,
    items,
    missingCritical,
    recommendations,
    actionableRecommendations
  };
}
