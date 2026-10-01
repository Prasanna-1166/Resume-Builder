import React from 'react';
import { CoverLetterData, ResumeData } from '@ai-resume/core';

export const TemplateClMinimal: React.FC<{ data: CoverLetterData | ResumeData; isPreview?: boolean }> = ({ data, isPreview = false }) => {
  const isCoverLetter = (data as CoverLetterData).documentType === 'COVER_LETTER';
  const clData = isCoverLetter ? (data as CoverLetterData) : null;
  const resumeData = !isCoverLetter ? (data as ResumeData) : null;

  const personalInfo = data.personalInfo || { fullName: 'Candidate Name', email: '', phone: '', location: '' };
  const recipient = clData?.recipient || {
    name: 'Hiring Manager',
    title: 'Selection Committee',
    company: resumeData?.targetCompany || 'Target Organization',
    address: 'Corporate Headquarters'
  };

  const date = clData?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const jobTitle = clData?.jobTitle || resumeData?.targetRole || 'Professional Position';
  const greeting = clData?.greeting || 'Dear Hiring Manager,';
  const opening = clData?.openingParagraph || resumeData?.summary || 'I am writing to express my enthusiastic interest in the position.';
  const bodyParagraphs = clData?.bodyParagraphs || [
    'Throughout my career, I have dedicated myself to driving strategic results and delivering robust solutions in fast-paced collaborative environments.',
    'My hands-on experience and proactive problem-solving methodology equip me to generate immediate and measurable value for your team.'
  ];
  const closing = clData?.closingParagraph || 'Thank you for your time and consideration. I welcome the opportunity to discuss my qualifications in detail.';
  const signoff = clData?.signoff || 'Sincerely,\n' + (personalInfo.fullName || '');

  return (
    <div className={`w-full bg-white text-gray-800 font-sans leading-relaxed ${isPreview ? 'p-6 text-[11px]' : 'p-12 text-[13px]'}`}>
      {/* Clean Minimalist Header */}
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-2xl font-light tracking-wide text-gray-900 uppercase">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-xs font-medium text-gray-500 tracking-wider uppercase mt-1">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Date */}
      <div className="text-xs text-gray-400 mb-6 font-mono">
        {date}
      </div>

      {/* Recipient Details */}
      <div className="text-xs text-gray-700 mb-6 space-y-0.5">
        <p className="font-semibold text-gray-900">{recipient.name}</p>
        {recipient.title && <p className="text-gray-500">{recipient.title}</p>}
        <p className="font-medium text-gray-800">{recipient.company}</p>
        {recipient.department && <p className="text-gray-500">{recipient.department}</p>}
        {recipient.address && <p className="text-gray-500">{recipient.address}</p>}
        {recipient.cityStateZip && <p className="text-gray-500">{recipient.cityStateZip}</p>}
      </div>

      {/* Subject Line */}
      <div className="text-xs font-semibold text-gray-900 mb-5 tracking-wide">
        SUBJECT: Application for {jobTitle}
      </div>

      {/* Greeting */}
      <p className="text-xs font-semibold text-gray-900 mb-4">
        {greeting}
      </p>

      {/* Body */}
      <div className="space-y-4 text-gray-700 text-justify">
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
