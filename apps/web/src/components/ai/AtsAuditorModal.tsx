import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { ShieldCheck, AlertTriangle, AlertCircle, Info, X, CheckCircle2 } from 'lucide-react';

interface AtsAuditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AtsAuditorModal: React.FC<AtsAuditorModalProps> = ({ isOpen, onClose }) => {
  const { atsResult } = useResume();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-emerald-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">ATS Parser Audit & Health Check</h3>
              <p className="text-xs text-gray-500">Heuristic structural audit for automated screening systems.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Disclaimer Banner */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-600 leading-relaxed">
            <strong>Notice:</strong> No tool can guarantee 100% ATS pass rates because individual hiring software (Workday, Greenhouse, Taleo) use custom ranking rules. This audit tests standard parsing heuristics, keyword density, and formatting integrity.
          </div>

          {/* Score & Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <span className="text-[11px] font-semibold text-gray-500 block">Readability Score</span>
              <span className="text-2xl font-extrabold text-emerald-600">{atsResult.score}/100</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Grade: {atsResult.grade}</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <span className="text-[11px] font-semibold text-gray-500 block">Keywords & Skills</span>
              <span className="text-2xl font-extrabold text-gray-800">{atsResult.keywordCount}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Identified tools</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <span className="text-[11px] font-semibold text-gray-500 block">Strong Action Verbs</span>
              <span className="text-2xl font-extrabold text-sky-600">{atsResult.actionVerbRatio}%</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Bullet density</span>
            </div>
          </div>

          {/* Audit Issues Checklist */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
              Auditor Findings & Recommendations ({atsResult.issues.length})
            </h4>

            {atsResult.issues.length === 0 ? (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Excellent structure! No critical parsing or structural issues detected.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {atsResult.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      issue.severity === 'error'
                        ? 'bg-red-50/60 border-red-200 text-red-900'
                        : issue.severity === 'warning'
                        ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                        : 'bg-blue-50/60 border-blue-200 text-blue-900'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      {issue.severity === 'error' ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      ) : issue.severity === 'warning' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      )}
                      <span>{issue.title}</span>
                    </div>

                    <p className="text-[11.5px] opacity-90 pl-5">{issue.description}</p>
                    <div className="text-[11px] font-semibold pl-5 opacity-100">
                      Recommendation: {issue.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded text-xs font-semibold"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
