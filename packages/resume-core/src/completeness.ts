import { ResumeData, CompletenessReport, CompletenessItem } from './types.js';

export function calculateResumeCompleteness(data: ResumeData): CompletenessReport {
  const items: CompletenessItem[] = [];

  // Personal Info checks
  const hasName = Boolean(data.personalInfo.fullName && data.personalInfo.fullName.trim().length > 1);
  items.push({
    key: 'name',
    label: 'Full Name',
    completed: hasName,
    required: true,
    message: hasName ? undefined : 'Add your full name to the header.'
  });

  const hasEmail = Boolean(data.personalInfo.email && data.personalInfo.email.includes('@'));
  items.push({
    key: 'email',
    label: 'Email Address',
    completed: hasEmail,
    required: true,
    message: hasEmail ? undefined : 'Add a valid contact email.'
  });

  const hasPhone = Boolean(data.personalInfo.phone && data.personalInfo.phone.trim().length >= 7);
  items.push({
    key: 'phone',
    label: 'Phone Number',
    completed: hasPhone,
    required: true,
    message: hasPhone ? undefined : 'Add your phone number with country code.'
  });

  const hasLocation = Boolean(data.personalInfo.location && data.personalInfo.location.trim().length > 1);
  items.push({
    key: 'location',
    label: 'Location (City, Country)',
    completed: hasLocation,
    required: true,
    message: hasLocation ? undefined : 'Add your city and region.'
  });

  const hasLinkedIn = Boolean(data.personalInfo.linkedin && data.personalInfo.linkedin.trim().length > 3);
  items.push({
    key: 'linkedin',
    label: 'LinkedIn Profile',
    completed: hasLinkedIn,
    required: false,
    message: hasLinkedIn ? undefined : 'Consider adding a LinkedIn profile link.'
  });

  // Summary check
  const hasSummary = Boolean(data.summary && data.summary.trim().length > 30);
  items.push({
    key: 'summary',
    label: 'Professional Summary',
    completed: hasSummary,
    required: false,
    message: hasSummary ? undefined : 'A 2-3 sentence summary highlights your unique strengths.'
  });

  // Education check
  const hasEducation = Boolean(data.education && data.education.length > 0 && data.education.some(e => e.institution && e.degree));
  items.push({
    key: 'education',
    label: 'Education History',
    completed: hasEducation,
    required: true,
    message: hasEducation ? undefined : 'Add at least one educational degree or certification.'
  });

  // Experience / Projects check (Fresher or experienced)
  const hasExperience = Boolean(data.experience && data.experience.length > 0 && data.experience.some(e => e.company && e.bullets.length > 0));
  items.push({
    key: 'experience',
    label: 'Work Experience',
    completed: hasExperience,
    required: false,
    message: hasExperience ? undefined : 'Add relevant internships, jobs, or freelance roles.'
  });

  const hasProjects = Boolean(data.projects && data.projects.length > 0 && data.projects.some(p => p.name && p.bullets.length > 0));
  items.push({
    key: 'projects',
    label: 'Projects',
    completed: hasProjects,
    required: false,
    message: hasProjects ? undefined : 'Add personal or academic projects showcasing your skills.'
  });

  // Skills check
  const skillCount = data.skills?.reduce((acc, cat) => acc + (cat.items?.length || 0), 0) || 0;
  const hasSkills = skillCount >= 4;
  items.push({
    key: 'skills',
    label: 'Skills Inventory',
    completed: hasSkills,
    required: true,
    message: hasSkills ? undefined : 'List at least 4 key technical or domain skills.'
  });

  const totalCount = items.length;
  const completedCount = items.filter(i => i.completed).length;
  const score = Math.round((completedCount / totalCount) * 100);

  const missingCritical = items
    .filter(i => i.required && !i.completed)
    .map(i => i.label);

  const recommendations: string[] = [];
  if (!hasLinkedIn) recommendations.push('Add LinkedIn URL to increase recruiter engagement.');
  if (!hasSummary) recommendations.push('Add a concise 2-line summary tailored to your target role.');
  if (skillCount < 6) recommendations.push('Expand your skills section with relevant tools & technologies.');
  if (!hasExperience && !hasProjects) recommendations.push('Add at least 1 work experience or academic project with measurable outcomes.');

  return {
    score,
    completedCount,
    totalCount,
    items,
    missingCritical,
    recommendations
  };
}
