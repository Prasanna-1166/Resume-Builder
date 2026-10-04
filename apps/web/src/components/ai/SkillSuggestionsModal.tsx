import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { apiClient } from '../../services/api';
import { Sparkles, Plus, Check, X, RefreshCw, FolderPlus } from 'lucide-react';
import { track } from '../../services/analytics';

interface SkillSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SkillSuggestionsModal: React.FC<SkillSuggestionsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { resumeData, updateResumeData } = useResume();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [targetCategoryIndex, setTargetCategoryIndex] = useState<number | 'new'>(0);
  const [newCategoryName, setNewCategoryName] = useState('Additional Skills');

  const currentSkillsList = resumeData.skills.flatMap(s => s.items || []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const expSnippet = resumeData.experience.map(e => `${e.role}: ${e.bullets.join(' ')}`).join('\n');
      const res = await apiClient.suggestSkills(currentSkillsList, resumeData.targetRole, expSnippet);
      const filtered = (res.suggestedSkills || []).filter(
        (s: string) => !currentSkillsList.some(curr => curr.toLowerCase() === s.toLowerCase())
      );
      setSuggestions(filtered);
      track('AI_SKILLS', { status: 'SUCCESS' });
    } catch (err) {
      console.error(err);
      track('AI_SKILLS', { status: 'ERROR' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
      setSelectedSkills(new Set());
      setTargetCategoryIndex(0);
    }
  }, [isOpen]);

  const toggleSelect = (skill: string) => {
    setSelectedSkills(prev => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  };

  const handleApplySelected = () => {
    if (selectedSkills.size === 0) return;

    updateResumeData(prev => {
      const nextSkills = [...prev.skills];
      const skillsToAdd = Array.from(selectedSkills);

      if (targetCategoryIndex === 'new' || nextSkills.length === 0) {
        nextSkills.push({
          id: `sk_${Date.now()}`,
          category: newCategoryName.trim() || 'Technical Skills',
          items: skillsToAdd
        });
      } else {
        const catIdx = typeof targetCategoryIndex === 'number' && targetCategoryIndex < nextSkills.length
          ? targetCategoryIndex
          : 0;
        const targetCat = nextSkills[catIdx];
        const existing = new Set((targetCat.items || []).map(s => s.toLowerCase()));
        const uniqueToAdd = skillsToAdd.filter(s => !existing.has(s.toLowerCase()));
        targetCat.items = [...(targetCat.items || []), ...uniqueToAdd];
      }
      return { ...prev, skills: nextSkills };
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 bg-purple-50/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-purple-100 text-purple-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">
              AI Skill Recommendations
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <p className="text-xs text-gray-600 leading-relaxed">
            Based on your projects and work experience, here are complementary industry skills and tools. Select the ones you have real experience with to add them to your resume.
          </p>

          {/* Destination Category Picker */}
          {resumeData.skills.length > 0 && (
            <div className="p-3 bg-purple-50/40 border border-purple-100 rounded-xl space-y-2">
              <label className="block text-[11px] font-bold text-purple-900">
                Add Selected Skills Into:
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={targetCategoryIndex}
                  onChange={e => {
                    const val = e.target.value;
                    setTargetCategoryIndex(val === 'new' ? 'new' : parseInt(val, 10));
                  }}
                  className="w-full text-xs bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold text-gray-800"
                >
                  {resumeData.skills.map((cat, idx) => (
                    <option key={cat.id || idx} value={idx}>
                      Group: {cat.category} ({cat.items?.length || 0} skills)
                    </option>
                  ))}
                  <option value="new">+ Create New Skill Group...</option>
                </select>
              </div>

              {targetCategoryIndex === 'new' && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="New Group Name (e.g. Core Competencies)"
                    className="w-full text-xs bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="py-8 text-center text-xs text-gray-500 space-y-2">
              <RefreshCw className="w-5 h-5 text-purple-600 animate-spin mx-auto" />
              <p>Analyzing resume context and discovering relevant skills...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500 bg-gray-50 rounded border border-gray-200">
              No new skills to recommend at this time. Your profile already has broad skill coverage!
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((skill) => {
                const isSelected = selectedSkills.has(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSelect(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-purple-600 border-purple-600 text-white shadow-2xs'
                        : 'bg-white border-gray-300 text-gray-800 hover:bg-purple-50 hover:border-purple-300'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-gray-400" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
          <span className="text-xs text-gray-500">
            {selectedSkills.size} skill{selectedSkills.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleApplySelected}
              disabled={selectedSkills.size === 0}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Skills ({selectedSkills.size})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
