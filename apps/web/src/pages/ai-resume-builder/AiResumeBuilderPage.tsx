import React from 'react';
import { Sparkles, CheckCircle2, Shield, ArrowRight, Zap, Award, FileText, Check } from 'lucide-react';
import { MetaTags } from '../../SEO/metadata/MetaTags';

interface AiResumeBuilderPageProps {
  onStartBuilding: () => void;
  onBrowseTemplates: () => void;
}

export const AiResumeBuilderPage: React.FC<AiResumeBuilderPageProps> = ({
  onStartBuilding,
  onBrowseTemplates
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <MetaTags path="/ai-resume-builder" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Intelligent AI Bullet &amp; Summary Optimization</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Free AI Resume Builder: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Craft ATS-Optimized Resumes
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
            Turn duty-based bullets into quantified achievements. CareerDoc AI guides your writing with real-time ATS scoring, industry-tested action verbs, and strictly zero fabricated metrics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartBuilding}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Build My AI Resume Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onBrowseTemplates}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-base transition-colors cursor-pointer"
            >
              <span>Explore 38 ATS Templates</span>
            </button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> 100% Free Core Features</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Instant PDF &amp; Word Export</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Client-Side Data Privacy</span>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How Our AI Enhances Your Job Applications
          </h2>
          <p className="text-slate-600 text-base">
            Unlike generic chatbots, CareerDoc AI uses deterministic career heuristics engineered specifically for applicant tracking systems and human recruiters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Impact-Driven Bullet Rewriting</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Converts passive phrases like &quot;worked on database&quot; into recruiter-ready bullets like &quot;Refactored PostgreSQL indexing, reducing query response times by 35%.&quot;
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Role-Targeted Summaries</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generate tailored professional summaries in 3 distinct tones: Technical &amp; Direct, Leadership &amp; Strategy, or Student Entry-Level.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Factual Integrity Guardrail</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our AI never invents metrics, certifications, or employment dates. It suggests placeholder templates where you input real, verifiable outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Step by Step Workflow */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Create Your Professional Resume in 4 Simple Steps
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              No subscription gates or hidden export fees. Get from blank page to downloaded PDF in under ten minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-3xl font-black text-indigo-600 mb-2">01</div>
              <h3 className="font-bold text-slate-900 mb-1">Select an ATS Template</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Choose from 38 battle-tested layouts optimized for applicant tracking system parsers.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-3xl font-black text-indigo-600 mb-2">02</div>
              <h3 className="font-bold text-slate-900 mb-1">Enter Experience &amp; Skills</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Fill out modular sections with pre-categorized skill pickers and quick form inputs.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-3xl font-black text-indigo-600 mb-2">03</div>
              <h3 className="font-bold text-slate-900 mb-1">Enhance with AI Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Click AI Enhance on any bullet point or summary for instant keyword and phrasing improvements.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-3xl font-black text-indigo-600 mb-2">04</div>
              <h3 className="font-bold text-slate-900 mb-1">Export PDF or Word DOCX</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Download your clean, perfectly-aligned document ready to submit to recruiters.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Is CareerDoc AI completely free?</h3>
            <p className="text-sm text-slate-600">
              Yes. All 38 templates, the AI bullet rewording assistant, real-time ATS scoring, and both PDF and Word DOCX downloads are 100% free with no credit card required.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">How does CareerDoc AI protect my personal information?</h3>
            <p className="text-sm text-slate-600">
              Your resume data is stored locally in your browser. ATS audit checks execute directly in JavaScript without sending your document content to third parties.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Can I switch templates without losing my resume text?</h3>
            <p className="text-sm text-slate-600">
              Yes! Our lossless template switching architecture guarantees zero data loss when toggling between modern, classic, technical, or executive templates.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-indigo-950 mb-2">Ready to Build Your Winning Resume?</h3>
          <p className="text-sm text-indigo-700 mb-6">Join thousands of job seekers creating ATS-compliant resumes today.</p>
          <button
            onClick={onStartBuilding}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Start Building for Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

