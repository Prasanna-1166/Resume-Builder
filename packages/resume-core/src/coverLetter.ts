import { z } from 'zod';
import { PersonalInfo } from './types';
import { DocumentCategory, DocumentVersionSnapshot } from './categories';

export interface RecipientInfo {
  name: string;
  title?: string;
  company: string;
  department?: string;
  address?: string;
  cityStateZip?: string;
  email?: string;
  phone?: string;
}

export interface CoverLetterData {
  id: string;
  documentType: 'COVER_LETTER';
  title: string;
  category: DocumentCategory;
  templateId: string;
  updatedAt: string;
  
  personalInfo: PersonalInfo;
  recipient: RecipientInfo;
  
  date: string;
  jobTitle: string;
  targetCompany: string;
  
  greeting: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  signoff: string;
  
  versions?: DocumentVersionSnapshot[];
}

export const CoverLetterSchema = z.object({
  id: z.string(),
  documentType: z.literal('COVER_LETTER'),
  title: z.string().min(1),
  category: z.string(),
  templateId: z.string(),
  updatedAt: z.string(),
  personalInfo: z.object({
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    professionalTitle: z.string().optional(),
    website: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional()
  }),
  recipient: z.object({
    name: z.string(),
    title: z.string().optional(),
    company: z.string(),
    department: z.string().optional(),
    address: z.string().optional(),
    cityStateZip: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional()
  }),
  date: z.string(),
  jobTitle: z.string(),
  targetCompany: z.string(),
  greeting: z.string(),
  openingParagraph: z.string(),
  bodyParagraphs: z.array(z.string()),
  closingParagraph: z.string(),
  signoff: z.string(),
  versions: z.array(z.any()).optional()
});

export const sampleCoverLetterFixture: CoverLetterData = {
  id: 'cl_sample_01',
  documentType: 'COVER_LETTER',
  title: 'Full Stack Engineer - Cover Letter',
  category: 'SOFTWARE_IT',
  templateId: 'template_cl_modern',
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: 'Alex Morgan',
    professionalTitle: 'Full Stack Software Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan'
  },
  recipient: {
    name: 'Hiring Committee',
    title: 'Engineering Recruitment Team',
    company: 'TechCorp Solutions',
    department: 'Platform Engineering',
    address: '100 Innovation Way',
    cityStateZip: 'San Francisco, CA 94105'
  },
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  jobTitle: 'Senior Full Stack Software Engineer',
  targetCompany: 'TechCorp Solutions',
  greeting: 'Dear Hiring Committee,',
  openingParagraph: 'I am writing to enthusiastically express my interest in the Senior Full Stack Software Engineer position at TechCorp Solutions. With a strong track record of designing scalable web architectures, optimizing database performance, and building responsive React applications, I am eager to contribute to TechCorp\'s mission of delivering world-class enterprise software.',
  bodyParagraphs: [
    'Throughout my career, I have specialized in building robust TypeScript and Node.js microservices that scale to handle high-concurrency workloads. In my previous role, I led the re-architecture of our core customer dashboard, reducing API latency by 42% and implementing automated CI/CD pipelines that increased deployment reliability.',
    'Beyond backend architecture, I place a high emphasis on crafting intuitive, accessible frontend user experiences using React and Tailwind CSS. I have consistently collaborated with cross-functional teams, product managers, and UI/UX designers to translate complex product specifications into elegant, maintainable code.'
  ],
  closingParagraph: 'TechCorp\'s dedication to engineering excellence and developer productivity deeply resonates with my professional ethos. I welcome the opportunity to discuss how my technical expertise, problem-solving mindset, and dedication to code quality can deliver immediate value to your engineering team.',
  signoff: 'Sincerely,\nAlex Morgan'
};
