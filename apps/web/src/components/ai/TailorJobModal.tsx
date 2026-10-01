import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { apiClient } from '../../services/api';
import {
  Sparkles,
  Target,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface TailorJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TailorJobModal: React.FC<TailorJobModalProps> = ({ isOpen, onClose }) => {
  const { activeDocument, updateResumeData, saveVersionSnapshot, duplicateCurrentDraft } = useResume();

  const [jobTitle, setJobTitle] = useState(activeDocument.title || '');
  const [targetCompany, setTargetCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorResult, setTailorResult] = useState<any | null>(null);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleRunTailor = async () => {
    if (!jobDescription || jobDescription.trim().length < 20) {
      alert('Please paste a job description (at least 20 characters).');
      return;
    }
    setIsTailoring(true);
    try {
      const res = await apiClient.tailorDocument({
        documentType: activeDocument.documentType || 'RESUME',
        documentData: activeDocument,
        jobDescription,
        targetRole: jobTitle,
        targetCompany
      });
      setTailorResult(res);
    } catch (err) {
      console.error('Tailoring error:', err);
      alert('Failed to analyze and tailor document.');
    } finally {
      setIsTailoring(false);
    }
  };

  const handleApplyTailored = (asCopy: boolean = false) => {
    if (!tailorResult) return;

    if (asCopy) {
      // 1. Duplicate current document to a new dedicated tailored copy
      duplicateCurrentDraft();
      const targetTitle = `${activeDocument.title} - ${targetCompany || 'Tailored'}`;
      
      // 2. Apply tailored changes to the new active copy
      if (activeDocument.documentType !== 'COVER_LETTER') {
        updateResumeData(prev => {
          let updatedSkills = [...prev.skills];
          if (tailorResult.recommendedSkillAdditions && tailorResult.recommendedSkillAdditions.length > 0) {
            if (updatedSkills.length > 0) {
              updatedSkills[0] = {
                ...updatedSkills[0],
                items: Array.from(new Set([...updatedSkills[0].items, ...tailorResult.recommendedSkillAdditions]))
              };
            }
          }
          return {
            ...prev,
            title: targetTitle,
            targetRole: jobTitle || prev.targetRole,
            targetCompany: targetCompany || prev.targetCompany,
            summary: tailorResult.summarySuggestion || prev.summary,
            skills: updatedSkills
          };
        });
      }
    } else {
      // 1. Preserve a version snapshot before updating current document
      saveVersionSnapshot(`Pre-Tailor Snapshot (${targetCompany || 'Job Tailor'})`, 'Original', `Auto-backup before tailoring to ${targetCompany}`);

      // 2. Apply tailored summary and recommended skills to resume if resume/cv
      if (activeDocument.documentType !== 'COVER_LETTER') {
        updateResumeData(prev => {
          let updatedSkills = [...prev.skills];
          if (tailorResult.recommendedSkillAdditions && tailorResult.recommendedSkillAdditions.length > 0) {
            if (updatedSkills.length > 0) {
              updatedSkills[0] = {
                ...updatedSkills[0],
                items: Array.from(new Set([...updatedSkills[0].items, ...tailorResult.recommendedSkillAdditions]))
              };
            }
          }
          return {
            ...prev,
            targetRole: jobTitle || prev.targetRole,
            targetCompany: targetCompany || prev.targetCompany,
            summary: tailorResult.summarySuggestion || prev.summary,
            skills: updatedSkills
          };
        });
      }
    }

    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Job Match & Document Tailoring Assistant</h3>
              <p className="text-[11px] text-slate-500">
                Align keywords and highlight relevant experience for your target job application.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 font-bold">
            ✕
          </button>
        </div>

        {/* Input Form */}
        <div className="space-y-3.5 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Backend Engineer"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Company</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={targetCompany}
                onChange={e => setTargetCompany(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Description *</label>
            <textarea
              rows={5}
              placeholder="Paste the requirements, qualifications, and role description from the job posting..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {!tailorResult && (
            <button
              onClick={handleRunTailor}
              disabled={isTailoring || !jobDescription}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isTailoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isTailoring ? 'Analyzing Match & Tailoring Suggestions...' : 'Analyze & Tailor Document'}</span>
            </button>
          )}
        </div>

        {/* Results Review & Approval Step */}
        {tailorResult && (
          <div className="space-y-4 pt-3 border-t border-slate-100 bg-slate-50/50 p-4 rounded-xl">
            {/* Score & Match Overview */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Estimated Keyword Match</span>
                <p className="text-[10px] text-slate-500">Measures technical keyword coverage against the posted requirements.</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600">{tailorResult.matchScore}%</span>
              </div>
            </div>

            {/* Matched vs Missing Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-xs">
                <p className="font-bold text-emerald-900 flex items-center gap-1 mb-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Matched Keywords ({tailorResult.matchedKeywords?.length || 0})</span>
                </p>
                <div className="flex flex-wrap gap-1">
                  {(tailorResult.matchedKeywords || []).map((kw: string, i: number) => (
                    <span key={i} className="bg-white px-2 py-0.5 rounded text-[10px] font-medium text-emerald-800 border border-emerald-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs">
                <p className="font-bold text-amber-900 flex items-center gap-1 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Missing Keywords ({tailorResult.missingKeywords?.length || 0})</span>
                </p>
                <div className="flex flex-wrap gap-1">
                  {(tailorResult.missingKeywords || []).map((kw: string, i: number) => (
                    <span key={i} className="bg-white px-2 py-0.5 rounded text-[10px] font-medium text-amber-800 border border-amber-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tailored Summary Proposal */}
            {tailorResult.summarySuggestion && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800">Proposed Tailored Summary:</span>
                <p className="text-slate-600 leading-relaxed italic">
                  "{tailorResult.summarySuggestion}"
                </p>
              </div>
            )}

            {/* Guardrail Note & Approval Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Original resume will not be modified when creating a copy.</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setTailorResult(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Edit Input
                </button>
                <button
                  onClick={() => handleApplyTailored(false)}
                  disabled={applied}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-all"
                  title="Update currently active document (auto-creates version backup)"
                >
                  Update Current
                </button>
                <button
                  onClick={() => handleApplyTailored(true)}
                  disabled={applied}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                  title="Creates an independent duplicate document tailored for this job"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{applied ? 'Created Copy!' : 'Create Tailored Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
