import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Admin user
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@resumebuilder.local';
  let adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;

  if (!adminPassword) {
    if (process.env.NODE_ENV === 'production') {
      const crypto = await import('crypto');
      adminPassword = crypto.randomBytes(16).toString('hex') + '!Aa1';
      console.warn('⚠️ PRODUCTION NOTICE: ADMIN_DEFAULT_PASSWORD was not set in environment.');
      console.warn(`Generated random admin password: ${adminPassword}`);
    } else {
      adminPassword = 'AdminSecurePassword2026!';
    }
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'System Administrator',
      role: 'SUPER_ADMIN'
    }
  });
  console.log(`Admin user seeded: ${admin.email}`);

  // 2. Full Canonical Differentiated Template Catalog (38 Total Templates: 28 Resume, 5 CV, 5 Cover Letter)
  const templatesData = [
    // 28 Resumes
    {
      id: 'template_01',
      name: 'ATS Professional',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Clean single-column standard format with right-aligned contact details and standard section headers designed for ATS readability.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical', 'general']),
      tags: JSON.stringify(['ATS-Friendly', 'Standard', 'Single Column', 'Tech & Business']),
      referenceSource: 'Standard Industry ATS Template',
      colorScheme: '#0F172A',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 1
    },
    {
      id: 'template_02',
      name: 'Classic Corporate',
      documentType: 'RESUME',
      category: 'general',
      pageSize: 'letter',
      columns: 1,
      description: 'Traditional corporate layout emphasizing chronological career progression and organizational accomplishments.',
      suitableFor: JSON.stringify(['general', 'non-technical']),
      tags: JSON.stringify(['Corporate', 'Classic', 'Business', 'Formal']),
      referenceSource: 'Corporate Recruitment Standard',
      colorScheme: '#1E293B',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 2
    },
    {
      id: 'template_03',
      name: 'Compact Tech',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Ultra-efficient single-page resume format designed to fit extensive technical projects and skills without overflowing.',
      suitableFor: JSON.stringify(['technical', 'fresher']),
      tags: JSON.stringify(['Compact', 'Technical', '1-Page Fit', 'High Density']),
      referenceSource: 'Tech Industry 1-Page Standard',
      colorScheme: '#18181B',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 3
    },
    {
      id: 'template_04',
      name: 'Experienced / Executive',
      documentType: 'RESUME',
      category: 'executive',
      pageSize: 'a4',
      columns: 1,
      description: 'High-density leadership format highlighting career progression, team mentorship, strategic initiatives, and quantified business impact.',
      suitableFor: JSON.stringify(['non-technical', 'general', 'technical']),
      tags: JSON.stringify(['Executive', 'Leadership', 'Management', 'Strategy']),
      referenceSource: 'Executive Leadership Standard',
      colorScheme: '#0F766E',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 4
    },
    {
      id: 'template_05',
      name: 'Minimalist Modern',
      documentType: 'RESUME',
      category: 'general',
      pageSize: 'letter',
      columns: 1,
      description: 'Minimalist resume layout focusing on typography, whitespace, and straightforward readability.',
      suitableFor: JSON.stringify(['general', 'student']),
      tags: JSON.stringify(['Minimalist', 'Clean', 'Modern', 'Readable']),
      referenceSource: 'Minimalist Design Standard',
      colorScheme: '#27272A',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 5
    },
    {
      id: 'template_06',
      name: 'Software Engineer',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Structured layout prioritizing engineering stack categorization, core architecture accomplishments, and open source deliverables.',
      suitableFor: JSON.stringify(['technical']),
      tags: JSON.stringify(['Software', 'Engineering', 'Developer', 'Code']),
      referenceSource: 'Silicon Valley Engineering Standard',
      colorScheme: '#312E81',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 6
    },
    {
      id: 'template_07',
      name: 'Elegant Serif',
      documentType: 'RESUME',
      category: 'general',
      pageSize: 'letter',
      columns: 1,
      description: 'Refined editorial resume format using classic serif headings and balanced typography for traditional industries.',
      suitableFor: JSON.stringify(['non-technical', 'general']),
      tags: JSON.stringify(['Serif', 'Editorial', 'Formal', 'Classic']),
      referenceSource: 'Editorial & Academic Standard',
      colorScheme: '#1C1917',
      fontFamily: 'serif',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 7
    },
    {
      id: 'template_08',
      name: 'Modern Split Accent',
      documentType: 'RESUME',
      category: 'creative',
      pageSize: 'a4',
      columns: 1,
      description: 'Contemporary format with stylized section indicators and accented headers, balancing personality with ATS compliance.',
      suitableFor: JSON.stringify(['technical', 'general']),
      tags: JSON.stringify(['Design', 'Accent', 'Creative Tech', 'Modern']),
      referenceSource: 'Creative Tech Format',
      colorScheme: '#047857',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 8
    },
    {
      id: 'template_09',
      name: 'Data Analyst & Quant',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Data-driven layout designed to emphasize measurable KPIs, modeling pipelines, statistical methodologies, and tooling mastery.',
      suitableFor: JSON.stringify(['technical', 'general']),
      tags: JSON.stringify(['Data Science', 'Analytics', 'Metrics', 'Quant']),
      referenceSource: 'Data & Quantitative Standard',
      colorScheme: '#1E3A8A',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 9
    },
    {
      id: 'template_10',
      name: 'Clean Bordered',
      documentType: 'RESUME',
      category: 'general',
      pageSize: 'letter',
      columns: 1,
      description: 'Framed structural layout offering crisp visual demarcation between career milestones and skill proficiencies.',
      suitableFor: JSON.stringify(['general', 'non-technical']),
      tags: JSON.stringify(['Bordered', 'Framed', 'Organized', 'Business']),
      referenceSource: 'Structured Corporate Format',
      colorScheme: '#27272A',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 10
    },
    {
      id: 'template_11',
      name: 'Compact Modern',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Streamlined modern layout engineered to pack comprehensive technical experience onto a single cleanly rendered page.',
      suitableFor: JSON.stringify(['technical', 'student', 'fresher']),
      tags: JSON.stringify(['Compact', 'Junior', 'Bootcamp', 'Modern']),
      referenceSource: 'Bootcamp & Junior Tech Standard',
      colorScheme: '#334155',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 11
    },
    {
      id: 'template_12',
      name: 'Executive Leadership',
      documentType: 'RESUME',
      category: 'executive',
      pageSize: 'letter',
      columns: 1,
      description: 'High-impact executive layout designed to foreground operational leadership, revenue growth, and organizational strategy.',
      suitableFor: JSON.stringify(['general', 'non-technical']),
      tags: JSON.stringify(['Executive', 'Leadership', 'Director', 'Management']),
      referenceSource: 'Executive Search Standard',
      colorScheme: '#1E293B',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 12
    },
    {
      id: 'template_13',
      name: 'Engineering Specialist',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Technical resume tailored for deep systems engineering, hardware integration, and core infrastructure roles.',
      suitableFor: JSON.stringify(['technical']),
      tags: JSON.stringify(['Systems', 'Embedded', 'Hardware', 'Specialist']),
      referenceSource: 'Deep Tech & Engineering Standard',
      colorScheme: '#18181B',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 13
    },
    {
      id: 'template_14',
      name: 'Product Manager',
      documentType: 'RESUME',
      category: 'general',
      pageSize: 'letter',
      columns: 1,
      description: 'Optimized layout for product leaders showcasing user adoption, discovery frameworks, sprint velocity, and business outcomes.',
      suitableFor: JSON.stringify(['general', 'technical']),
      tags: JSON.stringify(['Product', 'PM', 'Roadmap', 'Growth']),
      referenceSource: 'Tech Product Management Standard',
      colorScheme: '#0F172A',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 14
    },
    {
      id: 'template_15',
      name: 'Two-Column Modern',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'letter',
      columns: 2,
      description: 'Two-column modern format balancing a dedicated left sidebar for skills, contact, and education with a wide experience timeline.',
      suitableFor: JSON.stringify(['technical', 'general']),
      tags: JSON.stringify(['Two Column', 'Sidebar', 'Modern', 'Split']),
      referenceSource: 'Modern Two-Column Design',
      colorScheme: '#1E293B',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 15
    },
    {
      id: 'template_17',
      name: 'Modern Professional',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'a4',
      columns: 1,
      description: 'Modern professional layout with middle-dot contact separators, subtle blue heading accents, and structured technical sections.',
      suitableFor: JSON.stringify(['technical', 'general']),
      tags: JSON.stringify(['Modern', 'Blue Accent', 'Full Stack', 'Readable']),
      referenceSource: 'Modern Tech Resume Specification',
      colorScheme: '#2563EB',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 17
    },
    {
      id: 'template_18',
      name: 'Full Stack Developer',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Developer-tailored resume format with dedicated technology categorization and live project showcase fields.',
      suitableFor: JSON.stringify(['technical']),
      tags: JSON.stringify(['Full Stack', 'Frontend', 'Backend', 'Web Dev']),
      referenceSource: 'Web Engineering Standard',
      colorScheme: '#1E1B4B',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 18
    },
    {
      id: 'template_19',
      name: 'Minimal Tech',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Minimalist tech resume combining subtle monospaced metadata with clean sans typography for developer clarity.',
      suitableFor: JSON.stringify(['technical', 'fresher']),
      tags: JSON.stringify(['Minimal Tech', 'Clean', 'SRE', 'DevOps']),
      referenceSource: 'Modern Minimal Tech Standard',
      colorScheme: '#18181B',
      fontFamily: 'mono',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 19
    },
    {
      id: 'template_20',
      name: 'Cybersecurity & Cloud',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Security-focused resume emphasizing certifications (CISSP, CEH, AWS), vulnerability mitigation metrics, and compliance standards.',
      suitableFor: JSON.stringify(['technical']),
      tags: JSON.stringify(['Cybersecurity', 'Cloud', 'DevSecOps', 'Certifications']),
      referenceSource: 'Information Security Standard',
      colorScheme: '#991B1B',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 20
    },
    {
      id: 'template_21',
      name: 'Fresher / Student',
      documentType: 'RESUME',
      category: 'student',
      pageSize: 'letter',
      columns: 1,
      description: 'Student-first resume emphasizing academic degree, GPA/grades, coursework, competitive coding profiles, and capstone projects.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical']),
      tags: JSON.stringify(['Student', 'Fresher', 'Internship', 'Campus Placement']),
      referenceSource: 'Campus Placement & University Format',
      colorScheme: '#111827',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 21
    },
    {
      id: 'template_23',
      name: 'Academic-to-Industry',
      documentType: 'RESUME',
      category: 'academic',
      pageSize: 'letter',
      columns: 1,
      description: 'Hybrid resume tailored for PhDs and research scientists moving into corporate R&D, data science, or engineering management.',
      suitableFor: JSON.stringify(['technical', 'general']),
      tags: JSON.stringify(['Academic', 'PhD', 'Transition', 'Research']),
      referenceSource: 'Academic Transition Standard',
      colorScheme: '#0F172A',
      fontFamily: 'serif',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 23
    },
    {
      id: 'template_24',
      name: 'Finance & Consulting',
      documentType: 'RESUME',
      category: 'executive',
      pageSize: 'letter',
      columns: 1,
      description: 'Strict investment banking and management consulting standard format optimized for quantitative deals and financial analysis.',
      suitableFor: JSON.stringify(['non-technical', 'general']),
      tags: JSON.stringify(['Finance', 'Consulting', 'Investment Banking', 'Corporate']),
      referenceSource: 'Wall Street & MBB Consulting Standard',
      colorScheme: '#000000',
      fontFamily: 'serif',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 24
    },
    {
      id: 'template_25',
      name: 'Marketing & Operations',
      documentType: 'RESUME',
      category: 'general',
      pageSize: 'letter',
      columns: 1,
      description: 'Results-driven resume format focusing on campaign performance metrics, conversion funnels, and operational scale.',
      suitableFor: JSON.stringify(['general', 'non-technical']),
      tags: JSON.stringify(['Marketing', 'Operations', 'Growth', 'Strategy']),
      referenceSource: 'Marketing & Operations Standard',
      colorScheme: '#0D9488',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 25
    },
    {
      id: 'template_extra_06',
      name: 'Cloud & DevOps Specialist',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Infrastructure and DevOps resume tailored to highlight Terraform, Kubernetes, AWS/GCP, and CI/CD automation.',
      suitableFor: JSON.stringify(['technical']),
      tags: JSON.stringify(['DevOps', 'Cloud', 'Kubernetes', 'AWS']),
      referenceSource: 'Cloud Engineering Standard',
      colorScheme: '#1D4ED8',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 26
    },
    {
      id: 'template_extra_07',
      name: 'UI/UX & Product Design',
      documentType: 'RESUME',
      category: 'creative',
      pageSize: 'letter',
      columns: 1,
      description: 'Design-centric resume balancing clean visual hierarchy with ATS-compliant sections for product and UX professionals.',
      suitableFor: JSON.stringify(['general', 'technical']),
      tags: JSON.stringify(['UI/UX', 'Product Design', 'Figma', 'Creative']),
      referenceSource: 'Product Design Standard',
      colorScheme: '#4338CA',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 27
    },
    {
      id: 'template_extra_08',
      name: 'Project-Focused Technical',
      documentType: 'RESUME',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Project-first technical resume built for developers whose portfolio of open-source and personal applications is their strongest asset.',
      suitableFor: JSON.stringify(['technical', 'student', 'fresher']),
      tags: JSON.stringify(['Projects', 'Portfolio', 'Hackathon', 'Open Source']),
      referenceSource: 'Developer Portfolio Standard',
      colorScheme: '#334155',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 28
    },
    {
      id: 'template_extra_09',
      name: 'International Minimal',
      documentType: 'RESUME',
      category: 'general',
      pageSize: 'a4',
      columns: 1,
      description: 'Sleek international resume adhering to global recruiting conventions and multi-language support.',
      suitableFor: JSON.stringify(['general', 'non-technical']),
      tags: JSON.stringify(['International', 'Global', 'Remote', 'Minimal']),
      referenceSource: 'Global Recruiting Format',
      colorScheme: '#27272A',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 29
    },
    {
      id: 'template_extra_12',
      name: 'Healthcare & Life Sciences',
      documentType: 'RESUME',
      category: 'general',
      pageSize: 'letter',
      columns: 1,
      description: 'Specialized healthcare and clinical operations resume formatted for hospital systems, biotech firms, and health tech.',
      suitableFor: JSON.stringify(['non-technical', 'general']),
      tags: JSON.stringify(['Healthcare', 'Biotech', 'Clinical', 'Medical']),
      referenceSource: 'Healthcare & Clinical Standard',
      colorScheme: '#0F766E',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 30
    },

    // 5 CVs
    {
      id: 'template_cv_academic',
      name: 'Academic Research CV',
      documentType: 'CV',
      category: 'academic',
      pageSize: 'a4',
      columns: 1,
      description: 'Comprehensive academic curriculum vitae supporting research appointments, publications, grants, conferences, and scholarly references.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical', 'general']),
      tags: JSON.stringify(['Academic CV', 'Research', 'Publications', 'Conferences', 'Serif']),
      referenceSource: 'Standard Academic Curriculum Vitae Format',
      colorScheme: '#1E1B4B',
      fontFamily: 'serif',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 31
    },
    {
      id: 'template_cv_professional',
      name: 'Professional Executive CV',
      documentType: 'CV',
      category: 'executive',
      pageSize: 'a4',
      columns: 1,
      description: 'Detailed multi-page professional CV highlighting leadership impact, core competencies, client engagements, and credentials.',
      suitableFor: JSON.stringify(['technical', 'non-technical', 'general']),
      tags: JSON.stringify(['Professional CV', 'Comprehensive', 'Executive', 'Long Form']),
      referenceSource: 'Executive Leadership CV Format',
      colorScheme: '#1E293B',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 32
    },
    {
      id: 'template_cv_medical',
      name: 'Medical & Clinical Specialist CV',
      documentType: 'CV',
      category: 'academic',
      pageSize: 'a4',
      columns: 1,
      description: 'Multi-page clinical CV structured for hospital appointments, medical fellowships, clinical trials, and board certifications.',
      suitableFor: JSON.stringify(['general', 'non-technical', 'technical']),
      tags: JSON.stringify(['Medical CV', 'Clinical', 'Residency', 'Board Certified']),
      referenceSource: 'Medical Board Curriculum Vitae Format',
      colorScheme: '#065F46',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 33
    },
    {
      id: 'template_cv_engineering',
      name: 'Technical & Engineering Fellow CV',
      documentType: 'CV',
      category: 'technical',
      pageSize: 'a4',
      columns: 1,
      description: 'Comprehensive technical curriculum vitae designed for industrial scientists, engineering fellows, and patent holders.',
      suitableFor: JSON.stringify(['technical']),
      tags: JSON.stringify(['Engineering CV', 'Patents', 'Fellow', 'Architecture']),
      referenceSource: 'IEEE / ACM Technical Fellow CV Format',
      colorScheme: '#1E3A8A',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 34
    },
    {
      id: 'template_cv_faculty',
      name: 'Faculty & Postdoctoral Fellowship CV',
      documentType: 'CV',
      category: 'academic',
      pageSize: 'a4',
      columns: 1,
      description: 'Detailed faculty curriculum vitae formatted for tenure reviews, faculty appointments, research grants, and student mentorship records.',
      suitableFor: JSON.stringify(['student', 'general', 'technical']),
      tags: JSON.stringify(['Faculty CV', 'Teaching', 'Tenure', 'Grants', 'Serif']),
      referenceSource: 'University Faculty Search Dossier Format',
      colorScheme: '#292524',
      fontFamily: 'serif',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 35
    },

    // 5 Cover Letters
    {
      id: 'template_cl_professional',
      name: 'Professional Business Cover Letter',
      documentType: 'COVER_LETTER',
      category: 'executive',
      pageSize: 'letter',
      columns: 1,
      description: 'Conventional formal business cover letter with centered letterhead, formal date/recipient alignment, and sign-off.',
      suitableFor: JSON.stringify(['non-technical', 'general', 'fresher']),
      tags: JSON.stringify(['Cover Letter', 'Formal', 'Business', 'Serif']),
      referenceSource: 'Executive Formal Letter Format',
      colorScheme: '#0F172A',
      fontFamily: 'serif',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 36
    },
    {
      id: 'template_cl_modern',
      name: 'Modern Tech Cover Letter',
      documentType: 'COVER_LETTER',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Contemporary tech cover letter featuring clean candidate header, ATS alignment, and structured value-proposition paragraphs.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical', 'general']),
      tags: JSON.stringify(['Cover Letter', 'Modern', 'Tech', 'Clean']),
      referenceSource: 'Modern Tech Cover Letter Format',
      colorScheme: '#2563EB',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 37
    },
    {
      id: 'template_cl_minimal',
      name: 'Minimal ATS Cover Letter',
      documentType: 'COVER_LETTER',
      category: 'general',
      pageSize: 'letter',
      columns: 1,
      description: 'Minimalist cover letter stripped of distracting graphics, maximizing scan readability for applicant tracking systems.',
      suitableFor: JSON.stringify(['general', 'student', 'fresher']),
      tags: JSON.stringify(['Cover Letter', 'Minimal', 'ATS-Friendly', 'Clean']),
      referenceSource: 'Minimal ATS Standard',
      colorScheme: '#27272A',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 38
    },
    {
      id: 'template_cl_academic',
      name: 'Academic & Research Cover Letter',
      documentType: 'COVER_LETTER',
      category: 'academic',
      pageSize: 'letter',
      columns: 1,
      description: 'Scholarly cover letter formatted for university search committees, postdoctoral applications, and research fellowship submissions.',
      suitableFor: JSON.stringify(['student', 'general', 'technical']),
      tags: JSON.stringify(['Cover Letter', 'Academic', 'Research', 'Faculty', 'Serif']),
      referenceSource: 'Academic Search Committee Standard',
      colorScheme: '#292524',
      fontFamily: 'serif',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 39
    },
    {
      id: 'template_cl_creative',
      name: 'Creative & Product Cover Letter',
      documentType: 'COVER_LETTER',
      category: 'creative',
      pageSize: 'creative',
      columns: 1,
      description: 'Dynamic cover letter layout with an impactful header block and structured value highlights for creative and product roles.',
      suitableFor: JSON.stringify(['general', 'technical']),
      tags: JSON.stringify(['Cover Letter', 'Creative', 'Design', 'Product']),
      referenceSource: 'Creative Leadership Format',
      colorScheme: '#0F766E',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 40
    }
  ];

  for (const t of templatesData) {
    await prisma.template.upsert({
      where: { id: t.id },
      update: t,
      create: t
    });
  }

  // 3. Site config
  await prisma.siteConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'CareerDoc AI - Free Resume, CV & Cover Letter Builder',
      tagline: 'Build ATS-Optimized Professional Resumes, CVs & Cover Letters in Minutes',
      aiEnabled: true
    }
  });

  console.log(`Successfully seeded ${templatesData.length} canonical templates & site configuration!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
