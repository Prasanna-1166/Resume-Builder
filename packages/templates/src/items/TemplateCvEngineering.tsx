import React from 'react';
import { ResumeData } from '@ai-resume/core';
import { ContactRow } from '../components/ContactRow';
import { SectionHeader } from '../components/SectionHeader';
import { ExperienceItem } from '../components/ExperienceItem';
import { EducationItem } from '../components/EducationItem';
import { ProjectItem } from '../components/ProjectItem';
import { SkillsBlock } from '../components/SkillsBlock';

export const TemplateCvEngineering: React.FC<{ data: ResumeData; isPreview?: boolean }> = ({ data, isPreview = false }) => {
  const {
    personalInfo,
    summary,
    education = [],
    experience = [],
    projects = [],
    skills = [],
    certifications = [],
    publications = [],
    research = [],
    conferences = [],
    references = [],
    sectionVisibility
  } = data;

  const isVisible = (section: string) => sectionVisibility ? sectionVisibility[section] !== false : true;

  return (
    <div className={`w-full bg-white text-gray-900 font-sans leading-relaxed ${isPreview ? 'p-6 text-[10px]' : 'p-8 text-[11px]'}`}>
      {/* Engineering Header */}
      <header className="border-b-2 border-cyan-800 pb-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-1">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              {personalInfo.fullName || 'Lead Systems Architect'}
            </h1>
            {personalInfo.professionalTitle && (
              <p className="text-sm font-bold text-cyan-800 tracking-wide mt-0.5">
                {personalInfo.professionalTitle}
              </p>
            )}
          </div>
          <div className="text-xs text-gray-600 sm:text-right">
            <ContactRow personalInfo={personalInfo} separator="pipe" showIcons={false} />
          </div>
        </div>
      </header>

      {/* Systems Summary */}
      {isVisible('summary') && summary && (
        <section className="mb-4">
          <SectionHeader title="Engineering Leadership & Architecture Focus" accentColor="#0E7490" />
          <p className="text-gray-700 leading-normal mt-1">
            {summary}
          </p>
        </section>
      )}

      {/* Technical Competencies Matrix */}
      {isVisible('skills') && skills.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Technical Toolchains & Core Competencies" accentColor="#0E7490" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {skills.map(cat => (
              <div key={cat.id} className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="font-bold text-slate-800 text-xs block mb-1">{cat.category}:</span>
                <span className="text-slate-600 text-[11px]">{cat.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Career Experience & Technical Engagements */}
      {isVisible('experience') && experience.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Industry Architecture & Engineering Appointments" accentColor="#0E7490" />
          {experience.map(e => (
            <ExperienceItem key={e.id} item={e} />
          ))}
        </section>
      )}

      {/* Major Systems & Open Source Projects */}
      {isVisible('projects') && projects.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Key Systems, Patents & Open-Source Projects" accentColor="#0E7490" />
          {projects.map(p => (
            <ProjectItem key={p.id} item={p} />
          ))}
        </section>
      )}

      {/* Research & Patents */}
      {isVisible('research') && research.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Systems Research & Technical Investigations" accentColor="#0E7490" />
          <div className="space-y-2 mt-1">
            {research.map(r => (
              <div key={r.id}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{r.title} — {r.institution}</span>
                  {(r.startDate || r.endDate) && (
                    <span className="font-normal text-slate-500 text-xs">{r.startDate} – {r.endDate}</span>
                  )}
                </div>
                {r.bullets && (
                  <ul className="list-disc ml-4 mt-1 text-slate-700 text-[11px]">
                    {r.bullets.map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Publications & Standards */}
      {isVisible('publications') && publications.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Technical Whitepapers, Standards & Publications" accentColor="#0E7490" />
          <div className="space-y-1 mt-1 text-slate-800">
            {publications.map(p => (
              <div key={p.id}>
                <span className="font-semibold">• {p.title}</span>
                {p.publisher && <span className="text-slate-600"> ({p.publisher}, {p.date})</span>}
                {p.url && <a href={p.url} className="text-cyan-700 underline text-xs ml-1">{p.url}</a>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {isVisible('education') && education.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Education & Academic Degrees" accentColor="#0E7490" />
          {education.map(e => (
            <EducationItem key={e.id} item={e} />
          ))}
        </section>
      )}

      {/* Certifications */}
      {isVisible('certifications') && certifications.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Engineering Certifications & Cloud Credentials" accentColor="#0E7490" />
          <div className="flex flex-wrap gap-2 mt-1">
            {certifications.map(c => (
              <span key={c.id} className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 text-xs font-medium">
                {c.name} ({c.issuer}, {c.date})
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
