import { describe, it } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  DOCUMENT_CATEGORIES,
  CoverLetterSchema,
  sampleCoverLetterFixture,
  generateCoverLetterDocxBlob,
  ResumeDataSchema,
  ResumeData,
  CoverLetterData
} from '../packages/resume-core/src/index';
import { TEMPLATE_CATALOG, TEMPLATE_REGISTRY } from '../packages/templates/src/index';

describe('Multi-Document Platform: Core, Models & Categories', () => {
  it('should support all 10 canonical document categories', () => {
    const categoryIds = DOCUMENT_CATEGORIES.map(c => c.id);
    const expectedCategories = [
      'FRESHER',
      'STUDENT',
      'INTERNSHIP',
      'ENTRY_LEVEL',
      'EXPERIENCED',
      'CAREER_CHANGE',
      'ACADEMIC_RESEARCH',
      'SOFTWARE_IT',
      'BUSINESS_MANAGEMENT',
      'CUSTOM'
    ];

    for (const cat of expectedCategories) {
      assert.ok(categoryIds.includes(cat as any), `Missing category: ${cat}`);
    }
    assert.strictEqual(DOCUMENT_CATEGORIES.length, 10);
  });

  it('should validate CoverLetterSchema with the sample fixture', () => {
    const parseResult = CoverLetterSchema.safeParse(sampleCoverLetterFixture);
    assert.ok(parseResult.success, 'Sample cover letter fixture failed schema validation');
    if (parseResult.success) {
      assert.strictEqual(parseResult.data.documentType, 'COVER_LETTER');
      assert.strictEqual(parseResult.data.personalInfo.fullName, 'Alex Morgan');
      assert.ok(parseResult.data.bodyParagraphs.length >= 2);
    }
  });

  it('should support CV-specific sections in ResumeDataSchema', () => {
    const academicCvData: ResumeData = {
      id: 'cv-academic-101',
      title: 'Dr. Eleanor Vance - Academic CV',
      documentType: 'CV',
      category: 'ACADEMIC_RESEARCH',
      templateId: 'template_cv_academic',
      updatedAt: '2026-03-30T10:00:00Z',
      personalInfo: {
        fullName: 'Dr. Eleanor Vance',
        email: 'e.vance@stanford.edu',
        phone: '+1 (555) 345-6789',
        location: 'Stanford, CA',
        professionalTitle: 'Postdoctoral Research Fellow'
      },
      summary: 'Computational biologist with 6+ years of research in genomic modeling.',
      education: [
        {
          id: 'edu-1',
          institution: 'Stanford University',
          degree: 'Ph.D.',
          field: 'Computational Biology',
          startDate: '2018',
          endDate: '2023',
          gpaOrGrade: '3.96'
        }
      ],
      experience: [
        {
          id: 'exp-1',
          company: 'Stanford Genomic Data Lab',
          role: 'Postdoctoral Fellow',
          startDate: '2023',
          endDate: 'Present',
          bullets: ['Leading high-throughput gene sequencing analysis pipelines.']
        }
      ],
      skills: [
        { id: 's-1', category: 'Programming', items: ['Python', 'PyTorch', 'R'] }
      ],
      projects: [],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2023'
        }
      ],
      sectionVisibility: { personalInfo: true, summary: true, education: true, experience: true, projects: true, skills: true, certifications: true, achievements: true, publications: true, research: true, conferences: true, references: true, activities: true, languages: true, customSections: true },
      sectionOrder: ['personalInfo', 'education', 'research', 'publications', 'conferences', 'references'],
      publications: [
        {
          id: 'pub-1',
          title: 'Deep Learning for Single-Cell RNA Sequencing Trajectory Inference',
          publisher: 'Nature Computational Science',
          date: '2023',
          url: 'https://doi.org/example'
        }
      ],
      research: [
        {
          id: 'res-1',
          title: 'Genomic Variant Predictor',
          institution: 'Stanford Lab',
          startDate: '2021',
          endDate: '2023',
          bullets: ['Developed transformer-based sequence variant classifier.']
        }
      ],
      conferences: [
        {
          id: 'conf-1',
          conferenceName: 'ISMB 2023',
          title: 'Deep Learning Keynote',
          role: 'Speaker',
          date: 'July 2023'
        }
      ],
      references: [
        {
          id: 'ref-1',
          name: 'Prof. Marcus Brody',
          title: 'Chair of Genomics',
          institutionOrCompany: 'Stanford University',
          email: 'brody@stanford.edu'
        }
      ]
    };

    const parseResult = ResumeDataSchema.safeParse(academicCvData);
    assert.ok(parseResult.success, 'Academic CV failed ResumeDataSchema validation');
  });

  it('should generate valid DOCX buffers for Cover Letters', async () => {
    const docxBlob = await generateCoverLetterDocxBlob(sampleCoverLetterFixture);
    assert.ok(docxBlob instanceof Buffer);
    assert.ok(docxBlob.length > 500, 'Cover letter DOCX buffer should be non-empty');
  });
});

