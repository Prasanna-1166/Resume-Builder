/**
 * Canonical Site Metadata Registry
 * Single Source of Truth for Route Metadata, Open Graph, and Structured Data
 * Domain: https://dvlpr.dpdns.org
 */

import {
  BreadcrumbItem,
  FAQItem,
  getOrganizationSchema,
  getWebSiteSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  getArticleSchema,
  BASE_URL
} from '../structured-data/schemas';

export { BASE_URL };

export interface RouteMetadata {
  path: string;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogType: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage: string;
  breadcrumbs: BreadcrumbItem[];
  faqs?: FAQItem[];
  schemas: object[];
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const SITE_METADATA_REGISTRY: Record<string, RouteMetadata> = {
  '/': {
    path: '/',
    title: 'Free AI Resume Builder | ATS-Friendly Resume Maker',
    description:
      'Create professional, ATS-friendly resumes with AI. Build your resume, customize 38 templates, check ATS scores locally, and download PDF or Word documents for free.',
    canonical: `${BASE_URL}/`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'Free AI Resume Builder & ATS Resume Maker | CareerDoc AI',
    ogDescription:
      'Create professional, ATS-friendly resumes in minutes. 38 customizable templates with real-time scoring and instant download.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [{ name: 'Home', url: '/' }],
    faqs: [
      {
        question: 'Is CareerDoc AI completely free to use?',
        answer:
          'Yes, CareerDoc AI allows you to create resumes, customize templates, run ATS checks, and export documents in PDF and Word formats at zero cost.'
      },
      {
        question: 'Are the resume templates ATS-friendly?',
        answer:
          'Yes, all 38 templates use standard reverse-chronological and hybrid layouts formatted with clean headings, readable typography, and no complex graphical blockers that confuse ATS scanners.'
      },
      {
        question: 'Is my resume data kept private?',
        answer:
          'Absolutely. All resume text and ATS score audits run client-side in your browser. We never sell or publicly expose your private resume information.'
      }
    ],
    schemas: [
      getOrganizationSchema(),
      getWebSiteSchema(),
      getSoftwareApplicationSchema('AI Resume Maker'),
      getBreadcrumbSchema([{ name: 'Home', url: '/' }]),
      getFAQSchema([
        {
          question: 'Is CareerDoc AI completely free to use?',
          answer:
            'Yes, CareerDoc AI allows you to create resumes, customize templates, run ATS checks, and export documents in PDF and Word formats at zero cost.'
        },
        {
          question: 'Are the resume templates ATS-friendly?',
          answer:
            'Yes, all 38 templates use standard reverse-chronological and hybrid layouts formatted with clean headings, readable typography, and no complex graphical blockers that confuse ATS scanners.'
        },
        {
          question: 'Is my resume data kept private?',
          answer:
            'Absolutely. All resume text and ATS score audits run client-side in your browser. We never sell or publicly expose your private resume information.'
        }
      ])
    ],
    lastmod: '2026-11-10',
    changefreq: 'weekly',
    priority: 1.0
  },

  '/ai-resume-builder': {
    path: '/ai-resume-builder',
    title: 'Free AI Resume Builder — Generate ATS-Optimized Bullet Points & Summaries',
    description:
      'Use intelligent AI suggestions to rewrite bullet points with measurable impact, craft professional summaries, and format an ATS-compliant resume in minutes.',
    canonical: `${BASE_URL}/ai-resume-builder`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'AI Resume Builder — Free Bullet & Summary Optimization | CareerDoc AI',
    ogDescription:
      'Turn basic experience into achievement-oriented resume bullets. 100% free with live preview and PDF/Word export.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'AI Resume Builder', url: '/ai-resume-builder' }
    ],
    faqs: [
      {
        question: 'How does the AI bullet point enhancer work?',
        answer:
          'The AI examines your drafted duty or task, strengthens weak verbs into active leadership verbs, and recommends measurable impact structures while strictly prohibiting false metric generation.'
      },
      {
        question: 'Can I edit the AI-generated resume text?',
        answer:
          'Yes, human-in-the-loop control is central to CareerDoc AI. You can review, accept, reject, or edit any AI suggestion before it is applied.'
      }
    ],
    schemas: [
      getSoftwareApplicationSchema('AI Bullet Enhancer & Resume Generator'),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'AI Resume Builder', url: '/ai-resume-builder' }
      ]),
      getFAQSchema([
        {
          question: 'How does the AI bullet point enhancer work?',
          answer:
            'The AI examines your drafted duty or task, strengthens weak verbs into active leadership verbs, and recommends measurable impact structures while strictly prohibiting false metric generation.'
        },
        {
          question: 'Can I edit the AI-generated resume text?',
          answer:
            'Yes, human-in-the-loop control is central to CareerDoc AI. You can review, accept, reject, or edit any AI suggestion before it is applied.'
        }
      ])
    ],
    lastmod: '2026-11-10',
    changefreq: 'weekly',
    priority: 0.9
  },

  '/ats-resume-checker': {
    path: '/ats-resume-checker',
    title: 'Free ATS Resume Checker & Score Calculator — Audit Your Resume Online',
    description:
      'Scan your resume against ATS algorithms. Get instant deterministic scores, missing keyword analysis, formatting audit, and actionable recommendations.',
    canonical: `${BASE_URL}/ats-resume-checker`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'Free ATS Resume Checker — Instant Resume Score & Audit | CareerDoc AI',
    ogDescription:
      'Test your resume against applicant tracking systems. Detect formatting errors, keyword gaps, and readability issues for free.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'ATS Resume Checker', url: '/ats-resume-checker' }
    ],
    faqs: [
      {
        question: 'What is an ATS resume score?',
        answer:
          'An ATS score evaluates how easily an Applicant Tracking System can parse, extract, and categorize your resume sections, skills, work experience, and contact details.'
      },
      {
        question: 'Does the ATS check run locally?',
        answer:
          'Yes, our deterministic ATS audit algorithm runs directly in your browser without transmitting your personal resume text across third-party networks.'
      }
    ],
    schemas: [
      getSoftwareApplicationSchema('Local ATS Score Calculator & Auditor'),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'ATS Resume Checker', url: '/ats-resume-checker' }
      ]),
      getFAQSchema([
        {
          question: 'What is an ATS resume score?',
          answer:
            'An ATS score evaluates how easily an Applicant Tracking System can parse, extract, and categorize your resume sections, skills, work experience, and contact details.'
        },
        {
          question: 'Does the ATS check run locally?',
          answer:
            'Yes, our deterministic ATS audit algorithm runs directly in your browser without transmitting your personal resume text across third-party networks.'
        }
      ])
    ],
    lastmod: '2026-11-10',
    changefreq: 'weekly',
    priority: 0.9
  },

  '/resume-templates': {
    path: '/resume-templates',
    title: '38 Free ATS-Friendly Resume Templates — Word & PDF Formats',
    description:
      'Browse 38 recruiter-approved, ATS-compliant resume and CV templates. Filter by Student, Tech, Executive, and Academic styles with lossless template switching.',
    canonical: `${BASE_URL}/resume-templates`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: '38 Free ATS-Friendly Resume Templates | CareerDoc AI',
    ogDescription:
      'Explore 38 professionally formatted resume templates. Switch designs instantly without re-typing your resume data.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resume Templates', url: '/resume-templates' }
    ],
    schemas: [
      getSoftwareApplicationSchema('38 ATS Resume Templates Catalog'),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Resume Templates', url: '/resume-templates' }
      ])
    ],
    lastmod: '2026-11-10',
    changefreq: 'weekly',
    priority: 0.9
  },

  '/ai-cover-letter-generator': {
    path: '/ai-cover-letter-generator',
    title: 'Free AI Cover Letter Generator — Tailored Cover Letters in Minutes',
    description:
      'Generate compelling, targeted cover letters that complement your resume. Match job descriptions, adjust tone, and export in PDF and DOCX formats.',
    canonical: `${BASE_URL}/ai-cover-letter-generator`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'Free AI Cover Letter Generator | CareerDoc AI',
    ogDescription:
      'Write tailored cover letters matching your resume and target job requirements in seconds.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'AI Cover Letter Generator', url: '/ai-cover-letter-generator' }
    ],
    schemas: [
      getSoftwareApplicationSchema('AI Cover Letter Builder'),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'AI Cover Letter Generator', url: '/ai-cover-letter-generator' }
      ])
    ],
    lastmod: '2026-11-10',
    changefreq: 'weekly',
    priority: 0.8
  },

  '/resume-builder-for-freshers': {
    path: '/resume-builder-for-freshers',
    title: 'Free Resume Builder for Freshers & Students — Entry-Level Formats',
    description:
      'Create an entry-level resume that highlights college projects, coursework, certifications, and skills. Designed specifically for college freshers and internships.',
    canonical: `${BASE_URL}/resume-builder-for-freshers`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'Resume Builder for Freshers & Recent Graduates | CareerDoc AI',
    ogDescription:
      'Build a standout entry-level resume with no prior experience. Showcase university projects, hackathons, and technical skills.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Resume Builder for Freshers', url: '/resume-builder-for-freshers' }
    ],
    schemas: [
      getSoftwareApplicationSchema('Fresher & Student Resume Builder'),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Resume Builder for Freshers', url: '/resume-builder-for-freshers' }
      ])
    ],
    lastmod: '2026-11-10',
    changefreq: 'weekly',
    priority: 0.8
  },

  '/developer-resume-builder': {
    path: '/developer-resume-builder',
    title: 'Software Developer Resume Builder — Tech-Stack & GitHub Ready',
    description:
      'Build a high-impact software engineer resume. Showcase languages, frameworks, system architecture, GitHub repositories, and quantitative engineering outcomes.',
    canonical: `${BASE_URL}/developer-resume-builder`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'Software Developer Resume Builder | CareerDoc AI',
    ogDescription:
      'The engineer-first resume builder. Categorize tech stacks, link GitHub & live demos, and audit ATS compatibility.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Developer Resume Builder', url: '/developer-resume-builder' }
    ],
    schemas: [
      getSoftwareApplicationSchema('Developer Resume Builder'),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Developer Resume Builder', url: '/developer-resume-builder' }
      ])
    ],
    lastmod: '2026-11-10',
    changefreq: 'weekly',
    priority: 0.8
  },

  '/blog': {
    path: '/blog',
    title: 'Career & Resume Strategy Blog — ATS Guides & Job Search Advice',
    description:
      'Expert advice on beating applicant tracking systems, crafting developer resumes, mastering cover letters, and accelerating your job search.',
    canonical: `${BASE_URL}/blog`,
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'CareerDoc AI Blog & Resource Hub',
    ogDescription: 'Actionable resume writing guides, ATS strategies, and career development insights.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' }
    ],
    schemas: [
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' }
      ])
    ],
    lastmod: '2026-11-10',
    changefreq: 'weekly',
    priority: 0.7
  },

  '/blog/ats-friendly-resume-guide': {
    path: '/blog/ats-friendly-resume-guide',
    title: 'The Complete Guide to Creating an ATS-Friendly Resume in 2026',
    description:
      'Learn how Applicant Tracking Systems parse resumes. Discover layout rules, formatting traps to avoid, and keyword placement strategies.',
    canonical: `${BASE_URL}/blog/ats-friendly-resume-guide`,
    robots: 'index, follow',
    ogType: 'article',
    ogTitle: 'Complete ATS-Friendly Resume Guide (2026) | CareerDoc AI',
    ogDescription: 'Actionable techniques to ensure your resume passes ATS screening into human hands.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: 'ATS-Friendly Resume Guide', url: '/blog/ats-friendly-resume-guide' }
    ],
    schemas: [
      getArticleSchema({
        title: 'The Complete Guide to Creating an ATS-Friendly Resume in 2026',
        description:
          'Learn how Applicant Tracking Systems parse resumes. Discover layout rules, formatting traps to avoid, and keyword placement strategies.',
        url: `${BASE_URL}/blog/ats-friendly-resume-guide`,
        datePublished: '2026-10-15T08:00:00Z',
        dateModified: '2026-11-10T12:00:00Z'
      }),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'ATS-Friendly Resume Guide', url: '/blog/ats-friendly-resume-guide' }
      ])
    ],
    lastmod: '2026-10-15',
    changefreq: 'monthly',
    priority: 0.7
  },

  '/blog/resume-for-freshers': {
    path: '/blog/resume-for-freshers',
    title: 'How to Build a Standout Resume as a Fresher with Zero Experience',
    description:
      'Practical guide for college graduates on writing an entry-level resume. How to showcase academic projects, open-source work, and leadership roles.',
    canonical: `${BASE_URL}/blog/resume-for-freshers`,
    robots: 'index, follow',
    ogType: 'article',
    ogTitle: 'How to Write a Resume as a College Fresher | CareerDoc AI',
    ogDescription:
      'Step-by-step guidance on structuring your first professional resume without formal industry experience.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: 'Fresher Resume Guide', url: '/blog/resume-for-freshers' }
    ],
    schemas: [
      getArticleSchema({
        title: 'How to Build a Standout Resume as a Fresher with Zero Experience',
        description:
          'Practical guide for college graduates on writing an entry-level resume. How to showcase academic projects, open-source work, and leadership roles.',
        url: `${BASE_URL}/blog/resume-for-freshers`,
        datePublished: '2026-10-18T08:00:00Z',
        dateModified: '2026-11-10T12:00:00Z'
      }),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'Fresher Resume Guide', url: '/blog/resume-for-freshers' }
      ])
    ],
    lastmod: '2026-10-18',
    changefreq: 'monthly',
    priority: 0.7
  },

  '/blog/software-developer-resume-guide': {
    path: '/blog/software-developer-resume-guide',
    title: 'Software Developer Resume Blueprint: Tech Stacks, Impact & GitHub',
    description:
      'Detailed blueprint for software engineers. How to format tech stacks, frame quantitative achievements, and write bullets that grab tech leads.',
    canonical: `${BASE_URL}/blog/software-developer-resume-guide`,
    robots: 'index, follow',
    ogType: 'article',
    ogTitle: 'Software Developer Resume Blueprint | CareerDoc AI',
    ogDescription: 'Write engineering resumes that pass ATS and impress senior engineering managers.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: 'Software Developer Resume Guide', url: '/blog/software-developer-resume-guide' }
    ],
    schemas: [
      getArticleSchema({
        title: 'Software Developer Resume Blueprint: Tech Stacks, Impact & GitHub',
        description:
          'Detailed blueprint for software engineers. How to format tech stacks, frame quantitative achievements, and write bullets that grab tech leads.',
        url: `${BASE_URL}/blog/software-developer-resume-guide`,
        datePublished: '2026-10-20T08:00:00Z',
        dateModified: '2026-11-10T12:00:00Z'
      }),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'Software Developer Resume Guide', url: '/blog/software-developer-resume-guide' }
      ])
    ],
    lastmod: '2026-10-20',
    changefreq: 'monthly',
    priority: 0.7
  },

  '/blog/how-to-improve-ats-score': {
    path: '/blog/how-to-improve-ats-score',
    title: '9 Proven Strategies to Improve Your Resume ATS Score',
    description:
      'Step-by-step checklist to optimize your resume ATS score from 50% to 90%+. Clean section headings, exact skill keyword matching, and format fixes.',
    canonical: `${BASE_URL}/blog/how-to-improve-ats-score`,
    robots: 'index, follow',
    ogType: 'article',
    ogTitle: '9 Ways to Improve Your Resume ATS Score | CareerDoc AI',
    ogDescription: 'Actionable tips to boost your ATS match rate and secure more interview callbacks.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: 'Improve ATS Score', url: '/blog/how-to-improve-ats-score' }
    ],
    schemas: [
      getArticleSchema({
        title: '9 Proven Strategies to Improve Your Resume ATS Score',
        description:
          'Step-by-step checklist to optimize your resume ATS score from 50% to 90%+. Clean section headings, exact skill keyword matching, and format fixes.',
        url: `${BASE_URL}/blog/how-to-improve-ats-score`,
        datePublished: '2026-10-22T08:00:00Z',
        dateModified: '2026-11-10T12:00:00Z'
      }),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'Improve ATS Score', url: '/blog/how-to-improve-ats-score' }
      ])
    ],
    lastmod: '2026-10-22',
    changefreq: 'monthly',
    priority: 0.7
  },

  '/blog/how-to-write-cover-letter': {
    path: '/blog/how-to-write-cover-letter',
    title: 'How to Write a Modern Cover Letter That Actually Gets Read',
    description:
      'Avoid generic cliches. Learn how to write concise, tailored 3-paragraph cover letters that connect your past results directly to the company needs.',
    canonical: `${BASE_URL}/blog/how-to-write-cover-letter`,
    robots: 'index, follow',
    ogType: 'article',
    ogTitle: 'Modern Cover Letter Writing Guide | CareerDoc AI',
    ogDescription: 'A high-converting 3-paragraph formula for writing authentic, impactful cover letters.',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: 'How to Write a Cover Letter', url: '/blog/how-to-write-cover-letter' }
    ],
    schemas: [
      getArticleSchema({
        title: 'How to Write a Modern Cover Letter That Actually Gets Read',
        description:
          'Avoid generic cliches. Learn how to write concise, tailored 3-paragraph cover letters that connect your past results directly to the company needs.',
        url: `${BASE_URL}/blog/how-to-write-cover-letter`,
        datePublished: '2026-10-25T08:00:00Z',
        dateModified: '2026-11-10T12:00:00Z'
      }),
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'How to Write a Cover Letter', url: '/blog/how-to-write-cover-letter' }
      ])
    ],
    lastmod: '2026-10-25',
    changefreq: 'monthly',
    priority: 0.7
  }
};

