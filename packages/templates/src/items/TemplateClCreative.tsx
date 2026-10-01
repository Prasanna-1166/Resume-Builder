import React from 'react';
import { CoverLetterData, ResumeData } from '@ai-resume/core';

export const TemplateClCreative: React.FC<{ data: CoverLetterData | ResumeData; isPreview?: boolean }> = ({ data, isPreview = false }) => {
  const isCoverLetter = (data as CoverLetterData).documentType === 'COVER_LETTER';
  const clData = isCoverLetter ? (data as CoverLetterData) : null;
  const resumeData = !isCoverLetter ? (data as ResumeData) : null;

  const personalInfo = data.personalInfo || { fullName: 'Candidate Name', email: '', phone: '', location: '' };
  const recipient = clData?.recipient || {
    name: 'Creative Director',
    title: 'Design & Product Leadership',
    company: resumeData?.targetCompany || 'Studio Innovation Lab',
    address: '450 Creative Plaza'
  };

  const date = clData?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const jobTitle = clData?.jobTitle || resumeData?.targetRole || 'Senior Product Designer / Tech Lead';
  const greeting = clData?.greeting || 'Dear Hiring Team,';
  const opening = clData?.openingParagraph || resumeData?.summary || 'I am excited to submit my application to join your creative engineering team.';
  const bodyParagraphs = clData?.bodyParagraphs || [
    'Throughout my design and product leadership experience, I have specialized in turning intricate product requirements into elegant, high-impact user experiences that elevate customer satisfaction and accelerate adoption.',
    'I thrive at the intersection of design systems, rapid prototyping, and engineering rigor—empowering multidisciplinary teams to craft distinctive, accessible, and scalable digital products.'
  ];
  const closing = clData?.closingParagraph || 'I would love the opportunity to walk through my design philosophy and explore how my creative capabilities will contribute to your vision.';
  const signoff = clData?.signoff || 'Warm regards,\n' + (personalInfo.fullName || '');

  return (
    <div className={`w-full bg-white text-gray-900 font-sans leading-relaxed ${isPreview ? 'p-6 text-[11px]' : 'p-12 text-[13px]'}`}>
      {/* Creative Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-indigo-800 text-white p-6 rounded-lg mb-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-teal-200 text-xs font-semibold tracking-wide uppercase mt-1">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="mt-3 text-xs text-teal-100 flex flex-wrap gap-x-4 gap-y-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Date & Recipient Grid */}
      <div className="flex justify-between items-start text-xs text-gray-600 mb-6">
        <div>
          <p className="font-bold text-gray-900">{recipient.name}</p>
          {recipient.title && <p className="text-gray-500">{recipient.title}</p>}
          <p className="font-semibold text-teal-800">{recipient.company}</p>
          {recipient.address && <p className="text-gray-500">{recipient.address}</p>}
          {recipient.cityStateZip && <p className="text-gray-500">{recipient.cityStateZip}</p>}
        </div>
        <div className="text-right font-medium text-gray-500">
          {date}
        </div>
      </div>

      {/* Subject Line Callout */}
      <div className="border-l-4 border-teal-600 pl-3 py-1 bg-teal-50/50 mb-6">
        <p className="text-xs font-bold text-teal-900">
          APPLICATION FOR: {jobTitle}
        </p>
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
        <p className="text-gray-900 whitespace-pre-line font-medium">
          {signoff}
        </p>
      </div>
    </div>
  );
};
