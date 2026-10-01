import React from 'react';
import { CoverLetterData, ResumeData } from '@ai-resume/core';

export const TemplateClModern: React.FC<{ data: CoverLetterData | ResumeData; isPreview?: boolean }> = ({ data, isPreview = false }) => {
  const isCoverLetter = (data as CoverLetterData).documentType === 'COVER_LETTER';
  const clData = isCoverLetter ? (data as CoverLetterData) : null;
  const resumeData = !isCoverLetter ? (data as ResumeData) : null;

  const personalInfo = data.personalInfo || { fullName: 'Sender Name', email: '', phone: '', location: '' };
  const recipient = clData?.recipient || {
    name: 'Hiring Team',
    title: 'Recruitment Committee',
    company: resumeData?.targetCompany || 'Target Organization',
    address: '100 Business Parkway'
  };

  const date = clData?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const jobTitle = clData?.jobTitle || resumeData?.targetRole || 'Software Engineering Position';
  const greeting = clData?.greeting || 'Dear Hiring Team,';
  const opening = clData?.openingParagraph || resumeData?.summary || 'I am writing to express my strong interest in joining your organization.';
  const bodyParagraphs = clData?.bodyParagraphs || [
    'With a robust background in building scalable software systems and delivering measurable technical impact, I have consistently collaborated with cross-functional teams to engineer high-quality solutions.',
    'My technical problem-solving approach and dedication to engineering excellence align directly with your team\'s standards and strategic goals.'
  ];
  const closing = clData?.closingParagraph || 'I welcome the opportunity to discuss how my background and skills can contribute to your team\'s ongoing success.';
  const signoff = clData?.signoff || 'Sincerely,\n' + (personalInfo.fullName || '');

  return (
    <div className={`w-full bg-white text-gray-900 font-sans leading-relaxed ${isPreview ? 'p-6 text-[11px]' : 'p-12 text-[13px]'}`}>
      {/* Modern Gradient Accent Top Header */}
      <div className="border-l-4 border-blue-600 pl-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {personalInfo.fullName || 'Sender Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-sm font-semibold text-blue-600 mt-0.5">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-x-3 gap-y-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Date */}
      <div className="text-xs text-gray-500 mb-6 font-medium">
        {date}
      </div>

      {/* Recipient Details */}
      <div className="text-xs text-gray-800 mb-6 space-y-0.5">
        <p className="font-bold text-slate-900">{recipient.name}</p>
        {recipient.title && <p className="text-gray-600">{recipient.title}</p>}
        <p className="font-semibold text-slate-900">{recipient.company}</p>
        {recipient.department && <p className="text-gray-600">{recipient.department}</p>}
        {recipient.address && <p className="text-gray-600">{recipient.address}</p>}
        {recipient.cityStateZip && <p className="text-gray-600">{recipient.cityStateZip}</p>}
      </div>

      {/* Subject Line */}
      <div className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs font-bold text-slate-800 mb-6 inline-block">
        RE: Application for {jobTitle}
      </div>

      {/* Greeting */}
      <p className="text-sm font-semibold text-slate-900 mb-4">
        {greeting}
      </p>

      {/* Letter Body */}
      <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
        <p>{opening}</p>
        {bodyParagraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
        <p>{closing}</p>
      </div>

      {/* Signoff */}
      <div className="mt-8 pt-4">
        <p className="text-gray-800 whitespace-pre-line font-medium">
          {signoff}
        </p>
      </div>
    </div>
  );
};
