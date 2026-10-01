import React from 'react';
import { CoverLetterData, ResumeData } from '@ai-resume/core';

export const TemplateClProfessional: React.FC<{ data: CoverLetterData | ResumeData; isPreview?: boolean }> = ({ data, isPreview = false }) => {
  const isCoverLetter = (data as CoverLetterData).documentType === 'COVER_LETTER';
  const clData = isCoverLetter ? (data as CoverLetterData) : null;
  const resumeData = !isCoverLetter ? (data as ResumeData) : null;

  const personalInfo = data.personalInfo || { fullName: 'Sender Name', email: '', phone: '', location: '' };
  const recipient = clData?.recipient || {
    name: 'Hiring Official',
    title: 'Selection Committee',
    company: resumeData?.targetCompany || 'Executive Enterprise',
    address: '500 Corporate Boulevard'
  };

  const date = clData?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const jobTitle = clData?.jobTitle || resumeData?.targetRole || 'Professional Role';
  const greeting = clData?.greeting || 'Dear Selection Committee,';
  const opening = clData?.openingParagraph || resumeData?.summary || 'Please accept this letter and accompanying credentials as an expression of my strong interest in the open position.';
  const bodyParagraphs = clData?.bodyParagraphs || [
    'Throughout my tenure in the industry, I have developed deep competencies in executing complex projects, driving operational efficiency, and maintaining rigorous quality benchmarks.',
    'I bring a disciplined, analytical approach to problem-solving and a dedicated commitment to cross-functional leadership that aligns seamlessly with your organization\'s strategic roadmap.'
  ];
  const closing = clData?.closingParagraph || 'Thank you for your time and thoughtful consideration. I look forward to the possibility of discussing my background in greater detail.';
  const signoff = clData?.signoff || 'Sincerely,\n\n' + (personalInfo.fullName || '');

  return (
    <div className={`w-full bg-white text-gray-900 font-serif leading-relaxed ${isPreview ? 'p-6 text-[11px]' : 'p-12 text-[13px]'}`}>
      {/* Formal Centered Header with Separator Line */}
      <header className="text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-900 font-serif">
          {personalInfo.fullName || 'Sender Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-xs uppercase tracking-wider text-slate-600 font-sans mt-1 font-semibold">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="mt-2 text-xs font-sans text-gray-600 flex justify-center flex-wrap gap-x-3">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && <span>• {personalInfo.email}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </header>

      {/* Date & Recipient Block */}
      <div className="flex justify-between items-start mb-6 text-xs font-sans text-gray-800">
        <div>
          <p className="font-bold text-slate-900">{recipient.name}</p>
          {recipient.title && <p className="text-gray-600">{recipient.title}</p>}
          <p className="font-semibold text-slate-800">{recipient.company}</p>
          {recipient.address && <p className="text-gray-600">{recipient.address}</p>}
          {recipient.cityStateZip && <p className="text-gray-600">{recipient.cityStateZip}</p>}
        </div>
        <div className="text-right font-medium text-gray-600">
          {date}
        </div>
      </div>

      {/* Formal Subject Header */}
      <div className="border-b border-gray-300 pb-1 mb-5">
        <p className="text-xs font-bold font-sans uppercase tracking-wider text-slate-900">
          Application for: {jobTitle} {clData?.targetCompany ? `(${clData.targetCompany})` : ''}
        </p>
      </div>

      {/* Salutation */}
      <p className="text-sm font-semibold text-slate-900 mb-4 font-serif">
        {greeting}
      </p>

      {/* Letter Body Paragraphs */}
      <div className="space-y-4 text-gray-800 text-justify leading-relaxed">
        <p className="indent-6">{opening}</p>
        {bodyParagraphs.map((para, idx) => (
          <p key={idx} className="indent-6">{para}</p>
        ))}
        <p className="indent-6">{closing}</p>
      </div>

      {/* Formal Signoff */}
      <div className="mt-8 pt-4">
        <p className="text-gray-900 font-serif whitespace-pre-line font-medium">
          {signoff}
        </p>
      </div>
    </div>
  );
};
