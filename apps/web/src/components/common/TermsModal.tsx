import React from 'react';
import { FileText, Shield, CheckCircle2, AlertTriangle, X, Mail } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="terms-title" className="font-bold text-slate-900 text-base">
                Terms of Service
              </h2>
              <p className="text-xs text-slate-500">
                CareerDoc AI • Free Professional Career Tools
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Close Terms of Service"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing and using CareerDoc AI, you agree to these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              2. Factual Accuracy & Candidate Responsibility
            </h3>
            <p>
              You are solely responsible for ensuring that all information, work history, educational achievements, skills, and dates in your resumes and applications are completely accurate and truthful.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Important Notice on AI Suggestions:</strong> AI-generated or AI-revised suggestions are provided solely as advisory drafting recommendations. You must carefully review all suggestions before accepting and distributing your resume. We make no warranty that AI outputs are error-free or guaranteed to pass any proprietary ATS system.
              </span>
            </div>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              3. Permitted Use & Academic Integrity
            </h3>
            <p>
              CareerDoc AI is intended to assist job seekers, students, and professionals in formatting and articulating their genuine qualifications. You agree not to use the service to generate fraudulent credentials, misrepresent work history, or inject malicious code into templates or systems.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              4. Disclaimer of Warranties
            </h3>
            <p>
              The application and its templates are provided on an &quot;as-is&quot; and &quot;as-available&quot; basis without warranties of any kind, either express or implied, including fitness for a particular hiring outcome or interview placement.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              5. Contact & Support
            </h3>
            <p>
              For questions regarding these terms, contact us at{' '}
              <a href="mailto:support.dvlpr@gmail.com" className="font-mono font-bold text-indigo-700 underline">
                support.dvlpr@gmail.com
              </a>.
            </p>
          </section>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
