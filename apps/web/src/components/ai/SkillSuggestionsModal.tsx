import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { apiClient } from '../../services/api';
import { Sparkles, Plus, Check, X, RefreshCw } from 'lucide-react';

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

  const currentSkillsList = resumeData.skills.flatMap(s => s.items);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const expSnippet = resumeData.experience.map(e => `${e.role}: ${e.bullets.join(' ')}`).join('\n');
      const res = await apiClient.suggestSkills(currentSkillsList, resumeData.targetRole, expSnippet);
      const filtered = (res.suggestedSkills || []).filter(
        (s: string) => !currentSkillsList.some(curr => curr.toLowerCase() === s.toLowerCase())
      );
      setSuggestions(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
      setSelectedSkills(new Set());
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
      if (nextSkills.length === 0) {
        nextSkills.push({
          id: `sk_${Date.now()}`,
          category: 'Technical Skills',
          items: Array.from(selectedSkills)
        });
      } else {
        // Add to first category or create one
        const targetCat = nextSkills[0];
        targetCat.items = Array.from(new Set([...targetCat.items, ...Array.from(selectedSkills)]));
      }
      return { ...prev, skills: nextSkills };
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 bg-purple-50/50 flex justify-between items-center">
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
        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Based on your projects and work experience, here are complementary industry skills and tools. Select the ones you have real experience with to add them to your resume.
          </p>

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
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
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
