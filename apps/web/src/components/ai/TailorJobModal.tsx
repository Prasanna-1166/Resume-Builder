import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { ResumeData, SkillCategory } from '@ai-resume/core';
import { apiClient } from '../../services/api';
import {
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  ShieldCheck,
  Check,
  X,
  Briefcase,
  GraduationCap,
  Sliders,
  ChevronRight,
  Layers,
  ArrowRight
} from 'lucide-react';

interface TailorJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TailorJobModal: React.FC<TailorJobModalProps> = ({ isOpen, onClose }) => {
  const {
    activeDocument,
    updateResumeData,
    saveVersionSnapshot,
    createTailoredCopy,
    switchDraft
  } = useResume();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [jobTitle, setJobTitle] = useState(activeDocument.targetRole || activeDocument.title || '');
  const [targetCompany, setTargetCompany] = useState(activeDocument.targetCompany || '');
  const [jobDescription, setJobDescription] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorResult, setTailorResult] = useState<any | null>(null);

  // Granular approvals
  const [approveSummary, setApproveSummary] = useState(true);
  const [approvedBullets, setApprovedBullets] = useState<Record<string, boolean>>({});
  const [selectedMissingSkills, setSelectedMissingSkills] = useState<Record<string, boolean>>({});
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);

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
      if (res.roleTitle && !jobTitle) setJobTitle(res.roleTitle);
      if (res.targetCompany && !targetCompany) setTargetCompany(res.targetCompany);

      // Initialize bullet approvals to true by default (user can toggle off)
      const initialBulletApprovals: Record<string, boolean> = {};
      (res.bulletSuggestions || []).forEach((b: any) => {
        initialBulletApprovals[b.id] = true;
      });
      setApprovedBullets(initialBulletApprovals);

      // Initialize missing skills checkboxes to false (user must explicitly opt-in)
      const initialSkillsSelection: Record<string, boolean> = {};
      (res.missingKeywords || res.missingSkills || []).forEach((s: string) => {
        initialSkillsSelection[s] = false;
      });
      setSelectedMissingSkills(initialSkillsSelection);

      setActiveStep(2);
    } catch (err) {
      console.error('Tailoring error:', err);
      alert('Failed to analyze and tailor document. Please check your network or try again.');
    } finally {
      setIsTailoring(false);
    }
  };

  const handleApplyChanges = (asCopy: boolean = true) => {
    if (!tailorResult) return;

    const skillsToAdd = Object.entries(selectedMissingSkills)
      .filter(([_, selected]) => selected)
      .map(([skill]) => skill);

    if (asCopy) {
      // 1. Create a dedicated tailored copy (Master resume remains 100% untouched)
      const tailoredTitle = `${jobTitle || activeDocument.title} — ${targetCompany || 'Tailored'}`;
      const copy = createTailoredCopy(activeDocument.id, targetCompany, jobTitle, tailoredTitle);

      // 2. Apply approved changes to the newly active tailored copy
      if (copy.documentType !== 'COVER_LETTER') {
        updateResumeData(prev => {
          let updatedSkills = [...prev.skills];
          if (skillsToAdd.length > 0) {
            if (updatedSkills.length > 0) {
              updatedSkills[0] = {
                ...updatedSkills[0],
                items: Array.from(new Set([...updatedSkills[0].items, ...skillsToAdd]))
              };
            } else {
              updatedSkills = [{ id: 'sk_tailored', category: 'Key Technical Skills', items: skillsToAdd }];
            }
          }

          // Apply approved bullet suggestions
          let updatedExperience = [...prev.experience];
          (tailorResult.bulletSuggestions || []).forEach((sug: any) => {
            if (approvedBullets[sug.id]) {
              updatedExperience = updatedExperience.map(exp => ({
                ...exp,
                bullets: exp.bullets.map(b => (b === sug.original ? sug.suggested : b))
              }));
            }
          });

          return {
            ...prev,
            title: tailoredTitle,
            targetRole: jobTitle || prev.targetRole,
            targetCompany: targetCompany || prev.targetCompany,
            summary: approveSummary && tailorResult.summarySuggestion ? tailorResult.summarySuggestion : prev.summary,
            experience: updatedExperience,
            skills: updatedSkills
          };
        });
      }

      setAppliedMessage('Created independent tailored copy! Master resume untouched.');
    } else {
      // 1. Save auto-backup snapshot before modifying current document
      saveVersionSnapshot(
        `Pre-Tailor (${targetCompany || 'Job Tailor'})`,
        'Company Tailored',
        `Automatic backup before tailoring to ${targetCompany || jobTitle}`
      );

      // 2. Apply approved changes to current document
      if (activeDocument.documentType !== 'COVER_LETTER') {
        updateResumeData(prev => {
          let updatedSkills = [...prev.skills];
          if (skillsToAdd.length > 0) {
            if (updatedSkills.length > 0) {
              updatedSkills[0] = {
                ...updatedSkills[0],
                items: Array.from(new Set([...updatedSkills[0].items, ...skillsToAdd]))
              };
            } else {
              updatedSkills = [{ id: 'sk_tailored', category: 'Key Technical Skills', items: skillsToAdd }];
            }
          }

          let updatedExperience = [...prev.experience];
          (tailorResult.bulletSuggestions || []).forEach((sug: any) => {
            if (approvedBullets[sug.id]) {
              updatedExperience = updatedExperience.map(exp => ({
                ...exp,
                bullets: exp.bullets.map(b => (b === sug.original ? sug.suggested : b))
              }));
            }
          });

          return {
            ...prev,
            targetRole: jobTitle || prev.targetRole,
            targetCompany: targetCompany || prev.targetCompany,
            summary: approveSummary && tailorResult.summarySuggestion ? tailorResult.summarySuggestion : prev.summary,
            experience: updatedExperience,
            skills: updatedSkills
          };
        });
      }

      setAppliedMessage('Updated current document (Pre-tailor version snapshot saved)!');
    }

    setTimeout(() => {
      setAppliedMessage(null);
      onClose();
    }, 1200);
  };

  const isCoverLetter = activeDocument.documentType === 'COVER_LETTER';
  const resumeDoc = activeDocument as ResumeData;
  const userSkillSet = new Set(
    (isCoverLetter ? [] : (resumeDoc.skills || [])).flatMap((s: SkillCategory) => (s.items || []).map((i: string) => i.trim().toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 border border-slate-100 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Job Description → Resume Tailoring Assistant</h3>
              <p className="text-xs text-slate-500">
                Extract requirements, inspect keyword gaps, and review human-approved suggestions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        {/* Step Tabs */}
        {tailorResult && (
          <div className="flex items-center gap-2 pt-3 pb-1 border-b border-slate-100 shrink-0">
            <button
              onClick={() => setActiveStep(1)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 1 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              1. Job Input
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <button
              onClick={() => setActiveStep(2)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 2 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              2. Job Requirements & Match Matrix
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <button
              onClick={() => setActiveStep(3)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 3 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              3. Review Suggestions ({Object.values(approvedBullets).filter(Boolean).length + (approveSummary ? 1 : 0)})
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* STEP 1: Job Input Form */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Role Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Backend Engineer"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe, Google, Acme Corp"
                    value={targetCompany}
                    onChange={e => setTargetCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  placeholder="Paste the requirements, qualifications, and role description from the target job posting..."
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Base Resume: <strong>{activeDocument.title}</strong></span>
                </span>
                <span className="text-[11px] text-slate-400">Strictly non-fabricating AI</span>
              </div>

              <button
                onClick={handleRunTailor}
                disabled={isTailoring || !jobDescription || jobDescription.trim().length < 20}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isTailoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isTailoring ? 'Analyzing Job Posting & Comparing Profile...' : 'Analyze Job & Generate Tailoring Suggestions'}</span>
              </button>
            </div>
          )}

          {/* STEP 2: Job Requirements & Match Matrix */}
          {activeStep === 2 && tailorResult && (
            <div className="space-y-4">
              {/* Score & Overview Banner */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 rounded-xl text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">
                    Role & Domain Match
                  </span>
                  <h4 className="text-base font-bold mt-0.5">
                    {tailorResult.roleTitle || jobTitle} {targetCompany ? `at ${targetCompany}` : ''}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {tailorResult.domain || 'Software & Technology'}
                  </p>
                </div>
                <div className="text-right bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-2xl font-black text-emerald-400">{tailorResult.matchScore}%</span>
                  <p className="text-[10px] text-slate-300">Keyword Match</p>
                </div>
              </div>

              {/* Requirements & Skill Comparison Matrix */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Job Requirements vs Selected Resume
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {tailorResult.matchedKeywords?.length || 0} Matched • {tailorResult.missingKeywords?.length || 0} Gaps
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(tailorResult.requiredSkills || []).map((skill: string, idx: number) => {
                      const isMatched = (tailorResult.matchedKeywords || []).some(
                        (m: string) => m.toLowerCase() === skill.toLowerCase()
                      );
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${
                            isMatched
                              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                              : 'bg-amber-50/50 border-amber-200 text-amber-950'
                          }`}
                        >
                          <span className="font-semibold">{skill}</span>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${isMatched ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {isMatched ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                            <span>{isMatched ? '✓' : '⚠ Missing'}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Experience & Education Requirements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    {tailorResult.experienceRequirements && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-700 block mb-1">Experience Requirements:</span>
                        <p className="text-slate-600">{tailorResult.experienceRequirements}</p>
                      </div>
                    )}
                    {tailorResult.educationRequirements && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-700 block mb-1">Education Requirements:</span>
                        <p className="text-slate-600">{tailorResult.educationRequirements}</p>
                      </div>
                    )}
                  </div>

                  {/* Sections that could be strengthened */}
                  {tailorResult.sectionsToStrengthen && tailorResult.sectionsToStrengthen.length > 0 && (
                    <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 text-xs">
                      <span className="font-bold text-indigo-900 block mb-1">Recommended Sections to Strengthen:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {tailorResult.sectionsToStrengthen.map((sec: string, i: number) => (
                          <span key={i} className="bg-white border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded text-[11px] font-medium">
                            • {sec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Proceed to Review Suggestions */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveStep(3)}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all"
                >
                  <span>Review & Approve Suggestions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Human Approval of Truthful Suggestions */}
          {activeStep === 3 && tailorResult && (
            <div className="space-y-4">
              {/* Truthfulness Guarantee Notice */}
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Strict AI Safety Guardrail:</strong> Suggestions strictly rephrase your existing experience for ATS clarity. Zero fabricated jobs, metrics, or degrees.
                </span>
              </div>

              {/* 1. Summary Suggestion */}
              {tailorResult.summarySuggestion && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      1. Professional Summary Phrasing
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setApproveSummary(false)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                          !approveSummary ? 'bg-slate-200 text-slate-800 font-bold' : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        Keep Original
                      </button>
                      <button
                        type="button"
                        onClick={() => setApproveSummary(true)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all flex items-center gap-1 ${
                          approveSummary ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply Suggestion</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Current Resume Summary:</span>
                      <p className="text-slate-700 leading-relaxed italic">
                        {tailorResult.summaryOriginal || (!isCoverLetter ? resumeDoc.summary : '') || 'No summary currently set.'}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg border transition-all ${approveSummary ? 'bg-indigo-50/40 border-indigo-300' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase block mb-1">Suggested Tailored Summary:</span>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        "{tailorResult.summarySuggestion}"
                      </p>
                    </div>
                  </div>
                  {tailorResult.summaryRationale && (
                    <p className="text-[11px] text-slate-500 italic">
                      Rationale: {tailorResult.summaryRationale}
                    </p>
                  )}
                </div>
              )}

              {/* 2. Experience Bullet Suggestions */}
              {tailorResult.bulletSuggestions && tailorResult.bulletSuggestions.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      2. Experience Bullet Enhancements
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {Object.values(approvedBullets).filter(Boolean).length} of {tailorResult.bulletSuggestions.length} approved
                    </span>
                  </div>

                  <div className="space-y-3">
                    {tailorResult.bulletSuggestions.map((sug: any) => {
                      const isApproved = approvedBullets[sug.id] !== false;
                      return (
                        <div key={sug.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">
                              {sug.parentTitle ? `Role / Project: ${sug.parentTitle}` : 'Experience Bullet'}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setApprovedBullets(prev => ({ ...prev, [sug.id]: false }))}
                                className={`px-2 py-0.5 text-[11px] rounded-md transition-all ${
                                  !isApproved ? 'bg-slate-200 text-slate-800 font-bold' : 'text-slate-500 hover:bg-slate-100'
                                }`}
                              >
                                Keep Original
                              </button>
                              <button
                                type="button"
                                onClick={() => setApprovedBullets(prev => ({ ...prev, [sug.id]: true }))}
                                className={`px-2.5 py-0.5 text-[11px] rounded-md font-bold transition-all flex items-center gap-1 ${
                                  isApproved ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'
                                }`}
                              >
                                <Check className="w-3 h-3" />
                                <span>Apply</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Original:</span>
                              <p className="text-slate-600">{sug.original}</p>
                            </div>
                            <div className={`p-2.5 rounded-lg border transition-all ${isApproved ? 'bg-indigo-50/40 border-indigo-200 text-slate-800 font-medium' : 'bg-white border-slate-200 opacity-60'}`}>
                              <span className="text-[10px] text-indigo-600 font-semibold block mb-0.5">Suggested:</span>
                              <p>{sug.suggested}</p>
                            </div>
                          </div>
                          {sug.rationale && (
                            <p className="text-[10.5px] text-slate-400 italic">Rationale: {sug.rationale}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Missing Skills Checkbox Opt-In */}
              {tailorResult.missingKeywords && tailorResult.missingKeywords.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    3. Select Missing Skills You Possess to Add to Profile
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Check only the skills and technologies listed in the job description that you have experience with:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {tailorResult.missingKeywords.map((skill: string) => {
                      const checked = Boolean(selectedMissingSkills[skill]);
                      return (
                        <label
                          key={skill}
                          className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs transition-all ${
                            checked ? 'bg-indigo-50 border-indigo-300 font-semibold text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={e => setSelectedMissingSkills(prev => ({ ...prev, [skill]: e.target.checked }))}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="truncate">{skill}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            {appliedMessage ? (
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> {appliedMessage}
              </span>
            ) : (
              <span>Original document is NEVER silently modified.</span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(prev => (prev === 3 ? 2 : 1))}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Back
              </button>
            )}

            {tailorResult && (
              <>
                <button
                  type="button"
                  onClick={() => handleApplyChanges(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all border border-slate-200"
                  title="Update currently active document (auto-creates version backup snapshot)"
                >
                  Update Current (Auto-Backup)
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyChanges(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                  title="Creates a separate tailored copy linked to the master document"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Create Tailored Copy (Recommended)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