/**
 * Metadata for Private Application Routes (Strictly Noindex)
 */
export const PRIVATE_ROUTES_METADATA: Record<string, Partial<RouteMetadata>> = {
  '/dashboard': {
    path: '/dashboard',
    title: 'My Documents — CareerDoc AI',
    description: 'Manage your saved resumes, CVs, and cover letters securely.',
    canonical: `${BASE_URL}/dashboard`,
    robots: 'noindex, nofollow'
  },
  '/editor': {
    path: '/editor',
    title: 'Resume & Document Editor — CareerDoc AI',
    description: 'Edit your resume with real-time preview and ATS auditing.',
    canonical: `${BASE_URL}/editor`,
    robots: 'noindex, nofollow'
  },
  '/admin': {
    path: '/admin',
    title: 'Administration Portal — CareerDoc AI',
    description: 'System administration and metrics.',
    canonical: `${BASE_URL}/admin`,
    robots: 'noindex, nofollow'
  }
};

/**
 * Helper to retrieve metadata for any route with intelligent fallback
 */
export function getRouteMetadata(rawPath: string): RouteMetadata {
  const normalized = rawPath.toLowerCase().replace(/\/$/, '') || '/';

  if (SITE_METADATA_REGISTRY[normalized]) {
    return SITE_METADATA_REGISTRY[normalized];
  }

  if (PRIVATE_ROUTES_METADATA[normalized]) {
    const priv = PRIVATE_ROUTES_METADATA[normalized];
    return {
      path: priv.path || normalized,
      title: priv.title || 'CareerDoc AI',
      description: priv.description || 'Career document builder',
      canonical: priv.canonical || `${BASE_URL}${normalized}`,
      robots: 'noindex, nofollow',
      ogType: 'website',
      ogImage: `${BASE_URL}/og-image.svg`,
      breadcrumbs: [{ name: 'Home', url: '/' }],
      schemas: [],
      lastmod: '2026-11-10',
      changefreq: 'never',
      priority: 0.0
    };
  }

  // Fallback for unmapped or 404 routes
  return {
    path: normalized,
    title: 'CareerDoc AI — Free AI Resume Builder',
    description:
      'Create professional, ATS-friendly resumes with AI. 38 customizable templates with real-time scoring.',
    canonical: `${BASE_URL}${normalized}`,
    robots: 'noindex, nofollow',
    ogType: 'website',
    ogImage: `${BASE_URL}/og-image.svg`,
    breadcrumbs: [{ name: 'Home', url: '/' }],
    schemas: [getOrganizationSchema()],
    lastmod: '2026-11-10',
    changefreq: 'weekly',
    priority: 0.5
  };
}
