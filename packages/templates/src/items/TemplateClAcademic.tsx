import React from 'react';
import { CoverLetterData, ResumeData } from '@ai-resume/core';

export const TemplateClAcademic: React.FC<{ data: CoverLetterData | ResumeData; isPreview?: boolean }> = ({ data, isPreview = false }) => {
  const isCoverLetter = (data as CoverLetterData).documentType === 'COVER_LETTER';
  const clData = isCoverLetter ? (data as CoverLetterData) : null;
  const resumeData = !isCoverLetter ? (data as ResumeData) : null;

  const personalInfo = data.personalInfo || { fullName: 'Candidate Name', email: '', phone: '', location: '' };
  const recipient = clData?.recipient || {
    name: 'Search Committee Chair',
    title: 'Department Search Committee',
    company: resumeData?.targetCompany || 'University Faculty Search',
    address: 'Academic Affairs Building'
  };

  const date = clData?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const jobTitle = clData?.jobTitle || resumeData?.targetRole || 'Tenure-Track Faculty Position';
  const greeting = clData?.greeting || 'Dear Search Committee Members,';
  const opening = clData?.openingParagraph || resumeData?.summary || 'I am writing to submit my application for the faculty position.';
  const bodyParagraphs = clData?.bodyParagraphs || [
    'My research agenda centers on advancing computational methodologies and publishing high-impact peer-reviewed discoveries. In parallel, my pedagogical experience encompasses curriculum design, student mentorship, and laboratory leadership.',
    'I am particularly drawn to your department\'s commitment to academic innovation and interdisciplinary scholarship, where my background in research and teaching will foster fruitful student and faculty collaborations.'
  ];
  const closing = clData?.closingParagraph || 'Thank you for your review and consideration of my dossier. I look forward to discussing how my research and pedagogical vision align with your department.';
  const signoff = clData?.signoff || 'Respectfully submitted,\n\n' + (personalInfo.fullName || '');

  return (
    <div className={`w-full bg-white text-stone-900 font-serif leading-relaxed ${isPreview ? 'p-6 text-[11px]' : 'p-12 text-[13px]'}`}>
      {/* Formal Academic Header */}
      <div className="border-b-2 border-stone-800 pb-4 mb-6 text-center font-serif">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 uppercase">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-xs font-medium text-stone-700 italic mt-0.5">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="mt-2 text-xs text-stone-600 flex flex-wrap justify-center gap-x-3 gap-y-1 font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {/* Date */}
      <div className="text-xs text-stone-600 mb-6 font-sans">
        {date}
      </div>

      {/* Recipient Address Block */}
      <div className="text-xs text-stone-800 mb-6 space-y-0.5">
        <p className="font-bold text-stone-900">{recipient.name}</p>
        {recipient.title && <p className="italic text-stone-700">{recipient.title}</p>}
        <p className="font-semibold text-stone-900">{recipient.company}</p>
        {recipient.department && <p className="text-stone-700">{recipient.department}</p>}
        {recipient.address && <p className="text-stone-700">{recipient.address}</p>}
        {recipient.cityStateZip && <p className="text-stone-700">{recipient.cityStateZip}</p>}
      </div>

      {/* Subject Line */}
      <div className="text-xs font-bold text-stone-900 mb-5 border-l-2 border-stone-800 pl-2">
        APPLICATION FOR: {jobTitle}
      </div>

      {/* Greeting */}
      <p className="text-xs font-bold text-stone-900 mb-4">
        {greeting}
      </p>

      {/* Letter Body */}
      <div className="space-y-4 text-stone-800 text-justify">
        <p>{opening}</p>
        {bodyParagraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
        <p>{closing}</p>
      </div>

      {/* Signoff */}
      <div className="mt-8 pt-4">
        <p className="text-stone-900 whitespace-pre-line font-medium">
          {signoff}
        </p>
      </div>
    </div>
  );
};
