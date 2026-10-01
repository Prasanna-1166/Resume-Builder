import React from 'react';
import { ResumeData } from '@ai-resume/core';
import { ContactRow } from '../components/ContactRow';
import { SectionHeader } from '../components/SectionHeader';
import { ExperienceItem } from '../components/ExperienceItem';
import { EducationItem } from '../components/EducationItem';
import { ProjectItem } from '../components/ProjectItem';
import { SkillsBlock } from '../components/SkillsBlock';

export const TemplateCvAcademic: React.FC<{ data: ResumeData; isPreview?: boolean }> = ({ data, isPreview = false }) => {
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
    research = [],
    conferences = [],
    references = [],
    customSections = [],
    sectionVisibility
  } = data;

  const isVisible = (section: string) => sectionVisibility ? sectionVisibility[section] !== false : true;

  return (
    <div className={`w-full bg-white text-gray-900 font-serif leading-relaxed ${isPreview ? 'p-6 text-[10px]' : 'p-10 text-[12px]'}`}>
      {/* Header */}
      <header className="border-b-2 border-indigo-900 pb-4 mb-5 text-center">
        <h1 className="text-2xl font-bold tracking-wide uppercase text-indigo-950 font-serif">
          {personalInfo.fullName || 'Academic Candidate'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-sm font-medium text-indigo-900 mt-1 italic">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="mt-3 flex justify-center text-gray-700">
          <ContactRow personalInfo={personalInfo} separator="pipe" showIcons={false} />
        </div>
      </header>

      {/* Research Interests / Executive Summary */}
      {isVisible('summary') && summary && (
        <section className="mb-5">
          <SectionHeader title="Research Interests & Academic Summary" accentColor="#1E1B4B" fontStyle="serif" />
          <p className="text-gray-800 leading-normal text-justify mt-1">
            {summary}
          </p>
        </section>
      )}

      {/* Education */}
      {isVisible('education') && education.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Education & Academic Background" accentColor="#1E1B4B" fontStyle="serif" />
          {education.map(e => (
            <EducationItem key={e.id} item={e} />
          ))}
        </section>
      )}

      {/* Research Experience */}
      {isVisible('research') && research.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Research Experience & Appointments" accentColor="#1E1B4B" fontStyle="serif" />
          {research.map(r => (
            <div key={r.id} className="mb-3">
              <div className="flex justify-between items-baseline font-bold text-gray-900">
                <span>{r.title}</span>
                <span className="text-xs font-normal text-gray-600">{r.startDate} – {r.endDate || 'Present'}</span>
              </div>
              <div className="text-xs italic text-indigo-950 font-medium">
                {r.institution} {r.advisor ? `(Advisor: ${r.advisor})` : ''}
              </div>
              {r.bullets && r.bullets.length > 0 && (
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-700">
                  {r.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Publications */}
      {isVisible('publications') && publications.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Publications & Scholarly Articles" accentColor="#1E1B4B" fontStyle="serif" />
          <div className="space-y-2 mt-2">
            {publications.map((p, idx) => (
              <div key={p.id} className="text-gray-800">
                <span className="font-semibold">[{idx + 1}]</span> "{p.title}", 
                {p.publisher && <span className="italic"> {p.publisher}</span>}, 
                {p.date && <span> {p.date}.</span>}
                {p.description && <p className="text-xs text-gray-600 pl-4 mt-0.5">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Conferences */}
      {isVisible('conferences') && conferences.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Conferences & Presentations" accentColor="#1E1B4B" fontStyle="serif" />
          <div className="space-y-2 mt-2">
            {conferences.map(c => {
              const confName = c.conferenceName || (c as any).name || c.title || 'Scholarly Conference';
              const paperTitle = c.title && c.conferenceName ? c.title : '';
              return (
                <div key={c.id} className="flex justify-between items-baseline">
                  <div>
                    {paperTitle ? (
                      <>
                        <span className="font-semibold text-gray-900">{paperTitle}</span> – <span className="italic text-gray-700">{confName}</span>
                      </>
                    ) : (
                      <span className="font-semibold text-gray-900">{confName}</span>
                    )}
                    {c.role && <span className="text-xs font-medium text-indigo-900 ml-1.5">({c.role})</span>}
                  </div>
                  <div className="text-xs text-gray-600">
                    {c.location && `${c.location}, `}{c.date}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Teaching & Academic Experience */}
      {isVisible('experience') && experience.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Teaching & Academic Experience" accentColor="#1E1B4B" fontStyle="serif" />
          {experience.map(e => (
            <ExperienceItem key={e.id} item={e} />
          ))}
        </section>
      )}

      {/* Projects */}
      {isVisible('projects') && projects.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Research & Technical Projects" accentColor="#1E1B4B" fontStyle="serif" />
          {projects.map(p => (
            <ProjectItem key={p.id} item={p} />
          ))}
        </section>
      )}

      {/* Awards & Honors */}
      {isVisible('achievements') && achievements.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Grants, Honors & Awards" accentColor="#1E1B4B" fontStyle="serif" />
          <div className="space-y-1.5 mt-2">
            {achievements.map(a => (
              <div key={a.id} className="flex justify-between items-baseline">
                <span className="font-semibold text-gray-900">{a.title}</span>
                {a.date && <span className="text-xs text-gray-600">{a.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Methodologies */}
      {isVisible('skills') && skills.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Methodologies & Technical Competencies" accentColor="#1E1B4B" fontStyle="serif" />
          <SkillsBlock skills={skills} />
        </section>
      )}

      {/* Academic References */}
      {isVisible('references') && references.length > 0 && (
        <section className="mb-5">
          <SectionHeader title="Academic References" accentColor="#1E1B4B" fontStyle="serif" />
          <div className="grid grid-cols-2 gap-4 mt-2">
            {references.map(ref => (
              <div key={ref.id} className="text-xs border-l-2 border-indigo-900 pl-3">
                <p className="font-bold text-gray-900">{ref.name}</p>
                {ref.title && <p className="italic text-gray-700">{ref.title}</p>}
                <p className="text-gray-600">{ref.institutionOrCompany || (ref as any).organization}</p>
                {ref.email && <p className="text-gray-600">{ref.email}</p>}
                {ref.phone && <p className="text-gray-600">{ref.phone}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {isVisible('customSections') && customSections.length > 0 && (
        customSections.map(cs => (
          <section key={cs.id} className="mb-5">
            <SectionHeader title={cs.heading} accentColor="#1E1B4B" fontStyle="serif" />
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
