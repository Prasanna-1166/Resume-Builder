import React from 'react';
import { ShieldCheck, FileText, MessageSquare, Lock, Sparkles, BookOpen, Layers } from 'lucide-react';

interface AppFooterProps {
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
  onOpenFeedback: () => void;
  onNavigateAdmin: () => void;
  onNavigateRoute?: (route: string) => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  onOpenPrivacyPolicy,
  onOpenTerms,
  onOpenFeedback,
  onNavigateAdmin,
  onNavigateRoute
}) => {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (onNavigateRoute) {
      onNavigateRoute(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 no-print mt-auto">
      {/* Upper Footer: Structured Categorized Internal Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Core AI Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Free AI Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/ai-resume-builder"
                  onClick={e => handleNav(e, '/ai-resume-builder')}
                  className="hover:text-white transition-colors"
                >
                  AI Resume Builder
                </a>
              </li>
              <li>
                <a
                  href="/ats-resume-checker"
                  onClick={e => handleNav(e, '/ats-resume-checker')}
                  className="hover:text-white transition-colors"
                >
                  ATS Resume Checker
                </a>
              </li>
              <li>
                <a
                  href="/resume-templates"
                  onClick={e => handleNav(e, '/resume-templates')}
                  className="hover:text-white transition-colors"
                >
                  38 Resume Templates
                </a>
              </li>
              <li>
                <a
                  href="/ai-cover-letter-generator"
                  onClick={e => handleNav(e, '/ai-cover-letter-generator')}
                  className="hover:text-white transition-colors"
                >
                  AI Cover Letter Generator
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Role-Specific Builders */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Tailored Builders
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/resume-builder-for-freshers"
                  onClick={e => handleNav(e, '/resume-builder-for-freshers')}
                  className="hover:text-white transition-colors"
                >
                  Resume Builder for Freshers
                </a>
              </li>
              <li>
                <a
                  href="/developer-resume-builder"
                  onClick={e => handleNav(e, '/developer-resume-builder')}
                  className="hover:text-white transition-colors"
                >
                  Developer Resume Builder
                </a>
              </li>
              <li>
                <a
                  href="/resume-templates"
                  onClick={e => handleNav(e, '/resume-templates')}
                  className="hover:text-white transition-colors"
                >
                  Academic CV Templates
                </a>
              </li>
              <li>
                <a
                  href="/resume-templates"
                  onClick={e => handleNav(e, '/resume-templates')}
                  className="hover:text-white transition-colors"
                >
                  Executive Resume Formats
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Career Resources & Guides */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Guides &amp; Advice
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/blog"
                  onClick={e => handleNav(e, '/blog')}
                  className="hover:text-white transition-colors"
                >
                  Career &amp; Resume Blog
                </a>
              </li>
              <li>
                <a
                  href="/blog/ats-friendly-resume-guide"
                  onClick={e => handleNav(e, '/blog/ats-friendly-resume-guide')}
                  className="hover:text-white transition-colors"
                >
                  ATS-Friendly Resume Guide
                </a>
              </li>
              <li>
                <a
                  href="/blog/resume-for-freshers"
                  onClick={e => handleNav(e, '/blog/resume-for-freshers')}
                  className="hover:text-white transition-colors"
                >
                  Fresher Resume Guide
                </a>
              </li>
              <li>
                <a
                  href="/blog/software-developer-resume-guide"
                  onClick={e => handleNav(e, '/blog/software-developer-resume-guide')}
                  className="hover:text-white transition-colors"
                >
                  Developer Resume Blueprint
                </a>
              </li>
              <li>
                <a
                  href="/blog/how-to-improve-ats-score"
                  onClick={e => handleNav(e, '/blog/how-to-improve-ats-score')}
                  className="hover:text-white transition-colors"
                >
                  How to Improve ATS Score
                </a>
              </li>
              <li>
                <a
                  href="/blog/how-to-write-cover-letter"
                  onClick={e => handleNav(e, '/blog/how-to-write-cover-letter')}
                  className="hover:text-white transition-colors"
                >
                  How to Write a Cover Letter
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Brand & Privacy Commitment */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              CareerDoc AI
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Production-ready, transparent, ATS-compatible career document maker. Resumes, CVs, and cover letters with deterministic local ATS audit checks and client-side privacy.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded-md">
                v1.2.0 Production
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Bar: Legal & Copyright */}
      <div className="border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[11px] text-slate-500">
            &copy; 2026 CareerDoc AI (https://dvlpr.dpdns.org). All rights reserved. Free for job seekers and students worldwide.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <button
              onClick={onOpenPrivacyPolicy}
              className="text-slate-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={onOpenTerms}
              className="text-slate-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Terms of Service</span>
            </button>

            <button
              onClick={onOpenFeedback}
              className="text-slate-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Contact Support</span>
            </button>

            <a
              href="mailto:support.dvlpr@gmail.com"
              className="text-slate-400 hover:text-slate-200 transition-colors font-mono text-[11px] py-1"
              title="Official support email"
            >
              support.dvlpr@gmail.com
            </a>

            <button
              onClick={onNavigateAdmin}
              className="text-slate-500 hover:text-white transition-colors inline-flex items-center gap-1 text-[11px] py-1"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
