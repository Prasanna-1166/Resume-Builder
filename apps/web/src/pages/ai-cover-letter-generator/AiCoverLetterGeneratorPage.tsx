import React from 'react';
import { Mail, Sparkles, Check, ArrowRight, Shield, Layers, FileCheck } from 'lucide-react';
import { MetaTags } from '../../SEO/metadata/MetaTags';

interface AiCoverLetterGeneratorPageProps {
  onStartCoverLetter: () => void;
  onBrowseTemplates: () => void;
}

export const AiCoverLetterGeneratorPage: React.FC<AiCoverLetterGeneratorPageProps> = ({
  onStartCoverLetter,
  onBrowseTemplates
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <MetaTags path="/ai-cover-letter-generator" />

      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs sm:text-sm font-medium">
            <Mail className="w-4 h-4" />
            <span>AI Cover Letter Generator</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Free AI Cover Letter Generator: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Tailored Letters in Minutes
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Generate customized cover letters that perfectly align your experience with any job posting. Choose your preferred tone, edit with complete control, and download in PDF or Word.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartCoverLetter}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Create My Cover Letter Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onBrowseTemplates}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-base transition-colors cursor-pointer"
            >
              <span>View Cover Letter Formats</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Matches Your Resume Typography</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> 100% Free Export</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Job Description Parsing</span>
          </div>
        </div>
      </section>

      {/* Feature Breakdown */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
          Why Job Seekers Love Our Cover Letter Builder
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Job Description Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paste the target job description to automatically highlight your relevant accomplishments and align terminology.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Cohesive Resume Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use matching header styles, contact rows, and fonts so your application package looks professional and unified.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Export to PDF &amp; Word</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Download clean, properly margined documents formatted for standard US Letter or A4 printing.
            </p>
          </div>
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={onStartCoverLetter}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Write Cover Letter Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

