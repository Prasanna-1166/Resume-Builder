import React from 'react';
import { LayoutGrid, Sparkles, Check, ArrowRight } from 'lucide-react';
import { TemplateGallery } from '../../components/gallery/TemplateGallery';
import { MetaTags } from '../../SEO/metadata/MetaTags';

interface ResumeTemplatesPageProps {
  onSelectTemplate: (templateId: string) => void;
  onStartBuilding: () => void;
}

export const ResumeTemplatesPage: React.FC<ResumeTemplatesPageProps> = ({
  onSelectTemplate,
  onStartBuilding
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <MetaTags path="/resume-templates" />

      {/* SEO Header */}
      <section className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Curated Design Matrix</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            38 Free ATS-Friendly Resume Templates
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every template is verified for parsing compatibility with modern applicant tracking systems (Taleo, Greenhouse, Workday, Lever). Switch designs anytime with zero data loss.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> 100% Free Access</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Instant PDF &amp; Word DOCX</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Lossless Layout Switching</span>
          </div>
        </div>
      </section>

      {/* Embedded Live Template Gallery */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TemplateGallery onSelectTemplate={onSelectTemplate} />
      </main>

      {/* SEO Template Guide Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">How to Choose the Right Resume Template</h2>
          <p className="text-sm text-slate-600">Tailor your layout to your industry, experience level, and career stage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2 text-base">Students &amp; Freshers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use academic and entry-level templates that emphasize university projects, certifications, internships, and technical skills before work experience.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2 text-base">Software Engineers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose single-column technical layouts with clean monospace skill tags, GitHub links, and clear separation of tech stacks from bullet points.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2 text-base">Executives &amp; Managers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select modern executive layouts featuring prominent executive summaries, core competencies matrices, and budget/revenue metrics.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onStartBuilding}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Start Building with Default Template</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