describe('Multi-Document Platform: Template Engine & Rendering', () => {
  it('should categorize templates by documentType correctly in TEMPLATE_CATALOG', () => {
    const resumeTemplates = TEMPLATE_CATALOG.filter(t => t.documentType === 'RESUME');
    const cvTemplates = TEMPLATE_CATALOG.filter(t => t.documentType === 'CV');
    const clTemplates = TEMPLATE_CATALOG.filter(t => t.documentType === 'COVER_LETTER');

    assert.ok(resumeTemplates.length >= 20, `Should have >= 20 resume templates, got ${resumeTemplates.length}`);
    assert.ok(cvTemplates.length >= 5, `Should have >= 5 CV templates, got ${cvTemplates.length}`);
    assert.ok(clTemplates.length >= 5, `Should have >= 5 Cover Letter templates, got ${clTemplates.length}`);
    assert.ok(TEMPLATE_CATALOG.length >= 30, `Should have >= 30 total templates, got ${TEMPLATE_CATALOG.length}`);
  });

  it('should render Academic CV (template_cv_academic) cleanly', () => {
    const cvComp = TEMPLATE_REGISTRY['template_cv_academic'];
    assert.ok(cvComp, 'template_cv_academic component not registered');

    const cvData: ResumeData = {
      id: 'cv-test',
      title: 'Academic CV',
      documentType: 'CV',
      templateId: 'template_cv_academic',
      updatedAt: '2026-03-30T10:00:00Z',
      personalInfo: { fullName: 'Dr. Jane Doe', email: 'jane@univ.edu', phone: '1234567890', location: 'Boston, MA' },
      education: [{ id: '1', institution: 'MIT', degree: 'Ph.D.', field: 'Physics', startDate: '2019', endDate: '2023' }],
      experience: [],
      skills: [{ id: '1', category: 'Computational', items: ['Python', 'Qiskit'] }],
      projects: [],
      certifications: [],
      sectionVisibility: { personalInfo: true, summary: true, education: true, experience: true, projects: true, skills: true, certifications: true, achievements: true, publications: true, research: true, conferences: true, references: true, activities: true, languages: true, customSections: true },
      sectionOrder: ['personalInfo', 'education', 'research', 'publications', 'conferences', 'references'],
      research: [{ id: '1', title: 'Quantum Circuit Simulation', institution: 'MIT', bullets: ['Researched NISQ era algorithms.'] }],
      publications: [{ id: '1', title: 'Quantum Supremacy in NISQ Era', publisher: 'IEEE' }],
      conferences: [{ id: '1', conferenceName: 'QIP 2024', title: 'Keynote' }],
      references: [{ id: '1', name: 'Prof. Smith', title: 'Professor', institutionOrCompany: 'MIT', email: 'smith@mit.edu' }]
    };

    const html = renderToString(React.createElement(cvComp, { data: cvData }));
    assert.ok(html.includes('Dr. Jane Doe'));
    assert.ok(html.includes('Quantum Circuit Simulation'));
    assert.ok(html.includes('Quantum Supremacy in NISQ Era'));
    assert.ok(html.includes('QIP 2024'));
    assert.ok(html.includes('Prof. Smith'));
  });

  it('should render Professional CV (template_cv_professional) cleanly', () => {
    const cvComp = TEMPLATE_REGISTRY['template_cv_professional'];
    assert.ok(cvComp, 'template_cv_professional component not registered');

    const cvData: ResumeData = {
      id: 'cv-pro-test',
      title: 'Professional CV',
      documentType: 'CV',
      templateId: 'template_cv_professional',
      updatedAt: '2026-03-30T10:00:00Z',
      personalInfo: { fullName: 'Marcus Vance, PhD', email: 'marcus@research.org', phone: '1234567890', location: 'London, UK' },
      education: [{ id: '1', institution: 'Cambridge', degree: 'M.Sc.', field: 'Bioinformatics', startDate: '2018', endDate: '2020' }],
      experience: [{ id: '1', company: 'DeepBio', role: 'Principal Scientist', startDate: '2020', endDate: 'Present', bullets: ['Led ML team'] }],
      skills: [{ id: '1', category: 'Domain Skills', items: ['Bioinformatics', 'Genomics'] }],
      projects: [],
      certifications: [],
      sectionVisibility: { personalInfo: true, summary: true, education: true, experience: true, projects: true, skills: true, certifications: true, achievements: true, publications: true, activities: true, languages: true, customSections: true },
      sectionOrder: ['personalInfo', 'education', 'experience', 'skills', 'publications'],
      publications: [{ id: '1', title: 'CRISPR Gene Editing Analysis', publisher: 'Cell' }]
    };

    const html = renderToString(React.createElement(cvComp, { data: cvData }));
    assert.ok(html.includes('Marcus Vance, PhD'));
    assert.ok(html.includes('DeepBio'));
    assert.ok(html.includes('CRISPR Gene Editing Analysis'));
  });

  it('should render Medical, Engineering, & Faculty CV templates', () => {
    const medComp = TEMPLATE_REGISTRY['template_cv_medical'];
    const engComp = TEMPLATE_REGISTRY['template_cv_engineering'];
    const facComp = TEMPLATE_REGISTRY['template_cv_faculty'];

    assert.ok(medComp, 'template_cv_medical registered');
    assert.ok(engComp, 'template_cv_engineering registered');
    assert.ok(facComp, 'template_cv_faculty registered');

    const medHtml = renderToString(React.createElement(medComp, { data: { personalInfo: { fullName: 'Dr. Sarah Connor, MD' } } }));
    assert.ok(medHtml.includes('Dr. Sarah Connor, MD'));

    const engHtml = renderToString(React.createElement(engComp, { data: { personalInfo: { fullName: 'Elena Rostova, Fellow' } } }));
    assert.ok(engHtml.includes('Elena Rostova, Fellow'));

    const facHtml = renderToString(React.createElement(facComp, { data: { personalInfo: { fullName: 'Prof. David Hilbert' } } }));
    assert.ok(facHtml.includes('Prof. David Hilbert'));
  });

  it('should render all 5 Cover Letter templates with CoverLetterData', () => {
    const clModern = TEMPLATE_REGISTRY['template_cl_modern'];
    const clPro = TEMPLATE_REGISTRY['template_cl_professional'];
    const clMin = TEMPLATE_REGISTRY['template_cl_minimal'];
    const clAcad = TEMPLATE_REGISTRY['template_cl_academic'];
    const clCreat = TEMPLATE_REGISTRY['template_cl_creative'];

    assert.ok(clModern && clPro && clMin && clAcad && clCreat);

    for (const [id, comp] of Object.entries({
      template_cl_modern: clModern,
      template_cl_professional: clPro,
      template_cl_minimal: clMin,
      template_cl_academic: clAcad,
      template_cl_creative: clCreat
    })) {
      const html = renderToString(React.createElement(comp, { data: sampleCoverLetterFixture }));
      assert.ok(html.includes('Alex Morgan'), `${id} failed to render candidate name`);
      assert.ok(html.includes('TechCorp Solutions'), `${id} failed to render recipient company`);
    }
  });
});
