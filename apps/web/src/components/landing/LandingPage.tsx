import React, { useEffect } from 'react';
import { TEMPLATE_CATALOG } from '@ai-resume/templates';
import { useResume } from '../../context/ResumeContext';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Download, Layout, Cpu } from 'lucide-react';
import { track } from '../../services/analytics';

interface LandingPageProps {
  onSelectTemplate: (templateId: string) => void;
  onBrowseTemplates: () => void;
  onCreateResume: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectTemplate,
  onBrowseTemplates,
  onCreateResume
}) => {
  const { setTemplate } = useResume();
  const featuredTemplates = TEMPLATE_CATALOG.filter(t => t.isPopular).slice(0, 6);

  useEffect(() => {
    track('PAGE_VIEW', { metadata: { page: 'landing' } });
  }, []);

  const handleTemplateClick = (templateId: string) => {
    track('TEMPLATE_SELECTED', { templateId, metadata: { source: 'landing_featured' } });
    setTemplate(templateId);
    onSelectTemplate(templateId);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free for Students & Job Seekers — No Signup Required</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Build a professional resume in minutes.
          </h1>

          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose from 28 verified ATS-friendly templates, customize in real-time with structured editing and optional Gemini AI assistance, and export pixel-perfect PDF & Word documents.
          </p>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={onCreateResume}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-base font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span>Create Your Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBrowseTemplates}
              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-lg text-base font-semibold border border-gray-300 shadow-xs transition-all flex items-center gap-2"
            >
              <Layout className="w-4 h-4 text-gray-500" />
              <span>Browse Templates ({TEMPLATE_CATALOG.length})</span>
            </button>
          </div>

          {/* Quick value props */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-xs text-gray-600 text-left border-t border-gray-100 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero Registration Friction</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>ATS-Optimized Structures</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Factual AI Enhancement</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-gray-700 shrink-0" />
              <span>Direct PDF & DOCX Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Templates Gallery Section */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Popular Resume Templates</h2>
            <p className="text-sm text-gray-600 mt-1">
              Field-tested single and multi-column designs optimized for university placement cells and automated recruiter scanners.
            </p>
          </div>
          <button
            onClick={onBrowseTemplates}
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700"
          >
            <span>View all 28 templates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              {/* Visual Card Header */}
              <div className="p-5 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700 uppercase tracking-wide">
                    {template.category}
                  </span>
                  <span className="text-[11px] text-gray-500 uppercase font-mono">
                    {template.pageSize} • {template.columns} Col
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-sky-600 transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Tags & Actions */}
              <div className="p-4 bg-white flex items-center justify-between gap-3 border-t border-gray-50">
                <div className="flex flex-wrap gap-1">
                  {template.suitableFor.slice(0, 2).map((s) => (
                    <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-50 text-sky-700">
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleTemplateClick(template.id)}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors shrink-0"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <button
            onClick={onBrowseTemplates}
            className="w-full py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700"
          >
            Browse All 28 Templates
          </button>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="bg-white border-y border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Why Students & Job Seekers Choose AI Resume Builder</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-5 rounded-lg border border-gray-100 bg-gray-50/50">
              <div className="w-10 h-10 rounded-md bg-sky-100 text-sky-600 flex items-center justify-center font-bold mb-4">
                <Layout className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">100% Loss-Free Template Switching</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enter your details once. Seamlessly test how your experience looks across 28 distinct designs without re-typing or losing content.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-gray-100 bg-gray-50/50">
              <div className="w-10 h-10 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center font-bold mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Safe, Factual AI Assistance</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Gemini AI optimizes action verbs, grammar, and ATS keyword density with strict guards against fabricating fake achievements or numbers.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-gray-100 bg-gray-50/50">
              <div className="w-10 h-10 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Automated ATS & JD Matching</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Paste any target job description to pinpoint matching technical skills, missing qualifications, and structure recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-gray-400 py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-bold text-gray-200">CareerDoc AI</span> — Free open productivity tool for students and job seekers worldwide.
          </div>
          <div className="flex items-center gap-6">
            <a
              href="mailto:support.dvlpr@gmail.com"
              className="text-gray-400 hover:text-indigo-400 transition-colors"
            >
              Contact Support (support.dvlpr@gmail.com)
            </a>
            <a
              href="/admin"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Admin Portal
            </a>
            <span className="text-gray-500">v1.1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
