export interface PersonalInfo {
  fullName: string;
  professionalTitle?: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  rollNumber?: string; // For placement / academic templates
  customLinks?: Array<{ label: string; url: string }>;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  gpaOrGrade?: string;
  coursework?: string[];
  description?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  departmentOrTeam?: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description?: string;
  technologies: string[];
  url?: string;
  repoUrl?: string;
  bullets: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
  level?: 'beginner' | 'intermediate' | 'expert';
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  credentialId?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  date?: string;
  description: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher?: string;
  date?: string;
  url?: string;
  description?: string;
}

export interface ActivityItem {
  id: string;
  role: string;
  organization: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Conversational' | 'Basic';
}

export interface CustomSectionItem {
  id: string;
  heading: string;
  bullets: string[];
}

export interface ResumeData {
  id: string;
  title: string;
  targetRole?: string;
  updatedAt: string;
  templateId: string;
  
  personalInfo: PersonalInfo;
  summary?: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  certifications: CertificationItem[];
  achievements?: AchievementItem[];
  publications?: PublicationItem[];
  activities?: ActivityItem[];
  languages?: LanguageItem[];
  customSections?: CustomSectionItem[];

  sectionVisibility: {
    personalInfo: boolean;
    summary: boolean;
    education: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
    certifications: boolean;
    achievements: boolean;
    publications: boolean;
    activities: boolean;
    languages: boolean;
    customSections: boolean;
    [key: string]: boolean;
  };

  sectionOrder: string[];
}

export interface CompletenessItem {
  key: string;
  label: string;
  completed: boolean;
  required: boolean;
  message?: string;
}

export interface CompletenessReport {
  score: number; // 0 - 100 percentage
  completedCount: number;
  totalCount: number;
  items: CompletenessItem[];
  missingCritical: string[];
  recommendations: string[];
}

export interface AtsCheckIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: 'contact' | 'sections' | 'formatting' | 'keywords' | 'length';
  title: string;
  description: string;
  suggestion: string;
}

export interface AtsCheckResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'Needs Work';
  issues: AtsCheckIssue[];
  keywordCount: number;
  bulletCount: number;
  actionVerbRatio: number;
}
