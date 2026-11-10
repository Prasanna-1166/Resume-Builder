import React from 'react';
import { Terminal, Code, Cpu, GitBranch, ArrowRight, Check, ShieldCheck, Zap } from 'lucide-react';
import { MetaTags } from '../../SEO/metadata/MetaTags';

interface DeveloperResumeBuilderPageProps {
  onStartBuilding: () => void;
  onBrowseTemplates: () => void;
}

export const DeveloperResumeBuilderPage: React.FC<DeveloperResumeBuilderPageProps> = ({
  onStartBuilding,
  onBrowseTemplates
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <MetaTags path="/developer-resume-builder" />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs sm:text-sm font-mono">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>git checkout -b feature/winning-resume</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Software Developer Resume Builder: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
              Engineered for Tech Stacks &amp; Impact
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Skip clumsy graphic templates. Build a clean, recruiter-approved technical resume that showcases languages, frameworks, system architecture, GitHub repositories, and quantitative metrics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartBuilding}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 transition-all cursor-pointer font-mono text-sm"
            >
              <span>Build Developer Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onBrowseTemplates}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-base transition-colors cursor-pointer"
            >
              <span>View Tech Templates</span>
            </button>
          </div>
        </div>
      </section>

      {/* Developer-Specific Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
          Engineered for Modern Engineering Hiring Bars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Categorized Tech Stacks</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Neatly categorize your proficiencies into Languages (TypeScript, Go, Python), Frameworks (React, Node, Next), and Cloud / Infrastructure (Docker, K8s, AWS).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Quantifiable Outcome Bullets</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Highlight system metrics that matter: RPS throughput, p99 latency improvements, test coverage gains, and CI/CD build time reductions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Verified ATS Readability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every technical template is tested against parsing engines to prevent your tech skills from getting jumbled or stripped out during resume ingestion.
            </p>
          </div>
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={onStartBuilding}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer font-mono"
          >
            <span>Launch Developer Editor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

