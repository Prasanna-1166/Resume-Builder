import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Zap, Target, Search, FileText } from 'lucide-react';
import { MetaTags } from '../../SEO/metadata/MetaTags';

interface AtsResumeCheckerPageProps {
  onStartBuilding: () => void;
  onOpenAtsAuditor: () => void;
}

export const AtsResumeCheckerPage: React.FC<AtsResumeCheckerPageProps> = ({
  onStartBuilding,
  onOpenAtsAuditor
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <MetaTags path="/ats-resume-checker" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs sm:text-sm font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Free Local ATS Auditor • Zero Data Upload</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Free ATS Resume Checker: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              Score &amp; Audit Your Resume
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
            Over 75% of resumes are filtered out before reaching human eyes. Scan your resume against ATS algorithms for section integrity, keyword density, and formatting compliance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenAtsAuditor}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Zap className="w-5 h-5" />
              <span>Launch Live ATS Auditor</span>
            </button>
            <button
              onClick={onStartBuilding}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-base transition-colors cursor-pointer"
            >
              <span>Build an ATS-Friendly Resume</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Simulation / What We Audit */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            What Our ATS Scanner Evaluates
          </h2>
          <p className="text-slate-600 text-base">
            Our engine checks 18 critical parameters across formatting, content, keyword hierarchy, and contact metadata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Section Headers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verifies canonical headings (Experience, Education, Skills, Projects) recognized by Taleo, Greenhouse, and Workday.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Action Verb Strength</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Flags passive phrases and measures the ratio of high-impact action verbs opening each experience bullet point.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Keyword Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cross-references job description requirements against candidate skills to detect missing technical proficiencies.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Formatting Traps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detects problematic layouts like multi-layer text boxes, non-standard symbols, and inaccessible tables.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison: ATS-Friendly vs Non-Compliant */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            Why Generic Graphic Templates Fail ATS Scans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-rose-200 shadow-xs">
              <div className="flex items-center gap-2 text-rose-600 font-bold mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span>Non-Compliant Generic Resume</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Graphic skill bars (e.g. 4/5 stars) which ATS cannot parse as text</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Complex multi-column tables that scramble reading sequence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Important contact info placed inside header/footer bands</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Creative section names like &quot;Where I&apos;ve Been&quot; instead of Experience</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-emerald-200 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span>CareerDoc AI Compliant Layout</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Machine-readable plain text skills grouped by recognized categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Single-flow or cleanly stacked sections tested on Workday &amp; Taleo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Standard reverse-chronological work and education entries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Clean DOCX and text-based PDF formats with standard font metrics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">ATS Checker FAQs</h2>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-1">What is considered a good ATS score?</h3>
            <p className="text-sm text-slate-600">
              A score of 80% or higher indicates that your document is cleanly structured, contains necessary contact and role sections, uses active verbs, and features no formatting blockers.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-1">Do I need to pay to check my score?</h3>
            <p className="text-sm text-slate-600">
              No. CareerDoc AI provides 100% free ATS scoring with zero upsells, subscriptions, or credit card requirements.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onStartBuilding}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Audit &amp; Build Your Resume Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

