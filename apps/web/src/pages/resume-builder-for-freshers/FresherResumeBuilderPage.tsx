import React from 'react';
import { GraduationCap, Award, FolderGit2, Check, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';
import { MetaTags } from '../../SEO/metadata/MetaTags';

interface FresherResumeBuilderPageProps {
  onStartBuilding: () => void;
  onBrowseTemplates: () => void;
}

export const FresherResumeBuilderPage: React.FC<FresherResumeBuilderPageProps> = ({
  onStartBuilding,
  onBrowseTemplates
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <MetaTags path="/resume-builder-for-freshers" />

      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs sm:text-sm font-medium">
            <GraduationCap className="w-4 h-4" />
            <span>Built Specifically for College Students &amp; Entry-Level Job Seekers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Free Resume Builder for Freshers: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Launch Your Career with Confidence
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Zero industry experience? No problem. CareerDoc AI puts your college projects, coursework, certifications, and technical skills front and center with recruiter-approved academic formats.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartBuilding}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Build Fresher Resume Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onBrowseTemplates}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-base transition-colors cursor-pointer"
            >
              <span>View Fresher Templates</span>
            </button>
          </div>
        </div>
      </section>

      {/* Value Pillars for Students */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
          How to Win Interviews Without Formal Work Experience
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Projects-First Layout</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Showcase capstone projects, hackathons, and personal builds with tech stack tags and live GitHub/demo links.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Coursework &amp; Academics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Highlight relevant coursework (e.g. Data Structures, Cloud Computing, Financial Modeling) to satisfy entry-level job criteria.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Certifications &amp; Contests</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Display AWS/Azure badges, LeetCode milestones, and student leadership roles in clean, readable sections.
            </p>
          </div>
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={onStartBuilding}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Create Your Fresher Resume Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

