import { z } from 'zod';

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  professionalTitle: z.string().optional(),
  email: z.string().email('Invalid email address').or(z.literal('')),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
  rollNumber: z.string().optional(),
  customLinks: z.array(z.object({
    label: z.string(),
    url: z.string()
  })).optional()
});

export const EducationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  current: z.boolean().optional(),
  gpaOrGrade: z.string().optional(),
  coursework: z.array(z.string()).optional(),
  description: z.string().optional()
});

export const ExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  current: z.boolean().optional(),
  departmentOrTeam: z.string().optional(),
  bullets: z.array(z.string())
});

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  technologies: z.array(z.string()),
  url: z.string().optional(),
  repoUrl: z.string().optional(),
  bullets: z.array(z.string())
});

export const SkillCategorySchema = z.object({
  id: z.string(),
  category: z.string().min(1, 'Category name is required'),
  items: z.array(z.string()),
  level: z.enum(['beginner', 'intermediate', 'expert']).optional()
});

export const CertificationItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  credentialUrl: z.string().optional(),
  credentialId: z.string().optional()
});

export const ResumeDataSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  documentType: z.enum(['RESUME', 'CV']).optional(),
  category: z.string().optional(),
  targetRole: z.string().optional(),
  targetCompany: z.string().optional(),
  updatedAt: z.string().optional(),
  templateId: z.string().optional(),
  personalInfo: PersonalInfoSchema,
  summary: z.string().optional(),
  education: z.array(EducationItemSchema),
  experience: z.array(ExperienceItemSchema),
  projects: z.array(ProjectItemSchema),
  skills: z.array(SkillCategorySchema),
  certifications: z.array(CertificationItemSchema).or(z.array(z.string())),
  achievements: z.array(z.object({
    id: z.string(),
    title: z.string(),
    date: z.string().optional(),
    description: z.string()
  })).optional(),
  publications: z.array(z.object({
    id: z.string(),
    title: z.string(),
    publisher: z.string().optional(),
    date: z.string().optional(),
    url: z.string().optional(),
    description: z.string().optional()
  })).optional(),
  research: z.array(z.object({
    id: z.string(),
    title: z.string(),
    institution: z.string(),
    advisor: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    bullets: z.array(z.string()).optional()
  })).optional(),
  conferences: z.array(z.object({
    id: z.string(),
    title: z.string().optional(),
    conferenceName: z.string().optional(),
    name: z.string().optional(),
    date: z.string().optional(),
    location: z.string().optional(),
    role: z.string().optional()
  })).optional(),
  references: z.array(z.object({
    id: z.string(),
    name: z.string(),
    title: z.string().optional(),
    institutionOrCompany: z.string().optional(),
    organization: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional()
  })).optional(),
  activities: z.array(z.object({
    id: z.string(),
    role: z.string(),
    organization: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    bullets: z.array(z.string())
  })).optional(),
  languages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    proficiency: z.enum(['Native', 'Fluent', 'Professional', 'Conversational', 'Basic'])
  })).optional(),
  customSections: z.array(z.object({
    id: z.string(),
    heading: z.string(),
    bullets: z.array(z.string())
  })).optional(),
  sectionVisibility: z.record(z.boolean()).optional(),
  sectionOrder: z.array(z.string()).optional(),
  versions: z.array(z.any()).optional()
});
