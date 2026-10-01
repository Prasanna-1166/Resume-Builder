import React from 'react';
import { ResumeData } from '@ai-resume/core';
import { ContactRow } from '../components/ContactRow';
import { SectionHeader } from '../components/SectionHeader';
import { ExperienceItem } from '../components/ExperienceItem';
import { EducationItem } from '../components/EducationItem';
import { ProjectItem } from '../components/ProjectItem';
import { SkillsBlock } from '../components/SkillsBlock';

export const TemplateCvMedical: React.FC<{ data: ResumeData; isPreview?: boolean }> = ({ data, isPreview = false }) => {
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
    <div className={`w-full bg-white text-gray-900 font-serif leading-relaxed ${isPreview ? 'p-6 text-[10px]' : 'p-10 text-[11.5px]'}`}>
      {/* Medical / Clinical Header */}
      <header className="border-b-2 border-emerald-800 pb-4 mb-5 text-center">
        <h1 className="text-2xl font-bold tracking-wide uppercase text-emerald-950">
          {personalInfo.fullName || 'Medical Scholar & Clinician'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-sm font-semibold text-emerald-900 mt-1">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="mt-2.5 flex justify-center text-gray-700 font-sans text-xs">
          <ContactRow personalInfo={personalInfo} separator="pipe" showIcons={false} />
        </div>
      </header>

      {/* Clinical / Research Summary */}
      {isVisible('summary') && summary && (
        <section className="mb-4">
          <SectionHeader title="Clinical Profile & Research Focus" accentColor="#065F46" fontStyle="serif" />
          <p className="text-gray-800 leading-relaxed text-justify mt-1">
            {summary}
          </p>
        </section>
      )}

      {/* Medical Education & Fellowships */}
      {isVisible('education') && education.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Medical Education, Residency & Fellowships" accentColor="#065F46" fontStyle="serif" />
          {education.map(e => (
            <EducationItem key={e.id} item={e} />
          ))}
        </section>
      )}

      {/* Clinical Appointments & Experience */}
      {isVisible('experience') && experience.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Clinical & Hospital Appointments" accentColor="#065F46" fontStyle="serif" />
          {experience.map(e => (
            <ExperienceItem key={e.id} item={e} />
          ))}
        </section>
      )}

      {/* Clinical Trials & Laboratory Research */}
      {isVisible('research') && research.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Clinical Trials & Investigative Research" accentColor="#065F46" fontStyle="serif" />
          <div className="space-y-2 mt-1">
            {research.map(r => (
              <div key={r.id}>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{r.title} — {r.institution}</span>
                  {(r.startDate || r.endDate) && (
                    <span className="font-normal text-gray-600 text-xs">{r.startDate} – {r.endDate}</span>
                  )}
                </div>
                {r.advisor && <p className="text-xs text-gray-600 italic">Principal Investigator: {r.advisor}</p>}
                {r.bullets && r.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 text-gray-700 space-y-0.5">
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

      {/* Peer-Reviewed Medical Publications */}
      {isVisible('publications') && publications.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Peer-Reviewed Publications & Case Reports" accentColor="#065F46" fontStyle="serif" />
          <div className="space-y-1.5 mt-1">
            {publications.map((p, idx) => (
              <div key={p.id} className="text-gray-800">
                <span className="font-semibold">{idx + 1}. {p.title}.</span>
                {p.publisher && <span className="italic text-gray-700"> {p.publisher}.</span>}
                {p.date && <span className="text-gray-600"> {p.date};</span>}
                {p.url && <span className="text-emerald-700 text-xs ml-1 underline">{p.url}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Board Certifications & Licensure */}
      {isVisible('certifications') && certifications.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Board Certifications & Medical Licensure" accentColor="#065F46" fontStyle="serif" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
            {certifications.map(c => (
              <div key={c.id} className="text-gray-800 font-medium">
                • {c.name} <span className="text-gray-600 text-xs">({c.issuer}, {c.date})</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Presentations & Grand Rounds */}
      {isVisible('conferences') && conferences.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Conference Presentations & Grand Rounds" accentColor="#065F46" fontStyle="serif" />
          <div className="space-y-1 mt-1">
            {conferences.map(conf => (
              <div key={conf.id} className="text-gray-800">
                <span className="font-semibold">{conf.title}</span> — {conf.conferenceName}
                {conf.date && <span className="text-gray-600 text-xs"> ({conf.date})</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional References */}
      {isVisible('references') && references.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="Professional References" accentColor="#065F46" fontStyle="serif" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            {references.map(ref => (
              <div key={ref.id} className="text-gray-800 text-xs">
                <p className="font-bold text-gray-900">{ref.name}</p>
                <p className="italic text-gray-600">{ref.title}, {ref.institutionOrCompany}</p>
                {ref.email && <p className="text-gray-600">Email: {ref.email}</p>}
                {ref.phone && <p className="text-gray-600">Tel: {ref.phone}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
