import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { SkillCategory } from '@ai-resume/core';
import { Plus, Trash2, Wrench, Sparkles, X } from 'lucide-react';

interface SkillsEditorProps {
  onOpenSkillSuggestions?: () => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ onOpenSkillSuggestions }) => {
  const { resumeData, updateResumeData } = useResume();
  const skills = resumeData.skills || [];

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: `sk_${Date.now()}`,
      category: 'Languages & Tools',
      items: []
    };
    updateResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newCat]
    }));
  };

  const handleUpdateCategory = (index: number, name: string) => {
    updateResumeData(prev => {
      const next = [...prev.skills];
      next[index] = { ...next[index], category: name };
      return { ...prev, skills: next };
    });
  };

  const handleRemoveCategory = (index: number) => {
    updateResumeData(prev => {
      const next = [...prev.skills];
      next.splice(index, 1);
      return { ...prev, skills: next };
    });
  };

  const handleUpdateSkillsRaw = (index: number, text: string) => {
    const items = text.split(',').map(s => s.trim()).filter(Boolean);
    updateResumeData(prev => {
      const next = [...prev.skills];
      next[index] = { ...next[index], items };
      return { ...prev, skills: next };
    });
  };

  const handleRemoveSkillItem = (catIndex: number, itemIndex: number) => {
    updateResumeData(prev => {
      const next = [...prev.skills];
      const items = [...next[catIndex].items];
      items.splice(itemIndex, 1);
      next[catIndex] = { ...next[catIndex], items };
      return { ...prev, skills: next };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
          <Wrench className="w-4 h-4 text-sky-600" />
          <span>Skills Inventory ({skills.reduce((a, b) => a + b.items.length, 0)} skills)</span>
        </h3>
        <div className="flex items-center gap-2">
          {onOpenSkillSuggestions && (
            <button
              type="button"
              onClick={onOpenSkillSuggestions}
              className="flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded border border-purple-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Suggest</span>
            </button>
          )}
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Group</span>
          </button>
        </div>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-500">
          No skills listed yet. Click "Add Group" or use "AI Suggest".
        </div>
      ) : (
        skills.map((cat, idx) => (
          <div key={cat.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
            <div className="flex justify-between items-center gap-2">
              <input
                type="text"
                value={cat.category}
                onChange={e => handleUpdateCategory(idx, e.target.value)}
                placeholder="Category Name (e.g. Languages, Frameworks, Cloud)"
                className="font-bold text-xs bg-white px-2 py-1 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500 w-1/2"
              />
              <button
                onClick={() => handleRemoveCategory(idx)}
                className="p-1 text-gray-400 hover:text-red-500"
                title="Delete Group"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Comma-separated input */}
            <div>
              <input
                type="text"
                value={cat.items.join(', ')}
                onChange={e => handleUpdateSkillsRaw(idx, e.target.value)}
                placeholder="Type skills separated by commas (e.g. TypeScript, React, Docker, SQL)"
                className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            {/* Chips visualization */}
            <div className="flex flex-wrap gap-1 pt-1">
              {cat.items.map((skill, si) => (
                <span
                  key={si}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-gray-800 text-[11px] border border-gray-200 shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkillItem(idx, si)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
