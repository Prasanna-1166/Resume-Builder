import React from 'react';
import { ResumeData } from '@ai-resume/core';
import { ContactRow } from '../components/ContactRow';
import { SectionHeader } from '../components/SectionHeader';
import { ExperienceItem } from '../components/ExperienceItem';
import { EducationItem } from '../components/EducationItem';
import { ProjectItem } from '../components/ProjectItem';
import { SkillsBlock } from '../components/SkillsBlock';


interface TemplateProps {
  data: ResumeData;
  isPreview?: boolean;
}

export const Template15: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, education, experience, projects, skills, certifications, achievements, publications, activities, languages, customSections, sectionVisibility } = data;
  const isVisible = (sec: string) => sectionVisibility?.[sec] !== false;

  const fontClass = 'font-sans';
  const pageClass = 'w-[8.5in] min-h-[11in]';


  // Template 15: Deedy Two-Column Asymmetric Layout
  if ("template_15" === "template_15") {
    return (
      <div className={`bg-white text-gray-900 p-8 shadow-sm print:shadow-none print:p-8 mx-auto leading-normal ${pageClass} ${fontClass}`}>
        {/* Header */}
        <div className="border-b-2 pb-2 mb-4 flex justify-between items-baseline" style={{ borderColor: "#2563eb" }}>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase text-blue-600">
              {personalInfo.fullName || 'YOUR NAME'}
            </h1>
            {personalInfo.professionalTitle && (
              <div className="text-sm font-medium text-gray-600 mt-0.5">{personalInfo.professionalTitle}</div>
            )}
          </div>
          <div className="text-right text-[11.5px] text-gray-600">
            <div>{personalInfo.email}</div>
            <div>{personalInfo.phone} | {personalInfo.location}</div>
            {personalInfo.github && <div>{personalInfo.github}</div>}
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column (35%) */}
          <div className="col-span-4 space-y-4 border-r pr-4 border-gray-200">
            {isVisible('education') && education && education.length > 0 && (
              <div>
                <SectionHeader title="Education" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
                {education.map(e => <EducationItem key={e.id} item={e} />)}
              </div>
            )}

            {isVisible('skills') && skills && skills.length > 0 && (
              <div>
                <SectionHeader title="Skills" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
                <SkillsBlock skills={skills} variant="grid-pills" />
              </div>
            )}

            {isVisible('certifications') && certifications && certifications.length > 0 && (
              <div>
                <SectionHeader title="Certifications" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
                <div className="space-y-1.5 text-[11.5px]">
                  {certifications.map(c => (
                    <div key={c.id}>
                      <div className="font-semibold text-gray-900">{c.name}</div>
                      <div className="text-gray-500">{c.issuer} ({c.date})</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isVisible('languages') && languages && languages.length > 0 && (
              <div>
                <SectionHeader title="Languages" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
                <div className="space-y-1 text-[11.5px]">
                  {languages.map(l => (
                    <div key={l.id} className="flex justify-between">
                      <span className="font-medium text-gray-800">{l.name}</span>
                      <span className="text-gray-500">{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (65%) */}
          <div className="col-span-8 space-y-4">
            {isVisible('summary') && summary && (
              <div>
                <SectionHeader title="Summary" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
                <p className="text-[12px] text-gray-700 leading-relaxed">{summary}</p>
              </div>
            )}

            {isVisible('experience') && experience && experience.length > 0 && (
              <div>
                <SectionHeader title="Experience" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
                {experience.map(e => <ExperienceItem key={e.id} item={e} />)}
              </div>
            )}

            {isVisible('projects') && projects && projects.length > 0 && (
              <div>
                <SectionHeader title="Projects" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
                {projects.map(p => <ProjectItem key={p.id} item={p} />)}
              </div>
            )}

            {isVisible('achievements') && achievements && achievements.length > 0 && (
              <div>
                <SectionHeader title="Awards & Honors" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
                <ul className="list-disc pl-4 space-y-1 text-[12px] text-gray-800">
                  {achievements.map(a => (
                    <li key={a.id}>
                      <span className="font-semibold">{a.title}: </span>
                      <span>{a.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className={`bg-white text-gray-900 p-8 shadow-sm print:shadow-none print:p-8 mx-auto leading-normal ${pageClass} ${fontClass}`}>
      {/* Header */}
      <header className="text-center mb-3">
        <h1 className="text-2xl font-bold tracking-tight uppercase" style={{ color: '#2563eb' }}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.professionalTitle && (
          <div className="text-[13px] font-medium text-gray-600 mt-0.5">
            {personalInfo.professionalTitle}
          </div>
        )}

        <ContactRow personalInfo={personalInfo} separator="none" showIcons={false} className="mt-1" />
      </header>

      {/* Summary */}
      {isVisible('summary') && summary && (
        <section className="mb-2.5">
          <SectionHeader title="Professional Summary" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
          <p className="text-[12px] text-gray-800 leading-relaxed text-justify">{summary}</p>
        </section>
      )}

      {/* Education */}
      {isVisible('education') && education && education.length > 0 && (
        <section className="mb-2.5">
          <SectionHeader title="Education" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
          {education.map((e) => (
            <EducationItem key={e.id} item={e} />
          ))}
        </section>
      )}



      {/* Experience */}
      {isVisible('experience') && experience && experience.length > 0 && (
        <section className="mb-2.5">
          <SectionHeader title="Experience" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
          {experience.map((e) => (
            <ExperienceItem key={e.id} item={e} />
          ))}
        </section>
      )}

      {/* Projects */}
      {isVisible('projects') && projects && projects.length > 0 && (
        <section className="mb-2.5">
          <SectionHeader title="Projects" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
          {projects.map((p) => (
            <ProjectItem key={p.id} item={p} />
          ))}
        </section>
      )}

      {/* Technical Skills */}
      {isVisible('skills') && skills && skills.length > 0 && (
        <section className="mb-2.5">
          <SectionHeader title="Technical & Domain Skills" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
          <SkillsBlock skills={skills} variant={'inline-colon'} />
        </section>
      )}

      {/* Certifications */}
      {isVisible('certifications') && certifications && certifications.length > 0 && (
        <section className="mb-2.5">
          <SectionHeader title="Certifications" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
          <div className="space-y-1 text-[12px] text-gray-800">
            {certifications.map((c) => (
              <div key={c.id} className="flex justify-between items-baseline">
                <span className="font-semibold text-gray-900">{c.name} — <span className="font-normal text-gray-700">{c.issuer}</span></span>
                <span className="text-gray-500 text-[11.5px]">{c.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements / Honors */}
      {isVisible('achievements') && achievements && achievements.length > 0 && (
        <section className="mb-2.5">
          <SectionHeader title="Honors & Achievements" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
          <ul className="pl-4 list-disc space-y-0.5 text-[12px] text-gray-800">
            {achievements.map((a) => (
              <li key={a.id}>
                <span className="font-semibold text-gray-900">{a.title}: </span>
                <span>{a.description}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Publications */}
      {isVisible('publications') && publications && publications.length > 0 && (
        <section className="mb-2.5">
          <SectionHeader title="Publications" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
          <div className="space-y-1.5 text-[12px] text-gray-800">
            {publications.map((p) => (
              <div key={p.id}>
                <div className="font-semibold text-gray-900">{p.title}</div>
                <div className="text-gray-600 text-[11.5px]">{p.publisher} ({p.date})</div>
                {p.description && <div className="text-gray-700 text-[11.5px] mt-0.5">{p.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {isVisible('languages') && languages && languages.length > 0 && (
        <section className="mb-2.5">
          <SectionHeader title="Languages" accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
          <div className="flex flex-wrap gap-x-4 text-[12px] text-gray-800">
            {languages.map((l) => (
              <span key={l.id}>
                <span className="font-medium text-gray-900">{l.name}</span>
                <span className="text-gray-500 text-[11.5px]"> ({l.proficiency})</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {isVisible('customSections') && customSections && customSections.length > 0 && (
        customSections.map(cs => (
          <section key={cs.id} className="mb-2.5">
            <SectionHeader title={cs.heading} accentColor="#2563eb" variant="small-caps" fontStyle="sans" />
            <ul className="pl-4 list-disc space-y-0.5 text-[12px] text-gray-800">
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
