import React from 'react';
import { ResumeData } from '@ai-resume/core';

export const TemplateCvFaculty: React.FC<{ data: ResumeData | any; isPreview?: boolean }> = ({ data, isPreview = false }) => {
  const personalInfo = data?.personalInfo || { fullName: 'Candidate Name', email: '', phone: '', location: '' };
  const education: any[] = data?.education || [];
  const experience: any[] = data?.experience || [];
  const publications: any[] = data?.publications || [];
  const researchExperience: any[] = data?.research || data?.researchExperience || [];
  const teachingExperience: any[] = data?.teachingExperience || [];
  const grantsAndFunding: any[] = data?.grantsAndFunding || [];
  const awards: any[] = data?.awards || data?.achievements || [];
  const memberships: any[] = data?.memberships || [];
  const references: any[] = data?.references || [];

  return (
    <div className={`w-full bg-white text-gray-900 font-serif leading-relaxed ${isPreview ? 'p-6 text-[11px]' : 'p-12 text-[13px]'}`}>
      {/* Header */}
      <div className="border-b-2 border-stone-800 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 uppercase font-serif">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-sm font-semibold text-stone-700 italic mt-1">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="mt-2 text-xs text-stone-600 flex flex-wrap justify-center gap-x-4 gap-y-1 font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary / Research Statement */}
      {data?.summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2 font-sans">
            Academic Profile & Research Agenda
          </h2>
          <p className="text-stone-800 leading-normal text-justify">{data.summary}</p>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2 font-sans">
            Higher Education & Academic Credentials
          </h2>
          <div className="space-y-3">
            {education.map((edu: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-stone-900">{edu.degree} in {edu.field || edu.fieldOfStudy}</h3>
                  <p className="text-stone-700 italic">{edu.institution} — {edu.location}</p>
                  {(edu.gpa || edu.gpaOrGrade) && <p className="text-xs text-stone-600 font-sans">Honors / GPA: {edu.gpa || edu.gpaOrGrade}</p>}
                </div>
                <span className="text-xs text-stone-600 font-sans whitespace-nowrap">
                  {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic Appointments & Faculty Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2 font-sans">
            Faculty Appointments & Academic Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-stone-900">{exp.position || exp.role}</h3>
                    <p className="text-stone-700 italic">{exp.company} — {exp.location}</p>
                  </div>
                  <span className="text-xs text-stone-600 font-sans whitespace-nowrap">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {(exp.highlights || exp.bullets) && (exp.highlights || exp.bullets).length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-stone-800">
                    {(exp.highlights || exp.bullets).map((h: string, hIdx: number) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Teaching Experience & Courses */}
      {teachingExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2 font-sans">
            Teaching & Pedagogical Experience
          </h2>
          <div className="space-y-3">
            {teachingExperience.map((teach: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-stone-900">{teach.courseTitle} ({teach.role})</h3>
                  <span className="text-xs text-stone-600 font-sans">{teach.term}</span>
                </div>
                <p className="text-stone-700 italic text-xs">{teach.institution} — Department: {teach.department}</p>
                {teach.description && <p className="text-stone-800 mt-1 text-xs">{teach.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Research Experience */}
      {researchExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2 font-sans">
            Funded Research & Laboratory Projects
          </h2>
          <div className="space-y-3">
            {researchExperience.map((res: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-stone-900">{res.projectTitle || res.title}</h3>
                  <span className="text-xs text-stone-600 font-sans">{res.startDate} – {res.endDate || 'Present'}</span>
                </div>
                <p className="text-stone-700 italic text-xs">{res.institution} • {res.role || 'Researcher'}</p>
                {(res.outcomes || res.bullets) && (res.outcomes || res.bullets).length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-stone-800 text-xs">
                    {(res.outcomes || res.bullets).map((o: string, oIdx: number) => (
                      <li key={oIdx}>{o}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Peer-Reviewed Publications */}
      {publications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2 font-sans">
            Scholarly Publications
          </h2>
          <ol className="list-decimal list-outside ml-4 space-y-2 text-stone-800">
            {publications.map((pub: any, idx: number) => (
              <li key={idx} className="pl-1">
                <span className="font-semibold text-stone-900">"{pub.title}."</span>{' '}
                <span className="italic text-stone-800">{pub.journal || pub.publisher}</span>{' '}
                <span className="text-stone-600 font-sans text-xs">({pub.year || pub.date})</span>
                {pub.authors && pub.authors.length > 0 && (
                  <span className="block text-xs text-stone-600 font-sans">Authors: {Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}</span>
                )}
                {pub.doi && (
                  <span className="block text-xs text-stone-500 font-sans">DOI: {pub.doi}</span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Grants & Fellowships */}
      {grantsAndFunding.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2 font-sans">
            Grants, Fellowships & Sponsored Research
          </h2>
          <div className="space-y-2">
            {grantsAndFunding.map((grant: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div>
                  <span className="font-bold text-stone-900">{grant.title}</span> — <span className="italic">{grant.agency}</span>
                  {grant.amount && <span className="font-semibold text-stone-800 font-sans ml-1">({grant.amount})</span>}
                </div>
                <span className="text-stone-600 font-sans whitespace-nowrap">{grant.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Honors & Awards */}
      {awards.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2 font-sans">
            Honors, Fellowships & Recognition
          </h2>
          <div className="space-y-1.5">
            {awards.map((award: any, idx: number) => (
              <div key={idx} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-stone-900">{award.title || award.name}</span> — <span>{award.issuer || award.organization}</span>
                </div>
                <span className="text-stone-600 font-sans">{award.year || award.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Memberships & Service */}
      {memberships.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2 font-sans">
            Professional Affiliations & Service
          </h2>
          <div className="space-y-1 text-xs">
            {memberships.map((m: any, idx: number) => (
              <div key={idx} className="flex justify-between items-baseline">
                <span className="text-stone-800 font-medium">{m.organization} {m.role ? `— ${m.role}` : ''}</span>
                <span className="text-stone-600 font-sans">{m.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic References */}
      {references.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2 font-sans">
            Academic References
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs font-sans">
            {references.map((ref: any, idx: number) => (
              <div key={idx} className="p-2 border border-stone-200 rounded">
                <p className="font-bold text-stone-900">{ref.name}</p>
                <p className="text-stone-700 italic">{ref.title}</p>
                <p className="text-stone-600">{ref.institution || ref.institutionOrCompany}</p>
                <div className="mt-1 text-stone-500">
                  {ref.email && <p>Email: {ref.email}</p>}
                  {ref.phone && <p>Tel: {ref.phone}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
