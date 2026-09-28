import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { apiClient } from '../../services/api';
import { Sparkles, CheckCircle2, AlertCircle, Plus, X, Search, ChevronRight } from 'lucide-react';

interface JobAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JobAnalyzerModal: React.FC<JobAnalyzerModalProps> = ({
  isOpen,
  onClose
}) => {
  const { resumeData, updateResumeData } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [addedSkills, setAddedSkills] = useState<Set<string>>(new Set());

  const currentSkills = resumeData.skills.flatMap(s => s.items);

  const handleAnalyze = async () => {
    if (!jobDescription || jobDescription.trim().length < 20) {
      alert('Please paste a full job description (at least 20 characters).');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.analyzeJob(jobDescription, currentSkills);
      setAnalysis(res);
    } catch (e) {
      console.error(e);
      alert('Failed to analyze job description.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMissingSkill = (skill: string) => {
    updateResumeData(prev => {
      const nextSkills = [...prev.skills];
      if (nextSkills.length === 0) {
        nextSkills.push({
          id: `sk_${Date.now()}`,
          category: 'Technical Skills',
          items: [skill]
        });
      } else {
        const cat = nextSkills[0];
        if (!cat.items.includes(skill)) {
          cat.items.push(skill);
        }
      }
      return { ...prev, skills: nextSkills };
    });

    setAddedSkills(prev => new Set(prev).add(skill));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-purple-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Job Description Matcher & Keyword Analyzer</h3>
              <p className="text-xs text-gray-500">Compare your resume against any target job opening.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!analysis ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Paste Target Job Description:
                </label>
                <textarea
                  rows={8}
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the job posting requirements, responsibilities, and qualifications here..."
                  className="w-full p-3 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || jobDescription.trim().length < 20}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{loading ? 'Analyzing with Gemini...' : 'Analyze Job Posting'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Summary */}
              {analysis.summary && (
                <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-950 leading-relaxed">
                  <strong className="font-semibold block mb-0.5 text-purple-900">Job Overview:</strong>
                  {analysis.summary}
                </div>
              )}

              {/* Matched vs Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matched */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Matched Keywords ({analysis.matchedSkills?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.matchedSkills?.length > 0 ? (
                      analysis.matchedSkills.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-white text-emerald-800 border border-emerald-300 text-[11px] font-medium">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-700 italic">No direct keyword overlap found yet.</span>
                    )}
                  </div>
                </div>

                {/* Missing */}
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Missing Skills in Profile ({analysis.missingSkills?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.missingSkills?.length > 0 ? (
                      analysis.missingSkills.map((s: string) => {
                        const isAdded = addedSkills.has(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleAddMissingSkill(s)}
                            disabled={isAdded}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 transition-all ${
                              isAdded
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
                            }`}
                            title={isAdded ? 'Added to resume' : 'Click to add if you know this skill'}
                          >
                            <span>{s}</span>
                            {!isAdded && <Plus className="w-2.5 h-2.5 text-amber-700" />}
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-xs text-amber-700 italic">You match all primary extracted skills!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Responsibilities */}
              {analysis.responsibilities && analysis.responsibilities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    Primary Job Responsibilities
                  </h4>
                  <ul className="pl-4 list-disc space-y-1 text-xs text-gray-700">
                    {analysis.responsibilities.map((r: string, idx: number) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reset to analyze another */}
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => setAnalysis(null)}
                  className="text-xs font-semibold text-purple-700 hover:underline"
                >
                  ← Analyze Another Job Posting
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
