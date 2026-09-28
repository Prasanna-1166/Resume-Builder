import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { AchievementItem } from '@ai-resume/core';
import { Plus, Trash2, Trophy } from 'lucide-react';

export const AchievementsEditor: React.FC = () => {
  const { resumeData, updateResumeData } = useResume();
  const achievements = resumeData.achievements || [];

  const handleAdd = () => {
    const newItem: AchievementItem = {
      id: `ach_${Date.now()}`,
      title: '',
      date: '',
      description: ''
    };
    updateResumeData(prev => ({
      ...prev,
      achievements: [...(prev.achievements || []), newItem]
    }));
  };

  const handleUpdate = (index: number, field: keyof AchievementItem, value: any) => {
    updateResumeData(prev => {
      const next = [...(prev.achievements || [])];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, achievements: next };
    });
  };

  const handleRemove = (index: number) => {
    updateResumeData(prev => {
      const next = [...(prev.achievements || [])];
      next.splice(index, 1);
      return { ...prev, achievements: next };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-sky-600" />
          <span>Honors & Achievements ({achievements.length})</span>
        </h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Honor</span>
        </button>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-500">
          No honors or awards listed. Highlight hackathons, competitive ratings, scholarships, or academic ranks.
        </div>
      ) : (
        achievements.map((ach, idx) => (
          <div key={ach.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
            <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
              <span className="font-semibold text-xs text-gray-700">#{idx + 1} {ach.title || 'New Achievement'}</span>
              <button
                onClick={() => handleRemove(idx)}
                className="p-1 text-gray-400 hover:text-red-500"
                title="Delete Achievement"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Title / Award Name *</label>
                <input
                  type="text"
                  value={ach.title}
                  onChange={e => handleUpdate(idx, 'title', e.target.value)}
                  placeholder="e.g. Smart India Hackathon Finalist or LeetCode Knight"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Year / Date</label>
                <input
                  type="text"
                  value={ach.date || ''}
                  onChange={e => handleUpdate(idx, 'date', e.target.value)}
                  placeholder="e.g. 2023"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Description *</label>
                <input
                  type="text"
                  value={ach.description}
                  onChange={e => handleUpdate(idx, 'description', e.target.value)}
                  placeholder="e.g. Ranked top 5 out of 1,200 teams nationwide for AI emergency dispatch solution."
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
