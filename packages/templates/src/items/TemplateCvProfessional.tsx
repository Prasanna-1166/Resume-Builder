import React from 'react';
import { ResumeData } from '@ai-resume/core';
import { ContactRow } from '../components/ContactRow';
import { SectionHeader } from '../components/SectionHeader';
import { ExperienceItem } from '../components/ExperienceItem';
import { EducationItem } from '../components/EducationItem';
import { ProjectItem } from '../components/ProjectItem';
import { SkillsBlock } from '../components/SkillsBlock';

export const TemplateCvProfessional: React.FC<{ data: ResumeData; isPreview?: boolean }> = ({ data, isPreview = false }) => {
  const {
    personalInfo,
    summary,
    education = [],
    experience = [],
    projects = [],
    skills = [],
    certifications = [],
    achievements = [],
    publications = [],
    references = [],
    customSections = [],
    sectionVisibility
  } = data;

  const isVisible = (section: string) => sectionVisibility ? sectionVisibility[section] !== false : true;

  return (
    <div className={`w-full bg-white text-gray-900 font-sans leading-relaxed ${isPreview ? 'p-6 text-[10px]' : 'p-8 text-[11px]'}`}>
      {/* Header */}
      <header className="flex justify-between items-end border-b-2 border-slate-800 pb-4 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
            {personalInfo.fullName || 'Professional Candidate'}
          </h1>
          {personalInfo.professionalTitle && (
            <p className="text-sm font-semibold text-blue-700 mt-0.5">
              {personalInfo.professionalTitle}
            </p>
          )}
        </div>
        <div className="text-right text-xs text-gray-600 space-y-0.5">
          <ContactRow personalInfo={personalInfo} separator="bullet" showIcons={false} />
        </div>
      </header>

      {/* Profile / Summary */}
      {isVisible('summary') && summary && (
        <section className="mb-4">
          <SectionHeader title="Executive Profile" accentColor="#1E293B" />
          <p className="text-gray-700 leading-normal mt-1">
            {summary}
          </p>
        </section>
      )}

      {/* Core Competencies */}
      {isVisible('skills') && skills.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Core Competencies & Expertise" accentColor="#1E293B" />
          <SkillsBlock skills={skills} />
        </section>
      )}

      {/* Career Experience */}
      {isVisible('experience') && experience.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Professional Experience" accentColor="#1E293B" />
          {experience.map(e => (
            <ExperienceItem key={e.id} item={e} />
          ))}
        </section>
      )}

      {/* Key Projects & Engagements */}
      {isVisible('projects') && projects.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Key Engagements & Projects" accentColor="#1E293B" />
          {projects.map(p => (
            <ProjectItem key={p.id} item={p} />
          ))}
        </section>
      )}

      {/* Research & Publications */}
      {isVisible('publications') && publications.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Publications & Thought Leadership" accentColor="#1E293B" />
          <div className="space-y-1.5 mt-1">
            {publications.map((p) => (
              <div key={p.id} className="text-gray-800">
                <span className="font-semibold text-slate-900">• "{p.title}"</span>
                {p.publisher && <span className="text-gray-600"> — {p.publisher}</span>}
                {p.date && <span className="text-gray-500"> ({p.date})</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {isVisible('education') && education.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Education & Credentials" accentColor="#1E293B" />
          {education.map(e => (
            <EducationItem key={e.id} item={e} />
          ))}
        </section>
      )}

      {/* Certifications */}
      {isVisible('certifications') && certifications.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Certifications & Licensures" accentColor="#1E293B" />
          <div className="grid grid-cols-2 gap-2 mt-1">
            {certifications.map(c => (
              <div key={c.id} className="bg-slate-50 p-2 rounded border border-slate-200">
                <p className="font-bold text-slate-900">{c.name}</p>
                <p className="text-xs text-gray-600">{c.issuer} • {c.date}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional References */}
      {isVisible('references') && references.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Professional References" accentColor="#1E293B" />
          <div className="grid grid-cols-2 gap-3 mt-1">
            {references.map(ref => (
              <div key={ref.id} className="p-2 border border-slate-200 rounded text-xs">
                <p className="font-bold text-slate-900">{ref.name}</p>
                <p className="text-gray-700">{ref.title}, {ref.institutionOrCompany}</p>
                {ref.email && <p className="text-blue-600">{ref.email}</p>}
                {ref.phone && <p className="text-gray-600">{ref.phone}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {isVisible('customSections') && customSections.length > 0 && (
        customSections.map(cs => (
          <section key={cs.id} className="mb-4">
            <SectionHeader title={cs.heading} accentColor="#1E293B" />
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-700">
              {cs.bullets.map((b, bi) => (
                <li key={bi}>{b}</li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
};
