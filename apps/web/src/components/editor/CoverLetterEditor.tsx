import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { CoverLetterData } from '@ai-resume/core';
import { apiClient } from '../../services/api';
import {
  Mail,
  User,
  Building,
  Briefcase,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Wand2,
  CheckCircle,
  RefreshCw,
  Eye
} from 'lucide-react';

interface CoverLetterEditorProps {
  onOpenAiEnhance?: (type: 'summary' | 'bullet', text: string, context?: string) => void;
}

export const CoverLetterEditor: React.FC<CoverLetterEditorProps> = () => {
  const { activeDocument, updateCoverLetterData } = useResume();
  const clData = activeDocument as CoverLetterData;

  const [aiGenerateOpen, setAiGenerateOpen] = useState(false);
  const [jobDescInput, setJobDescInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<any | null>(null);
  const [improveLoadingIndex, setImproveLoadingIndex] = useState<number | 'opening' | 'closing' | null>(null);

  const personalInfo = clData.personalInfo || { fullName: '', email: '', phone: '', location: '' };
  const recipient = clData.recipient || { name: '', title: '', company: '', address: '' };

  const handlePersonalChange = (field: string, val: string) => {
    updateCoverLetterData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: val
      }
    }));
  };

  const handleRecipientChange = (field: string, val: string) => {
    updateCoverLetterData(prev => ({
      ...prev,
      recipient: {
        ...prev.recipient,
        [field]: val
      }
    }));
  };

  const handleAddBodyParagraph = () => {
    updateCoverLetterData(prev => ({
      ...prev,
      bodyParagraphs: [...(prev.bodyParagraphs || []), '']
    }));
  };

  const handleRemoveBodyParagraph = (index: number) => {
    updateCoverLetterData(prev => ({
      ...prev,
      bodyParagraphs: prev.bodyParagraphs.filter((_, i) => i !== index)
    }));
  };

  const handleBodyParagraphChange = (index: number, val: string) => {
    updateCoverLetterData(prev => {
      const updated = [...prev.bodyParagraphs];
      updated[index] = val;
      return { ...prev, bodyParagraphs: updated };
    });
  };

  const handleGenerateCoverLetter = async () => {
    if (!clData.jobTitle || !recipient.company) {
      alert('Please specify the Job Title and Target Company before generating.');
      return;
    }
    setIsGenerating(true);
    try {
      const res = await apiClient.generateCoverLetter({
        fullName: personalInfo.fullName,
        targetRole: clData.jobTitle,
        targetCompany: recipient.company,
        jobDescription: jobDescInput,
        skills: ['software engineering', 'system design', 'problem solving']
      });
      setGeneratedPreview(res);
    } catch (err) {
      console.error('AI Cover letter generation error:', err);
      alert('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyGenerated = () => {
    if (!generatedPreview) return;
    updateCoverLetterData(prev => ({
      ...prev,
      openingParagraph: generatedPreview.openingParagraph || prev.openingParagraph,
      bodyParagraphs: generatedPreview.bodyParagraphs || prev.bodyParagraphs,
      closingParagraph: generatedPreview.closingParagraph || prev.closingParagraph,
      signoff: generatedPreview.signoff || prev.signoff
    }));
    setAiGenerateOpen(false);
    setGeneratedPreview(null);
  };

  const handleImproveParagraph = async (type: 'opening' | 'closing' | number, text: string) => {
    if (!text || text.trim().length < 5) return;
    setImproveLoadingIndex(type);
    try {
      const res = await apiClient.improveCoverLetter({
        text,
        sectionType: typeof type === 'number' ? 'body' : type,
        targetRole: clData.jobTitle,
        targetCompany: recipient.company
      });
      if (res.suggestions && res.suggestions.length > 0) {
        const suggestion = res.suggestions[0];
        if (type === 'opening') {
          updateCoverLetterData(prev => ({ ...prev, openingParagraph: suggestion }));
        } else if (type === 'closing') {
          updateCoverLetterData(prev => ({ ...prev, closingParagraph: suggestion }));
        } else if (typeof type === 'number') {
          handleBodyParagraphChange(type, suggestion);
        }
      }
    } catch (err) {
      console.error('Improve error:', err);
    } finally {
      setImproveLoadingIndex(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      {/* Title & AI Generation CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Cover Letter Details</h2>
          <p className="text-xs text-slate-500">Edit recipient details, salutation, and custom paragraphs.</p>
        </div>
        <button
          onClick={() => setAiGenerateOpen(true)}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs px-3.5 py-2 rounded-xl font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>AI Generate from Job Description</span>
        </button>
      </div>

      {/* Target Role & Date Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Title *</label>
          <input
            type="text"
            placeholder="e.g. Senior Full Stack Engineer"
            value={clData.jobTitle || ''}
            onChange={e => updateCoverLetterData(prev => ({ ...prev, jobTitle: e.target.value }))}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Target Company *</label>
          <input
            type="text"
            placeholder="e.g. Stripe, Inc."
            value={clData.targetCompany || recipient.company || ''}
            onChange={e => {
              const val = e.target.value;
              updateCoverLetterData(prev => ({
                ...prev,
                targetCompany: val,
                recipient: { ...prev.recipient, company: val }
              }));
            }}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
          <input
            type="text"
            value={clData.date || ''}
            onChange={e => updateCoverLetterData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Sender Personal Information */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-indigo-950">
          <User className="w-3.5 h-3.5 text-indigo-600" />
          <span>Sender Information</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Your Full Name</label>
            <input
              type="text"
              value={personalInfo.fullName || ''}
              onChange={e => handlePersonalChange('fullName', e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Professional Title</label>
            <input
              type="text"
              placeholder="e.g. Software Engineer"
              value={personalInfo.professionalTitle || ''}
              onChange={e => handlePersonalChange('professionalTitle', e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Email</label>
            <input
              type="email"
              value={personalInfo.email || ''}
              onChange={e => handlePersonalChange('email', e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Phone & Location</label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000 • City, State"
              value={`${personalInfo.phone || ''} ${personalInfo.location ? `• ${personalInfo.location}` : ''}`}
              onChange={e => {
                const parts = e.target.value.split('•');
                handlePersonalChange('phone', parts[0]?.trim() || '');
                handlePersonalChange('location', parts[1]?.trim() || '');
              }}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Recipient Information */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-indigo-950">
          <Building className="w-3.5 h-3.5 text-indigo-600" />
          <span>Recipient / Hiring Manager</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Contact / Department Name</label>
            <input
              type="text"
              placeholder="e.g. Hiring Committee or Jane Doe"
              value={recipient.name || ''}
              onChange={e => handleRecipientChange('name', e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Title / Department</label>
            <input
              type="text"
              placeholder="e.g. Engineering Leadership Team"
              value={recipient.title || ''}
              onChange={e => handleRecipientChange('title', e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Company Address</label>
            <input
              type="text"
              placeholder="e.g. 100 Innovation Way, San Francisco, CA 94105"
              value={recipient.address || ''}
              onChange={e => handleRecipientChange('address', e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Salutation */}
      <div className="pt-3 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Salutation / Greeting
        </label>
        <input
          type="text"
          placeholder="e.g. Dear Hiring Team,"
          value={clData.greeting || ''}
          onChange={e => updateCoverLetterData(prev => ({ ...prev, greeting: e.target.value }))}
          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Opening Paragraph */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800">Opening Paragraph</label>
          <button
            onClick={() => handleImproveParagraph('opening', clData.openingParagraph)}
            disabled={improveLoadingIndex === 'opening'}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Sparkles className="w-3 h-3" />
            <span>{improveLoadingIndex === 'opening' ? 'Improving...' : 'AI Improve'}</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={clData.openingParagraph || ''}
          onChange={e => updateCoverLetterData(prev => ({ ...prev, openingParagraph: e.target.value }))}
          placeholder="State the role you are applying for and key enthusiasm..."
          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />
      </div>

      {/* Body Paragraphs */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-900">Body Paragraphs</label>
            <p className="text-[11px] text-slate-500">Highlight your relevant experience, technical competencies, and achievements.</p>
          </div>
          <button
            onClick={handleAddBodyParagraph}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2.5 py-1 rounded-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Paragraph</span>
          </button>
        </div>

        {(clData.bodyParagraphs || []).map((para, idx) => (
          <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600">Paragraph {idx + 1}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleImproveParagraph(idx, para)}
                  disabled={improveLoadingIndex === idx}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{improveLoadingIndex === idx ? 'Improving...' : 'AI Improve'}</span>
                </button>
                {clData.bodyParagraphs.length > 1 && (
                  <button
                    onClick={() => handleRemoveBodyParagraph(idx)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <textarea
              rows={3}
              value={para}
              onChange={e => handleBodyParagraphChange(idx, e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>
        ))}
      </div>

      {/* Closing Paragraph */}
      <div className="space-y-1.5 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800">Closing Paragraph & Call-to-Action</label>
          <button
            onClick={() => handleImproveParagraph('closing', clData.closingParagraph)}
            disabled={improveLoadingIndex === 'closing'}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Sparkles className="w-3 h-3" />
            <span>{improveLoadingIndex === 'closing' ? 'Improving...' : 'AI Improve'}</span>
          </button>
        </div>
        <textarea
          rows={2}
          value={clData.closingParagraph || ''}
          onChange={e => updateCoverLetterData(prev => ({ ...prev, closingParagraph: e.target.value }))}
          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />
      </div>

      {/* Signoff */}
      <div className="pt-3 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Signoff & Signature
        </label>
        <input
          type="text"
          value={clData.signoff || ''}
          onChange={e => updateCoverLetterData(prev => ({ ...prev, signoff: e.target.value }))}
          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* AI Generation Modal */}
      {aiGenerateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Generate Cover Letter from Job Description</h3>
              </div>
              <button onClick={() => setAiGenerateOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Paste the target job posting. Our AI analyzes the role expectations and crafts a personalized letter referencing only your real qualifications.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Description</label>
                <textarea
                  rows={6}
                  placeholder="Paste the requirements, responsibilities, or role overview from the job listing..."
                  value={jobDescInput}
                  onChange={e => setJobDescInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {!generatedPreview && (
                <button
                  type="button"
                  onClick={handleGenerateCoverLetter}
                  disabled={isGenerating || !jobDescInput}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isGenerating ? 'Analyzing & Drafting Letter...' : 'Draft Cover Letter'}</span>
                </button>
              )}

              {/* Preview of Generated Content */}
              {generatedPreview && (
                <div className="bg-slate-50 p-4 rounded-xl border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900">Generated Draft Preview</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      Ready to Apply
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{generatedPreview.openingParagraph}"
                  </p>

                  {(generatedPreview.bodyParagraphs || []).map((b: string, i: number) => (
                    <p key={i} className="text-xs text-slate-600 leading-relaxed">
                      {b}
                    </p>
                  ))}

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      onClick={() => setGeneratedPreview(null)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      Re-generate
                    </button>
                    <button
                      onClick={handleApplyGenerated}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve & Insert into Editor</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
