import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Target,
  Zap,
  HelpCircle,
  Sliders
} from 'lucide-react';

interface ResumeQualityPanelProps {
  onOpenAtsAuditor?: () => void;
  className?: string;
}

export const ResumeQualityPanel: React.FC<ResumeQualityPanelProps> = ({ onOpenAtsAuditor, className = '' }) => {
  const { completeness, atsResult, isCoverLetter, navigateToEditorSection, editorActiveTab } = useResume();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'WARNINGS' | 'COMPLETED'>('ALL');

  if (isCoverLetter) return null;

  const score = completeness.score;
  const grade = atsResult.grade;
  const items = completeness.items || [];
  const actionRecommendations = completeness.actionableRecommendations || [];
  const atsIssues = atsResult.issues || [];

  const completedCount = items.filter(i => i.completed).length;
  const warningCount = items.filter(i => !i.completed).length + atsIssues.filter(i => i.severity !== 'info').length;

  const handleNavigate = (tab?: string) => {
    if (tab) {
      navigateToEditorSection(tab);
    }
  };

  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (s >= 70) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    if (s >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden ${className}`}>
      {/* Header Summary Bar */}
      <div
        className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {/* Score Badge */}
          <div className={`px-2.5 py-1 rounded-lg border font-black text-sm flex items-center gap-1.5 ${getScoreColor(score)}`}>
            <Zap className="w-3.5 h-3.5" />
            <span>{score}%</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900">Live Resume Quality & Action Assistant</h4>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                grade === 'A' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                grade === 'B' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                Grade {grade}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {completedCount} of {items.length} checks complete • {warningCount} improvement suggestion{warningCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actionRecommendations.length > 0 && !isExpanded && (
            <span className="hidden sm:inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>{actionRecommendations.length} Action{actionRecommendations.length > 1 ? 's' : ''}</span>
            </span>
          )}
          <button
            type="button"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            aria-label="Toggle Quality Panel"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Quality Drawer & Action Checklist */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-4">
          {/* Filter Chips */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setActiveTabFilter('ALL')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  activeTabFilter === 'ALL' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Checks ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTabFilter('WARNINGS')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  activeTabFilter === 'WARNINGS' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Suggestions ({actionRecommendations.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTabFilter('COMPLETED')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  activeTabFilter === 'COMPLETED' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Passed ({completedCount})
              </button>
            </div>

            {onOpenAtsAuditor && (
              <button
                type="button"
                onClick={onOpenAtsAuditor}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Full ATS Audit</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Actionable Recommendations Cards */}
          {(activeTabFilter === 'ALL' || activeTabFilter === 'WARNINGS') && actionRecommendations.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Priority Action Recommendations
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {actionRecommendations.map(rec => (
                  <div
                    key={rec.id}
                    className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between gap-2 hover:border-indigo-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <AlertTriangle className={`w-3.5 h-3.5 ${rec.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                          <span>{rec.title}</span>
                        </span>
                        <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          rec.severity === 'critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {rec.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {rec.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavigate(rec.actionTab)}
                      className="inline-flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all w-full mt-1 border border-indigo-100"
                    >
                      <span>{rec.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section-by-Section Checklist */}
          {(activeTabFilter === 'ALL' || activeTabFilter === 'COMPLETED') && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Section Completeness & ATS Status
              </span>
              <div className="bg-white rounded-xl border border-slate-200 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {items
                  .filter(item => activeTabFilter === 'ALL' || (activeTabFilter === 'COMPLETED' && item.completed))
                  .map(item => (
                    <div
                      key={item.key}
                      onClick={() => handleNavigate(item.actionTab)}
                      className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                        item.completed
                          ? 'bg-slate-50/50 border-slate-100 hover:border-emerald-200'
                          : 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {item.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                        <span className={`truncate ${item.completed ? 'text-slate-700 font-medium' : 'text-slate-900 font-bold'}`}>
                          {item.label}
                        </span>
                      </div>

                      {item.actionLabel && !item.completed ? (
                        <span className="text-[10.5px] font-bold text-indigo-600 hover:underline shrink-0 ml-1">
                          {item.actionLabel} →
                        </span>
                      ) : (
                        <span className="text-[10.5px] text-slate-400 shrink-0 ml-1">
                          {item.completed ? 'Passed' : 'Needs attention'}
                        </span>
                      )}
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
