import React from 'react';
import { ShieldCheck, FileText, MessageSquare, Lock } from 'lucide-react';

interface AppFooterProps {
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
  onOpenFeedback: () => void;
  onNavigateAdmin: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  onOpenPrivacyPolicy,
  onOpenTerms,
  onOpenFeedback,
  onNavigateAdmin
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-xs border-t border-slate-800 no-print mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        {/* Brand statement */}
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-extrabold text-white text-sm tracking-tight">CareerDoc</span>
            <span className="font-bold text-indigo-400 text-sm">AI</span>
            <span className="text-slate-500 text-[11px]">• v1.2.0</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-md">
            Free, transparent, ATS-compatible career document builder for students and job seekers.
          </p>
        </div>

        {/* Action Links & Legal */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
          <button
            onClick={onOpenPrivacyPolicy}
            className="text-slate-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={onOpenTerms}
            className="text-slate-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={onOpenFeedback}
            className="text-slate-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>Contact Support</span>
          </button>

          <a
            href="mailto:support.dvlpr@gmail.com"
            className="text-slate-400 hover:text-slate-200 transition-colors font-mono text-[11px] py-1"
            title="Email support directly"
          >
            support.dvlpr@gmail.com
          </a>

          <button
            onClick={onNavigateAdmin}
            className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 text-[11px] py-1"
          >
            <Lock className="w-3 h-3" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
