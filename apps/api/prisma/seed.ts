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

  // 2. Templates (28 unique templates)
  const templatesData = [
    {
      id: 'template_01',
      name: 'Minimal Tech Clean',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Clean single-column developer format with right-aligned contact details and portfolio callout.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical']),
      tags: JSON.stringify(['Minimalist', 'Tech', 'Clean', 'Letter']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 1)',
      colorScheme: '#0F172A',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 1
    },
    {
      id: 'template_02',
      name: 'Classic Academic Blue',
      category: 'academic',
      pageSize: 'a4',
      columns: 1,
      description: 'Traditional academic style with deep navy heading accents, bottom borders, and serif typography.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical', 'general']),
      tags: JSON.stringify(['Academic', 'Navy Blue', 'Serif', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 2)',
      colorScheme: '#1E3A8A',
      fontFamily: 'serif',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 2
    },
    {
      id: 'template_03',
      name: 'Enterprise Java Professional',
      category: 'technical',
      pageSize: 'a4',
      columns: 1,
      description: 'Structured enterprise engineer layout with categorized competencies grid and clean date alignment.',
      suitableFor: JSON.stringify(['technical', 'general', 'fresher']),
      tags: JSON.stringify(['Enterprise', 'Backend', 'Java', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 3)',
      colorScheme: '#1E293B',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 3
    },
    {
      id: 'template_04',
      name: 'People Operations Executive',
      category: 'executive',
      pageSize: 'a4',
      columns: 1,
      description: 'Executive leadership layout with warm teal accents and strong highlight metrics.',
      suitableFor: JSON.stringify(['non-technical', 'general']),
      tags: JSON.stringify(['Executive', 'HR', 'Teal', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 4)',
      colorScheme: '#0F766E',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 4
    },
    {
      id: 'template_05',
      name: 'Strategy & Operations Compact',
      category: 'general',
      pageSize: 'a4',
      columns: 1,
      description: 'High-density corporate format with capitalized bold headers and full-width underline rules.',
      suitableFor: JSON.stringify(['non-technical', 'general', 'fresher']),
      tags: JSON.stringify(['High Density', 'Corporate', 'Underline', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 5)',
      colorScheme: '#000000',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 5
    },
    {
      id: 'template_06',
      name: 'Harshibar Modern Developer',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Modern developer layout with icon badges in contact bar, italicized roles, and compact project tech pills.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical']),
      tags: JSON.stringify(['Developer', 'Icons', 'Popular', 'Letter']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 6)',
      colorScheme: '#334155',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 6
    },
    {
      id: 'template_07',
      name: 'Supply Chain & Ops Specialist',
      category: 'general',
      pageSize: 'a4',
      columns: 1,
      description: 'Operational resume with 3-column expertise tag cloud and highlighted KPI bullet metrics.',
      suitableFor: JSON.stringify(['non-technical', 'general']),
      tags: JSON.stringify(['Operations', 'Supply Chain', 'Grid', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 7)',
      colorScheme: '#1E40AF',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 7
    },
    {
      id: 'template_08',
      name: 'Engineering Manager Diamond',
      category: 'technical',
      pageSize: 'a4',
      columns: 1,
      description: 'Single-column leadership layout with diamond separators and dual technical/management skills block.',
      suitableFor: JSON.stringify(['technical', 'general']),
      tags: JSON.stringify(['Engineering Manager', 'Diamond', 'Leadership', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 8)',
      colorScheme: '#1F2937',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 8
    },
    {
      id: 'template_09',
      name: 'Bangalore SDE Tier-1',
      category: 'technical',
      pageSize: 'a4',
      columns: 1,
      description: 'Top-tier tech fresher format highlighting competitive coding handles, tech stack bullets, and achievements.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical']),
      tags: JSON.stringify(['SDE', 'Competitive Coding', 'Tier-1', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 9)',
      colorScheme: '#3730A3',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 9
    },
    {
      id: 'template_10',
      name: 'Career Returner / Hybrid Clean',
      category: 'general',
      pageSize: 'letter',
      columns: 1,
      description: 'Format highlighting recent certifications and upskilling alongside historical experience.',
      suitableFor: JSON.stringify(['fresher', 'technical', 'general']),
      tags: JSON.stringify(['Career Transition', 'Certifications', 'Clean', 'Letter']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 10)',
      colorScheme: '#1E293B',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 10
    },
    {
      id: 'template_11',
      name: 'Fintech / Quantitative Analyst',
      category: 'academic',
      pageSize: 'a4',
      columns: 1,
      description: 'Structured layout emphasizing quantitative metrics, financial tools, and top-ranked education.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical', 'non-technical']),
      tags: JSON.stringify(['Fintech', 'Quant', 'Finance', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 11)',
      colorScheme: '#172554',
      fontFamily: 'serif',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 11
    },
    {
      id: 'template_12',
      name: 'Chartered Accountant / Finance',
      category: 'general',
      pageSize: 'a4',
      columns: 1,
      description: 'Formal accounting and auditing layout with CA credentials, articleship training, and tax compliance sections.',
      suitableFor: JSON.stringify(['non-technical', 'general', 'fresher']),
      tags: JSON.stringify(['CA', 'Finance', 'Articleship', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 12)',
      colorScheme: '#000000',
      fontFamily: 'serif',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 12
    },
    {
      id: 'template_13',
      name: 'Management Consultant Elite',
      category: 'executive',
      pageSize: 'a4',
      columns: 1,
      description: 'Tier-1 strategy consulting format (McKinsey / BCG style) with client engagement impact and education top.',
      suitableFor: JSON.stringify(['student', 'fresher', 'non-technical', 'general']),
      tags: JSON.stringify(['Consulting', 'Elite', 'Strategy', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 13)',
      colorScheme: '#111827',
      fontFamily: 'serif',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 13
    },
    {
      id: 'template_14',
      name: 'MBA Strategic Leader',
      category: 'student',
      pageSize: 'letter',
      columns: 1,
      description: 'Standardized business school format with dual degree blocks, academic projects, and committee leadership.',
      suitableFor: JSON.stringify(['student', 'fresher', 'non-technical', 'general']),
      tags: JSON.stringify(['MBA', 'B-School', 'Leadership', 'Letter']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 14)',
      colorScheme: '#0F172A',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 14
    },
    {
      id: 'template_15',
      name: 'Deedy LaTeX Academic / SDE',
      category: 'technical',
      pageSize: 'letter',
      columns: 2,
      description: 'Iconic two-column asymmetric layout (sidebar + main) inspired by the famous Deedy Resume LaTeX template.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical']),
      tags: JSON.stringify(['Deedy', 'Two Column', 'LaTeX', 'Letter']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 15)',
      colorScheme: '#2563EB',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 15
    },
    {
      id: 'template_17',
      name: 'Full Stack Dev Modern Blue',
      category: 'technical',
      pageSize: 'a4',
      columns: 1,
      description: 'Modern engineering resume with middle dot contact separators and inline GitHub repository links.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical']),
      tags: JSON.stringify(['Full Stack', 'Modern Blue', 'Web', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 17)',
      colorScheme: '#2563EB',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 16
    },
    {
      id: 'template_18',
      name: 'Cloud DevOps & SRE Pro',
      category: 'technical',
      pageSize: 'a4',
      columns: 1,
      description: 'Cloud infrastructure resume with cloud certification badges and categorized CI/CD toolchains.',
      suitableFor: JSON.stringify(['technical', 'general']),
      tags: JSON.stringify(['DevOps', 'Cloud', 'SRE', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 18)',
      colorScheme: '#334155',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 17
    },
    {
      id: 'template_19',
      name: 'Embedded Systems & Hardware',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Firmware and embedded engineer format with micro-controller matrices and patent/publication sections.',
      suitableFor: JSON.stringify(['technical', 'student', 'fresher']),
      tags: JSON.stringify(['Embedded', 'Hardware', 'Firmware', 'Letter']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 19)',
      colorScheme: '#1E293B',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 18
    },
    {
      id: 'template_20',
      name: 'IIT / IIIT Placement Format',
      category: 'student',
      pageSize: 'a4',
      columns: 1,
      description: 'Standard Indian Premier Engineering Institute (IIT/NIT/IIIT) placement cell format with 4-column academic table.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical']),
      tags: JSON.stringify(['IIT Placement', 'College Table', 'Campus', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 20)',
      colorScheme: '#000000',
      fontFamily: 'serif',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 19
    },
    {
      id: 'template_21',
      name: 'Engineering Fresher Modular',
      category: 'student',
      pageSize: 'letter',
      columns: 1,
      description: 'Student resume with competitive coding ribbon (LeetCode, HackerRank, GitHub) and coursework split tags.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical']),
      tags: JSON.stringify(['Fresher', 'Coding Handles', 'Modular', 'Letter']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 21)',
      colorScheme: '#111827',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 20
    },
    {
      id: 'template_23',
      name: 'Content Strategist & Writer',
      category: 'creative',
      pageSize: 'a4',
      columns: 1,
      description: 'Creative professional format with prominent portfolio showcase link, SEO metrics, and editorial typography.',
      suitableFor: JSON.stringify(['non-technical', 'general', 'fresher']),
      tags: JSON.stringify(['Content', 'Writer', 'Portfolio', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 23)',
      colorScheme: '#4C1D95',
      fontFamily: 'serif',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 21
    },
    {
      id: 'template_24',
      name: 'GitHub Actions CV / Open Source',
      category: 'technical',
      pageSize: 'a4',
      columns: 1,
      description: 'Open source developer resume with CI/CD automated notice, DOI publication links, and structured web badges.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical']),
      tags: JSON.stringify(['Open Source', 'GitHub CV', 'CI/CD', 'A4']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 24)',
      colorScheme: '#1F2937',
      fontFamily: 'mono',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 22
    },
    {
      id: 'template_25',
      name: 'Minimalist Classic Tech',
      category: 'student',
      pageSize: 'letter',
      columns: 1,
      description: 'Projects-first traditional resume with diamond dividers, ideal for fresh graduates and internship applicants.',
      suitableFor: JSON.stringify(['student', 'fresher', 'technical']),
      tags: JSON.stringify(['Projects First', 'Fresher', 'Minimalist', 'Letter']),
      referenceSource: 'ATS Friendly Resume Pack(25).pdf (Page 25)',
      colorScheme: '#000000',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 23
    },
    {
      id: 'template_extra_06',
      name: 'Staff SWE Infrastructure',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'High-performance systems engineer resume with team callout, latency/throughput metrics, and distributed systems focus.',
      suitableFor: JSON.stringify(['technical', 'student', 'fresher']),
      tags: JSON.stringify(['Staff SWE', 'Infrastructure', 'Scale', 'Letter']),
      referenceSource: 'ATS resume 6.pdf',
      colorScheme: '#0F172A',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 24
    },
    {
      id: 'template_extra_07',
      name: 'Mobile iOS / Client Engineer',
      category: 'technical',
      pageSize: 'letter',
      columns: 1,
      description: 'Client engineer resume highlighting published App Store applications, user retention, and client performance.',
      suitableFor: JSON.stringify(['technical', 'student', 'fresher']),
      tags: JSON.stringify(['Mobile', 'iOS', 'Published Apps', 'Letter']),
      referenceSource: 'ATS resume 7.pdf',
      colorScheme: '#18181B',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 25
    },
    {
      id: 'template_extra_08',
      name: 'Product Manager / Growth Lead',
      category: 'executive',
      pageSize: 'letter',
      columns: 1,
      description: 'Product leadership resume with feature launch impact, A/B test outcome metrics, and product pod branding.',
      suitableFor: JSON.stringify(['non-technical', 'technical', 'general']),
      tags: JSON.stringify(['Product Manager', 'Growth', 'A/B Testing', 'Letter']),
      referenceSource: 'ATS resume 8.pdf',
      colorScheme: '#111827',
      fontFamily: 'sans',
      isPopular: true,
      status: 'ACTIVE',
      displayOrder: 26
    },
    {
      id: 'template_extra_09',
      name: 'SDET / QA Automation Architect',
      category: 'technical',
      pageSize: 'a4',
      columns: 1,
      description: 'QA and automation resume featuring a comprehensive testing frameworks matrix right below the summary.',
      suitableFor: JSON.stringify(['technical', 'student', 'fresher']),
      tags: JSON.stringify(['SDET', 'QA Automation', 'Testing', 'A4']),
      referenceSource: 'ATS resume 9.pdf',
      colorScheme: '#1E293B',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 27
    },
    {
      id: 'template_extra_12',
      name: 'Technical Writer & Docs Engineer',
      category: 'creative',
      pageSize: 'a4',
      columns: 1,
      description: 'Developer documentation resume featuring docs-as-code toolchains, API reference links, and published articles.',
      suitableFor: JSON.stringify(['non-technical', 'technical', 'student', 'fresher', 'general']),
      tags: JSON.stringify(['Technical Writer', 'Documentation', 'API Docs', 'A4']),
      referenceSource: 'ATS resume 12.pdf',
      colorScheme: '#1F2937',
      fontFamily: 'sans',
      isPopular: false,
      status: 'ACTIVE',
      displayOrder: 28
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
      siteName: 'Free AI Resume Builder',
      tagline: 'Build ATS-Optimized Professional Resumes in Minutes',
      aiEnabled: true
    }
  });

  console.log(`Successfully seeded ${templatesData.length} templates & site configuration!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
