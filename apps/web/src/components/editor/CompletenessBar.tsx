import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export const CompletenessBar: React.FC = () => {
  const { completeness, navigateToEditorSection } = useResume();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
      {/* Summary Header */}
      <div
        className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-gray-800">
            Resume Completeness: <span className="text-indigo-600 font-extrabold">{completeness.score}%</span>
          </div>

          <div className="w-28 sm:w-36 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                completeness.score >= 80 ? 'bg-emerald-500' : completeness.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${completeness.score}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <span>{completeness.completedCount} of {completeness.totalCount} items complete</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* Expandable Checklist Details */}
      {isOpen && (
        <div className="px-3.5 py-3 border-t border-gray-100 bg-gray-50/70 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {completeness.items.map((item) => (
              <div
                key={item.key}
                onClick={() => item.actionTab && navigateToEditorSection(item.actionTab)}
                className={`flex items-center justify-between p-1.5 rounded-md border transition-all ${
                  item.completed
                    ? 'bg-white border-transparent'
                    : 'bg-amber-50/60 border-amber-200/60 cursor-pointer hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {item.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={`truncate ${item.completed ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                    {item.label}
                  </span>
                </div>
                {item.actionLabel && !item.completed && (
                  <span className="text-[10px] font-bold text-indigo-600 shrink-0 ml-1">
                    {item.actionLabel} →
                  </span>
                )}
              </div>
            ))}
          </div>

          {completeness.actionableRecommendations && completeness.actionableRecommendations.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-700 text-[11px] uppercase tracking-wider block mb-1.5">
                Action Recommendations:
              </span>
              <div className="space-y-1.5">
                {completeness.actionableRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => navigateToEditorSection(rec.actionTab)}
                    className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2 cursor-pointer hover:border-indigo-300 transition-all text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{rec.title}</span>
                      <p className="text-[11px] text-slate-500">{rec.description}</p>
                    </div>
                    <span className="text-[10.5px] font-bold text-indigo-600 shrink-0 flex items-center gap-0.5">
                      <span>{rec.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
