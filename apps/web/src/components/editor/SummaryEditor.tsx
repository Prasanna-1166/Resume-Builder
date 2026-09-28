import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Sparkles } from 'lucide-react';

interface SummaryEditorProps {
  onOpenAiEnhance?: (type: 'summary', currentText: string) => void;
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({ onOpenAiEnhance }) => {
  const { resumeData, updateResumeData } = useResume();

  const handleChange = (val: string) => {
    updateResumeData(prev => ({
      ...prev,
      summary: val
    }));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-gray-700">
          Professional Summary / Objective
        </label>
        {onOpenAiEnhance && (
          <button
            type="button"
            onClick={() => onOpenAiEnhance('summary', resumeData.summary || '')}
            className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded border border-purple-200 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>AI Enhance</span>
          </button>
        )}
      </div>

      <textarea
        rows={4}
        value={resumeData.summary || ''}
        onChange={e => handleChange(e.target.value)}
        placeholder="Write a concise 2-3 sentence overview of your background, core strengths, and what you aim to achieve..."
        className="w-full p-2.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none leading-relaxed"
      />
      <div className="flex justify-between text-[11px] text-gray-400">
        <span>Recommended length: 200 - 450 characters</span>
        <span>{resumeData.summary?.length || 0} chars</span>
      </div>
    </div>
  );
};
