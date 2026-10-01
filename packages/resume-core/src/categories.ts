export type DocumentType = 'RESUME' | 'CV' | 'COVER_LETTER';

export type DocumentCategory =
  | 'FRESHER'
  | 'STUDENT'
  | 'INTERNSHIP'
  | 'ENTRY_LEVEL'
  | 'EXPERIENCED'
  | 'CAREER_CHANGE'
  | 'ACADEMIC_RESEARCH'
  | 'SOFTWARE_IT'
  | 'BUSINESS_MANAGEMENT'
  | 'CUSTOM';

export interface CategoryMetadata {
  id: DocumentCategory;
  name: string;
  description: string;
  iconName: string;
  recommendedTypes: DocumentType[];
}

export const DOCUMENT_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'FRESHER',
    name: 'Fresher / Recent Graduate',
    description: 'Optimized for campus placements and recent graduates highlighting academics and projects.',
    iconName: 'GraduationCap',
    recommendedTypes: ['RESUME', 'COVER_LETTER']
  },
  {
    id: 'STUDENT',
    name: 'College Student',
    description: 'Highlights college coursework, hackathons, clubs, and academic scores.',
    iconName: 'BookOpen',
    recommendedTypes: ['RESUME', 'CV']
  },
  {
    id: 'INTERNSHIP',
    name: 'Internship Applicant',
    description: 'Emphasizes hands-on project work, foundational skills, and eager-to-learn attitude.',
    iconName: 'Briefcase',
    recommendedTypes: ['RESUME', 'COVER_LETTER']
  },
  {
    id: 'ENTRY_LEVEL',
    name: 'Entry Level (0-2 Years)',
    description: 'Highlights initial industry experience, core responsibilities, and key technical skills.',
    iconName: 'UserCheck',
    recommendedTypes: ['RESUME', 'COVER_LETTER']
  },
  {
    id: 'EXPERIENCED',
    name: 'Mid / Senior Professional',
    description: 'Focuses on measurable impact, career progression, leadership, and domain expertise.',
    iconName: 'Award',
    recommendedTypes: ['RESUME', 'CV', 'COVER_LETTER']
  },
  {
    id: 'CAREER_CHANGE',
    name: 'Career Transition / Returner',
    description: 'Showcases transferable skills, recent certifications, and hybrid competencies.',
    iconName: 'Compass',
    recommendedTypes: ['RESUME', 'COVER_LETTER']
  },
  {
    id: 'ACADEMIC_RESEARCH',
    name: 'Academic & Research',
    description: 'Detailed multi-page format for publications, research grants, patents, and teaching.',
    iconName: 'FileText',
    recommendedTypes: ['CV', 'COVER_LETTER']
  },
  {
    id: 'SOFTWARE_IT',
    name: 'Software & Technology',
    description: 'Technical stack highlights, system architecture, open-source work, and competitive coding.',
    iconName: 'Code',
    recommendedTypes: ['RESUME', 'CV', 'COVER_LETTER']
  },
  {
    id: 'BUSINESS_MANAGEMENT',
    name: 'Business & Management',
    description: 'Strategic leadership, stakeholder engagement, revenue growth, and team operations.',
    iconName: 'TrendingUp',
    recommendedTypes: ['RESUME', 'COVER_LETTER']
  },
  {
    id: 'CUSTOM',
    name: 'General / Custom',
    description: 'Universal career document format suitable for all domains and specializations.',
    iconName: 'Layers',
    recommendedTypes: ['RESUME', 'CV', 'COVER_LETTER']
  }
];

export interface DocumentVersionSnapshot {
  id: string;
  versionName: string;
  tag?: string; // 'Original', 'ATS Tailored', 'Company Specific'
  timestamp: string;
  notes?: string;
  data: any;
}
