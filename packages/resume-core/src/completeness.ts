import { ResumeData, CompletenessReport, CompletenessItem, CareerDocument } from './types.js';
import { CoverLetterData } from './coverLetter.js';

export function calculateResumeCompleteness(doc: CareerDocument | ResumeData): CompletenessReport {
  const items: CompletenessItem[] = [];
  const recommendations: string[] = [];

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
      message: hasName ? undefined : 'Add your name to the letterhead.'
    });

    const hasContact = Boolean(cl.personalInfo?.email && cl.personalInfo.email.includes('@'));
    items.push({
      key: 'email',
      label: 'Contact Email',
      completed: hasContact,
      required: true,
      message: hasContact ? undefined : 'Provide your contact email address.'
    });

    const hasTarget = Boolean(cl.jobTitle && (cl.targetCompany || cl.recipient?.company));
    items.push({
      key: 'targetRole',
      label: 'Target Role & Company',
      completed: hasTarget,
      required: true,
      message: hasTarget ? undefined : 'Specify the target position and organization name.'
    });

    const hasOpening = Boolean(cl.openingParagraph && cl.openingParagraph.trim().length > 20);
    items.push({
      key: 'opening',
      label: 'Opening Statement',
      completed: hasOpening,
      required: true,
      message: hasOpening ? undefined : 'State the role you are applying for and your motivation.'
    });

    const hasBody = Boolean(cl.bodyParagraphs && cl.bodyParagraphs.length > 0 && cl.bodyParagraphs.some(p => p.trim().length > 30));
    items.push({
      key: 'body',
      label: 'Body Paragraphs (Evidence)',
      completed: hasBody,
      required: true,
      message: hasBody ? undefined : 'Highlight 1–2 key achievements aligned with the role.'
    });

    const hasClosing = Boolean(cl.closingParagraph && cl.closingParagraph.trim().length > 15);
    items.push({
      key: 'closing',
      label: 'Closing & Call to Action',
      completed: hasClosing,
      required: true,
      message: hasClosing ? undefined : 'Include a courteous closing thanking the reader.'
    });

    if (!hasTarget) recommendations.push('Specify the target role and company name for higher impact.');
    if (!hasBody) recommendations.push('Add a paragraph connecting your technical skills to the job requirements.');

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
      recommendations
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
    message: hasName ? undefined : 'Add your full name to the header.'
  });

  const hasEmail = Boolean(data.personalInfo?.email && data.personalInfo.email.includes('@'));
  items.push({
    key: 'email',
    label: 'Email Address',
    completed: hasEmail,
    required: true,
    message: hasEmail ? undefined : 'Add a valid contact email.'
  });

  const hasPhone = Boolean(data.personalInfo?.phone && data.personalInfo.phone.trim().length >= 7);
  items.push({
    key: 'phone',
    label: 'Phone Number',
    completed: hasPhone,
    required: true,
    message: hasPhone ? undefined : 'Add your phone number with country code.'
  });

  const hasLocation = Boolean(data.personalInfo?.location && data.personalInfo.location.trim().length > 1);
  items.push({
    key: 'location',
    label: 'Location (City, Country)',
    completed: hasLocation,
    required: true,
    message: hasLocation ? undefined : 'Add your city and region.'
  });

  const hasLinkedIn = Boolean(data.personalInfo?.linkedin && data.personalInfo.linkedin.trim().length > 3);
  items.push({
    key: 'linkedin',
    label: 'LinkedIn Profile',
    completed: hasLinkedIn,
    required: false,
    message: hasLinkedIn ? undefined : 'Consider adding a LinkedIn profile link.'
  });

  // Summary check
  const hasSummary = Boolean(data.summary && data.summary.trim().length > 25);
  items.push({
    key: 'summary',
    label: docType === 'CV' ? 'Research Statement / Summary' : 'Professional Summary',
    completed: hasSummary,
    required: false,
    message: hasSummary ? undefined : 'A 2-3 sentence overview highlights your unique expertise.'
  });

  // Education check
  const hasEducation = Boolean(data.education && data.education.length > 0 && data.education.some(e => e.institution && e.degree));
  items.push({
    key: 'education',
    label: 'Education History',
    completed: hasEducation,
    required: true,
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
      message: hasResearchOrPubs ? undefined : 'Include research projects, peer-reviewed publications, or conference presentations.'
    });
  }

  const totalCount = items.length;
  const completedCount = items.filter(i => i.completed).length;
  const score = Math.round((completedCount / totalCount) * 100);

  const missingCritical = items
    .filter(i => i.required && !i.completed)
    .map(i => i.label);

  if (!hasLinkedIn) recommendations.push('Add a LinkedIn or portfolio link to increase response rates.');
  if (!hasSummary) recommendations.push('Add a concise professional summary tailored to your target position.');
  if (skillCount < 6) recommendations.push('List additional tools and technologies to improve keyword matching.');
  if (!hasExperience && !hasProjects) recommendations.push('Include at least one practical project or internship experience.');

  return {
    score,
    completedCount,
    totalCount,
    items,
    missingCritical,
    recommendations
  };
}
