import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { ExperienceItem } from '@ai-resume/core';
import { Plus, Trash2, Briefcase, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ExperienceEditorProps {
  onOpenAiEnhance?: (type: 'bullet', currentText: string, context?: string) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ onOpenAiEnhance }) => {
  const { resumeData, updateResumeData } = useResume();
  const experience = resumeData.experience || [];

  const handleAdd = () => {
    const newItem: ExperienceItem = {
      id: `exp_${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      departmentOrTeam: '',
      bullets: ['']
    };
    updateResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newItem]
    }));
  };

  const handleUpdate = (index: number, field: keyof ExperienceItem, value: any) => {
    updateResumeData(prev => {
      const next = [...prev.experience];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, experience: next };
    });
  };

  const handleRemove = (index: number) => {
    updateResumeData(prev => {
      const next = [...prev.experience];
      next.splice(index, 1);
      return { ...prev, experience: next };
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    updateResumeData(prev => {
      const next = [...prev.experience];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return { ...prev, experience: next };
    });
  };

  const handleBulletChange = (expIndex: number, bulletIndex: number, text: string) => {
    updateResumeData(prev => {
      const next = [...prev.experience];
      const bullets = [...next[expIndex].bullets];
      bullets[bulletIndex] = text;
      next[expIndex] = { ...next[expIndex], bullets };
      return { ...prev, experience: next };
    });
  };

  const handleAddBullet = (expIndex: number) => {
    updateResumeData(prev => {
      const next = [...prev.experience];
      const bullets = [...next[expIndex].bullets, ''];
      next[expIndex] = { ...next[expIndex], bullets };
      return { ...prev, experience: next };
    });
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    updateResumeData(prev => {
      const next = [...prev.experience];
      const bullets = [...next[expIndex].bullets];
      bullets.splice(bulletIndex, 1);
      next[expIndex] = { ...next[expIndex], bullets: bullets.length ? bullets : [''] };
      return { ...prev, experience: next };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-sky-600" />
          <span>Work Experience ({experience.length})</span>
        </h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-500">
          No experience records yet. Add jobs, internships, or freelance roles.
        </div>
      ) : (
        experience.map((exp, idx) => (
          <div key={exp.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3 relative group">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="font-semibold text-xs text-gray-700">
                #{idx + 1} {exp.role || 'New Role'} {exp.company ? `@ ${exp.company}` : ''}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === experience.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemove(idx)}
                  className="p-1 text-gray-400 hover:text-red-500 ml-1"
                  title="Delete Position"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Job Title / Role *</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={e => handleUpdate(idx, 'role', e.target.value)}
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Company / Organization *</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={e => handleUpdate(idx, 'company', e.target.value)}
                  placeholder="e.g. Stripe"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Location</label>
                <input
                  type="text"
                  value={exp.location || ''}
                  onChange={e => handleUpdate(idx, 'location', e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Department / Team</label>
                <input
                  type="text"
                  value={exp.departmentOrTeam || ''}
                  onChange={e => handleUpdate(idx, 'departmentOrTeam', e.target.value)}
                  placeholder="e.g. Payments Platform Team"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Start Date *</label>
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={e => handleUpdate(idx, 'startDate', e.target.value)}
                  placeholder="e.g. Jan 2023"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">End Date *</label>
                <input
                  type="text"
                  value={exp.endDate}
                  onChange={e => handleUpdate(idx, 'endDate', e.target.value)}
                  placeholder="e.g. Present or Dec 2023"
                  className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Bullet Points */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-semibold text-gray-700">Achievement Bullets</span>
                <button
                  type="button"
                  onClick={() => handleAddBullet(idx)}
                  className="text-[10.5px] font-semibold text-sky-600 hover:text-sky-700"
                >
                  + Add Bullet
                </button>
              </div>

              <div className="space-y-1.5">
                {exp.bullets.map((b, bi) => (
                  <div key={bi} className="flex items-start gap-1.5">
                    <textarea
                      rows={2}
                      value={b}
                      onChange={e => handleBulletChange(idx, bi, e.target.value)}
                      placeholder="Start with a strong action verb (e.g., Developed, Reduced, Architected) and highlight quantifiable results..."
                      className="flex-1 p-1.5 text-xs bg-white border border-gray-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none leading-normal"
                    />

                    <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                      {onOpenAiEnhance && (
                        <button
                          type="button"
                          onClick={() => onOpenAiEnhance('bullet', b, `${exp.role} at ${exp.company}`)}
                          className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                          title="AI Improve Bullet"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(idx, bi)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                        title="Remove Bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
